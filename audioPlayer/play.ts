import {AVPlaybackStatus, Audio} from 'expo-av';

// Create new Sound
let soundObject: Audio.Sound = new Audio.Sound();
export const play = async (
  audio64: string,
  onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void,
): Promise<void> => {
  // 1. Stop any sounds currently playing
  await stop();

  // 2. Load and play sound
  try {
    soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

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
    // 1. Not loaded
    if (!(await soundObject.getStatusAsync()).isLoaded) return;

    // 2. Stop playing
    await soundObject.stopAsync();
    // 3. Unload so another sound can be loaded
    await soundObject.unloadAsync();
  } catch (err) {
    console.error(err);
  }
};
