'use strict';

const compose = (...fns) => {
  const errorHandlers = [];
  
  const composed = (x) => {
    let result = x;
    try {
      for (let i = fns.length - 1; i >= 0; i--) {
        result = fns[i](result);
      }
      return result;
    } catch (error) {
      for (const handler of errorHandlers) {
        handler(error);
      }
      return undefined;
    }
  };
  
  composed.on = (event, handler) => {
    if (event === 'error') {
      errorHandlers.push(handler);
    }
    return composed;
  };
  
  return composed;
};

// Тестові функції
const inc = x => ++x;
const twice = x => x * 2;
const cube = x => x ** 3;

// Тестування 1: нормальна композиція
const f1 = compose(inc, twice, cube);
console.log(f1(5)); // 251

// Тестування 2: подвійне інкрементування
const f2 = compose(inc, inc);
console.log(f2(7)); // 9

// Тестування 3: помилка при виконанні
const boom = () => { throw new Error('Calculation error'); };
const f3 = compose(inc, boom, cube);

f3.on('error', (error) => {
  console.error('Caught error:', error.message);
});

console.log(f3(3)); // undefined (і виведе: Caught error: Calculation error)

// Тестування 4: передача не-функції
const f4 = compose(inc, 7, cube);
f4.on('error', (error) => {
  console.error('Error with invalid argument:', error.message);
});
console.log(f4(1)); // undefined
