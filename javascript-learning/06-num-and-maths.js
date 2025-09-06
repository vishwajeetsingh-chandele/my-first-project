const Score =400
console.log(Score)
console.log(typeof(Score))

const balance = new Number(100)
console.log(balance)

//console.log(balance.toString().length) // convert to string and 3
//console.log(balance.toFixed(2)); //100.00

const AnyNumber = 123.09806
//console.log(AnyNumber.toPrecision(3));

const Hundred = 10000
//console.log(Hundred.toLocaleString('en-IN')) //10,000 

//++++++++++++Maths++++++++++++++++++
 /* console.log(Math);
console.log(Math.abs(-4)); //convert to +ve only
console.log(Math.abs(4));
console.log(Math.round(4.39)); // round off
console.log(Math.ceil(4.39)); // take highest value
console.log(Math.floor(4.6)); // take lowest value

console.log(Math.min(4,3,8,6));
console.log(Math.max(4,3,8,6));

console.log(Math.random()); // any random values bet 0.0 & 1.0
console.log(Math.floor(Math.random()* 10) +1); // it will shift the digit and gives non zero values
 */

const min =10
const max = 20
console.log(Math.floor(Math.random() * (max - min +1)) + min);





