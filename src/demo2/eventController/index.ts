import type { MaybeRefOrGetter } from "@vueuse/core";
import { useEventListener } from "@vueuse/core";
import { computed, ref } from "vue";
import createDrawCircleOption from "./createDrawCircleOption";
import createDefaultOption from "./createDefaultOption";
import createConnectOption from "./createConnectOption";
import createAngleOption from "./createAngleOption";
import createFaceOption from "./createFaceOption";
type ControllerKey = "auxiliary" | "intersection";

type DocumentEventName = keyof DocumentEventMap;

type EventControllerValue = Partial<
  Record<DocumentEventName, (...args: any) => any>
>;

type EventParams = Partial<Record<DocumentEventName, any[]>>;

export type EventControllerOption = Partial<
  Record<ControllerKey, EventControllerValue>
>;

function useEventController<T extends EventControllerOption>(
  eventControllerOption: T
) {
  return {
    bindEvents,
  };

  function bindEvents(
    el: MaybeRefOrGetter<HTMLElement | undefined | null>,
    key: keyof T,
    params: EventParams
  ) {
    const stopFns: Function[] = [];
    const option = eventControllerOption[key] ?? {};
    for (let eventName of Object.keys(option)) {
      const stop = useEventListener(el, eventName, wrapFn(eventName));
      stopFns.push(stop);
    }

    return function clearEventBind() {
      stopFns.forEach((fn) => fn());
    };

    function wrapFn(eventName: string) {
      const fn = option[eventName];
      const args = params[eventName] || [];
      return function (event: any) {
        fn(event, ...args);
      };
    }
  }
}

export const eventControllerOption = ref<EventControllerOption>({});

export const eventController = computed(() =>
  useEventController(eventControllerOption.value)
);

export function setEventController(option: EventControllerOption) {
  eventControllerOption.value = option;
}

export const OperationMap = {
  default: createDefaultOption,
  drawHorizontalAuxi: createDefaultOption,
  drawVerticalAuxi: createDefaultOption,
  drawCircle: createDrawCircleOption,
  connect: createConnectOption,
  angle: createAngleOption,
  face: createFaceOption,
};

export function setEvent(operation: keyof typeof OperationMap) {
  const createOption = OperationMap[operation];
  setEventController(createOption());
}
