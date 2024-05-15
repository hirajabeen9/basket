import bcrypt from 'bcryptjs';
let users = [
  {
    name: 'Ahmad',
    email: 'ahmad@yopmail.com',
    password: bcrypt.hashSync('Qwe123@', 10),
    isAdmin: true,
  },
  {
    name: 'Ali',
    email: 'ali@yopmail.com',
    password: bcrypt.hashSync('Qwe123@', 10),
    isAdmin: false,

  },
];

export default users;
