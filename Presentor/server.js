const express = require("express");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const State = require("./State");
const statesData = require("./states.json");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const stateList = [];
const generalOrder = [];

statesData.forEach((state) => {
  const { state_name, tags, video_link, audio_link, position } = state;
  const newState = new State(state_name, tags, video_link, audio_link, position);
  stateList.push(newState);

  if (position !== -1) {
    generalOrder.push(newState);
  }
});

const promptTemplate = `
You are a state transition assistant. Given the following states and their associated tags, find the best-matching state for a set of input tags or command.

States:
{states}

Input command: {inputCommand}

Please return the state with the best match. Give one word answer
`;

async function getBestMatchingState(states, inputCommand) {
  const formattedStates = states.map((state) => `${state.state_name}: ${state.tags.join(", ")}`).join("\n");

  const prompt = promptTemplate.replace("{states}", formattedStates).replace("{inputCommand}", inputCommand);

  const response = await client.completions
    .create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
    })
    .asResponse();
  const result = await response.json();

  console.log(result);
  const bestStateName = result.choices[0].text.trim();
  return states.find((state) => state.state_name === bestStateName) || null;
}

const app = express();
app.use(express.json());

let currentState = generalOrder[0];

app.get("/", (req, res) => {
  res.send("State Machine Server is running. Use '/state' endpoint with POST to interact.");
});

app.post("/state", async (req, res) => {
  const { command } = req.body;
  if (command.toLowerCase() === "exit") {
    return res.json({ message: "Exiting state machine." });
  }

  const nextState = await getBestMatchingState(stateList, command);
  if (nextState) {
    const message = `Transitioning from '${currentState.state_name}' to '${nextState.state_name}' based on command: '${command}'`;
    currentState = nextState;
    res.json({ message });
  } else {
    const message = `Could not find a valid state for command: '${command}'. Staying in '${currentState.state_name}'`;
    res.json({ message });
  }
});

// Run server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
