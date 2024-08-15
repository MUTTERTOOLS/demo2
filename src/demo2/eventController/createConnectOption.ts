import { Ref } from "vue";
import { createAuxiliaryWithPoints } from "../factory";
import { drawAuxiliary } from "../hooks/useAuxiliary";
import { EventControllerOption } from "./index";
import { selectedIntersections } from "../state";
const createConnectOption: () => EventControllerOption = () => {
  return {
    intersection: {
      click: (e: Event, point: Point) => {
        if (selectedIntersections.value.includes(point)) {
          selectedIntersections.value = [];
          return;
        }

        selectedIntersections.value.push(point);

        if (selectedIntersections.value.length === 2) {
          const auxiliary = createAuxiliaryWithPoints(
            // @ts-ignore
            ...selectedIntersections.value
          );
          drawAuxiliary(auxiliary);
          selectedIntersections.value = [];
        }
      },
    },
  };
};

export default createConnectOption;
