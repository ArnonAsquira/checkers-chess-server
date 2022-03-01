import mongoose from "mongoose";
import { User } from "../../mongo/userSchema";
const ObjectId = mongoose.Types.ObjectId;

const updateCustomization = async (
  newBackground: string,
  newLogo: string,
  userId: string
) => {
  await User.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        "styleCustomization.background": newBackground,
        "styleCustomization.logo": newLogo,
      },
    }
  );
};

const retrieveCustomizationData = async (userId: string) => {
  const userData = await User.findOne(
    { _id: new ObjectId(userId) },
    { styleCustomization: 1, _id: 0 }
  );
  return userData;
};

export { updateCustomization, retrieveCustomizationData };
