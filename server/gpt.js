const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const parser = new StringOutputParser();
const model = new ChatOpenAI({
  model: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY
});

const sysMessage = new SystemMessage(`Product description means description of the product. 
  Event description means description of a single user based interaction which happened on the website.
  Tag means tags associated with the event.
  Your job is a sales developer agent and you need to generate the explaination for a single event. 
  For example - given description that the event is the following steps - 
  "click on the set domain button , then set your required domain and the click okay."
  you will generate an explaination for this explaining how to do it to a real person.
  Do not bother about explaining the product from scrath, they are given for your understanding.
  Focus on conversing with the user. Assume the conversation was already happening and you are a in betweem so skip the formalities.
  Also skip ending the conversation. Just focus on the explaination.
  Don't ask for anything else,.
  Just ask if they would like to move forward to the next demonstration or have any questions.`);

const callGPT = async () => {
  const messages = [
    sysMessage,
    new HumanMessage(`Product description : E-commerce wesbite shopify.com. 
      Event Description : Click on the set domain button, then set your required domain and click okay.
      Tags : Set domain, domain`),
  ];

  const result = await model.invoke(messages);
  const result2 = await parser.invoke(result);
    
  return result2;
};

module.exports = { callGPT };