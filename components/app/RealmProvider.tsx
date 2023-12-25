import {RealmProvider} from '@realm/react';

import Group from '../../realm/GroupSchema';
import Phrase from '../../realm/PhraseSchema';
import Flashcard from '../../realm/FlashCardSchema';

type Props = {
  children: React.ReactNode;
};
export default ({children}: Props) => (
  <RealmProvider schema={[Group, Phrase, Flashcard]}>{children}</RealmProvider>
);
