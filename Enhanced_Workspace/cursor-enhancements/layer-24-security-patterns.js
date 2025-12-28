/**
 * LAYER 24 — SECURITY PATTERNS & BEST PRACTICES
 *
 * Security patterns and vulnerability prevention
 *
 * This layer provides comprehensive security patterns based on OWASP Top 10,
 * authentication/authorization patterns, input validation, API security, and
 * data security practices to ensure secure code generation.
 */
/**
 * Main security patterns configuration
 */
export const SECURITY_PATTERNS = {
    /**
     * OWASP Top 10 (2021)
     */
    owaspTop10: {
        a01BrokenAccessControl: {
            rank: 1,
            name: "Broken Access Control",
            description: "Restrictions on authenticated users are not properly enforced",
            severity: "critical",
            prevention: [
                "Implement proper authorization checks on every request",
                "Use principle of least privilege",
                "Validate user permissions server-side",
                "Use role-based access control (RBAC)",
                "Don't rely solely on client-side checks",
                "Implement proper session management"
            ],
            examples: [
                "Accessing other users' data by changing ID in URL",
                "Escalating privileges by manipulating requests",
                "Bypassing access controls by changing HTTP methods"
            ],
            codePatterns: {
                vulnerable: "// Client-side only check\nif (user.role === 'admin') { /* admin action */ }",
                secure: "// Server-side check required\nif (await hasPermission(userId, 'admin')) { /* admin action */ }"
            }
        },
        a02CryptographicFailures: {
            rank: 2,
            name: "Cryptographic Failures",
            description: "Sensitive data exposure due to weak or missing cryptography",
            severity: "critical",
            prevention: [
                "Use strong encryption algorithms (AES-256, RSA-2048+)",
                "Encrypt sensitive data at rest and in transit",
                "Use HTTPS/TLS for all communications",
                "Never store passwords in plaintext - use bcrypt/Argon2",
                "Properly manage encryption keys",
                "Use secure random number generators",
                "Validate SSL/TLS certificates"
            ],
            examples: [
                "Storing passwords in plaintext",
                "Using weak encryption algorithms",
                "Transmitting sensitive data over HTTP",
                "Hardcoded encryption keys"
            ],
            codePatterns: {
                vulnerable: "const password = userInput; // Stored in plaintext",
                secure: "const hashedPassword = await bcrypt.hash(userInput, 10);"
            }
        },
        a03Injection: {
            rank: 3,
            name: "Injection",
            description: "Untrusted data sent to interpreter as part of command or query",
            severity: "critical",
            prevention: [
                "Use parameterized queries/prepared statements",
                "Use ORM/query builders with parameterization",
                "Validate and sanitize all inputs",
                "Use input validation allowlists",
                "Escape output for display",
                "Use least privilege database accounts",
                "Never concatenate user input into queries/commands"
            ],
            examples: [
                "SQL injection: ' OR '1'='1",
                "XSS injection: <script>alert('XSS')</script>",
                "Command injection: ; rm -rf /",
                "LDAP injection, XPath injection"
            ],
            codePatterns: {
                vulnerable: "const query = `SELECT * FROM users WHERE id = ${userId}`;",
                secure: "const query = 'SELECT * FROM users WHERE id = $1'; // Parameterized"
            }
        },
        a04InsecureDesign: {
            rank: 4,
            name: "Insecure Design",
            description: "Security flaws in architecture and design",
            severity: "high",
            prevention: [
                "Security by design - build security in from start",
                "Threat modeling",
                "Secure design patterns",
                "Security requirements in design phase",
                "Security architecture reviews",
                "Fail securely",
                "Defense in depth"
            ],
            examples: [
                "Missing authentication in design",
                "Weak security architecture",
                "No threat modeling",
                "Security as afterthought"
            ]
        },
        a05SecurityMisconfiguration: {
            rank: 5,
            name: "Security Misconfiguration",
            description: "Insecure default configurations, incomplete configurations",
            severity: "high",
            prevention: [
                "Secure default configurations",
                "Remove unnecessary features/components",
                "Keep software updated",
                "Use security headers (CSP, HSTS, etc.)",
                "Proper error handling (don't leak information)",
                "Disable debug modes in production",
                "Secure configuration management"
            ],
            examples: [
                "Default admin credentials",
                "Debug mode enabled in production",
                "Unnecessary ports/services exposed",
                "Missing security headers"
            ],
            codePatterns: {
                vulnerable: "app.use(express.static('public')); // No security headers",
                secure: "app.use(helmet()); // Security headers middleware"
            }
        },
        a06VulnerableComponents: {
            rank: 6,
            name: "Vulnerable and Outdated Components",
            description: "Using components with known vulnerabilities",
            severity: "high",
            prevention: [
                "Keep dependencies updated",
                "Use dependency scanning tools (npm audit, Snyk)",
                "Remove unused dependencies",
                "Monitor security advisories",
                "Use package-lock.json / yarn.lock",
                "Regular security audits",
                "Use trusted sources for packages"
            ],
            examples: [
                "Outdated libraries with known CVEs",
                "Unpatched dependencies",
                "Using packages from untrusted sources"
            ]
        },
        a07AuthenticationFailures: {
            rank: 7,
            name: "Identification and Authentication Failures",
            description: "Authentication mechanisms incorrectly implemented",
            severity: "high",
            prevention: [
                "Strong password policies",
                "Multi-factor authentication (MFA)",
                "Rate limiting on authentication attempts",
                "Secure password storage (bcrypt/Argon2)",
                "Session management security",
                "Protect against brute force",
                "Secure password recovery",
                "Log authentication failures"
            ],
            examples: [
                "Weak passwords accepted",
                "No rate limiting on login",
                "Predictable session IDs",
                "Passwords stored in plaintext"
            ],
            codePatterns: {
                vulnerable: "if (user.password === inputPassword) { /* login */ }",
                secure: "if (await bcrypt.compare(inputPassword, user.hashedPassword)) { /* login */ }"
            }
        },
        a08SoftwareDataIntegrityFailures: {
            rank: 8,
            name: "Software and Data Integrity Failures",
            description: "Insufficient protection of software update and CI/CD pipelines",
            severity: "high",
            prevention: [
                "Code signing",
                "Secure CI/CD pipelines",
                "Verify integrity of dependencies",
                "Use dependency pinning",
                "Secure update mechanisms",
                "Protect against supply chain attacks"
            ],
            examples: [
                "Unsigned updates",
                "Compromised CI/CD pipelines",
                "Unverified dependencies"
            ]
        },
        a09SecurityLoggingFailures: {
            rank: 9,
            name: "Security Logging and Monitoring Failures",
            description: "Insufficient logging and monitoring",
            severity: "medium",
            prevention: [
                "Log security events (auth failures, access violations)",
                "Monitor for suspicious activities",
                "Set up alerts for security incidents",
                "Proper log management",
                "Log analysis and correlation",
                "Incident response procedures",
                "Don't log sensitive data"
            ],
            examples: [
                "No logging of authentication failures",
                "Missing security event monitoring",
                "Logging sensitive information",
                "No alerting on suspicious activity"
            ]
        },
        a10ServerSideRequestForgery: {
            rank: 10,
            name: "Server-Side Request Forgery (SSRF)",
            description: "Forces server to make requests to unintended locations",
            severity: "high",
            prevention: [
                "Validate and sanitize URLs",
                "Whitelist allowed URLs/IPs",
                "Use network segmentation",
                "Disable internal network access",
                "Validate response data",
                "Use URL parsing libraries carefully"
            ],
            examples: [
                "Fetching internal resources via user-provided URL",
                "Accessing cloud metadata services",
                "Internal network scanning"
            ],
            codePatterns: {
                vulnerable: "fetch(userProvidedUrl); // No validation",
                secure: "if (isAllowedUrl(userProvidedUrl)) { fetch(userProvidedUrl); }"
            }
        }
    },
    /**
     * Authentication Patterns
     */
    authentication: {
        jwt: {
            name: "JWT (JSON Web Token)",
            description: "Stateless authentication using signed tokens",
            useCases: ["Stateless authentication", "Microservices", "Mobile apps"],
            implementation: [
                "Sign tokens with secret key",
                "Set appropriate expiration times",
                "Use refresh tokens for long sessions",
                "Store tokens securely (httpOnly cookies preferred over localStorage)",
                "Validate token signature on every request",
                "Include user ID and permissions in payload (not sensitive data)",
                "Use HTTPS only"
            ],
            securityConsiderations: [
                "Token expiration (short-lived access tokens)",
                "Refresh token rotation",
                "Token revocation strategies",
                "XSS protection (don't store in localStorage)",
                "CSRF protection if using cookies",
                "Algorithm verification (prevent algorithm confusion attacks)"
            ]
        },
        sessionBased: {
            name: "Session-Based Authentication",
            description: "Stateful authentication using server-side sessions",
            useCases: ["Traditional web apps", "Server-rendered apps", "Need for server-side revocation"],
            implementation: [
                "Generate secure session IDs (cryptographically random)",
                "Store sessions server-side (memory, Redis, database)",
                "Set secure session cookies (httpOnly, secure, sameSite)",
                "Implement session expiration",
                "Regenerate session ID after login",
                "Implement session invalidation on logout"
            ],
            securityConsiderations: [
                "Session fixation prevention",
                "Session hijacking prevention",
                "Secure cookie attributes",
                "CSRF protection (SameSite cookies, CSRF tokens)",
                "Session storage security"
            ]
        },
        oauth2: {
            name: "OAuth 2.0",
            description: "Authorization framework for third-party access",
            useCases: ["Third-party authentication", "Social login", "API authorization"],
            implementation: [
                "Use authorization code flow (most secure)",
                "Validate state parameter",
                "Exchange authorization code for token server-side",
                "Store client secrets securely",
                "Implement proper redirect URI validation",
                "Use PKCE for mobile/public clients"
            ],
            securityConsiderations: [
                "State parameter for CSRF protection",
                "Redirect URI validation",
                "Token storage security",
                "Scope validation",
                "Token expiration"
            ]
        },
        passwordHashing: {
            name: "Password Hashing",
            description: "Secure password storage using one-way hashing",
            useCases: ["User password storage", "API key storage"],
            implementation: [
                "Use bcrypt (cost factor 10-12) or Argon2",
                "Never use MD5, SHA-1, or SHA-256 for passwords",
                "Add salt (bcrypt/Argon2 do this automatically)",
                "Never store passwords in plaintext",
                "Use constant-time comparison functions"
            ],
            securityConsiderations: [
                "Cost factor for bcrypt (balance security and performance)",
                "Protection against rainbow table attacks",
                "Protection against timing attacks"
            ]
        }
    },
    /**
     * Authorization Patterns
     */
    authorization: {
        rbac: {
            name: "Role-Based Access Control (RBAC)",
            description: "Access control based on user roles",
            useCases: ["Organizational hierarchies", "Clear role definitions", "Group permissions"],
            implementation: [
                "Define roles (admin, user, moderator, etc.)",
                "Assign roles to users",
                "Check role permissions",
                "Implement role hierarchy if needed",
                "Store roles in token/session"
            ],
            securityConsiderations: [
                "Principle of least privilege",
                "Role assignment security",
                "Permission inheritance",
                "Role escalation prevention"
            ]
        },
        abac: {
            name: "Attribute-Based Access Control (ABAC)",
            description: "Access control based on user attributes and resource attributes",
            useCases: ["Complex permissions", "Dynamic access control", "Fine-grained permissions"],
            implementation: [
                "Define attributes (user attributes, resource attributes, environment)",
                "Define policies based on attributes",
                "Evaluate policies for access decisions",
                "Use policy engines if complex"
            ],
            securityConsiderations: [
                "Policy complexity",
                "Performance implications",
                "Policy evaluation security"
            ]
        },
        permissionBased: {
            name: "Permission-Based Access Control",
            description: "Access control based on specific permissions",
            useCases: ["Fine-grained control", "Dynamic permissions", "User-specific permissions"],
            implementation: [
                "Define granular permissions",
                "Assign permissions to users/roles",
                "Check permissions for actions",
                "Store permissions efficiently"
            ],
            securityConsiderations: [
                "Permission granularity",
                "Performance of permission checks",
                "Permission inheritance"
            ]
        }
    },
    /**
     * Input Validation & Sanitization
     */
    inputValidation: {
        general: {
            type: "General",
            validation: [
                "Validate all inputs server-side (never trust client)",
                "Use allowlists over denylists",
                "Validate type, length, format, range",
                "Reject invalid inputs (don't sanitize and accept)",
                "Validate on both client and server (UX vs security)"
            ],
            sanitization: [
                "Sanitize output for display (not input)",
                "Use encoding/escaping for context",
                "HTML encoding for HTML context",
                "JavaScript encoding for JS context",
                "URL encoding for URL context",
                "SQL parameterization (not string escaping)"
            ],
            examples: [
                "Email validation with regex",
                "String length limits",
                "Numeric range validation",
                "Date format validation"
            ]
        },
        sqlInjection: {
            type: "SQL Injection Prevention",
            validation: [
                "Use parameterized queries/prepared statements",
                "Use ORM with parameterization",
                "Validate input types",
                "Use least privilege database users"
            ],
            sanitization: [
                "Never sanitize SQL - use parameterization",
                "Use query builders that parameterize",
                "Escape is not sufficient - use parameters"
            ],
            examples: [
                "Prepared statements with placeholders",
                "ORM queries with parameters",
                "Query builders with binding"
            ]
        },
        xss: {
            type: "XSS Prevention",
            validation: [
                "Validate and sanitize HTML input",
                "Use Content Security Policy (CSP)",
                "Validate URLs in links",
                "Validate JavaScript in user input"
            ],
            sanitization: [
                "HTML encode for HTML context",
                "JavaScript encode for JS context",
                "Attribute encode for HTML attributes",
                "URL encode for URL context",
                "Use libraries like DOMPurify for HTML"
            ],
            examples: [
                "Escape < > & \" ' characters",
                "CSP headers to prevent inline scripts",
                "Sanitize user-generated HTML"
            ]
        },
        csrf: {
            type: "CSRF Prevention",
            validation: [
                "Validate CSRF tokens",
                "Check SameSite cookie attribute",
                "Verify origin/referer headers",
                "Use state parameter in OAuth"
            ],
            sanitization: [
                "Not applicable - CSRF is about request validation"
            ],
            examples: [
                "CSRF tokens in forms",
                "SameSite=Strict cookies",
                "Origin header validation"
            ]
        }
    },
    /**
     * API Security
     */
    apiSecurity: {
        rateLimiting: {
            description: "Limit number of requests per time period",
            implementation: [
                "Implement rate limiting per IP/user/API key",
                "Use token bucket or sliding window algorithm",
                "Set appropriate limits (requests per minute/hour)",
                "Return 429 Too Many Requests status",
                "Include rate limit headers (X-RateLimit-*)"
            ],
            considerations: [
                "Distributed rate limiting for microservices",
                "Different limits for different endpoints",
                "Bypass for authenticated vs unauthenticated",
                "Rate limit headers for client awareness"
            ]
        },
        apiKeyManagement: {
            description: "Secure API key generation and storage",
            implementation: [
                "Generate cryptographically random API keys",
                "Hash API keys before storage (like passwords)",
                "Use prefixes to identify key type",
                "Implement key rotation",
                "Revoke compromised keys",
                "Rate limit per API key"
            ],
            considerations: [
                "Key storage security",
                "Key transmission security (HTTPS)",
                "Key rotation procedures",
                "Key scoping/permissions"
            ]
        },
        cors: {
            description: "Cross-Origin Resource Sharing configuration",
            implementation: [
                "Use specific origins (not *)",
                "Use allowlists for allowed origins",
                "Set appropriate CORS headers",
                "Handle preflight requests",
                "Don't allow credentials with wildcard origin"
            ],
            considerations: [
                "Security vs functionality tradeoff",
                "Credential handling",
                "Preflight request handling"
            ]
        },
        https: {
            description: "Enforce HTTPS for all communications",
            implementation: [
                "Redirect HTTP to HTTPS",
                "Use HSTS header",
                "Validate SSL/TLS certificates",
                "Use strong cipher suites",
                "Implement certificate pinning for mobile apps"
            ],
            considerations: [
                "HSTS preload list",
                "Certificate expiration monitoring",
                "TLS version (1.2+ minimum)"
            ]
        }
    },
    /**
     * Data Security
     */
    dataSecurity: {
        encryptionAtRest: {
            description: "Encrypt data stored in databases/files",
            implementation: [
                "Use database encryption",
                "Encrypt sensitive files",
                "Secure key management",
                "Encrypt backups"
            ],
            considerations: [
                "Key management and rotation",
                "Performance impact",
                "Backup encryption"
            ]
        },
        encryptionInTransit: {
            description: "Encrypt data during transmission",
            implementation: [
                "Use TLS/HTTPS",
                "Use strong cipher suites",
                "Validate certificates",
                "Use certificate pinning for mobile"
            ],
            considerations: [
                "TLS version support",
                "Certificate validation",
                "Perfect forward secrecy"
            ]
        },
        piiHandling: {
            description: "Protect Personally Identifiable Information",
            implementation: [
                "Identify PII in application",
                "Minimize PII collection",
                "Encrypt PII at rest and in transit",
                "Implement access controls",
                "Log PII access",
                "Implement data retention policies",
                "Secure data deletion"
            ],
            considerations: [
                "GDPR compliance",
                "Data minimization",
                "Right to deletion",
                "Data anonymization"
            ]
        },
        secureStorage: {
            description: "Secure storage patterns for sensitive data",
            implementation: [
                "Never store secrets in code",
                "Use environment variables for secrets",
                "Use secret management services",
                "Encrypt sensitive configuration",
                "Use secure key storage"
            ],
            considerations: [
                "Secret rotation",
                "Access to secrets",
                "Secret leakage prevention"
            ]
        }
    },
    /**
     * Security Headers
     */
    securityHeaders: {
        contentSecurityPolicy: {
            header: "Content-Security-Policy",
            description: "Prevent XSS attacks by controlling resource loading",
            value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
            considerations: ["Restrictive policies", "Nonce/hash for inline scripts", "Report-URI for violations"]
        },
        strictTransportSecurity: {
            header: "Strict-Transport-Security",
            description: "Force HTTPS connections",
            value: "max-age=31536000; includeSubDomains; preload",
            considerations: ["Max-age duration", "Include subdomains", "Preload list"]
        },
        xFrameOptions: {
            header: "X-Frame-Options",
            description: "Prevent clickjacking",
            value: "DENY or SAMEORIGIN",
            considerations: ["DENY is most secure", "SAMEORIGIN if frames needed"]
        },
        xContentTypeOptions: {
            header: "X-Content-Type-Options",
            description: "Prevent MIME type sniffing",
            value: "nosniff",
            considerations: ["Simple but important"]
        },
        referrerPolicy: {
            header: "Referrer-Policy",
            description: "Control referrer information",
            value: "strict-origin-when-cross-origin",
            considerations: ["Balance privacy and functionality"]
        },
        permissionsPolicy: {
            header: "Permissions-Policy",
            description: "Control browser features",
            value: "geolocation=(), microphone=(), camera=()",
            considerations: ["Disable unnecessary features", "Granular control"]
        }
    }
};
/**
 * Check code for security vulnerabilities
 */
export function checkSecurityVulnerability(code, vulnerabilityType) {
    const vulnerability = SECURITY_PATTERNS.owaspTop10[vulnerabilityType];
    // Simplified check - in practice would use AST analysis
    // This is a placeholder for actual security scanning logic
    return false;
}
/**
 * Get security best practices for vulnerability type
 */
export function getSecurityBestPractices(vulnerabilityType) {
    return SECURITY_PATTERNS.owaspTop10[vulnerabilityType].prevention;
}
//# sourceMappingURL=layer-24-security-patterns.js.map