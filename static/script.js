/* ==========================================================================
   AI Chat Assistant Implementation - Jarvis
   Version: 1.0
   Purpose: Interactive AI Chat Interface
   ========================================================================== */

class AIAssistant {
  constructor() {
    // Initialize DOM elements
    this.chatMessages = document.getElementById("chatMessages");
    this.userInput = document.getElementById("userInput");
    this.sendButton = document.querySelector(".send-button");
    this.voiceButton = document.querySelector(".voice-button");

    // Set up initial state
    this.initializeEventListeners();
    this.initializeWelcomeMessage();
  }

  initializeWelcomeMessage() {
    setTimeout(() => {
      this.addMessageToChat(
        "Welcome to Jarvis. How can I assist you today?",
        "ai-message"
      );
    }, 1000);
  }

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

    // Handle voice button clicks
    if (this.voiceButton) {
      this.voiceButton.addEventListener("click", () => {
        this.startVoiceRecognition();
      });
    }

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

  // Voice recognition method
  startVoiceRecognition() {
    window.location.href = "/voice";
  }

  handleUserMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    this.addMessageToChat(message, "user-message");
    this.showTypingIndicator();
    this.sendMessageToServer(message);
    this.userInput.value = "";
    this.scrollToBottom();
  }

  addMessageToChat(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = message;
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

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

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

// Application Initialization
document.addEventListener("DOMContentLoaded", () => {
  try {
    const assistant = new AIAssistant();
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

// Cleanup Operations
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
