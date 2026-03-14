# NextBank - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                                 │
│         (Web Browsers - Desktop & Mobile)                         │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Next.js Client  │
                    │   (React 19.2)    │
                    └─────────┬─────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐ ┌────▼─────┐ ┌────▼─────┐
         │  Dashboard  │ │ Transfers │ │ Support  │
         │   Pages     │ │ & History │ │ & Admin  │
         └──────┬──────┘ └────┬─────┘ └────┬─────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                ┌─────────────▼─────────────┐
                │   Next.js API Routes      │
                │   (/api/*)                │
                └─────────────┬─────────────┘
                              │
                ┌─────────────▼─────────────┐
                │   Business Logic Layer    │
                │   (lib/*.ts)              │
                │  • Authentication        │
                │  • Account Management    │
                │  • Transfers & Txns      │
                │  • Security & Fraud      │
                └─────────────┬─────────────┘
                              │
                ┌─────────────▼─────────────┐
                │  Supabase PostgreSQL      │
                │  • 10 Core Tables         │
                │  • RLS Policies           │
                │  • Audit Logs             │
                │  • Triggers & Indexes     │
                └───────────────────────────┘
```

---

## Frontend Architecture

### Page Structure

```
app/
├── (landing)              Public Pages
│   └── page.tsx           Homepage
├── (auth)
│   ├── register/          Registration flow
│   └── login/             Login form
├── (user)                 Protected Pages
│   ├── dashboard/         Main dashboard
│   ├── transfers/         Transfer operations
│   ├── transactions/      History view
│   ├── profile/           User settings
│   └── support/           Support tickets
└── (admin)                Admin section
    └── admin/             Admin dashboard
```

### Component Hierarchy

```
Layout (Root)
├── Navbar (Top Navigation)
│   ├── Logo
│   ├── Navigation Links
│   └── User Dropdown
├── Page Content
│   ├── AccountCard
│   ├── TransactionList
│   ├── Forms
│   │   ├── LoginForm
│   │   ├── RegisterForm
│   │   └── SupportTicketForm
│   └── Modals/Dialogs
└── Footer
```

### State Management

```
Client-Side State:
├── Form inputs (useState)
├── Loading states
├── UI toggles
└── Error messages

Server-Side State:
├── User session
├── Account data
├── Transaction history
└── Support tickets
```

---

## Backend Architecture

### API Layer

```
API Routes (/api)
├── /auth
│   ├── register          POST   Create account
│   ├── login             POST   Authenticate
│   └── logout            POST   Clear session
├── /accounts
│   ├── [id]              GET    Account details
│   └── (POST)            POST   Create account
├── /transfers
│   ├── [id]              GET    Transfer details
│   └── (POST)            POST   Initiate transfer
└── /support/tickets
    ├── [id]              GET    Ticket details
    └── (POST)            POST   Create ticket
```

### Business Logic Layer

```
lib/
├── auth.ts
│   ├── registerUser()
│   ├── loginUser()
│   ├── logoutUser()
│   └── getCurrentUser()
├── accounts.ts
│   ├── createAccount()
│   ├── getUserAccounts()
│   ├── getAccountBalance()
│   └── updateBalance()
├── transactions.ts
│   ├── createTransaction()
│   ├── getUserTransactions()
│   ├── getTransactionDetails()
│   └── updateTransactionStatus()
├── transfers.ts
│   ├── initiateTransfer()
│   ├── approveTransfer()
│   ├── completeTransfer()
│   └── getTransferStatus()
├── security.ts
│   ├── calculateFraudScore()
│   ├── validateTransaction()
│   ├── generateOTP()
│   ├── hashSensitiveData()
│   └── maskData()
└── supabase-client.ts
    ├── createClient()
    ├── defineTypes()
    └── setupSubscriptions()
```

---

## Database Architecture

### Database Schema

```
┌─────────────────────────────────────────┐
│              Users Table                │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ email (UNIQUE)                          │
│ password_hash                           │
│ full_name                               │
│ phone_number                            │
│ address                                 │
│ kyc_status                              │
│ created_at                              │
│ updated_at                              │
│ deleted_at (soft delete)                │
└──────────────┬──────────────────────────┘
               │ 1:N
               │
┌──────────────▼──────────────────────────┐
│         Bank Accounts Table             │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ user_id (FK → users)                    │
│ account_number (UNIQUE)                 │
│ account_type (enum)                     │
│ balance                                 │
│ currency                                │
│ is_primary                              │
│ is_active                               │
│ created_at                              │
└──────────────┬──────────────────────────┘
               │ 1:N
               │
┌──────────────▼──────────────────────────┐
│       Transactions Table                │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ account_id (FK)                         │
│ type (deposit/withdrawal/transfer)      │
│ amount                                  │
│ description                             │
│ status                                  │
│ merchant                                │
│ reference_number                        │
│ created_at                              │
└─────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         Transfers Table                 │
├──────────────────────────────────────────┤
│ id (PK)                                 │
│ from_account_id (FK → accounts)         │
│ to_account_id (FK → accounts)           │
│ amount                                  │
│ status (pending/approved/completed)     │
│ transfer_type (internal/external)       │
│ scheduled_date                          │
│ created_at                              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      Beneficiaries Table                │
├──────────────────────────────────────────┤
│ id (PK)                                 │
│ user_id (FK → users)                    │
│ account_id (FK → accounts)              │
│ bank_account_number                     │
│ bank_routing_number                     │
│ beneficiary_name                        │
│ is_verified                             │
│ created_at                              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│    Support Tickets Table                │
├──────────────────────────────────────────┤
│ id (PK)                                 │
│ user_id (FK → users)                    │
│ category                                │
│ priority (low/normal/high/urgent)       │
│ subject                                 │
│ description                             │
│ status (open/in_progress/resolved)      │
│ resolution_notes                        │
│ created_at                              │
│ updated_at                              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      Audit Logs Table                   │
├──────────────────────────────────────────┤
│ id (PK)                                 │
│ user_id (FK)                            │
│ action (login/transfer/account_create)  │
│ resource_type                           │
│ resource_id                             │
│ details (JSON)                          │
│ ip_address                              │
│ user_agent                              │
│ created_at                              │
└──────────────────────────────────────────┘

Additional Tables:
├── mfa_verifications (2FA setup)
├── sessions (Session management)
├── verification_tokens (Email verification)
└── password_reset_tokens (Password recovery)
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
└─────────────────────────────────────────┘

Layer 1: Network Security
├── HTTPS/TLS 1.3
├── CORS configuration
└── DDoS protection (Vercel)

Layer 2: Authentication
├── Password hashing (bcrypt)
├── Session tokens (JWT)
├── Two-factor authentication (2FA)
└── Refresh token rotation

Layer 3: Authorization
├── Row Level Security (RLS)
├── Role-based access control (RBAC)
├── Resource ownership verification
└── Permission checking

Layer 4: Data Protection
├── Encryption at rest (AES-256)
├── Encryption in transit (TLS)
├── Data masking (accounts, emails)
├── Sensitive data hashing
└── Secure cookies (httpOnly, secure)

Layer 5: Fraud Detection
├── Risk scoring (0-100)
├── Behavioral analysis
├── Anomaly detection
├── Velocity checking
└── Device fingerprinting (ready)

Layer 6: Audit & Logging
├── Comprehensive audit logs
├── Failed access attempts
├── Sensitive operation logging
├── Masked sensitive data in logs
└── Timestamped events
```

### Fraud Detection Flow

```
Transaction Initiated
         │
         ▼
1. Input Validation
   ├── Amount > 0
   ├── Accounts exist
   ├── User has permission
   └── Sufficient funds
         │
         ▼
2. Security Validation
   ├── Session valid
   ├── User not locked
   └── IP not blacklisted
         │
         ▼
3. Fraud Scoring
   ├── Large amount check (>$10k)
   ├── Rapid transaction check (<5min)
   ├── New beneficiary check
   ├── Unusual time check
   └── Geographic anomaly check
         │
         ▼
4. Risk Assessment
   ├── Low risk (0-25)    → Auto-approve
   ├── Medium risk (25-50) → 1-step verification
   ├── High risk (50-75)  → 2-step verification
   └── Critical (75-100)  → Manual review
         │
         ▼
5. Transaction Processing
   ├── Create transaction record
   ├── Update balances
   ├── Create audit log
   └── Send confirmation
```

---

## Data Flow Examples

### Registration Flow

```
User Input
  ↓
Frontend Validation
  ├─ Email format
  ├─ Password strength
  └─ Full name length
  ↓
API /auth/register
  ↓
Backend Validation (Zod)
  ├─ Email uniqueness
  ├─ Password requirements
  └─ Data completeness
  ↓
Hash Password (bcrypt)
  ↓
Create User Record
  ├─ Insert into users table
  ├─ Generate verification token
  └─ Send verification email
  ↓
Audit Log
  ↓
Return Success Response
```

### Transfer Flow

```
User Initiates Transfer
  ↓
Frontend Validation
  ├─ Amount > 0
  ├─ Recipient selected
  └─ Message provided
  ↓
API /transfers (POST)
  ↓
Check Session & Permissions
  ↓
Calculate Fraud Score
  ├─ Amount check
  ├─ Velocity check
  ├─ Beneficiary check
  └─ Time check
  ↓
Risk Assessment
  ├─ Low: Auto-approve
  ├─ Medium: Request OTP
  ├─ High: Request 2FA
  └─ Critical: Manual review
  ↓
Create Transfer Record
  ├─ Set status: pending/approved/completed
  ├─ Create transaction records
  └─ Update account balances
  ↓
Audit Log Entry
  ├─ Transfer created
  ├─ Risk score
  ├─ User IP
  └─ Timestamp
  ↓
Send Confirmation
  ├─ Email notification
  ├─ In-app notification
  └─ SMS (if enabled)
```

---

## Scaling Architecture

### Horizontal Scaling

```
Load Balancer (Vercel)
  ├─ Instance 1 (Node.js)
  ├─ Instance 2 (Node.js)
  ├─ Instance 3 (Node.js)
  └─ Instance N (Node.js)
        ↓
   Connection Pool (PgBouncer)
        ↓
   Supabase PostgreSQL (Replicated)
```

### Database Optimization

```
Indexes:
├─ users (email, id)
├─ bank_accounts (user_id, id)
├─ transactions (account_id, created_at)
├─ transfers (from_account_id, to_account_id)
└─ audit_logs (user_id, created_at)

Query Caching:
├─ Application-level caching
├─ Database result caching
└─ Browser caching (static assets)

Connection Pooling:
├─ PgBouncer for DB connections
├─ Connection reuse
└─ Reduced latency
```

---

## Deployment Architecture

```
┌────────────────────────┐
│   Developer (You)      │
│   ↓ git push main      │
└────────────┬───────────┘
             │
    ┌────────▼─────────┐
    │   GitHub Repo    │
    └────────┬─────────┘
             │
    ┌────────▼──────────┐
    │  Vercel Webhook   │
    └────────┬──────────┘
             │
   ┌─────────▼──────────────┐
   │  Build & Deploy       │
   │  (Next.js Compiler)   │
   └─────────┬──────────────┘
             │
   ┌─────────▼──────────────────┐
   │  Vercel Edge Network      │
   │  ├─ Edge Caching          │
   │  ├─ Global CDN            │
   │  └─ Instant Deploys       │
   └─────────┬──────────────────┘
             │
   ┌─────────▼──────────────────┐
   │  Next.js Application       │
   │  ├─ API Routes             │
   │  ├─ Server Components      │
   │  └─ Static Assets          │
   └─────────┬──────────────────┘
             │
   ┌─────────▼──────────────────┐
   │  Supabase Database         │
   │  ├─ PostgreSQL             │
   │  ├─ Backups                │
   │  └─ Replication            │
   └────────────────────────────┘
```

---

## Performance Metrics

### Target Performance

```
Metric              Target      Method
─────────────────────────────────────────
Page Load (TTI)     < 2.0s     Optimize bundles
First Contentful    < 1.0s     Minimize blocking
Paint
Time to Interactive < 3.0s     Code splitting
Database Query      < 100ms    Indexing
API Response        < 200ms    Efficient queries
Image Load          < 500ms    Optimization
```

### Performance Optimization

```
Frontend:
├─ Code splitting
├─ Image optimization
├─ CSS minification
├─ JavaScript compression
└─ Browser caching

Backend:
├─ Query optimization
├─ Database indexing
├─ Connection pooling
├─ Result caching
└─ Async operations

Infrastructure:
├─ Edge caching
├─ CDN distribution
├─ Compression (gzip, brotli)
└─ Minification
```

---

## Monitoring & Observability

```
┌─────────────────────────────┐
│   Monitoring Points         │
├─────────────────────────────┤
│ Frontend:                   │
│ ├─ Page load times          │
│ ├─ Error tracking           │
│ ├─ User interactions        │
│ └─ Performance metrics      │
│                             │
│ Backend:                    │
│ ├─ API response times       │
│ ├─ Database query times     │
│ ├─ Error rates              │
│ └─ Transaction success rate │
│                             │
│ Infrastructure:             │
│ ├─ CPU utilization          │
│ ├─ Memory usage             │
│ ├─ Disk I/O                 │
│ └─ Network bandwidth        │
│                             │
│ Security:                   │
│ ├─ Failed login attempts    │
│ ├─ Fraud alerts             │
│ ├─ Suspicious IPs           │
│ └─ Audit log events         │
└─────────────────────────────┘
```

---

## Summary

This architecture provides:

✅ **Scalability** - Horizontal scaling with stateless API layer
✅ **Security** - Multi-layered security from network to database
✅ **Reliability** - Fault tolerance and automatic failover
✅ **Performance** - Optimized queries, caching, and CDN
✅ **Maintainability** - Clear separation of concerns
✅ **Compliance** - Audit logging and regulatory compliance
✅ **Monitoring** - Comprehensive observability
✅ **Flexibility** - Easy to extend and customize

---

**Last Updated:** March 14, 2024
**Version:** 1.0.0
