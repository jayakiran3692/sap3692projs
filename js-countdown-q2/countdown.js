function countdown(seconds) {
  return new Promise((resolve, reject) => {
    if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
      reject("Invalid input");
      return;
    }
    let s = seconds;
    const tick = () => {
      if (s === 0) {
        resolve("Done");
        return;
      }
      console.log(s);
      s--;
      setTimeout(tick, 1000);
    };
    tick();
  });
}

module.exports = countdown;