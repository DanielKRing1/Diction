import {RealmObject} from '../realm';
import {PhraseObj} from '../realm/PhraseSchema';

type ScoredPhrase = {
  score: number;
  phrase: RealmObject<PhraseObj>;
};

export default (
  filteredPhrases: Realm.Results<RealmObject<PhraseObj>>,
): RealmObject<PhraseObj>[] => {
  const now: number = new Date().getTime();

  let oldestTime: number = now;
  let mostIncorrectReviews: number = 0;

  // 1. Get max for recommendation factors
  for (let i = 0; i < filteredPhrases.length; i++) {
    // 2. Get phrase
    const phrase: RealmObject<PhraseObj> = filteredPhrases[i];

    // 3. Update oldestTime
    oldestTime = Math.min(
      phrase.flashcard.lastTimeReviewed.getTime(),
      oldestTime,
    );

    // 4. Update mostIncorrectReviews
    const incorrectCount: number = phrase.flashcard.last5Reviews.reduce<number>(
      (acc: number, cur: number) => {
        acc += cur;
        return acc;
      },
      0,
    );
    mostIncorrectReviews = Math.max(incorrectCount, mostIncorrectReviews);
  }

  // 5. Score each phrase
  const scoredPhrases: ScoredPhrase[] = filteredPhrases.map<ScoredPhrase>(
    (phrase: RealmObject<PhraseObj>) => {
      // 6. Compute time component
      const timeComponent: number =
        1 -
        (phrase.flashcard.lastTimeReviewed.getTime() - oldestTime) /
          (now - oldestTime);

      // 7. Compute incorrectness component
      const incorrectCount: number =
        phrase.flashcard.last5Reviews.reduce<number>(
          (acc: number, cur: number) => {
            acc += cur;
            return acc;
          },
          0,
        );
      // (Avoid divide by 0 error)
      const incorrectnessComponent: number =
        incorrectCount / (mostIncorrectReviews || 1);

      return {
        score: (timeComponent + incorrectnessComponent) / 2,
        phrase,
      };
    },
  );

  // 8. Sort phrases on score
  scoredPhrases.sort((a, b) => b.score - a.score);

  // 9. Return 5 highest scored phrases
  return scoredPhrases
    .slice(0, 5)
    .map((scoredPhrase: ScoredPhrase) => scoredPhrase.phrase);
};
