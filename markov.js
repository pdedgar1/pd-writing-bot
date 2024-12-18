// Markov Chain Text Generator

class MarkovGenerator {
    constructor() {
        this.chain = {};
        this.stopMarks = [".", ",", ":", "-", "\n"];
        this.commonStartWords = [
            "The", "It", "He", "She", "They", "When", "Once", "After", "In", "On", "One",
            "At", "By", "From", "While", "As", "With", "This", "That", "A", "An", "&", "I",
            "Over", "Under", "During", "Before", "Since", "Because", "Where", "How", "My", "We",
            "Why", "Through", "If", "Then", "Although", "But", "So", "For", "Until", "It's",
            "Upon", "Without", "Despite", "According", "Beyond", "Towards", "Within", "To",
            "Among", "Across", "Between", "Afterward", "Meanwhile", "Suddenly", "Perhaps",
            "Maybe", "I'm", "Or", "Each", "And", "All", "You", "What", "Every", "Is", "Our",
            "There", "Many", "Some", "Though", "Of", "There's", "Not", "Do", "Like", "These", 
            "His", "Are", "Your", "Me", "No", "Even", "Was", ">"
        ];
    }

    addData(data) {
        const words = data.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
            const current = words[i];
            const next = words[i + 1] || null;

            if (!this.chain[current]) {
                this.chain[current] = [];
            }
            if (next) {
                this.chain[current].push(next);
            }
        }
    }

    generateText(lines = Math.floor(Math.random() * 6) + 1, minWords = 5, maxWords = 20) {
        let text = "";
        let lineCount = 0;
        let currentLine = "";
        let word = this.getStartWord(); // Start with a common word
        let wordCount = 0;
    
        while (lineCount < lines) {
            if (word === null) {
                word = this.getStartWord(); // Use start word again for safety
            }
    
            currentLine += (currentLine ? " " : "") + word;
            wordCount++;
    
            if (this.stopMarks.some(mark => word.endsWith(mark)) && wordCount >= minWords) {
                text += currentLine.trim() + "\n"; // Add line break
                currentLine = "";
                wordCount = 0;
                lineCount++;
                word = this.getStartWord(); // Reset to a start word for the next line
            } else if (wordCount >= maxWords) {
                text += currentLine.trim() + "\n"; // Force line break after max words
                currentLine = "";
                wordCount = 0;
                lineCount++;
                word = this.getStartWord();
            } else {
                const nextWords = this.chain[word] || [];
                word = nextWords[Math.floor(Math.random() * nextWords.length)] || null;
            }
        }
    
        return text.trim().replace(/\n/g, "\n\n"); // Ensure double line breaks
    }
    

    getStartWord() {
        const validStartWords = this.commonStartWords.filter(word => this.chain[word]);
        if (validStartWords.length > 0) {
            return validStartWords[Math.floor(Math.random() * validStartWords.length)];
        }
        return this.getRandomKey();
    }

    getRandomKey() {
        const keys = Object.keys(this.chain);
        return keys[Math.floor(Math.random() * keys.length)];
    }
}

// Load data from 'sampletext.txt' file
fetch('sampletext.txt')
    .then(response => response.text())
    .then(data => {
        const generator = new MarkovGenerator();
        generator.addData(data);

        // Expose generator globally for testing or integration
        window.markovGenerator = generator;
    })
    .catch(error => console.error("Error loading sampletext.txt:", error));

export default MarkovGenerator;
