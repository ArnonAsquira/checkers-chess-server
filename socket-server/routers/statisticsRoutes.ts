import express from "express";
import { authenticateToken } from "../middlewares/validateSchema";
import { User } from "../mongo/userSchema";
import mongoose from "mongoose";
const router = express();
const ObjectId = mongoose.Types.ObjectId;

router.get("/", authenticateToken, async (req, res) => {
  const user = res.locals.user;

  const statistics = await User.findOne(
    { _id: new ObjectId(user._id) },
    { checkersData: 1 }
  );
  return res.send(statistics);
});

export default router;
