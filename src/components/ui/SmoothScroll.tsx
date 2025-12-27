'use client';

import { useEffect, useRef } from 'react';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        let locomotiveScroll: any;

        (async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;

            locomotiveScroll = new LocomotiveScroll({
                el: scrollRef.current,
                smooth: true,
                lerp: 0.1,
                multiplier: 1,
                touchMultiplier: 2,
            });
        })();

        return () => {
            if (locomotiveScroll) {
                locomotiveScroll.destroy();
            }
        };
    }, []);

    return (
        <div ref={scrollRef} data-scroll-container>
            {children}
        </div>
    );
};
