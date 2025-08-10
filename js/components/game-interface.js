// js/components/game-interface.js
// Game Interface Component with enhanced dialog management
import { helpers } from '../utils/helpers.js';
import { soundManager } from '../utils/sound.js';
import { characterAvatars, contextualHelpContent } from '../data/character-data.js';
import { uiManager } from './ui-manager.js';

export class GameInterface {
    constructor() {
        this.gameController = null;
        this.commandInput = null;
        this.choicesArea = null;
        this.narrativeArea = null;
        this.turnIndicator = null;
        this.sceneDescription = null;
        this.infoBar = null;
        this.dialogContainer = null;
        this.currentChoices = [];
        this.dialogTimeouts = new Map(); // Track dialog timeouts for cleanup
        this.initializeElements();
        this.setupEventListeners();
    }

    // Initialize DOM elements
    initializeElements() {
        this.commandInput = helpers.getElement('commandInput');
        this.choicesArea = helpers.getElement('choicesArea');
        this.narrativeArea = helpers.getElement('narrativeArea');
        this.turnIndicator = helpers.getElement('turnIndicator');
        this.sceneDescription = helpers.getElement('sceneDescription');
        this.infoBar = helpers.getElement('infoBar');
        this.dialogContainer = helpers.getElement('dialogContainer');
        
        // Create dialog container if it doesn't exist
        if (!this.dialogContainer) {
            this.dialogContainer = helpers.createElement('div', 'dialog-container');
            this.narrativeArea.appendChild(this.dialogContainer);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Command input handling
        if (this.commandInput) {
            this.commandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = this.commandInput.value.trim();
                    if (command !== '') {
                        this.processCommand(command);
                        this.commandInput.value = '';
                    }
                }
            });
        }
        
        // Choice buttons will be set dynamically when generated
    }

    // Set game controller reference
    setGameController(gameController) {
        this.gameController = gameController;
    }

    // Handle command input key press
    handleCommandKeyPress(event) {
        if (event.key === 'Enter') {
            const command = this.commandInput.value.trim();
            if (command !== '') {
                this.processCommand(command);
                this.commandInput.value = '';
            }
        }
    }

    // Process command input
    processCommand(command) {
        soundManager.playCommandSound();
        // Add command processing animation
        uiManager.animateElement(this.commandInput, 'command-processing', 1000);
        if (this.gameController) {
            this.gameController.processCommand(command);
        }
    }

    // Start a new turn
    startTurn(player) {
        // Add turn change animation
        uiManager.animateElement(this.turnIndicator, 'turn-change-animation', 500);
        
        // Play turn change sound
        soundManager.playTurnChangeSound();
        
        // Update turn indicator
        this.updateTurnIndicator(player);
        
        // Update contextual help
        this.updateContextualHelp(player);
        
        // Generate scene description
        this.generateSceneDescription(player);
        
        // Update info bar
        this.updateInfoBar(player);
        
        // Generate choices
        this.generateChoices(player);
        
        // Focus on command input
        if (this.commandInput) {
            this.commandInput.focus();
        }
    }

    // Update turn indicator
    updateTurnIndicator(player) {
        if (this.turnIndicator) {
            this.turnIndicator.innerHTML = `=== ${player.name}'s Turn (${player.class}) ===`;
        }
    }

    // Update contextual help
    updateContextualHelp(player) {
        const playerClass = player.class.toLowerCase();
        const location = this.gameController?.gameState?.currentLocation?.toLowerCase() || 'forest';
        let helpText = contextualHelpContent[playerClass] || contextualHelpContent.default;
        
        // Add location-specific help if available
        if (contextualHelpContent[location]) {
            helpText += " " + contextualHelpContent[location];
        }
        
        uiManager.updateContextHelp(helpText);
    }

    // Generate scene description
    generateSceneDescription(player) {
        if (!this.sceneDescription) return;
        
        const descriptions = {
            Warrior: "As a warrior, you survey the area with tactical precision. Your keen eye spots potential threats and advantageous terrain. The weight of your weapon feels comforting as you prepare for whatever lies ahead.",
            Mage: "Magical energy crackles at your fingertips as you sense the arcane currents flowing through this land. Ancient knowledge whispers to you, revealing hidden truths about the environment that others might miss.",
            Rogue: "Shadows dance at the edge of your vision as you move with silent grace. Your trained eyes notice every detail - loose stones, hidden pathways, and potential treasures that others would overlook.",
            Cleric: "Divine light guides your path as you feel the presence of higher powers. Your wisdom allows you to perceive the moral implications of each choice and the spiritual state of those around you.",
            Druid: "Nature speaks to you in rustling leaves and whispering winds. You feel the heartbeat of the earth beneath your feet and understand the delicate balance of the ecosystem surrounding you"
        };
        
        const currentSituation = this.gameController?.gameState?.currentSituation || "";
        const descriptionText = (descriptions[player.class] || "") + " " + currentSituation;
        
        // Clear previous content
        this.sceneDescription.innerHTML = '';
        
        // Apply typewriter effect
        helpers.typeWriter(this.sceneDescription, descriptionText, 30);
    }

    // Generate choices for current player
    generateChoices(player) {
        if (!this.choicesArea) return;
        
        const choices = {
            Warrior: [
                "Survey the area for tactical advantages and potential threats",
                "Test your strength by moving a large obstacle blocking one path",
                "Intimidate any nearby creatures to assert dominance over the territory"
            ],
            Mage: [
                "Cast a detection spell to reveal magical auras and hidden pathways",
                "Consult your arcane knowledge about the local legends and dangers",
                "Attempt to communicate with any magical entities in the vicinity"
            ],
            Rogue: [
                "Scout ahead stealthily to gather information about each path",
                "Search for hidden traps, secret doors, or valuable items",
                "Use your agility to climb a high vantage point for better visibility"
            ],
            Cleric: [
                "Pray for divine guidance about which path to choose",
                "Heal and bless your party members before proceeding",
                "Attempt to make peaceful contact with any intelligent beings nearby"
            ],
            Druid: [
                "Commune with nature spirits to learn about the safest path",
                "Shapeshift into an animal form to scout the area unnoticed",
                "Use your earth magic to manipulate the terrain and clear obstacles"
            ]
        };
        
        this.currentChoices = choices[player.class] || [];
        
        // Create a container for choices and dialog
        const choicesAndDialogContainer = helpers.createElement('div', 'choices-and-dialog-container');
        
        // Create choices area
        const choicesDiv = helpers.createElement('div', 'choices-div');
        choicesDiv.innerHTML = this.currentChoices.map((choice, index) =>
            `<button class="choice-button" data-choice="${index}" aria-label="Choice ${index + 1}: ${choice}">
                ${index + 1}. ${choice}
            </button>`
        ).join('');
        
        // Create dialog container
        const dialogDiv = helpers.createElement('div', 'dialog-container');
        dialogDiv.id = 'dialogContainer';
        
        // Add both to the container
        choicesAndDialogContainer.appendChild(choicesDiv);
        choicesAndDialogContainer.appendChild(dialogDiv);
        
        // Replace choices area content
        this.choicesArea.innerHTML = '';
        this.choicesArea.appendChild(choicesAndDialogContainer);
        
        // Add event listeners to choice buttons
        const choiceButtons = choicesDiv.querySelectorAll('.choice-button');
        choiceButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.makeChoice(index);
            });
        });
    }

    // Make a choice
    makeChoice(choiceIndex) {
        soundManager.playClickSound();
        const choiceButtons = this.choicesArea?.querySelectorAll('.choice-button');
        if (choiceButtons && choiceButtons[choiceIndex]) {
            uiManager.animateElement(choiceButtons[choiceIndex], 'choice-selected', 600);
        }
        if (this.gameController) {
            this.gameController.makeChoice(choiceIndex);
        }
    }

    // Update info bar
    updateInfoBar(player) {
        if (this.gameController && this.infoBar) {
            uiManager.updateInfoBar(player, this.gameController.gameState);
        }
    }

    // Add character dialog to narrative - FIXED to persist for 20 seconds
    addCharacterDialog(characterName, avatarUrl, dialogText) {
        if (!this.dialogContainer) return;
        
        // Create dialog element
        const dialogElement = helpers.createElement('div', 'character-dialog');
        dialogElement.setAttribute('role', 'article');
        dialogElement.setAttribute('aria-label', `Dialog from ${characterName}`);
        
        // Create avatar if available
        if (avatarUrl) {
            const avatar = helpers.createElement('img', 'character-avatar');
            avatar.src = avatarUrl;
            avatar.alt = `${characterName} avatar`;
            avatar.setAttribute('aria-hidden', 'true');
            dialogElement.appendChild(avatar);
        }
        
        // Create character name
        const nameElement = helpers.createElement('div', 'character-name');
        nameElement.textContent = characterName;
        dialogElement.appendChild(nameElement);
        
        // Create dialog text
        const textElement = helpers.createElement('div', 'dialog-text');
        textElement.textContent = dialogText;
        dialogElement.appendChild(textElement);
        
        // Add timestamp for identification
        const timestamp = Date.now();
        dialogElement.setAttribute('data-timestamp', timestamp);
        
        // Add to dialog container
        this.dialogContainer.appendChild(dialogElement);
        
        // Scroll to bottom
        this.dialogContainer.scrollTop = this.dialogContainer.scrollHeight;
        
        // Clear any existing timeout for this dialog
        if (this.dialogTimeouts.has(timestamp)) {
            clearTimeout(this.dialogTimeouts.get(timestamp));
        }
        
        // Set timeout to remove dialog after 20 seconds
        const timeoutId = setTimeout(() => {
            if (dialogElement.parentNode) {
                // Fade out animation
                dialogElement.style.opacity = '0';
                dialogElement.style.transition = 'opacity 1s ease-out';
                
                // Remove after animation
                setTimeout(() => {
                    if (dialogElement.parentNode) {
                        dialogElement.parentNode.removeChild(dialogElement);
                    }
                }, 1000);
            }
            this.dialogTimeouts.delete(timestamp);
        }, 20000); // 20 seconds
        
        this.dialogTimeouts.set(timestamp, timeoutId);
        
        // Announce to screen readers
        const announcement = `${characterName} says: ${dialogText}`;
        uiManager.announceToScreenReader(announcement);
    }

    // Change location background
    changeLocation(newLocation) {
        if (this.narrativeArea) {
            // Remove all location classes
            this.narrativeArea.classList.remove('location-forest', 'location-dungeon', 'location-village', 'location-castle', 'location-mountain');
            
            // Add new location class
            this.narrativeArea.classList.add(`location-${newLocation}`);
        }
    }

    // Show player health change animation
    showHealthChange() {
        if (this.infoBar) {
            uiManager.animateElement(this.infoBar, 'health-change', 800);
        }
    }

    // Clear narrative area
    clearNarrative() {
        if (this.sceneDescription) {
            this.sceneDescription.innerHTML = '';
        }
        
        // Clear all dialogs and timeouts
        if (this.dialogContainer) {
            this.dialogContainer.innerHTML = '';
            
            // Clear all dialog timeouts
            this.dialogTimeouts.forEach((timeoutId, timestamp) => {
                clearTimeout(timeoutId);
            });
            this.dialogTimeouts.clear();
        }
    }

    // Add text to narrative
    addNarrativeText(text, options = {}) {
        if (!this.sceneDescription) return;
        
        const textElement = helpers.createElement('div', options.className || '');
        textElement.innerHTML = text;
        
        if (options.typewriter) {
            helpers.typeWriter(textElement, text, options.speed || 50);
        } else {
            this.sceneDescription.appendChild(textElement);
        }
        
        // Scroll to bottom
        this.sceneDescription.scrollTop = this.sceneDescription.scrollHeight;
    }

    // Show game over screen
    showGameOver(message) {
        const content = `
            <div class="game-over-content">
                <h2>Game Over</h2>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.gameInterface.returnToMenu()">Return to Menu</button>
            </div>
        `;
        uiManager.createModal(content);
    }

    // Show victory screen
    showVictory(message) {
        const content = `
            <div class="victory-content">
                <h2>Victory!</h2>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.gameInterface.returnToMenu()">Return to Menu</button>
            </div>
        `;
        uiManager.createModal(content);
    }

    // Return to main menu
    returnToMenu() {
        if (this.gameController) {
            this.gameController.endAdventure();
        }
        uiManager.showScreen('mainMenu');
    }

    // Show loading state
    showLoading(message = 'Processing...') {
        uiManager.showLoading(message);
    }

    // Hide loading state
    hideLoading() {
        uiManager.hideLoading();
    }

    // Show error message
    showError(message) {
        uiManager.showError(message);
    }

    // Show success message
    showSuccess(message) {
        uiManager.showSuccess(message);
    }

    // Disable user input
    disableInput() {
        if (this.commandInput) {
            this.commandInput.disabled = true;
        }
        if (this.choicesArea) {
            this.choicesArea.style.pointerEvents = 'none';
            this.choicesArea.style.opacity = '0.5';
        }
    }

    // Enable user input
    enableInput() {
        if (this.commandInput) {
            this.commandInput.disabled = false;
        }
        if (this.choicesArea) {
            this.choicesArea.style.pointerEvents = 'auto';
            this.choicesArea.style.opacity = '1';
        }
    }

    // Get current command input
    getCommandInput() {
        return this.commandInput?.value.trim() || '';
    }

    // Clear command input
    clearCommandInput() {
        if (this.commandInput) {
            this.commandInput.value = '';
        }
    }

    // Focus command input
    focusCommandInput() {
        if (this.commandInput) {
            this.commandInput.focus();
        }
    }

    // Toggle context help
    toggleContextHelp() {
        const helpTooltip = helpers.getElement('contextHelpTooltip');
        if (helpTooltip) {
            helpTooltip.classList.toggle('active');
            
            // Position the tooltip
            const helpButton = document.querySelector('.help-button');
            if (helpButton) {
                const buttonRect = helpButton.getBoundingClientRect();
                helpTooltip.style.top = (buttonRect.bottom + 10) + 'px';
                helpTooltip.style.left = (buttonRect.left - 250) + 'px';
            }
        }
    }

    // Cleanup method
    cleanup() {
        // Clear all dialog timeouts
        this.dialogTimeouts.forEach((timeoutId, timestamp) => {
            clearTimeout(timeoutId);
        });
        this.dialogTimeouts.clear();
        
        // Clear dialog container
        if (this.dialogContainer) {
            this.dialogContainer.innerHTML = '';
        }
    }
}

// Export singleton instance
export const gameInterface = new GameInterface();
