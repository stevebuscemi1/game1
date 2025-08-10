// Character Data Definitions
export const characterData = {
  classes: [
    { 
      name: 'Warrior', 
      bonus: '+2 Strength, combat bonuses, intimidation options', 
      attributes: { strength: 2 },
      description: 'Warriors are masters of combat, trained in various weapons and armor. They have exceptional strength and can intimidate foes with their presence.'
    },
    { 
      name: 'Mage', 
      bonus: '+2 Intelligence, spellcasting, knowledge-based choices', 
      attributes: { intelligence: 2 },
      description: 'Mages wield powerful magic, drawing on arcane knowledge to cast spells. They are intelligent and can solve problems others cannot.'
    },
    { 
      name: 'Rogue', 
      bonus: '+2 Dexterity, stealth, lockpicking, trap detection', 
      attributes: { dexterity: 2 },
      description: 'Rogues are stealthy and agile, skilled in lockpicking, trap detection, and striking from the shadows. They rely on dexterity and cunning.'
    },
    { 
      name: 'Cleric', 
      bonus: '+2 Wisdom, healing, divine magic, persuasion', 
      attributes: { wisdom: 2 },
      description: 'Clerics are divine spellcasters who serve higher powers. They can heal wounds, turn undead, and persuade others with their wisdom.'
    },
    { 
      name: 'Druid', 
      bonus: '+2 Constitution, shapeshifting, earth magic, lore knowledge', 
      attributes: { constitution: 2 },
      description: 'Druids are guardians of nature, able to shapeshift and wield earth magic. They have strong constitution and deep knowledge of natural lore.'
    }
  ],
  races: [
    { 
      name: 'Human', 
      bonus: 'Balanced stats, extra skill point', 
      attributes: {},
      description: 'Humans are versatile and adaptable, with balanced stats and an extra skill point. They can excel in any class.'
    },
    { 
      name: 'Elf', 
      bonus: '+2 Dexterity, darkvision, nature affinity', 
      attributes: { dexterity: 2 },
      description: 'Elves are graceful and long-lived, with enhanced dexterity and darkvision. They have a natural affinity for nature and magic.'
    },
    { 
      name: 'Dwarf', 
      bonus: '+2 Constitution, stonecunning, poison resistance', 
      attributes: { constitution: 2 },
      description: 'Dwarves are sturdy and resilient, with enhanced constitution and resistance to poison. They are skilled miners and craftsmen.'
    },
    { 
      name: 'Halfling', 
      bonus: '+2 Luck, stealth bonus, fear resistance', 
      attributes: { luck: 2 },
      description: 'Halflings are small and lucky, with enhanced luck and stealth. They are resistant to fear and can move quietly.'
    },
    { 
      name: 'Orc', 
      bonus: '+2 Endurance, rage bonus, damage resistance', 
      attributes: { endurance: 2 },
      description: 'Orcs are strong and tough, with enhanced endurance and damage resistance. They can enter a rage in combat, increasing their power.'
    }
  ],
  backgrounds: [
    { 
      name: 'Noble', 
      bonus: 'Social advantages, starting wealth, reputation',
      description: 'Nobles are born to privilege, with social advantages, starting wealth, and reputation. They are skilled in diplomacy and etiquette.'
    },
    { 
      name: 'Outcast', 
      bonus: 'Survival skills, underworld connections',
      description: 'Outcasts have survived on the fringes of society, developing survival skills and underworld connections. They are resourceful and self-reliant.'
    },
    { 
      name: 'Scholar', 
      bonus: 'Knowledge bonuses, lore recognition',
      description: 'Scholars have spent years studying, gaining knowledge bonuses and lore recognition. They can decipher ancient texts and solve complex puzzles.'
    },
    { 
      name: 'Merchant', 
      bonus: 'Negotiation skills, resource management',
      description: 'Merchants are skilled in trade and negotiation, with resource management abilities. They can find buyers for almost anything and get better prices.'
    },
    { 
      name: 'Mercenary', 
      bonus: 'Traps skills, tracking',
      description: 'Mercenaries are experienced in combat and tracking, with skills in traps and survival. They are pragmatic and focused on getting the job done.'
    }
  ]
};

// Character avatars
export const characterAvatars = {
  warrior: 'https://picsum.photos/seed/warrior-avatar/200/200.jpg',
  mage: 'https://picsum.photos/seed/mage-avatar/200/200.jpg',
  rogue: 'https://picsum.photos/seed/rogue-avatar/200/200.jpg',
  cleric: 'https://picsum.photos/seed/cleric-avatar/200/200.jpg',
  druid: 'https://picsum.photos/seed/druid-avatar/200/200.jpg'
};

// Game master avatar
export const gameMasterAvatar = 'https://picsum.photos/seed/gamemaster-avatar/200/200.jpg';

// Contextual help content
export const contextualHelpContent = {
  default: "Select one of the three choices or type a command in the input field below. Your choices will shape the story and affect your character's development.",
  warrior: "As a Warrior, you excel in combat and intimidation. Your strength allows you to overcome physical challenges and intimidate foes. Look for opportunities to use your combat skills.",
  mage: "As a Mage, you wield powerful arcane magic. Your intelligence helps you solve puzzles and uncover hidden knowledge. Look for magical elements in your environment.",
  rogue: "As a Rogue, you are stealthy and agile. Your dexterity helps you avoid traps and move unnoticed. Look for hidden paths, treasures, and opportunities to use your stealth.",
  cleric: "As a Cleric, you are a divine spellcaster with wisdom and healing abilities. You can persuade others and provide support to your party. Look for opportunities to help others and use your divine powers.",
  druid: "As a Druid, you are connected to nature and can shapeshift. Your constitution helps you endure hardships. Look for natural elements and opportunities to use your connection to the wild.",
  forest: "You are in a dense forest. There may be hidden paths, creatures, and resources to discover. Druids and Rangers excel in this environment.",
  dungeon: "You are in a dark dungeon. There may be traps, treasures, and dangerous creatures. Rogues and Warriors excel in this environment.",
  village: "You are in a peaceful village. There may be NPCs to talk to, quests to undertake, and supplies to purchase. All classes can find opportunities here.",
  castle: "You are in a majestic castle. There may be nobles to persuade, guards to interact with, and secrets to uncover. Nobles and Clerics excel in this environment.",
  mountain: "You are on a treacherous mountain. There may be climbing challenges, harsh weather, and rare resources. Dwarves and Druids excel in this environment."
};

// Level thresholds
export const levelThresholds = [200, 500, 1000, 2000, 4000];