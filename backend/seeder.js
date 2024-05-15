import User from './models/user.js';
import Product from './models/product.js';

import users from './data/users.js';
import products from './data/products.js';

import dotenv from 'dotenv';
import ConnectDb from './config/db.js';

dotenv.config();
ConnectDb();

const SeedData = async () => {
  try {
    let addedUsers = await User.insertMany(users);
    let adminUser = addedUsers[0];

    let updatedProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser._id,
      };
    });

    await Product.insertMany(updatedProducts);

    console.log('Data Seeded.');
    process.exit();
  } catch (error) {
    console.error(`Unable to seed data : ${error.message}`);
    process.exit(1);
  }
};

const DeleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Data Deleted.');
    process.exit();
  } catch (error) {
    console.error(`Unable to delete data : ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  DeleteData();
} else {
  SeedData();
}
