// Mock data for development
// When copying to local environment, replace these functions with real fetch calls
// to http://localhost:3000/api endpoints

const MOCK_TICKETS = [
  {
    ticket_id: "TICKET-001",
    subject: "API Gateway Timeout - Users Unable to Login",
    ticket_description: "Users are experiencing 504 Gateway Timeout errors when attempting to login through the main authentication endpoint. This appears to have started at approximately 14:30 UTC. Multiple reports from users across different regions.",
    state: "open",
    severity: "critical",
    owner: "alice@example.com",
    age_minutes: 45,
    tags: ["api", "gateway", "auth", "login"],
    otrs_url: "https://notion.so/ticket-001",
    fld_path: "data/tickets/TICKET-001.md",
    fld_generated_at: "2025-01-15T14:30:00.000Z",
    created_at: "2025-01-15T14:00:00.000Z",
    updated_at: "2025-01-15T14:45:00.000Z",
    resolved_at: null,
    resolution_summary: null
  },
  {
    ticket_id: "TICKET-002",
    subject: "Database Connection Pool Exhausted",
    ticket_description: "Production database connection pool is reaching maximum capacity during peak hours, causing slow response times and occasional connection failures.",
    state: "investigating",
    severity: "high",
    owner: "bob@example.com",
    age_minutes: 120,
    tags: ["database", "performance", "connection-pool"],
    otrs_url: "https://notion.so/ticket-002",
    fld_path: "data/tickets/TICKET-002.md",
    fld_generated_at: "2025-01-15T12:30:00.000Z",
    created_at: "2025-01-15T12:00:00.000Z",
    updated_at: "2025-01-15T13:00:00.000Z",
    resolved_at: null,
    resolution_summary: null
  },
  {
    ticket_id: "TICKET-003",
    subject: "Memory Leak in Payment Service",
    ticket_description: "Payment processing service is experiencing gradual memory increase, requiring restarts every 6 hours to prevent OOM kills.",
    state: "open",
    severity: "high",
    owner: "charlie@example.com",
    age_minutes: 1440,
    tags: ["memory", "payment", "service"],
    otrs_url: "https://notion.so/ticket-003",
    fld_path: "data/tickets/TICKET-003.md",
    fld_generated_at: "2025-01-14T14:00:00.000Z",
    created_at: "2025-01-14T14:00:00.000Z",
    updated_at: "2025-01-15T10:00:00.000Z",
    resolved_at: null,
    resolution_summary: null
  },
  {
    ticket_id: "TICKET-004",
    subject: "Redis Cache Eviction Rate Too High",
    ticket_description: "Observing unusually high cache eviction rate on Redis cluster, impacting application performance and causing increased database load.",
    state: "resolved",
    severity: "medium",
    owner: "diana@example.com",
    age_minutes: 2880,
    tags: ["redis", "cache", "performance"],
    otrs_url: "https://notion.so/ticket-004",
    fld_path: "data/tickets/TICKET-004.md",
    fld_generated_at: "2025-01-13T14:00:00.000Z",
    created_at: "2025-01-13T14:00:00.000Z",
    updated_at: "2025-01-14T10:00:00.000Z",
    resolved_at: "2025-01-14T10:00:00.000Z",
    resolution_summary: "Increased cache memory allocation from 4GB to 8GB"
  },
  {
    ticket_id: "TICKET-005",
    subject: "SSL Certificate Expiring in 7 Days",
    ticket_description: "Main domain SSL certificate will expire on 2025-01-22. Need to renew before expiration to avoid service disruption.",
    state: "open",
    severity: "medium",
    owner: null,
    age_minutes: 180,
    tags: ["security", "ssl", "certificate"],
    otrs_url: null,
    fld_path: "data/tickets/TICKET-005.md",
    fld_generated_at: "2025-01-15T11:00:00.000Z",
    created_at: "2025-01-15T11:00:00.000Z",
    updated_at: "2025-01-15T11:00:00.000Z",
    resolved_at: null,
    resolution_summary: null
  },
  {
    ticket_id: "TICKET-006",
    subject: "S3 Bucket Access Denied Errors",
    ticket_description: "Image upload service receiving 403 Forbidden errors when attempting to write to S3 bucket. Users unable to upload profile pictures.",
    state: "investigating",
    severity: "critical",
    owner: "eve@example.com",
    age_minutes: 30,
    tags: ["s3", "aws", "storage", "permissions"],
    otrs_url: "https://notion.so/ticket-006",
    fld_path: "data/tickets/TICKET-006.md",
    fld_generated_at: "2025-01-15T14:15:00.000Z",
    created_at: "2025-01-15T14:15:00.000Z",
    updated_at: "2025-01-15T14:30:00.000Z",
    resolved_at: null,
    resolution_summary: null
  },
  {
    ticket_id: "TICKET-007",
    subject: "Monitoring Alert: High CPU Usage",
    ticket_description: "Web server cluster showing sustained CPU usage above 85% threshold for extended periods.",
    state: "closed",
    severity: "low",
    owner: "frank@example.com",
    age_minutes: 4320,
    tags: ["monitoring", "cpu", "infrastructure"],
    otrs_url: "https://notion.so/ticket-007",
    fld_path: "data/tickets/TICKET-007.md",
    fld_generated_at: "2025-01-12T14:00:00.000Z",
    created_at: "2025-01-12T14:00:00.000Z",
    updated_at: "2025-01-13T09:00:00.000Z",
    resolved_at: "2025-01-13T09:00:00.000Z",
    resolution_summary: "False alarm - CPU spike was due to scheduled backup task"
  },
  {
    ticket_id: "TICKET-008",
    subject: "Kubernetes Pod CrashLoopBackOff",
    ticket_description: "Multiple pods in the order-service deployment are stuck in CrashLoopBackOff state. Orders not being processed.",
    state: "open",
    severity: "critical",
    owner: "alice@example.com",
    age_minutes: 15,
    tags: ["kubernetes", "pods", "orders"],
    otrs_url: "https://notion.so/ticket-008",
    fld_path: "data/tickets/TICKET-008.md",
    fld_generated_at: "2025-01-15T14:40:00.000Z",
    created_at: "2025-01-15T14:40:00.000Z",
    updated_at: "2025-01-15T14:45:00.000Z",
    resolved_at: null,
    resolution_summary: null
  }
];

const MOCK_FLD_CONTENT = {
  "TICKET-001": `# First Level Debug - API Gateway Timeout

## Symptoms
- Users reporting "504 Gateway Timeout" errors
- Primarily affecting /api/auth/login endpoint
- Started at approximately 14:30 UTC
- Affects ~30% of login attempts

## Investigation Steps Taken

### 1. Check Gateway Logs
\`\`\`bash
kubectl logs -n production gateway-pod-xyz --tail=100
\`\`\`

Found multiple timeout errors:
- Backend service not responding within 30s timeout
- Connection pool exhausted

### 2. Backend Service Health
\`\`\`bash
curl http://auth-service:8080/health
\`\`\`

Response: Slow (5s response time)

### 3. Database Connection Status
- Active connections: 95/100
- Slow query detected: SELECT * FROM users WHERE email = ?
- Missing index on email column

## Root Cause Hypothesis
Database connection pool exhaustion due to slow queries lacking proper indexes.

## Recommended Actions
1. Add index on users.email column
2. Increase connection pool size from 100 to 200
3. Implement query timeout of 5s
4. Add connection pool monitoring alerts`,

  "TICKET-002": `# First Level Debug - Database Connection Pool

## Current Metrics
- Pool size: 100 connections
- Active: 95
- Idle: 5
- Wait time: 500ms average

## Analysis
Connection pool is undersized for current load. Peak traffic causing wait queue buildup.

## Recommendations
1. Increase pool size to 200
2. Add connection health checks
3. Implement circuit breaker pattern`,

  "TICKET-003": `# First Level Debug - Memory Leak

## Memory Profile
- Start: 512MB
- After 6h: 2.1GB
- Rate: ~280MB/hour

## Heap Analysis
\`\`\`
Top Memory Consumers:
- TransactionCache: 45%
- EventListeners: 30%
- HTTP Connections: 15%
\`\`\`

## Suspects
- Event listeners not being removed on disconnect
- Large object caching without TTL limits

## Recommendations
1. Implement proper cleanup in disconnect handlers
2. Add TTL to transaction cache
3. Enable memory profiling in staging`,

  "TICKET-004": `# First Level Debug - Redis Cache

## Eviction Stats
- Evicted keys: 15,000/hour
- Hit rate: 65% (target: 90%)
- Memory used: 3.8GB / 4GB

## Root Cause
Cache memory insufficient for working set size.

## Resolution Applied
- Increased Redis memory from 4GB to 8GB
- Verified eviction rate dropped to normal levels
- Hit rate improved to 92%`,

  "TICKET-005": `# First Level Debug - SSL Certificate

## Certificate Info
\`\`\`
Domain: app.example.com
Issuer: Let's Encrypt
Expires: 2025-01-22
Days remaining: 7
\`\`\`

## Action Required
Run certbot renewal process:
\`\`\`bash
sudo certbot renew --cert-name app.example.com
\`\`\`

## Post-Renewal Steps
1. Reload nginx configuration
2. Verify certificate validity
3. Update monitoring for new expiry date`,

  "TICKET-006": `# First Level Debug - S3 Access Denied

## Error Details
\`\`\`json
{
  "Code": "AccessDenied",
  "Message": "User: arn:aws:iam::123456789:user/image-service is not authorized to perform: s3:PutObject"
}
\`\`\`

## IAM Policy Check
Current policy missing:
- s3:PutObject
- s3:PutObjectAcl

## Fix Required
Update IAM role with correct S3 write permissions:
\`\`\`json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:PutObjectAcl"],
  "Resource": "arn:aws:s3:::user-uploads/*"
}
\`\`\``,

  "TICKET-007": `# First Level Debug - High CPU

## CPU Usage Timeline
- 14:00 - 45% (normal)
- 14:30 - 87% (spike)
- 16:00 - 94% (peak)
- 16:30 - 42% (normal)

## Correlation
Spike aligned with scheduled database backup:
\`\`\`
0 14 * * * /scripts/backup.sh
\`\`\`

## Resolution
Confirmed false alarm. Rescheduled backup to 03:00 UTC (off-peak).`,

  "TICKET-008": `# First Level Debug - CrashLoopBackOff

## Pod Status
\`\`\`bash
kubectl get pods -n production | grep order-service
order-service-abc12   0/1     CrashLoopBackOff   5          12m
order-service-def34   0/1     CrashLoopBackOff   4          12m
\`\`\`

## Container Logs
\`\`\`
Error: Connection refused to kafka:9092
FATAL: Unable to establish connection to message broker
\`\`\`

## Root Cause
Kafka broker restarted, pods failed to reconnect.

## Immediate Actions
1. Check Kafka cluster health
2. Restart order-service deployment
3. Implement retry with exponential backoff`
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTickets(filters = {}) {
  await delay(500);

  let filtered = [...MOCK_TICKETS];

  if (filters.state && filters.state !== 'all') {
    filtered = filtered.filter(t => t.state === filters.state);
  }
  if (filters.severity && filters.severity !== 'all') {
    filtered = filtered.filter(t => t.severity === filters.severity);
  }
  if (filters.owner) {
    filtered = filtered.filter(t => t.owner?.toLowerCase().includes(filters.owner.toLowerCase()));
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.ticket_id.toLowerCase().includes(searchLower) ||
      t.subject.toLowerCase().includes(searchLower)
    );
  }

  const limit = parseInt(filters.limit) || 50;
  const offset = parseInt(filters.offset) || 0;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    success: true,
    tickets: paginated,
    total: filtered.length,
    limit,
    offset
  };
}

export async function fetchTicketDetail(ticketId) {
  await delay(300);
  const ticket = MOCK_TICKETS.find(t => t.ticket_id === ticketId);

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  return {
    success: true,
    ticket
  };
}

export async function fetchFLD(ticketId) {
  await delay(400);
  const content = MOCK_FLD_CONTENT[ticketId] || '# No FLD content available\n\nFirst Level Debug information has not been generated for this ticket yet.';

  return {
    success: true,
    content
  };
}

export async function updateTicket(ticketId, updates) {
  await delay(300);
  const ticketIndex = MOCK_TICKETS.findIndex(t => t.ticket_id === ticketId);

  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }

  MOCK_TICKETS[ticketIndex] = {
    ...MOCK_TICKETS[ticketIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };

  return {
    success: true,
    ticket: MOCK_TICKETS[ticketIndex]
  };
}
