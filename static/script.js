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
      this.addMessageToChat(
        "Hello! I'm Jarvis. How can I assist you today?",
        "ai-message"
      );
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

    // Send the message to the backend for AI response
    this.sendMessageToServer(message);

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
         Sending Message to Backend
         ---------------------------- */
  sendMessageToServer(message) {
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.removeTypingIndicator();
        if (data.success) {
          // Remove the "Jarvis: " prefix if it's already in the response
          let aiResponse = data.ai_response;
          if (aiResponse.startsWith("Jarvis: ")) {
            aiResponse = aiResponse.substring(8);
          }
          this.addMessageToChat(aiResponse, "ai-message");
        } else {
          this.addMessageToChat(
            "Sorry, I couldn't process that. Try again later.",
            "ai-message"
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.removeTypingIndicator();
        this.addMessageToChat(
          "Something went wrong. Please try again.",
          "ai-message"
        );
      });
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
