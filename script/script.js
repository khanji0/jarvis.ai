// script.js
class AIAssistant {
  constructor() {
    this.chatMessages = document.getElementById("chatMessages");
    this.userInput = document.getElementById("userInput");
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Enter key event listener
    this.userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleUserMessage();
      }
    });
  }

  handleUserMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    // Display user message
    this.addMessageToChat(message, "user-message");

    // Display AI response
    this.generateAIResponse(message);

    // Clear input field
    this.userInput.value = "";

    // Scroll to latest message
    this.scrollToBottom();
  }

  addMessageToChat(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = message;
    this.chatMessages.appendChild(messageDiv);
  }

  generateAIResponse(userMessage) {
    // Placeholder for AI response logic
    const aiResponse = "I'm your AI Assistant. I'm processing your request...";
    this.addMessageToChat(aiResponse, "ai-message");
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

// Initialize AI Assistant
const assistant = new AIAssistant();

// Global send message function (for onclick event)
function sendMessage() {
  assistant.handleUserMessage();
}

const video = document.querySelector(".background-video");

// Ensure seamless looping
video.addEventListener("ended", () => {
  video.currentTime = 0; // Reset to the beginning
  video.play(); // Start playing again
});
