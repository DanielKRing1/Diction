// ENTRY FILE FOR SCREENS

import React, {useContext} from 'react';

import {groupContext} from '../context/GroupContext';

import Groups from './Groups';
import Phrases from './Phrases';

type Props = {};
export default (props: Props) => {
  // CONTEXT
  const {groupId, setGroupId} = useContext(groupContext);

  return <>{!groupId ? <Groups /> : <Phrases />}</>;
};
