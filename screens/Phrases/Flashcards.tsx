import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {useQuery} from '@realm/react';

import {getRecs, getPhraseChallenge} from '../../recommendationEngine';
import Phrase from '../../realm/PhraseSchema';

type Props = {};
export default (props: Props) => {
  // LOCAL STATE
  const [recs, setRecs] = useState<Phrase[]>([]);
  const [recIndex, setRecIndex] = useState<number>(-1);
  const [challenge, setChallenge] = useState<string[]>([]);

  // REALM
  const phrases: Realm.Results<Phrase> = useQuery(Phrase).filtered('');

  // EFFECTS
  // Init
  useEffect(() => {
    getRecs(phrases);
    setRecIndex(0);
  }, []);

  // Update challenge
  useEffect(() => {
    if (recIndex === -1) return;

    setChallenge(getPhraseChallenge(recIndex, recs));
  }, [recIndex]);

  return (
    <>
      {recs.length > 0 && recIndex > -1 && (
        <Text>{recs[recIndex].tRomanization}</Text>
      )}
      <Text>{challenge}</Text>
    </>
  );
};
