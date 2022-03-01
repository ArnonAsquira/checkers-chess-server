import express from "express";
import { authenticateToken } from "../middlewares/validateSchema";
import {
  retrieveCustomizationData,
  updateCustomization,
} from "./utils/customizationUtils";
const router = express();

router.get("/", authenticateToken, async (req, res) => {
  const userId = res.locals.user._id;
  const data = await retrieveCustomizationData(userId);
  return res.send(data);
});

router.post("/set", authenticateToken, async (req, res) => {
  const body = req.body;
  if (!body.background || !body.logo) {
    return res.status(403).send("bad request");
  }
  try {
    await updateCustomization(body.background, body.logo, res.locals.user._id);
    return res.send("updated");
  } catch (err) {
    console.log(err);
    return res.status(500).send("internal errir has occured");
  }
});

export default router;
