// Game Controller
import { GameState } from '../models/game-state.js';
import { Player } from '../models/player.js';
import { soundManager } from '../utils/sound.js';
import { saveLoadManager } from '../utils/save-load.js';
import { characterAvatars } from '../data/character-data.js';
import { uiManager } from '../components/ui-manager.js';
import { gameInterface } from '../components/game-interface.js';

export class GameController {
  constructor() {
    this.gameState = new GameState();
    this.gameInterface = gameInterface;
    this.gameInterface.setGameController(this);
    this.isGameActive = false;
    this.choiceTimeout = null;
  }
  
  // Start new adventure
  startNewAdventure() {
      console.log('🎮 GameController.startNewAdventure() called');
      soundManager.playPopSound();
      uiManager.showScreen('characterCreation');
      
      if (window.characterCreator) {
          console.log('🎮 Initializing character creator...');
          window.characterCreator.initialize(this.gameState);
      } else {
          console.error('🎮 Character creator not available');
      }
  }
  
  // Start the game
  startGame() {
    this.isGameActive = true;
    this.gameState.currentPlayerIndex = 0;
    this.startTurn();
  }
  
  // Start a new turn
  startTurn() {
    if (!this.isGameActive) return;
    
    const currentPlayer = this.gameState.getCurrentPlayer();
    if (!currentPlayer) return;
    
    this.gameInterface.startTurn(currentPlayer);
  }
  
  // Make a choice
  makeChoice(choiceIndex) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    if (!currentPlayer) return;
    
    // Process choice
    this.processChoice(currentPlayer, choiceIndex);
    
    // Move to next player
    this.gameState.nextTurn();
    
    // Start next turn after delay
    this.choiceTimeout = setTimeout(() => {
      this.startTurn();
    }, 1000);
  }
  
  // Process player choice
  processChoice(player, choiceIndex) {
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
    
    this.gameState.setSituation(outcomes[choiceIndex % outcomes.length]);
    
    // Show feedback with character dialog
    this.gameInterface.addCharacterDialog(
      player.name, 
      characterAvatars[player.class.toLowerCase()], 
      outcomes[choiceIndex % outcomes.length]
    );
  }
  
  // Process command input
  processCommand(command) {
    const currentPlayer = this.gameState.getCurrentPlayer();
    if (!currentPlayer) return;
    
    // Simulate command processing
    const responses = [
      `The Game Master considers your command: "${command}". After a moment of contemplation, the world around you shifts in response to your words.`,
      `As you speak the words "${command}", you notice a subtle change in the environment. The Game Master acknowledges your action.`,
      `Your command "${command}" echoes through the realm. The Game Master weaves your words into the fabric of the story.`,
      `"${command}" - with these words, you shape the narrative. The Game Master nods in approval as the story unfolds.`
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add the response as character dialog
    this.gameInterface.addCharacterDialog(
      currentPlayer.name, 
      characterAvatars[currentPlayer.class.toLowerCase()], 
      command
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
    setTimeout(() => {
      this.startTurn();
    }, 2000);
  }
  
  // Save game
  saveGame() {
    soundManager.playClickSound();
    
    try {
      const saveData = saveLoadManager.generateSaveData(this.gameState);
      this.gameInterface.showSaveDialog(saveData);
      
      // Also save to localStorage as backup
      saveLoadManager.saveToLocalStorage(this.gameState);
    } catch (error) {
      console.error('Error saving game:', error);
      uiManager.showError('Failed to save game. Please try again.');
    }
  }
  
  // Load game
  loadGame(saveData) {
    try {
      this.gameState = saveLoadManager.parseSaveData(saveData);
      this.isGameActive = true;
      uiManager.showScreen('gameInterface');
      this.startTurn();
      uiManager.showSuccess('Game loaded successfully!');
    } catch (error) {
      console.error('Error loading game:', error);
      uiManager.showError('Failed to load game. Invalid save data.');
    }
  }
  
  // End adventure
  endAdventure() {
    soundManager.playClickSound();
    
    uiManager.showConfirmation(
      'Are you sure you want to end your adventure? All unsaved progress will be lost.',
      () => this.confirmEndAdventure(),
      () => {}
    );
  }
  
  // Confirm end adventure
  confirmEndAdventure() {
    this.isGameActive = false;
    
    // Clear any pending timeouts
    if (this.choiceTimeout) {
      clearTimeout(this.choiceTimeout);
      this.choiceTimeout = null;
    }
    
    // Reset game state
    this.gameState.reset();
    
    // Return to main menu
    uiManager.showScreen('mainMenu');
  }
  
  // Show help
  showHelp() {
      console.log('🎮 GameController.showHelp() called');
      soundManager.playClickSound();
      uiManager.showScreen('helpScreen');
  }
  
  // Show load game
  showLoadGame() {
      console.log('🎮 GameController.showLoadGame() called');
      soundManager.playClickSound();
      uiManager.showScreen('saveLoadArea');
      
      const content = document.getElementById('saveLoadContent');
      if (content) {
          console.log('🎮 Setting up load game content...');
          content.innerHTML = `
              <p>Please paste your save session data below:</p>
              <textarea id="saveData" class="save-load-textarea" placeholder="Paste your save data here..."></textarea>
              <div class="centered-buttons">
                  <div class="option-card" onclick="gameController.loadGameFromTextarea()">
                      <strong>Load Game</strong>
                  </div>
                  <div class="option-card" onclick="uiManager.showScreen('mainMenu')">
                      <strong>Back to Menu</strong>
                  </div>
              </div>
          `;
      } else {
          console.error('🎮 saveLoadContent element not found');
      }
  }
  
  // Load game from textarea
  loadGameFromTextarea() {
    const saveDataTextarea = helpers.getElement('saveData');
    if (!saveDataTextarea) return;
    
    const saveData = saveDataTextarea.value.trim();
    if (!saveData) {
      uiManager.showError('Please paste save data first.');
      return;
    }
    
    this.loadGame(saveData);
  }
  
  // Change location
  changeLocation(newLocation) {
    this.gameState.setLocation(newLocation);
    this.gameInterface.changeLocation(newLocation);
  }
  
  // Update game state
  updateGameState(updates) {
    Object.assign(this.gameState, updates);
  }
  
  // Get game state summary
  getGameSummary() {
    return this.gameState.getSummary();
  }
  
  // Check if game is active
  isGameRunning() {
    return this.isGameActive;
  }
  
  // Pause game
  pauseGame() {
    this.isGameActive = false;
    this.gameInterface.disableInput();
  }
  
  // Resume game
  resumeGame() {
    this.isGameActive = true;
    this.gameInterface.enableInput();
    this.startTurn();
  }
  
  // Handle game over
  gameOver(message) {
    this.isGameActive = false;
    this.gameInterface.showGameOver(message);
  }
  
  // Handle victory
  victory(message) {
    this.isGameActive = false;
    this.gameInterface.showVictory(message);
  }
  
  // Get current player
  getCurrentPlayer() {
    return this.gameState.getCurrentPlayer();
  }
  
  // Get all players
  getAllPlayers() {
    return this.gameState.players;
  }
  
  // Get game state
  getGameState() {
    return this.gameState;
  }
}

// Export singleton instance
export const gameController = new GameController();