'use client';

import { useEffect } from 'react';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        (async () => {
            const LocomotiveScroll = (await import('locomotive-scroll')).default;
            const locomotiveScroll = new LocomotiveScroll({
                lenisOptions: {
                    lerp: 0.1,
                    duration: 1.2,
                    orientation: 'vertical',
                    gestureOrientation: 'vertical',
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 2,
                }
            });
        })();
    }, []);

    return <>{children}</>;
};
