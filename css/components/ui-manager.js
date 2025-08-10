// js/components/ui-manager.js
// Update to handle back buttons better

// Add method to create a standardized back button
createBackButton(clickHandler, label = 'Back') {
    const backButton = helpers.createElement('button', 'back-button');
    backButton.innerHTML = `<i class="fas fa-arrow-left"></i> ${label}`;
    backButton.setAttribute('aria-label', label);
    
    if (clickHandler) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            soundManager.playClickSound();
            clickHandler();
        });
    }
    
    return backButton;
}

// Update showScreen to handle back navigation
showScreen(screenId) {
    this.currentScreen = screenId;
    helpers.showScreen(screenId);
    soundManager.playClickSound();
    
    // Announce screen change to screen readers
    const screenNames = {
        'mainMenu': 'Main Menu',
        'characterCreation': 'Character Creation',
        'gameInterface': 'Game Interface',
        'helpScreen': 'Help Screen',
        'saveLoadArea': 'Save and Load Area'
    };
    
    const screenName = screenNames[screenId] || screenId;
    accessibilityManager.announceToScreenReader(`Navigated to ${screenName}`);
}

// Update createModal to include close button by default
createModal(content, options = {}) {
    const modal = helpers.createElement('div', 'modal-overlay');
    const modalContent = helpers.createElement('div', 'modal-content');
    modalContent.innerHTML = content;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    this.modals.push(modal);
    
    // Setup close button by default
    const closeBtn = modalContent.querySelector('.close-button') || 
                   helpers.createElement('button', 'close-button', '×');
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.addEventListener('click', () => this.closeModal(modal));
    
    if (!modalContent.contains(closeBtn)) {
        modalContent.appendChild(closeBtn);
    }
    
    return modal;
}
