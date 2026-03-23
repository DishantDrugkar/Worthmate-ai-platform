# Worthmate.ai Spring Boot Backend - Quick Start Checklist

## 5-Minute Setup

### Step 1: Prerequisites Check ✅
```bash
# Verify Java 17+
java -version

# Verify Maven 3.6+
mvn -version

# Verify PostgreSQL running
psql --version
```

### Step 2: Database Setup ✅
```bash
# Open PostgreSQL
psql -U postgres

# Run these commands:
CREATE DATABASE worthmate;
CREATE USER worthmate_user WITH PASSWORD 'worthmate_password';
GRANT ALL PRIVILEGES ON DATABASE worthmate TO worthmate_user;
\q
```

### Step 3: Configure Application ✅
Edit `backend/src/main/resources/application.yml`:

```yaml
# Database (already configured)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/worthmate
    username: worthmate_user
    password: worthmate_password

# Update these with your API keys:
jwt:
  secret: change-this-to-32-character-key
  
agora:
  app-id: your-agora-app-id
  app-certificate: your-agora-certificate

stripe:
  api-key: your-stripe-api-key
  
openai:
  api-key: your-openai-api-key
```

### Step 4: Build & Run ✅
```bash
cd backend

# Build
mvn clean install

# Run
mvn spring-boot:run
```

### Step 5: Verify ✅
```bash
# API should be running
curl http://localhost:8080/swagger-ui.html

# Should see Swagger UI in browser
```

## 10-Minute Testing

### Test 1: User Signup
```bash
curl -X POST "http://localhost:8080/api/auth/signup/user" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=Test1234&firstName=John&lastName=Doe&phoneNumber=1234567890"
```

**Expected Response:**
```json
{
  "accessToken": "eyJ0eXAi...",
  "refreshToken": "eyJ0eXAi...",
  "userId": "uuid...",
  "email": "test@example.com",
  "role": "USER"
}
```

### Test 2: User Login
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=Test1234"
```

**Save the accessToken from response**

### Test 3: Protected Endpoint
```bash
curl -X GET "http://localhost:8080/api/users/profile" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test 4: List Mentors
```bash
curl -X GET "http://localhost:8080/api/mentors?page=0&size=10"
```

## API Endpoints Checklist

### Authentication (7 endpoints)
- [ ] POST /api/auth/signup/user
- [ ] POST /api/auth/signup/mentor
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/forgot-password
- [ ] POST /api/auth/reset-password

### Users (4 endpoints)
- [ ] GET /api/users/profile
- [ ] PUT /api/users/profile
- [ ] GET /api/users/{userId}
- [ ] DELETE /api/users/account

### Mentors (6 endpoints)
- [ ] GET /api/mentors
- [ ] GET /api/mentors/{mentorId}
- [ ] PUT /api/mentors/{mentorId}
- [ ] GET /api/mentors/{mentorId}/earnings
- [ ] GET /api/mentors/{mentorId}/availability
- [ ] GET /api/mentors/{mentorId}/reviews

### Bookings (6 endpoints)
- [ ] POST /api/bookings
- [ ] GET /api/bookings
- [ ] GET /api/bookings/{bookingId}
- [ ] PUT /api/bookings/{bookingId}
- [ ] DELETE /api/bookings/{bookingId}
- [ ] GET /api/bookings/mentor/{mentorId}

### Feedback (4 endpoints)
- [ ] POST /api/feedback
- [ ] GET /api/feedback/{bookingId}
- [ ] GET /api/feedback/mentor/{mentorId}
- [ ] GET /api/feedback/user/{userId}

### Payments (4 endpoints)
- [ ] POST /api/payments
- [ ] GET /api/payments/{bookingId}
- [ ] POST /api/payments/webhook
- [ ] POST /api/payments/{paymentId}/refund

### Video Calls (5 endpoints)
- [ ] POST /api/calls/generate-token
- [ ] GET /api/calls/{bookingId}
- [ ] POST /api/calls/{bookingId}/start
- [ ] POST /api/calls/{bookingId}/end
- [ ] GET /api/calls/{bookingId}/recording

### Recommendations (3 endpoints)
- [ ] GET /api/recommendations
- [ ] POST /api/recommendations/generate
- [ ] GET /api/recommendations/mentor/{mentorId}/category/{categoryId}

### Admin (6 endpoints)
- [ ] GET /api/admin/users
- [ ] GET /api/admin/mentors
- [ ] PUT /api/admin/mentors/{mentorId}/verify
- [ ] DELETE /api/admin/users/{userId}
- [ ] GET /api/admin/analytics
- [ ] GET /api/admin/disputes

## Integration Checklist

### Stripe Setup
- [ ] Create Stripe account
- [ ] Get API key
- [ ] Setup webhook endpoint
- [ ] Test payment flow

### Agora Setup
- [ ] Create Agora account
- [ ] Get App ID and Certificate
- [ ] Enable video call features
- [ ] Test token generation

### OpenAI Setup
- [ ] Create OpenAI account
- [ ] Get API key
- [ ] Test recommendation generation
- [ ] Configure model (GPT-4)

## Troubleshooting

### Port 8080 already in use
```bash
lsof -i :8080
kill -9 <PID>
```

### Database connection failed
```bash
# Check PostgreSQL is running
psql -U worthmate_user -d worthmate

# Check credentials match application.yml
```

### JWT token invalid
```bash
# Make sure token is not expired (15 minutes)
# Format must be: Bearer <token>
# Secret key must match in application.yml
```

### Missing dependencies
```bash
# Clean rebuild
mvn clean install -U

# Check internet connection
# Verify Maven Central access
```

## Next Steps

1. ✅ Backend running locally
2. ⏭️ Connect React frontend
3. ⏭️ Setup environment variables
4. ⏭️ Test full API integration
5. ⏭️ Deploy to production

## Useful Commands

```bash
# Build without running tests
mvn clean install -DskipTests

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"

# View all endpoints
curl http://localhost:8080/v3/api-docs | jq '.paths | keys'

# Check logs
tail -f target/spring.log

# Database backup
pg_dump -U worthmate_user worthmate > backup.sql
```

## File Locations

```
backend/
├── src/main/resources/application.yml      ← Configuration
├── src/main/java/com/worthmate/
│   ├── controller/                         ← API endpoints
│   ├── service/                            ← Business logic
│   ├── entity/                             ← Database models
│   ├── repository/                         ← Database access
│   ├── security/                           ← JWT & auth
│   └── exception/                          ← Error handling
└── pom.xml                                 ← Dependencies
```

## Verify Success

Once running, you should see:

```
2024-03-23 10:00:00.000  INFO 12345 --- [main] com.worthmate.WorthmateApplication
  : Started WorthmateApplication
2024-03-23 10:00:00.000  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer
  : Tomcat started on port(s): 8080
```

**✅ Backend is ready!**

## Need Help?

Refer to:
- `SPRING_BOOT_COMPLETE_GUIDE.md` - Detailed setup
- `BACKEND_IMPLEMENTATION_SUMMARY.md` - Architecture overview
- Swagger UI - http://localhost:8080/swagger-ui.html

---

**Congratulations!** Your Worthmate.ai Spring Boot backend is up and running!
