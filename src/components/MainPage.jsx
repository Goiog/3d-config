"use client";
import ModelViewer from "@/components/ModelViewer";
import {
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  Preload,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ToastContainer } from "react-toastify";
import * as THREE from "three";
import "react-toastify/dist/ReactToastify.css";
import { ContextTool } from "./Mainstate(tool)/Mainstatetool";
import Editdialog from "./Editor/Editdialog";
import ChangeModel from "./ChangeModel";
import IframeListener from "./IrameListener";

function MainPage() {
  const {
    selectedObject,
    selectedPart,
    canvas,
    animatedCanvas,
    selectedModel,
    threeCanvas,
    orbitRef,
  } = useContext(ContextTool);

  const [dpr, setDpr] = useState(1.5);
  const [contextAttributes, setcontextAttributes] = useState({});

  const cameraRef = useRef();
  const isSafari = () => {
    const userAgent = navigator.userAgent;
    const safari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const ios = /iP(ad|hone|od)/.test(userAgent);
    return safari || ios;
  };

  const getWebGLContextAttributes = () => {
    let contextAttributes = {};
    if (isSafari()) {
      contextAttributes.powerPreference = "high-performance";
    }
    contextAttributes.pixelRatio = window.devicePixelRatio;
    return contextAttributes;
  };

  useEffect(() => {
    setcontextAttributes(getWebGLContextAttributes());
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="min-h-[100dvh] md:min-h-screen w-full relative md:h-screen overflow-hidden">
        <div
          id="cont"
          className={`absolute top-0 min-h-screen w-full bg-canvasColor`}
        >
          {/* <IframeListener /> */}
          <Canvas
            ref={threeCanvas}
            shadows
            className="main-canvas"
            frameloop="demand"
            performance={{ min: 0.1 }}
            gl={{
              contextAttributes: contextAttributes,
              outputColorSpace: THREE.LinearSRGBColorSpace,
              useLegacyLights: false,
              toneMapping: THREE.NeutralToneMapping,
              toneMappingExposure: 1.5,
              physicallyCorrectLights: true,
              preserveDrawingBuffer: true,
            }}
            dpr={dpr}
          >
            <PerspectiveCamera
              ref={cameraRef}
              makeDefault
              fov={35}
              position={[0, 0, 0.7]}
            />
            <OrbitControls
              enablePan={true}
              enableRotate={true}
              maxDistance={1.2}
              minDistance={0.3}
              ref={orbitRef}
              enableZoom={true}
              maxZoom={0.3}
              autoRotate={animatedCanvas}
              autoRotateSpeed={4}
              target={[0, 0, 0]}
            />
            <PerformanceMonitor
              onIncline={() => setDpr(1.5)}
              onDecline={() => setDpr(1.3)}
            />
            {/* uncomment to see performance! */}
            {/* <Stats /> */}
            <Preload all />
            <ModelViewer
              cameraRef={cameraRef}
              orbitRef={orbitRef}
              selectedPart={selectedPart}
              canvas={canvas}
            />
          </Canvas>
        </div>

        {/* <Editdialog threeCanvas={threeCanvas} /> */}
        <Suspense>
          <ChangeModel selectedModel={selectedModel} />
        </Suspense>
      </div>
      <div className="fabricContainer">
        <canvas
          className={`absolute top-0 z-50 !h-[900px] !w-[900px] touch-none `}
          id="can-text"
        />
      </div>
    </>
  );
}

export default MainPage;
