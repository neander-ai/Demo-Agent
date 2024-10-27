from openai import OpenAI
import os
from dotenv import load_dotenv
import json
from state import State

load_dotenv(dotenv_path="../.env")
key=os.getenv("OPENAI_API_KEY")

# Initialize OpenAI API Key
client = OpenAI(api_key=key)

# Reading JSON file
state_list = []
general_order = []
with open("states.json", "r") as file:
    states = json.load(file)

for state in states:
    state_name = state.get("state_name")
    tags = state.get("tags")
    video_link = state.get("video_link")
    audio_link = state.get("audio_link")
    position = state.get("position")
    state_list.append(State(state_name, tags, video_link, audio_link, position))

    # Add in general order according to position
    if position != -1:
        general_order.append(state_list[-1])


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
    formatted_states = "\n".join([f"{state.state_name}: {', '.join(state.tags)}" for state in states])
    prompt = prompt_template.format(states=formatted_states, input_command=input_command)

    # Call the OpenAI API
    response = client.completions.create(model="gpt-3.5-turbo-instruct",
    prompt=prompt, max_tokens=50, n=1)

    # Extract and return the best state from the response
    best_state = response.choices[0].text.strip()
    return next((state for state in states if state.state_name == best_state), None)

# Main function to run the state machine
def run_state_machine():
    current_state = general_order[0]
    print(f"Starting in state: {current_state.state_name}")

    while True:
        user_input = input("Enter a command (or type 'exit' to quit): ").strip()
        if user_input.lower() == "exit":
            print("Exiting state machine.")
            break

        # Get the best matching state for the given command
        next_state = get_best_matching_state(state_list, user_input)

        if next_state in state_list:
            print(f"Transitioning from '{current_state.state_name}' to '{next_state.state_name}' based on command: '{user_input}'")
            current_state = next_state
        else:
            print(f"Could not find a valid state for command: '{user_input}'. Staying in '{current_state.state_name}'")

# Run the state machine
run_state_machine()
