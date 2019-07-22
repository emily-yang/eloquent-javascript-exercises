/*
Write a function called withBoxUnlocked that takes a function value as argument, unlocks the box, 
runs the function, and then ensures that the box is locked again before returning, regardless of 
whether the argument function returned normally or threw an exception.
*/

const box = {
  locked: true,
  unlock() {
    this.locked = false;
  },
  lock() {
    this.locked = true;
  },
  _content: [],
  get content() {
    if (this.locked) throw new Error('Locked!');
    return this._content;
  },
};

function withBoxUnlocked(body) {
  try {
    box.unlock();
    body();
  } catch (err) {
    throw err;
  } finally {
    box.lock();
  }
}

withBoxUnlocked(function() {
  box.content.push('gold piece');
});

try {
  withBoxUnlocked(function() {
    throw new Error('Pirates on the horizon! Abort!');
  });
} catch (e) {
  console.log(`Error raised: ${e}`);
}
console.log(box.locked);
// → true
