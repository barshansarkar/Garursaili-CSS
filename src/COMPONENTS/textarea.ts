import { ComponentBase } from "../components";
import { inputBase,mergeStyles } from "../CORECONST";

export const textarea: Record<string, ComponentBase> = {textarea: {
  base: mergeStyles(inputBase, {
    minHeight: "6rem",
    resize: "vertical",
    lineHeight: "1.5",
  }),
},

textareaSm: {
  base: mergeStyles(inputBase, {
    minHeight: "4rem",
    padding: "0.5rem 0.875rem",
    fontSize: "0.8125rem",
  }),
},}