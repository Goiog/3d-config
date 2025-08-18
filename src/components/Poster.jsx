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
        scale={0.25}
        rotation={[0, Math.PI / 2, Math.PI / 2.3]}
      >
        <mesh
          name="Plane007"
          castShadow
          receiveShadow
          geometry={nodes.Plane007.geometry}
          material={materials["Material.002"]}
          position={[-0.194, 1.208, 0.072]}
          rotation={[1.572, 0.047, -1.579]}
          scale={0.746}
        >
          <meshStandardMaterial
            color={
              canvas.backgroundColor === "#ffffff"
                ? "#f5f5f5"
                : decreaseOpacity(canvas.backgroundColor, 0.5)
            }
          />
        </mesh>
        <mesh
          name="Plane006"
          castShadow
          receiveShadow
          geometry={nodes.Plane006.geometry}
          material={materials["Material.003"]}
          position={[-0.212, 1.447, 0.072]}
          rotation={[0.001, 0.008, 1.618]}
          scale={0.771}
        >
          <meshStandardMaterial
            color={
              canvas.backgroundColor === "#ffffff"
                ? "#f5f5f5"
                : decreaseOpacity(canvas.backgroundColor, 0.5)
            }
          />
        </mesh>
        <mesh
          name="Cube004"
          castShadow
          receiveShadow
          geometry={nodes.Cube004.geometry}
          material={materials["Glass Simple"]}
          position={[-0.207, 1.418, 0.05]}
          rotation={[0.001, 0.008, 0.047]}
          scale={[0.009, 0.771, 0.771]}
        >  <CanvasTexture /> </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/poster2.glb");




