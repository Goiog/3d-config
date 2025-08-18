import React, { useContext, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { CanvasTexture } from "./ModelWrapper";
import { ContextTool } from "./Mainstate(tool)/Mainstatetool";

export function Poster(props) {
  const { nodes, materials } = useGLTF("/poster2.glb");
  const { canvas } = useContext(ContextTool);
  const woodenTexture = useTexture("./wooden.jpg");
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
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <group
        name="Scene"
        scale={[-0.25,0.25,0.25]}
        rotation={[Math.PI / 2, 0, 0.2]}
      >
        <mesh
          name="Plane007"
          castShadow
          receiveShadow
          geometry={nodes.Plane007.geometry}
          material={materials.Material_002}
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
        <mesh name="EscudoRayo"  geometry={nodes.EscudoRayo.geometry} material={materials.Escudo}
          scale={[0.1,1,1]}
        />
        <mesh name="Cube004" geometry={nodes.Cube004.geometry} material={materials.Glass_Simple}
        >  <CanvasTexture /> </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/poster2.glb");




