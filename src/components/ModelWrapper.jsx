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

    // Handle transform updates from parent
    const handleTransformUpdate = (event) => {
      const data = event.data || {};
      if (data.type === "update-transform" && data.payload) {
        const { id, x, y, scale, rotation } = data.payload;
        
        // Find the fabric object by ID
        const objects = canvas.getObjects();
        const targetObject = objects.find(obj => obj._id === id);
        
        if (targetObject) {
          // Apply transforms directly to fabric object
          if (x !== undefined) targetObject.set('left', x);
          if (y !== undefined) targetObject.set('top', y);
          if (scale !== undefined) targetObject.set('scaleX', scale / 500).set('scaleY', scale / 500);
          if (rotation !== undefined) targetObject.set('angle', rotation);
          
          // Update canvas and 3D texture
          targetObject.setCoords();
          canvas.renderAll();
          
          if (textureRef.current) {
            textureRef.current.needsUpdate = true;
            invalidate();
          }
        }
      }
    };

    // Handle canvas events for 3D texture updates only
    const handleCanvasChange = () => {
      // Only trigger 3D texture update
      if (textureRef.current) {
        textureRef.current.needsUpdate = true;
        invalidate();
      }
    };

    // Bind event handlers for 3D texture updates
    canvas.on("object:modified", handleCanvasChange);
    canvas.on("object:added", handleCanvasChange);
    canvas.on("object:removed", handleCanvasChange);
    canvas.on("selection:cleared", handleCanvasChange);
    canvas.on("selection:updated", handleCanvasChange);

    window.addEventListener("message", handleTransformUpdate);

    // Cleanup on unmount
    return () => {
      canvas.off("object:modified", handleCanvasChange);
      canvas.off("object:added", handleCanvasChange);
      canvas.off("object:removed", handleCanvasChange);
      canvas.off("selection:cleared", handleCanvasChange);
      canvas.off("selection:updated", handleCanvasChange);
      window.removeEventListener("message", handleTransformUpdate);
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
  const materialRef = useRef();

  // Create live canvas texture when canvas is available
  useEffect(() => {
    if (canvas && !textureRef.current) {
      const fabricEl = canvas.getElement();
      const texture = new THREE.CanvasTexture(fabricEl);
      texture.needsUpdate = true;
      texture.flipY = false;
      texture.generateMipmaps = false;
      texture.anisotropy = 16;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      
      textureRef.current = texture;
      
      // Apply texture to material
      if (materialRef.current) {
        materialRef.current.map = texture;
        materialRef.current.needsUpdate = true;
      }
    }
  }, [canvas]);

  // Update texture every frame for real-time rendering
  useFrame(() => {
    if (textureRef.current && canvas) {
      textureRef.current.needsUpdate = true;
      invalidate();
    }
  });

  return (
    <meshStandardMaterial
      ref={materialRef}
      map={textureRef.current}
      polygonOffset
      transparent
      toneMapped={true}
    />
  );
});

export { CanvasTexture };
