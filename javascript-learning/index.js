const accId = 123;
var accEmail = "Vish@gmail.com";
let accPassword = "12345";
accCity = "Jaipur";

console.log(accId)
// console.log(document); this will run on browser
// note - use only let not a var becaus eof functional issue of scope
let arr = ["apple", "banana", "chiku", "grapes", "orange"];
const div = document.getElementById("list");
let ul = document.createElement("ol");
div.appendChild(ul);
for (let i = 0; i < arr.length; i++) {
  let li = document.createElement("li");
  li.innerText = arr[i];
  ul.appendChild(li);
}
console.table([accId, accEmail, accPassword, accCity]);


//We can update var let and normal declared variables
