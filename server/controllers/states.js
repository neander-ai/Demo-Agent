// Switch to a function which retrieves this fromm db.
// and set states/curent state etc specific to a single demo flow.

const State = require("./state");
const statesData = require("./productaddition.json");
const stateList = [];


statesData.forEach((state) => {
  const { script_url, event_description, llm_text, tags, script_duration } =
    state;
  const newState = new State(
    script_url,
    event_description,
    llm_text,
    tags,
    script_duration
  );
  stateList.push(newState);
});
console.log(stateList[0]);
const currentState = stateList[0].event_description + ": " + stateList[0].tags.join(", ");
const formattedStates = stateList.map((state) => `${state.event_description}: ${state.tags.join(", ")} [ ${state.llm_text} ]`).join("\n");

module.exports = {
    stateList,
    currentState,
    formattedStates,
};
