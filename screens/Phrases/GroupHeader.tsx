import React, {useContext} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@realm/react';

import {groupContext} from '../../context/GroupContext';
import Group from '../../realm/GroupSchema';

type Props = {};
export default (props: Props) => {
  // CONTEXT
  const {groupId, setGroupId, resetGroupId} = useContext(groupContext);

  // REALM
  const groups = useQuery(
    Group,
    collection => collection.filtered('_id == $0', groupId),
    [groupId],
  );

  return (
    <>
      <Text>Group Id: {groupId?.toHexString()}</Text>
      <Text>Group Name: {groups[0].name}</Text>
    </>
  );
};
