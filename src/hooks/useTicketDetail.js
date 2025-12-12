import { useState, useEffect, useCallback } from 'react';
import { fetchTicketDetail, fetchFLD, updateTicket } from '../services/api';

export function useTicketDetail(ticketId) {
  const [ticket, setTicket] = useState(null);
  const [fldContent, setFldContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [fldLoading, setFldLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadTicket = useCallback(async () => {
    if (!ticketId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchTicketDetail(ticketId);
      if (response.success) {
        setTicket(response.ticket);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const loadFLD = useCallback(async () => {
    if (!ticketId) return;
    
    setFldLoading(true);
    
    try {
      const response = await fetchFLD(ticketId);
      if (response.success) {
        setFldContent(response.content);
      }
    } catch (err) {
      setFldContent('# Error loading FLD content\n\nUnable to load First Level Debug information.');
    } finally {
      setFldLoading(false);
    }
  }, [ticketId]);

  const update = useCallback(async (updates) => {
    if (!ticketId) return;
    
    setUpdating(true);
    
    try {
      const response = await updateTicket(ticketId, updates);
      if (response.success) {
        setTicket(response.ticket);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setUpdating(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
    loadFLD();
  }, [loadTicket, loadFLD]);

  return {
    ticket,
    fldContent,
    loading,
    fldLoading,
    error,
    updating,
    update,
    refetch: () => {
      loadTicket();
      loadFLD();
    }
  };
}
