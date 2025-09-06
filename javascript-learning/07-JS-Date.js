// dates

// let myDate = new Date()
// console.log(myDate.toString())
// console.log(myDate.toDateString())
// console.log(myDate.toLocaleString())

//let myCreatedDate = new Date(2023, 0,25) 
let myCreatedDate = new Date(2023, 0,25,7,8) // In this format month start from zero

//console.log(myCreatedDate.toString()); // -> Wed Jan 25 2023 07:08:00 GMT+0530 (India Standard Time)
console.log(myCreatedDate.toLocaleString());
// 25/1/2023, 7:08:00 am

let myTimeStamp = Date.now() 
console.log(myTimeStamp);

console.log(Math.floor(Date.now()/1000)); // convert to Milllisecond

let newDate = new Date()
console.log(newDate)


