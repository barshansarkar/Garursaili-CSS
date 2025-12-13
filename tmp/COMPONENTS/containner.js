export const Container = {
    container: {
        base: {
            width: "100%",
            margin: "0 auto",
            "max-width": "1000px",
            padding: "0 1rem",
            display: "block",
            "box-sizing": "border-box",
            "@media (min-width: 1025px)": {
                padding: "0 2rem",
            },
            "@media (max-width: 640px)": {
                padding: "0 0.75rem",
            },
        },
    },
    containerFluid: {
        base: {
            width: "100%",
            padding: "0 1rem",
            "box-sizing": "border-box",
            "@media (min-width: 1025px)": {
                padding: "0 2rem",
            },
            "@media (max-width: 640px)": {
                padding: "0 0.75rem",
            },
        },
    },
};
