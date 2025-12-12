import { useState } from 'react';
import { AlertCircle, Terminal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterBar } from '../components/FilterBar';
import { TicketTable } from '../components/TicketTable';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { Pagination } from '../components/Pagination';
import { useTickets } from '../hooks/useTickets';
import { Toaster } from 'sonner';

export default function Index() {
  const [filters, setFilters] = useState({
    state: 'all',
    severity: 'all',
    owner: '',
    search: '',
    limit: 10,
    offset: 0,
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  const { tickets, loading, error, total, refetch } = useTickets(filters);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, offset: 0 });
  };

  const handlePageChange = (newOffset) => {
    setFilters({ ...filters, offset: newOffset });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  On-Call Debugger Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and debug production issues
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critical', count: tickets.filter(t => t.severity === 'critical').length, color: 'text-severity-critical' },
            { label: 'Open', count: tickets.filter(t => t.state === 'open').length, color: 'text-state-open' },
            { label: 'Investigating', count: tickets.filter(t => t.state === 'investigating').length, color: 'text-state-investigating' },
            { label: 'Total', count: total, color: 'text-foreground' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-card rounded-lg border border-border">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {loading ? '—' : stat.count}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
        />

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <div className="font-medium">Failed to load tickets</div>
              <div className="text-sm opacity-80">{error}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="ml-auto text-destructive hover:text-destructive"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <TicketTable
            tickets={tickets}
            loading={loading}
            onTicketClick={setSelectedTicketId}
          />
          
          {!loading && tickets.length > 0 && (
            <div className="border-t border-border px-4">
              <Pagination
                total={total}
                limit={filters.limit}
                offset={filters.offset}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
  );
}
