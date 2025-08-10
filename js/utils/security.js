// js/utils/security.js
export class SecurityManager {
    constructor() {
        this.salt = this.generateSalt();
        this.allowedTags = new Set([
            'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'em', 'i', 'b', 'u', 'br', 'hr'
        ]);
    }

    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Simple hash function for data validation
    hash(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data + this.salt);
        return crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        });
    }

    // Sanitize HTML to prevent XSS
    sanitizeHTML(html) {
        if (!html || typeof html !== 'string') return '';
        
        const tempDiv = document.createElement('div');
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
    }

    // Sanitize text content
    sanitizeText(text) {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    }

    // Validate input with regex patterns
    validateInput(input, type = 'text') {
        if (!input || typeof input !== 'string') return false;
        
        const patterns = {
            name: /^[a-zA-Z0-9\s\-_']{2,30}$/,
            text: /^[a-zA-Z0-9\s\-_.,!?;:'"()]{1,500}$/,
            number: /^\d+$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            command: /^[a-zA-Z0-9\s\-_.,!?;:'"()]{1,100}$/
        };
        
        return patterns[type] ? patterns[type].test(input) : patterns.text.test(input);
    }

    // Validate save data integrity
    async validateSaveData(saveData) {
        try {
            if (!saveData || typeof saveData !== 'string') {
                throw new Error('Invalid save data format');
            }

            // Check for malicious content
            if (this.containsMaliciousContent(saveData)) {
                throw new Error('Save data contains malicious content');
            }

            // Basic structure validation
            if (!saveData.includes('=== MULTIPLAYER SAVE SESSION ===') ||
                !saveData.includes('=== END SAVE SESSION ===')) {
                throw new Error('Invalid save data structure');
            }

            return true;
        } catch (error) {
            console.error('Save data validation failed:', error);
            return false;
        }
    }

    containsMaliciousContent(content) {
        const maliciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /data:text\/html/i,
            /vbscript:/i,
            /eval\s*\(/i
        ];

        return maliciousPatterns.some(pattern => pattern.test(content));
    }

    // Encrypt sensitive data
    async encrypt(data, password) {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            
            // Generate key from password
            const passwordBuffer = encoder.encode(password);
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                passwordBuffer,
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );
            
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );
            
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encryptedData = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                dataBuffer
            );
            
            // Combine salt, iv, and encrypted data
            const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
            
            return btoa(String.fromCharCode.apply(null, combined));
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt data');
        }
    }

    // Decrypt sensitive data
    async decrypt(encryptedData, password) {
        try {
            const combined = new Uint8Array(
                atob(encryptedData)
                    .split('')
                    .map(char => char.charCodeAt(0))
            );
            
            const salt = combined.slice(0, 16);
            const iv = combined.slice(16, 28);
            const data = combined.slice(28);
            
            const encoder = new TextEncoder();
            const passwordBuffer = encoder.encode(password);
            
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                passwordBuffer,
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );
            
            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
            
            const decryptedData = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );
            
            return new TextDecoder().decode(decryptedData);
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Failed to decrypt data');
        }
    }

    // Generate CSRF token
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Rate limiting helper
    createRateLimiter(maxRequests, timeWindow) {
        const requests = [];
        
        return async function(identifier) {
            const now = Date.now();
            const windowStart = now - timeWindow;
            
            // Remove old requests
            while (requests.length > 0 && requests[0].timestamp < windowStart) {
                requests.shift();
            }
            
            // Check if limit exceeded
            const userRequests = requests.filter(req => req.identifier === identifier);
            if (userRequests.length >= maxRequests) {
                throw new Error('Rate limit exceeded');
            }
            
            // Add new request
            requests.push({ identifier, timestamp: now });
            return true;
        };
    }
}

// Export singleton instance
export const securityManager = new SecurityManager();
