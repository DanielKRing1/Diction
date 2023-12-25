import React, {useContext} from 'react';
import {Pressable, Text, View, ListRenderItem} from 'react-native';
import {useRealm} from '@realm/react';

import {BoxShadow} from './BoxShadow';
import Group from '../../realm/GroupSchema';
import {groupContext} from '../../context/GroupContext';

type InfoProps = {
  item: Group;
  index: number;
};
const GroupUIComponent: ListRenderItem<Group> = (info: InfoProps) => {
  // PROPS
  const {item: group, index} = info;

  // CONTEXT
  const {groupId, setGroupId} = useContext(groupContext);

  // REALM
  const realm = useRealm();

  // HANDLERS
  const handleSelectGroup = () => {
    console.log('select');
    // 1. Update Group 'lastUsed' property
    Group.updateLastUsed(realm, group._id);

    // 2. Set id in Group Context
    setGroupId(group._id);
  };

  const handleDelete = () => {
    Group.delete(realm, group._id);
  };

  return (
    <Pressable onPress={handleSelectGroup}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 10,
        }}>
        <BoxShadow>
          <Text style={{paddingHorizontal: 10}}>{group.name}</Text>
        </BoxShadow>
      </View>

      <Pressable onPress={handleDelete}>
        <Text>X</Text>
      </Pressable>
    </Pressable>
  );
};

const GroupUIFunction: ListRenderItem<Group> = (info: any) => (
  <GroupUIComponent
    item={info.item}
    index={info.index}
    separators={info.separators}
  />
);

export default GroupUIFunction;
