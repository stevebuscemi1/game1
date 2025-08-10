// js/utils/accessibility.js
export class AccessibilityManager {
    constructor() {
        this.announcements = [];
        this.liveRegions = new Map();
        this.focusTrap = null;
        this.keyboardNav = new Map();
        this.highContrastMode = false;
        this.reducedMotion = false;
        
        this.initializeAccessibility();
    }

    initializeAccessibility() {
        this.setupLiveRegions();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.detectUserPreferences();
        this.setupScreenReaderAnnouncements();
    }

    setupLiveRegions() {
        // Create live regions for dynamic content
        const regions = [
            { id: 'status-region', ariaLive: 'polite', ariaAtomic: 'true' },
            { id: 'alert-region', ariaLive: 'assertive', ariaAtomic: 'true' },
            { id: 'log-region', ariaLive: 'polite', ariaRelevant: 'additions' }
        ];

        regions.forEach(region => {
            const element = document.createElement('div');
            element.id = region.id;
            element.setAttribute('role', 'log');
            element.setAttribute('aria-live', region.ariaLive);
            element.setAttribute('aria-atomic', region.ariaAtomic);
            if (region.ariaRelevant) {
                element.setAttribute('aria-relevant', region.ariaRelevant);
            }
            element.className = 'sr-only';
            document.body.appendChild(element);
            this.liveRegions.set(region.id, element);
        });
    }

    setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            const modifiers = {
                alt: event.altKey,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                meta: event.metaKey
            };

            // Handle common accessibility shortcuts
            if (key === 'escape') {
                this.handleEscapeKey();
            } else if (key === 'tab' && event.shiftKey) {
                this.handleShiftTab(event);
            } else if (modifiers.ctrl && key === 'k') {
                event.preventDefault();
                this.focusSearch();
            } else if (modifiers.alt && key === 'h') {
                event.preventDefault();
                this.toggleHelp();
            }
        });

        // Setup ARIA keyboard navigation for interactive elements
        this.setupARIAKeyboardNavigation();
    }

    setupARIAKeyboardNavigation() {
        // Handle arrow key navigation for custom components
        document.addEventListener('keydown', (event) => {
            const target = event.target;
            
            if (target.getAttribute('role') === 'menu' || 
                target.getAttribute('role') === 'listbox' ||
                target.getAttribute('role') === 'grid') {
                this.handleArrowKeyNavigation(event);
            }
            
            if (target.getAttribute('role') === 'tree' || 
                target.getAttribute('role') === 'treegrid') {
                this.handleTreeNavigation(event);
            }
        });
    }

    handleArrowKeyNavigation(event) {
        const target = event.target;
        const key = event.key;
        const items = target.querySelectorAll('[role^="menuitem"], [role="option"], [role="gridcell"]');
        
        if (items.length === 0) return;
        
        const currentIndex = Array.from(items).indexOf(document.activeElement);
        let newIndex = currentIndex;
        
        switch (key) {
            case 'ArrowDown':
            case 'ArrowRight':
                newIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                newIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = items.length - 1;
                break;
            default:
                return;
        }
        
        if (newIndex !== currentIndex && items[newIndex]) {
            event.preventDefault();
            items[newIndex].focus();
        }
    }

    handleTreeNavigation(event) {
        // Handle tree-specific navigation (expand/collapse, etc.)
        const target = event.target;
        const key = event.key;
        
        if (key === 'ArrowRight' && target.getAttribute('aria-expanded') === 'false') {
            event.preventDefault();
            this.expandTreeNode(target);
        } else if (key === 'ArrowLeft' && target.getAttribute('aria-expanded') === 'true') {
            event.preventDefault();
            this.collapseTreeNode(target);
        }
    }

    expandTreeNode(node) {
        node.setAttribute('aria-expanded', 'true');
        this.announceToScreenReader('Expanded');
    }

    collapseTreeNode(node) {
        node.setAttribute('aria-expanded', 'false');
        this.announceToScreenReader('Collapsed');
    }

    setupFocusManagement() {
        // Store initial focus
        this.initialFocus = document.activeElement;
        
        // Setup focus trap for modals
        this.setupFocusTrap();
        
        // Manage focus for dynamic content
        this.setupDynamicFocusManagement();
    }

    setupFocusTrap() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
                if (modal) {
                    this.trapFocus(event, modal);
                }
            }
        });
    }

    trapFocus(event, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    setupDynamicFocusManagement() {
        // Auto-focus management for dynamically added content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.handleNewElement(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    handleNewElement(element) {
        // Auto-focus elements with autofocus attribute
        if (element.hasAttribute('autofocus')) {
            setTimeout(() => element.focus(), 100);
        }
        
        // Setup ARIA attributes for interactive elements
        this.setupARIAAttributes(element);
    }

    setupARIAAttributes(element) {
        // Add ARIA attributes to common interactive elements
        const interactiveElements = element.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(el => {
            if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
                const text = el.textContent.trim();
                if (text) {
                    el.setAttribute('aria-label', text);
                }
            }
        });
    }

    detectUserPreferences() {
        // Detect high contrast mode
        this.highContrastMode = window.matchMedia('(prefers-contrast: high)').matches;
        
        // Detect reduced motion preference
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Apply preferences
        this.applyUserPreferences();
        
        // Listen for preference changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            this.highContrastMode = e.matches;
            this.applyUserPreferences();
        });
        
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.applyUserPreferences();
        });
    }

    applyUserPreferences() {
        if (this.highContrastMode) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        if (this.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    setupScreenReaderAnnouncements() {
        // Setup announcement queue
        this.announcementQueue = [];
        this.announcementTimer = null;
    }

    announceToScreenReader(message, priority = 'polite') {
        if (!message || typeof message !== 'string') return;
        
        this.announcementQueue.push({ message, priority });
        
        if (!this.announcementTimer) {
            this.announcementTimer = setTimeout(() => {
                this.processAnnouncements();
            }, 100);
        }
    }

    processAnnouncements() {
        if (this.announcementQueue.length === 0) {
            this.announcementTimer = null;
            return;
        }
        
        const announcement = this.announcementQueue.shift();
        const region = announcement.priority === 'assertive' ? 
            this.liveRegions.get('alert-region') : 
            this.liveRegions.get('status-region');
        
        if (region) {
            region.textContent = announcement.message;
            
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
        
        // Process next announcement
        this.announcementTimer = setTimeout(() => {
            this.processAnnouncements();
        }, 200);
    }

    // Accessibility helper methods
    manageFocus(element, options = {}) {
        const { preventScroll = false, delay = 0 } = options;
        
        if (delay > 0) {
            setTimeout(() => {
                element.focus({ preventScroll });
            }, delay);
        } else {
            element.focus({ preventScroll });
        }
    }

    announcePageChange(pageTitle) {
        this.announceToScreenReader(`Navigated to ${pageTitle}`, 'assertive');
    }

    announceError(message) {
        this.announceToScreenReader(`Error: ${message}`, 'assertive');
    }

    announceSuccess(message) {
        this.announceToScreenReader(`Success: ${message}`, 'polite');
    }

    announceAction(action, target) {
        this.announceToScreenReader(`${action} ${target}`, 'polite');
    }

    handleEscapeKey() {
        // Close modals, dropdowns, etc.
        const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (modal) {
            const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="cancel"]');
            if (closeButton) {
                closeButton.click();
            }
        }
        
        // Close dropdowns
        const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
        dropdowns.forEach(dropdown => {
            dropdown.setAttribute('aria-expanded', 'false');
        });
    }

    handleShiftTab(event) {
        // Handle special shift+tab behavior if needed
    }

    focusSearch() {
        const searchInput = document.querySelector('input[type="search"], input[aria-label*="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    toggleHelp() {
        const helpButton = document.querySelector('[aria-label*="help"], .help-button');
        if (helpButton) {
            helpButton.click();
        }
    }

    // Mobile accessibility
    setupMobileAccessibility() {
        // Setup touch feedback
        this.setupTouchFeedback();
        
        // Setup viewport management
        this.setupViewportManagement();
    }

    setupTouchFeedback() {
        // Add touch feedback for interactive elements
        const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                element.classList.remove('touch-active');
            });
        });
    }

    setupViewportManagement() {
        // Prevent zoom on input focus for mobile
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            const inputs = document.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                });
                
                input.addEventListener('blur', () => {
                    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                });
            });
        }
    }

    // Cleanup
    cleanup() {
        // Remove live regions
        this.liveRegions.forEach(region => region.remove());
        this.liveRegions.clear();
        
        // Clear announcement queue
        this.announcementQueue = [];
        if (this.announcementTimer) {
            clearTimeout(this.announcementTimer);
        }
        
        // Remove event listeners
        // (Note: In a real implementation, you'd store references to remove them properly)
    }
}

// Export singleton instance
export const accessibilityManager = new AccessibilityManager();
