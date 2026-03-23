# Worthmate.ai - Complete Spring Boot Backend Implementation Guide

## Project Overview

This is a complete Spring Boot REST API implementation for the Worthmate.ai consultation platform. The backend includes all 40+ endpoints across 8 resource groups with full authentication, payment processing, video call integration, and AI-powered recommendations.

## Technology Stack

- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Database**: PostgreSQL 14+
- **Build Tool**: Maven
- **Authentication**: JWT (JJWT)
- **Payment**: Stripe API
- **Video Calls**: Agora.io
- **API Documentation**: Swagger/OpenAPI 3.0

## Project Structure

```
backend/
├── src/main/java/com/worthmate/
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── MentorController.java
│   │   ├── BookingController.java
│   │   ├── FeedbackController.java
│   │   ├── PaymentController.java
│   │   ├── CallController.java
│   │   ├── RecommendationController.java
│   │   └── AdminController.java
│   │
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── MentorService.java
│   │   ├── BookingService.java
│   │   ├── FeedbackService.java
│   │   ├── PaymentService.java
│   │   ├── CallService.java
│   │   └── RecommendationService.java
│   │
│   ├── entity/
│   │   ├── User.java
│   │   ├── MentorProfile.java
│   │   ├── Booking.java
│   │   ├── Feedback.java
│   │   ├── Call.java
│   │   ├── Payment.java
│   │   ├── RecommendationScore.java
│   │   ├── Specialization.java
│   │   ├── Availability.java
│   │   └── [Enum classes]
│   │
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── MentorProfileRepository.java
│   │   ├── BookingRepository.java
│   │   ├── FeedbackRepository.java
│   │   ├── PaymentRepository.java
│   │   ├── CallRepository.java
│   │   ├── RecommendationScoreRepository.java
│   │   ├── SpecializationRepository.java
│   │   └── AvailabilityRepository.java
│   │
│   ├── dto/
│   │   ├── AuthRequest.java & AuthResponse.java
│   │   ├── UserDTO.java
│   │   ├── MentorDTO.java
│   │   ├── BookingDTO.java
│   │   ├── FeedbackDTO.java
│   │   ├── PaymentDTO.java
│   │   ├── CallDTO.java
│   │   ├── RecommendationDTO.java
│   │   └── AdminDTO.java
│   │
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   │
│   ├── config/
│   │   └── SecurityConfig.java
│   │
│   ├── exception/
│   │   ├── ResourceNotFoundException.java
│   │   ├── ResourceAlreadyExistsException.java
│   │   ├── InvalidCredentialsException.java
│   │   └── GlobalExceptionHandler.java
│   │
│   └── WorthmateApplication.java
│
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
│       └── V1__Initial_Schema.sql
│
└── pom.xml
```

## Setup Instructions

### 1. Prerequisites

```bash
# Check Java version (should be 17+)
java -version

# Check Maven version (should be 3.6+)
mvn -version

# PostgreSQL should be running
psql --version
```

### 2. Database Setup

```bash
# Login to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE worthmate;
CREATE USER worthmate_user WITH PASSWORD 'worthmate_password';
GRANT ALL PRIVILEGES ON DATABASE worthmate TO worthmate_user;
GRANT USAGE ON SCHEMA public TO worthmate_user;
GRANT CREATE ON SCHEMA public TO worthmate_user;
\q
```

### 3. Clone & Setup Project

```bash
# Navigate to backend folder
cd backend

# Update application.yml with your database credentials and API keys
# Edit src/main/resources/application.yml

# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

Application runs on: **http://localhost:8080**

API Documentation: **http://localhost:8080/swagger-ui.html**

### 4. Environment Configuration

Update `application.yml` with your actual credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/worthmate
    username: worthmate_user
    password: your_password

jwt:
  secret: your-32-character-secret-key-change-this
  
agora:
  app-id: your-agora-app-id
  app-certificate: your-agora-certificate

openai:
  api-key: your-openai-api-key

stripe:
  api-key: your-stripe-api-key
  webhook-secret: your-webhook-secret
```

## API Documentation

### Authentication Endpoints

```
POST   /api/auth/signup/user              - Register user
POST   /api/auth/signup/mentor            - Register mentor
POST   /api/auth/login                    - User login
POST   /api/auth/refresh                  - Refresh JWT token
POST   /api/auth/logout                   - User logout
```

### User Management

```
GET    /api/users/profile                 - Get current user
PUT    /api/users/profile                 - Update profile
GET    /api/users/{userId}                - Get user by ID
DELETE /api/users/account                 - Delete account
```

### Mentor Management

```
GET    /api/mentors                       - List mentors (with pagination)
GET    /api/mentors/{mentorId}            - Get mentor details
PUT    /api/mentors/{mentorId}            - Update mentor profile
GET    /api/mentors/{mentorId}/earnings   - Get earnings dashboard
GET    /api/mentors/{mentorId}/availability
GET    /api/mentors/{mentorId}/reviews
```

### Booking Management

```
POST   /api/bookings                      - Create booking
GET    /api/bookings                      - Get user bookings
GET    /api/bookings/{bookingId}          - Get booking details
PUT    /api/bookings/{bookingId}          - Update booking
DELETE /api/bookings/{bookingId}          - Cancel booking
GET    /api/bookings/mentor/{mentorId}    - Get mentor bookings
```

### Feedback & Ratings

```
POST   /api/feedback                      - Submit feedback
GET    /api/feedback/{bookingId}          - Get feedback
GET    /api/feedback/mentor/{mentorId}    - Get mentor feedbacks
```

### Payments

```
POST   /api/payments                      - Create payment intent
GET    /api/payments/{bookingId}          - Get payment status
POST   /api/payments/webhook              - Stripe webhook
POST   /api/payments/{paymentId}/refund   - Refund payment
```

### Video Calls

```
POST   /api/calls/generate-token          - Generate Agora token
GET    /api/calls/{bookingId}             - Get call details
POST   /api/calls/{bookingId}/start       - Start call
POST   /api/calls/{bookingId}/end         - End call
GET    /api/calls/{bookingId}/recording   - Get recording
```

### AI Recommendations

```
GET    /api/recommendations               - Get recommendations
POST   /api/recommendations/generate      - Generate recommendation
GET    /api/recommendations/mentor/{mentorId}/category/{categoryId}
```

### Admin Dashboard

```
GET    /api/admin/users                   - List users
GET    /api/admin/mentors                 - List mentors
PUT    /api/admin/mentors/{mentorId}/verify
DELETE /api/admin/users/{userId}
GET    /api/admin/analytics               - Platform analytics
GET    /api/admin/disputes                - Get disputes
```

## Testing with cURL

### 1. User Signup

```bash
curl -X POST "http://localhost:8080/api/auth/signup/user" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=user@example.com&password=Password123&firstName=John&lastName=Doe&phoneNumber=1234567890"
```

### 2. User Login

```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=user@example.com&password=Password123"
```

### 3. Get Mentors

```bash
curl -X GET "http://localhost:8080/api/mentors?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Create Booking

```bash
curl -X POST "http://localhost:8080/api/bookings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "mentorId=MENTOR_ID&specializationId=SPEC_ID&scheduledTime=2024-12-25T10:00:00&durationMinutes=60"
```

## Key Features Implemented

### 1. JWT Authentication
- Stateless token-based authentication
- 15-minute access token expiry
- 7-day refresh token expiry
- Role-based access control (USER, MENTOR, ADMIN)

### 2. Database
- 11 core tables with proper relationships
- UUID primary keys
- Automatic timestamp management
- Enum-based status tracking
- Flyway migrations

### 3. Payment Processing
- Stripe integration
- Payment intent creation
- Webhook handling
- Refund processing

### 4. Video Calls
- Agora.io token generation
- Call tracking and recording
- Duration measurement

### 5. AI Recommendations
- Feedback analysis
- Success rate calculation
- Weighted scoring algorithm
- AI-generated reasoning

### 6. Error Handling
- Global exception handler
- Custom exception classes
- Validation error handling
- Proper HTTP status codes

## Deployment

### Local Deployment
```bash
mvn spring-boot:run
```

### Production Deployment (Docker)

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/worthmate-api-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8080
```

```bash
# Build image
docker build -t worthmate-api:1.0.0 .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/worthmate \
  -e JWT_SECRET=your-secret \
  -e STRIPE_API_KEY=your-key \
  worthmate-api:1.0.0
```

### Cloud Deployment (Railway/AWS)

1. Push to GitHub
2. Connect repository to Railway/AWS
3. Set environment variables
4. Deploy automatically

## Security Best Practices

✅ Password hashing with BCrypt  
✅ JWT token validation  
✅ Role-based access control  
✅ CORS configuration  
✅ SQL injection prevention (JPA)  
✅ Input validation  
✅ Exception handling  
✅ Secure headers  

## Performance Optimization

- Connection pooling (HikariCP)
- Query optimization with JPA
- Caching layer (Redis ready)
- Pagination support
- Index optimization in DB

## Monitoring & Logging

- SLF4J logging
- Debug logging for development
- Application metrics ready
- Error tracking ready

## Next Steps

1. **Setup development environment** - Follow setup instructions
2. **Run database migrations** - Flyway auto-runs on startup
3. **Test API endpoints** - Use Swagger UI or cURL
4. **Configure integrations** - Stripe, Agora, OpenAI
5. **Deploy to cloud** - Railway, AWS, or DigitalOcean

## Support & Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -i :8080
kill -9 <PID>
```

**Database connection failed:**
- Verify PostgreSQL is running
- Check credentials in application.yml
- Ensure database exists

**JWT validation failed:**
- Ensure Authorization header format: `Bearer <token>`
- Check token expiry
- Verify secret key matches

## Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Stripe API](https://stripe.com/docs/api)
- [Agora.io Docs](https://docs.agora.io)
- [OpenAPI/Swagger](https://swagger.io)

---

**Project Complete!** All 40+ API endpoints are implemented and ready for integration with the React frontend.
