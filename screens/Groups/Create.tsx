import React, {useContext, useState} from 'react';
import {Text, TextInput, View, Pressable} from 'react-native';
import {useQuery, useRealm} from '@realm/react';

import Group from '../../realm/GroupSchema';
import {groupContext} from '../../context/GroupContext';

type Props = {};
export default (props: Props) => {
  // PROPS
  const {} = props;

  const [newGroupName, setNewGroupName] = useState('');

  // CONTEXT
  const {groupId, setGroupId} = useContext(groupContext);

  // REALM
  const phrases = useQuery(Group);

  // REALM
  const realm = useRealm();

  // REALM HANDLERS
  const create = async () => {
    // 1. Save
    await Group.create(realm, newGroupName);

    // 2. Reset
    setNewGroupName('');
  };

  console.log('groupId:');
  console.log(groupId);

  return (
    <View>
      <Text>Create Group Screen</Text>

      <Text>{groupId?.toString()}</Text>

      {/* Source text */}
      <TextInput
        style={{
          padding: 10,
        }}
        onChangeText={setNewGroupName}
        value={newGroupName}
        placeholder="New group..."
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
