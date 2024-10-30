// TODO : Write here and not in models 

// const populateSampleDB = async (req, res, next) => {
//     try{
//       console.log("Calling GPT");
//       const messages = [
//         sysMessage,
//         new HumanMessage(`Product description : E-commerce wesbite shopify.com. 
//           Event Description : Click on the set domain button, then set your required domain and click okay.
//           Tags : Set domain, domain`),
//       ];
//       const result = await model.invoke(messages);
//       const result2 = await parser.invoke(result);
//       res.json({ result: result2 });
//     } catch (error) {
//       console.error("Error populating the db:", error);
//       next(error);
//     }
  
//   };
  
// module.exports = { callGPT };