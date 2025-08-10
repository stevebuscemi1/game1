// js/controllers/game-controller.js
// Game Controller with enhanced error handling and memory management
import { GameState } from '../models/game-state.js';
import { Player } from '../models/player.js';
import { soundManager } from '../utils/sound.js';
import { saveLoadManager } from '../utils/save-load.js';
import { characterAvatars } from '../data/character-data.js';
import { uiManager } from '../components/ui-manager.js';
import { gameInterface } from '../components/game-interface.js';
import { securityManager } from '../utils/security.js';
import { performanceManager } from '../utils/performance.js';
import { accessibilityManager } from '../utils/accessibility.js';

export class GameController {
    constructor() {
        this.gameState = new GameState();
        this.gameInterface = gameInterface;
        this.gameInterface.setGameController(this);
        this.isGameActive = false;
        this.choiceTimeout = null;
        this.eventListeners = new Map();
        this.cleanupCallbacks = new Set();
        this.errorCount = 0;
        this.maxErrors = 10;
        
        this.initializeController();
    }

    initializeController() {
        try {
            console.log('🎮 GameController initializing...');
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup memory management
            this.setupMemoryManagement();
            
            console.log('✅ GameController initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize GameController:', error);
            throw error;
        }
    }

    setupErrorHandling() {
        // Global error handler for game controller
        this.handleControllerError = this.handleControllerError.bind(this);
        window.addEventListener('error', this.handleControllerError);
        this.cleanupCallbacks.add(() => {
            window.removeEventListener('error', this.handleControllerError);
        });
    }

    setupPerformanceMonitoring() {
        // Monitor game performance
        this.performanceMetrics = {
            turnTimes: [],
            choiceTimes: [],
            commandTimes: [],
            saveTimes: [],
            loadTimes: []
        };
        
        // Setup performance monitoring interval
        this.performanceInterval = setInterval(() => {
            this.checkPerformanceMetrics();
        }, 30000); // Check every 30 seconds
        
        this.cleanupCallbacks.add(() => {
            clearInterval(this.performanceInterval);
        });
    }

    setupMemoryManagement() {
        // Setup memory cleanup
        this.memoryCleanupInterval = setInterval(() => {
            this.cleanupMemory();
        }, 60000); // Clean up every minute
        
        this.cleanupCallbacks.add(() => {
            clearInterval(this.memoryCleanupInterval);
        });
    }

    // Start new adventure
    async startNewAdventure() {
        try {
            console.log('🎮 GameController.startNewAdventure() called');
            performanceManager.startMeasure('startNewAdventure');
            
            // Validate game state
            if (!this.validateGameState()) {
                throw new Error('Invalid game state');
            }
            
            // Play sound
            soundManager.playPopSound();
            
            // Show character creation screen
            uiManager.showScreen('characterCreation');
            
            // Initialize character creator
            if (window.characterCreator) {
                console.log('🎮 Initializing character creator...');
                await window.characterCreator.initialize(this.gameState);
            } else {
                throw new Error('Character creator not available');
            }
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Character creation started');
            
            performanceManager.endMeasure('startNewAdventure');
            console.log('✅ New adventure started successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to start new adventure');
        }
    }

    // Start the game
    async startGame() {
        try {
            console.log('🎮 Starting game...');
            performanceManager.startMeasure('startGame');
            
            // Validate game state
            if (!this.validateGameState()) {
                throw new Error('Cannot start game with invalid state');
            }
            
            // Check if we have players
            if (this.gameState.players.length === 0) {
                throw new Error('No players in game state');
            }
            
            this.isGameActive = true;
            this.gameState.currentPlayerIndex = 0;
            
            // Show game interface
            uiManager.showScreen('gameInterface');
            
            // Start first turn
            await this.startTurn();
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Game started');
            
            performanceManager.endMeasure('startGame');
            console.log('✅ Game started successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to start game');
        }
    }

    // Start a new turn
    async startTurn() {
        try {
            if (!this.isGameActive) return;
            
            console.log('🎮 Starting new turn...');
            performanceManager.startMeasure('startTurn');
            
            const currentPlayer = this.gameState.getCurrentPlayer();
            if (!currentPlayer) {
                throw new Error('No current player found');
            }
            
            // Validate player state
            if (!this.validatePlayerState(currentPlayer)) {
                throw new Error('Invalid player state');
            }
            
            // Start turn in interface
            await this.gameInterface.startTurn(currentPlayer);
            
            // Record turn time
            const turnTime = performanceManager.endMeasure('startTurn');
            this.performanceMetrics.turnTimes.push(turnTime);
            
            // Keep only last 100 measurements
            if (this.performanceMetrics.turnTimes.length > 100) {
                this.performanceMetrics.turnTimes.shift();
            }
            
            console.log(`✅ Turn started for ${currentPlayer.name}`);
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to start turn');
        }
    }

    // Make a choice
    async makeChoice(choiceIndex) {
        try {
            console.log(`🎮 Processing choice ${choiceIndex}...`);
            performanceManager.startMeasure('makeChoice');
            
            if (!this.isGameActive) {
                throw new Error('Game is not active');
            }
            
            const currentPlayer = this.gameState.getCurrentPlayer();
            if (!currentPlayer) {
                throw new Error('No current player found');
            }
            
            // Validate choice index
            if (!this.validateChoiceIndex(choiceIndex)) {
                throw new Error('Invalid choice index');
            }
            
            // Process choice
            await this.processChoice(currentPlayer, choiceIndex);
            
            // Move to next player
            this.gameState.nextTurn();
            
            // Start next turn after delay
            this.scheduleNextTurn();
            
            // Record choice time
            const choiceTime = performanceManager.endMeasure('makeChoice');
            this.performanceMetrics.choiceTimes.push(choiceTime);
            
            // Keep only last 100 measurements
            if (this.performanceMetrics.choiceTimes.length > 100) {
                this.performanceMetrics.choiceTimes.shift();
            }
            
            console.log(`✅ Choice ${choiceIndex} processed successfully`);
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to make choice');
        }
    }

    // Process player choice
    async processChoice(player, choiceIndex) {
        try {
            console.log(`🎮 Processing choice for ${player.name}...`);
            
            // Validate player and choice
            if (!player || !this.validatePlayerState(player)) {
                throw new Error('Invalid player state');
            }
            
            // Add experience
            player.addXP(10);
            
            // Simulate health change for demonstration
            const oldHealth = player.health;
            player.heal(5);
            
            // Show health change animation if health changed
            if (oldHealth !== player.health) {
                this.gameInterface.showHealthChange();
            }
            
            // Update current situation
            const outcomes = [
                "Your choice reveals new information about the area ahead.",
                "The party makes progress toward their objective.",
                "A new opportunity presents itself to the group."
            ];
            
            const outcome = outcomes[choiceIndex % outcomes.length];
            this.gameState.setSituation(outcome);
            
            // Show feedback with character dialog
            this.gameInterface.addCharacterDialog(
                player.name,
                characterAvatars[player.class.toLowerCase()],
                outcome
            );
            
            // Announce to screen readers
            accessibilityManager.announceAction('Choice made', outcome);
            
            console.log(`✅ Choice processed for ${player.name}`);
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to process choice');
        }
    }

    // Process command input
    async processCommand(command) {
        try {
            console.log(`🎮 Processing command: "${command}"...`);
            performanceManager.startMeasure('processCommand');
            
            if (!this.isGameActive) {
                throw new Error('Game is not active');
            }
            
            // Validate command
            if (!this.validateCommand(command)) {
                throw new Error('Invalid command');
            }
            
            const currentPlayer = this.gameState.getCurrentPlayer();
            if (!currentPlayer) {
                throw new Error('No current player found');
            }
            
            // Sanitize command for security
            const sanitizedCommand = securityManager.sanitizeText(command);
            
            // Simulate command processing
            const responses = [
                `The Game Master considers your command: "${sanitizedCommand}". After a moment of contemplation, the world around you shifts in response to your words.`,
                `As you speak the words "${sanitizedCommand}", you notice a subtle change in the environment. The Game Master acknowledges your action.`,
                `Your command "${sanitizedCommand}" echoes through the realm. The Game Master weaves your words into the fabric of the story.`,
                `"${sanitizedCommand}" - with these words, you shape the narrative. The Game Master nods in approval as the story unfolds.`
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            // Add the response as character dialog
            this.gameInterface.addCharacterDialog(
                currentPlayer.name,
                characterAvatars[currentPlayer.class.toLowerCase()],
                sanitizedCommand
            );
            
            this.gameInterface.addCharacterDialog(
                "Game Master",
                characterAvatars.gameMaster,
                response
            );
            
            // Update game state
            currentPlayer.addXP(5);
            
            // Move to next player
            this.gameState.nextTurn();
            
            // Start next turn after delay
            this.scheduleNextTurn();
            
            // Record command time
            const commandTime = performanceManager.endMeasure('processCommand');
            this.performanceMetrics.commandTimes.push(commandTime);
            
            // Keep only last 100 measurements
            if (this.performanceMetrics.commandTimes.length > 100) {
                this.performanceMetrics.commandTimes.shift();
            }
            
            // Announce to screen readers
            accessibilityManager.announceAction('Command processed', sanitizedCommand);
            
            console.log(`✅ Command processed successfully`);
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to process command');
        }
    }

    // Save game
    async saveGame() {
        try {
            console.log('💾 Saving game...');
            performanceManager.startMeasure('saveGame');
            
            // Validate game state
            if (!this.validateGameState()) {
                throw new Error('Cannot save invalid game state');
            }
            
            soundManager.playClickSound();
            
            // Generate save data
            const saveData = saveLoadManager.generateSaveData(this.gameState);
            
            // Validate save data
            const isValidSave = await securityManager.validateSaveData(saveData);
            if (!isValidSave) {
                throw new Error('Invalid save data generated');
            }
            
            // Show save dialog
            this.gameInterface.showSaveDialog(saveData);
            
            // Also save to localStorage as backup
            const localStorageSaved = saveLoadManager.saveToLocalStorage(this.gameState);
            if (!localStorageSaved) {
                console.warn('Failed to save to localStorage');
            }
            
            // Record save time
            const saveTime = performanceManager.endMeasure('saveGame');
            this.performanceMetrics.saveTimes.push(saveTime);
            
            // Keep only last 50 measurements
            if (this.performanceMetrics.saveTimes.length > 50) {
                this.performanceMetrics.saveTimes.shift();
            }
            
            // Announce to screen readers
            accessibilityManager.announceSuccess('Game saved successfully');
            
            console.log('✅ Game saved successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to save game');
        }
    }

    // Load game
    async loadGame(saveData) {
        try {
            console.log('📂 Loading game...');
            performanceManager.startMeasure('loadGame');
            
            // Validate save data
            const isValidSave = await securityManager.validateSaveData(saveData);
            if (!isValidSave) {
                throw new Error('Invalid save data');
            }
            
            // Parse save data
            this.gameState = saveLoadManager.parseSaveData(saveData);
            
            // Validate loaded game state
            if (!this.validateGameState()) {
                throw new Error('Loaded game state is invalid');
            }
            
            this.isGameActive = true;
            
            // Show game interface
            uiManager.showScreen('gameInterface');
            
            // Start first turn
            await this.startTurn();
            
            // Show success message
            uiManager.showSuccess('Game loaded successfully!');
            
            // Record load time
            const loadTime = performanceManager.endMeasure('loadGame');
            this.performanceMetrics.loadTimes.push(loadTime);
            
            // Keep only last 50 measurements
            if (this.performanceMetrics.loadTimes.length > 50) {
                this.performanceMetrics.loadTimes.shift();
            }
            
            // Announce to screen readers
            accessibilityManager.announceSuccess('Game loaded successfully');
            
            console.log('✅ Game loaded successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to load game');
        }
    }

    // End adventure
    async endAdventure() {
        try {
            console.log('🛑 Ending adventure...');
            performanceManager.startMeasure('endAdventure');
            
            soundManager.playClickSound();
            
            // Show confirmation dialog
            uiManager.showConfirmation(
                'Are you sure you want to end your adventure? All unsaved progress will be lost.',
                async () => {
                    await this.confirmEndAdventure();
                },
                () => {
                    console.log('Adventure end cancelled');
                }
            );
            
            performanceManager.endMeasure('endAdventure');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to end adventure');
        }
    }

    // Confirm end adventure
    async confirmEndAdventure() {
        try {
            console.log('🛑 Confirming adventure end...');
            performanceManager.startMeasure('confirmEndAdventure');
            
            this.isGameActive = false;
            
            // Clear any pending timeouts
            this.clearPendingTimeouts();
            
            // Reset game state
            this.gameState.reset();
            
            // Return to main menu
            uiManager.showScreen('mainMenu');
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Adventure ended');
            
            performanceManager.endMeasure('confirmEndAdventure');
            console.log('✅ Adventure ended successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to confirm end adventure');
        }
    }

    // Show help
    async showHelp() {
        try {
            console.log('📖 Showing help...');
            performanceManager.startMeasure('showHelp');
            
            soundManager.playClickSound();
            uiManager.showScreen('helpScreen');
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Help screen opened');
            
            performanceManager.endMeasure('showHelp');
            console.log('✅ Help shown successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to show help');
        }
    }

    // Show load game
    async showLoadGame() {
        try {
            console.log('📂 Showing load game screen...');
            performanceManager.startMeasure('showLoadGame');
            
            soundManager.playClickSound();
            uiManager.showScreen('saveLoadArea');
            
            const content = document.getElementById('saveLoadContent');
            if (content) {
                console.log('🎮 Setting up load game content...');
                content.innerHTML = `
                    <div class="save-load-area">
                        <h3>Load Game</h3>
                        <p>Please paste your save session data below:</p>
                        <textarea 
                            id="saveData" 
                            class="save-textarea" 
                            placeholder="Paste your save data here..."
                            aria-label="Save data input"
                        ></textarea>
                        <div class="button-group">
                            <button class="btn btn-primary" onclick="window.loadGame()" aria-label="Load game">
                                <i class="fas fa-upload"></i>
                                Load Game
                            </button>
                            <button class="btn" onclick="window.backToMenu()" aria-label="Back to menu">
                                <i class="fas fa-arrow-left"></i>
                                Back to Menu
                            </button>
                        </div>
                    </div>
                `;
            } else {
                throw new Error('Save load content element not found');
            }
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Load game screen opened');
            
            performanceManager.endMeasure('showLoadGame');
            console.log('✅ Load game screen shown successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to show load game');
        }
    }

    // Load game from textarea
    async loadGameFromTextarea() {
        try {
            console.log('📂 Loading game from textarea...');
            performanceManager.startMeasure('loadGameFromTextarea');
            
            const saveDataTextarea = document.getElementById('saveData');
            if (!saveDataTextarea) {
                throw new Error('Save data textarea not found');
            }
            
            const saveData = saveDataTextarea.value.trim();
            if (!saveData) {
                uiManager.showError('Please paste save data first.');
                return;
            }
            
            // Validate and load game
            await this.loadGame(saveData);
            
            performanceManager.endMeasure('loadGameFromTextarea');
            console.log('✅ Game loaded from textarea successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to load game from textarea');
        }
    }

    // Change location
    async changeLocation(newLocation) {
        try {
            console.log(`🗺️ Changing location to ${newLocation}...`);
            performanceManager.startMeasure('changeLocation');
            
            // Validate location
            if (!this.validateLocation(newLocation)) {
                throw new Error('Invalid location');
            }
            
            this.gameState.setLocation(newLocation);
            this.gameInterface.changeLocation(newLocation);
            
            // Announce to screen readers
            accessibilityManager.announceAction('Location changed', newLocation);
            
            performanceManager.endMeasure('changeLocation');
            console.log(`✅ Location changed to ${newLocation} successfully`);
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to change location');
        }
    }

    // Update game state
    async updateGameState(updates) {
        try {
            console.log('🔄 Updating game state...');
            performanceManager.startMeasure('updateGameState');
            
            // Validate updates
            if (!updates || typeof updates !== 'object') {
                throw new Error('Invalid updates object');
            }
            
            Object.assign(this.gameState, updates);
            
            // Validate updated state
            if (!this.validateGameState()) {
                throw new Error('Game state became invalid after update');
            }
            
            performanceManager.endMeasure('updateGameState');
            console.log('✅ Game state updated successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to update game state');
        }
    }

    // Get game state summary
    getGameSummary() {
        try {
            return this.gameState.getSummary();
        } catch (error) {
            this.handleControllerError(error, 'Failed to get game summary');
            return null;
        }
    }

    // Check if game is active
    isGameRunning() {
        return this.isGameActive;
    }

    // Pause game
    async pauseGame() {
        try {
            console.log('⏸️ Pausing game...');
            performanceManager.startMeasure('pauseGame');
            
            if (!this.isGameActive) return;
            
            this.isGameActive = false;
            this.gameInterface.disableInput();
            
            // Clear any pending timeouts
            this.clearPendingTimeouts();
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Game paused');
            
            performanceManager.endMeasure('pauseGame');
            console.log('✅ Game paused successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to pause game');
        }
    }

    // Resume game
    async resumeGame() {
        try {
            console.log('▶️ Resuming game...');
            performanceManager.startMeasure('resumeGame');
            
            if (this.isGameActive) return;
            
            this.isGameActive = true;
            this.gameInterface.enableInput();
            
            // Resume game
            await this.startTurn();
            
            // Announce to screen readers
            accessibilityManager.announceToScreenReader('Game resumed');
            
            performanceManager.endMeasure('resumeGame');
            console.log('✅ Game resumed successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to resume game');
        }
    }

    // Handle game over
    async gameOver(message) {
        try {
            console.log('💀 Game over...');
            performanceManager.startMeasure('gameOver');
            
            this.isGameActive = false;
            
            // Clear any pending timeouts
            this.clearPendingTimeouts();
            
            this.gameInterface.showGameOver(message);
            
            // Announce to screen readers
            accessibilityManager.announceError('Game over: ' + message);
            
            performanceManager.endMeasure('gameOver');
            console.log('✅ Game over handled successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to handle game over');
        }
    }

    // Handle victory
    async victory(message) {
        try {
            console.log('🎉 Victory!');
            performanceManager.startMeasure('victory');
            
            this.isGameActive = false;
            
            // Clear any pending timeouts
            this.clearPendingTimeouts();
            
            this.gameInterface.showVictory(message);
            
            // Announce to screen readers
            accessibilityManager.announceSuccess('Victory: ' + message);
            
            performanceManager.endMeasure('victory');
            console.log('✅ Victory handled successfully');
            
        } catch (error) {
            this.handleControllerError(error, 'Failed to handle victory');
        }
    }

    // Get current player
    getCurrentPlayer() {
        try {
            return this.gameState.getCurrentPlayer();
        } catch (error) {
            this.handleControllerError(error, 'Failed to get current player');
            return null;
        }
    }

    // Get all players
    getAllPlayers() {
        try {
            return this.gameState.players;
        } catch (error) {
            this.handleControllerError(error, 'Failed to get all players');
            return [];
        }
    }

    // Get game state
    getGameState() {
        try {
            return this.gameState;
        } catch (error) {
            this.handleControllerError(error, 'Failed to get game state');
            return null;
        }
    }

    // Utility methods
    scheduleNextTurn() {
        // Clear any existing timeout
        if (this.choiceTimeout) {
            clearTimeout(this.choiceTimeout);
        }
        
        // Schedule next turn
        this.choiceTimeout = setTimeout(() => {
            this.startTurn();
        }, 1000);
    }

    clearPendingTimeouts() {
        if (this.choiceTimeout) {
            clearTimeout(this.choiceTimeout);
            this.choiceTimeout = null;
        }
    }

    // Validation methods
    validateGameState() {
        try {
            if (!this.gameState) return false;
            if (!this.gameState.players || !Array.isArray(this.gameState.players)) return false;
            if (this.gameState.players.length === 0) return false;
            if (this.gameState.currentPlayerIndex < 0 || this.gameState.currentPlayerIndex >= this.gameState.players.length) return false;
            
            // Validate each player
            for (const player of this.gameState.players) {
                if (!this.validatePlayerState(player)) return false;
            }
            
            return true;
        } catch (error) {
            console.error('Game state validation failed:', error);
            return false;
        }
    }

    validatePlayerState(player) {
        try {
            if (!player) return false;
            if (!player.name || typeof player.name !== 'string') return false;
            if (!player.class || typeof player.class !== 'string') return false;
            if (typeof player.health !== 'number' || player.health < 0) return false;
            if (typeof player.maxHealth !== 'number' || player.maxHealth <= 0) return false;
            if (player.health > player.maxHealth) return false;
            if (typeof player.level !== 'number' || player.level < 1) return false;
            if (typeof player.xp !== 'number' || player.xp < 0) return false;
            
            return true;
        } catch (error) {
            console.error('Player state validation failed:', error);
            return false;
        }
    }

    validateChoiceIndex(choiceIndex) {
        return typeof choiceIndex === 'number' && 
               choiceIndex >= 0 && 
               choiceIndex < 3; // Assuming 3 choices per turn
    }

    validateCommand(command) {
        return securityManager.validateInput(command, 'command');
    }

    validateLocation(location) {
        const validLocations = ['forest', 'dungeon', 'village', 'castle', 'mountain'];
        return validLocations.includes(location);
    }

    // Error handling
    handleControllerError(error, context = 'Game Controller Error') {
        console.error(`🚨 ${context}:`, error);
        
        this.errorCount++;
        
        // Show error to user
        uiManager.showError(`${context}: ${error.message}`);
        
        // Announce to screen readers
        accessibilityManager.announceError(`${context}: ${error.message}`);
        
        // Log error for debugging
        this.logError(error, context);
        
        // Check if we should disable the game due to too many errors
        if (this.errorCount > this.maxErrors) {
            this.handleTooManyErrors();
        }
    }

    handleTooManyErrors() {
        console.error('🚨 Too many errors in game controller');
        
        // Show critical error
        uiManager.showError('Too many errors occurred. The game will be disabled.');
        
        // Disable game
        this.isGameActive = false;
        this.clearPendingTimeouts();
        
        // Return to main menu
        uiManager.showScreen('mainMenu');
    }

    logError(error, context) {
        // In a real implementation, this would send errors to a logging service
        console.error('Error logged:', {
            context,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            gameState: this.getGameSummary()
        });
    }

    // Performance monitoring
    checkPerformanceMetrics() {
        try {
            const metrics = this.performanceMetrics;
            
            // Check for performance issues
            const avgTurnTime = metrics.turnTimes.reduce((a, b) => a + b, 0) / metrics.turnTimes.length || 0;
            const avgChoiceTime = metrics.choiceTimes.reduce((a, b) => a + b, 0) / metrics.choiceTimes.length || 0;
            const avgCommandTime = metrics.commandTimes.reduce((a, b) => a + b, 0) / metrics.commandTimes.length || 0;
            
            if (avgTurnTime > 1000) { // More than 1 second
                console.warn('Performance warning: Average turn time is high:', avgTurnTime);
            }
            
            if (avgChoiceTime > 500) { // More than 500ms
                console.warn('Performance warning: Average choice time is high:', avgChoiceTime);
            }
            
            if (avgCommandTime > 1000) { // More than 1 second
                console.warn('Performance warning: Average command time is high:', avgCommandTime);
            }
            
            // Clean up old metrics
            if (metrics.turnTimes.length > 100) metrics.turnTimes = metrics.turnTimes.slice(-100);
            if (metrics.choiceTimes.length > 100) metrics.choiceTimes = metrics.choiceTimes.slice(-100);
            if (metrics.commandTimes.length > 100) metrics.commandTimes = metrics.commandTimes.slice(-100);
            if (metrics.saveTimes.length > 50) metrics.saveTimes = metrics.saveTimes.slice(-50);
            if (metrics.loadTimes.length > 50) metrics.loadTimes = metrics.loadTimes.slice(-50);
            
        } catch (error) {
            console.error('Failed to check performance metrics:', error);
        }
    }

    // Memory management
    cleanupMemory() {
        try {
            console.log('🧹 Cleaning up memory...');
            
            // Clear old performance metrics
            this.cleanupPerformanceMetrics();
            
            // Clear old cache entries
            this.cleanupCache();
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            console.log('✅ Memory cleanup completed');
            
        } catch (error) {
            console.error('Failed to cleanup memory:', error);
        }
    }

    cleanupPerformanceMetrics() {
        // Keep only recent metrics
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        // This would be more sophisticated in a real implementation
        // For now, we'll just limit the array sizes
        if (this.performanceMetrics.turnTimes.length > 100) {
            this.performanceMetrics.turnTimes = this.performanceMetrics.turnTimes.slice(-100);
        }
        if (this.performanceMetrics.choiceTimes.length > 100) {
            this.performanceMetrics.choiceTimes = this.performanceMetrics.choiceTimes.slice(-100);
        }
        if (this.performanceMetrics.commandTimes.length > 100) {
            this.performanceMetrics.commandTimes = this.performanceMetrics.commandTimes.slice(-100);
        }
    }

    cleanupCache() {
        // Clear any cached data that's no longer needed
        // This would be more sophisticated in a real implementation
        console.log('🧹 Cache cleanup completed');
    }

    // Cleanup method
    cleanup() {
        console.log('🧹 Cleaning up game controller...');
        
        try {
            // Clear pending timeouts
            this.clearPendingTimeouts();
            
            // Clear event listeners
            this.cleanupCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.error('Failed to execute cleanup callback:', error);
                }
            });
            this.cleanupCallbacks.clear();
            
            // Clear performance monitoring
            if (this.performanceInterval) {
                clearInterval(this.performanceInterval);
            }
            
            // Clear memory cleanup
            if (this.memoryCleanupInterval) {
                clearInterval(this.memoryCleanupInterval);
            }
            
            // Reset game state
            this.gameState.reset();
            
            // Reset flags
            this.isGameActive = false;
            this.errorCount = 0;
            
            console.log('✅ Game controller cleanup completed');
            
        } catch (error) {
            console.error('Failed to cleanup game controller:', error);
        }
    }
}

// Export singleton instance
export const gameController = new GameController();
