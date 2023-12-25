import React, {useContext, useState} from 'react';
import {Text, TextInput, View, Pressable} from 'react-native';
import {useRealm} from '@realm/react';

import Phrase from '../../realm/PhraseSchema';
import {SourceLanguage, TargetLanguage} from '../../google-translate/types';
import {groupContext} from '../../context/GroupContext';

type Props = {
  // groupId: Realm.BSON.ObjectId;
};
export default (props: Props) => {
  // PROPS
  const {} = props;

  // LOCAL STATE
  const [sl, setSL] = useState<SourceLanguage>('en');
  const [tl, setTL] = useState<TargetLanguage>('zh-CN');

  const [st, setST] = useState('');

  // CONTEXT
  const {groupId, setGroupId} = useContext(groupContext);

  // REALM
  const realm = useRealm();

  // REALM HANDLERS
  const create = async () => {
    // 1. Save
    await Phrase.create(
      realm,
      {sl, tl},
      {sText: st, groupId: groupId!, tags: []},
    );

    // 2. Reset
    setST('');
  };

  return (
    <View>
      <Text>Create Translation Screen</Text>

      {/* Source text */}
      <TextInput
        style={{
          padding: 10,
        }}
        onChangeText={setST}
        value={st}
        placeholder="Learn a phrase..."
      />
      <Pressable onPress={create}>
        <Text
          style={{
            padding: 10,
          }}>
          Create
        </Text>
      </Pressable>
    </View>
  );
};
