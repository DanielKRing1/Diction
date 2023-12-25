import Realm, {ObjectSchema} from 'realm';

// REALM OBJECT
export interface FlashcardObj {
  // Note: between 0 (correct) and 1 (entirely incorrect)
  last5Reviews: number[];
  lastTimeReviewed: Date;
}

// CLASS
class Flashcard extends Realm.Object implements FlashcardObj {
  // Note: between 0 (correct) and 1 (entirely incorrect)
  last5Reviews!: number[];
  lastTimeReviewed!: Date;

  // SCHEMA

  static readonly FLASHCARD_SCHEMA_NAME = 'Flashcard';
  static readonly schema: ObjectSchema = {
    name: Flashcard.FLASHCARD_SCHEMA_NAME,
    embedded: true,
    properties: {
      // Note: between 0 (correct) and 1 (entirely incorrect)
      last5Reviews: {type: 'list', objectType: 'float', default: () => []},
      lastTimeReviewed: {type: 'date', default: () => new Date()},
    },
  };

  // IMPLEMENTATION

  static generate(): FlashcardObj {
    return {
      // 1. Fill in default Realm Object fields
      last5Reviews: [],
      lastTimeReviewed: new Date(),
    };
  }
}

export default Flashcard;
