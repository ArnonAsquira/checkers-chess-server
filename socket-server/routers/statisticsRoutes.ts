import express from "express";
import { authenticateToken } from "../middlewares/validateSchema";
import { User } from "../mongo/userSchema";
import mongoose from "mongoose";
const router = express();
const ObjectId = mongoose.Types.ObjectId;

router.get("/", authenticateToken, async (req, res) => {
  const user = res.locals.user;
  try {
    const statistics = await User.findOne(
      { _id: new ObjectId(user._id) },
      { checkersData: 1 }
    )
      .populate("checkersData.wins.id", "userName")
      .populate("checkersData.loses.id", "userName");
    return res.send(statistics);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

export default router;
