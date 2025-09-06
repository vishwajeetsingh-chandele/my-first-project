/* primitive
 7 - string , number, boolean ,null,undefined,symbol,bigInt

 */

 const value =100
 const valueOf = 100.3
 const OutsideTemp = null
 let accEmail //default undefined

 const id =Symbol('123')
 const anotherId =Symbol('123') 

 //console.log(id == anotherId) //false

 const BigIntNumber= 1234569871n


 /*
 Non-primitive /reference type 
 array , objects, functions


Return type of variables in JavaScript
1) Primitive Datatypes
       Number => number
       String  => string
       Boolean  => boolean
       null  => object
       undefined  =>  undefined
       Symbol  =>  symbol
       BigInt  =>  bigint

2) Non-primitive Datatypes
       Arrays  =>  object
       Function  =>  function
       Object  =>  object

 */

 let fruits = ["apple","Mango","Banana"]
 let myObj ={
    name: "vish",
    age : 25
 }

 const myFunction = function(){
   // console.log("Function declared")

 }
 //console.log(typeof myFunction)


 // ++++++++++++++++++++++++++++++++++++++++++

 // Stack (Primitive)  Heap (Non- Primitive)

 let Myname = "vish" // it stores on Stack 
 let Newname = Myname // it will create copy of Myname and original preserve as it is 
 Newname = "Singh"
 console.log(Myname) // op -vish

 console.log(Newname) // op - singh

 let userOne = {
    email : "user@gmail.com",
    upi : "user@ybl"
 } // It will store on heap 

 let userTwo = userOne // usrTwo will takimg the actual value

 userTwo.email = "vish@gmail.com" //as it will be update values in userOne

 console.log(userOne) //{ email: 'vish@gmail.com', upi: 'user@ybl' }
 console.log(userTwo) // { email: 'vish@gmail.com', upi: 'user@ybl' }



