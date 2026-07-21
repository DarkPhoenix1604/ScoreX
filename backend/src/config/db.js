// Import Mongoose for MongoDB interaction
import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 * The connection string is retrieved from the environment variables.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log a success message if the connection is established
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log an error message and exit the process if the connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the function to be used in other parts of the application
export default connectDB;
