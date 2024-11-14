const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { ChatOpenAI } = require("@langchain/openai");
const { JsonOutputFunctionsParser } = require("langchain/output_parsers");
const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("@langchain/core/prompts");
const { formattedStates, currentState } = require("../controllers/states");

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

const interruptFunc = async (req, res, next) => {
  try {
    // This is called when user sends a message
    // Fetch the next RRWeb script along with its explanation
    const { message } = req.body;
    const result = await callGPT(message);
    console.log("Result is:", result);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error("Error calling GPT:", error);
    next(error);
  }
};

const testGPT = async (req, res, next) => {
  try {
    const result = await callGPT(productDesc);
    console.log("Result is:", result);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error("Error calling GPT:", error);
    next(error);
  }
};

const callGPT = async (humanMessage) => {
  try {
    console.log("Calling GPT");
    const res = await chain.invoke({
      formattedStates: formattedStates,
      currentState: currentState,
      description: humanMessage,
    });

    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.error("Error calling GPT:", error);
    throw error;
  }
};

module.exports = { testGPT, interruptFunc };
