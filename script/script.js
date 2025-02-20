function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        
        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user-message';
        userDiv.textContent = message;
        chatMessages.appendChild(userDiv);
        
        // Add AI message (you'll need to implement actual AI response logic)
        const aiDiv = document.createElement('div');
        aiDiv.className = 'message ai-message';
        aiDiv.textContent = "I'm JARVIS.AI. I'm processing your request...";
        chatMessages.appendChild(aiDiv);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Allow sending message with Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});