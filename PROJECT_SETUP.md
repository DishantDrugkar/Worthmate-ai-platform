# Worthmate.ai - Complete Project Setup Guide

## Quick Start Overview

This guide helps you get the complete Worthmate.ai platform running locally and deploy it to production.

## Part 1: Frontend Setup (React)

### Prerequisites
- Node.js 18+ and npm/pnpm
- Git

### Local Development

1. **Clone and Install Dependencies**
```bash
cd worthmate-frontend
pnpm install
```

2. **Create Environment File**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

3. **Run Development Server**
```bash
pnpm dev
```

Frontend runs on http://localhost:3000

4. **Build for Production**
```bash
pnpm build
pnpm start
```

### Deployed Frontend Features
- ✅ Landing page with hero section
- ✅ User authentication (signup/login)
- ✅ Mentor discovery with AI recommendations
- ✅ Booking system with calendar
- ✅ Video call interface
- ✅ Feedback form
- ✅ Admin dashboard (stub)

## Part 2: Backend Setup (Spring Boot)

### Prerequisites
- Java 17 or higher
- PostgreSQL 14 or higher
- Maven 3.6+
- Git

### Local Development

1. **Install PostgreSQL**

**On macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**On Ubuntu/Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**On Windows:**
Download and install from https://www.postgresql.org/download/windows/

2. **Create Database**
```bash
psql -U postgres

CREATE DATABASE worthmate;
CREATE USER worthmate_user WITH PASSWORD 'worthmate_password';
ALTER ROLE worthmate_user SET client_encoding TO 'utf8';
ALTER ROLE worthmate_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE worthmate_user SET default_transaction_deferrable TO on;
ALTER ROLE worthmate_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE worthmate TO worthmate_user;

\c worthmate
GRANT ALL PRIVILEGES ON SCHEMA public TO worthmate_user;

\q
```

3. **Create Spring Boot Project**

**Option A: Using Spring Boot CLI**
```bash
spring boot new worthmate-backend --from https://start.spring.io \
  --dependencies=web,security,data-jpa,postgresql,validation,cloud-openfeign \
  --language=java \
  --package-name=com.worthmate \
  --java-version=17
```

**Option B: Manual Setup with Maven**
```bash
git clone <your-repo-url>
cd worthmate-backend
```

Update `pom.xml` with dependencies from SPRING_BOOT_IMPLEMENTATION.md

4. **Configure Application Properties**

Create `src/main/resources/application.yml`:
```yaml
spring:
  application:
    name: worthmate-backend

  datasource:
    url: jdbc:postgresql://localhost:5432/worthmate
    username: worthmate_user
    password: worthmate_password
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: false

  flyway:
    locations: classpath:db/migration
    enabled: true

server:
  port: 8080
  servlet:
    context-path: /

jwt:
  secret: your-super-secret-key-minimum-32-characters-long
  expiration: 900000
  refresh-expiration: 604800000

agora:
  app-id: ${AGORA_APP_ID:your-agora-app-id}
  app-certificate: ${AGORA_APP_CERTIFICATE:your-agora-certificate}

openai:
  api-key: ${OPENAI_API_KEY:your-openai-api-key}
  model: gpt-4

stripe:
  api-key: ${STRIPE_API_KEY:your-stripe-api-key}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET:your-webhook-secret}

frontend:
  url: http://localhost:3000
```

5. **Run Database Migrations**
```bash
# Place the V1__Initial_Schema.sql file in src/main/resources/db/migration/

# Flyway will automatically run migrations on startup
```

6. **Build and Run Backend**
```bash
mvn clean install
mvn spring-boot:run
```

Backend runs on http://localhost:8080

### API Documentation
Once running, access Swagger UI at: http://localhost:8080/swagger-ui.html

To add Swagger, add this dependency to pom.xml:
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.2</version>
</dependency>
```

## Part 3: Database Setup

### Option 1: Automated with Flyway (Recommended)
Flyway automatically runs migrations in `src/main/resources/db/migration/` on startup.

### Option 2: Manual SQL
```bash
# Connect to database
psql -U worthmate_user -d worthmate -f scripts/V1__Initial_Schema.sql
```

### Verify Database
```bash
psql -U worthmate_user -d worthmate

# List tables
\dt

# Check schema
\d bookings

# Exit
\q
```

## Part 4: API Testing

### Using cURL

**Signup User:**
```bash
curl -X POST http://localhost:8080/api/auth/signup/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

**Get Mentors:**
```bash
curl http://localhost:8080/api/mentors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API collection from `postman_collection.json` (to be created)
2. Set environment variables in Postman
3. Test each endpoint

### Using REST Client (VS Code)
Create `test.http`:
```http
### Signup
POST http://localhost:8080/api/auth/signup/user
Content-Type: application/json

{
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "password": "TestPassword123"
}

### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123"
}
```

## Part 5: Environment Variables

### Required Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

**Backend (application.yml or env vars)**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/worthmate
SPRING_DATASOURCE_USERNAME=worthmate_user
SPRING_DATASOURCE_PASSWORD=worthmate_password
JWT_SECRET=your-32-character-minimum-secret-key-here
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate
OPENAI_API_KEY=your-openai-api-key
STRIPE_API_KEY=your-stripe-api-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## Part 6: Production Deployment

### Frontend Deployment (Vercel)

1. **Push Code to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Select "Next.js" as framework
- Click Deploy

3. **Set Environment Variables**
In Vercel dashboard > Settings > Environment Variables:
```
NEXT_PUBLIC_API_URL=https://worthmate-backend.railway.app
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

4. **Domain Configuration**
- Add custom domain in Vercel settings
- Configure DNS records with your domain provider

### Backend Deployment (Railway)

1. **Connect Repository to Railway**
- Go to https://railway.app
- Click "New Project" → "Deploy from GitHub"
- Select your repository
- Railway auto-detects Spring Boot project

2. **Configure Environment**
Railway dashboard > Variables:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://<railway-postgres-host>:5432/<database>
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<generated-password>
JWT_SECRET=<secure-random-key>
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate
OPENAI_API_KEY=your-openai-api-key
STRIPE_API_KEY=your-stripe-api-key
FRONTEND_URL=https://<your-vercel-domain>
```

3. **Add PostgreSQL Plugin**
- Railway > New → Database → PostgreSQL
- Copy generated credentials to environment variables

4. **Deploy**
Railway automatically deploys on push to main branch

### Backend Deployment (Alternative: AWS)

**Using Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB app
eb init -p "Java 17 running on 64bit Amazon Linux 2" worthmate-backend

# Create environment
eb create worthmate-env

# Deploy
eb deploy

# Monitor logs
eb logs
```

### Database Backup (Production)

**PostgreSQL Backup Script**
```bash
#!/bin/bash
BACKUP_DIR="/backups/worthmate"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="worthmate_$DATE.sql"

pg_dump -U worthmate_user -h localhost worthmate > "$BACKUP_DIR/$FILENAME"
gzip "$BACKUP_DIR/$FILENAME"

# Remove backups older than 30 days
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete
```

Add to crontab for daily backups:
```bash
0 2 * * * /path/to/backup_script.sh
```

## Part 7: Monitoring & Logging

### Application Logging

Add to `application.yml`:
```yaml
logging:
  level:
    root: INFO
    com.worthmate: DEBUG
  file:
    name: logs/application.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

### Performance Monitoring

Add Spring Boot Actuator:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access metrics at: http://localhost:8080/actuator

### Error Tracking (Optional: Sentry)

Add Sentry dependency:
```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>7.0.0</version>
</dependency>
```

Configure:
```yaml
sentry:
  dsn: https://key@sentry.io/project-id
  traces-sample-rate: 1.0
```

## Part 8: Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Load Testing (Optional)
```bash
# Using Apache JMeter
jmeter -n -t test-plan.jmx -l results.jtl -j jmeter.log
```

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U worthmate_user -h localhost -d worthmate

# Check PostgreSQL service status
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS
```

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### JWT Token Issues
- Ensure JWT_SECRET is at least 32 characters
- Check token expiration time in application.yml
- Verify token is passed correctly in Authorization header

### CORS Issues
- Check frontend URL in `application.yml` frontend.url property
- Verify @CrossOrigin annotation in Spring Boot controllers
- Check browser console for CORS error details

## Next Steps

1. Implement remaining backend services (Feedback, Recommendations, Payments)
2. Integrate Agora.io for video calls
3. Implement OpenAI integration for recommendations
4. Add Stripe payment processing
5. Create admin dashboard
6. Set up monitoring and alerts
7. Load testing and optimization
8. Security audit and penetration testing

## Support

For issues or questions:
- Check the troubleshooting section above
- Review backend documentation: `BACKEND_SETUP.md`
- Review frontend documentation: `FRONTEND_API_INTEGRATION.md`
- Check Spring Boot logs for error details

