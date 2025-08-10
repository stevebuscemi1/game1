// Character Creator Component
import { helpers } from '../utils/helpers.js';
import { soundManager } from '../utils/sound.js';
import { Player } from '../models/player.js';
import { characterData, characterAvatars } from '../data/character-data.js';
import { uiManager } from './ui-manager.js';

export class CharacterCreator {
  constructor() {
    this.creationStep = 0;
    this.currentPlayerNumber = 0;
    this.selectedClasses = [];
    this.tempPlayer = {};
    this.gameState = null;
  }
  
  // Initialize character creation
  initialize(gameState) {
    this.gameState = gameState;
    this.creationStep = 0;
    this.currentPlayerNumber = 0;
    this.selectedClasses = [];
    this.tempPlayer = {};
    this.gameState.players = [];
    this.startCharacterCreation();
  }
  
  // Start character creation process
  startCharacterCreation() {
    const content = helpers.getElement('creationContent');
    if (!content) return;
    
    if (this.currentPlayerNumber === 0) {
      content.innerHTML = this.getPlayerCountStep();
    } else {
      this.createCharacterStep();
    }
  }
  
  // Get player count step HTML
  getPlayerCountStep() {
    return `
      <div class="creation-step">
        <h3>How many players will be joining?</h3>
        <div class="option-grid">
          ${[1, 2, 3, 4, 5].map(num => 
            `<div class="option-card" onclick="characterCreator.selectPlayerCount(${num})">
              <strong>${num} Players</strong>
            </div>`
          ).join('')}
        </div>
      </div>
    `;
  }
  
  // Select player count
  selectPlayerCount(count) {
    soundManager.playPopSound();
    this.gameState.playerCount = count;
    this.currentPlayerNumber = 1;
    this.createCharacterStep();
  }
  
  // Create character step
  createCharacterStep() {
    const content = helpers.getElement('creationContent');
    if (!content) return;
    
    switch (this.creationStep) {
      case 0:
        content.innerHTML = this.getNameStep();
        this.focusNameInput();
        break;
      case 1:
        content.innerHTML = this.getClassStep();
        break;
      case 2:
        content.innerHTML = this.getRaceStep();
        break;
      case 3:
        content.innerHTML = this.getBackgroundStep();
        break;
      case 4:
        content.innerHTML = this.getSummaryStep();
        break;
    }
  }
  
  // Get name step HTML
  getNameStep() {
    return `
      <div class="creation-step">
        <h3>Player ${this.currentPlayerNumber}: Choose Your Name</h3>
        <input type="text" id="characterName" class="name-input" placeholder="Enter character name" maxlength="20">
        <div class="option-grid">
          <div class="option-card" onclick="characterCreator.selectName()">
            <strong>Continue</strong>
          </div>
        </div>
      </div>
    `;
  }
  
  // Focus on name input
  focusNameInput() {
    setTimeout(() => {
      const nameInput = helpers.getElement('characterName');
      if (nameInput) nameInput.focus();
    }, 100);
  }
  
  // Select character name
  selectName() {
    const nameInput = helpers.getElement('characterName');
    const name = nameInput.value.trim();
    
    if (!helpers.validateInput(name)) {
      nameInput.style.borderColor = '#ff0000';
      return;
    }
    
    soundManager.playClickSound();
    this.tempPlayer.name = name;
    this.creationStep++;
    this.createCharacterStep();
  }
  
  // Get class step HTML
  getClassStep() {
    const availableClasses = characterData.classes.filter(cls => !this.selectedClasses.includes(cls.name));
    
    return `
      <div class="creation-step">
        <h3>${this.tempPlayer.name}: Choose Your Class</h3>
        <div class="option-grid">
          ${availableClasses.map(cls => 
            `<div class="option-card" onclick="characterCreator.selectClass('${cls.name}')">
              <strong>${cls.name}</strong><br>
              <small>${cls.bonus}</small>
            </div>`
          ).join('')}
        </div>
      </div>
    `;
  }
  
  // Select character class
  selectClass(className) {
    soundManager.playClickSound();
    this.tempPlayer.class = className;
    this.selectedClasses.push(className);
    this.creationStep++;
    this.createCharacterStep();
  }
  
  // Get race step HTML
  getRaceStep() {
    return `
      <div class="creation-step">
        <h3>${this.tempPlayer.name}: Choose Your Race</h3>
        <div class="option-grid">
          ${characterData.races.map(race => 
            `<div class="option-card" onclick="characterCreator.selectRace('${race.name}')">
              <strong>${race.name}</strong><br>
              <small>${race.bonus}</small>
            </div>`
          ).join('')}
        </div>
      </div>
    `;
  }
  
  // Select character race
  selectRace(raceName) {
    soundManager.playClickSound();
    this.tempPlayer.race = raceName;
    this.creationStep++;
    this.createCharacterStep();
  }
  
  // Get background step HTML
  getBackgroundStep() {
    return `
      <div class="creation-step">
        <h3>${this.tempPlayer.name}: Choose Your Background</h3>
        <div class="option-grid">
          ${characterData.backgrounds.map(bg => 
            `<div class="option-card" onclick="characterCreator.selectBackground('${bg.name}')">
              <strong>${bg.name}</strong><br>
              <small>${bg.bonus}</small>
            </div>`
          ).join('')}
        </div>
      </div>
    `;
  }
  
  // Select character background
  selectBackground(backgroundName) {
    soundManager.playClickSound();
    this.tempPlayer.background = backgroundName;
    this.creationStep++;
    this.createCharacterStep();
  }
  
  // Get summary step HTML
  getSummaryStep() {
    const player = this.calculatePlayerStats();
    
    return `
      <div class="creation-step">
        <h3>${this.tempPlayer.name}: Character Summary</h3>
        <div class="character-summary">
          <div class="character-name">${this.tempPlayer.name}</div>
          
          <div class="character-details">
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-sword"></i> Class: ${this.tempPlayer.class}
              </div>
              <div class="detail-content">${this.getClassDescription()}</div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-dragon"></i> Race: ${this.tempPlayer.race}
              </div>
              <div class="detail-content">${this.getRaceDescription()}</div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-scroll"></i> Background: ${this.tempPlayer.background}
              </div>
              <div class="detail-content">${this.getBackgroundDescription()}</div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-heart"></i> Health
              </div>
              <div class="progress-bar health-bar">
                <div class="progress-fill" style="width: ${(player.health / player.maxHealth) * 100}%"></div>
              </div>
              <div class="progress-text">${player.health} / ${player.maxHealth} HP</div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-star"></i> Experience
              </div>
              <div class="progress-bar xp-bar">
                <div class="progress-fill" style="width: ${(player.xp / player.xpToNext) * 100}%"></div>
              </div>
              <div class="progress-text">${player.xp} / ${player.xpToNext} XP</div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-fist-raised"></i> Attributes
              </div>
              <div class="attributes-grid">
                ${this.getAttributeGrid(player.attributes)}
              </div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-tools"></i> Skills
              </div>
              <div class="skills-grid">
                ${this.getSkillsGrid(player.skills)}
              </div>
            </div>
            
            <div class="detail-section">
              <div class="detail-title">
                <i class="fas fa-magic"></i> Status Effects
              </div>
              <div class="status-effects">
                <div class="status-effect positive">
                  <i class="fas fa-check"></i> Healthy
                </div>
                <div class="status-effect positive">
                  <i class="fas fa-eye"></i> ${player.vision}
                </div>
                <div class="status-effect ${player.luck === 'lucky' ? 'positive' : player.luck === 'unlucky' ? 'negative' : 'positive'}">
                  <i class="fas fa-clover"></i> ${player.luck}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="option-grid">
          <div class="option-card" onclick="characterCreator.confirmCharacter()">
            <strong>Confirm Character</strong>
          </div>
          <div class="option-card" onclick="characterCreator.recreateCharacter()">
            <strong>Recreate</strong>
          </div>
        </div>
      </div>
    `;
  }
  
  // Get class description
  getClassDescription() {
    const classData = characterData.classes.find(cls => cls.name === this.tempPlayer.class);
    return classData ? classData.description : '';
  }
  
  // Get race description
  getRaceDescription() {
    const raceData = characterData.races.find(race => race.name === this.tempPlayer.race);
    return raceData ? raceData.description : '';
  }
  
  // Get background description
  getBackgroundDescription() {
    const bgData = characterData.backgrounds.find(bg => bg.name === this.tempPlayer.background);
    return bgData ? bgData.description : '';
  }
  
  // Get attribute grid HTML
  getAttributeGrid(attributes) {
    const attributeIcons = {
      strength: 'fas fa-dumbbell',
      dexterity: 'fas fa-running',
      intelligence: 'fas fa-brain',
      wisdom: 'fas fa-eye',
      constitution: 'fas fa-shield-alt',
      endurance: 'fas fa-heartbeat',
      luck: 'fas fa-clover',
      vision: 'fas fa-lightbulb'
    };
    
    const attributeNames = {
      strength: 'Strength',
      dexterity: 'Dexterity',
      intelligence: 'Intelligence',
      wisdom: 'Wisdom',
      constitution: 'Constitution',
      endurance: 'Endurance',
      luck: 'Luck'
    };
    
    return Object.entries(attributes).map(([attr, value]) => {
      if (attr === 'vision') return '';
      return `
        <div class="attribute-item">
          <div class="attribute-icon"><i class="${attributeIcons[attr] || 'fas fa-star'}"></i></div>
          <div class="attribute-name">${attributeNames[attr] || attr}</div>
          <div class="attribute-value">${value}</div>
        </div>
      `;
    }).join('') + `
      <div class="attribute-item">
        <div class="attribute-icon"><i class="fas fa-lightbulb"></i></div>
        <div class="attribute-name">Vision</div>
        <div class="attribute-value">${attributes.vision || 'normal'}</div>
      </div>
    `;
  }
  
  // Get skills grid HTML
  getSkillsGrid(skills) {
    return Object.entries(skills).map(([skill, level]) => 
      `<div class="skill-item">
        <div class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</div>
        <div class="skill-level">${level}</div>
      </div>`
    ).join('');
  }
  
  // Calculate player stats
  calculatePlayerStats() {
    const player = new Player(this.tempPlayer);
    
    // Get class and race data
    const classData = characterData.classes.find(cls => cls.name === this.tempPlayer.class);
    const raceData = characterData.races.find(race => race.name === this.tempPlayer.race);
    
    // Apply class and race bonuses
    if (classData && classData.attributes) {
      Object.entries(classData.attributes).forEach(([attr, value]) => {
        player.attributes[attr] += value;
      });
    }
    
    if (raceData && raceData.attributes) {
      Object.entries(raceData.attributes).forEach(([attr, value]) => {
        player.attributes[attr] += value;
      });
    }
    
    // Calculate derived stats
    player.calculateDerivedStats();
    
    // Apply skills based on class, race, and background
    this.applySkills(player);
    
    return player;
  }
  
  // Apply skills based on character choices
  applySkills(player) {
    // Class-based skills
    const classSkills = {
      'Warrior': { intimidation: 2, combat: 3 },
      'Mage': { arcana: 3, knowledge: 2 },
      'Rogue': { stealth: 3, lockpicking: 2 },
      'Cleric': { healing: 3, persuasion: 2 },
      'Druid': { nature: 3, animal_handling: 2 }
    };
    
    const raceSkills = {
      'Human': {}, // Extra skill point handled separately
      'Elf': { perception: 2 },
      'Dwarf': { resistance: 2 },
      'Halfling': { stealth: 1 },
      'Orc': { intimidation: 1 }
    };
    
    const backgroundSkills = {
      'Noble': { diplomacy: 2, etiquette: 2 },
      'Outcast': { survival: 2, stealth: 1 },
      'Scholar': { knowledge: 2, research: 2 },
      'Merchant': { negotiation: 2, appraisal: 2 },
      'Mercenary': { traps: 2, tracking: 2 }
    };
    
    // Apply class skills
    Object.entries(classSkills[player.class] || {}).forEach(([skill, level]) => {
      player.skills[skill] = level;
    });
    
    // Apply race skills
    Object.entries(raceSkills[player.race] || {}).forEach(([skill, level]) => {
      player.skills[skill] = (player.skills[skill] || 0) + level;
    });
    
    // Human bonus: extra skill point
    if (player.race === 'Human') {
      const firstSkill = Object.keys(player.skills)[0];
      if (firstSkill) {
        player.skills[firstSkill] += 1;
      }
    }
    
    // Apply background skills
    Object.entries(backgroundSkills[player.background] || {}).forEach(([skill, level]) => {
      player.skills[skill] = (player.skills[skill] || 0) + level;
    });
  }
  
  // Confirm character creation
  confirmCharacter() {
    soundManager.playSuccessSound();
    
    // Create player object with calculated stats
    const player = this.calculatePlayerStats();
    player.id = this.currentPlayerNumber;
    
    this.gameState.players.push(player);
    this.gameState.turnOrder.push(player.id);
    
    // Ask if another player wants to join
    if (this.currentPlayerNumber < this.gameState.playerCount) {
      this.showAddAnotherPlayerDialog();
    } else {
      this.startGame();
    }
  }
  
  // Show add another player dialog
  showAddAnotherPlayerDialog() {
    const content = helpers.getElement('creationContent');
    content.innerHTML = `
      <div class="creation-step">
        <h3>${this.tempPlayer.name} created successfully!</h3>
        <p>Would you like to add another player to the adventure?</p>
        <div class="option-grid">
          <div class="option-card" onclick="characterCreator.addAnotherPlayer()">
            <strong>Yes, add another player</strong>
          </div>
          <div class="option-card" onclick="characterCreator.startGame()">
            <strong>No, start the game</strong>
          </div>
        </div>
      </div>
    `;
  }
  
  // Add another player
  addAnotherPlayer() {
    soundManager.playClickSound();
    this.currentPlayerNumber++;
    this.tempPlayer = {};
    this.creationStep = 0;
    this.createCharacterStep();
  }
  
  // Recreate character
  recreateCharacter() {
    soundManager.playClickSound();
    this.selectedClasses = this.selectedClasses.filter(cls => cls !== this.tempPlayer.class);
    this.tempPlayer = {};
    this.creationStep = 0;
    this.createCharacterStep();
  }
  
  // Start the game
  startGame() {
    soundManager.playSuccessSound();
    uiManager.showScreen('gameInterface');
    
    // Initialize game state
    this.gameState.currentPlayerIndex = 0;
    this.initializeGameState();
    
    // Trigger game start
    if (window.gameController) {
      window.gameController.startGame();
    }
  }
  
  // Initialize game state
  initializeGameState() {
    this.gameState.setSituation("Your party stands at the edge of an ancient forest. The path ahead splits into three directions, each promising different adventures and dangers.");
    this.gameState.addObjective("Explore the surrounding area");
    this.gameState.addObjective("Find the first quest giver");
    this.gameState.addObjective("Survive the initial challenges");
    this.gameState.setLocation("forest");
    
    // Initialize some basic relationships
    this.gameState.relationships.npcs.village_elder = 0;
    this.gameState.relationships.npcs.forest_guardian = 0;
  }
}

// Export singleton instance
export const characterCreator = new CharacterCreator();