import React, { useContext, useEffect, useState } from "react";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import ModelWrapper from "./ModelWrapper";
import { Mug } from "./Mug";
import { Cap } from "./Cap";
import { Poster } from "./Poster";
import { ContextTool } from "./Mainstate(tool)/Mainstatetool";
import { Shirt } from "./Shirt";

function ModelViewer({ cameraRef, canvas, orbitRef }) {
  const { selectedModel, smScreen } = useContext(ContextTool);
  const { scene, events } = useThree();
  const Models = {
    Shirt: <Shirt flip={true}/>,
    Mug: <Mug flip={true} />,
    Cap: <Cap flip={true}/>,
    Poster: <Poster flip={true}/>,
  };

  useEffect(() => {
    events?.connected?.addEventListener("click", (e) => {
      var raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, cameraRef.current);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length < 1) {
        canvas.getActiveObject() && canvas.discardActiveObject().renderAll();
      }
    });
  }, [events]);

  return (
    <>
      <mesh rotation={[-1.5, 0, 0]} scale={smScreen ? 0.5 : 0.7}>
        <Center
          position={selectedModel.current === "Mug" ? [0.046, 0, 0] : [0, 0, 0]}
        >
          <ModelWrapper
            orbitRef={orbitRef}
            cameraRef={cameraRef}
            Model={() => Models[selectedModel.current]}
          ></ModelWrapper>
        </Center>
      </mesh>
    </>
  );
}

export default ModelViewer;

