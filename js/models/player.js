// Player Model
export class Player {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.class = data.class || '';
    this.race = data.race || '';
    this.background = data.background || '';
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.xpToNext = data.xpToNext || 200;
    this.attributes = {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      wisdom: 10,
      constitution: 10,
      endurance: 10,
      luck: 10,
      ...data.attributes
    };
    this.health = data.health || 100;
    this.maxHealth = data.maxHealth || 100;
    this.inventory = data.inventory || [];
    this.status = data.status || [];
    this.vision = data.vision || 'normal';
    this.luck = data.luck || 'normal';
    this.skills = data.skills || {};
  }
  
  // Calculate derived stats
  calculateDerivedStats() {
    // Health based on constitution
    this.maxHealth = 100 + Math.floor(this.attributes.constitution / 2);
    
    // Vision based on attributes
    if (this.attributes.luck >= 14) {
      this.luck = 'lucky';
    } else if (this.attributes.luck <= 6) {
      this.luck = 'unlucky';
    } else {
      this.luck = 'normal';
    }
  }
  
  // Add experience points
  addXP(amount) {
    this.xp += amount;
    
    // Check for level up
    while (this.xp >= this.xpToNext) {
      this.levelUp();
    }
  }
  
  // Level up the player
  levelUp() {
    this.level++;
    this.xp -= this.xpToNext;
    this.xpToNext = this.getNextLevelXP();
    
    // Increase stats
    this.maxHealth += 10;
    this.health = this.maxHealth; // Full heal on level up
    
    // Increase primary attributes based on class
    this.increaseClassAttributes();
    
    // Add level up status
    this.status.push(`Level ${this.level}`);
    
    return this.level;
  }
  
  // Get XP needed for next level
  getNextLevelXP() {
    const levelThresholds = [200, 500, 1000, 2000, 4000];
    const levelIndex = Math.min(this.level - 1, levelThresholds.length - 1);
    return levelThresholds[levelIndex];
  }
  
  // Increase attributes based on class
  increaseClassAttributes() {
    const classBonuses = {
      'Warrior': { strength: 2, endurance: 1 },
      'Mage': { intelligence: 2, wisdom: 1 },
      'Rogue': { dexterity: 2, luck: 1 },
      'Cleric': { wisdom: 2, intelligence: 1 },
      'Druid': { constitution: 2, wisdom: 1 }
    };
    
    const bonuses = classBonuses[this.class] || {};
    Object.entries(bonuses).forEach(([attr, amount]) => {
      this.attributes[attr] += amount;
    });
  }
  
  // Take damage
  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    return this.health;
  }
  
  // Heal
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health;
  }
  
  // Check if player is dead
  isDead() {
    return this.health <= 0;
  }
  
  // Get skill level
  getSkillLevel(skillName) {
    return this.skills[skillName] || 0;
  }
  
  // Add skill points
  addSkillPoints(skillName, points) {
    this.skills[skillName] = (this.skills[skillName] || 0) + points;
  }
  
  // Add item to inventory
  addItem(item) {
    this.inventory.push(item);
  }
  
  // Remove item from inventory
  removeItem(item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Check if player has item
  hasItem(item) {
    return this.inventory.includes(item);
  }
  
  // Add status effect
  addStatus(status) {
    if (!this.status.includes(status)) {
      this.status.push(status);
    }
  }
  
  // Remove status effect
  removeStatus(status) {
    const index = this.status.indexOf(status);
    if (index > -1) {
      this.status.splice(index, 1);
    }
  }
  
  // Check if player has status
  hasStatus(status) {
    return this.status.includes(status);
  }
  
  // Get player summary
  getSummary() {
    return {
      name: this.name,
      class: this.class,
      level: this.level,
      health: `${this.health}/${this.maxHealth}`,
      xp: `${this.xp}/${this.xpToNext}`,
      status: this.status.join(', ') || 'none'
    };
  }
  
  // Serialize player data
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      class: this.class,
      race: this.race,
      background: this.background,
      level: this.level,
      xp: this.xp,
      xpToNext: this.xpToNext,
      attributes: this.attributes,
      health: this.health,
      maxHealth: this.maxHealth,
      inventory: this.inventory,
      status: this.status,
      vision: this.vision,
      luck: this.luck,
      skills: this.skills
    };
  }
}