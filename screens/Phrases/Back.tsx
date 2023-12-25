import React, {useContext} from 'react';

import {Text, TouchableOpacity} from 'react-native';
import {groupContext} from '../../context/GroupContext';

type Props = {};
export default (props: Props) => {
  // CONTEXT
  const {groupId, setGroupId, resetGroupId} = useContext(groupContext);

  // HANDLERS
  const handleBack = () => {
    resetGroupId();
  };

  return (
    <>
      <TouchableOpacity onPress={handleBack}>
        <Text>Back</Text>
      </TouchableOpacity>
    </>
  );
};
