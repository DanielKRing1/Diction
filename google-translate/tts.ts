import {TargetLanguage} from './types';

type GenUrlParams = {
  ei?: string;
  opi?: number;
  yv?: number;
  tl?: TargetLanguage;
  txt: string;
  spd?: number;
  cs?: number;
  async?: '_fmt:jspb';
};
const genUrl = ({
  ei = 'dZFbZcyvIqvZkPIPyP2y0As',
  opi = 89978449,
  yv = 3,
  tl = 'zh-CN',
  txt,
  spd = 1,
  cs = 0,
  async = '_fmt:jspb',
}: GenUrlParams): string =>
  `https://www.google.com/async/translate_tts?ei=${ei}&opi=${opi}&yv=${yv}&ttsp=tl:${tl},txt:${txt},spd:${spd}&cs=${cs}&async=${async}`;
// tl:zh-CN,txt:%25E6%2588%2591%25E4%25BC%259A%25E5%2593%25A6%25E6%259D%25A5%25E6%2583%25B3%25E5%2590%2583%25E4%25BD%25A0%25E7%259A%2584%25E5%25B1%2581%25E8%2582%25A1,spd:1

export const getTTS = async (
  tl: TargetLanguage,
  txt: string,
  spd: number = 1,
): Promise<string> => {
  // 1. Raw result
  const res = await fetch(genUrl({tl, txt, spd}), {
    method: 'GET',
    headers: {
      Referer: 'https://www.google.com/',
      'Sec-Ch-Ua':
        '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'Sec-Ch-Ua-Arch': '"x86"',
      'Sec-Ch-Ua-Bitness': '"64"',
      'Sec-Ch-Ua-Full-Version': '"119.0.6045.160"',
      'Sec-Ch-Ua-Full-Version-List':
        '"Google Chrome";v="119.0.6045.160", "Chromium";v="119.0.6045.160", "Not?A_Brand";v="24.0.0.0"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Model': '""',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Ch-Ua-Platform-Version': '"10.0.0"',
      'Sec-Ch-Ua-Wow64': '?0',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android *; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
      // 'User-Agent':
      //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    },
  });
  const rawResultText = await res.text();

  // 2. Get translate_tts from result
  const {translate_tts} = JSON.parse(rawResultText.slice(5));

  // Base64
  return translate_tts[0] as string;

  // 3. Base64 to Buffer
  // const audioBuffer = Buffer.from(translate_tts[0], 'base64');

  // // 4. Buffer to ArrayBuffer
  // const audioAB = new ArrayBuffer(audioBuffer.length);
  // const view = new Uint8Array(audioBuffer);
  // for (let i = 0; i < audioBuffer.length; ++i) {
  //   view[i] = audioBuffer[i];
  // }

  // return audioAB;
};

// (async () => {
//   console.log('abc');
//   const audio64: string = await getTTS('zh-CN', '我想尽快吃东西', 1);
//   console.log(audio64);

//   await play(audio64);
// })();
