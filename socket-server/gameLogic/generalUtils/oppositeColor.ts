import { PlatyerColors } from "../../types/gameTypes";

import { colorOne, colorTwo } from "../constants";

const oppositeColor = (color: PlatyerColors): PlatyerColors =>
  color === colorOne ? colorTwo : colorOne;

export default oppositeColor;
