import React, {useEffect, useState} from 'react';
import {ListRenderItem, Pressable, Text, TextInput, View} from 'react-native';
import {useRealm} from '@realm/react';
import {AVPlaybackStatus} from 'expo-av';

import {BoxShadow} from './BoxShadow';
import Phrase from '../../realm/PhraseSchema';
import {play, stop} from '../../audioPlayer/play';

const statusHandler =
  (handlePlay: () => void, handleStop: () => void) =>
  (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // Update your UI for the unloaded state
      if (status.error) {
        console.log(
          `Encountered a fatal error during playback: ${status.error}`,
        );
        handleStop();
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state

      if (status.isPlaying) {
        // Update your UI for the playing state
        handlePlay();
      } else {
        // Update your UI for the paused state
        handleStop();
      }

      if (status.isBuffering) {
        // Update your UI for the buffering state
      }

      if (status.didJustFinish && !status.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
        handleStop();
      }
    }
  };

type InfoProps = {
  item: Phrase;
  index: number;
};
const PhraseUIComponent: ListRenderItem<Phrase> = (info: InfoProps) => {
  // PROPS
  const {item: phrase, index} = info;

  // REALM
  const realm = useRealm();

  // LOCAL STATE
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tagsStr, setTagsStr] = useState<string>('');

  useEffect(() => {
    setTagsStr(phrase.tags.join(', '));
  }, [phrase]);

  // REALM HANDLERS
  const handleEditTags = (newTagsStr: string) => {
    setTagsStr(newTagsStr);
  };
  const handleSaveTags = () => {
    const newTags = tagsStr.split(', ');
    Phrase.setTags(realm, phrase._id, newTags);
  };

  const handleDelete = () => {
    Phrase.delete(realm, phrase._id);
  };

  // AUDIO HANDLERS
  const toggleIsPlaying = () => {
    // console.log(phrase.tSpeech64);
    // 1. Play or Stop
    if (!isPlaying) {
      play(
        phrase.tSpeech64,
        statusHandler(
          () => setIsPlaying(true),
          () => setIsPlaying(false),
        ),
      );
    } else {
      stop();
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
      }}>
      <BoxShadow>
        <Text style={{paddingHorizontal: 10}}>{phrase.sText}</Text>
        <Text style={{paddingHorizontal: 10}}>{phrase.tText}</Text>
        <Text style={{paddingHorizontal: 10}}>{phrase.tRomanization}</Text>
        <Text style={{paddingHorizontal: 10}}>
          {phrase.flashcard.last5Reviews}
        </Text>
        <Text style={{paddingHorizontal: 10}}>
          {phrase.flashcard.lastTimeReviewed.toISOString()}
        </Text>
        <Pressable onPress={toggleIsPlaying}>
          <Text>{!isPlaying ? 'Play' : 'Stop'}</Text>
        </Pressable>

        <TextInput
          placeholder="No tags..."
          value={tagsStr}
          onChangeText={handleEditTags}
        />

        <Pressable onPress={handleDelete}>
          <Text>X</Text>
        </Pressable>
      </BoxShadow>
    </View>
  );
};

const PhraseUIFunction: ListRenderItem<Phrase> = (info: any) => (
  <PhraseUIComponent
    item={info.item}
    index={info.index}
    separators={info.separators}
  />
);

export default PhraseUIFunction;
