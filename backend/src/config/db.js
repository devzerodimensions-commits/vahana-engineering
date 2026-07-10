import mongoose from "mongoose";

/**
 * Connects to MongoDB. Uses a short server-selection timeout and disables
 * command buffering so that, when the database is not running, queries fail
 * fast with a helpful message instead of hanging.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vihana_engineering";
  mongoose.set("bufferCommands", false);
  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(` MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`\n MongoDB connection failed: ${err.message}`);
    console.error(
      "   The API will keep running, but database routes will return errors until MongoDB is reachable."
    );
    console.error(
      "   Fix: start a local MongoDB (mongodb://127.0.0.1:27017) or set MONGO_URI to a MongoDB Atlas cluster in backend/.env\n"
    );
  }
};

export default connectDB;
