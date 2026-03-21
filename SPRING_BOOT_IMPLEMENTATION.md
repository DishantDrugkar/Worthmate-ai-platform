# Spring Boot Implementation Guide - Code Examples

This guide provides code examples for implementing the Worthmate.ai backend with Spring Boot.

## 1. Maven Project Setup (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>

    <groupId>com.worthmate</groupId>
    <artifactId>worthmate-backend</artifactId>
    <version>1.0.0</version>
    <name>Worthmate Backend</name>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.3</jjwt.version>
        <stripe.version>22.13.0</stripe.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
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

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.6.0</version>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Stripe -->
        <dependency>
            <groupId>com.stripe</groupId>
            <artifactId>stripe-java</artifactId>
            <version>${stripe.version}</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- HTTP Client for OpenAI -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
            <version>4.0.4</version>
        </dependency>

        <!-- Flyway for Migrations -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## 2. Entity Models

### User Entity
```java
package com.worthmate.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String profileImageUrl;
    private String phone;

    @Column(nullable = false)
    private Boolean isActive = true;

    private LocalDateTime lastLogin;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

enum UserRole {
    USER, MENTOR, ADMIN
}
```

### Booking Entity
```java
package com.worthmate.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Mentor mentor;

    @ManyToOne
    @JoinColumn(name = "problem_category_id")
    private ProblemCategory problemCategory;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Column(nullable = false)
    private Integer durationMinutes = 60;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.SCHEDULED;

    private String problemDescription;
    private String agoraRoomId;
    private LocalDateTime cancelledAt;
    private String cancellationReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

enum BookingStatus {
    SCHEDULED, CANCELLED, COMPLETED, NO_SHOW
}
```

## 3. DTOs (Data Transfer Objects)

### Signup Request
```java
package com.worthmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "First name cannot be blank")
    @Size(min = 2, max = 100)
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    @Size(min = 2, max = 100)
    private String lastName;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    // For mentors only
    private String title;
    private String bio;
}
```

### Login Request
```java
package com.worthmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
```

### Booking Request
```java
package com.worthmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingRequest {
    @NotNull
    private UUID mentorId;

    @NotNull
    private LocalDateTime dateTime;

    @NotNull
    private UUID problemCategoryId;

    @NotBlank
    private String problemDescription;

    private Integer duration = 60;
}
```

## 4. Authentication Controller

```java
package com.worthmate.controller;

import com.worthmate.dto.LoginRequest;
import com.worthmate.dto.SignupRequest;
import com.worthmate.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url:http://localhost:3000}")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup/user")
    public ResponseEntity<?> signupUser(@Valid @RequestBody SignupRequest request) {
        var result = authService.signupUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/signup/mentor")
    public ResponseEntity<?> signupMentor(@Valid @RequestBody SignupRequest request) {
        var result = authService.signupMentor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        var result = authService.login(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") String token) {
        var result = authService.refreshToken(token);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new ApiResponse("Logged out successfully"));
    }
}
```

## 5. Auth Service

```java
package com.worthmate.service;

import com.worthmate.dto.LoginRequest;
import com.worthmate.dto.SignupRequest;
import com.worthmate.model.User;
import com.worthmate.model.UserRole;
import com.worthmate.repository.UserRepository;
import com.worthmate.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signupUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .isActive(true)
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, "USER", user.getId().toString());
    }

    public AuthResponse signupMentor(SignupRequest request) {
        // Similar to signupUser but creates with MENTOR role
        // Also create Mentor entity with title and bio
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getRole().toString(), user.getId().toString());
    }
}
```

## 6. JWT Token Provider

```java
package com.worthmate.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

## 7. Security Configuration

```java
package com.worthmate.config;

import com.worthmate.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .exceptionHandling()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/mentors").permitAll()
                        .requestMatchers("/api/mentors/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

## 8. Booking Controller Example

```java
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request,
                                          @CurrentUser User user) {
        var booking = bookingService.createBooking(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable String id,
                                        @CurrentUser User user) {
        var booking = bookingService.getBooking(UUID.fromString(id), user);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserBookings(@CurrentUser User user,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        var bookings = bookingService.getUserBookings(user.getId(), page, size);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelBooking(@PathVariable String id,
                                          @CurrentUser User user) {
        var booking = bookingService.cancelBooking(UUID.fromString(id), user);
        return ResponseEntity.ok(booking);
    }
}
```

## 9. Application Configuration (application.yml)

```yaml
spring:
  application:
    name: worthmate-backend

  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:worthmate}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:password}
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
  port: ${SERVER_PORT:8080}
  servlet:
    context-path: /

jwt:
  secret: ${JWT_SECRET:your-super-secret-key-change-in-production}
  expiration: ${JWT_EXPIRATION_MS:900000}

agora:
  app-id: ${AGORA_APP_ID}
  app-certificate: ${AGORA_APP_CERTIFICATE}

openai:
  api-key: ${OPENAI_API_KEY}
  model: ${OPENAI_MODEL:gpt-4}

stripe:
  api-key: ${STRIPE_API_KEY}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET}

frontend:
  url: ${FRONTEND_URL:http://localhost:3000}

logging:
  level:
    root: INFO
    com.worthmate: DEBUG
```

## 10. Recommendation Engine (AI Integration)

```java
package com.worthmate.service;

import com.worthmate.model.Feedback;
import com.worthmate.model.Recommendation;
import com.worthmate.repository.FeedbackRepository;
import com.worthmate.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final FeedbackRepository feedbackRepository;
    private final RecommendationRepository recommendationRepository;
    private final OpenAIService openAIService;

    public Recommendation generateRecommendation(UUID userId, UUID mentorId, UUID categoryId) {
        // Get similar consultations
        List<Feedback> similarFeedbacks = feedbackRepository
                .findByMentorIdAndCategoryId(mentorId, categoryId);

        if (similarFeedbacks.isEmpty()) {
            return null; // Not enough data
        }

        // Calculate success rate
        long positiveReviews = similarFeedbacks.stream()
                .filter(f -> f.getRating() >= 4)
                .count();
        double successRate = (double) positiveReviews / similarFeedbacks.size() * 100;

        // Generate AI recommendation reason using ChatGPT
        String recommendation = openAIService.generateRecommendation(
                mentorId, categoryId, similarFeedbacks
        );

        // Calculate recommendation score (0-100)
        int score = calculateScore(successRate, similarFeedbacks.size());

        return Recommendation.builder()
                .userId(userId)
                .mentorId(mentorId)
                .problemCategoryId(categoryId)
                .recommendationScore(score)
                .recommendationReason(recommendation)
                .similarCallsCount(similarFeedbacks.size())
                .successRate(successRate)
                .isActive(true)
                .build();
    }

    private int calculateScore(double successRate, int callCount) {
        // Base score on success rate
        int baseScore = (int) successRate;
        
        // Adjust based on sample size
        if (callCount < 5) {
            baseScore = Math.max(0, baseScore - 10);
        }
        
        return Math.min(100, baseScore);
    }
}
```

## Key Implementation Notes

1. **JWT Security**: All protected endpoints require valid JWT token in Authorization header
2. **CORS**: Configure CORS to allow requests from frontend domain
3. **Database Migrations**: Use Flyway for schema versioning
4. **Input Validation**: Use `@Valid` annotation and validation constraints
5. **Exception Handling**: Implement global exception handler
6. **Transaction Management**: Use `@Transactional` for database operations
7. **Testing**: Write comprehensive unit tests for services

For more details on each component, refer to the BACKEND_SETUP.md file.
