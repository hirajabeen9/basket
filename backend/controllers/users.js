import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

// PATH     : /api/users/profile
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get logged in user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});
// PATH     : /api/users
// METHOD   : GET
// ACCESS   : Public
// DESC     : Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  let users = await User.find({});
  res.json(users);
});
// PATH     : /api/admin/users
// METHOD   : PUT
// ACCESS   : Private (only accessible to admin users)
// DESC     : Make a user an admin
export const makeUserAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if the authenticated user is an admin
  if (req.user.isAdmin) {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      // Update the user's isAdmin status
      user.isAdmin = !user.isAdmin;
      await user.save();


      res.json({
        message: 'User is now an admin',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(403).json({ message: 'Access denied. You are not authorized to make users admins.' });
  }
});


// Add a new route to get the total count of users
// PATH     : /api/users/count
// METHOD   : GET
// ACCESS   : Private Admin
// DESC     : Count All Users
export const getAllUsersCount = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({});
  res.json({ count: userCount });
});

// export const updatePassword=async(req,res) =>{
//   try {
//       const {email, newPassword} =req.body
//       if (!email) {
//           res.status(400).send({message:'Email is required'})
//       }
//       if (!newPassword) {
//           res.status(400).send({message:'New Password is required'})
//       }
//       //check
//   const user =await User.findOne({email})
//   //validation
//   if (!user) {
//       return res.status(404).send({
//           success:false,
//           message:'Wrong Email or Answer'
//       })
//   }
//   const hashed = await hashPassword(newPassword)
//   await User.findByIdAndUpdate(user._id, { password: hashed});
//   res.status(200).send({
//       success:true,
//       message:'Password Reset Successfully'
//   });

//   } catch (error) {
//       console.log(error);
//           res.status(500).send({
//               success:false,
//               message:'something went wrong',
//               error})
//   }
//   }


// Add this route for updating the password



export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // // Update the user's password
    // user.password = hashedPassword;
    // await user.save();
    // Update the user's password
    user.password = hashedPassword;

    console.log('Before user.save():', user);

    await user.save();

    console.log('After user.save():', user);

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong', error });
  }
};

