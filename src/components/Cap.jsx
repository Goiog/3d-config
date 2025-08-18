import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { CanvasTexture } from "./ModelWrapper";

export function Cap(props) {
  const { nodes, materials } = useGLTF("/Cap.glb");
  return (
    <group {...props} dispose={null}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <group
        name="Scene"
        rotation={[Math.PI / 1.8, -Math.PI / 5, Math.PI / 35]}
        scale={0.95}
      >
        <mesh name="Plane"  geometry={nodes.Plane.geometry}           material={materials.Material}
          rotation={[-0.039, -2.501, 0.102]}
          scale={0.029}
        />
        <mesh name="BaseballCap" geometry={nodes.BaseballCap.geometry} material={materials.Canvascapmaterial} rotation={[-0.039, -2.501, 0.102]}
          scale={0.025} />
        <mesh name="PlaneCanvas"  geometry={nodes.PlaneCanvas.geometry}           material={materials.Canvascapmaterial}
          rotation={[-0.039, -2.501, 0.102]}
          scale={0.025}>
          >  <CanvasTexture /> </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/Cap.glb");

