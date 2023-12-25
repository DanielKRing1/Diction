import React, {useContext, useState} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {useQuery} from '@realm/react';

import Phrase from '../../realm/PhraseSchema';
import PhraseUI from '../../components/ui/PhraseUI';
import {groupContext} from '../../context/GroupContext';

type Props = {
  // groupId: Realm.BSON.ObjectId;
};
export default (props: Props) => {
  // PROPS
  const {} = props;

  // LOCAL STATE
  const [searchInput, setSearchInput] = useState('');

  // CONTEXT
  const {groupId, setGroupId} = useContext(groupContext);

  // REALM
  const phrases = useQuery(Phrase);

  return (
    <View>
      <Text>Read Translations Screen</Text>

      <Text>Phrases count: {phrases.length}</Text>

      <FlatList
        data={phrases
          .filtered('groupId = $0', groupId)
          .filtered(
            'sText CONTAINS[c] $0 OR $1 IN tags',
            searchInput,
            searchInput,
          )
          .sorted('createdAt', true)}
        keyExtractor={item => item._id.toHexString()}
        renderItem={PhraseUI}
      />
    </View>
  );
};
