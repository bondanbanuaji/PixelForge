import { useState, useEffect, useRef, RefObject } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

// --- Mouse Position Hook ---
export const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return mousePosition;
};

// --- Smooth Progress Hook ---
export const useSmoothProgress = (value: number, duration = 1000) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startValue = displayValue;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = startValue + (value - startValue) * ease;
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

    return displayValue;
};

// --- 3D Tilt Hook ---
interface TiltOptions {
    max?: number;
    scale?: number;
    speed?: number;
}

export const useTilt = <T extends HTMLElement>(ref: RefObject<T | null>, options: TiltOptions = {}) => {
    const { max = 15, scale = 1.05, speed = 400 } = options;

    // Motion values for smooth animation
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics
    const rotateX = useSpring(useTransform(y, [0, 100], [max, -max]), { stiffness: speed, damping: 20 });
    const rotateY = useSpring(useTransform(x, [0, 100], [-max, max]), { stiffness: speed, damping: 20 });
    const scaleVal = useSpring(1, { stiffness: speed, damping: 20 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const xPct = (mouseX / width) * 100;
            const yPct = (mouseY / height) * 100;

            x.set(xPct);
            y.set(yPct);
            scaleVal.set(scale);
        };

        const handleMouseLeave = () => {
            x.set(50);
            y.set(50);
            scaleVal.set(1);
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        // Initial set to center
        x.set(50);
        y.set(50);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [ref, max, scale, speed, x, y, scaleVal]);

    return { rotateX, rotateY, scale: scaleVal };
};

// --- In View Hook (Simple wrapper around IntersectionObserver) ---
export const useInViewAnimation = (options = { threshold: 0.1, triggerOnce: true }) => {
    // Note: We use react-intersection-observer's useInView in components, 
    // but this custom one can handle specific logic if needed.
    // implementing a simple one for portability if library fails or for specific needs
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                if (options.triggerOnce) {
                    observer.disconnect();
                }
            } else if (!options.triggerOnce) {
                setIsInView(false);
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options.threshold, options.triggerOnce]);

    return { ref, isInView };
};
