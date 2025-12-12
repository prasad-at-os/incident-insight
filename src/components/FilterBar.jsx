import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const states = [
  { value: 'all', label: 'All States' },
  { value: 'open', label: 'Open' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const severities = [
  { value: 'all', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function FilterBar({ filters, onChange, className }) {
  const [localFilters, setLocalFilters] = useState({
    state: filters.state || 'all',
    severity: filters.severity || 'all',
    owner: filters.owner || '',
    search: filters.search || '',
  });

  const activeFilterCount = [
    localFilters.state !== 'all',
    localFilters.severity !== 'all',
    localFilters.owner.length > 0,
    localFilters.search.length > 0,
  ].filter(Boolean).length;

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleClear = () => {
    const cleared = {
      state: 'all',
      severity: 'all',
      owner: '',
      search: '',
    };
    setLocalFilters(cleared);
    onChange(cleared);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className={cn("p-4 bg-card rounded-lg border border-border", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={localFilters.search}
            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
            onKeyDown={handleKeyPress}
            className="pl-9 bg-secondary border-border"
          />
        </div>

        {/* State Filter */}
        <Select
          value={localFilters.state}
          onValueChange={(value) => setLocalFilters({ ...localFilters, state: value })}
        >
          <SelectTrigger className="w-[150px] bg-secondary border-border">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {states.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Severity Filter */}
        <Select
          value={localFilters.severity}
          onValueChange={(value) => setLocalFilters({ ...localFilters, severity: value })}
        >
          <SelectTrigger className="w-[160px] bg-secondary border-border">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {severities.map((severity) => (
              <SelectItem key={severity.value} value={severity.value}>
                {severity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Owner Filter */}
        <Input
          placeholder="Owner email..."
          value={localFilters.owner}
          onChange={(e) => setLocalFilters({ ...localFilters, owner: e.target.value })}
          onKeyDown={handleKeyPress}
          className="w-[180px] bg-secondary border-border"
        />

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Apply
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-foreground/20 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
