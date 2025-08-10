// js/main.js
// Main Entry Point
import { soundManager } from './utils/sound.js';
import { uiManager } from './components/ui-manager.js';
import { characterCreator } from './components/character-creator.js';
import { gameInterface } from './components/game-interface.js';
import { gameController } from './controllers/game-controller.js';
import { performanceManager } from './utils/performance.js';
import { securityManager } from './utils/security.js';
import { accessibilityManager } from './utils/accessibility.js';

class GameApplication {
    constructor() {
        this.isInitialized = false;
        this.errorCount = 0;
        this.maxErrors = 5;
        this.eventListeners = new Map();
    }

    async initialize() {
        try {
            console.log('🎮 Realms of Adventure initializing...');
            
            // Hide loading screen when everything is ready
            await this.showLoadingScreen();
            
            // Initialize managers
            await this.initializeManagers();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup button event listeners
            this.setupButtonEventListeners();
            
            // Initialize the application
            await this.initializeApplication();
            
            // Hide loading screen
            await this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ Realms of Adventure initialized successfully');
            
            // Announce to screen readers
            accessibilityManager.announceSuccess('Game loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.handleInitializationError(error);
        }
    }

    async showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            loadingScreen.setAttribute('aria-hidden', 'false');
        }
    }

    async hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Add a small delay for smooth transition
            await new Promise(resolve => setTimeout(resolve, 500));
            loadingScreen.classList.remove('active');
            loadingScreen.setAttribute('aria-hidden', 'true');
        }
    }

    async initializeManagers() {
        try {
            // Initialize sound manager (but wait for user interaction)
            soundManager.init();
            
            // Initialize performance manager
            performanceManager.initializeMonitoring();
            
            // Initialize accessibility manager
            accessibilityManager.setupMobileAccessibility();
            
            console.log('🔧 Managers initialized');
        } catch (error) {
            console.error('Failed to initialize managers:', error);
            throw error;
        }
    }

    setupGlobalEventListeners() {
        // Handle window resize with performance optimization
        const handleResize = performanceManager.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', handleResize);
        this.eventListeners.set('resize', handleResize);
        
        // Handle before unload to warn about unsaved progress
        window.addEventListener('beforeunload', (e) => {
            if (gameController.isGameRunning()) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });
        
        // Handle visibility change (pause/resume game when tab is not visible)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        console.log('🎧 Global event listeners setup complete');
    }

    setupButtonEventListeners() {
        console.log('🔘 Setting up button event listeners...');
        
        // Main menu buttons - remove inline handlers and use proper event listeners
        const buttons = [
            { id: 'startNewAdventureBtn', handler: this.handleStartNewAdventure.bind(this) },
            { id: 'showLoadGameBtn', handler: this.handleShowLoadGame.bind(this) },
            { id: 'showHelpBtn', handler: this.handleShowHelp.bind(this) },
            { id: 'submitCommandBtn', handler: this.handleSubmitCommand.bind(this) }
        ];
        
        buttons.forEach(({ id, handler }) => {
            const button = document.getElementById(id);
            if (button) {
                // Remove any existing inline handlers
                button.removeAttribute('onclick');
                
                // Add proper event listener
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    performanceManager.startMeasure(`button-${id}`);
                    handler(e);
                    performanceManager.endMeasure(`button-${id}`);
                });
                
                console.log(`✅ ${id} button listener attached`);
            } else {
                console.error(`❌ ${id} button not found`);
            }
        });
        
        // Setup other interactive elements
        this.setupInteractiveElements();
        
        console.log('✅ Button event listeners setup complete');
    }

    setupInteractiveElements() {
        // Setup command input
        const commandInput = document.getElementById('commandInput');
        if (commandInput) {
            commandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmitCommand(e);
                }
            });
        }
        
        // Setup back buttons
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBackButton(e);
            });
        });
    }

    async initializeApplication() {
        try {
            // Make instances globally available for onclick handlers (legacy support)
            this.setupGlobalInstances();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Run diagnostics
            await this.runDiagnostics();
            
            console.log('🚀 Application initialized');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    setupGlobalInstances() {
        // Make instances globally available for legacy onclick handlers
        window.soundManager = soundManager;
        window.uiManager = uiManager;
        window.characterCreator = characterCreator;
        window.gameInterface = gameInterface;
        window.gameController = gameController;
        
        // Global functions for onclick handlers (legacy support)
        window.startNewAdventure = () => this.handleStartNewAdventure();
        window.showLoadGame = () => this.handleShowLoadGame();
        window.showHelp = () => this.handleShowHelp();
        window.backToMenu = () => this.handleBackToMenu();
        window.saveGame = () => this.handleSaveGame();
        window.endAdventure = () => this.handleEndAdventure();
        window.toggleContextHelp = () => this.handleToggleContextHelp();
        window.loadGame = () => this.handleLoadGame();
        
        console.log('🌐 Global instances setup complete');
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });
        
        console.log('🛡️ Error handling setup complete');
    }

    async runDiagnostics() {
        console.log('🔍 Running diagnostics...');
        
        // Test button functionality
        await this.testButtonFunctionality();
        
        // Test screen availability
        await this.testScreenAvailability();
        
        // Test manager availability
        await this.testManagerAvailability();
        
        console.log('✅ Diagnostics complete');
    }

    async testButtonFunctionality() {
        console.log('🔘 Testing button functionality...');
        
        const buttons = [
            { id: 'startNewAdventureBtn', name: 'Start New Adventure' },
            { id: 'showLoadGameBtn', name: 'Load Saved Game' },
            { id: 'showHelpBtn', name: 'How to Play' }
        ];
        
        for (const { id, name } of buttons) {
            const button = document.getElementById(id);
            if (button) {
                console.log(`✅ ${name} button exists and is functional`);
            } else {
                console.error(`❌ ${name} button not found`);
            }
        }
    }

    async testScreenAvailability() {
        console.log('🖥️ Testing screen availability...');
        
        const screens = ['mainMenu', 'characterCreation', 'gameInterface', 'helpScreen'];
        for (const screenId of screens) {
            const screen = document.getElementById(screenId);
            if (screen) {
                console.log(`✅ Screen ${screenId} exists`);
            } else {
                console.error(`❌ Screen ${screenId} not found`);
            }
        }
    }

    async testManagerAvailability() {
        console.log('🧪 Testing manager availability...');
        
        const managers = [
            { name: 'soundManager', instance: soundManager },
            { name: 'uiManager', instance: uiManager },
            { name: 'characterCreator', instance: characterCreator },
            { name: 'gameInterface', instance: gameInterface },
            { name: 'gameController', instance: gameController }
        ];
        
        for (const { name, instance } of managers) {
            if (instance) {
                console.log(`✅ ${name} is available`);
            } else {
                console.error(`❌ ${name} is not available`);
            }
        }
    }

    // Event handlers
    handleStartNewAdventure(event) {
        try {
            console.log('🎮 Start New Adventure clicked');
            soundManager.playClickSound();
            gameController.startNewAdventure();
        } catch (error) {
            this.handleError(error, 'Failed to start new adventure');
        }
    }

    handleShowLoadGame(event) {
        try {
            console.log('🎮 Load Game clicked');
            soundManager.playClickSound();
            gameController.showLoadGame();
        } catch (error) {
            this.handleError(error, 'Failed to show load game');
        }
    }

    handleShowHelp(event) {
        try {
            console.log('🎮 Help clicked');
            soundManager.playClickSound();
            gameController.showHelp();
        } catch (error) {
            this.handleError(error, 'Failed to show help');
        }
    }

    handleSubmitCommand(event) {
        try {
            console.log('🎮 Command submitted');
            const commandInput = document.getElementById('commandInput');
            if (commandInput) {
                const command = commandInput.value.trim();
                if (command) {
                    gameController.processCommand(command);
                    commandInput.value = '';
                }
            }
        } catch (error) {
            this.handleError(error, 'Failed to submit command');
        }
    }

    handleBackButton(event) {
        try {
            console.log('🎮 Back button clicked');
            soundManager.playClickSound();
            uiManager.showScreen('mainMenu');
        } catch (error) {
            this.handleError(error, 'Failed to go back');
        }
    }

    handleBackToMenu() {
        try {
            console.log('🎮 Back to menu requested');
            soundManager.playClickSound();
            uiManager.showScreen('mainMenu');
        } catch (error) {
            this.handleError(error, 'Failed to go back to menu');
        }
    }

    handleSaveGame() {
        try {
            console.log('🎮 Save game requested');
            soundManager.playClickSound();
            gameController.saveGame();
        } catch (error) {
            this.handleError(error, 'Failed to save game');
        }
    }

    handleEndAdventure() {
        try {
            console.log('🎮 End adventure requested');
            soundManager.playClickSound();
            gameController.endAdventure();
        } catch (error) {
            this.handleError(error, 'Failed to end adventure');
        }
    }

    handleToggleContextHelp() {
        try {
            console.log('🎮 Toggle context help requested');
            soundManager.playClickSound();
            gameInterface.toggleContextHelp();
        } catch (error) {
            this.handleError(error, 'Failed to toggle context help');
        }
    }

    handleLoadGame() {
        try {
            console.log('🎮 Load game requested');
            soundManager.playClickSound();
            gameController.loadGameFromTextarea();
        } catch (error) {
            this.handleError(error, 'Failed to load game');
        }
    }

    // Utility methods
    handleResize() {
        // Handle responsive adjustments
        console.log('📱 Window resized');
        
        // Update any responsive elements
        this.updateResponsiveElements();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            if (gameController.isGameRunning()) {
                gameController.pauseGame();
                console.log('⏸️ Game paused (tab hidden)');
            }
        } else {
            if (gameController.isGameRunning()) {
                gameController.resumeGame();
                console.log('▶️ Game resumed (tab visible)');
            }
        }
    }

    handleKeyboardShortcuts(event) {
        const key = event.key.toLowerCase();
        const modifiers = {
            alt: event.altKey,
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            meta: event.metaKey
        };

        // Global shortcuts
        if (key === 'escape') {
            this.handleEscapeKey();
        } else if (modifiers.ctrl && key === 's') {
            event.preventDefault();
            this.handleSaveGame();
        } else if (modifiers.ctrl && key === 'l') {
            event.preventDefault();
            this.handleShowLoadGame();
        } else if (modifiers.ctrl && key === 'h') {
            event.preventDefault();
            this.handleShowHelp();
        }
    }

    handleEscapeKey() {
        console.log('🚪 Escape key pressed');
        
        // Close any open modals first
        if (uiManager.modals.length > 0) {
            uiManager.closeTopModal();
            return;
        }
        
        // Go back to main menu if not already there
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen && currentScreen.id !== 'mainMenu') {
            this.handleBackToMenu();
        }
    }

    updateResponsiveElements() {
        // Update responsive elements based on screen size
        const isMobile = window.innerWidth <= 768;
        
        // Update mobile-specific elements
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('desktop', !isMobile);
    }

    // Error handling methods
    handleGlobalError(event) {
        console.error('🚨 Global error:', event.error);
        
        this.errorCount++;
        if (this.errorCount > this.maxErrors) {
            this.handleTooManyErrors();
            return;
        }
        
        this.handleError(event.error, 'Global error occurred');
    }

    handleUnhandledRejection(event) {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        
        this.errorCount++;
        if (this.errorCount > this.maxErrors) {
            this.handleTooManyErrors();
            return;
        }
        
        this.handleError(event.reason, 'Unhandled promise rejection');
    }

    handleError(error, message = 'An error occurred') {
        console.error('🚨 Error:', error);
        
        // Show error to user
        uiManager.showError(`${message}: ${error.message}`);
        
        // Announce to screen readers
        accessibilityManager.announceError(message);
        
        // Log error for debugging
        this.logError(error, message);
    }

    handleInitializationError(error) {
        console.error('🚨 Initialization error:', error);
        
        // Show critical error to user
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-content">
                    <h2>Failed to Initialize Game</h2>
                    <p>${error.message}</p>
                    <p>Please refresh the page and try again.</p>
                    <button onclick="window.location.reload()" class="retry-button">
                        <i class="fas fa-refresh"></i>
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    handleTooManyErrors() {
        console.error('🚨 Too many errors occurred');
        
        // Show critical error and disable the game
        uiManager.showError('Too many errors occurred. Please refresh the page.');
        
        // Disable game functionality
        this.disableGame();
    }

    disableGame() {
        // Disable all interactive elements
        const interactiveElements = document.querySelectorAll('button, input, select, textarea');
        interactiveElements.forEach(element => {
            element.disabled = true;
        });
        
        // Show error message
        const gameContainer = document.getElementById('main-content');
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div class="critical-error">
                    <h2>Game Disabled</h2>
                    <p>The game has been disabled due to too many errors.</p>
                    <p>Please refresh the page to try again.</p>
                </div>
            `;
        }
    }

    logError(error, message) {
        // In a real implementation, this would send errors to a logging service
        console.error('Error logged:', {
            message,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }

    // Cleanup method
    cleanup() {
        console.log('🧹 Cleaning up application...');
        
        // Remove event listeners
        this.eventListeners.forEach((listener, event) => {
            window.removeEventListener(event, listener);
        });
        this.eventListeners.clear();
        
        // Cleanup managers
        soundManager.cleanup();
        performanceManager.cleanup();
        accessibilityManager.cleanup();
        
        // Remove global instances
        delete window.soundManager;
        delete window.uiManager;
        delete window.characterCreator;
        delete window.gameInterface;
        delete window.gameController;
        
        console.log('✅ Application cleanup complete');
    }
}

// Create and initialize the application
const gameApp = new GameApplication();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    gameApp.initialize().catch(error => {
        console.error('Failed to initialize game application:', error);
    });
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameApp,
        soundManager,
        uiManager,
        characterCreator,
        gameInterface,
        gameController,
        performanceManager,
        securityManager,
        accessibilityManager
    };
}
