import {AppError} from "../../lib/error/error.js";

export const userNotExist =
    new AppError('User Not Exists.', 404);// 404
export const userAlreadyExist =
    new AppError('User Already Exists.', 409);// 409
export const userAlreadyVerified =
    new AppError('User Already Verified.', 400);// 400
export const userNotVerified =
    new AppError('user Not Verified', 403);// 403


// Error{ message, cause, stack, name }
// Error.statusCode = 409
// Error{ message, cause, stack, name, statusCode:409 }
// JS >> allow ay7aga
// TS >> error >> statusCode in Error Object
// custom Class AppError >> Error & {statusCode}

//
// class User {
//     userName;
//     email;
//     password;
//
//
//     constructor(userName, email, password) {
//         this.userName = userName;
//         this.email = email;
//         this.password = password;
//     }
// }
//
// class Customer extends User {
//
//
//     phone;
//     age;
//     address;
//     isVerified;
//     isDeleted;
//
//     constructor(userName, email, password, phone, age, address) {
//         super(userName, email, password);
//         this.phone = phone;
//         this.age = age;
//         this.address = address;
//         this.isVerified = false;
//         this.isDeleted = false;
//     }
// }

// const customer1 = new Customer('ka3bora', 'k@g.com', '12345', '01024708090', 25, 'Helwan');
// const customer2 = new Customer('rabe3', 'r@g.com', '54321', '01024708091', 26, 'Maddi');
//
// console.log(customer1);
// console.log(customer2);
// call method >> constructor
// constructorMethod >> set values to properties