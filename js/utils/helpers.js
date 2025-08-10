// Utility Helper Functions
export const helpers = {
  // DOM manipulation helpers
  getElement: (id) => document.getElementById(id),
  createElement: (tag, className = '', textContent = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  },
  
  // Screen management
  showScreen: (screenId) => {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    const screen = helpers.getElement(screenId);
    if (screen) screen.classList.add('active');
  },
  
  // Animation helpers
  addAnimation: (element, animationClass, duration = 1000) => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  },
  
  // Typewriter effect
  typeWriter: (element, text, speed = 50) => {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  },
  
  // Data validation
  validateInput: (input, minLength = 1) => {
    const value = input.trim();
    return value.length >= minLength;
  },
  
  // Format numbers
  formatNumber: (num) => {
    return num.toLocaleString();
  },
  
  // Deep clone objects
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },
  
  // Generate random number
  random: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};