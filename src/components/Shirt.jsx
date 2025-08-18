import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { CanvasTexture } from "./ModelWrapper";

export function Shirt(props) {
  const { nodes, materials } = useGLTF("/tshirt.glb");
  return (
    <group {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[Math.PI / 2, Math.PI, Math.PI]}
          scale={-0.009}
        >
          <group name="root">
            <group name="GLTF_SceneRootNode">
              <group name="T_Shirt_exterieur_ext_0_0">
                <mesh
                  name="Object_4"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_4.geometry}
                  material={materials.material}
                >
                  <CanvasTexture />
                </mesh>
              </group>
              <group name="T_Shirt_int_int_0_1">
                <mesh
                  name="Object_6"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_6.geometry}
                  material={materials.material_1}
                >
                  <CanvasTexture />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/tshirt.glb");
