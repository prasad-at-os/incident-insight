// API service for On-Call Debugger Dashboard
// Connects to backend API at http://localhost:3000/api

export const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/http://148.251.11.184:3000/api';

/**
 * Fetch tickets with optional filters
 * @param {Object} filters - Filter parameters (state, severity, owner, limit, offset, search)
 * @returns {Promise<Object>} Response with tickets array and metadata
 */
export async function fetchTickets(filters = {}) {
  try {
    const params = new URLSearchParams();

    // Add filters to query params
    if (filters.state && filters.state !== 'all') {
      params.append('state', filters.state);
    }
    if (filters.severity && filters.severity !== 'all') {
      params.append('severity', filters.severity);
    }
    if (filters.owner) {
      params.append('owner', filters.owner);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }
    if (filters.offset) {
      params.append('offset', filters.offset);
    }

    const url = `${API_BASE_URL}/tickets${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Apply client-side search filter if needed (since backend doesn't have search endpoint)
    let tickets = data.tickets || [];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tickets = tickets.filter(t =>
        t.ticket_id.toLowerCase().includes(searchLower) ||
        t.subject.toLowerCase().includes(searchLower)
      );
    }

    return {
      success: data.success !== false,
      tickets,
      total: tickets.length,
      limit: data.limit || 50,
      offset: data.offset || 0
    };
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

/**
 * Fetch details for a specific ticket
 * @param {string} ticketId - The ticket ID to fetch
 * @returns {Promise<Object>} Response with ticket details
 */
export async function fetchTicketDetail(ticketId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ticket not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      ticket: data.ticket
    };
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Fetch FLD (First Level Debug) content for a ticket
 * @param {string} ticketId - The ticket ID
 * @returns {Promise<Object>} Response with markdown content
 */
export async function fetchFLD(ticketId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/fld`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: true,
          content: '# No FLD content available\n\nFirst Level Debug information has not been generated for this ticket yet.'
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      content: data.content || '# No FLD content available\n\nFirst Level Debug information has not been generated for this ticket yet.'
    };
  } catch (error) {
    console.error(`Error fetching FLD for ticket ${ticketId}:`, error);
    // Return fallback content instead of throwing
    return {
      success: false,
      content: '# Error Loading FLD\n\nUnable to load First Level Debug information. Please try again later.'
    };
  }
}

/**
 * Update a ticket's fields
 * @param {string} ticketId - The ticket ID to update
 * @param {Object} updates - Fields to update (state, severity, owner, resolution_summary, etc.)
 * @returns {Promise<Object>} Response with updated ticket
 */
export async function updateTicket(ticketId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ticket not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success !== false,
      ticket: data.ticket
    };
  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    throw error;
  }
}