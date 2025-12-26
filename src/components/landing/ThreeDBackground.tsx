'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Geometries = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[-2, 1, 0]}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color="#6366f1"
                        wireframe
                        transparent
                        opacity={0.3}
                        emissive="#6366f1"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </Float>

            <Float speed={1.5} rotationIntensity={0.7} floatIntensity={0.8}>
                <mesh position={[2, -1, -1]}>
                    <icosahedronGeometry args={[1.5, 0]} />
                    <meshStandardMaterial
                        color="#a855f7"
                        wireframe
                        transparent
                        opacity={0.2}
                        emissive="#a855f7"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </Float>

            <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
                <mesh position={[0, 3, -2]}>
                    <torusGeometry args={[0.5, 0.2, 16, 100]} />
                    <meshStandardMaterial
                        color="#06b6d4"
                        transparent
                        opacity={0.6}
                        roughness={0}
                        metalness={1}
                    />
                </mesh>
            </Float>
        </group>
    );
};

export const ThreeDBackground = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
                <fog attach="fog" args={['#000', 5, 20]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.0} color="#6366f1" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Geometries />
            </Canvas>

            {/* Gradient Overlay to blend with content */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
    );
};
