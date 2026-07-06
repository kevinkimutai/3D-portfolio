"use client";

import { useEffect } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";

type TorusKnotMeshProps = {
  meshRef: React.RefObject<THREE.Mesh | null>;
  onReady: () => void;
};

function TorusKnotMesh({ meshRef, onReady }: TorusKnotMeshProps) {
  // Runs after R3F commits the mesh — meshRef.current is guaranteed set here
  useEffect(() => {
    onReady();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x += delta * 0.07;
  });

  return (
    <mesh ref={meshRef} scale={0}>
      <torusKnotGeometry args={[1.4, 0.45, 200, 20, 2, 3]} />
      <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

type HeroSceneProps = {
  meshRef: React.RefObject<THREE.Mesh | null>;
  onReady: () => void;
};

export default function HeroScene({ meshRef, onReady }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <TorusKnotMesh meshRef={meshRef} onReady={onReady} />
    </Canvas>
  );
}
