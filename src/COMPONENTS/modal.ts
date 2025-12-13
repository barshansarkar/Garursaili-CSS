import { ComponentBase } from "../components";
import {modalBase, mergeStyles,textLight,surfaceDark,borderColorDark} from "../CORECONST"
export const Modal: Record<string, ComponentBase> = {
      modal: {
        base: modalBase,
      },
      modalDark: {
        base: mergeStyles(modalBase, {
          background: surfaceDark,
          color: textLight,
          border: `1px solid ${borderColorDark}`,
        }, 'dark'),
      },
      modalLg: {
        base: mergeStyles(modalBase, {
          "max-width": "600px",
          padding: "2rem",
        }),
      },
      modalLgDark: {
        base: mergeStyles(mergeStyles(modalBase, {
          "max-width": "600px",
          padding: "2rem",
        }), {}, 'dark'),
      },
}