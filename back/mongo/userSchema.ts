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
      wins: Array,
      loses: Array,
    },
    default: {
      wins: [],
      loses: [],
    },
  },
  chessData: {
    type: {
      wins: Array,
      loses: Array,
    },
    default: {
      wins: [],
      loses: [],
    },
  },
});

export const User = mongoose.model("user", UserScema);
