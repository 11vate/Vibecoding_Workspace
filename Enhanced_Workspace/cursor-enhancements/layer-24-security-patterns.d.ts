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
 * Security severity level
 */
export type SecuritySeverity = "critical" | "high" | "medium" | "low" | "informational";
/**
 * OWASP vulnerability
 */
export interface OWASPVulnerability {
    rank: number;
    name: string;
    description: string;
    severity: SecuritySeverity;
    prevention: string[];
    examples: string[];
    codePatterns?: {
        vulnerable: string;
        secure: string;
    };
}
/**
 * Authentication pattern
 */
export interface AuthenticationPattern {
    name: string;
    description: string;
    useCases: string[];
    implementation: string[];
    securityConsiderations: string[];
}
/**
 * Authorization pattern
 */
export interface AuthorizationPattern {
    name: string;
    description: string;
    useCases: string[];
    implementation: string[];
    securityConsiderations: string[];
}
/**
 * Input validation pattern
 */
export interface InputValidationPattern {
    type: string;
    validation: string[];
    sanitization: string[];
    examples: string[];
}
/**
 * Main security patterns configuration
 */
export declare const SECURITY_PATTERNS: {
    /**
     * OWASP Top 10 (2021)
     */
    readonly owaspTop10: {
        readonly a01BrokenAccessControl: {
            readonly rank: 1;
            readonly name: "Broken Access Control";
            readonly description: "Restrictions on authenticated users are not properly enforced";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Implement proper authorization checks on every request", "Use principle of least privilege", "Validate user permissions server-side", "Use role-based access control (RBAC)", "Don't rely solely on client-side checks", "Implement proper session management"];
            readonly examples: readonly ["Accessing other users' data by changing ID in URL", "Escalating privileges by manipulating requests", "Bypassing access controls by changing HTTP methods"];
            readonly codePatterns: {
                readonly vulnerable: "// Client-side only check\nif (user.role === 'admin') { /* admin action */ }";
                readonly secure: "// Server-side check required\nif (await hasPermission(userId, 'admin')) { /* admin action */ }";
            };
        };
        readonly a02CryptographicFailures: {
            readonly rank: 2;
            readonly name: "Cryptographic Failures";
            readonly description: "Sensitive data exposure due to weak or missing cryptography";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Use strong encryption algorithms (AES-256, RSA-2048+)", "Encrypt sensitive data at rest and in transit", "Use HTTPS/TLS for all communications", "Never store passwords in plaintext - use bcrypt/Argon2", "Properly manage encryption keys", "Use secure random number generators", "Validate SSL/TLS certificates"];
            readonly examples: readonly ["Storing passwords in plaintext", "Using weak encryption algorithms", "Transmitting sensitive data over HTTP", "Hardcoded encryption keys"];
            readonly codePatterns: {
                readonly vulnerable: "const password = userInput; // Stored in plaintext";
                readonly secure: "const hashedPassword = await bcrypt.hash(userInput, 10);";
            };
        };
        readonly a03Injection: {
            readonly rank: 3;
            readonly name: "Injection";
            readonly description: "Untrusted data sent to interpreter as part of command or query";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Use parameterized queries/prepared statements", "Use ORM/query builders with parameterization", "Validate and sanitize all inputs", "Use input validation allowlists", "Escape output for display", "Use least privilege database accounts", "Never concatenate user input into queries/commands"];
            readonly examples: readonly ["SQL injection: ' OR '1'='1", "XSS injection: <script>alert('XSS')</script>", "Command injection: ; rm -rf /", "LDAP injection, XPath injection"];
            readonly codePatterns: {
                readonly vulnerable: "const query = `SELECT * FROM users WHERE id = ${userId}`;";
                readonly secure: "const query = 'SELECT * FROM users WHERE id = $1'; // Parameterized";
            };
        };
        readonly a04InsecureDesign: {
            readonly rank: 4;
            readonly name: "Insecure Design";
            readonly description: "Security flaws in architecture and design";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Security by design - build security in from start", "Threat modeling", "Secure design patterns", "Security requirements in design phase", "Security architecture reviews", "Fail securely", "Defense in depth"];
            readonly examples: readonly ["Missing authentication in design", "Weak security architecture", "No threat modeling", "Security as afterthought"];
        };
        readonly a05SecurityMisconfiguration: {
            readonly rank: 5;
            readonly name: "Security Misconfiguration";
            readonly description: "Insecure default configurations, incomplete configurations";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Secure default configurations", "Remove unnecessary features/components", "Keep software updated", "Use security headers (CSP, HSTS, etc.)", "Proper error handling (don't leak information)", "Disable debug modes in production", "Secure configuration management"];
            readonly examples: readonly ["Default admin credentials", "Debug mode enabled in production", "Unnecessary ports/services exposed", "Missing security headers"];
            readonly codePatterns: {
                readonly vulnerable: "app.use(express.static('public')); // No security headers";
                readonly secure: "app.use(helmet()); // Security headers middleware";
            };
        };
        readonly a06VulnerableComponents: {
            readonly rank: 6;
            readonly name: "Vulnerable and Outdated Components";
            readonly description: "Using components with known vulnerabilities";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Keep dependencies updated", "Use dependency scanning tools (npm audit, Snyk)", "Remove unused dependencies", "Monitor security advisories", "Use package-lock.json / yarn.lock", "Regular security audits", "Use trusted sources for packages"];
            readonly examples: readonly ["Outdated libraries with known CVEs", "Unpatched dependencies", "Using packages from untrusted sources"];
        };
        readonly a07AuthenticationFailures: {
            readonly rank: 7;
            readonly name: "Identification and Authentication Failures";
            readonly description: "Authentication mechanisms incorrectly implemented";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Strong password policies", "Multi-factor authentication (MFA)", "Rate limiting on authentication attempts", "Secure password storage (bcrypt/Argon2)", "Session management security", "Protect against brute force", "Secure password recovery", "Log authentication failures"];
            readonly examples: readonly ["Weak passwords accepted", "No rate limiting on login", "Predictable session IDs", "Passwords stored in plaintext"];
            readonly codePatterns: {
                readonly vulnerable: "if (user.password === inputPassword) { /* login */ }";
                readonly secure: "if (await bcrypt.compare(inputPassword, user.hashedPassword)) { /* login */ }";
            };
        };
        readonly a08SoftwareDataIntegrityFailures: {
            readonly rank: 8;
            readonly name: "Software and Data Integrity Failures";
            readonly description: "Insufficient protection of software update and CI/CD pipelines";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Code signing", "Secure CI/CD pipelines", "Verify integrity of dependencies", "Use dependency pinning", "Secure update mechanisms", "Protect against supply chain attacks"];
            readonly examples: readonly ["Unsigned updates", "Compromised CI/CD pipelines", "Unverified dependencies"];
        };
        readonly a09SecurityLoggingFailures: {
            readonly rank: 9;
            readonly name: "Security Logging and Monitoring Failures";
            readonly description: "Insufficient logging and monitoring";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Log security events (auth failures, access violations)", "Monitor for suspicious activities", "Set up alerts for security incidents", "Proper log management", "Log analysis and correlation", "Incident response procedures", "Don't log sensitive data"];
            readonly examples: readonly ["No logging of authentication failures", "Missing security event monitoring", "Logging sensitive information", "No alerting on suspicious activity"];
        };
        readonly a10ServerSideRequestForgery: {
            readonly rank: 10;
            readonly name: "Server-Side Request Forgery (SSRF)";
            readonly description: "Forces server to make requests to unintended locations";
            readonly severity: SecuritySeverity;
            readonly prevention: readonly ["Validate and sanitize URLs", "Whitelist allowed URLs/IPs", "Use network segmentation", "Disable internal network access", "Validate response data", "Use URL parsing libraries carefully"];
            readonly examples: readonly ["Fetching internal resources via user-provided URL", "Accessing cloud metadata services", "Internal network scanning"];
            readonly codePatterns: {
                readonly vulnerable: "fetch(userProvidedUrl); // No validation";
                readonly secure: "if (isAllowedUrl(userProvidedUrl)) { fetch(userProvidedUrl); }";
            };
        };
    };
    /**
     * Authentication Patterns
     */
    readonly authentication: {
        readonly jwt: {
            readonly name: "JWT (JSON Web Token)";
            readonly description: "Stateless authentication using signed tokens";
            readonly useCases: readonly ["Stateless authentication", "Microservices", "Mobile apps"];
            readonly implementation: readonly ["Sign tokens with secret key", "Set appropriate expiration times", "Use refresh tokens for long sessions", "Store tokens securely (httpOnly cookies preferred over localStorage)", "Validate token signature on every request", "Include user ID and permissions in payload (not sensitive data)", "Use HTTPS only"];
            readonly securityConsiderations: readonly ["Token expiration (short-lived access tokens)", "Refresh token rotation", "Token revocation strategies", "XSS protection (don't store in localStorage)", "CSRF protection if using cookies", "Algorithm verification (prevent algorithm confusion attacks)"];
        };
        readonly sessionBased: {
            readonly name: "Session-Based Authentication";
            readonly description: "Stateful authentication using server-side sessions";
            readonly useCases: readonly ["Traditional web apps", "Server-rendered apps", "Need for server-side revocation"];
            readonly implementation: readonly ["Generate secure session IDs (cryptographically random)", "Store sessions server-side (memory, Redis, database)", "Set secure session cookies (httpOnly, secure, sameSite)", "Implement session expiration", "Regenerate session ID after login", "Implement session invalidation on logout"];
            readonly securityConsiderations: readonly ["Session fixation prevention", "Session hijacking prevention", "Secure cookie attributes", "CSRF protection (SameSite cookies, CSRF tokens)", "Session storage security"];
        };
        readonly oauth2: {
            readonly name: "OAuth 2.0";
            readonly description: "Authorization framework for third-party access";
            readonly useCases: readonly ["Third-party authentication", "Social login", "API authorization"];
            readonly implementation: readonly ["Use authorization code flow (most secure)", "Validate state parameter", "Exchange authorization code for token server-side", "Store client secrets securely", "Implement proper redirect URI validation", "Use PKCE for mobile/public clients"];
            readonly securityConsiderations: readonly ["State parameter for CSRF protection", "Redirect URI validation", "Token storage security", "Scope validation", "Token expiration"];
        };
        readonly passwordHashing: {
            readonly name: "Password Hashing";
            readonly description: "Secure password storage using one-way hashing";
            readonly useCases: readonly ["User password storage", "API key storage"];
            readonly implementation: readonly ["Use bcrypt (cost factor 10-12) or Argon2", "Never use MD5, SHA-1, or SHA-256 for passwords", "Add salt (bcrypt/Argon2 do this automatically)", "Never store passwords in plaintext", "Use constant-time comparison functions"];
            readonly securityConsiderations: readonly ["Cost factor for bcrypt (balance security and performance)", "Protection against rainbow table attacks", "Protection against timing attacks"];
        };
    };
    /**
     * Authorization Patterns
     */
    readonly authorization: {
        readonly rbac: {
            readonly name: "Role-Based Access Control (RBAC)";
            readonly description: "Access control based on user roles";
            readonly useCases: readonly ["Organizational hierarchies", "Clear role definitions", "Group permissions"];
            readonly implementation: readonly ["Define roles (admin, user, moderator, etc.)", "Assign roles to users", "Check role permissions", "Implement role hierarchy if needed", "Store roles in token/session"];
            readonly securityConsiderations: readonly ["Principle of least privilege", "Role assignment security", "Permission inheritance", "Role escalation prevention"];
        };
        readonly abac: {
            readonly name: "Attribute-Based Access Control (ABAC)";
            readonly description: "Access control based on user attributes and resource attributes";
            readonly useCases: readonly ["Complex permissions", "Dynamic access control", "Fine-grained permissions"];
            readonly implementation: readonly ["Define attributes (user attributes, resource attributes, environment)", "Define policies based on attributes", "Evaluate policies for access decisions", "Use policy engines if complex"];
            readonly securityConsiderations: readonly ["Policy complexity", "Performance implications", "Policy evaluation security"];
        };
        readonly permissionBased: {
            readonly name: "Permission-Based Access Control";
            readonly description: "Access control based on specific permissions";
            readonly useCases: readonly ["Fine-grained control", "Dynamic permissions", "User-specific permissions"];
            readonly implementation: readonly ["Define granular permissions", "Assign permissions to users/roles", "Check permissions for actions", "Store permissions efficiently"];
            readonly securityConsiderations: readonly ["Permission granularity", "Performance of permission checks", "Permission inheritance"];
        };
    };
    /**
     * Input Validation & Sanitization
     */
    readonly inputValidation: {
        readonly general: {
            readonly type: "General";
            readonly validation: readonly ["Validate all inputs server-side (never trust client)", "Use allowlists over denylists", "Validate type, length, format, range", "Reject invalid inputs (don't sanitize and accept)", "Validate on both client and server (UX vs security)"];
            readonly sanitization: readonly ["Sanitize output for display (not input)", "Use encoding/escaping for context", "HTML encoding for HTML context", "JavaScript encoding for JS context", "URL encoding for URL context", "SQL parameterization (not string escaping)"];
            readonly examples: readonly ["Email validation with regex", "String length limits", "Numeric range validation", "Date format validation"];
        };
        readonly sqlInjection: {
            readonly type: "SQL Injection Prevention";
            readonly validation: readonly ["Use parameterized queries/prepared statements", "Use ORM with parameterization", "Validate input types", "Use least privilege database users"];
            readonly sanitization: readonly ["Never sanitize SQL - use parameterization", "Use query builders that parameterize", "Escape is not sufficient - use parameters"];
            readonly examples: readonly ["Prepared statements with placeholders", "ORM queries with parameters", "Query builders with binding"];
        };
        readonly xss: {
            readonly type: "XSS Prevention";
            readonly validation: readonly ["Validate and sanitize HTML input", "Use Content Security Policy (CSP)", "Validate URLs in links", "Validate JavaScript in user input"];
            readonly sanitization: readonly ["HTML encode for HTML context", "JavaScript encode for JS context", "Attribute encode for HTML attributes", "URL encode for URL context", "Use libraries like DOMPurify for HTML"];
            readonly examples: readonly ["Escape < > & \" ' characters", "CSP headers to prevent inline scripts", "Sanitize user-generated HTML"];
        };
        readonly csrf: {
            readonly type: "CSRF Prevention";
            readonly validation: readonly ["Validate CSRF tokens", "Check SameSite cookie attribute", "Verify origin/referer headers", "Use state parameter in OAuth"];
            readonly sanitization: readonly ["Not applicable - CSRF is about request validation"];
            readonly examples: readonly ["CSRF tokens in forms", "SameSite=Strict cookies", "Origin header validation"];
        };
    };
    /**
     * API Security
     */
    readonly apiSecurity: {
        readonly rateLimiting: {
            readonly description: "Limit number of requests per time period";
            readonly implementation: readonly ["Implement rate limiting per IP/user/API key", "Use token bucket or sliding window algorithm", "Set appropriate limits (requests per minute/hour)", "Return 429 Too Many Requests status", "Include rate limit headers (X-RateLimit-*)"];
            readonly considerations: readonly ["Distributed rate limiting for microservices", "Different limits for different endpoints", "Bypass for authenticated vs unauthenticated", "Rate limit headers for client awareness"];
        };
        readonly apiKeyManagement: {
            readonly description: "Secure API key generation and storage";
            readonly implementation: readonly ["Generate cryptographically random API keys", "Hash API keys before storage (like passwords)", "Use prefixes to identify key type", "Implement key rotation", "Revoke compromised keys", "Rate limit per API key"];
            readonly considerations: readonly ["Key storage security", "Key transmission security (HTTPS)", "Key rotation procedures", "Key scoping/permissions"];
        };
        readonly cors: {
            readonly description: "Cross-Origin Resource Sharing configuration";
            readonly implementation: readonly ["Use specific origins (not *)", "Use allowlists for allowed origins", "Set appropriate CORS headers", "Handle preflight requests", "Don't allow credentials with wildcard origin"];
            readonly considerations: readonly ["Security vs functionality tradeoff", "Credential handling", "Preflight request handling"];
        };
        readonly https: {
            readonly description: "Enforce HTTPS for all communications";
            readonly implementation: readonly ["Redirect HTTP to HTTPS", "Use HSTS header", "Validate SSL/TLS certificates", "Use strong cipher suites", "Implement certificate pinning for mobile apps"];
            readonly considerations: readonly ["HSTS preload list", "Certificate expiration monitoring", "TLS version (1.2+ minimum)"];
        };
    };
    /**
     * Data Security
     */
    readonly dataSecurity: {
        readonly encryptionAtRest: {
            readonly description: "Encrypt data stored in databases/files";
            readonly implementation: readonly ["Use database encryption", "Encrypt sensitive files", "Secure key management", "Encrypt backups"];
            readonly considerations: readonly ["Key management and rotation", "Performance impact", "Backup encryption"];
        };
        readonly encryptionInTransit: {
            readonly description: "Encrypt data during transmission";
            readonly implementation: readonly ["Use TLS/HTTPS", "Use strong cipher suites", "Validate certificates", "Use certificate pinning for mobile"];
            readonly considerations: readonly ["TLS version support", "Certificate validation", "Perfect forward secrecy"];
        };
        readonly piiHandling: {
            readonly description: "Protect Personally Identifiable Information";
            readonly implementation: readonly ["Identify PII in application", "Minimize PII collection", "Encrypt PII at rest and in transit", "Implement access controls", "Log PII access", "Implement data retention policies", "Secure data deletion"];
            readonly considerations: readonly ["GDPR compliance", "Data minimization", "Right to deletion", "Data anonymization"];
        };
        readonly secureStorage: {
            readonly description: "Secure storage patterns for sensitive data";
            readonly implementation: readonly ["Never store secrets in code", "Use environment variables for secrets", "Use secret management services", "Encrypt sensitive configuration", "Use secure key storage"];
            readonly considerations: readonly ["Secret rotation", "Access to secrets", "Secret leakage prevention"];
        };
    };
    /**
     * Security Headers
     */
    readonly securityHeaders: {
        readonly contentSecurityPolicy: {
            readonly header: "Content-Security-Policy";
            readonly description: "Prevent XSS attacks by controlling resource loading";
            readonly value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';";
            readonly considerations: readonly ["Restrictive policies", "Nonce/hash for inline scripts", "Report-URI for violations"];
        };
        readonly strictTransportSecurity: {
            readonly header: "Strict-Transport-Security";
            readonly description: "Force HTTPS connections";
            readonly value: "max-age=31536000; includeSubDomains; preload";
            readonly considerations: readonly ["Max-age duration", "Include subdomains", "Preload list"];
        };
        readonly xFrameOptions: {
            readonly header: "X-Frame-Options";
            readonly description: "Prevent clickjacking";
            readonly value: "DENY or SAMEORIGIN";
            readonly considerations: readonly ["DENY is most secure", "SAMEORIGIN if frames needed"];
        };
        readonly xContentTypeOptions: {
            readonly header: "X-Content-Type-Options";
            readonly description: "Prevent MIME type sniffing";
            readonly value: "nosniff";
            readonly considerations: readonly ["Simple but important"];
        };
        readonly referrerPolicy: {
            readonly header: "Referrer-Policy";
            readonly description: "Control referrer information";
            readonly value: "strict-origin-when-cross-origin";
            readonly considerations: readonly ["Balance privacy and functionality"];
        };
        readonly permissionsPolicy: {
            readonly header: "Permissions-Policy";
            readonly description: "Control browser features";
            readonly value: "geolocation=(), microphone=(), camera=()";
            readonly considerations: readonly ["Disable unnecessary features", "Granular control"];
        };
    };
};
/**
 * Check code for security vulnerabilities
 */
export declare function checkSecurityVulnerability(code: string, vulnerabilityType: keyof typeof SECURITY_PATTERNS.owaspTop10): boolean;
/**
 * Get security best practices for vulnerability type
 */
export declare function getSecurityBestPractices(vulnerabilityType: keyof typeof SECURITY_PATTERNS.owaspTop10): string[];
/**
 * Type exports
 */
export type { OWASPVulnerability, SecuritySeverity, AuthenticationPattern, AuthorizationPattern, InputValidationPattern };
//# sourceMappingURL=layer-24-security-patterns.d.ts.map