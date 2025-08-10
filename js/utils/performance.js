// js/utils/performance.js
export class PerformanceManager {
    constructor() {
        this.cache = new Map();
        this.observers = new Map();
        this.debounceTimers = new Map();
        this.throttleFlags = new Map();
        this.memoryMonitor = null;
        this.performanceMetrics = {
            renderTimes: [],
            memoryUsage: [],
            frameRates: []
        };
        
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        // Monitor memory usage
        if (performance.memory) {
            this.memoryMonitor = setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage.push({
                    timestamp: Date.now(),
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                });
                
                // Keep only last 100 measurements
                if (this.performanceMetrics.memoryUsage.length > 100) {
                    this.performanceMetrics.memoryUsage.shift();
                }
            }, 5000);
        }

        // Monitor frame rate
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.frameRates.push({
                    timestamp: currentTime,
                    fps: frameCount
                });
                
                // Keep only last 60 measurements
                if (this.performanceMetrics.frameRates.length > 60) {
                    this.performanceMetrics.frameRates.shift();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFrameRate);
        };
        
        requestAnimationFrame(measureFrameRate);
    }

    // Optimized DOM element creation
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes efficiently
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children efficiently
        if (children.length > 0) {
            const fragment = document.createDocumentFragment();
            children.forEach(child => {
                if (typeof child === 'string') {
                    fragment.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    fragment.appendChild(child);
                }
            });
            element.appendChild(fragment);
        }
        
        return element;
    }

    // Batch DOM updates
    batchDOMUpdates(updates) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                const fragment = document.createDocumentFragment();
                
                updates.forEach(update => {
                    const { element, property, value } = update;
                    
                    if (property === 'innerHTML') {
                        // Use textContent for security when possible
                        if (this.isSafeHTML(value)) {
                            element.innerHTML = value;
                        } else {
                            element.textContent = value;
                        }
                    } else if (property === 'textContent') {
                        element.textContent = value;
                    } else if (property === 'className') {
                        element.className = value;
                    } else {
                        element.setAttribute(property, value);
                    }
                });
                
                resolve();
            });
        });
    }

    isSafeHTML(html) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = html;
        return tempDiv.innerHTML === html;
    }

    // Optimized event delegation
    setupEventDelegation(rootElement, eventType, selector, handler) {
        const key = `${eventType}-${selector}`;
        
        if (this.observers.has(key)) {
            this.observers.get(key).disconnect();
        }
        
        const callback = (event) => {
            const target = event.target;
            const element = target.closest(selector);
            
            if (element && rootElement.contains(element)) {
                handler.call(element, event);
            }
        };
        
        rootElement.addEventListener(eventType, callback, { passive: true });
        
        return {
            remove: () => {
                rootElement.removeEventListener(eventType, callback);
            }
        };
    }

    // Enhanced debounce with cleanup
    debounce(func, wait, key = 'default') {
        return (...args) => {
            // Clear existing timer
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            const timer = setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, wait);
            
            this.debounceTimers.set(key, timer);
        };
    }

    // Enhanced throttle with cleanup
    throttle(func, limit, key = 'default') {
        return (...args) => {
            if (!this.throttleFlags.has(key)) {
                func.apply(this, args);
                this.throttleFlags.set(key, true);
                
                setTimeout(() => {
                    this.throttleFlags.delete(key);
                }, limit);
            }
        };
    }

    // Memory-efficient caching
    cache(key, value, ttl = 300000) { // 5 minutes default TTL
        const now = Date.now();
        const expiry = now + ttl;
        
        this.cache.set(key, {
            value,
            expiry,
            timestamp: now
        });
        
        // Clean up expired items
        this.cleanupCache();
    }

    getFromCache(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    cleanupCache() {
        const now = Date.now();
        
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }

    // Virtual scrolling helper
    createVirtualScroll(container, itemHeight, totalItems, renderItem) {
        let scrollTop = 0;
        let visibleItems = [];
        
        const updateVisibleItems = () => {
            const containerHeight = container.clientHeight;
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(
                startIndex + Math.ceil(containerHeight / itemHeight) + 1,
                totalItems
            );
            
            visibleItems = [];
            for (let i = startIndex; i < endIndex; i++) {
                visibleItems.push({
                    index: i,
                    top: i * itemHeight,
                    element: renderItem(i)
                });
            }
            
            this.renderVirtualList();
        };
        
        const renderVirtualList = () => {
            const fragment = document.createDocumentFragment();
            
            visibleItems.forEach(item => {
                const element = item.element;
                element.style.position = 'absolute';
                element.style.top = `${item.top}px`;
                element.style.width = '100%';
                fragment.appendChild(element);
            });
            
            // Clear and re-render
            container.innerHTML = '';
            container.appendChild(fragment);
            container.style.height = `${totalItems * itemHeight}px`;
        };
        
        container.addEventListener('scroll', this.throttle(() => {
            scrollTop = container.scrollTop;
            updateVisibleItems();
        }, 16)); // 60fps
        
        // Initial render
        updateVisibleItems();
        
        return {
            updateItem: (index, newItem) => {
                const visibleItem = visibleItems.find(item => item.index === index);
                if (visibleItem) {
                    visibleItem.element = newItem;
                    this.renderVirtualList();
                }
            },
            destroy: () => {
                container.removeEventListener('scroll', updateVisibleItems);
            }
        };
    }

    // Performance monitoring
    startMeasure(label) {
        performance.mark(`${label}-start`);
    }

    endMeasure(label) {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        
        const measures = performance.getEntriesByName(label);
        const duration = measures[measures.length - 1].duration;
        
        this.performanceMetrics.renderTimes.push({
            label,
            duration,
            timestamp: Date.now()
        });
        
        // Keep only last 100 measurements
        if (this.performanceMetrics.renderTimes.length > 100) {
            this.performanceMetrics.renderTimes.shift();
        }
        
        performance.clearMarks(`${label}-start`);
        performance.clearMarks(`${label}-end`);
        performance.clearMeasures(label);
        
        return duration;
    }

    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.cache.size,
            activeObservers: this.observers.size,
            activeTimers: this.debounceTimers.size
        };
    }

    // Cleanup resources
    cleanup() {
        // Clear cache
        this.cache.clear();
        
        // Clear timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        
        // Clear throttle flags
        this.throttleFlags.clear();
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Stop memory monitoring
        if (this.memoryMonitor) {
            clearInterval(this.memoryMonitor);
            this.memoryMonitor = null;
        }
        
        // Clear performance metrics
        this.performanceMetrics = {
            renderTimes: [],
            memoryUsage: [],
            frameRates: []
        };
    }
}

// Export singleton instance
export const performanceManager = new PerformanceManager();
