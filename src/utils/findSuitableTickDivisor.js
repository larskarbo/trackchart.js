export function findSuitableTickDivisor(maxValue) {
  let optimalSplit = maxValue / 4;
  let testing = 1;
  let pow10 = 0;
  let nums = [1, 2, 2.5, 5];
  let numPointer = 0;
  let horse = true;
  while (horse) {
    if (testing >= optimalSplit) {
      return testing;
    }
    console.log('numPointer: ', numPointer);
    testing = nums[numPointer] * Math.pow(10, pow10);
    numPointer++;
    if (numPointer == nums.length) {
      console.log('here')
      numPointer = 0;
      pow10++;
    }
  }
  setTimeout(() => {
    horse = false;
  }, 3000);
}
