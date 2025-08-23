import React, { useContext, useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { CanvasTexture } from "./ModelWrapper";
import { ContextTool } from "./Mainstate(tool)/Mainstatetool";

export function Mug(props) {
  const { nodes, materials } = useGLTF("/Cap.glb");
  const { canvas } = useContext(ContextTool);
  function decreaseOpacity(hex, amount = 0.1) {
    // Ensure hex is in the format #RRGGBB
    let c = hex.replace("#", "");
    if (c.length === 3) {
      c = c
        .split("")
        .map((x) => x + x)
        .join("");
    }
    // Convert hex to RGB
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    // Clamp amount between 0 and 1
    const alpha = Math.max(0, Math.min(1, 1 - amount));
    return `rgba(${r},${g},${b},${alpha})`;
  }

  return (
    <group {...props} dispose={null}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={2} />
      <group
        name="Scene"
        scale={0.16}
        rotation={[Math.PI / 2.099, Math.PI / 0.85, 0]}
      >
        <mesh
          name="Cup"
          castShadow
          receiveShadow
          geometry={nodes.Cup.geometry}
          material={materials.Porcelan}
        >
          <meshStandardMaterial
            color={
              canvas.backgroundColor === "#ffffff"
                ? "#f5f5f5"
                : decreaseOpacity(canvas.backgroundColor, 0.5)
            }
          />

          {/* <CanvasTexture /> */}
        </mesh>

        <mesh
          name="CupDrawArea"
          castShadow
          receiveShadow
          geometry={nodes.CupDrawArea.geometry}
          material={materials.DecalMaterial}
        >  <CanvasTexture /> </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/Cap.glb");





