class Car {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}


let myCar1 = new Car("Ford", 2014);
let myCar2 = new Car("Audi", 2019);

// Class Methods
// Class methods are created with the same syntax as object methods.

// Use the keyword class to create a class.

// Always add a constructor() method.

// Then add any number of methods.

// Syntax
class ClassName {
//   constructor() { ... }
//   method_1() { ... }
//   method_2() { ... }
//   method_3() { ... }
}
// Create a Class method named "age", that returns the Car age:

Example
class Car {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  age() {
    let date = new Date();
    return date.getFullYear() - this.year;
  }
}

let myCar = new Car("Ford", 2014);
document.getElementById("demo").innerHTML =
"My car is " + myCar.age() + " years old.";

// You can send parameters to Class methods:

Example
class Car {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  age(x) {
    return x - this.year;
  }
}

let date = new Date();
let year = date.getFullYear();

let myCar = new Car("Ford", 2014);
document.getElementById("demo").innerHTML=
"My car is " + myCar.age(year) + " years old.";


