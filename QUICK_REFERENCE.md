# Worthmate.ai - Developer Quick Reference

## 🚀 Quick Start (5 minutes)

### Frontend
```bash
pnpm install
pnpm dev  # localhost:3000
```

### Backend
```bash
mvn clean install
mvn spring-boot:run  # localhost:8080
```

### Database
```bash
psql -U postgres
CREATE DATABASE worthmate;
# Run V1__Initial_Schema.sql
```

---

## 📚 Documentation Quick Links

| Document | Purpose | Key Sections |
|----------|---------|--------------|
| **README.md** | Overview | Features, tech stack, deployment |
| **PROJECT_SETUP.md** | Complete setup | Install, configure, deploy |
| **BACKEND_SETUP.md** | Backend guide | Schema, APIs, environment |
| **SPRING_BOOT_IMPLEMENTATION.md** | Code examples | Models, DTOs, controllers |
| **FRONTEND_API_INTEGRATION.md** | API docs | Endpoints, requests, responses |
| **ARCHITECTURE.md** | System design | Components, flows, security |
| **PROJECT_SUMMARY.md** | Overview | What's built, timeline, stats |

---

## 🔐 Authentication Quick Ref

### Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup/user \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "firstName":"John",
    "lastName":"Doe",
    "password":"SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123"
  }'
```

### Protected Request
```bash
curl http://localhost:8080/api/mentors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 API Endpoints Cheat Sheet

### Auth (7)
- `POST /api/auth/signup/user`
- `POST /api/auth/signup/mentor`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Mentors (4)
- `GET /api/mentors`
- `GET /api/mentors/{id}`
- `GET /api/mentors/{id}/availability`
- `PUT /api/mentors/{id}`

### Bookings (4)
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/{id}`
- `PUT /api/bookings/{id}`

### Feedback (2)
- `POST /api/feedback`
- `GET /api/feedback/{bookingId}`

### Recommendations (2)
- `GET /api/recommendations`
- `POST /api/recommendations/generate`

### Payments (2)
- `POST /api/payments`
- `GET /api/payments/{bookingId}`

### Admin (3)
- `GET /api/admin/users`
- `GET /api/admin/mentors`
- `PUT /api/admin/mentors/{id}/verify`

---

## 🗄️ Database Quick Ref

### Key Tables
```
users              # User accounts
mentors            # Mentor profiles
bookings           # Consultations
feedback           # Reviews & ratings
recommendations    # AI suggestions
payments           # Transactions
calls              # Video records
specializations    # Expertise areas
```

### Important Columns
```
users.role         # USER, MENTOR, ADMIN
bookings.status    # SCHEDULED, COMPLETED, CANCELLED
feedback.rating    # 1-5 stars
recommendations.score  # 0-100 AI score
```

---

## 🎨 Frontend Pages Map

```
Landing Page       /
├─ Hero Section
├─ Features
├─ Stats
└─ CTA

Auth Pages
├─ /login
└─ /signup

Protected Pages
├─ /mentors              # Browse & filter
├─ /booking/[id]         # Booking form
├─ /booking/confirmation # Confirmation
└─ /feedback/[id]        # Feedback form

Admin Pages
├─ /admin/users
├─ /admin/mentors
└─ /admin/analytics
```

---

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AGORA_APP_ID=your-app-id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-key
```

### Backend (application.yml)
```yaml
DB_HOST=localhost
DB_PORT=5432
DB_NAME=worthmate
DB_USER=postgres
JWT_SECRET=min-32-chars-secret
AGORA_APP_ID=your-id
AGORA_APP_CERTIFICATE=your-cert
OPENAI_API_KEY=your-key
STRIPE_API_KEY=your-key
```

---

## 🔗 External Service APIs

### Agora.io
- Docs: https://docs.agora.io
- Get App ID from console
- Generate RTC tokens server-side

### OpenAI
- API: https://platform.openai.com
- Model: gpt-4
- Used for recommendations

### Stripe
- Docs: https://stripe.com/docs
- Create payment intents
- Handle webhooks

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Port 8080 in use** | `lsof -i :8080` → `kill -9 <PID>` |
| **DB connection failed** | Check PostgreSQL running: `psql -U postgres` |
| **JWT token invalid** | Verify JWT_SECRET (32+ chars) |
| **CORS error** | Check frontend.url in backend config |
| **Migrations not running** | Ensure Flyway script in correct folder |
| **Node modules issue** | `rm -rf node_modules` → `pnpm install` |

---

## 📦 Project Structure

```
/app
  /page.tsx              # Landing
  /login, /signup        # Auth
  /mentors               # Discovery
  /booking               # Booking flow
  /feedback              # Feedback form
  /globals.css           # Styles
  /layout.tsx            # Root layout

/components/ui           # shadcn components
/scripts                 # Database migrations
/docs                    # All documentation

.env.example             # Template
package.json             # Dependencies
```

---

## 💾 Key Dependencies

### Frontend
```json
{
  "next": "^16.0.0",
  "react": "^18.0.0",
  "tailwindcss": "^3.0.0",
  "@radix-ui/react-*": "latest",
  "lucide-react": "latest"
}
```

### Backend
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
</dependency>
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
</dependency>
```

---

## 🧪 Testing

### Frontend
```bash
pnpm test              # Jest
pnpm test:e2e          # Cypress
```

### Backend
```bash
mvn test               # Unit tests
mvn verify             # Integration tests
```

### API Testing
```bash
# Postman: Import collection
# REST Client: Use .http files
# cURL: Use provided examples
```

---

## 📊 Git Workflow

```bash
# Clone
git clone <repo-url>
cd worthmate

# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ...

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/your-feature

# Create Pull Request
```

---

## 🚀 Deployment Checklist

### Before Deploying
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database backups created
- [ ] Security audit done
- [ ] Performance tested

### Frontend (Vercel)
- [ ] GitHub connected
- [ ] Env vars configured
- [ ] Custom domain setup
- [ ] SSL certificate valid

### Backend (Railway)
- [ ] App configured
- [ ] Database created
- [ ] Env vars set
- [ ] Health checks enabled
- [ ] Monitoring enabled

---

## 💡 Best Practices

### Frontend
- Use TypeScript for type safety
- Keep components small
- Use React hooks properly
- Optimize images
- Handle errors gracefully

### Backend
- Use repositories for DB access
- Keep business logic in services
- Validate input with @Valid
- Use transactions for consistency
- Log important operations

### Database
- Use indexes on foreign keys
- Backup regularly
- Monitor query performance
- Use migrations for schema changes
- Test disaster recovery

---

## 🔍 Code Quality

### Frontend Linting
```bash
pnpm lint              # ESLint
pnpm format            # Prettier
```

### Backend
```bash
mvn checkstyle:check   # Code style
mvn jacoco:report      # Coverage
```

---

## 📝 Code Review Checklist

### Frontend
- [ ] TypeScript types correct
- [ ] Props validated
- [ ] Error handling present
- [ ] Loading states shown
- [ ] Accessible (ARIA)
- [ ] Responsive design
- [ ] No console errors

### Backend
- [ ] Input validation done
- [ ] Exception handling
- [ ] Transaction management
- [ ] Query optimized
- [ ] Logging present
- [ ] Tests written
- [ ] Documentation updated

---

## 🔐 Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] CORS properly configured
- [ ] Passwords hashed
- [ ] JWT tokens validated
- [ ] SQL injection prevented
- [ ] XSS protected
- [ ] CSRF tokens used
- [ ] Rate limiting enabled
- [ ] Secrets not in code
- [ ] Dependencies updated

---

## 📞 Support Resources

### Documentation
- `README.md` - Start here
- `PROJECT_SETUP.md` - Setup help
- `ARCHITECTURE.md` - Design questions

### Communities
- Spring Boot: https://spring.io
- React: https://react.dev
- Next.js: https://nextjs.org

### Issues
1. Check troubleshooting section in PROJECT_SETUP.md
2. Review error messages carefully
3. Check logs for details
4. Search existing issues
5. Create new issue with details

---

## 📈 Performance Tips

### Frontend
- Use Next.js Image component
- Code splitting with dynamic imports
- Memoize expensive computations
- Paginate large lists
- Cache API responses

### Backend
- Add database indexes
- Use pagination
- Cache frequent queries
- Use connection pooling
- Optimize N+1 queries

---

## 🎓 Learning Resources

### Frontend
- Next.js Tutorial: https://nextjs.org/learn
- React Hooks: https://react.dev/reference
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

### Backend
- Spring Boot: https://spring.io/guides
- JPA: https://hibernate.org
- PostgreSQL: https://www.postgresql.org/docs

---

## 🔔 Important Reminders

⚠️ **Never commit secrets** - Use environment variables  
⚠️ **Always validate input** - On frontend AND backend  
⚠️ **Test before deploy** - Run full test suite  
⚠️ **Document changes** - Update relevant docs  
⚠️ **Back up database** - Before migrations  
⚠️ **Monitor logs** - Check for errors  
⚠️ **Update dependencies** - Regularly for security  

---

**Last Updated**: March 2024  
**Version**: 1.0.0  
**Status**: Ready for Development

For detailed information, refer to the full documentation files.

