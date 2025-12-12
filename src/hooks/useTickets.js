import { useState, useEffect, useCallback } from 'react';
import { fetchTickets } from '../services/api';

export function useTickets(filters = {}) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchTickets(filters);
      if (response.success) {
        setTickets(response.tickets);
        setTotal(response.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return {
    tickets,
    loading,
    error,
    total,
    refetch: loadTickets
  };
}
