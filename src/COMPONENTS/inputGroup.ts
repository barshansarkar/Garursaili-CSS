import { ComponentBase } from "../components";
import {
  borderColorLight,
  inputBase,
  mergeStyles,
  radiusMd,
  radiusSm,
  shadowSm,
  surfaceAltLight,
} from "../CORECONST";
export const inputGroups: Record<string, ComponentBase> = {

inputGroup: {
  base: {
    display: "flex",
    borderRadius: radiusSm,
    overflow: "hidden",
    boxShadow: shadowSm,
  },
},

inputGroupPrepend: {
  base: {
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    background: surfaceAltLight,
    border: `1px solid ${borderColorLight}`,
    borderRight: "none",
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: "0.875rem",
  },
},

inputGroupAppend: {
  base: {
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    background: surfaceAltLight,
    border: `1px solid ${borderColorLight}`,
    borderLeft: "none",
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: "0.875rem",
  },
},

inputGroupText: {
  base: {
    padding: "0.75rem 1rem",
    background: surfaceAltLight,
    border: `1px solid ${borderColorLight}`,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
  },
},

};