from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
key=os.getenv("OPENAI_API_KEY")

# Initialize OpenAI API Key
client = OpenAI(api_key=key)

# Define the states and associated tags
states = {
    "idle": ["waiting", "no operation"],
    "processing": ["work", "process", "calculate"],
    "error": ["failure", "issue", "problem"],
    "completed": ["done", "finished", "complete"]
}

# Define the prompt template for the LLM
prompt_template = """
You are a state transition assistant. Given the following states and their associated tags, find the best-matching state for a set of input tags or command.

States:
{states}

Input command: {input_command}

Please return the state with the best match. Give one word answer
"""

# Define the function to get the best matching state
def get_best_matching_state(states, input_command):
    # Format the states for the prompt
    formatted_states = "\n".join([f"{state}: {', '.join(tags)}" for state, tags in states.items()])
    prompt = prompt_template.format(states=formatted_states, input_command=input_command)

    # Call the OpenAI API
    response = client.completions.create(model="gpt-3.5-turbo-instruct",
    prompt=prompt, max_tokens=50, n=1)

    # Extract and return the best state from the response
    best_state = response.choices[0].text.strip()
    return best_state

# Main function to run the state machine
def run_state_machine():
    current_state = "idle"
    print(f"Starting in state: {current_state}")

    while True:
        user_input = input("Enter a command (or type 'exit' to quit): ").strip()
        if user_input.lower() == "exit":
            print("Exiting state machine.")
            break

        # Get the best matching state for the given command
        next_state = get_best_matching_state(states, user_input)

        if next_state in states:
            print(f"Transitioning from '{current_state}' to '{next_state}' based on command: '{user_input}'")
            current_state = next_state
        else:
            print(f"Could not find a valid state for command: '{user_input}'. Staying in '{current_state}'")

# Run the state machine
run_state_machine()
