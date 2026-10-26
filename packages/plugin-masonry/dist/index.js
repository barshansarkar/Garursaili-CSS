export default {
    name: "@garursaili/plugin-masonry",
    version: "1.0.0",
    setup(api) {
        api.addUtilities({
            "masonry-2": { columnCount: "2", columnGap: "1rem", "& > *": { breakInside: "avoid", marginBottom: "1rem" } },
            "masonry-3": { columnCount: "3", columnGap: "1rem", "& > *": { breakInside: "avoid", marginBottom: "1rem" } },
            "masonry-4": { columnCount: "4", columnGap: "1rem", "& > *": { breakInside: "avoid", marginBottom: "1rem" } },
            "masonry-auto": { columns: "16rem", columnGap: "1rem", "& > *": { breakInside: "avoid", marginBottom: "1rem" } },
            "masonry-sm": { columns: "12rem", columnGap: "0.75rem", "& > *": { breakInside: "avoid", marginBottom: "0.75rem" } },
            "masonry-lg": { columns: "24rem", columnGap: "1.5rem", "& > *": { breakInside: "avoid", marginBottom: "1.5rem" } },
        });
    },
};
