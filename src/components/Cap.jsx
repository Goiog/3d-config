import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { CanvasTexture } from "./ModelWrapper";

export function Cap(props) {
  const { nodes, materials } = useGLTF("/Cap.glb");
  return (
    <group {...props} dispose={null}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[20, -20, 0]} intensity={2} />
      <group
        name="Scene"
        scale={3} rotation={[Math.PI / 2,0,0]}
      >
        <mesh name="Plane"  geometry={nodes.Plane.geometry}           material={materials.Material}
          scale={0.025}
        />
        <mesh name="BaseballCap" geometry={nodes.BaseballCap.geometry} material={materials.Canvascapmaterial}
          scale={0.025} />
        <mesh name="PlaneCanvas"  geometry={nodes.PlaneCanvas.geometry}           material={materials.MaterialCanvas}
          scale={0.025}
          >  <CanvasTexture /> </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/Cap.glb");














