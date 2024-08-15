import { createAuxiliaryWithAngle } from "../factory";
import { drawAuxiliary } from "../hooks/useAuxiliary";
import { EventControllerOption } from "./index";
const createAngleOption: () => EventControllerOption = () => {
  return {
    intersection: {
      click: (e: Event, point: Point) => {
        const degree = Number(prompt("请输入角度"));

        const auxiliary = createAuxiliaryWithAngle(point, degree);
        drawAuxiliary(auxiliary);
      },
    },
  };
};

export default createAngleOption;
