// Save and Load System
export class SaveLoadManager {
  constructor() {
    this.savePrefix = 'realmsOfAdventure_';
  }
  
  // Generate save data from game state
  generateSaveData(gameState) {
    let saveText = `=== MULTIPLAYER SAVE SESSION ===\n`;
    saveText += `PARTY:\n`;
    saveText += `Number of Players: ${gameState.players.length}\n`;
    saveText += `Turn Order: ${gameState.turnOrder.join(', ')}\n`;
    saveText += `Current Turn: ${gameState.players[gameState.currentPlayerIndex].name}\n\n`;
    
    gameState.players.forEach(player => {
      saveText += `PLAYER ${player.id}:\n`;
      saveText += `Name: ${player.name}\n`;
      saveText += `Class: ${player.class}\n`;
      saveText += `Race: ${player.race}\n`;
      saveText += `Background: ${player.background}\n`;
      saveText += `Level: ${player.level}\n`;
      saveText += `XP: ${player.xp}/${player.xpToNext}\n`;
      saveText += `Attributes: STR:${player.attributes.strength} DEX:${player.attributes.dexterity} INT:${player.attributes.intelligence} WIS:${player.attributes.wisdom} CON:${player.attributes.constitution}\n`;
      saveText += `Health: ${player.health}/${player.maxHealth}\n`;
      saveText += `Inventory: ${player.inventory.join(', ') || 'none'}\n`;
      saveText += `Status: ${player.status.join(', ') || 'none'}\n`;
      saveText += `Vision: ${player.vision}\n`;
      saveText += `Luck: ${player.luck}\n`;
      saveText += `Skills: ${Object.entries(player.skills).map(([skill, value]) => `${skill}:${value}`).join(', ')}\n\n`;
    });
    
    saveText += `RELATIONSHIPS:\n`;
    saveText += `Factions: ${Object.entries(gameState.relationships.factions).map(([faction, value]) => `${faction}:${value}`).join(', ')}\n`;
    saveText += `NPCs: ${Object.entries(gameState.relationships.npcs).map(([npc, value]) => `${npc}:${value}`).join(', ')}\n\n`;
    
    saveText += `STORY PROGRESS:\n`;
    saveText += `Current Location: ${gameState.currentLocation}\n`;
    saveText += `Completed Quests: ${gameState.completedQuests.join(', ') || 'none'}\n`;
    saveText += `Active Quests: ${gameState.activeQuests.join(', ') || 'none'}\n`;
    saveText += `World State: ${Object.keys(gameState.worldState).join(', ') || 'none'}\n`;
    saveText += `Key Choices: ${gameState.storyProgress.keyChoices || 'none'}\n\n`;
    
    saveText += `COMPANIONS:\n`;
    gameState.companions.forEach(companion => {
      saveText += `${companion.name}: ${companion.status}, ${companion.relationship}\n`;
    });
    
    saveText += `\nCURRENT SITUATION:\n`;
    saveText += `${gameState.currentSituation}\n\n`;
    
    saveText += `OBJECTIVES:\n`;
    saveText += `${gameState.objectives.join(', ')}\n`;
    
    saveText += `\n=== END SAVE SESSION ===`;
    
    return saveText;
  }
  
  // Parse save data and restore game state
  parseSaveData(saveText) {
    try {
      const lines = saveText.split('\n');
      const gameState = this.createEmptyGameState();
      
      let currentSection = '';
      let currentPlayer = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine === '=== MULTIPLAYER SAVE SESSION ===') {
          continue;
        } else if (trimmedLine === 'PARTY:') {
          currentSection = 'party';
        } else if (trimmedLine.startsWith('Number of Players:')) {
          gameState.playerCount = parseInt(trimmedLine.split(':')[1]);
        } else if (trimmedLine.startsWith('Turn Order:')) {
          gameState.turnOrder = trimmedLine.split(':')[1].split(',').map(id => parseInt(id.trim()));
        } else if (trimmedLine.startsWith('Current Turn:')) {
          const currentTurnName = trimmedLine.split(':')[1].trim();
          // Will set currentPlayerIndex after players are loaded
        } else if (trimmedLine.startsWith('PLAYER')) {
          currentSection = 'player';
          currentPlayer = this.createEmptyPlayer();
          currentPlayer.id = parseInt(trimmedLine.split(' ')[1].replace(':', ''));
        } else if (trimmedLine === 'RELATIONSHIPS:') {
          currentSection = 'relationships';
        } else if (trimmedLine === 'STORY PROGRESS:') {
          currentSection = 'story';
        } else if (trimmedLine === 'COMPANIONS:') {
          currentSection = 'companions';
        } else if (trimmedLine === 'CURRENT SITUATION:') {
          currentSection = 'situation';
        } else if (trimmedLine === 'OBJECTIVES:') {
          currentSection = 'objectives';
        } else if (trimmedLine === '=== END SAVE SESSION ===') {
          break;
        } else if (trimmedLine.includes(':')) {
          this.parseLine(trimmedLine, currentSection, gameState, currentPlayer);
        }
      }
      
      // Set currentPlayerIndex based on current turn name
      if (gameState.players.length > 0) {
        const currentTurnName = lines.find(line => line.startsWith('Current Turn:'))?.split(':')[1]?.trim();
        if (currentTurnName) {
          gameState.currentPlayerIndex = gameState.players.findIndex(p => p.name === currentTurnName) || 0;
        }
      }
      
      return gameState;
    } catch (error) {
      console.error('Error parsing save data:', error);
      throw new Error('Invalid save data format');
    }
  }
  
  // Parse individual lines based on section
  parseLine(line, section, gameState, currentPlayer) {
    const [key, value] = line.split(':').map(part => part.trim());
    
    switch (section) {
      case 'player':
        this.parsePlayerLine(key, value, currentPlayer);
        break;
      case 'relationships':
        if (key === 'Factions') {
          value.split(',').forEach(faction => {
            const [name, val] = faction.split(':').map(f => f.trim());
            gameState.relationships.factions[name] = parseInt(val);
          });
        } else if (key === 'NPCs') {
          value.split(',').forEach(npc => {
            const [name, val] = npc.split(':').map(n => n.trim());
            gameState.relationships.npcs[name] = parseInt(val);
          });
        }
        break;
      case 'story':
        if (key === 'Current Location') {
          gameState.currentLocation = value;
        } else if (key === 'Completed Quests') {
          gameState.completedQuests = value === 'none' ? [] : value.split(',').map(q => q.trim());
        } else if (key === 'Active Quests') {
          gameState.activeQuests = value === 'none' ? [] : value.split(',').map(q => q.trim());
        } else if (key === 'World State') {
          gameState.worldState = value === 'none' ? {} : value.split(',').reduce((acc, key) => {
            acc[key.trim()] = true;
            return acc;
          }, {});
        } else if (key === 'Key Choices') {
          gameState.storyProgress.keyChoices = value === 'none' ? '' : value;
        }
        break;
      case 'companions':
        // Parse companion data
        break;
      case 'situation':
        gameState.currentSituation = value;
        break;
      case 'objectives':
        gameState.objectives = value.split(',').map(obj => obj.trim());
        break;
    }
  }
  
  // Parse player-specific lines
  parsePlayerLine(key, value, player) {
    switch (key) {
      case 'Name':
        player.name = value;
        break;
      case 'Class':
        player.class = value;
        break;
      case 'Race':
        player.race = value;
        break;
      case 'Background':
        player.background = value;
        break;
      case 'Level':
        player.level = parseInt(value);
        break;
      case 'XP':
        const [current, next] = value.split('/').map(v => parseInt(v));
        player.xp = current;
        player.xpToNext = next;
        break;
      case 'Attributes':
        const attrs = value.split(' ');
        attrs.forEach(attr => {
          const [name, val] = attr.split(':');
          player.attributes[name.toLowerCase()] = parseInt(val);
        });
        break;
      case 'Health':
        const [health, maxHealth] = value.split('/').map(h => parseInt(h));
        player.health = health;
        player.maxHealth = maxHealth;
        break;
      case 'Inventory':
        player.inventory = value === 'none' ? [] : value.split(',').map(i => i.trim());
        break;
      case 'Status':
        player.status = value === 'none' ? [] : value.split(',').map(s => s.trim());
        break;
      case 'Vision':
        player.vision = value;
        break;
      case 'Luck':
        player.luck = value;
        break;
      case 'Skills':
        if (value !== 'none') {
          value.split(',').forEach(skill => {
            const [name, level] = skill.split(':').map(s => s.trim());
            player.skills[name] = parseInt(level);
          });
        }
        break;
    }
  }
  
  // Create empty game state structure
  createEmptyGameState() {
    return {
      players: [],
      currentPlayerIndex: 0,
      turnOrder: [],
      storyProgress: {},
      relationships: {
        factions: {
          'Kingdom Guard': 0,
          'Thieves Guild': 0,
          'Mage Council': 0,
          'Merchant League': 0,
          'Nature Cult': 0
        },
        npcs: {}
      },
      currentLocation: 'forest',
      completedQuests: [],
      activeQuests: [],
      worldState: {},
      companions: [],
      currentSituation: '',
      objectives: []
    };
  }
  
  // Create empty player structure
  createEmptyPlayer() {
    return {
      id: 0,
      name: '',
      class: '',
      race: '',
      background: '',
      level: 1,
      xp: 0,
      xpToNext: 200,
      attributes: {
        strength: 10,
        dexterity: 10,
        intelligence: 10,
        wisdom: 10,
        constitution: 10,
        endurance: 10,
        luck: 10
      },
      health: 100,
      maxHealth: 100,
      inventory: [],
      status: [],
      vision: 'normal',
      luck: 'normal',
      skills: {}
    };
  }
  
  // Save game to localStorage
  saveToLocalStorage(gameState, slot = 'default') {
    try {
      const saveData = this.generateSaveData(gameState);
      localStorage.setItem(`${this.savePrefix}${slot}`, saveData);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
  
  // Load game from localStorage
  loadFromLocalStorage(slot = 'default') {
    try {
      const saveData = localStorage.getItem(`${this.savePrefix}${slot}`);
      if (!saveData) {
        throw new Error('No save found');
      }
      return this.parseSaveData(saveData);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      throw error;
    }
  }
  
  // Get list of available save slots
  getSaveSlots() {
    const slots = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.savePrefix)) {
        slots.push(key.replace(this.savePrefix, ''));
      }
    }
    return slots;
  }
  
  // Delete save slot
  deleteSaveSlot(slot = 'default') {
    localStorage.removeItem(`${this.savePrefix}${slot}`);
  }
}

// Export singleton instance
export const saveLoadManager = new SaveLoadManager();