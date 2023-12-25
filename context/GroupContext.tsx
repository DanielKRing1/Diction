import {Context, createContext, PropsWithChildren, useState} from 'react';

type GroupContext = {
  groupId: Realm.BSON.ObjectId | undefined;
  setGroupId: (newGroupId: Realm.BSON.ObjectId | undefined) => void;
  resetGroupId: () => void;
};
const defaultValue: GroupContext = {
  groupId: undefined,
  setGroupId: () => {},
  resetGroupId: () => {},
};

export const groupContext: Context<GroupContext> =
  createContext<GroupContext>(defaultValue);
export const GroupProvider = ({children}: PropsWithChildren) => {
  // LOCAL STATE
  const [groupId, setGroupId] = useState<Realm.BSON.ObjectId | undefined>();

  // HANDLERS
  const resetGroupId = () => setGroupId(undefined);

  return (
    <groupContext.Provider value={{groupId, setGroupId, resetGroupId}}>
      {children}
    </groupContext.Provider>
  );
};
