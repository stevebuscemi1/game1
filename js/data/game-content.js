// Game Content Data - Contains all game content like quests, locations, NPCs, etc.
export const gameContent = {
    // Locations
    locations: {
        forest: {
            name: "Ancient Forest",
            description: "A dense, mystical forest filled with ancient trees and hidden secrets.",
            background: "https://picsum.photos/seed/fantasy-forest/1200/800.jpg",
            encounters: ["wolf_pack", "treasure_chest", "hermit_cabin"],
            npcs: ["forest_guardian", "lost_traveler"],
            quests: ["clear_the_path", "find_the_herb"],
            connections: ["village", "mountain"]
        },
        village: {
            name: "Peaceful Village",
            description: "A small, peaceful village where travelers can rest and resupply.",
            background: "https://picsum.photos/seed/fantasy-village/1200/800.jpg",
            encounters: ["market_stall", "village_elder"],
            npcs: ["village_elder", "merchant", "blacksmith"],
            quests: ["help_the_village", "missing_supplies"],
            connections: ["forest", "castle"]
        },
        dungeon: {
            name: "Dark Dungeon",
            description: "A dark, dangerous dungeon filled with traps and monsters.",
            background: "https://picsum.photos/seed/fantasy-dungeon/1200/800.jpg",
            encounters: ["skeleton_warrior", "trap_room", "treasure_room"],
            npcs: ["dungeon_keeper"],
            quests: ["defeat_the_boss", "find_the_artifact"],
            connections: ["castle", "cave"]
        },
        castle: {
            name: "Royal Castle",
            description: "A magnificent castle where the king and queen reside.",
            background: "https://picsum.photos/seed/fantasy-castle/1200/800.jpg",
            encounters: ["royal_guard", "court_noble"],
            npcs: ["king", "queen", "royal_advisor"],
            quests: ["royal_favor", "diplomatic_mission"],
            connections: ["village", "dungeon"]
        },
        mountain: {
            name: "Towering Mountain",
            description: "A treacherous mountain path with dangerous cliffs and harsh weather.",
            background: "https://picsum.photos/seed/fantasy-mountain/1200/800.jpg",
            encounters: ["mountain_lion", "avalanche", "hidden_cave"],
            npcs: ["mountain_hermit"],
            quests: ["reach_the_summit", "find_the_sacred_stone"],
            connections: ["forest", "cave"]
        },
        cave: {
            name: "Mysterious Cave",
            description: "A dark cave system filled with crystals and underground streams.",
            background: "https://picsum.photos/seed/fantasy-cave/1200/800.jpg",
            encounters: ["bat_swarm", "underground_lake", "crystal_formation"],
            npcs: ["cave_dwellers"],
            quests: ["explore_the_depths", "find_the_crystal"],
            connections: ["mountain", "dungeon"]
        }
    },
    
    // NPCs
    npcs: {
        village_elder: {
            name: "Elder Theron",
            description: "A wise old man who has seen many seasons come and go.",
            faction: "Village",
            relationship: 0,
            dialogue: {
                greeting: "Welcome, traveler. What brings you to our humble village?",
                quests: ["We need help with some local troubles.", "There are strange happenings in the forest."],
                services: ["I can share wisdom about the surrounding lands.", "I know of ancient legends that might help you."]
            }
        },
        forest_guardian: {
            name: "Liana the Guardian",
            description: "A mystical being who protects the ancient forest.",
            faction: "Nature",
            relationship: 0,
            dialogue: {
                greeting: "Why do you disturb the peace of this sacred forest?",
                quests: ["The forest is in danger from dark forces.", "Balance must be restored to nature."],
                services: ["I can teach you about the ways of nature.", "I can guide you through the safest paths."]
            }
        },
        merchant: {
            name: "Bartholomew the Merchant",
            description: "A shrewd merchant who deals in rare and exotic goods.",
            faction: "Merchant League",
            relationship: 0,
            dialogue: {
                greeting: "Welcome to my shop! I have the finest goods in the land.",
                quests: ["I need help acquiring some rare items.", "There are bandits attacking my caravans."],
                services: ["I can buy and sell goods.", "I have information about the local markets."]
            }
        },
        blacksmith: {
            name: "Gareth the Blacksmith",
            description: "A master craftsman who forges the finest weapons and armor.",
            faction: "Village",
            relationship: 0,
            dialogue: {
                greeting: "Need your gear fixed or looking for something new?",
                quests: ["I need rare materials for my craft.", "There are monsters threatening my forge."],
                services: ["I can repair and upgrade your equipment.", "I can craft custom items for you."]
            }
        },
        king: {
            name: "King Aldric",
            description: "The wise and just ruler of the realm.",
            faction: "Kingdom",
            relationship: 0,
            dialogue: {
                greeting: "I am King Aldric. What business do you have in my court?",
                quests: ["The kingdom faces threats from all sides.", "I need brave adventurers for a royal mission."],
                services: ["I can grant you royal favor and titles.", "I have access to the kingdom's resources."]
            }
        },
        dungeon_keeper: {
            name: "Morgrath the Keeper",
            description: "A mysterious figure who guards the ancient dungeon.",
            faction: "Unknown",
            relationship: 0,
            dialogue: {
                greeting: "Few who enter here leave unchanged. What do you seek?",
                quests: ["The dungeon's secrets must remain hidden.", "Ancient evils stir within these walls."],
                services: ["I can offer protection within the dungeon.", "I know of hidden passages and treasures."]
            }
        }
    },
    
    // Quests
    quests: {
        clear_the_path: {
            name: "Clear the Path",
            description: "The forest path is blocked by fallen trees and dangerous creatures.",
            difficulty: "Easy",
            rewards: { xp: 100, gold: 50, items: ["healing_potion"] },
            requirements: { level: 1 },
            objectives: [
                { id: 1, description: "Clear the fallen trees", completed: false },
                { id: 2, description: "Defeat the forest creatures", completed: false },
                { id: 3, description: "Report back to the village elder", completed: false }
            ]
        },
        find_the_herb: {
            name: "Find the Sacred Herb",
            description: "The village healer needs a rare herb that only grows in the deepest part of the forest.",
            difficulty: "Medium",
            rewards: { xp: 200, gold: 100, items: ["sacred_herb", "healing_potion"] },
            requirements: { level: 2 },
            objectives: [
                { id: 1, description: "Find the sacred herb", completed: false },
                { id: 2, description: "Return it to the healer", completed: false }
            ]
        },
        help_the_village: {
            name: "Help the Village",
            description: "The village is facing multiple problems and needs assistance.",
            difficulty: "Medium",
            rewards: { xp: 150, gold: 75, reputation: { village: 10 } },
            requirements: { level: 1 },
            objectives: [
                { id: 1, description: "Speak with the village elder", completed: false },
                { id: 2, description: "Complete 3 village tasks", completed: false }
            ]
        },
        defeat_the_boss: {
            name: "Defeat the Dungeon Boss",
            description: "A powerful creature lurks in the depths of the dungeon and must be defeated.",
            difficulty: "Hard",
            rewards: { xp: 500, gold: 200, items: ["boss_weapon", "rare_armor"] },
            requirements: { level: 5 },
            objectives: [
                { id: 1, description: "Reach the dungeon depths", completed: false },
                { id: 2, description: "Defeat the dungeon boss", completed: false }
            ]
        },
        royal_favor: {
            name: "Royal Favor",
            description: "The king has a special task that requires discretion and skill.",
            difficulty: "Hard",
            rewards: { xp: 400, gold: 300, reputation: { kingdom: 20 }, title: "Royal Agent" },
            requirements: { level: 4 },
            objectives: [
                { id: 1, description: "Receive the king's instructions", completed: false },
                { id: 2, description: "Complete the secret mission", completed: false },
                { id: 3, description: "Report back to the king", completed: false }
            ]
        },
        reach_the_summit: {
            name: "Reach the Summit",
            description: "Climb the treacherous mountain peak and uncover its secrets.",
            difficulty: "Hard",
            rewards: { xp: 350, gold: 150, items: ["summit_crystal"] },
            requirements: { level: 3 },
            objectives: [
                { id: 1, description: "Climb the mountain path", completed: false },
                { id: 2, description: "Reach the summit", completed: false },
                { id: 3, description: "Investigate the summit ruins", completed: false }
            ]
        }
    },
    
    // Encounters
    encounters: {
        wolf_pack: {
            name: "Wolf Pack",
            type: "combat",
            difficulty: "Easy",
            description: "A pack of hungry wolves blocks your path.",
            choices: [
                { text: "Fight the wolves", outcome: "combat", success: 70 },
                { text: "Try to intimidate them", outcome: "skill_check", skill: "intimidation", difficulty: 12 },
                { text: "Look for another path", outcome: "avoid", success: 60 }
            ]
        },
        treasure_chest: {
            name: "Treasure Chest",
            type: "treasure",
            difficulty: "Easy",
            description: "You discover an old treasure chest hidden among the roots of a great tree.",
            choices: [
                { text: "Open it carefully", outcome: "treasure", success: 80 },
                { text: "Check for traps first", outcome: "skill_check", skill: "perception", difficulty: 10 },
                { text: "Leave it alone", outcome: "avoid", success: 100 }
            ]
        },
        hermit_cabin: {
            name: "Hermit's Cabin",
            type: "npc",
            difficulty: "Medium",
            description: "A small cabin appears in the clearing, smoke rising from its chimney.",
            choices: [
                { text: "Approach and knock", outcome: "npc_meeting", success: 90 },
                { text: "Observe from a distance", outcome: "investigation", success: 70 },
                { text: "Continue on your way", outcome: "avoid", success: 100 }
            ]
        },
        skeleton_warrior: {
            name: "Skeleton Warrior",
            type: "combat",
            difficulty: "Medium",
            description: "An animated skeleton warrior guards this corridor, ancient armor still clinging to its bones.",
            choices: [
                { text: "Attack immediately", outcome: "combat", success: 60 },
                { text: "Try to turn undead", outcome: "skill_check", skill: "divine", difficulty: 14 },
                { text: "Look for weaknesses", outcome: "investigation", success: 75 }
            ]
        },
        trap_room: {
            name: "Trapped Room",
            type: "trap",
            difficulty: "Medium",
            description: "The room ahead looks suspicious - there might be traps.",
            choices: [
                { text: "Search for traps carefully", outcome: "skill_check", skill: "perception", difficulty: 12 },
                { text: "Try to disable any traps", outcome: "skill_check", skill: "traps", difficulty: 14 },
                { text: "Charge through quickly", outcome: "risk", success: 40 }
            ]
        }
    },
    
    // Items
    items: {
        healing_potion: {
            name: "Healing Potion",
            type: "consumable",
            description: "A magical potion that restores health when consumed.",
            effect: { health: 50 },
            value: 25
        },
        sacred_herb: {
            name: "Sacred Herb",
            type: "quest",
            description: "A rare herb with powerful healing properties.",
            effect: {},
            value: 100
        },
        boss_weapon: {
            name: "Dreadlord's Sword",
            type: "weapon",
            description: "A powerful sword taken from a defeated boss.",
            effect: { attack: 15 },
            value: 500
        },
        rare_armor: {
            name: "Dragon Scale Armor",
            type: "armor",
            description: "Armor crafted from the scales of an ancient dragon.",
            effect: { defense: 20, health: 50 },
            value: 750
        },
        summit_crystal: {
            name: "Summit Crystal",
            type: "quest",
            description: "A crystal that glows with inner light, found only at mountain peaks.",
            effect: {},
            value: 200
        }
    },
    
    // Factions
    factions: {
        kingdom: {
            name: "Kingdom Guard",
            description: "The official military force of the realm.",
            reputation_levels: {
                hated: "Hated - You are considered an enemy of the kingdom",
                unfriendly: "Unfriendly - You are viewed with suspicion",
                neutral: "Neutral - You have no particular standing",
                friendly: "Friendly - You are welcomed in the kingdom",
                honored: "Honored - You are a respected hero of the realm"
            }
        },
        thieves_guild: {
            name: "Thieves Guild",
            description: "A secretive organization of rogues and thieves.",
            reputation_levels: {
                hated: "Marked for Death - The guild wants you eliminated",
                unfriendly: "Unwelcome - You are not trusted in the underworld",
                neutral: "Unknown - The guild doesn't know you well",
                friendly: "Associate - You have some connections in the guild",
                honored: "Guild Master - You hold a position of power"
            }
        },
        mage_council: {
            name: "Mage Council",
            description: "A council of powerful magic users who study the arcane arts.",
            reputation_levels: {
                hated: "Magic Enemy - You are considered a threat to magic",
                unfriendly: "Untrusted - Your use of magic is questioned",
                neutral: "Unknown - The council is unaware of your magical abilities",
                friendly: "Apprentice - You are learning the magical arts",
                honored: "Archmage - You are a master of magic"
            }
        },
        merchant_league: {
            name: "Merchant League",
            description: "A powerful organization of traders and merchants.",
            reputation_levels: {
                hated: "Blacklisted - No merchant will deal with you",
                unfriendly: "Unreliable - Merchants are hesitant to trade with you",
                neutral: "Customer - You receive standard prices",
                friendly: "Valued Customer - You receive discounts on goods",
                honored: "Trade Partner - You receive the best prices and exclusive deals"
            }
        },
        nature_cult: {
            name: "Nature Cult",
            description: "A group dedicated to preserving the natural world.",
            reputation_levels: {
                hated: "Nature's Enemy - You are considered a blight upon nature",
                unfriendly: "Unnatural - Your presence disturbs the natural order",
                neutral: "Neutral - Nature neither helps nor hinders you",
                friendly: "Nature's Friend - Animals and plants aid you",
                honored: "Nature's Champion - You can command the forces of nature"
            }
        }
    },
    
    // Game Events
    events: {
        level_up: {
            name: "Level Up!",
            description: "You have gained enough experience to level up!",
            effects: ["health_increase", "stat_increase", "new_abilities"]
        },
        quest_complete: {
            name: "Quest Complete!",
            description: "You have successfully completed a quest!",
            effects: ["reward_xp", "reward_gold", "reward_reputation"]
        },
        discovery: {
            name: "Discovery!",
            description: "You have discovered something new and interesting!",
            effects: ["gain_knowledge", "gain_item", "gain_reputation"]
        },
        companion_join: {
            name: "New Companion!",
            description: "A new companion has joined your party!",
            effects: ["gain_ally", "new_abilities"]
        }
    }
};

// Export game content
export default gameContent;