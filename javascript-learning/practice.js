// data type
//number => 2 to power 53
// bigint
// string =""
//boolean=>true/false
// null =>stand alone object
// undefined
// symbol => unique 

//object

console.log(typeof undefined) // undefined
console.log(typeof null) // object



///////  Data Conversion ///////////////
let score= 33

console.log(typeof score)
console.log(typeof(score))
 
let valueInNumber = Number(score)
console.log(typeof valueInNumber)
console.log(valueInNumber)



// "33" => 33
// "33abc" = NaN
// true => 1 false =>0

let isLoggedIn = 1
 let booleanIsLoggedIn = Boolean(isLoggedIn)
 console.log(booleanIsLoggedIn) // true

 /* 1 => true
 0 =>false
 "" = > false
 "hitesh" => true
 */

let someNumber = 50
let stringNumber = String(someNumber)
console.log(stringNumber)
console.log(typeof stringNumber)