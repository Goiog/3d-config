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


      function getRealPosition(axis, value) {
        const container = document.querySelector("#cont");
        if (!container) return 0;
        const rect = container.getBoundingClientRect();
        return Math.round(value * (axis === "x" ? rect.width : rect.height));
      }
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




  useEffect(() => {
    if (!canvas) return;

    // Give the canvas a white background right away
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

    // Performance optimization: Track drag state with real-time snapshots
    let isDragging = false;
    let pendingSnapshot = false;
    let lastSnapshotTime = 0;
    const SNAPSHOT_THROTTLE_MS = 16; // ~60fps max for smooth real-time updates
    const DRAG_SNAPSHOT_THROTTLE_MS = 16; // 60fps during drag for real-time preview

    // Function to capture and send the current canvas as PNG
    const sendSnapshot = (immediate = false) => {
      const now = Date.now();
      const throttleMs = isDragging ? DRAG_SNAPSHOT_THROTTLE_MS : SNAPSHOT_THROTTLE_MS;

      // Reduced throttling for real-time preview
      if (!immediate && (now - lastSnapshotTime) < throttleMs) {
        if (!pendingSnapshot) {
          pendingSnapshot = true;
          setTimeout(() => {
            pendingSnapshot = false;
            sendSnapshot(true);
          }, throttleMs - (now - lastSnapshotTime));
        }
        return;
      }

      lastSnapshotTime = now;

      const el = canvas.getElement();

      // Crop box (your current Mug wrap area guess)
      const cropX = 0;
      const cropY = 0;
      const cropW = 900;
      const cropH = 900;
      // Target aspect ratio (8:4)
      const targetW = 800;
      const targetH = 400;

      const tmp = document.createElement("canvas");
      tmp.width = targetW;
      tmp.height = targetH;
      const ctx = tmp.getContext("2d");

      // Fill background to avoid "broken image" effect
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);

      // Draw the fabric canvas content into your preview
      ctx.drawImage(el, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);

      const url = tmp.toDataURL("image/png");
      window.parent.postMessage({ type: "canvas-snapshot", payload: { url } }, "*");
    };

    // Optimized event handlers with real-time drag detection
    const handleObjectMoving = () => {
      isDragging = true;
      sendSnapshot(true); // Send immediate snapshot for real-time feedback
    };

    const handleObjectModified = () => {
      isDragging = false;
      sendSnapshot(true); // Send final snapshot immediately when drag ends
    };

    const handleObjectScaling = () => {
      sendSnapshot();
    };

    const handleObjectRotating = () => {
      sendSnapshot();
    };

    // Immediate snapshot events (no throttling needed)
    const handleObjectAdded = () => {
      sendSnapshot(true);
    };

    const handleObjectRemoved = () => {
      sendSnapshot(true);
    };

    const handleSelectionCleared = () => {
      sendSnapshot(true);
    };

    const handleSelectionUpdated = () => {
      sendSnapshot(true);
    };

    // Bind optimized event handlers
    canvas.on("object:moving", handleObjectMoving);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:scaling", handleObjectScaling);
    canvas.on("object:rotating", handleObjectRotating);
    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:removed", handleObjectRemoved);
    canvas.on("selection:cleared", handleSelectionCleared);
    canvas.on("selection:updated", handleSelectionUpdated);

    // Respond to parent requests
    const onMessage = (event) => {
      const data = event.data || {};
      if (data.type === "request-canvas-snapshot") {
        sendSnapshot(true);
      }
    };
    window.addEventListener("message", onMessage);

    // Send one snapshot immediately on init (blank with white background)
    sendSnapshot(true);

    // Cleanup on unmount
    return () => {
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:scaling", handleObjectScaling);
      canvas.off("object:rotating", handleObjectRotating);
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:removed", handleObjectRemoved);
      canvas.off("selection:cleared", handleSelectionCleared);
      canvas.off("selection:updated", handleSelectionUpdated);
      window.removeEventListener("message", onMessage);
    };
  }, [canvas]);





  return (
    <>
      <Model cameraRef={cameraRef} canvas={canvas} />
    </>
  );
};












export default ModelWrapper;
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
