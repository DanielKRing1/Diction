import {Audio} from 'expo-av';

// Create new Sound
let soundObject: Audio.Sound = new Audio.Sound();
export const play = async (audio64: string): Promise<void> => {
  // 1. Stop any sounds currently playing
  await stop();

  // 2. Load and play sound
  try {
    await soundObject.loadAsync({
      uri: `data:audio/mp3;base64,${audio64}`,
    });
    await soundObject.playAsync();
  } catch (err) {
    console.error(err);
  }
};

export const pause = async () => {
  await soundObject.pauseAsync();
};

export const stop = async () => {
  try {
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  } catch (err) {
    console.error(err);
  }
};
