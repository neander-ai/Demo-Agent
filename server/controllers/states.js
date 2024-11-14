const State = require("./state");
const { getAllEvents } = require("../models/event");
let stateList = [];
const getAllStates = async () => {
  console.log("Get all states called");
  if (stateList.length == 0) {
    const events = await getAllEvents();
    events.forEach((event) => {
      const {
        name,
        partition,
        nextEventId,
        event_heading,
        event_description,
        tags,
        video_data,
      } = event;
      const newState = new State(
        name,
        partition,
        nextEventId,
        event_heading,
        event_description,
        tags,
        video_data
      );
      stateList.push(newState);
    });
    return stateList;
  }
  return null;
};

module.exports = {
  getAllStates,
};
