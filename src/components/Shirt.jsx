import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { CanvasTexture } from "./ModelWrapper";
import * as THREE from "three";

export function Shirt(props) {
  const { nodes, materials } = useGLTF("/tshirt.glb");

  // Force sRGB color space on diffuse maps
  Object.values(materials).forEach((mat) => {
    if (mat.map) {
      mat.map.colorSpace = THREE.SRGBColorSpace;
      mat.map.needsUpdate = true;
    }
  });

  return (
    <group {...props} dispose={null}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[20, -20, 0]} intensity={2} />

      <group
        name="Sketchfab_model"
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={[-0.95,-0.95,0.95]}
      >
        <mesh name="Object_4"  geometry={nodes.Object_4.geometry} material={materials.Tshirtmaterialinner} />
        <mesh name="Object_7"  geometry={nodes.Object_7.geometry} material={materials.Material_001} />
        <mesh name="Object_8"  geometry={nodes.Object_8.geometry} material={materials.Material_002} />
        <mesh name="Object_9"  geometry={nodes.Object_9.geometry} material={materials.Material_003} />
        <mesh name="Object_6"  geometry={nodes.Object_6.geometry} material={materials.Tshirtmaterialout} />
        <mesh name="Plane" geometry={nodes.Plane.geometry} material={materials.ShirtCanvas} >  <CanvasTexture /> </mesh>
      </group>
    </group>
  );
}
