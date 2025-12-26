'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Geometries = React.memo(() => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh position={[-3, 1, -2]}>
                    <octahedronGeometry args={[1.2, 0]} />
                    <meshStandardMaterial
                        color="#6366f1"
                        wireframe
                        transparent
                        opacity={0.2}
                        emissive="#6366f1"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>

            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.4}>
                <mesh position={[3, -1, -3]}>
                    <icosahedronGeometry args={[1.8, 0]} />
                    <meshStandardMaterial
                        color="#a855f7"
                        wireframe
                        transparent
                        opacity={0.15}
                        emissive="#a855f7"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>

            <Float speed={2} rotationIntensity={0.6} floatIntensity={0.3}>
                <mesh position={[0, 4, -5]}>
                    <torusGeometry args={[0.6, 0.15, 12, 64]} />
                    <meshStandardMaterial
                        color="#06b6d4"
                        transparent
                        opacity={0.4}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </mesh>
            </Float>
        </group>
    );
});

Geometries.displayName = 'Geometries';

export const ThreeDBackground = React.memo(() => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{
                    antialias: false, // Turn off antialias for performance
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
                dpr={[1, 1.5]} // Limit pixel ratio to max 1.5 for performance
            >
                <fog attach="fog" args={['#000', 5, 25]} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#6366f1" />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />

                <Stars
                    radius={100}
                    depth={40}
                    count={2000} // Reduced count from 5000
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.5}
                />
                <Geometries />
            </Canvas>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
    );
});

ThreeDBackground.displayName = 'ThreeDBackground';

