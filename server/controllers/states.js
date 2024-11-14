const State = require("./state");
const statesData = require("./productaddition.json");
const stateList = [];

// Todo: Create stateList and current state

// Create the formatted states with identifiers and set starting state at id-0
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
const currentState = stateList[0].event_description + ": " + stateList[0].tags.join(", ");
const formattedStates = stateList.map((state) => `name: ${state.event_description}: ${state.tags.join(", ")} [ ${state.llm_text} ]`).join("\n");

module.exports = {
    stateList,
    currentState,
    formattedStates,
};
