"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const box = new THREE.Box3();
const center = new THREE.Vector3();

function DanceModel() {
  const { scene, animations } = useGLTF("/dance__japanese_samurai_ninja_hat.glb");
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);

  // Render `scene` directly rather than scene.clone(true): naive Object3D
  // cloning doesn't rebind a SkinnedMesh's skeleton.bones to the cloned
  // bone instances, so the mixer animates bones the mesh never actually
  // reads from — it renders frozen in bind pose. Since this model is only
  // ever shown once, there's no need to clone at all.
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    const first = names[0];
    if (first && actions[first]) {
      actions[first].reset().play();
    }
  }, [actions, names]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    // React Strict Mode (dev) can invoke this effect more than once for the
    // same mount, so it must be idempotent: always measure from a known
    // baseline rather than from whatever scale/position a prior run left.
    meshRef.current.position.set(0, 0, 0);
    meshRef.current.scale.set(1, 1, 1);
    meshRef.current.rotation.set(0, 0, 0);

    // The GLB already carries a standard metallic-roughness material with its
    // base-color texture, so leave the materials as loaded (no wireframe
    // override) — they render textured, provided the scene has lighting.

    meshRef.current.updateMatrixWorld(true);

    box.setFromObject(meshRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      meshRef.current.scale.setScalar(9 / maxDim);
    }

    box.setFromObject(meshRef.current).getCenter(center);
    meshRef.current.position.sub(center);
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef}>
      <primitive ref={meshRef} object={scene} />
    </group>
  );
}

useGLTF.preload("/dance__japanese_samurai_ninja_hat.glb");

export default function DanceScene() {
  return (
    <Canvas
      camera={{ position: [-1, 0, 16], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 4]} intensity={3.5} />
      <directionalLight position={[-4, 2, -3]} intensity={1.5} />
      {/* Front fill aimed from the camera so the dark textures read against
          the dark background. */}
      <directionalLight position={[0, 1, 6]} intensity={1.5} />
      <DanceModel />
    </Canvas>
  );
}
