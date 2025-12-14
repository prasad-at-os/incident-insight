import { useState } from 'react';
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { StateBadge } from './StateBadge';
import { TagList } from './TagBadge';
import { TicketTableSkeleton } from './TicketTableSkeleton';
import { cn } from '@/lib/utils';

function formatAge(minutes) {
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export function TicketTable({ tickets, loading, onTicketClick, className }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'severity') {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      aVal = order[aVal] ?? 4;
      bVal = order[bVal] ?? 4;
    }
    
    if (sortConfig.key === 'state') {
      const order = { open: 0, investigating: 1, resolved: 2, closed: 3 };
      aVal = order[aVal] ?? 4;
      bVal = order[bVal] ?? 4;
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary" />
    );
  };

  if (loading) {
    return <TicketTableSkeleton rows={6} />;
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg border border-border">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No tickets found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Either all issues have been resolved or your filters are too restrictive. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th
              className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('ticket_id')}
            >
              <div className="flex items-center gap-1">
                Ticket ID
                <SortIcon column="ticket_id" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Subject
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('severity')}
            >
              <div className="flex items-center gap-1">
                Severity
                <SortIcon column="severity" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('state')}
            >
              <div className="flex items-center gap-1">
                State
                <SortIcon column="state" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Owner
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('age_minutes')}
            >
              <div className="flex items-center gap-1">
                Age
                <SortIcon column="age_minutes" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tags
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedTickets.map((ticket, index) => (
            <tr
              key={ticket.ticket_id}
              className="group hover:bg-accent/50 transition-colors table-row-animate cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onTicketClick(ticket.ticket_id)}
            >
              <td className="px-4 py-4">
                <button
                  className="font-mono text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTicketClick(ticket.ticket_id);
                  }}
                >
                  {ticket.ticket_id}
                </button>
              </td>
              <td className="px-4 py-4">
                <span
                  className="text-sm text-foreground max-w-md truncate block"
                  title={ticket.subject}
                >
                  {ticket.subject}
                </span>
              </td>
              <td className="px-4 py-4">
                <SeverityBadge severity={ticket.severity} />
              </td>
              <td className="px-4 py-4">
                <StateBadge state={ticket.state} />
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-muted-foreground">
                  {ticket.owner || '—'}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatAge(ticket.age_minutes)}
                </span>
              </td>
              <td className="px-4 py-4">
                <TagList tags={ticket.tags} maxVisible={2} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
