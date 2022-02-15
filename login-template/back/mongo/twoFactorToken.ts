import mongoose from "mongoose";

const twoFactorTokenSchema = new mongoose.Schema({
  token: String,
  secret: String,
  userEmail: String,
});

export const TwoFactorToken = mongoose.model(
  "twoFactorToken ",
  twoFactorTokenSchema
);
