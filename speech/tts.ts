import Tts from 'react-native-tts';

// // 1. English
// Tts.setDefaultLanguage('en-IE');
// Tts.speak('Hello, world!');

// // 2. Other
// Tts.setDefaultLanguage('en-IE');
// Tts.speak('Hello, world!');

// Check available languages
export default () => {
  Tts.voices().then(voices => {
    const results = voices.filter(v => v.name.includes('zh'));

    results.forEach(r => console.log(r));
  });

  //   Tts.setDefaultLanguage('en-IE');
  //   Tts.speak('Hello, world!');
  // zh-CN-language
  //   Tts.setDefaultLanguage('zh-CN');
  Tts.setDefaultVoice('zh-CN-language');
  //   Tts.speak('Ni xi huan!');
  Tts.speak('Nǐ xǐhuān!');
};
