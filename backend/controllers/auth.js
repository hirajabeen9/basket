import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

// PATH     : /api/auth/login
// METHOD   : POST
// ACCESS   : Public
// DESC     : Login user
// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     res.statusCode = 404;
//     throw new Error('Email or password is incorrect.');
//   }

//   if (!(await user.isPasswordValid(password))) {
//     res.statusCode = 400;
//     throw new Error('Email or password is incorrect.');
//   }

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//     token: user.generateToken(),
//   });
// });
// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     console.error('User not found for email:', email);
//     res.statusCode = 404;
//     throw new Error('Email or password is incorrect.');
//   }

//   const isPasswordValid = await user.isPasswordValid(password);

//   if (!isPasswordValid) {
//     console.error('Password is not valid for user:', email);
//     res.statusCode = 400;
//     throw new Error('Email or password is incorrect...........');
//   }

//   console.log('User logged in:', email);

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//     token: user.generateToken(),
//   });
// });


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // const user = await User.findOne({ email });
  const user = await User.findOne({ email: { $regex: new RegExp("^" + email, "i") } });
  console.log('User Password (entered by user):', password);
  console.log('User Password (hashed in the database):', user.password);
  
  if (!user) {
    console.error('User not found for email:', email);
    res.statusCode = 404;
    throw new Error('Email or password is incorrect.');
  }

  const isPasswordValid = await user.isPasswordValid(password); // Use the same password validation logic as in the updatePassword API

  if (!isPasswordValid) {
    console.error('Password is not valid for user:', email);
    res.statusCode = 400;
    throw new Error('Email or password is incorrect.');
  }

  console.log('User logged in:', email);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: user.generateToken(),
  });
});



// PATH     : /api/auth/register
// METHOD   : POST
// ACCESS   : Public
// DESC     : Register new user
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
  });
  const createdUser = await user.save();

  res.json({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    token: createdUser.generateToken(),
  });
});




