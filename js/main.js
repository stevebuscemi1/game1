// Main Entry Point
import { soundManager } from './utils/sound.js';
import { uiManager } from './components/ui-manager.js';
import { characterCreator } from './components/character-creator.js';
import { gameInterface } from './components/game-interface.js';
import { gameController } from './controllers/game-controller.js';

// Make instances globally available for onclick handlers
window.soundManager = soundManager;
window.uiManager = uiManager;
window.characterCreator = characterCreator;
window.gameInterface = gameInterface;
window.gameController = gameController;

// Global functions for onclick handlers
window.startNewAdventure = () => gameController.startNewAdventure();
window.showLoadGame = () => gameController.showLoadGame();
window.showHelp = () => gameController.showHelp();
window.backToMenu = () => uiManager.showScreen('mainMenu');
window.saveGame = () => gameController.saveGame();
window.endAdventure = () => gameController.endAdventure();
window.toggleContextHelp = () => gameInterface.toggleContextHelp();
window.loadGame = () => gameController.loadGameFromTextarea();

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Realms of Adventure initialized');
    
    // Initialize sound manager (but wait for user interaction)
    soundManager.init();
    
    // Set up any additional initialization
    setupGlobalEventListeners();
    
    // Setup button event listeners
    setupButtonEventListeners();
    
    // Debug: Log that functions are available
    console.log('Global functions available:', {
        startNewAdventure: typeof window.startNewAdventure,
        showLoadGame: typeof window.showLoadGame,
        showHelp: typeof window.showHelp,
        backToMenu: typeof window.backToMenu,
        saveGame: typeof window.saveGame,
        endAdventure: typeof window.endAdventure,
        toggleContextHelp: typeof window.toggleContextHelp,
        loadGame: typeof window.loadGame
    });
});



// Setup button event listeners
function setupButtonEventListeners() {
    console.log('Setting up button event listeners...');
    
    // Main menu buttons
    const startNewAdventureBtn = document.getElementById('startNewAdventureBtn');
    const showLoadGameBtn = document.getElementById('showLoadGameBtn');
    const showHelpBtn = document.getElementById('showHelpBtn');
    
    if (startNewAdventureBtn) {
        console.log('Found Start New Adventure button, adding listener...');
        startNewAdventureBtn.addEventListener('click', (e) => {
            console.log('🔥 Start New Adventure button CLICKED!');
            e.preventDefault();
            gameController.startNewAdventure();
        });
    } else {
        console.error('Start New Adventure button not found');
    }
    
    if (showLoadGameBtn) {
        console.log('Found Load Game button, adding listener...');
        showLoadGameBtn.addEventListener('click', (e) => {
            console.log('🔥 Load Game button CLICKED!');
            e.preventDefault();
            gameController.showLoadGame();
        });
    } else {
        console.error('Load Game button not found');
    }
    
    if (showHelpBtn) {
        console.log('Found Help button, adding listener...');
        showHelpBtn.addEventListener('click', (e) => {
            console.log('🔥 Help button CLICKED!');
            e.preventDefault();
            gameController.showHelp();
        });
    } else {
        console.error('Help button not found');
    }
    
    console.log('Button event listeners setup complete');
}
    
    // Also add event listeners for other buttons if needed
    const saveGameBtn = document.querySelector('.control-button[onclick="saveGame()"]');
    if (saveGameBtn) {
        saveGameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            gameController.saveGame();
        });
    }
    
    const endAdventureBtn = document.querySelector('.control-button[onclick="endAdventure()"]');
    if (endAdventureBtn) {
        endAdventureBtn.addEventListener('click', (e) => {
            e.preventDefault();
            gameController.endAdventure();
        });
    }
    
    const helpButton = document.querySelector('.help-button[onclick="toggleContextHelp()"]');
    if (helpButton) {
        helpButton.addEventListener('click', (e) => {
            e.preventDefault();
            gameInterface.toggleContextHelp();
        });
    }
    
    const backToMenuBtn = document.querySelector('.menu-button[onclick="backToMenu()"]');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            uiManager.showScreen('mainMenu');
        });
    }
    
    const loadGameTextareaBtn = document.querySelector('.option-card[onclick="loadGame()"]');
    if (loadGameTextareaBtn) {
        loadGameTextareaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            gameController.loadGameFromTextarea();
        });
    }


// Setup global event listeners
function setupGlobalEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
        // Handle responsive adjustments if needed
    });
    
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
        if (document.hidden) {
            if (gameController.isGameRunning()) {
                gameController.pauseGame();
            }
        } else {
            if (gameController.isGameRunning()) {
                gameController.resumeGame();
            }
        }
    });
}

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        soundManager,
        uiManager,
        characterCreator,
        gameInterface,
        gameController
    };
}

// Add this at the very end of main.js
setTimeout(() => {
    console.log('=== BUTTON FUNCTIONALITY TEST ===');
    
    // Test button click handlers
    const buttons = [
        { id: 'startNewAdventureBtn', name: 'Start New Adventure', handler: 'startNewAdventure' },
        { id: 'showLoadGameBtn', name: 'Load Saved Game', handler: 'showLoadGame' },
        { id: 'showHelpBtn', name: 'How to Play', handler: 'showHelp' }
    ];
    
    buttons.forEach(({ id, name, handler }) => {
        const button = document.getElementById(id);
        if (button) {
            console.log(`Testing ${name} button...`);
            
            // Check if the button has event listeners
            const hasClickListener = button.onclick || button.addEventListener;
            console.log(`${name} has click listener: ${!!hasClickListener}`);
            
            // Test the global function directly
            if (window[handler]) {
                console.log(`${name} handler function exists: ${typeof window[handler]}`);
                
                // Test calling the function
                try {
                    console.log(`Calling ${handler}()...`);
                    window[handler]();
                    console.log(`✓ ${name} function executed successfully`);
                } catch (error) {
                    console.error(`✗ Error calling ${handler}:`, error);
                }
            } else {
                console.log(`✗ ${name} handler function not found`);
            }
            
            // Test actual button click
            console.log(`Testing actual click on ${name} button...`);
            button.click();
        } else {
            console.log(`✗ ${name} button not found`);
        }
    });
    
    // Check current active screen
    setTimeout(() => {
        const activeScreen = document.querySelector('.screen.active');
        console.log(`Current active screen: ${activeScreen ? activeScreen.id : 'none'}`);
        
        // Test if screens exist
        const screens = ['mainMenu', 'characterCreation', 'gameInterface', 'helpScreen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            console.log(`Screen ${screenId}: ${screen ? 'exists' : 'NOT FOUND'}`);
        });
    }, 1000);
}, 2000);