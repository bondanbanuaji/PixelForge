import { Variants } from "framer-motion";

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
    }
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] // Apple-style ease
        }
    },
    exit: {
        opacity: 0,
        y: -30,
        transition: { duration: 0.4, ease: "easeIn" }
    }
};

export const slideDown: Variants = {
    hidden: { opacity: 0, y: -30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
        }
    },
    exit: {
        opacity: 0,
        y: 30,
        transition: { duration: 0.4, ease: "easeIn" }
    }
};

export const staggerContainer: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerContainerFast: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0
        }
    }
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3 }
    }
};

export const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    }
};

export const slideInFromRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "circOut"
        }
    }
};

export const slideInFromLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "circOut"
        }
    }
};
