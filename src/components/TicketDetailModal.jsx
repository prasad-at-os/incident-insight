import { useState, useRef, useCallback, useEffect } from 'react';
import { X, ExternalLink, RefreshCw, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from './SeverityBadge';
import { StateBadge } from './StateBadge';
import { TagList } from './TagBadge';
import { MarkdownSection } from './MarkdownSection';
import { ResizableDivider } from './ResizableDivider';
import { useTicketDetail } from '../hooks/useTicketDetail';
import { cn } from '@/lib/utils';

function formatAge(minutes) {
  if (minutes < 60) return `${minutes} minutes ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
}

export function TicketDetailModal({ ticketId, onClose }) {
  const { ticket, fldContent, loading, fldLoading, error, refetch } = useTicketDetail(ticketId);
  const [topHeight, setTopHeight] = useState(40);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = topHeight;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.offsetHeight;
      const deltaY = e.clientY - startY;
      const deltaPercent = (deltaY / containerHeight) * 100;
      const newHeight = Math.max(20, Math.min(80, startHeight + deltaPercent));
      setTopHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [topHeight]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-card border-l border-border shadow-2xl modal-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                <div className="h-7 skeleton-shimmer rounded w-48" />
                <div className="h-5 skeleton-shimmer rounded w-96" />
              </div>
            ) : error ? (
              <div className="text-destructive">Error: {error}</div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-foreground font-mono">
                    {ticket?.ticket_id}
                  </h2>
                  {ticket?.otrs_url && (
                    <a
                      href={ticket.otrs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View in OTRS
                    </a>
                  )}
                </div>
                <h3 className="text-lg text-muted-foreground line-clamp-2">
                  {ticket?.subject}
                </h3>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={refetch}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Metadata Row */}
        {!loading && ticket && (
          <div className="px-6 py-4 border-b border-border bg-secondary/30">
            <div className="flex flex-wrap items-center gap-4">
              {/* State Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">State:</span>
                <StateBadge state={ticket.state} />
              </div>

              {/* Severity Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Severity:</span>
                <SeverityBadge severity={ticket.severity} />
              </div>

              {/* Owner */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {ticket.owner || 'Unassigned'}
                </span>
              </div>

              {/* Age */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatAge(ticket.age_minutes)}
                </span>
              </div>

              {/* Tags */}
              <TagList tags={ticket.tags} maxVisible={4} />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div ref={containerRef} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Ticket Description */}
          <div style={{ height: `${topHeight}%` }} className="flex-shrink-0 overflow-hidden border-b border-border">
            <MarkdownSection
              title="Ticket Description"
              icon="📋"
              content={ticket?.ticket_description || ''}
              loading={loading}
            />
          </div>

          {/* Resizable Divider */}
          <ResizableDivider onMouseDown={handleMouseDown} />

          {/* FLD Content */}
          <div style={{ height: `${100 - topHeight}%` }} className="flex-shrink-0 overflow-hidden">
            <MarkdownSection
              title="First Level Debug (FLD)"
              icon="🔍"
              content={fldContent}
              loading={fldLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
