// UI Manager Component
import { helpers } from '../utils/helpers.js';
import { soundManager } from '../utils/sound.js';

export class UIManager {
  constructor() {
    this.currentScreen = 'mainMenu';
    this.screens = {};
    this.modals = [];
    this.initializeEventListeners();
  }
  
  // Initialize event listeners
  initializeEventListeners() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    
    // Close modals on outside click
    document.addEventListener('click', (e) => this.handleModalOutsideClick(e));
    
    // Initialize audio on first interaction
    document.addEventListener('click', () => soundManager.init(), { once: true });
  }
  
  // Handle global keyboard shortcuts
  handleGlobalKeydown(event) {
    switch (event.key) {
      case 'Escape':
        this.handleEscapeKey();
        break;
    }
  }
  
  // Handle escape key
  handleEscapeKey() {
    // Close any open modals first
    if (this.modals.length > 0) {
      this.closeTopModal();
      return;
    }
    
    // Go back to main menu if not already there
    if (this.currentScreen !== 'mainMenu') {
      this.showScreen('mainMenu');
    }
  }
  
  // Handle clicks outside modals
  handleModalOutsideClick(event) {
    if (this.modals.length === 0) return;
    
    const topModal = this.modals[this.modals.length - 1];
    if (topModal.contains(event.target)) return;
    
    // Check if click was on help tooltip
    const helpTooltip = helpers.getElement('contextHelpTooltip');
    if (helpTooltip && helpTooltip.classList.contains('active') && !helpTooltip.contains(event.target)) {
      const helpButton = document.querySelector('.help-button');
      if (!helpButton.contains(event.target)) {
        this.toggleContextHelp();
      }
    }
  }
  
  // Show screen
  showScreen(screenId) {
    this.currentScreen = screenId;
    helpers.showScreen(screenId);
    soundManager.playClickSound();
  }
  
  // Create modal
  createModal(content, options = {}) {
    const modal = helpers.createElement('div', 'modal-overlay');
    const modalContent = helpers.createElement('div', 'modal-content');
    modalContent.innerHTML = content;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    this.modals.push(modal);
    
    // Setup close button if provided
    if (options.closeButton) {
      const closeBtn = modalContent.querySelector('.close-button') || 
                      helpers.createElement('button', 'close-button', '×');
      closeBtn.addEventListener('click', () => this.closeModal(modal));
      if (!modalContent.contains(closeBtn)) {
        modalContent.appendChild(closeBtn);
      }
    }
    
    return modal;
  }
  
  // Close modal
  closeModal(modal) {
    const index = this.modals.indexOf(modal);
    if (index > -1) {
      this.modals.splice(index, 1);
      modal.remove();
    }
  }
  
  // Close top modal
  closeTopModal() {
    if (this.modals.length > 0) {
      this.closeModal(this.modals[this.modals.length - 1]);
    }
  }
  
  // Close all modals
  closeAllModals() {
    this.modals.forEach(modal => modal.remove());
    this.modals = [];
  }
  
  // Show confirmation dialog
  showConfirmation(message, onConfirm, onCancel) {
    const content = `
      <div style="background: rgba(139, 69, 19, 0.9); border: 2px solid #ffd700; border-radius: 10px; padding: 20px; max-width: 400px; text-align: center;">
        <h3 style="font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 15px;">Confirmation</h3>
        <p style="margin-bottom: 20px;">${message}</p>
        <div class="centered-buttons">
          <button class="menu-button" onclick="this.closest('.modal-overlay').querySelector('.confirm-btn').click();">
            <i class="fas fa-check"></i> Yes
          </button>
          <button class="menu-button" onclick="this.closest('.modal-overlay').querySelector('.cancel-btn').click();">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    `;
    
    const modal = this.createModal(content);
    
    // Add event listeners
    const confirmBtn = helpers.createElement('button', 'confirm-btn hidden');
    const cancelBtn = helpers.createElement('button', 'cancel-btn hidden');
    
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      this.closeModal(modal);
    });
    
    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      this.closeModal(modal);
    });
    
    modal.appendChild(confirmBtn);
    modal.appendChild(cancelBtn);
    
    return modal;
  }
  
  // Show alert dialog
  showAlert(message, title = 'Alert') {
    const content = `
      <div style="background: rgba(139, 69, 19, 0.9); border: 2px solid #ffd700; border-radius: 10px; padding: 20px; max-width: 400px; text-align: center;">
        <h3 style="font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 15px;">${title}</h3>
        <p style="margin-bottom: 20px;">${message}</p>
        <div class="centered-buttons">
          <button class="menu-button" onclick="this.closest('.modal-overlay').remove();">
            <i class="fas fa-check"></i> OK
          </button>
        </div>
      </div>
    `;
    
    return this.createModal(content);
  }
  
  // Show save dialog
  showSaveDialog(saveData) {
    const content = `
      <div style="background: rgba(139, 69, 19, 0.9); border: 2px solid #ffd700; border-radius: 10px; padding: 20px; max-width: 80%; max-height: 80%; overflow-y: auto;">
        <h3 style="font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 15px;">Save Game Data</h3>
        <p style="margin-bottom: 15px;">Copy the text below to save your game progress:</p>
        <textarea readonly style="width: 100%; height: 300px; background: rgba(0, 0, 0, 0.7); border: 1px solid #8b4513; border-radius: 5px; color: #f4e4bc; padding: 10px; font-family: 'Courier New', monospace; resize: none;">${saveData}</textarea>
        <div style="text-align: center; margin-top: 15px;">
          <button class="menu-button" onclick="this.closest('.modal-overlay').remove(); soundManager.playClickSound();">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    `;
    
    return this.createModal(content);
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
    soundManager.playClickSound();
  }
  
  // Update context help content
  updateContextHelp(content) {
    const helpTooltipContent = helpers.getElement('helpTooltipContent');
    if (helpTooltipContent) {
      helpTooltipContent.textContent = content;
    }
  }
  
  // Add character dialog to narrative area
  addCharacterDialog(characterName, avatarUrl, dialogText) {
    const sceneDescription = helpers.getElement('sceneDescription');
    if (!sceneDescription) return;
    
    const dialogElement = helpers.createElement('div', 'character-dialog');
    dialogElement.innerHTML = `
      <div class="character-avatar" style="background-image: url('${avatarUrl}')"></div>
      <div class="dialog-content">
        <div class="dialog-name">${characterName}</div>
        <div class="dialog-text">${dialogText}</div>
      </div>
    `;
    
    sceneDescription.appendChild(dialogElement);
    
    // Scroll to bottom
    sceneDescription.scrollTop = sceneDescription.scrollHeight;
  }
  
  // Update info bar
  updateInfoBar(player, gameState) {
    const infoBar = helpers.getElement('infoBar');
    if (!infoBar) return;
    
    const factionReputation = Object.entries(gameState.relationships.factions)
      .map(([faction, value]) => `${faction}:${value}`)
      .join(', ');
    
    infoBar.innerHTML = `
      <div class="player-info">
        CURRENT PLAYER: ${player.name} (${player.class})
        Health: ${player.health}/${player.maxHealth} | 
        Inventory: ${player.inventory.join(', ') || 'empty'} | 
        Status: ${player.status.join(', ') || 'none'} | 
        Vision: ${player.vision} | 
        Luck: ${player.luck} | 
        XP: ${player.xp}/${player.xpToNext}
      </div>
      <div class="party-info">
        PARTY REPUTATION: ${factionReputation}
      </div>
    `;
  }
  
  // Animate element
  animateElement(element, animationClass, duration = 1000) {
    if (typeof element === 'string') {
      element = helpers.getElement(element);
    }
    
    if (element) {
      helpers.addAnimation(element, animationClass, duration);
    }
  }
  
  // Show loading indicator
  showLoading(message = 'Loading...') {
    const content = `
      <div style="background: rgba(139, 69, 19, 0.9); border: 2px solid #ffd700; border-radius: 10px; padding: 40px; text-align: center;">
        <div style="font-size: 2em; margin-bottom: 20px;">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p style="font-size: 1.2em; color: #ffd700;">${message}</p>
      </div>
    `;
    
    return this.createModal(content, { closeButton: false });
  }
  
  // Hide loading indicator
  hideLoading() {
    this.closeTopModal();
  }
  
  // Show error message
  showError(message, title = 'Error') {
    const content = `
      <div style="background: rgba(139, 69, 19, 0.9); border: 2px solid #ff6b6b; border-radius: 10px; padding: 20px; max-width: 400px; text-align: center;">
        <h3 style="font-family: 'Cinzel', serif; color: #ff6b6b; margin-bottom: 15px;">${title}</h3>
        <p style="margin-bottom: 20px;">${message}</p>
        <div class="centered-buttons">
          <button class="menu-button" onclick="this.closest('.modal-overlay').remove(); soundManager.playClickSound();">
            <i class="fas fa-times"></i> OK
          </button>
        </div>
      </div>
    `;
    
    return this.createModal(content);
  }
  
  // Show success message
  showSuccess(message, title = 'Success') {
    const content = `
      <div style="background: rgba(139, 69, 19, 0.9); border: 2px solid #90ee90; border-radius: 10px; padding: 20px; max-width: 400px; text-align: center;">
        <h3 style="font-family: 'Cinzel', serif; color: #90ee90; margin-bottom: 15px;">${title}</h3>
        <p style="margin-bottom: 20px;">${message}</p>
        <div class="centered-buttons">
          <button class="menu-button" onclick="this.closest('.modal-overlay').remove(); soundManager.playClickSound();">
            <i class="fas fa-check"></i> OK
          </button>
        </div>
      </div>
    `;
    
    return this.createModal(content);
  }
}

// Export singleton instance
export const uiManager = new UIManager();