// String

const Name = "Vish"
const Age = 24

//console.log(Name + Age + "Perfect") // old way

//console.log(`Hello My name is ${Name} and age is ${Age}`)

// Another way to declare string
const GameName = new String('Singh')
console.log(GameName[0]) // S
console.log(GameName.__proto__) // {}

console.log(GameName.charAt(2)); // n
console.log(GameName.indexOf('n')); // if char found then return index of char else -1 op -> 2

console.log(GameName.length); // 5
console.log(GameName.toLowerCase()); //singh


const newString = GameName.substring(0,2) // start index and (end -1 ) will return
//console.log(newString) // Si

const anotherSting = GameName.slice(-4,3) //start index and (end -1 ) will return an dwe can pass -ve index sreverse o it will start from 
console.log(anotherSting) // Sing

const StringOne = "     Vish    "

console.log(StringOne) // includes spaces
console.log(StringOne.trim()) // remove spaces

const url = "https://www.youtube.com/watch?v=fozwNnFunlo&list="
url.replace('=','%')
console.log(url)

console.log(url.includes('tube')) // if found return true
console.log(url.split('/'));




