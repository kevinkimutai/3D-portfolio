"use client";

import { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

const box = new THREE.Box3();
const tmpBox = new THREE.Box3();
const center = new THREE.Vector3();

// Union every mesh's bind-pose geometry bounding box, transformed by the
// node's matrixWorld. The astronaut rig is entirely SkinnedMeshes, and its
// bind-pose vertex data lives in sensible local space, so the bounds it
// yields are trustworthy for the scale fit and recentering.
function computeRigidBounds(root: THREE.Object3D, target: THREE.Box3) {
  target.makeEmpty();
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.geometry) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    tmpBox.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld);
    target.union(tmpBox);
  });
  return target;
}

function AstronautModel() {
  const { scene, animations } = useGLTF("/walking_astronaut.glb");
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // SkeletonUtils.clone (not scene.clone) so the cloned SkinnedMeshes are
  // rebound to the cloned skeleton — otherwise the mixer animates the clone's
  // bones while the mesh stays stuck in its original bind pose (T-pose).
  const cloned = useMemo(() => cloneSkeleton(scene), [scene]);
  const { actions, names } = useAnimations(animations, cloned);

  // The GLB uses the KHR_materials_pbrSpecularGlossiness extension, which
  // three r150+ dropped, so its diffuse textures never load and the model
  // renders as a blank default material. Load the extracted textures by hand
  // and rebuild standard PBR materials. Albedo/normal are what read visually;
  // the spec-gloss and AO maps are skipped (no second UV set for AO anyway).
  const loaded = useTexture([
    "/textures/gltf_embedded_0.png", // material 0 diffuse (body)
    "/textures/gltf_embedded_2.png", // material 0 normal
    "/textures/gltf_embedded_4.png", // material 2 diffuse (gear)
    "/textures/gltf_embedded_6.png", // material 2 normal
  ]);
  // Clone before configuring: useTexture caches and shares the returned
  // objects, so mutate copies instead. Indices 0 and 2 are color (sRGB); the
  // normal maps stay linear. glTF UVs assume flipY=false (TextureLoader
  // defaults to true).
  const [bodyMap, bodyNormal, gearMap, gearNormal] = useMemo(
    () =>
      loaded.map((src, i) => {
        const t = src.clone();
        t.flipY = false;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.colorSpace = i % 2 === 0 ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        t.needsUpdate = true;
        return t;
      }),
    [loaded]
  );

  useEffect(() => {
    const clip = names.includes("wave") ? "wave" : names[0];
    if (clip && actions[clip]) {
      actions[clip].reset().play();
    }
  }, [actions, names]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    // Rebuild PBR materials from the hand-loaded textures. The three meshes
    // are told apart by vertex count (their nodes are unnamed): the body is
    // ~110k verts, the gear ~58k, and an 8-vert dark-grey part (material 1,
    // diffuseFactor ~0.133 in linear space).
    const bodyMat = new THREE.MeshStandardMaterial({
      map: bodyMap,
      normalMap: bodyNormal,
      metalness: 0,
      roughness: 0.75,
    });
    const gearMat = new THREE.MeshStandardMaterial({
      map: gearMap,
      normalMap: gearNormal,
      metalness: 0,
      roughness: 0.75,
    });
    const greyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.133, 0.133, 0.133),
      metalness: 0,
      roughness: 1,
    });
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const count = mesh.geometry.attributes.position.count;
      mesh.material = count > 80000 ? bodyMat : count < 100 ? greyMat : gearMat;
    });

    // Reset to identity first so this stays idempotent: computeRigidBounds
    // reads matrixWorld, which already includes any scale/position set on a
    // previous run of this effect (it runs twice under StrictMode). Without
    // the reset, run 2 would measure the already-fitted size and rescale it
    // down — the "big on load, then shrinks" bug.
    meshRef.current.scale.setScalar(1);
    meshRef.current.position.set(0, 0, 0);

    // Fit by height, not the widest dimension: in the rest pose the arms and
    // gear stretch wide, so a maxDim fit would spend the size budget on width
    // and leave the astronaut looking short. Targeting height gives intuitive,
    // predictable vertical presence. The camera's visible height at its
    // distance is ~5 units, so ~4.5 fills the frame with a little margin.
    computeRigidBounds(meshRef.current, box);
    const height = box.getSize(new THREE.Vector3()).y;

    if (height > 0) {
      meshRef.current.scale.setScalar(4.5 / height);
    }

    computeRigidBounds(meshRef.current, box).getCenter(center);
    meshRef.current.position.sub(center);
  }, [cloned, bodyMap, bodyNormal, gearMap, gearNormal]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // The wave animation is stationary, so centering is done once at mount.
    // Gentle sway instead of a full spin, so the astronaut stays at a
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

useGLTF.preload("/walking_astronaut.glb");

export default function StackScene() {
  return (
    <Canvas
      camera={{ position: [-1, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={2.0} />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} />
      <AstronautModel />
    </Canvas>
  );
}
