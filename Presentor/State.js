class State {
  /**
   * This class has all the features a state would contain in a proper state machine.
   * All the properties here would ideally be read from a JSON file.
   * @param {string} state_name - The name of the state.
   * @param {string[]} tags - List of tags used by the agent to decide the next state.
   * @param {string} [video_link=null] - Link to the video to be played.
   * @param {string} [audio_link=null] - Link to the audio to be played.
   * @param {number} [position=-1] - Order in which it is to be presented under normal flow control, set to -1 if only presented when specified by the user.
   */
  constructor(state_name, tags, video_link = null, audio_link = null, position = -1) {
    this.state_name = state_name;
    this.tags = tags;
    this.video_link = video_link;
    this.audio_link = audio_link;
    this.position = position;
  }

  /**
   * Returns a string representation of the state.
   * Used for debugging purposes.
   * @returns {string}
   */
  toString() {
    return this.state_name;
  }
}

module.exports = State;
