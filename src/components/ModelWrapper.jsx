import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import { ContextTool } from "@/components/Mainstate(tool)/Mainstatetool";
import * as THREE from "three";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import { fabric } from "fabric";

const ModelWrapper = ({ Model, cameraRef, orbitRef }) => {
  const { canvas, canvasOffset, update, unsportedDevice, selectedModel } =
    useContext(ContextTool);
  const { scene, camera } = useThree();

  useEffect(() => {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var onClickPosition = new THREE.Vector2();
    const container = document.querySelector("#cont");

    fabric.Canvas.prototype.getPointer = function (e, ignoreZoom) {
      if (this._absolutePointer && !ignoreZoom) {
        return this._absolutePointer;
      }
      if (this._pointer && ignoreZoom) {
        return this._pointer;
      }
      var pointer = fabric.util.getPointer(e),
        upperCanvasEl = this.upperCanvasEl,
        bounds = upperCanvasEl.getBoundingClientRect(),
        boundsWidth = bounds.width || 0,
        boundsHeight = bounds.height || 0,
        cssScale;

      if (!boundsWidth || !boundsHeight) {
        if ("top" in bounds && "bottom" in bounds) {
          boundsHeight = Math.abs(bounds.top - bounds.bottom);
        }
        if ("right" in bounds && "left" in bounds) {
          boundsWidth = Math.abs(bounds.right - bounds.left);
        }
      }
      this.calcOffset();
      pointer.x = pointer.x - this._offset.left;
      pointer.y = pointer.y - this._offset.top;
      /* BEGIN PATCH CODE */
      if (e.target !== this.upperCanvasEl) {
        var positionOnScene = getPositionOnScene(container, e);
        pointer.x = positionOnScene?.x;
        pointer.y = positionOnScene?.y;
      }
      /* END PATCH CODE */
      if (!ignoreZoom) {
        pointer = this.restorePointerVpt(pointer);
      }

      if (boundsWidth === 0 || boundsHeight === 0) {
        cssScale = { width: 1, height: 1 };
      } else {
        cssScale = {
          width: upperCanvasEl.width / boundsWidth,
          height: upperCanvasEl.height / boundsHeight,
        };
      }

      return {
        x: pointer.x - cssScale.width - 1,
        y: pointer.y - cssScale.height + 0.8,
      };
    };

    let isMouseDown = false;
    let objMoving = false;
    container.addEventListener("mousedown", onMouseEvt, false);
    selectedModel.current === "Mug" &&
      canvas.on("object:moving", function (event) {
        objMoving = true;
      });
    selectedModel.current === "Mug" &&
      canvas.on("object:modified", function (event) {
        objMoving = false;
      });

    function onMouseEvt(evt) {
      evt.preventDefault();
      isMouseDown = true;
      const positionOnScene = getPositionOnScene(container, evt);

      if (positionOnScene) {
        let clientX = canvasOffset.left + positionOnScene.x;
        let clientY = canvasOffset.top + positionOnScene.y;

        clientX += 2;

        const simEvt = new MouseEvent(evt.type, {
          clientX: clientX,
          clientY: clientY,
        });

        canvas.upperCanvasEl.dispatchEvent(simEvt);
      }
    }

    window.addEventListener(
      "mouseup",
      (evt) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        const simEvt = new MouseEvent("mouseup", {
          clientX: evt.clientX,
          clientY: evt.clientY,
        });

        canvas.upperCanvasEl.dispatchEvent(simEvt);
      },
      false
    );

    function getPositionOnScene(sceneContainer, evt) {
      var array = getMousePosition(container, evt.clientX, evt.clientY);
      onClickPosition.fromArray(array);
      var intersects = getIntersects(onClickPosition, scene.children);

      if (
        selectedModel.current === "Poster" &&
        intersects[0].object.name === "Plane006"
      ) {
        intersects[0] = null;
      }

      if (
        selectedModel.current === "Mug" &&
        intersects[0].object.name !== "CupDrawArea"
      ) {
        !objMoving && canvas.discardActiveObject();
        intersects[0] = null;
      }

      if (
        selectedModel.current === "Shirt" &&
        intersects[0].object.name !== "Object_6"
      ) {
        return null;
      }
      if (
        selectedModel.current === "Cap" &&
        intersects[0].object.name !== "PlaneCanvas"
      ) {
        return null;
      }

      if (
        selectedModel.current === "Poster" &&
        intersects[0].object.name !== "Cube005"
      ) {
        return null;
      }

      if (intersects.length > 0 && intersects[0].uv) {
        var uv = intersects[0].uv;

        intersects[0].object.material.map?.transformUv(uv);
        return {
          x: getRealPosition("x", uv.x),
          y: getRealPosition("y", uv.y),
        };
      }
      return null;
    }

    function getRealPosition(axis, value) {
      let CORRECTION_VALUE = axis === "x" ? 4.5 : 5.5;

      return Math.round(value * 900);
    }

    var getMousePosition = function (dom, x, y) {
      var rect = dom.getBoundingClientRect();
      return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    };

    var getIntersects = function (point, objects) {
      mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
      raycaster.setFromCamera(mouse, cameraRef.current);
      return raycaster.intersectObjects(objects);
    };

    return () => container.removeEventListener("mousedown", onMouseEvt, false);
  }, [canvasOffset]);

  return (
    <>
      <Model cameraRef={cameraRef} canvas={canvas} />
    </>
  );
};

export default ModelWrapper;

useEffect(() => {
  if (!canvas) return;

  // Function to capture and send the current canvas as PNG
  const sendSnapshot = () => {
    try {
      const url = canvas.toDataURL({ format: "png" });
      window.parent.postMessage(
        { type: "canvas-snapshot", payload: { url } },
        "*" // 🔒 you can replace "*" with your parent domain for security
      );
    } catch (err) {
      console.error("Snapshot failed:", err);
    }
  };

  // --- Auto-push on fabric events ---
  canvas.on("object:added", sendSnapshot);
  canvas.on("object:modified", sendSnapshot);
  canvas.on("object:removed", sendSnapshot);
  canvas.on("selection:cleared", sendSnapshot);
  canvas.on("selection:updated", sendSnapshot);

  // --- Respond to parent requests ---
  const onMessage = (event) => {
    const data = event.data || {};
    if (data.type === "request-canvas-snapshot") {
      sendSnapshot();
    }
  };
  window.addEventListener("message", onMessage);

  // Cleanup on unmount
  return () => {
    canvas.off("object:added", sendSnapshot);
    canvas.off("object:modified", sendSnapshot);
    canvas.off("object:removed", sendSnapshot);
    canvas.off("selection:cleared", sendSnapshot);
    canvas.off("selection:updated", sendSnapshot);
    window.removeEventListener("message", onMessage);
  };
}, [canvas]);
// Till here
const CanvasTexture = React.memo(({ flip }) => {
  const { canvas, update, unsportedDevice, selectedModel } =
    useContext(ContextTool);
  const textureRef = useRef();
  const updateModel = useCallback(() => {
    if (unsportedDevice) {
      if (textureRef.current && update) {
        textureRef.current.needsUpdate = true;
        invalidate();
      }
    } else {
      if (textureRef.current) {
        textureRef.current.needsUpdate = true;
        invalidate();
      }
    }
  }, [update, unsportedDevice]);

  useFrame(({ gl }) => {
    updateModel();
  });

  const updateTexture = () => {
    canvas.renderAll();
    textureRef.current.needsUpdate = true;
    invalidate();
  };
  useEffect(() => {
    if (unsportedDevice) {
      canvas.on("object:moving", updateTexture);
      canvas.on("object:scaling", updateTexture);
      canvas.on("object:resizing", updateTexture);
      canvas.on("object:rotating", updateTexture);
      canvas.on("object:added", updateTexture);
      canvas.on("object:modified", updateTexture);
      canvas.on("selection:created", updateTexture);
      canvas.on("selection:updated", updateTexture);
      canvas.on("selection:cleared", updateTexture);
    }

    return () => {
      if (unsportedDevice) {
        canvas.off("object:moving", updateTexture);
        canvas.off("object:scaling", updateTexture);
        canvas.off("object:resizing", updateTexture);
        canvas.off("object:rotating", updateTexture);
        canvas.off("object:added", updateTexture);
        canvas.off("object:modified", updateTexture);
        canvas.off("selection:created", updateTexture);
        canvas.off("selection:updated", updateTexture);
        canvas.off("selection:cleared", updateTexture);
      }
    };
  }, []);

  return (
    <meshStandardMaterial
      polygonOffset
      // polygonOffsetFactor={10}
      transparent
      toneMapped={true}
    >
      <canvasTexture
        ref={textureRef}
        attach="map"
        image={canvas.getElement()}
        needsUpdate
        flipY={false}
        generateMipmaps={false}
        anisotropy={16}
        minFilter={THREE.LinearFilter}
        magFilter={THREE.LinearFilter}
        mapping={THREE.EquirectangularReflectionMapping}
      />
    </meshStandardMaterial>
  );
});

export { CanvasTexture };




