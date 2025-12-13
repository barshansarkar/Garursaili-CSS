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
