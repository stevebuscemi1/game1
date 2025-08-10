// Turn Controller - Manages turn-based gameplay
export class TurnController {
    constructor(gameController) {
        this.gameController = gameController;
        this.currentPlayerIndex = 0;
        this.turnOrder = [];
        this.turnTimer = null;
        this.turnDuration = 30000; // 30 seconds per turn
        this.isTurnActive = false;
    }
    
    // Initialize turn order
    initializeTurnOrder(players) {
        this.turnOrder = [...players];
        this.currentPlayerIndex = 0;
        this.shuffleTurnOrder(); // Randomize first turn
    }
    
    // Shuffle turn order (for initial setup)
    shuffleTurnOrder() {
        for (let i = this.turnOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
        }
    }
    
    // Start current player's turn
    startTurn() {
        if (this.turnOrder.length === 0) return null;
        
        this.isTurnActive = true;
        const currentPlayer = this.getCurrentPlayer();
        
        // Start turn timer
        this.startTurnTimer();
        
        // Notify game interface
        if (this.gameController && this.gameController.gameInterface) {
            this.gameController.gameInterface.startTurn(currentPlayer);
        }
        
        return currentPlayer;
    }
    
    // End current player's turn
    endTurn() {
        this.isTurnActive = false;
        this.clearTurnTimer();
        
        // Move to next player
        this.nextPlayer();
        
        // Start next turn
        this.startTurn();
    }
    
    // Get current player
    getCurrentPlayer() {
        return this.turnOrder[this.currentPlayerIndex] || null;
    }
    
    // Move to next player
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.turnOrder.length;
    }
    
    // Start turn timer
    startTurnTimer() {
        this.clearTurnTimer();
        this.turnTimer = setTimeout(() => {
            this.handleTurnTimeout();
        }, this.turnDuration);
    }
    
    // Clear turn timer
    clearTurnTimer() {
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
    }
    
    // Handle turn timeout
    handleTurnTimeout() {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer) {
            // Auto-select a random choice or skip turn
            console.log(`Turn timeout for ${currentPlayer.name}`);
            this.endTurn();
        }
    }
    
    // Add player to turn order
    addPlayer(player) {
        this.turnOrder.push(player);
    }
    
    // Remove player from turn order
    removePlayer(playerId) {
        const index = this.turnOrder.findIndex(p => p.id === playerId);
        if (index > -1) {
            this.turnOrder.splice(index, 1);
            // Adjust current player index if necessary
            if (this.currentPlayerIndex >= this.turnOrder.length) {
                this.currentPlayerIndex = 0;
            }
        }
    }
    
    // Get turn order
    getTurnOrder() {
        return [...this.turnOrder];
    }
    
    // Get current turn index
    getCurrentTurnIndex() {
        return this.currentPlayerIndex;
    }
    
    // Check if it's a specific player's turn
    isPlayerTurn(playerId) {
        const currentPlayer = this.getCurrentPlayer();
        return currentPlayer && currentPlayer.id === playerId;
    }
    
    // Get remaining time for current turn
    getRemainingTime() {
        if (!this.isTurnActive || !this.turnTimer) return 0;
        // This is a simplified version - in a real implementation,
        // you'd need to track the actual start time
        return this.turnDuration;
    }
    
    // Set turn duration
    setTurnDuration(duration) {
        this.turnDuration = duration;
    }
    
    // Pause turn timer
    pauseTurn() {
        this.clearTurnTimer();
    }
    
    // Resume turn timer
    resumeTurn() {
        if (this.isTurnActive) {
            this.startTurnTimer();
        }
    }
    
    // Reset turn controller
    reset() {
        this.clearTurnTimer();
        this.currentPlayerIndex = 0;
        this.turnOrder = [];
        this.isTurnActive = false;
    }
    
    // Get turn summary
    getTurnSummary() {
        return {
            currentPlayer: this.getCurrentPlayer()?.name || 'none',
            turnIndex: this.currentPlayerIndex,
            totalPlayers: this.turnOrder.length,
            isTurnActive: this.isTurnActive,
            remainingTime: this.getRemainingTime()
        };
    }
}