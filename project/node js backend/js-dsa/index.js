//Reverse an array/string

// function reverse(arr){
//     let start = 0;
//     let end = arr.length-1;
//     while(start<end){
//         let temp=arr[start];
//         arr[start]=arr[end];
//         arr[end]=temp;
//         start++;
//         end--;
//     }
//     return arr;
// }
// console.log(reverse([1,2,3,4,5]));

// find duplicate elements in an array

// function findDuplicates(arr) {
//   let freq = {}; // frequency object
//   let duplicates = [];

//   for (let i = 0; i < arr.length; i++) {
//     let element = arr[i];

//     // if element exists, increase count
//     if (freq[element]) {
//       freq[element]++;

//       // if count becomes 2, push into duplicates
//       if (freq[element] === 2) {
//         duplicates.push(element);
//       }
//     } else {
//       freq[element] = 1; // first time we see the element
//     }
//   }

//   return duplicates;
// }

// console.log(findDuplicates([1, 2, 3, 4, 2, 3, 5, 6, 3]));
// // 👉 [2, 3]

// function rotateArray(arr,k){
//     k=k%arr.length;
//     let part1=arr.slice(0,arr.length-k);
//     let part2=arr.slice(arr.length-k);
//     return part2.concat(part1);
// }
// console.log(rotateArray([1,2,3,4,5],2));

// implement stack using array 

class Stack{
    constructor(){
        this.items=[];
    }
    push(element){
        this.items.push(element);
    }
    pop(){
        if(this.isEmpty()){
            return "Underflow";
        }
        return this.items.pop();
    }
    peek(){
        if(this.isEmpty()){
            return "No elements in stack";
        }
        return this.items[this.items.length-1];
    }   
    isEmpty(){
        return this.items.length===0;
    }
    printStack(){
        let str="";
        for(let i=0;i<this.items.length;i++){
            str+=this.items[i]+" ";
        }
        return str;
    }

}
let stack=new Stack();
console.log(stack.isEmpty());
stack.push(10); 
stack.push(20);
stack.push(30);
console.log(stack.printStack());
console.log(stack.peek());
console.log(stack.pop());
console.log(stack.printStack());


    