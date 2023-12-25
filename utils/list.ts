// Durstenfeld shuffle, an optimized version of Fisher-Yates
export const shuffle = (list: any[]) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
};
