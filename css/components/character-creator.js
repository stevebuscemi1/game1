// js/components/character-creator.js
// Add back button functionality

// In the startCharacterCreation method, add a back button
startCharacterCreation() {
    const content = helpers.getElement('creationContent');
    if (!content) return;
    
    if (this.currentPlayerNumber === 0) {
        content.innerHTML = this.getPlayerCountStep();
    } else {
        this.createCharacterStep();
    }
    
    // Add back button if not on first step
    if (this.currentPlayerNumber > 0 || this.creationStep > 0) {
        this.addBackButton();
    }
}

// Add method to create back button
addBackButton() {
    const content = helpers.getElement('creationContent');
    if (!content) return;
    
    // Check if back button already exists
    if (content.querySelector('.back-button')) return;
    
    const backButton = helpers.createElement('button', 'back-button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    backButton.setAttribute('aria-label', 'Go back to previous step');
    
    backButton.addEventListener('click', () => {
        soundManager.playClickSound();
        this.handleBackButton();
    });
    
    // Insert at the top of the content
    content.insertBefore(backButton, content.firstChild);
}

// Handle back button click
handleBackButton() {
    if (this.creationStep > 0) {
        // Go back to previous step
        this.creationStep--;
        this.createCharacterStep();
    } else if (this.currentPlayerNumber > 1) {
        // Go back to previous player
        this.currentPlayerNumber--;
        this.selectedClasses = this.selectedClasses.filter(cls => cls !== this.tempPlayer.class);
        this.tempPlayer = {};
        this.creationStep = 0;
        this.createCharacterStep();
    } else {
        // Go back to player count selection
        this.currentPlayerNumber = 0;
        this.tempPlayer = {};
        this.creationStep = 0;
        this.startCharacterCreation();
    }
}

// Update createCharacterStep to add back button when needed
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
    
    // Add back button if not on first step
    if (this.creationStep > 0 || this.currentPlayerNumber > 0) {
        this.addBackButton();
    }
}

// Update showAddAnotherPlayerDialog to include back button
showAddAnotherPlayerDialog() {
    const content = helpers.getElement('creationContent');
    content.innerHTML = `
        <div class="success-message">
            <h3>${this.tempPlayer.name} created successfully!</h3>
            <p>Would you like to add another player to the adventure?</p>
            <div class="button-group">
                <button class="btn btn-primary" onclick="window.characterCreator.addAnotherPlayer()">
                    <i class="fas fa-plus"></i>
                    Yes, add another player
                </button>
                <button class="btn" onclick="window.characterCreator.startGame()">
                    <i class="fas fa-play"></i>
                    No, start the game
                </button>
                <button class="btn back-button" onclick="window.characterCreator.recreateCharacter()">
                    <i class="fas fa-redo"></i>
                    Recreate character
                </button>
            </div>
        </div>
    `;
}
