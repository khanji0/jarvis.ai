import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

token = os.getenv("GITHUB_TOKEN")  # Use os.getenv instead of os.environ to avoid KeyError

if not token:
    raise ValueError("GITHUB_TOKEN is not set. Check your .env file.")

endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o"

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

# Pre-programmed triggers and responses
triggers = {
    "who are you": "I'm Jarvis, an AI assistant programmed by Jibran Khan.",
    "who made you": "Hello! I'm Jarvis, your personal AI assistant created by Jibran Khan.",
    "what do you do": "I'm an AI chatbot named Jarvis, developed by Jibran Khan to help users with various tasks.",
    "what's your name": "I'm Jarvis, your AI assistant.",
    "what are you": "I'm Jarvis, an AI assistant designed to assist you.",
}

# Greet with Jarvis name if asked hello or how are you
greetings = ["hello", "hi", "hey", "how are you", "how's it going"]

# Define the function
def get_jarvis_response(user_input):
    user_input = user_input.strip().lower()

    # Check if user input matches any pre-programmed response
    if user_input in triggers:
        return triggers[user_input]

    # Check if user input is a greeting
    if user_input in greetings:
        return "Hello! I'm Jarvis, your AI assistant. How can I help you today?"

    try:
        # AI-generated response if no pre-programmed match
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are Jarvis, an AI assistant created by Jibran Khan."},
                {"role": "user", "content": user_input}
            ],
            model=model_name,
            max_tokens=150,  # Adjust as needed
            stream=False  # Changed to False for simpler handling
        )

        # Extract the response text
        if response.choices and len(response.choices) > 0:
            return response.choices[0].message.content
        return "I apologize, but I couldn't generate a response."

    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return "I apologize, but I encountered an error while processing your request."



