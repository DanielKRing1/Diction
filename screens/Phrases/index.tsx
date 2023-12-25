import React from 'react';

import Back from './Back';
import GroupHeader from './GroupHeader';
import Create from './Create';
import Read from './Read';

type Props = {};
export default (props: Props) => {
  return (
    <>
      <Back />
      <GroupHeader />
      <Create />
      <Read />
    </>
  );
};
