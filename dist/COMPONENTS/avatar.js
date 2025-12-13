/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
import { avatarBase, mergeStyles, surfaceDark } from "../CORECONST";
export const avatar = {
    avatar: {
        base: avatarBase,
    },
    avatarDark: {
        base: mergeStyles(avatarBase, {
            border: `2px solid ${surfaceDark}`,
        }, 'dark'),
    },
    avatarSm: {
        base: mergeStyles(avatarBase, {
            width: "2rem",
            height: "2rem",
        }),
    },
    avatarSmDark: {
        base: mergeStyles(mergeStyles(avatarBase, {
            width: "2rem",
            height: "2rem",
        }), {}, 'dark'),
    },
    avatarLg: {
        base: mergeStyles(avatarBase, {
            width: "4rem",
            height: "4rem",
        }),
    },
    avatarLgDark: {
        base: mergeStyles(mergeStyles(avatarBase, {
            width: "4rem",
            height: "4rem",
        }), {}, 'dark'),
    },
    avatarXl: {
        base: mergeStyles(avatarBase, {
            width: "5.5rem",
            height: "5.5rem",
        }),
    },
    avatarXlDark: {
        base: mergeStyles(mergeStyles(avatarBase, {
            width: "5.5rem",
            height: "5.5rem",
        }), {}, 'dark'),
    },
};
