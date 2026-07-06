"use client";

import { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const box = new THREE.Box3();
const center = new THREE.Vector3();

function BeeModel() {
  const { scene, animations } = useGLTF("/Bee_fbx.glb");
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);

  const cloned = useMemo(() => scene.clone(true), [scene]);
  const { actions, names } = useAnimations(animations, cloned);
  const timeRef = useRef(0);

  useEffect(() => {
    const hover = names.find((n) => n.toLowerCase().includes("hover")) ?? names[0];
    if (hover && actions[hover]) {
      actions[hover].reset().play();
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

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: "#00d4ff",
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        });
      }
    });

    // Rest pose has the bee facing +Z (straight at the camera), which reads
    // as a face-on blob. Yaw it so the head points screen-left, then pitch
    // it slightly so we look down on it a bit, showing the back/wings —
    // a 3/4 hero-shot angle instead of a flat front or side view.
    meshRef.current.rotation.order = "YXZ";
    meshRef.current.rotation.y = Math.PI / 2;
    meshRef.current.rotation.x = 0.3;
    console.log(
      "[DEBUG] matrixAutoUpdate:", meshRef.current.matrixAutoUpdate,
      "matrix before update:", meshRef.current.matrix.elements.slice(0, 4)
    );
    meshRef.current.updateMatrixWorld(true);
    console.log(
      "[DEBUG] matrix after update:", meshRef.current.matrix.elements.slice(0, 4),
      "matrixWorld:", meshRef.current.matrixWorld.elements.slice(0, 4)
    );

    box.setFromObject(meshRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      meshRef.current.scale.setScalar(6.5 / maxDim);
    }

    box.setFromObject(meshRef.current).getCenter(center);
    meshRef.current.position.sub(center);
  }, [cloned]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Gentle sway around the hero angle instead of a full spin, so it stays
    // close to that 3/4 view rather than cycling back through the face-on
    // and edge-on angles most of the time.
    timeRef.current += delta;
    groupRef.current.rotation.y = Math.sin(timeRef.current * 0.4) * (Math.PI / 10);
  });

  return (
    <group ref={groupRef}>
      <primitive ref={meshRef} object={cloned} />
    </group>
  );
}

useGLTF.preload("/Bee_fbx.glb");

export default function BeeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <BeeModel />
    </Canvas>
  );
}
