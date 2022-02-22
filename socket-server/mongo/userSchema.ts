import mongoose from "mongoose";

const UserScema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  checkersData: {
    type: {
      wins: [{ id: String, date: Date }],
      loses: [{ id: String, date: Date }],
    },
    default: {
      wins: [],
      loses: [],
    },
  },
});

export const User = mongoose.model("user", UserScema, "users");
