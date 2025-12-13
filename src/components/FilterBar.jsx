import { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const states = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'in progress', label: 'In Progress' },
];

const severities = [
  { value: 'sev1', label: 'Sev1' },
  { value: 'sev2', label: 'Sev2' },
  { value: 'sev3', label: 'Sev3' },
  { value: 'sev4', label: 'Sev4' },
];

export function FilterBar({ filters, onChange, className }) {
  const [localFilters, setLocalFilters] = useState({
    state: filters.state || ['open', 'in progress'],
    severity: filters.severity || [],
    owner: filters.owner || '',
    search: filters.search || '',
  });

  const activeFilterCount = [
    Array.isArray(localFilters.state) && localFilters.state.length > 0,
    Array.isArray(localFilters.severity) && localFilters.severity.length > 0,
    localFilters.owner.length > 0,
    localFilters.search.length > 0,
  ].filter(Boolean).length;

  const handleApply = () => {
    // Convert arrays to comma-separated strings for API
    const apiFilters = {
      ...localFilters,
      state: Array.isArray(localFilters.state) && localFilters.state.length > 0
        ? localFilters.state.join(',')
        : undefined,
      severity: Array.isArray(localFilters.severity) && localFilters.severity.length > 0
        ? localFilters.severity.join(',')
        : undefined,
    };
    onChange(apiFilters);
  };

  const handleClear = () => {
    const cleared = {
      state: [],
      severity: [],
      owner: '',
      search: '',
    };
    setLocalFilters(cleared);
    onChange({
      state: undefined,
      severity: undefined,
      owner: '',
      search: '',
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const toggleState = (value) => {
    const newStates = localFilters.state.includes(value)
      ? localFilters.state.filter(s => s !== value)
      : [...localFilters.state, value];
    setLocalFilters({ ...localFilters, state: newStates });
  };

  const toggleSeverity = (value) => {
    const newSeverities = localFilters.severity.includes(value)
      ? localFilters.severity.filter(s => s !== value)
      : [...localFilters.severity, value];
    setLocalFilters({ ...localFilters, severity: newSeverities });
  };

  const getStateLabel = () => {
    if (!Array.isArray(localFilters.state) || localFilters.state.length === 0) {
      return 'All States';
    }
    if (localFilters.state.length === states.length) {
      return 'All States';
    }
    if (localFilters.state.length === 1) {
      return states.find(s => s.value === localFilters.state[0])?.label || 'States';
    }
    // Show comma-separated list for multiple selections
    return localFilters.state
      .map(val => states.find(s => s.value === val)?.label)
      .filter(Boolean)
      .join(', ');
  };

  const getSeverityLabel = () => {
    if (!Array.isArray(localFilters.severity) || localFilters.severity.length === 0) {
      return 'All Severities';
    }
    if (localFilters.severity.length === severities.length) {
      return 'All Severities';
    }
    if (localFilters.severity.length === 1) {
      return severities.find(s => s.value === localFilters.severity[0])?.label || 'Severities';
    }
    // Show comma-separated list for multiple selections
    return localFilters.severity
      .map(val => severities.find(s => s.value === val)?.label)
      .filter(Boolean)
      .join(', ');
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

        {/* State Filter - Multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[150px] justify-between bg-secondary border-border"
            >
              <span className="truncate">{getStateLabel()}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2 bg-popover border-border">
            <div className="space-y-2">
              {states.map((state) => (
                <div
                  key={state.value}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                  onClick={() => toggleState(state.value)}
                >
                  <Checkbox
                    checked={localFilters.state.includes(state.value)}
                    onCheckedChange={() => toggleState(state.value)}
                  />
                  <label className="flex-1 text-sm cursor-pointer">
                    {state.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Severity Filter - Multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[160px] justify-between bg-secondary border-border"
            >
              <span className="truncate">{getSeverityLabel()}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2 bg-popover border-border">
            <div className="space-y-2">
              {severities.map((severity) => (
                <div
                  key={severity.value}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                  onClick={() => toggleSeverity(severity.value)}
                >
                  <Checkbox
                    checked={localFilters.severity.includes(severity.value)}
                    onCheckedChange={() => toggleSeverity(severity.value)}
                  />
                  <label className="flex-1 text-sm cursor-pointer">
                    {severity.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

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