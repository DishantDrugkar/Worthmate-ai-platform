# Worthmate.ai - Spring Boot Backend Setup Guide

## Overview
This document provides complete instructions for setting up the Spring Boot backend for the Worthmate.ai platform, including database schema, API endpoints, and deployment instructions.

## Technology Stack
- **Framework**: Spring Boot 3.1+
- **Language**: Java 17+
- **Database**: PostgreSQL 14+
- **Build Tool**: Maven
- **Authentication**: JWT (JSON Web Tokens)
- **Video Call**: Agora.io REST API
- **AI Integration**: OpenAI ChatGPT API

## Prerequisites
- Java 17 or higher
- PostgreSQL 14 or higher
- Maven 3.6+
- Git
- API Keys: OpenAI, Agora.io, Stripe (if using payments)

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'MENTOR', 'ADMIN')),
    profile_image_url VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Mentors Table
```sql
CREATE TABLE mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    years_of_experience INT,
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    linkedin_url VARCHAR(500),
    website_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    availability_status VARCHAR(50) DEFAULT 'AVAILABLE'
);

CREATE INDEX idx_mentors_user_id ON mentors(user_id);
CREATE INDEX idx_mentors_verified ON mentors(is_verified);
```

### 3. Specializations Table
```sql
CREATE TABLE specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_specializations_mentor_id ON specializations(mentor_id);
CREATE INDEX idx_specializations_name ON specializations(specialization);
```

### 4. Problem Categories Table
```sql
CREATE TABLE problem_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO problem_categories (name, description) VALUES
    ('Career Growth', 'Career advancement and professional development'),
    ('Startup & Fundraising', 'Starting a business and raising capital'),
    ('Technical Skills', 'Improving technical programming skills'),
    ('Leadership & Management', 'Leadership and team management'),
    ('Business Strategy', 'Business strategy and planning'),
    ('Other', 'Other topics');
```

### 5. Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE SET NULL,
    problem_category_id UUID NOT NULL REFERENCES problem_categories(id),
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED' CHECK (
        status IN ('SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')
    ),
    problem_description TEXT,
    agora_room_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_mentor_id ON bookings(mentor_id);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### 6. Calls Table
```sql
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    agora_room_id VARCHAR(255) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_seconds INT,
    call_quality VARCHAR(50),
    recording_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calls_booking_id ON calls(booking_id);
CREATE INDEX idx_calls_agora_room_id ON calls(agora_room_id);
```

### 7. Feedback Table
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    would_recommend BOOLEAN,
    improvement_areas TEXT,
    recommended_for_others BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_booking_id ON feedback(booking_id);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_mentor_id ON feedback(mentor_id);
```

### 8. Recommendations Table
```sql
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    problem_category_id UUID NOT NULL REFERENCES problem_categories(id),
    recommendation_score INT NOT NULL CHECK (recommendation_score >= 0 AND recommendation_score <= 100),
    recommendation_reason TEXT,
    similar_calls_count INT DEFAULT 0,
    success_rate DECIMAL(5, 2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_mentor_id ON recommendations(mentor_id);
CREATE INDEX idx_recommendations_active ON recommendations(is_active);
```

### 9. Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')
    ),
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 10. Admin Users Table
```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
```

### 11. Mentor Availability Table
```sql
CREATE TABLE mentor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone VARCHAR(50),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mentor_availability_mentor_id ON mentor_availability(mentor_id);
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup/user` - User registration ✅
- `POST /api/auth/signup/mentor` - Mentor registration ✅
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Endpoints
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{userId}` - Get user public profile
- `DELETE /api/users/account` - Delete user account

### Mentor Endpoints
- `GET /api/mentors` - List all mentors with filters (pagination, expertise, rating)
- `GET /api/mentors/{mentorId}` - Get mentor details with reviews
- `GET /api/mentors/{mentorId}/availability` - Get mentor availability
- `PUT /api/mentors/{mentorId}` - Update mentor profile (mentors only)
- `GET /api/mentors/{mentorId}/reviews` - Get mentor reviews
- `GET /api/mentors/{mentorId}/earnings` - Get mentor earnings (mentors only)

### Booking Endpoints
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get user's bookings with filters
- `GET /api/bookings/{bookingId}` - Get booking details
- `PUT /api/bookings/{bookingId}` - Update booking (cancel)
- `GET /api/mentors/{mentorId}/bookings` - Get mentor's bookings

### Feedback Endpoints
- `POST /api/feedback` - Submit feedback for completed call
- `GET /api/feedback/{bookingId}` - Get feedback for specific booking
- `GET /api/mentors/{mentorId}/feedback` - Get all feedback for a mentor

### Recommendation Endpoints
- `GET /api/recommendations` - Get AI recommendations for user
- `POST /api/recommendations/generate` - Generate recommendations (triggered after feedback)
- `GET /api/recommendations/mentor/{mentorId}/category/{categoryId}` - Get recommendation score

### Payment Endpoints
- `POST /api/payments` - Create payment intent (Stripe)
- `GET /api/payments/{bookingId}` - Get payment status
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/mentors` - List all mentors with verification status
- `PUT /api/admin/mentors/{mentorId}/verify` - Verify mentor
- `DELETE /api/admin/users/{userId}` - Delete user
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/disputes` - Get pending disputes

## Spring Boot Project Structure

```
worthmate-backend/
├── src/main/java/com/worthmate/
│   ├── WorthmateApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── AgoraConfig.java
│   │   ├── OpenAIConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── MentorController.java
│   │   ├── BookingController.java
│   │   ├── FeedbackController.java
│   │   ├── RecommendationController.java
│   │   ├── PaymentController.java
│   │   └── AdminController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── MentorService.java
│   │   ├── BookingService.java
│   │   ├── FeedbackService.java
│   │   ├── RecommendationService.java
│   │   ├── AgoraService.java
│   │   ├── PaymentService.java
│   │   └── EmailService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── MentorRepository.java
│   │   ├── BookingRepository.java
│   │   ├── FeedbackRepository.java
│   │   ├── RecommendationRepository.java
│   │   └── PaymentRepository.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Mentor.java
│   │   ├── Booking.java
│   │   ├── Feedback.java
│   │   ├── Recommendation.java
│   │   └── Payment.java
│   ├── dto/
│   │   ├── SignupRequest.java
│   │   ├── LoginRequest.java
│   │   ├── BookingRequest.java
│   │   ├── FeedbackRequest.java
│   │   └── MentorResponse.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── UnauthorizedException.java
│   └── util/
│       ├── AgoraTokenGenerator.java
│       └── RecommendationEngine.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   ├── db/migration/ (Flyway migrations)
│   │   ├── V1__Initial_Schema.sql
│   │   ├── V2__Add_Constraints.sql
│   │   └── ...
├── pom.xml
└── README.md
```

## Key Environment Variables

```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/worthmate
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
SPRING_JPA_HIBERNATE_DDL_AUTO=validate

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000

# Agora.io
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-app-certificate

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4

# Stripe
STRIPE_API_KEY=your-stripe-api-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Spring Boot Dependencies (pom.xml excerpt)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.6.0</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>com.stripe</groupId>
        <artifactId>stripe-java</artifactId>
        <version>22.13.0</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Deployment Instructions

### Local Development
1. Clone the repository
2. Create PostgreSQL database: `createdb worthmate`
3. Copy `application-dev.yml` to your local environment
4. Run: `mvn spring-boot:run`
5. Server runs on http://localhost:8080

### Production Deployment (Railway/Render)

#### Option 1: Railway
1. Push code to GitHub
2. Connect GitHub repository to Railway
3. Add PostgreSQL plugin
4. Set environment variables in Railway dashboard
5. Deploy with one click

#### Option 2: Render
1. Create Web Service from GitHub repo
2. Set build command: `mvn clean package`
3. Set start command: `java -jar target/worthmate-backend-1.0.0.jar`
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

## Important Notes

1. **JWT Tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days
2. **CORS**: Configure CORS in SecurityConfig to allow requests from frontend domain
3. **Agora.io Tokens**: Generated server-side for security, expire after 24 hours
4. **OpenAI API**: Calls are cached for 1 hour to reduce costs
5. **Database Migrations**: Use Flyway for version control of schema changes
6. **Testing**: Implement comprehensive unit and integration tests

## Next Steps

1. Set up local PostgreSQL database
2. Create Spring Boot project using Spring Initializr
3. Implement authentication with JWT
4. Build core CRUD operations for entities
5. Integrate Agora.io for video calls
6. Integrate OpenAI for recommendations
7. Implement payment processing with Stripe
8. Deploy to production platform

For detailed implementation examples, refer to the Individual Sprint Documentation files.
