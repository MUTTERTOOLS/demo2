import { EventControllerOption } from "./index";
import { faceData } from "../state";
const createFaceOption: () => EventControllerOption = () => {
  return {
    intersection: {
      click: (e: Event, point: Point) => {
        faceData.value.add(point);
      },
    },
  };
};

export default createFaceOption;
