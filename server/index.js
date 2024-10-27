const express = require("express");
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const dotenv = require("dotenv");
const path = require("path");
const envPath = path.join(__dirname, '..', '.env');

dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3001;

const parser = new StringOutputParser();
const model = new ChatOpenAI({
  model: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(process.env.OPENAI_API_KEY);
  console.log(console.log(path.resolve(__dirname, '..', '.env')))
  console.log(`Current directory: ${__dirname}`);
  console.log(process.env)
  console.log(`Server is running on port ${PORT}`);
  // callGPT().catch(console.error);
});


 const callGPT = async () => {
  const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("hi!")
  ];

  const result = await model.invoke(messages);
  const result2 = await parser.invoke(result);

  console.log(result2);
};