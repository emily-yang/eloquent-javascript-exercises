const { characterScript, countBy } = require('./chapter-snippets');

function dominantDirection(text) {
  // Why not use the direction instead of the name of the script
  const directions = countBy(text, char => {
    const script = characterScript(char.codePointAt(0));
    return script ? script.direction : 'none';
  });

  // Checks if we have anything at all
  const total = directions.reduce((n, { count }) => n + count, 0);
  if (total === 0) return 'No scripts found';

  // Uses a sorted reduce by comparing the largest on-going value
  const leadDirection = directions.reduce((a, b) =>
    a.count < b.count ? b : a
  );

  return leadDirection.name;
}

console.log(dominantDirection('Hello!'));
// → ltr
console.log(dominantDirection('Hey, مساء الخير'));
// → rtl
