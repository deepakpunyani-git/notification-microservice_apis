import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log(" connected");
  } catch (error) {
    console.error(" connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
