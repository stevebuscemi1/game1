// Game State Model
export class GameState {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.turnOrder = [];
    this.storyProgress = {};
    this.relationships = {
      factions: {
        'Kingdom Guard': 0,
        'Thieves Guild': 0,
        'Mage Council': 0,
        'Merchant League': 0,
        'Nature Cult': 0
      },
      npcs: {}
    };
    this.currentLocation = 'forest';
    this.completedQuests = [];
    this.activeQuests = [];
    this.worldState = {};
    this.companions = [];
    this.currentSituation = '';
    this.objectives = [];
    this.playerCount = 1;
  }
  
  // Add player to game
  addPlayer(player) {
    this.players.push(player);
    this.turnOrder.push(player.id);
    return this.players.length;
  }
  
  // Remove player from game
  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index > -1) {
      this.players.splice(index, 1);
      this.turnOrder = this.turnOrder.filter(id => id !== playerId);
      return true;
    }
    return false;
  }
  
  // Get current player
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex] || null;
  }
  
  // Move to next player's turn
  nextTurn() {
    if (this.players.length === 0) return null;
    
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return this.getCurrentPlayer();
  }
  
  // Set current location
  setLocation(location) {
    this.currentLocation = location;
  }
  
  // Add completed quest
  completeQuest(questId) {
    if (!this.completedQuests.includes(questId)) {
      this.completedQuests.push(questId);
      return true;
    }
    return false;
  }
  
  // Add active quest
  addQuest(questId) {
    if (!this.activeQuests.includes(questId)) {
      this.activeQuests.push(questId);
      return true;
    }
    return false;
  }
  
  // Complete active quest
  completeActiveQuest(questId) {
    const index = this.activeQuests.indexOf(questId);
    if (index > -1) {
      this.activeQuests.splice(index, 1);
      this.completeQuest(questId);
      return true;
    }
    return false;
  }
  
  // Set world state flag
  setWorldState(key, value = true) {
    this.worldState[key] = value;
  }
  
  // Check world state flag
  hasWorldState(key) {
    return !!this.worldState[key];
  }
  
  // Update faction reputation
  updateFactionReputation(faction, amount) {
    if (this.relationships.factions[faction] !== undefined) {
      this.relationships.factions[faction] += amount;
      return true;
    }
    return false;
  }
  
  // Get faction reputation
  getFactionReputation(faction) {
    return this.relationships.factions[faction] || 0;
  }
  
  // Update NPC relationship
  updateNPCRelationship(npc, amount) {
    if (!this.relationships.npcs[npc]) {
      this.relationships.npcs[npc] = 0;
    }
    this.relationships.npcs[npc] += amount;
  }
  
  // Get NPC relationship
  getNPCRelationship(npc) {
    return this.relationships.npcs[npc] || 0;
  }
  
  // Add companion
  addCompanion(companion) {
    this.companions.push(companion);
  }
  
  // Remove companion
  removeCompanion(companionId) {
    const index = this.companions.findIndex(c => c.id === companionId);
    if (index > -1) {
      this.companions.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Update story progress
  updateStoryProgress(key, value) {
    this.storyProgress[key] = value;
  }
  
  // Get story progress
  getStoryProgress(key) {
    return this.storyProgress[key];
  }
  
  // Set current situation
  setSituation(situation) {
    this.currentSituation = situation;
  }
  
  // Add objective
  addObjective(objective) {
    if (!this.objectives.includes(objective)) {
      this.objectives.push(objective);
    }
  }
  
  // Remove objective
  removeObjective(objective) {
    const index = this.objectives.indexOf(objective);
    if (index > -1) {
      this.objectives.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Check if game is complete
  isGameComplete() {
    return this.objectives.length === 0;
  }
  
  // Get game summary
  getSummary() {
    return {
      players: this.players.map(p => p.getSummary()),
      currentPlayer: this.getCurrentPlayer()?.name || 'none',
      location: this.currentLocation,
      quests: {
        active: this.activeQuests.length,
        completed: this.completedQuests.length
      },
      companions: this.companions.length,
      objectives: this.objectives.length
    };
  }
  
  // Reset game state
  reset() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.turnOrder = [];
    this.storyProgress = {};
    this.relationships = {
      factions: {
        'Kingdom Guard': 0,
        'Thieves Guild': 0,
        'Mage Council': 0,
        'Merchant League': 0,
        'Nature Cult': 0
      },
      npcs: {}
    };
    this.currentLocation = 'forest';
    this.completedQuests = [];
    this.activeQuests = [];
    this.worldState = {};
    this.companions = [];
    this.currentSituation = '';
    this.objectives = [];
    this.playerCount = 1;
  }
  
  // Serialize game state
  toJSON() {
    return {
      players: this.players.map(p => p.toJSON()),
      currentPlayerIndex: this.currentPlayerIndex,
      turnOrder: this.turnOrder,
      storyProgress: this.storyProgress,
      relationships: this.relationships,
      currentLocation: this.currentLocation,
      completedQuests: this.completedQuests,
      activeQuests: this.activeQuests,
      worldState: this.worldState,
      companions: this.companions,
      currentSituation: this.currentSituation,
      objectives: this.objectives,
      playerCount: this.playerCount
    };
  }
  
  // Create from JSON
  static fromJSON(data) {
    const gameState = new GameState();
    Object.assign(gameState, data);
    
    // Recreate player objects
    gameState.players = data.players.map(playerData => new Player(playerData));
    
    return gameState;
  }
}