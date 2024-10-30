class State {
  /**
   * Constructor for the State class.
   * @param {string} script_url
   * @param {string} event_description
   * @param {string} llm_text
   * @param {string[]} tags
   * @param {number} script_duration
   */

  constructor(script_url, event_description, llm_text, tags, script_duration) {
    this.script_url = script_url;
    this.event_description = event_description;
    this.llm_text = llm_text;
    this.tags = tags;
    this.script_duration = script_duration;
  }
  /**
   * Returns a string representation of the state.
   * Used for debugging purposes.
   * @returns {string}
   */
  toString() {
    return this.event_descriptione;
  }
}

module.exports = State;
