import React, {useState} from 'react';
import {Text, TextInput, View, Pressable} from 'react-native';
import {useRealm} from '@realm/react';

import {getTTS} from '../google-translate/tts';
import {getTextTranslations} from '../google-translate/ttt';
import {SourceLanguage, TargetLanguage} from '../google-translate/types';
import Phrase from '../realm/phraseSchema';

type Props = {};
export default (props: Props) => {
  const [sl, setSL] = useState<SourceLanguage>('en');
  const [tl, setTL] = useState<TargetLanguage>('zh-CN');

  const [st, setST] = useState('');
  const [tt, setTT] = useState('');
  const [tr, setTR] = useState('');
  const [audio64, setAudio64] = useState('');

  const realm = useRealm();

  const getTranslationData = async () => {
    console.log('GET');
    try {
      const {tt: _tt, tr: _tr} = await getTextTranslations({
        sl,
        tl,
        st,
        id: 1,
      });

      const _audio64: string = await getTTS(tl, tt, 1);

      setTT(_tt);
      setTR(_tr);
      setAudio64(_audio64);

      console.log(st);
      console.log(_tt);
      console.log(_tr);
    } catch (err) {
      console.error(err);
    }
  };

  const saveTranslationData = async () => {
    // 1. Nothing to save
    if (tt === '') return;

    // 2. Save
    await Phrase.createF(realm, {
      sText: st,
      group: 'test',
      tags: ['test'],
      tText: tt,
      tRomanization: tr,
      tSpeech64: audio64,
    });

    // 3. Reset translations
    setTT('');
    setTR('');
    setAudio64('');
  };

  return (
    <View>
      <Text>Save Translation Screen</Text>

      <TextInput
        style={{
          padding: 10,
        }}
        onChangeText={setST}
        value={st}
        placeholder="Learn a phrase..."
      />
      <Pressable onPress={getTranslationData}>
        <Text
          style={{
            padding: 10,
          }}>
          Get
        </Text>
      </Pressable>
      <Pressable onPress={saveTranslationData}>
        <Text
          style={{
            padding: 10,
          }}>
          Save
        </Text>
      </Pressable>

      <Text>{tt}</Text>
      <Text>{tr}</Text>
      <Text>{audio64}</Text>
    </View>
  );
};
