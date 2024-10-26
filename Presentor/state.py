#state.py

#state_name
#tags - list of tags used by the agent to decide next state
#position - ordered in which it is to be presented under the normal flow control, set to (-1) if it is only presented when specified by the user
#video_link - link to the video to be played
#audio_link - link to the audio to be played

class State(object):
    '''This class has all the features a state would contain in a propoer state machine. All the properties here ideally would be read from a JSON file'''

    def __init__(self, state_name, tags, video_link=None, audio_link=None, position=-1):
        self.state_name = state_name
        self.tags = tags
        self.video_link = video_link
        self.audio_link = audio_link
        self.position = position

        #match the speed of the audio and video so they go along

    def __repr__(self) -> str:
        #for debug purposes
        return self.state_name

    

    
    