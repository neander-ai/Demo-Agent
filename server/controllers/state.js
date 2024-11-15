class State {
  /**
   * Constructor for the State class.
   * @param {string} name
   * @param {string} partition
   * @param {any} nextEventId
   * @param {string} event_heading
   * @param {string} event_description
   * @param {string} llm_text
   * @param {string[]} tags
   * @param {any} video_data
   * @param {string} video_duration
   * @param {any} audio_data
   * @param {string} audio_duration
   * @param {ObjectId} product
   */
  constructor(
    name,
    partition,
    nextEventId,
    event_heading,
    event_description,
    tags,
    video_data
  ) {
    this.name = name;
    this.partition = partition;
    this.nextEventId = nextEventId;
    this.event_heading = event_heading;
    this.event_description = event_description;
    this.llm_text = null;
    this.tags = tags;
    this.video_data = video_data;
    this.video_duration = null;
    this.audio_data = null;
    this.audio_duration = null;
    this.product = null;
  }

  /**
   * Returns a string representation of the state.
   * Used for debugging purposes.
   * @returns {string}
   */
  toString() {
    return this.event_description;
  }
}

module.exports = State;
