import mongoose from 'mongoose';
import colors from 'colors';

const ConnectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Connected with with database ${connection.connection.host}`.bgGreen
    );
  } catch (error) {
    console.error(
      `Unable to connect with database due to : ${error.message}`.bgRed
    );
    process.exit(1);
  }
};

export default ConnectDb;
