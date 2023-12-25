import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {useQuery} from '@realm/react';

import Group from '../../realm/GroupSchema';
import GroupUI from '../../components/ui/GroupUI';

type Props = {};
export default (props: Props) => {
  // REALM
  const groups = useQuery(Group);

  return (
    <View>
      <Text>Read Translation Group Screen</Text>

      <FlatList
        data={groups.sorted('lastUsed', true)}
        keyExtractor={item => item._id.toHexString()}
        renderItem={GroupUI}
      />
    </View>
  );
};
