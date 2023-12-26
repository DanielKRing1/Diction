import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@realm/react';

import {
  getRecs,
  getPhraseChallenge,
  verifyChallenge,
} from '../../recommendationEngine';
import Phrase from '../../realm/PhraseSchema';

type Props = {};
export default (props: Props) => {
  // LOCAL STATE
  const [recs, setRecs] = useState<Phrase[]>([]);
  const [recIndex, setRecIndex] = useState<number>(-1);
  const [challenge, setChallenge] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);

  // REALM
  const phrases: Realm.Results<Phrase> = useQuery(Phrase);

  // EFFECTS
  // Init
  useEffect(() => {
    setRecs(getRecs(phrases));
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
        <>
          <Text>Challenge: {challenge.join(', ')}</Text>

          <Text>Expected: {recs[recIndex].tRomanization}</Text>
          <Text>Answer: {answer}</Text>
          <Text>{verifyChallenge(recs[recIndex].tRomanization, answer)}</Text>
          <TouchableOpacity>
            <Text>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};
