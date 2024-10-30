const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const dotenv = require("dotenv");
const path = require("path");
const { error } = require("console");
// const { State } = require("./state.js");

// const statesData = require("../../extension/flows/productaddition.json");
// const stateList = [];

// statesData.forEach((state) => {
//   const { script_url, event_description, llm_text, tags, script_duration } =
//     state;
//   const newState = new State(
//     script_url,
//     event_description,
//     llm_text,
//     tags,
//     script_duration
//   );
//   stateList.push(newState);
// });
// const currentState = stateList[0]
// const formattedStates = stateList.map((state) => `${state.event_description}: ${state.tags.join(", ")}`).join("\n");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const parser = new StringOutputParser();
const model = new ChatOpenAI({
  model: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const sysMessage =
  new SystemMessage(`Product description means description of the product. 
  Event description means description of a single user based interaction which happened on the website.
  Tag means tags associated with the event.
  Your job is a sales developer agent and you need to generate the explaination for a single event. 
  For example - given description that the event is the following steps - 
  "click on the set domain button , then set your required domain and the click okay."
  you will generate an explaination for this explaining how to do it to a real person.
  Do not bother about explaining the product from scratch, they are given for your understanding.
  Focus on conversing with the user. Assume the conversation was already happening and you are a in between so skip the formalities.
  Also skip ending the conversation. Just focus on the explaination.
  Don't ask for anything else,.
  Just ask if they would like to move forward to the next demonstration or have any questions.`);

// this message should create a list of all present states and their tags
// const stateMessage = new SystemMessage(
//   `All the available events are : ${formattedStates}, you are currently on event: {current}, with the query as {message}, decide wether to switch to another event or explain a part of the current event better, if switching events, given a description of the new event`
// );

const callGPT = async (req, res, next) => {
  try {
    console.log("Calling GPT");

    const messages = [
      sysMessage,
      new HumanMessage(`Product description : E-commerce wesbite shopify.com. 
        Event Description : Click on the set domain button, then set your required domain and click okay.
        Tags : Set domain, domain`),
    ];
    const result = await model.invoke(messages);
    const result2 = await parser.invoke(result);
    res.json({ result: result2 });
  } catch (error) {
    console.error("Error calling GPT:", error);
    next(error);
  }
};

module.exports = { callGPT };
