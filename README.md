```markdown
# D&D-like Text Adventure Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version 1.0](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/yourusername/dnd-text-adventure/releases/tag/v1.0)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Ollama](https://img.shields.io/badge/Powered%20by-Ollama-orange.svg)](https://ollama.ai)

An immersive text-based adventure game inspired by Dungeons & Dragons, designed to run on a local LLM (Ollama) through a simple web interface. Embark on epic quests, make meaningful choices, and shape your unique narrative in a rich medieval fantasy world with magical elements.

## 🌟 Features

- **Rich Character Creation**: Choose from 5 classes, 5 races, and 5 backgrounds
- **Dynamic Story Elements**: Multiple endings and branching narratives based on your choices
- **Unique Mechanics**: Vision and Luck systems that affect gameplay
- **Comprehensive Progression**: Experience, leveling, and skill development
- **Relationship Systems**: Build relationships with NPCs and factions
- **Companion System**: Recruit allies with unique abilities and stories
- **Save/Load Functionality**: Continue your adventure across multiple sessions
- **Randomized Elements**: Procedural content for high replayability
- **Tutorial System**: Optional introduction to game mechanics

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Ollama](https://ollama.ai) (local LLM)
- Python 3.8 or higher
- Git (for cloning the repository)

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dnd-text-adventure.git
   cd dnd-text-adventure
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start Ollama (if not already running):
   ```bash
   ollama serve
   ```

## 🎮 How to Run

1. Start the game interface:
   ```bash
   python scripts/run_game.py
   ```

2. Open your web browser and navigate to `http://localhost:5000`

3. Choose to:
   - Start a new adventure
   - Load a saved game
   - View the tutorial

## 📚 Documentation

- [Tutorial](docs/tutorial.md) - Introduction to game mechanics with emoticons
- [Game Rules](docs/game-rules.md) - Detailed explanation of Rules A, B, C, and D
- [Prompt Versions](prompts/) - Different versions of the game prompt
- [Changelog](CHANGELOG.md) - Version history and updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate and follow the existing code style.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by games and other tabletop RPGs
- Powered by Ollama and local LLM technology
- Thanks to all contributors who helped make this game possible

---

*May your adventures be legendary!* 🎲✨
```
