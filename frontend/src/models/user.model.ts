import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || mongoose.model<IUser>("User", userSchema, "users");

export default User;
