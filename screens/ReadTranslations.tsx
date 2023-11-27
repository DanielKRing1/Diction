import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {useQuery} from '@realm/react';

import Phrase from '../realm/phraseSchema';
import {play} from '../audioPlayer/play';

type Props = {};
export default (props: Props) => {
  const phrases = useQuery(Phrase);

  const handlePlay = (base64: string) => {
    play(base64);
  };

  return (
    <View>
      <Text>Read Translations Screen</Text>

      <Text>Phrases count: {phrases.length}</Text>

      <FlatList
        data={phrases.sorted('createdAt', true)}
        keyExtractor={item => item._id.toHexString()}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                margin: 10,
              }}>
              <Text style={{paddingHorizontal: 10}}>{item.sText}</Text>
              <Text style={{paddingHorizontal: 10}}>{item.tText}</Text>
              <Text style={{paddingHorizontal: 10}}>{item.tRomanization}</Text>

              <Pressable onPress={() => handlePlay(item.tSpeech64)}>
                <Text style={{paddingHorizontal: 10}}>{'>'}</Text>
              </Pressable>
            </View>
          );
        }}></FlatList>
    </View>
  );
};
