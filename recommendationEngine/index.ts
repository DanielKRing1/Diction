import {RealmObject} from '../realm';
import Phrase from '../realm/PhraseSchema';
import {shuffle} from '../utils/list';

type ScoredPhrase = {
  score: number;
  phrase: Phrase;
};

export const getRecs = (
  filteredPhrases: Realm.Results<Phrase>,
  count: number = 5,
): Phrase[] => {
  const now: number = new Date().getTime();

  let oldestTime: number = now;
  let mostIncorrectReviews: number = 0;

  // 1. Get max for recommendation factors
  for (let i = 0; i < filteredPhrases.length; i++) {
    // 2. Get phrase
    const phrase: Phrase = filteredPhrases[i];

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
    (phrase: Phrase) => {
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

  // 9. Return *count* highest scored phrases
  return scoredPhrases
    .slice(0, count)
    .map((scoredPhrase: ScoredPhrase) => scoredPhrase.phrase);
};

type PhraseChallenge = string[];
/**
 * Get a list containing both
 *  the words to create the indexed recommendation Phrase and
 *  a distinct word from each other reccommendation Phrase
 *
 * @param index
 * @param recs
 */
export const getPhraseChallenge = (
  selectedIndex: number,
  recs: Phrase[],
): PhraseChallenge => {
  if (recs.length === 0 || !recs[selectedIndex]) return [];

  const wordSet: Set<string> = new Set();

  // 1. Track "correct" words
  const correctWords: string[] = recs[selectedIndex].tRomanization.split(' ');
  correctWords.forEach(word => wordSet.add(word));

  // 2. Track "incorrect" words
  const incorrectWords: string[] = [];
  for (let i = 0; i < recs.length; i++) {
    // i. Ignore chosen Phrase
    if (i === selectedIndex) continue;

    // ii. Create list of potentially incorrect words from Phrase
    const phrase: Phrase = recs[i];
    const phraseWords: string[] = phrase.tRomanization.split(' ');
    shuffle(phraseWords);

    // iii. Find a single new incorrect word
    //  Pop until new distinct word found
    while (phraseWords.length > 0) {
      const word: string = phraseWords.pop()!;

      if (!wordSet.has(word)) {
        // iv. Track new distinct word in set
        wordSet.add(word);
        // v. Add "incorrect" word
        incorrectWords.push(word);
        break;
      }

      // vi. No other words, so just add duplicate
      if (phraseWords.length === 0) incorrectWords.push(word);
    }
  }

  // 3. Concat
  const allWords: string[] = correctWords.concat(incorrectWords);

  // 4. Shuffle
  shuffle(allWords);

  return allWords;
};

export const verifyChallenge = (expected: string, answer: string[]) => {
  return answer.join(' ') == expected;
};
