import Voice, {SpeechResultsEvent} from '@react-native-voice/voice';

export default () => {
  // 1. Set result handler
  Voice.onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
  };

  // 2. Start listening
  // Voice.start('en-US');
  Voice.start('zh_CN');

  setTimeout(() => {
    Voice.stop();
  }, 5000);
};
