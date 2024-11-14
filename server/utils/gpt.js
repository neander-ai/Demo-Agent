const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { ChatOpenAI } = require("@langchain/openai");
const { JsonOutputFunctionsParser } = require("langchain/output_parsers");
const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");
const { getAllStates } = require("../controllers/states");

const responseSchema = z.object({
  name: z.string().describe("name of the event"),
  partition: z.string().describe("partition to which event belongs"),
  description: z.string().describe("description to provide to the user"),
});

const interrupt = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      "All the available events are : {formattedStates}, you are currently on {currentState}, decide wether to switch to another event or explain a part of the current event better. All the events have a text enclosed in square brackets that is a vague description of the event. You can elaborate that text. Make sure to ask if the user would like to move forward to next demonstration or have any questions."
    ),
    HumanMessagePromptTemplate.fromTemplate("{description}"),
  ],
  inputVariables: ["formattedStates", "currentState", "description"],
});

const llm = new ChatOpenAI({
  model: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const functionCallingModel = llm.bind({
  functions: [
    {
      name: "output_formatter",
      description: "Should always be used to properly format output",
      parameters: zodToJsonSchema(responseSchema),
    },
  ],
  function_call: { name: "output_formatter" },
});

const outputParser = new JsonOutputFunctionsParser();

const chain = interrupt.pipe(functionCallingModel).pipe(outputParser);

let currentState = null;
let stateList = [];

const interruptFunc = async (req, res, next) => {
  try {
    // This is called when user sends a message
    // Fetch the next RRWeb script along with its explanation
    const { message } = req.body;
    const result = await callGPT(message);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error("Error calling GPT:", error);
    next(error);
  }
};

const testGPT = async (req, res, next) => {
  try {
    const result = await callGPT(productDesc);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error("Error calling GPT:", error);
    next(error);
  }
};

const formatter = (stateList) => {
  const formattedStates = stateList
    .map(
      (state) =>
        `name: ${state.name}; tags: ${state.tags.join(", ")} [ ${
          state.event_description
        }]`
    )
    .join("\n");
  return formattedStates;
};

const singleFormat = (currentState) => {
  return `name: ${currentState.name}; tags: ${currentState.tags.join(", ")} [ ${
    currentState.event_description
  }]`;
};

const callGPT = async (humanMessage) => {
  try {
    console.log("Calling GPT");
    const states = await getAllStates();
    let formattedStates = null;
    if (states) {
      stateList = states;
      formattedStates = formatter(stateList);
      currentState = stateList[0];
    }
    const res = await chain.invoke({
      formattedStates: formattedStates,
      currentState: singleFormat(currentState),
      description: humanMessage,
    });
    console.log(res);

    const matchedState = stateList.find((state) => state.name === res.name);

    if (matchedState) {
      currentState = matchedState;
    } else {
      // Leave currentState as is if no match is found
      console.log("No matching state found. Retaining the current state.");
    }

    return res;
  } catch (error) {
    console.error("Error calling GPT:", error);
    throw error;
  }
};

module.exports = { testGPT, interruptFunc };
