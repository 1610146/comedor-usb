import mongoose from "mongoose";

export default async function connectMongoDB() {
  try {
    const dbConneccionString = process.env.MONGODB_URI;
    if (!dbConneccionString) {
      throw new Error("No Mongodb String Provided");
    }
    await mongoose.connect(dbConneccionString);
    console.log("Connected to MONGODB");
  } catch (error) {
    console.log("Erro connecting to database: ", error);
  }
}
