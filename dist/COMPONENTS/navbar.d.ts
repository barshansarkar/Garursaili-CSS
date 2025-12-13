export declare const navbar: {
    navbar: {
        base: {
            position: string;
            top: string;
            left: string;
            width: string;
            zIndex: string;
            background: string;
            boxShadow: string;
            backdropFilter: string;
            transition: string;
            "&.scrolled": {
                background: string;
                boxShadow: string;
            };
        };
        dark: {
            background: string;
            boxShadow: string;
            "&.scrolled": {
                background: string;
                boxShadow: string;
            };
        };
    };
    navContainer: {
        base: {
            display: string;
            justifyContent: string;
            alignItems: string;
            margin: string;
            maxWidth: string;
            height: string;
            padding: string;
            "@media (min-width: 640px)": {
                height: string;
                padding: string;
            };
            "@media (min-width: 1025px)": {
                height: string;
                padding: string;
            };
        };
    };
    navBrand: {
        base: {
            fontSize: string;
            fontWeight: string;
            background: string;
            backgroundClip: string;
            WebkitBackgroundClip: string;
            WebkitTextFillColor: string;
            textDecoration: string;
            transition: string;
            "&:hover": {
                opacity: string;
                transform: string;
            };
            "@media (min-width: 640px)": {
                fontSize: string;
            };
            "@media (max-width: 768px)": {
                fontSize: string;
            };
        };
    };
    navLinks: {
        base: {
            display: string;
            gap: string;
            alignItems: string;
            listStyle: string;
            "@media (max-width: 1024px)": {
                display: string;
            };
        };
    };
    navLink: {
        base: {
            color: string;
            fontWeight: string;
            textDecoration: string;
            padding: string;
            position: string;
            transition: string;
            "&.active": {
                color: string;
                "&::after": {
                    width: string;
                };
            };
            dark: {
                color: string;
                "&.active": {
                    color: string;
                };
            };
            "&::after": {
                content: string;
                position: string;
                bottom: string;
                left: string;
                width: string;
                height: string;
                background: string;
                transform: string;
                transition: string;
            };
            "&:hover": {
                color: string;
                dark: {
                    color: string;
                };
                "&::after": {
                    width: string;
                };
            };
        };
    };
    menuButton: {
        base: {
            display: string;
            flexDirection: string;
            justifyContent: string;
            alignItems: string;
            width: string;
            height: string;
            background: string;
            border: string;
            cursor: string;
            padding: string;
            borderRadius: string;
            transition: string;
            position: string;
            zIndex: string;
            color: string;
            dark: {
                color: string;
            };
            "&:hover": {
                background: string;
                dark: {
                    background: string;
                };
            };
            "@media (max-width: 1024px)": {
                display: string;
            };
            "& .bar": {
                display: string;
                width: string;
                height: string;
                background: string;
                margin: string;
                transition: string;
                borderRadius: string;
            };
        };
        active: {
            "& .bar:nth-child(1)": {
                transform: string;
            };
            "& .bar:nth-child(2)": {
                opacity: string;
                transform: string;
            };
            "& .bar:nth-child(3)": {
                transform: string;
            };
        };
    };
    mobileMenu: {
        base: {
            position: string;
            top: string;
            left: string;
            right: string;
            background: string;
            backdropFilter: string;
            borderTop: string;
            padding: string;
            transform: string;
            opacity: string;
            visibility: string;
            transition: string;
            zIndex: string;
            maxHeight: string;
            overflowY: string;
            "&::before": {
                content: string;
                position: string;
                top: string;
                left: string;
                right: string;
                bottom: string;
                background: string;
                opacity: string;
                visibility: string;
                zIndex: string;
                transition: string;
            };
            "@media (min-width: 1025px)": {
                display: string;
            };
            "@media (max-width: 768px)": {
                top: string;
                maxHeight: string;
                padding: string;
            };
        };
        mobileMenuOpen: {
            transform: string;
            opacity: string;
            visibility: string;
            "&::before": {
                opacity: string;
                visibility: string;
            };
        };
        dark: {
            background: string;
            borderTop: string;
            "&::before": {
                background: string;
            };
        };
    };
    mobileMenuItem: {
        base: {
            display: string;
            alignItems: string;
            gap: string;
            padding: string;
            fontSize: string;
            fontWeight: string;
            color: string;
            textDecoration: string;
            borderBottom: string;
            transition: string;
            position: string;
            overflow: string;
            "&:last-child": {
                borderBottom: string;
            };
            "&:hover": {
                color: string;
                paddingLeft: string;
                background: string;
                dark: {
                    color: string;
                    background: string;
                };
                "&::before": {
                    transform: string;
                };
            };
            "&::before": {
                content: string;
                position: string;
                left: string;
                top: string;
                bottom: string;
                width: string;
                background: string;
                transform: string;
                transition: string;
            };
            "@media (max-width: 640px)": {
                fontSize: string;
                padding: string;
            };
        };
        dark: {
            color: string;
            borderBottom: string;
            "&:hover": {
                background: string;
            };
        };
    };
    themeToggle: {
        base: {
            background: string;
            border: string;
            color: string;
            cursor: string;
            padding: string;
            borderRadius: string;
            transition: string;
            display: string;
            alignItems: string;
            gap: string;
            fontSize: string;
            fontWeight: string;
            "&:hover": {
                background: string;
                dark: {
                    background: string;
                };
                transform: string;
            };
            "& .icon": {
                transition: string;
            };
            "&.dark .icon": {
                transform: string;
            };
        };
        dark: {
            color: string;
            "&:hover": {
                background: string;
            };
        };
    };
    darkToggle: {
        base: {
            position: string;
            top: string;
            right: string;
            zIndex: string;
            padding: string;
            background: string;
            color: string;
            border: string;
            borderRadius: string;
            cursor: string;
            fontSize: string;
            transition: string;
            "&:hover": {
                transform: string;
                boxShadow: string;
            };
            "&:focus": {
                outline: string;
                boxShadow: string;
            };
        };
    };
    darkToggleLight: {
        base: {
            position: string;
            top: string;
            right: string;
            zIndex: string;
            padding: string;
            background: string;
            color: string;
            border: string;
            borderRadius: string;
            cursor: string;
            fontSize: string;
            transition: string;
            "&:hover": {
                transform: string;
                boxShadow: string;
            };
            "&:focus": {
                outline: string;
                boxShadow: string;
            };
        };
    };
};
