const { characterScript, countBy } = require('./chapter-snippets');

/**
 *  Computers the dominant writing direction in a string of text
 * @param {String} text
 * @returns {String} ltr, rtl, or ttb
 */
function dominantDirection(text) {
  // each script object has a direction property!

  // 1. split text string into array of characters
  const directionCounts = countBy(text, ch => {
    const script = characterScript(ch.codePointAt(0));
    return script ? script.direction : null;
  }).filter(dir => dir.name !== null);

  const highestCount = directionCounts.reduce((a, b) => (b.count > a.count ? b : a));
  return highestCount.name;
}

console.log(dominantDirection('Hello!'));
// → ltr
console.log(dominantDirection('Hey, مساء الخير'));
// → rtl
