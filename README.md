# Worthmate.ai - 1:1 Professional Consultation Platform

## Overview

Worthmate.ai is a comprehensive platform connecting users with industry experts for 1:1 consultation calls. The platform features AI-powered recommendations based on community feedback, secure video calling, and a robust booking and payment system.

## Key Features

### For Users
- 🔐 Secure authentication with JWT
- 🎯 Browse and filter expert mentors
- 🤖 AI-powered mentor recommendations based on community feedback
- 📅 Easy booking with available time slots
- 📹 Real-time video consultations with Agora.io
- 💰 Secure payments via Stripe
- ⭐ Leave feedback and ratings after consultations
- 📊 View consultation history and recommendations

### For Mentors
- 👤 Professional profile with expertise showcase
- 📅 Flexible availability management
- 💳 Earnings dashboard
- 📈 Rating and review tracking
- 🔔 Booking notifications
- 💰 Secure payment processing

### For Admins
- 👥 User and mentor management
- ✅ Mentor verification system
- 📊 Platform analytics and insights
- 🛡️ Dispute resolution
- 🔍 Content moderation

## Technology Stack

### Frontend
- **Framework**: React 18 / Next.js 16
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Hooks with SWR
- **Video**: Agora.io Web SDK
- **Payments**: Stripe.js
- **Deployment**: Vercel

### Backend
- **Framework**: Spring Boot 3.1+
- **Language**: Java 17
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (JSON Web Tokens)
- **API**: REST
- **Deployment**: Railway / AWS / Render

### Infrastructure
- **Video Calling**: Agora.io
- **AI Integration**: OpenAI ChatGPT API
- **Payments**: Stripe
- **Database**: PostgreSQL with Flyway migrations
- **Email**: SMTP (Gmail, SendGrid, etc.)
- **Hosting**: Vercel (Frontend), Railway/AWS (Backend)

## Project Structure

```
worthmate/
├── Frontend (React/Next.js)
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/page.tsx        # Login page
│   │   ├── signup/page.tsx       # Signup page
│   │   ├── mentors/page.tsx      # Mentor listing with filters
│   │   ├── booking/              # Booking flow
│   │   ├── feedback/             # Feedback form
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── public/
│   └── package.json
│
├── Backend Documentation
│   ├── BACKEND_SETUP.md          # Complete backend setup guide
│   ├── SPRING_BOOT_IMPLEMENTATION.md # Code examples
│   ├── scripts/
│   │   └── V1__Initial_Schema.sql    # Database migrations
│   └── pom.xml                   # Maven dependencies
│
├── Documentation
│   ├── PROJECT_SETUP.md          # Complete setup guide
│   ├── FRONTEND_API_INTEGRATION.md   # API integration guide
│   ├── README.md                 # This file
│   └── ARCHITECTURE.md           # System architecture
│
└── Configuration Files
    ├── .env.example              # Environment variables template
    └── docker-compose.yml        # Docker setup (optional)
```

## Getting Started

### Prerequisites
- Node.js 18+ (Frontend)
- Java 17+ (Backend)
- PostgreSQL 14+ (Database)
- Git

### Quick Start

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/worthmate.git
cd worthmate
```

2. **Frontend Setup**
```bash
cd frontend
pnpm install
cp .env.example .env.local
# Edit .env.local with your configuration
pnpm dev
```

3. **Backend Setup**
```bash
cd backend
# Create PostgreSQL database (see PROJECT_SETUP.md)
mvn clean install
mvn spring-boot:run
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html

For detailed setup instructions, see [PROJECT_SETUP.md](./PROJECT_SETUP.md)

## Configuration

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

**Backend (application.yml)**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/worthmate
    username: worthmate_user
    password: worthmate_password

jwt:
  secret: your-32-char-minimum-secret-key
  expiration: 900000

agora:
  app-id: your-agora-app-id
  app-certificate: your-agora-certificate

openai:
  api-key: your-openai-api-key

stripe:
  api-key: your-stripe-api-key
```

## API Documentation

### Core Endpoints

**Authentication**
- `POST /api/auth/signup/user` - User registration
- `POST /api/auth/signup/mentor` - Mentor registration
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

**Mentors**
- `GET /api/mentors` - List mentors with filters
- `GET /api/mentors/{id}` - Get mentor details
- `GET /api/mentors/{id}/availability` - Get availability

**Bookings**
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List user's bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Cancel booking

**Feedback & Recommendations**
- `POST /api/feedback` - Submit feedback
- `GET /api/recommendations` - Get AI recommendations

**Payments**
- `POST /api/payments` - Create payment
- `GET /api/payments/{bookingId}` - Get payment status

See [FRONTEND_API_INTEGRATION.md](./FRONTEND_API_INTEGRATION.md) for complete API documentation.

## Deployment

### Deploy Frontend (Vercel)
1. Push code to GitHub
2. Import repository to Vercel
3. Set environment variables
4. Deploy with one click

### Deploy Backend (Railway)
1. Create Railway account
2. Connect GitHub repository
3. Configure environment variables
4. Railway auto-deploys on push

See [PROJECT_SETUP.md](./PROJECT_SETUP.md) for detailed deployment instructions.

## Key Features Implementation

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (USER, MENTOR, ADMIN)
- Secure password hashing with bcrypt
- Token refresh mechanism

### 2. Video Calling
- Agora.io integration for real-time video calls
- Server-side token generation for security
- Call recording and metadata tracking

### 3. AI Recommendations
- ChatGPT-powered recommendation engine
- Analyzes historical feedback for patterns
- Real-time recommendation scores (0-100)
- Cached recommendations for performance

### 4. Payment Processing
- Stripe integration for secure payments
- Mentor earnings tracking
- Automated payouts
- Payment history and receipts

### 5. Feedback System
- Post-call feedback forms
- Rating and review system
- Improvement area tracking
- Public recommendation indicators

## Database Schema

### Key Tables
- **users**: User accounts with roles
- **mentors**: Mentor profiles and specializations
- **bookings**: Consultation bookings
- **calls**: Video call records
- **feedback**: User feedback and ratings
- **recommendations**: AI-generated recommendations
- **payments**: Payment transactions
- **mentor_availability**: Availability slots

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for complete schema documentation.

## Security

- 🔐 HTTPS/TLS for all communications
- 🔑 JWT tokens with expiration
- 🔒 Password hashing with bcrypt
- 🛡️ CORS configuration
- 📝 SQL injection prevention with parameterized queries
- 🚫 Rate limiting on API endpoints
- 🔍 Input validation and sanitization

## Testing

### Frontend Tests
```bash
cd frontend
pnpm test
pnpm test:e2e
```

### Backend Tests
```bash
cd backend
mvn test
mvn verify
```

### API Testing
- Postman collection available
- REST Client examples included
- cURL commands provided

## Performance Optimization

- Database query optimization with indexes
- API response caching with 1-hour TTL
- Frontend component code splitting
- Image optimization and lazy loading
- CDN for static assets
- Database connection pooling

## Monitoring & Logging

- Spring Boot Actuator for metrics
- Application logs with structured logging
- Error tracking (optional: Sentry)
- Performance monitoring
- User activity audit logs

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify PostgreSQL is running
- Check credentials in application.yml
- Ensure database exists

**JWT Token Invalid**
- Check token expiration
- Verify JWT_SECRET matches frontend
- Clear browser cache/localStorage

**CORS Errors**
- Verify frontend URL in CORS configuration
- Check authorization headers
- Test with cURL first

**Video Call Issues**
- Verify Agora credentials
- Check network connectivity
- Test with different browsers

See [PROJECT_SETUP.md](./PROJECT_SETUP.md) for more troubleshooting tips.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Roadmap

### Phase 1 (MVP)
- ✅ User authentication
- ✅ Mentor listing and booking
- ✅ Video calls with Agora.io
- ✅ Feedback system
- 🔄 AI recommendations

### Phase 2 (Enhancements)
- [ ] Admin dashboard with analytics
- [ ] Automated mentor payouts
- [ ] Advanced search and filters
- [ ] Notifications and reminders
- [ ] Mobile app (React Native)

### Phase 3 (Scaling)
- [ ] Group consultations
- [ ] Subscription plans
- [ ] Content library (recorded calls)
- [ ] Community features
- [ ] Advanced analytics

## License

MIT License - see LICENSE file for details

## Support & Contact

- 📧 Email: support@worthmate.ai
- 💬 Discord: [Join Community](https://discord.gg/worthmate)
- 📝 GitHub Issues: [Report Bug](https://github.com/worthmate/worthmate/issues)
- 📖 Documentation: [Full Docs](https://docs.worthmate.ai)

## Acknowledgments

- Agora.io for video calling infrastructure
- OpenAI for GPT-4 API
- Stripe for payment processing
- Spring Boot community
- React and Next.js teams
- shadcn/ui for component library

## Related Documentation

- [Project Setup Guide](./PROJECT_SETUP.md) - Complete setup instructions
- [Backend Setup Guide](./BACKEND_SETUP.md) - Spring Boot configuration
- [Spring Boot Implementation](./SPRING_BOOT_IMPLEMENTATION.md) - Code examples
- [Frontend API Integration](./FRONTEND_API_INTEGRATION.md) - API integration guide
- [Architecture Overview](./ARCHITECTURE.md) - System architecture

---

**Version**: 1.0.0  
**Last Updated**: March 2024  
**Status**: Production Ready

