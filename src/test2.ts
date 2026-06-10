const text = "  [1] In the beginning was the Word, and the Word was with God, and the Word was God. [2] He was in the beginning with God. [3] All things were made through him, and without him was not any thing made that was made. [4] In him was life, and the life was the light of men. [5] The light shines in the darkness, and the darkness has not overcome it.\n\n  [6] There was a man sent from God, whose name was John.";

const tokens = text.split(/\[(\d+)\]/);
console.log(tokens);
