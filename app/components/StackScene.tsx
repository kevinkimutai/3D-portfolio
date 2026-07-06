"use client";

import { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const box = new THREE.Box3();
const tmpBox = new THREE.Box3();
const center = new THREE.Vector3();

// A handful of meshes in this rig (hair/eye blink controls) are real
// SkinnedMeshes: their POSITION attribute is raw bind-pose vertex data
// in an arbitrary local space, not world space, since the actual
// deformation happens via joint matrices on the GPU. Box3.setFromObject
// doesn't know this and naively transforms those raw vertices by the
// node's matrixWorld, producing a bogus box hundreds of units away that
// wrecks the scale fit and recentering. Compute the box ourselves,
// skipping SkinnedMeshes (they still render correctly, just can't be
// trusted for bounds).
function computeRigidBounds(root: THREE.Object3D, target: THREE.Box3) {
  target.makeEmpty();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    if ((obj as THREE.SkinnedMesh).isSkinnedMesh) return;
    const mesh = obj as THREE.Mesh;
    if (!mesh.geometry) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    tmpBox.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld);
    target.union(tmpBox);
  });
  return target;
}

function RunCycleModel() {
  const { scene, animations } = useGLTF("/stewart_run_cycles.glb");
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const cloned = useMemo(() => scene.clone(true), [scene]);
  const { actions, names } = useAnimations(animations, cloned);

  useEffect(() => {
    const first = names[0];
    if (first && actions[first]) {
      actions[first].reset().play();
    }
  }, [actions, names]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    // The ground-plane mesh baked into the GLB is scaled to ~the same size
    // as the character, which throws off the bounding-box fit and clutters
    // the wireframe. Drop it.
    cloned.traverse((child) => {
      if (child.name.startsWith("pPlane1")) {
        child.removeFromParent();
      } else if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: "#00d4ff",
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        });
      }
    });

    computeRigidBounds(meshRef.current, box);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      meshRef.current.scale.setScalar(5.0 / maxDim);
    }

    computeRigidBounds(meshRef.current, box).getCenter(center);
    meshRef.current.position.sub(center);
  }, [cloned]);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // The run-cycle pose shifts the silhouette's center as it animates, so
    // re-center horizontally every frame instead of once at mount. Measured
    // with the group's rotation zeroed out so the spin doesn't skew it, and
    // vertical (Y) is left alone to preserve the natural running bob.
    const savedRotY = groupRef.current.rotation.y;
    groupRef.current.rotation.y = 0;
    groupRef.current.updateMatrixWorld(true);

    computeRigidBounds(meshRef.current, box).getCenter(center);
    meshRef.current.position.x -= center.x;
    meshRef.current.position.z -= center.z;

    groupRef.current.rotation.y = savedRotY;

    // Gentle sway instead of a full spin, so the runner stays at a
    // readable 3/4-front angle and never goes edge-on to the camera.
    // Base yaw turns him off dead-center so he isn't staring at the viewer.
    timeRef.current += delta;
    groupRef.current.rotation.y = 0.18 + Math.sin(timeRef.current * 0.4) * (Math.PI / 8);
  });

  return (
    <group ref={groupRef}>
      <primitive ref={meshRef} object={cloned} />
    </group>
  );
}

useGLTF.preload("/stewart_run_cycles.glb");

export default function StackScene() {
  return (
    <Canvas
      camera={{ position: [-1, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <RunCycleModel />
    </Canvas>
  );
}
