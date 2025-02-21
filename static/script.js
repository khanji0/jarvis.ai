/* ==========================================================================
   AI Chat Assistant Implementation - Jarvis
   Version: 1.0
   Purpose: Interactive AI Chat Interface
   Author: [Your Name]
   Last Updated: [Current Date]
   ========================================================================== */

/* -----------------------------
   Core AI Assistant Class
   ---------------------------- */
   class AIAssistant {
    /* -----------------------------
       Constructor & Initialization
       ---------------------------- */
    constructor() {
        // Initialize DOM elements
        this.chatMessages = document.getElementById("chatMessages");
        this.userInput = document.getElementById("userInput");
        this.sendButton = document.querySelector(".send-button");
        
        // Set up initial state
        this.initializeEventListeners();
        this.initializeWelcomeMessage();
    }

    /* -----------------------------
       Welcome Message Handler
       ---------------------------- */
    initializeWelcomeMessage() {
        setTimeout(() => {
            this.addMessageToChat("Hello! I'm Jarvis. How can I assist you today?", "ai-message");
        }, 1000);
    }

    /* -----------------------------
       Event Listeners Setup
       ---------------------------- */
    initializeEventListeners() {
        // Handle Enter key press
        this.userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.handleUserMessage();
            }
        });

        // Handle send button clicks
        this.sendButton.addEventListener("click", () => {
            this.handleUserMessage();
        });

        // Set initial focus
        this.userInput.focus();

        // Mobile menu functionality
        const hamburger = document.querySelector(".hamburger");
        const navLinks = document.querySelector(".nav-links");
        if (hamburger) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("active");
                hamburger.classList.toggle("active");
            });
        }
    }

    /* -----------------------------
       Message Processing
       ---------------------------- */
    handleUserMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Process and display user message
        this.addMessageToChat(message, "user-message");
        this.showTypingIndicator();

        // Simulate AI processing
        setTimeout(() => {
            this.removeTypingIndicator();
            this.generateAIResponse(message);
        }, 1500);

        // Reset input
        this.userInput.value = "";
        this.scrollToBottom();
    }

    /* -----------------------------
       UI Message Display Functions
       ---------------------------- */
    addMessageToChat(message, className) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /* -----------------------------
       Typing Indicator Management
       ---------------------------- */
    showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message ai-message typing-indicator";
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        typingDiv.id = "typingIndicator";
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById("typingIndicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /* -----------------------------
       AI Response Generation
       ---------------------------- */
    generateAIResponse(userMessage) {
        let aiResponse = "I understand you said: " + userMessage + ". How can I help you further?";
        const lowercaseMessage = userMessage.toLowerCase();

        // Define response patterns
        const patterns = {
            introductions: {
                triggers: ["who are you", "who made you", "what do you do", "what's your name", "what are you"],
                responses: [
                    "I'm Jarvis, an AI assistant programmed by Jibran Khan.",
                    "Hello! I'm Jarvis, your personal AI assistant created by Jibran Khan.",
                    "I'm an AI chatbot named Jarvis, developed by Jibran Khan to help users with various tasks."
                ]
            },
            greetings: {
                triggers: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"],
                responses: [
                    "Hello! How can I assist you today?",
                    "Hi there! What can I help you with?",
                    "Greetings! How may I be of service?"
                ]
            },
            thankYou: {
                triggers: ["thank you", "thanks", "thx", "appreciate it"],
                responses: [
                    "You're welcome! Is there anything else I can help you with?",
                    "My pleasure! Let me know if you need anything else.",
                    "Glad I could help! Feel free to ask more questions."
                ]
            },
            goodbyes: {
                triggers: ["bye", "goodbye", "see you", "farewell", "cya"],
                responses: [
                    "Goodbye! Have a great day!",
                    "See you later! Take care!",
                    "Farewell! Don't hesitate to return if you need assistance!"
                ]
            },
            help: {
                triggers: ["help", "assist", "support", "guide"],
                responses: [
                    "I'm here to help! What specific assistance do you need?",
                    "I'd be happy to help you. What would you like to know?",
                    "How can I assist you today? I'm knowledgeable in many areas."
                ]
            }
        };

        // Pattern matching and response generation
        for (const [category, data] of Object.entries(patterns)) {
            if (data.triggers.some(trigger => lowercaseMessage.includes(trigger))) {
                aiResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                break;
            }
        }

        this.addMessageToChat(aiResponse, "ai-message");
    }

    /* -----------------------------
       Utility Functions
       ---------------------------- */
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

/* -----------------------------
   Application Initialization
   ---------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Initialize AI Assistant
        const assistant = new AIAssistant();
        
        // Global message handler
        window.sendMessage = () => {
            try {
                assistant.handleUserMessage();
            } catch (error) {
                console.error("Error handling message:", error);
            }
        };

        /* -----------------------------
           Video Background Setup
           ---------------------------- */
        const video = document.querySelector(".background-video");
        if (video) {
            // Configure video playback
            video.playbackRate = 1.0;
            video.play().catch(error => {
                console.warn("Auto-play failed:", error);
            });

            // Video event handlers
            video.addEventListener("ended", () => {
                try {
                    video.currentTime = 0;
                    video.play().catch(error => {
                        console.warn("Video replay failed:", error);
                    });
                } catch (error) {
                    console.error("Error handling video loop:", error);
                }
            });

            video.addEventListener("loadeddata", () => {
                console.log("Video loaded successfully");
            });

            video.addEventListener("error", (error) => {
                console.error("Video error:", error);
            });
        }

        console.log("AI Assistant initialized successfully");
    } catch (error) {
        console.error("Error initializing AI Assistant:", error);
    }
});

/* -----------------------------
   Cleanup Operations
   ---------------------------- */
window.addEventListener("beforeunload", () => {
    try {
        const video = document.querySelector(".background-video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
});

/* ==========================================================================
   Implementation Notes:
   
   1. Class Structure:
      - AIAssistant class handles all chat functionality
      - Modular design for easy maintenance
      - Event-driven architecture
   
   2. Key Features:
      - Real-time chat interface
      - Typing indicators
      - Pattern-based responses
      - Mobile responsiveness
      - Video background support
   
   3. Required HTML Elements:
      - #chatMessages (div for messages)
      - #userInput (input field)
      - .send-button (button)
      - .background-video (optional)
      - .hamburger (optional for mobile)
   
   4. Dependencies:
      - Requires corresponding CSS for styling
      - Needs proper HTML structure
      - Browser support for ES6+
   
   5. Usage:
      - Initialize automatically on page load
      - Handles user input via text or button
      - Supports mobile and desktop interfaces
   
   6. Error Handling:
      - Try-catch blocks for critical operations
      - Console logging for debugging
      - Graceful fallbacks
   ========================================================================== */