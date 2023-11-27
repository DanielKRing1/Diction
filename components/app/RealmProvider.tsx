import {PropertySchema} from 'realm';
import {RealmProvider} from '@realm/react';
import Phrase from '../../realm/phraseSchema';

type Props = {
  children: React.ReactNode;
};
export default ({children}: Props) => (
  <RealmProvider schema={[Phrase]}>{children}</RealmProvider>
);
