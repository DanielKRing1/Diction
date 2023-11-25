import {SourceLanguage, TargetLanguage} from './types';

type TranslationParams = {
  sl: SourceLanguage;
  tl: TargetLanguage;
  // Source text
  st: string;
  // Auto-correct
  ac?: boolean;
  // Id with unknown purpose
  id?: number;
};
type ExtractedTranslationData = {
  'tw-answ-sl': string;
  'tw-answ-tl': string;
  'tw-answ-id': string;
  'tw-answ-source-text': string;
  'tw-answ-target-text': string;
  'tw-answ-romanization': string;
  'tw-answ-detected-sl': string;
  'tw-answ-spelling-confident': string;
  'tw-answ-detected-sl-name': string;
  'tw-answ-language-detected': string;
  'tw-answ-community-verified': string;
};
type TextTranslations = {
  tt: string;
  tr: string;
};

const genTranslationUrlEncodedData = ({
  sl = 'zh-CN',
  tl = 'en',
  st,
  ac = false,
  // Id with unknown purpose
  id = 1700501312517,
}: TranslationParams): string =>
  `async=translate,sl:${sl},tl:${tl},st:${st},id:${id},qc:true,ac:${ac},_id:tw-async-translate,_pms:s,_fmt:pc`;

const fetchTranslationData = async (
  params: TranslationParams,
): Promise<ExtractedTranslationData> => {
  // 1. Get raw result (spans with id and value)
  const res = await fetch('https://www.google.com/async/translate', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      // 'Accept-Encoding': 'gzip, deflate, br',
      // ****INCREDIBLY IMPORTANT: THIS HEADER IS NECESSARY OR SPECIAL CHARACTERS WILL BE ENCODED AS EMPTY SPACES****
      'Accept-Encoding': 'identity',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': '"application/x-www-form-urlencoded;charset=UTF-8"',
      // 'Content-Type':
      //   '"application/x-www-form-urlencoded;charset=iso-8859-1"',
      Origin: 'https://www.google.com',
      Referer: 'https://www.google.com/',
      'Sec-Ch-Ua':
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'Sec-Ch-Ua-Arch': '"x86"',
      'Sec-Ch-Ua-Bitness': '"64"',
      'Sec-Ch-Ua-Full-Version': '"119.0.6045.160"',
      'Sec-Ch-Ua-Full-Version-List':
        '"Google Chrome";v="119.0.6045.160", "Chromium";v="119.0.6045.160", "Not?A_Brand";v="24.0.0.0"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Model': '"Windows"',
      'Sec-Ch-Ua-Platform-Version': '"10.0.0"',
      'Sec-Ch-Ua-Wow64': '?0',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 11; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
      // 'User-Agent':
      //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'X-Client-Data':
        'CIy2yQEIo7bJAQipncoBCJ2NywEIkqHLAQib/swBCPOYzQEIhaDNAQjfsc0BCNy9zQEI6cXNAQjH3M0BCMTfzQEItODNAQiy480BCNvjzQEI3OnNARjG4c0BGKfqzQEY642lFw==',
    },
    body: genTranslationUrlEncodedData(params),
  });

  const text = await res.text();

  return extractTranslationData(text);
};

const extractTranslationData = (rawText: string): ExtractedTranslationData => {
  // 1. Define regex
  // Regular expression to match the span elements
  const spanRegex = /<span id="([^"]+)">([^<]+)<\/span>/g;

  // Object to store the extracted ids and span values
  const extractedData: Record<string, any> = {};

  // 2. Extract each span id and value into a key/value object
  let match;
  // The regular expression exec method keeps track of the lastIndex where the next match should start.
  while ((match = spanRegex.exec(rawText)) !== null) {
    const id = match[1];
    const value = match[2];
    extractedData[id] = value;
  }

  return extractedData as ExtractedTranslationData;
};

export const getTextTranslations = async (
  params: TranslationParams,
): Promise<TextTranslations> => {
  // 1. Get result (span ids and values) as key/value object
  const translationData: ExtractedTranslationData = await fetchTranslationData(
    params,
  );

  // 2. Return relevant values
  const tt = translationData['tw-answ-target-text'];
  const tr = translationData['tw-answ-romanization'];
  return {tt, tr};
};

// (async () => {
//   const {tt, tr} = await getTextTranslations({
//     sl: 'en',
//     tl: 'zh-CN',
//     st: 'I want to eat food soon',
//     id: 1,
//   });
// })();
