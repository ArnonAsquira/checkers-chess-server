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
      wins: [
        {
          id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          date: Date,
        },
      ],
      loses: [
        {
          id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          date: Date,
        },
      ],
    },
    default: {
      wins: [],
      loses: [],
    },
  },
  styleCustomization: {
    background: String,
    logo: String,
  },
});

export const User = mongoose.model("user", UserScema, "users");
