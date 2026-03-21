# Worthmate.ai - System Architecture

## High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend (Vercel)                                       │
│  - Landing Page                                                  │
│  - Authentication Pages                                          │
│  - Mentor Discovery & Listing                                    │
│  - Booking Flow                                                  │
│  - Video Call Interface                                          │
│  - Feedback Forms                                                │
│  - User Dashboard                                                │
│  - Admin Dashboard (stub)                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST API (HTTPS)
                       │ WebSockets (optional)
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Spring Boot Backend (Railway/AWS)                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ REST Controllers                                         │    │
│  │ - AuthController                                        │    │
│  │ - MentorController                                      │    │
│  │ - BookingController                                     │    │
│  │ - FeedbackController                                    │    │
│  │ - PaymentController                                     │    │
│  │ - AdminController                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Security Layer                                           │    │
│  │ - JWT Authentication Filter                            │    │
│  │ - Role-Based Access Control                            │    │
│  │ - CORS Configuration                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────┬─────────────┘
               │                                  │
               │ Database                        │ External APIs
               │ Queries                         │
┌──────────────▼────────────────────┐     ┌──────▼──────────────┐
│    SERVICE LAYER                   │     │ EXTERNAL SERVICES  │
├────────────────────────────────────┤     ├────────────────────┤
│ - UserService                      │     │ Agora.io           │
│ - AuthService                      │     │ (Video Calls)      │
│ - MentorService                    │     │                    │
│ - BookingService                   │     │ OpenAI API         │
│ - FeedbackService                  │     │ (Recommendations)  │
│ - RecommendationService (AI)       │     │                    │
│ - PaymentService                   │     │ Stripe             │
│ - EmailService                     │     │ (Payments)         │
│ - AgoraService                     │     │                    │
└──────────────┬────────────────────┘     │ SMTP Server        │
               │                          │ (Email)            │
               │ JPA/Hibernate            └────────────────────┘
               │
┌──────────────▼────────────────────────────────────────────────┐
│           DATA ACCESS LAYER (REPOSITORIES)                    │
├───────────────────────────────────────────────────────────────┤
│ - UserRepository                                              │
│ - MentorRepository                                            │
│ - BookingRepository                                           │
│ - FeedbackRepository                                          │
│ - RecommendationRepository                                    │
│ - PaymentRepository                                           │
│ - MentorAvailabilityRepository                               │
└──────────────┬──────────────────────────────────────────────┘
               │ JDBC
               │
┌──────────────▼──────────────────────────────────────────────┐
│          DATA LAYER - PostgreSQL (Railway/AWS RDS)          │
├───────────────────────────────────────────────────────────────┤
│ Tables:                                                       │
│ - users                    - feedback                         │
│ - mentors                  - recommendations                  │
│ - bookings                 - payments                         │
│ - calls                    - admin_users                      │
│ - specializations          - mentor_availability             │
│ - problem_categories                                          │
│                                                               │
│ Features:                                                     │
│ - Connection Pooling                                          │
│ - Automated Backups                                           │
│ - Replication (Production)                                    │
│ - Index Optimization                                          │
└───────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components Hierarchy

```
Root Layout
├── Navigation Component
├── Authentication Pages
│   ├── Login
│   └── Signup
├── Public Pages
│   ├── Landing Page
│   │   ├── Hero Section
│   │   ├── Features Section
│   │   ├── Stats Section
│   │   └── CTA Section
│   └── Mentors Page
│       ├── Sidebar Filters
│       │   ├── Search Input
│       │   ├── Sort Options
│       │   └── Expertise Filter
│       └── Mentors Grid
│           └── MentorCard (with recommendations)
├── Protected Pages
│   ├── Booking Flow
│   │   ├── Booking Details
│   │   └── Payment Form (Stripe)
│   ├── Confirmation Page
│   ├── Feedback Form
│   └── User Dashboard
└── Admin Pages
    ├── User Management
    ├── Mentor Verification
    └── Analytics Dashboard
```

### Backend Services Hierarchy

```
Spring Application
├── Controller Layer
│   ├── AuthController
│   ├── MentorController
│   ├── BookingController
│   ├── FeedbackController
│   ├── RecommendationController
│   ├── PaymentController
│   └── AdminController
│
├── Service Layer
│   ├── AuthService
│   │   ├── User Registration
│   │   ├── Login/Logout
│   │   └── Token Management
│   ├── MentorService
│   │   ├── Profile Management
│   │   ├── Availability Management
│   │   └── Rating Calculation
│   ├── BookingService
│   │   ├── Booking Creation
│   │   ├── Schedule Management
│   │   └── Cancellation Handling
│   ├── FeedbackService
│   │   ├── Feedback Submission
│   │   └── Analytics Calculation
│   ├── RecommendationService
│   │   ├── AI Recommendation Generation
│   │   ├── Success Rate Calculation
│   │   └── Caching Logic
│   ├── AgoraService
│   │   ├── Token Generation
│   │   └── Room Management
│   ├── PaymentService
│   │   ├── Payment Intent Creation
│   │   ├── Webhook Handling
│   │   └── Payout Processing
│   └── EmailService
│       ├── Confirmation Emails
│       ├── Reminder Emails
│       └── Notification Emails
│
├── Repository Layer
│   ├── UserRepository
│   ├── MentorRepository
│   ├── BookingRepository
│   ├── FeedbackRepository
│   ├── RecommendationRepository
│   ├── PaymentRepository
│   └── Caching Layer
│
├── Security Layer
│   ├── JwtTokenProvider
│   ├── JwtAuthenticationFilter
│   ├── CustomUserDetailsService
│   └── SecurityConfig
│
├── Exception Handling
│   ├── GlobalExceptionHandler
│   ├── Custom Exceptions
│   └── Error Response DTOs
│
└── Utilities
    ├── AgoraTokenGenerator
    ├── RecommendationEngine
    ├── ValidationUtils
    └── DateTimeUtils
```

## Data Flow Diagrams

### 1. User Signup & Authentication Flow

```
User
  │
  ├─ Sign Up [POST /api/auth/signup/user]
  │       │
  │       ├─ AuthController.signupUser()
  │       │       │
  │       ├─ Validate Input
  │       ├─ Hash Password (bcrypt)
  │       │
  │       ├─ AuthService.signupUser()
  │       │       │
  │       ├─ UserRepository.save(User)
  │       │       │
  │       └─ PostgreSQL (INSERT into users)
  │
  ├─ Response: JWT Token + Role
  │
  └─ Store in localStorage
```

### 2. Mentor Discovery & Booking Flow

```
User (Browser)
  │
  ├─ GET /api/mentors [with filters]
  │       │
  │       ├─ MentorController.getMentors()
  │       │       │
  │       ├─ MentorService.filterAndSort()
  │       │       │
  │       ├─ MentorRepository.findByFilters()
  │       │       │
  │       ├─ PostgreSQL (SELECT mentors, feedback)
  │       │       │
  │       ├─ For each mentor:
  │       │  ├─ Calculate average rating
  │       │  ├─ Get AI recommendation score
  │       │  │    │
  │       │  │    ├─ RecommendationService.generate()
  │       │  │    │       │
  │       │  │    ├─ Analyze similar feedbacks
  │       │  │    ├─ Call OpenAI GPT API
  │       │  │    └─ Cache result (1 hour)
  │       │  │
  │       │  └─ Format MentorResponse DTO
  │       │
  │       └─ Return list with recommendations
  │
  └─ Display mentor cards with AI scores
```

### 3. Booking & Payment Flow

```
User
  │
  ├─ POST /api/bookings [with booking details]
  │       │
  │       ├─ BookingController.createBooking()
  │       │       │
  │       ├─ BookingService.createBooking()
  │       │       │
  │       ├─ Validate slot availability
  │       ├─ Create Booking record
  │       │
  │       ├─ BookingRepository.save()
  │       │       │
  │       └─ PostgreSQL (INSERT into bookings)
  │
  ├─ Response: Booking ID + Agora Room Details
  │
  ├─ POST /api/payments [payment details]
  │       │
  │       ├─ PaymentController.createPayment()
  │       │       │
  │       ├─ PaymentService.createPaymentIntent()
  │       │       │
  │       ├─ Call Stripe API
  │       │       │
  │       └─ Store payment record
  │
  └─ Display confirmation with meeting link
```

### 4. Video Call & Feedback Flow

```
Users (Before Call)
  │
  ├─ GET /api/bookings/{bookingId}
  │       │
  │       └─ Get Agora room details
  │
  ├─ Join Agora Room using:
  │  ├─ Agora App ID
  │  ├─ Channel Name (roomId)
  │  └─ RTC Token (generated by backend)
  │
  └─ Video Call Begins
        │
        ├─ Call Status: ACTIVE
        │
        ├─ Call Ends
        │  │
        │  ├─ CallService.recordCallEnd()
        │  ├─ Update booking status: COMPLETED
        │  │
        │  └─ Send Notification Email
        │
        └─ Display Feedback Form
              │
              ├─ POST /api/feedback
              │       │
              │       ├─ FeedbackService.saveFeedback()
              │       │
              │       ├─ FeedbackRepository.save()
              │       │
              │       └─ Update mentor rating
              │
              └─ Trigger AI Recommendation Update
                    │
                    └─ RecommendationService.updateRecommendations()
```

### 5. AI Recommendation Generation

```
After Feedback Submitted
  │
  ├─ Check if enough data exists:
  │  └─ >= 3 similar consultations for mentor+category
  │
  ├─ RecommendationService.generateRecommendation()
  │       │
  │       ├─ FeedbackRepository.findSimilar()
  │       │       │
  │       │       └─ PostgreSQL (SELECT feedback WHERE...)
  │       │
  │       ├─ Calculate metrics:
  │       │  ├─ Success Rate = positive reviews / total reviews
  │       │  ├─ Call Count = number of similar calls
  │       │  └─ Base Score = success_rate * 100
  │       │
  │       ├─ OpenAI API Call:
  │       │  ├─ Prompt: feedback summary + metrics
  │       │  ├─ Model: GPT-4
  │       │  └─ Response: recommendation reason
  │       │
  │       ├─ Finalize Score (0-100):
  │       │  └─ Adjust based on sample size
  │       │
  │       ├─ RecommendationRepository.save()
  │       │       │
  │       │       └─ PostgreSQL (INSERT recommendations)
  │       │
  │       └─ Cache result (1 hour TTL)
  │
  └─ Next user sees recommendation for this mentor+category
```

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│         FRONTEND SECURITY LAYER                 │
├─────────────────────────────────────────────────┤
│ - HTTPS/TLS Only                               │
│ - HttpOnly Cookies (if used)                   │
│ - CSRF Token Validation                        │
│ - Input Validation                             │
│ - XSS Protection                               │
│ - Secure Token Storage                         │
└────────────────┬────────────────────────────────┘
                 │ Authenticated Request
                 │ Header: Authorization: Bearer {token}
                 │
┌────────────────▼────────────────────────────────┐
│         BACKEND SECURITY LAYER                  │
├─────────────────────────────────────────────────┤
│ 1. CORS Filter                                 │
│    └─ Only allow frontend domain               │
│                                                 │
│ 2. JWT Authentication Filter                   │
│    └─ Validate token signature & expiration    │
│                                                 │
│ 3. Authorization Filter                        │
│    └─ Check user roles and permissions         │
│                                                 │
│ 4. Input Validation                            │
│    └─ @Valid, custom validators                │
│                                                 │
│ 5. Rate Limiting                               │
│    └─ Prevent brute force attacks              │
│                                                 │
│ 6. SQL Injection Prevention                    │
│    └─ Parameterized queries with JPA           │
│                                                 │
│ 7. Password Hashing                            │
│    └─ BCrypt with salt                         │
│                                                 │
│ 8. HTTPS/TLS                                   │
│    └─ Encrypted in-transit                     │
│                                                 │
│ 9. Secure Headers                              │
│    └─ X-Frame-Options, CSP, etc.               │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│       DATABASE SECURITY LAYER                   │
├─────────────────────────────────────────────────┤
│ - Connection Pooling                           │
│ - Encrypted Connections (SSL)                  │
│ - Database User with Limited Permissions       │
│ - Automated Backups                            │
│ - Audit Logging                                │
└─────────────────────────────────────────────────┘
```

## Scalability Architecture

### Horizontal Scaling Strategy

```
Load Balancer (Nginx / AWS ALB)
        │
        ├─────────────────────────┬─────────────────────────┐
        │                         │                         │
    Backend 1              Backend 2                  Backend N
    (Spring Boot)          (Spring Boot)              (Spring Boot)
        │                         │                         │
        └─────────────────────────┴─────────────────────────┘
                              │
                    Connection Pool
                              │
                    PostgreSQL Primary
                        │
                        ├─ Read Replicas
                        │  ├─ Replica 1
                        │  └─ Replica 2
                        │
                        └─ Automated Backups
                              │
                           S3/Cloud Storage
```

### Caching Strategy

```
Request
  │
  ├─ Check Redis Cache (1 hour TTL)
  │  ├─ Mentor listings
  │  ├─ Recommendations
  │  └─ User profiles
  │
  ├─ Cache HIT: Return cached data
  │
  └─ Cache MISS:
      ├─ Query Database
      ├─ Process data
      ├─ Store in Redis
      └─ Return response
```

## Deployment Architecture

### Development Environment
```
Local Machine
├─ Frontend: localhost:3000 (pnpm dev)
├─ Backend: localhost:8080 (mvn spring-boot:run)
└─ Database: localhost:5432 (PostgreSQL)
```

### Production Environment
```
┌─────────────────────────────────────────────┐
│ Vercel (Frontend)                           │
│ - Next.js application                       │
│ - CDN for static assets                     │
│ - Automatic deployments                     │
│ - SSL/TLS certificates                      │
└─────────────────────────────────────────────┘
        │ REST API Calls
        │
┌───────▼─────────────────────────────────────┐
│ Railway / AWS (Backend)                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Spring Boot Application                 │ │
│ │ - Load balanced                         │ │
│ │ - Auto-scaling enabled                  │ │
│ │ - Health checks enabled                 │ │
│ └─────────────────────────────────────────┘ │
│         │ Database Queries
│         │
│ ┌───────▼─────────────────────────────────┐ │
│ │ PostgreSQL Database                     │ │
│ │ - Primary + Read Replicas              │ │
│ │ - Automated backups                     │ │
│ │ - WAL archiving                         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Error Handling & Resilience

```
Request Processing
    │
    ├─ Try: Process request
    │
    ├─ Catch: CustomException
    │    │
    │    ├─ ResourceNotFoundException
    │    ├─ UnauthorizedException
    │    ├─ ValidationException
    │    └─ ConflictException
    │
    ├─ GlobalExceptionHandler
    │    │
    │    └─ Return standardized error response
    │         with HTTP status code
    │
    └─ Log error and metrics
```

## Performance Optimization Strategies

1. **Database Level**
   - Indexed queries on frequently searched columns
   - Connection pooling (HikariCP)
   - Query optimization and analysis
   - Denormalization where beneficial

2. **Application Level**
   - Caching with TTL (Redis/in-memory)
   - Request pagination
   - Lazy loading of related entities
   - Asynchronous processing for heavy tasks

3. **Network Level**
   - CDN for static assets
   - Gzip compression
   - HTTP/2 protocol
   - Edge caching

4. **Frontend Level**
   - Code splitting and lazy loading
   - Image optimization
   - Component memoization
   - Request batching and deduplication

## Monitoring & Observability

```
Application Metrics
    │
    ├─ Spring Boot Actuator
    │  ├─ /actuator/health
    │  ├─ /actuator/metrics
    │  └─ /actuator/prometheus
    │
    ├─ Logging
    │  ├─ Application logs
    │  ├─ Access logs
    │  └─ Error tracking (Sentry)
    │
    ├─ Database Monitoring
    │  ├─ Query performance
    │  ├─ Connection pool stats
    │  └─ Replication lag
    │
    └─ Business Metrics
       ├─ Consultations count
       ├─ User signups
       ├─ Revenue
       └─ Customer satisfaction (ratings)
```

---

This architecture is designed for scalability, security, and maintainability, allowing the platform to grow from MVP to enterprise-grade service.

