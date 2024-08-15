import { EventControllerOption } from "./index";
const createDrawCircleOption: () => EventControllerOption = () => ({
  intersection: {
    click() {
      console.log(arguments);
    }
  }
} )

export default createDrawCircleOption