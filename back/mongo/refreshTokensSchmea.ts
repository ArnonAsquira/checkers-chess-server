import mongoose from "mongoose";

const RefreshTokenScema = new mongoose.Schema({
  token: String,
});

export const RefreshTokens = mongoose.model("refreshtoken", RefreshTokenScema);
