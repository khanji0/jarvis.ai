// static/voice.js
class VoiceInterface {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.setupVoiceRecognition();
  }

  setupVoiceRecognition() {
    if ("webkitSpeechRecognition" in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
        document.querySelector(".voice-status").textContent = "Listening...";
      };

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        if (event.results[0].isFinal) {
          this.handleVoiceInput(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        this.isListening = false;
        document.querySelector(".voice-status").textContent =
          "Error occurred. Click to try again.";
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isListening) {
          this.recognition.start();
        }
      };

      // Start recognition automatically
      this.recognition.start();
    } else {
      document.querySelector(".voice-status").textContent =
        "Speech recognition not supported";
    }
  }

  handleVoiceInput(transcript) {
    // Send the transcript to your backend
    fetch("/api/voice-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: transcript }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response
        document.querySelector(".voice-status").textContent = "Processing...";
        // You can add text-to-speech here for the AI's response
      })
      .catch((error) => {
        console.error("Error:", error);
        document.querySelector(".voice-status").textContent =
          "Error processing voice input";
      });
  }
}

/* ==========================================================================
   Voice Assistant JavaScript
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Voice Assistant page loaded successfully.");
  // Add any voice recognition logic here if needed
});
