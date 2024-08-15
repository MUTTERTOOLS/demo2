import { ref } from "vue";

export const selectedIntersections = ref<Point[]>([]);

export const selectedAuxiliaries = ref<Auxiliary[]>([]);

export const faceData = ref<Set<Point>>(new Set());