"use client";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { fabric } from "fabric";
import { removeBg } from "@/actions";

const URL_SERVER = process.env.NEXT_PUBLIC_URL;

const ContextTool = createContext();

function Mainstatetool({ children }) {
  const threeCanvas = useRef(null);
  const orbitRef = useRef();
  const selectedModel = useRef("Shirt");
  const [imagesDisplayed, setimagesDisplayed] = useState([]);
  const [textsCanvas, setTextsCanvas] = useState([]);
  const [animatedCanvas, setanimatedCanvas] = useState(true);

  const angles = {
    Shirt: 180,
    Mug: 0,
    Cap: 0,
    Poster: 180,
  };

  const fontSize = {
    Shirt: 2,
    Mug: 3,
    Cap: 2,
    Poster: 2.5,
  };

  const positions = {
    Shirt: {
      x: 450,
      y: 350,
    },
    Mug: { x: 450, y: 350 },
    Cap: { x: 450, y: 350 },
    Poster: { x: 450, y: 350 },
  };

  const ImageSizes = {
    Shirt: {
      width: 920,
      height: 450,
    },
    Mug: {
      width: 920,
      height: 450,
    },
    Cap: {
      width: 920,
      height: 450,
    },
    Poster: {
      width: 920,
      height: 450,
    },
  };

  const ImagePos = {
    Shirt: {
      x: 450,
      y: 450,
    },
    Mug: { x: 450, y: 450 },
    Cap: { x: 450, y: 450 },
    Poster: { x: 450, y: 450 },
  };

  //  For Small Screen
  const [smScreen, setsmScreen] = useState(false);
  useEffect(() => {
    setsmScreen(window.innerWidth < 600);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1062) {
      function touchHandler(event) {
        let touches = event.changedTouches,
          first = touches[0],
          type = "";

        switch (event.type) {
          case "touchstart":
            type = "mousedown";
            break;
          case "touchend":
            type = "mouseup";
            break;
          case "touchmove":
            type = "mousemove";
            break;
          default:
            return;
        }

        // Create the mouse event using the touch event data
        let simulatedEvent = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          detail: 1,
          screenX: first.screenX,
          screenY: first.screenY,
          clientX: first.clientX,
          clientY: first.clientY,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
          metaKey: event.metaKey,
          button: 0, // left button
          buttons: 1,
        });

        first.target.dispatchEvent(simulatedEvent);
        // event.preventDefault();
      }

      // Add touch event listeners
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);

      return () => {
        document.removeEventListener("touchstart", touchHandler, true);
        document.removeEventListener("touchmove", touchHandler, true);
        document.removeEventListener("touchend", touchHandler, true);
        document.removeEventListener("touchcancel", touchHandler, true);
      };
    }
  }, []);
  //  For Optimizations
  const [update, setupdate] = useState(false);
  const unsportedDevice = useRef(false);
  const updateTextureFunc = () => {
    if (unsportedDevice) {
      setupdate(true);
      setTimeout(() => {
        setupdate(false);
      }, 100);
    }
  };
  const DetectDevice = () => {
    const userAgentString = navigator.userAgent;
    let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
    let chromeAgent = userAgentString.indexOf("Chrome") > -1;
    let safariAgent = userAgentString.indexOf("Safari") > -1;
    if (chromeAgent && safariAgent) {
      safariAgent = false;
    }
    unsportedDevice.current =
      safariAgent || firefoxAgent || window.innerWidth < 400;
  };
  useEffect(() => {
    DetectDevice();
  }, []);

  const selectedText = useRef({
    text: "Text",
    top: 5,
    left: 5,
    fontSize: 2,
    fontFamily: "Times New Roman",
    lineHeight: "0.7",
  });

  const selectedImage = useRef({
    top: 550,
    left: 255,
    scaleX: 0.346452328159645,
    scaleY: 0.346452328159645,
    angle: 0,
    typeObj: "image",
  });

  const [canvasOffset, setcanvasOffset] = useState(false);
  const [selectedObject, setselectedObject] = useState(null);

  let canvas = useRef(null);

  const addTextLayer = (textDef, _id, fontFamily = "Times New Roman") => {
    let scaleY = fontSize[selectedModel.current];
    
      scaleY += 2;
    

    const textBox = new fabric.Textbox(textDef, {
      typeObj: "text",
      editable: false,
      angle: angles[selectedModel.current],
      scaleX: fontSize[selectedModel.current],
      scaleY: scaleY,
      _id: _id,
      lineHeight: "0.7",
      fontFamily: fontFamily,
    });
    textBox.setPositionByOrigin(
      positions[selectedModel.current],
      "center",
      "center"
    );
    canvas.current?.add(textBox);
    setTextsCanvas((e) => [...e, textBox]);
    return textBox;
  };

  const addImageLayer = (image, url, _id) => {
    let imgId;
    new fabric.Image.fromURL(
      image,
      (img) => {
        img.set({
          top: 533,
          left: 334,
          typeObj: "image",
          url: url,
          _id: _id,
          selectedPart: "Front",
          angle: angles[selectedModel.current],
        });

        const targetWidth = ImageSizes[selectedModel.current].width;
        const targetHeight = ImageSizes[selectedModel.current].height;
        
          const widthRatio = targetWidth / img.width;
          const heightRatio = targetHeight / img.height;
          let scaleFactor;
          if (img.height > img.width) {
            scaleFactor = heightRatio;
          } else {
            scaleFactor = widthRatio;
          }

          // In addImageLayer
          img.scaleX = scaleFactor;
          img.scaleY =
            (selectedModel.current === "Mug" || selectedModel.current === "Cap")
              ? scaleFactor * 2
              : scaleFactor;
        

        imgId = img.id;

        img.setPositionByOrigin(
          ImagePos[selectedModel.current],
          "center",
          "center"
        );
        canvas.current.add(img);
        selectedImage.current = {
          ...selectedImage.current,
          url: url,
          id: imgId,
        };
      },
      { crossOrigin: "anonymous" }
    );

    canvas.current.renderAll();
  };

  const UpdateText = useCallback(
    (
      text = selectedText.current.text,
      top = selectedText.current.top,
      left = selectedText.current.left,
      fontSize = selectedText.current.fontSize,
      angle = selectedText.current.angle,
      fill = selectedText.current.fill,
      fontFamily,
      lineHeight = selectedText.current.lineHeight
    ) => {
      if (
        canvas.current.getActiveObject() &&
        canvas.current.getActiveObject().typeObj === "text"
      ) {
        canvas.current.getActiveObject().set("text", text);
        canvas.current.getActiveObject().set("top", +top);
        canvas.current.getActiveObject().set("left", +left);
        canvas.current.getActiveObject().set("angle", +angle);
        canvas.current.getActiveObject().set("lineHeight", lineHeight);
        if (fontFamily) {
          canvas.current.getActiveObject().set("fontFamily", fontFamily);
          canvas.current.getActiveObject().set("width", 0);
          canvas.current.getActiveObject().initDimensions();
          canvas.current.getActiveObject().setCoords();
        }
        canvas.current.getActiveObject().set("fill", fill);
        let scaleY = +fontSize;
        scaleY += scaleY === 1 ? 1 : 2;
        canvas.current.getActiveObject().set("scaleX", fontSize);
        canvas.current.getActiveObject().set("scaleY", scaleY);

        text !== "" && canvas.current?.renderAll();
        updateTextureFunc();
      }
    },
    [selectedText]
  );

  const updateImage = useCallback(
    (
      top = selectedImage.current.top,
      left = selectedImage.current.left,
      angle = selectedImage.current.angle,
      scale
    ) => {
      if (
        canvas.current.getActiveObject() &&
        canvas.current.getActiveObject().typeObj === "image"
      ) {
        if (scale) {
          const uniformScale = +scale / canvas.current.getActiveObject().width;
          canvas.current.getActiveObject().set("scaleX", uniformScale);
          canvas.current.getActiveObject().set(
            "scaleY",
            (selectedModel.current === "Mug" || selectedModel.current === "Cap")
              ? uniformScale * 2
              : uniformScale
          );
        }
        canvas.current.getActiveObject().set("top", +top);
        canvas.current.getActiveObject().set("left", +left);

        canvas.current.getActiveObject().set("angle", +angle);
        canvas.current.renderAll();
        updateTextureFunc();
      }
    },
    [selectedImage]
  );

  const initCanvas = () => {
    const canvasSize = {
      width: 900,
      height: 900,
    };

    const canva = new fabric.Canvas("can-text", {
      backgroundColor: "#ffffff",
      ...canvasSize,
    });

    fabric.Group.prototype.hasControls = false;

    canva.on("object:modified", (e) => {
      orbitRef.current.enableRotate = true;
      if (
        e.target.top == 0 ||
        e.target.left == 0 ||
        Number.isNaN(e.target.top) ||
        Number.isNaN(e.target.left) ||
        Number.isNaN(e.target.scaleX) ||
        Number.isNaN(e.target.scaleY)
      ) {
        if (e.target.typeObj === "text") {
          e.target.set("scaleX", 1);
          e.target.set("scaleY", 1);
        } else {
          const targetWidth = ImageSizes[selectedModel.current].width;
          const targetHeight = ImageSizes[selectedModel.current].height;
          e.target.set("scaleX", targetWidth / img.width);
          e.target.set("scaleY", targetHeight / img.height);
        }

        e.target.setPositionByOrigin(
          positions[selectedModel.current],
          "center",
          "center"
        );
      }
      if (
        (Number.isNaN(e.target.width) || Number.isNaN(e.target.height)) &&
        e.target.typeObj === "text"
      ) {
        e.target.set(
          "width",
          getWidth({
            fontSize: e.target.fontSize,
            fontFamily: e.target.fontFamily,
            text: e.target.text,
          }).width + 5
        );
        e.target.setPositionByOrigin(
          {
            x: 450,
            y: 290,
          },
          "center",
          "center"
        );
      }

      switch (e.target.typeObj) {
        case "text":
          selectedText.current = {
            ...selectedText,
            text: e.target.text,
            id: e.target.id,
            top: e.target.top,
            left: e.target.left,
            angle: e.target.angle,
            fontSize: e.target.scaleX,
            fill: e.target.fill,
            fontFamily: e.target.fontFamily,
            lineHeight: e.target.lineHeight,
          };
          window.parent.postMessage(
            {
              type: "update-text",
              payload: {
                text: e.target.text,
                top: e.target.top,
                left: e.target.left,
                angle: e.target.angle,
                _id: e.target._id,
                fontSize: e.target.scaleX,
                fill: e.target.fill,
                fontFamily: e.target.fontFamily,
                lineHeight: e.target.lineHeight,
              },
            },
            "*"
          );
          break;
        case "image":
          selectedImage.current = {
            left: e.target.left,
            top: e.target.top,
            scale: e.target.width * e.target.scaleX,
            angle: e.target.angle,
            url: e.target.url,
            _id: e.target._id,
            width: e.target.width,
            height: e.target.height,
          };
          window.parent.postMessage(
            {
              type: "update-image",
              payload: {
                top: e.target.top,
                left: e.target.left,
                angle: e.target.angle,
                _id: e.target._id,
                scale: e.target.width * e.target.scaleX,
              },
            },
            "*"
          );
          break;
      }

      canvas.current.renderAll();
    });

    canva.on("selection:created", (e) => {
      // orbitRef.current.enableRotate = false;
      setselectedObject(e.selected[0]);
      switch (e.selected[0].typeObj) {
        case "text":
          selectedText.current = {
            ...selectedText,
            text: e.selected[0].text,
            id: e.selected[0].id,
            top: e.selected[0].top,
            left: e.selected[0].left,
            angle: e.selected[0].angle,
            fontSize: e.selected[0].scaleX,
            fill: e.selected[0].fill,
            fontFamily: e.selected[0].fontFamily,
            lineHeight: e.selected[0].lineHeight,
          };
          window.parent.postMessage(
            {
              type: "update-text",
              payload: {
                text: e.selected[0].text,
                top: e.selected[0].top,
                left: e.selected[0].left,
                angle: e.selected[0].angle,
                _id: e.selected[0]._id,
                fontSize: e.selected[0].scaleX,
                fontFamily: e.selected[0].fontFamily,
                lineHeight: e.selected[0].lineHeight,
              },
            },
            "*"
          );
          break;
        case "image":
          selectedImage.current = {
            left: e.selected[0].left,
            top: e.selected[0].top,
            scale: e.selected[0].width * e.selected[0].scaleX,
            angle: e.selected[0].angle,
            url: e.selected[0].url,
            _id: e.selected[0]._id,
            width: e.selected[0].width,
            height: e.selected[0].height,
          };
          window.parent.postMessage(
            {
              type: "update-image",
              payload: {
                top: e.selected[0].top,
                left: e.selected[0].left,
                angle: e.selected[0].angle,
                _id: e.selected[0]._id,
                scale: e.selected[0].width * e.selected[0].scaleX,
              },
            },
            "*"
          );
          break;
      }

      updateTextureFunc();
    });

    canva.on("selection:updated", (e) => {
      setselectedObject({ ...e.selected[0] });
      // orbitRef.current.enableRotate = false;
      switch (e.selected[0].typeObj) {
        case "text":
          selectedText.current = {
            ...selectedText,
            text: e.selected[0].text,
            id: e.selected[0].id,
            top: e.selected[0].top,
            left: e.selected[0].left,
            fontSize: e.selected[0].scaleX,
            fill: e.selected[0].fill,
            angle: e.selected[0].angle,
            fontFamily: e.selected[0].fontFamily,
            lineHeight: e.selected[0].lineHeight,
          };
          window.parent.postMessage(
            {
              type: "update-text",
              payload: {
                text: e.selected[0].text,
                top: e.selected[0].top,
                left: e.selected[0].left,
                angle: e.selected[0].angle,
                _id: e.selected[0]._id,
                fontSize: e.selected[0].scaleX,
                fontFamily: e.selected[0].fontFamily,
                lineHeight: e.selected[0].lineHeight,
              },
            },
            "*"
          );
          break;
        case "image":
          selectedImage.current = {
            left: e.selected[0].left,
            top: e.selected[0].top,
            scale: e.selected[0].width * e.selected[0].scaleX,
            angle: e.selected[0].angle,
            url: e.selected[0].url,
            _id: e.selected[0]._id,
            width: e.selected[0].width,
            height: e.selected[0].height,
          };
          window.parent.postMessage(
            {
              type: "update-image",
              payload: {
                top: e.selected[0].top,
                left: e.selected[0].left,
                angle: e.selected[0].angle,
                _id: e.selected[0]._id,
                scale: e.selected[0].width * e.selected[0].scaleX,
              },
            },
            "*"
          );
          break;
      }
      updateTextureFunc();
    });

    canva.on("mouse:down:before", (e) => {
      if (e.target) {
        orbitRef.current.enableRotate = false;
      } else {
        orbitRef.current.enableRotate = true;
      }
    });

    canva.on("mouse:up:before", (e) => {
      orbitRef.current.enableRotate = true;
    });

    canva.on("selection:cleared", () => {
      orbitRef.current.enableRotate = true;

      setselectedObject(false);
      selectedImage.current = {
        ...selectedImage.current,
      };

      selectedText.current = {
        ...selectedText.current,
      };

      window.parent.postMessage(
        {
          type: "select-clear",
          payload: {},
        },
        "*"
      );
      canva.renderAll();
    });

    // click checker
    // canva.on("mouse:down", function (options) {
    //   const pointer = canva.getPointer(options.e);

    //   const circle = new fabric.Circle({
    //     left: pointer.x,
    //     top: pointer.y,
    //     radius: 1,
    //     fill: "red",
    //     originX: "center",
    //     originY: "center",
    //     selectable: false,
    //   });

    //   canva.add(circle);
    // });

    return canva;
  };

  const changeColor = (clr) => {
    setupdate(true);
    canvas.current.setBackgroundColor(clr);
    canvas.current.renderAll();
    setTimeout(() => {
      setupdate(false);
    }, 100);
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // This will be like "data:image/jpeg;base64,..."
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const EventFunc = useCallback(
    (event) => {
      const { type, payload } = event.data;
      if (!payload) {
        return;
      }

      switch (type) {
        case "add-text":
          selectedText.current = {
            ...selectedText.current,
            ...payload,
          };
          addTextLayer(payload.text, payload._id);
          break;
        case "update-text":
          selectedText.current = {
            ...selectedText.current,
            ...payload,
          };
          UpdateText(
            undefined,
            +payload.top || undefined,
            +payload.left || undefined,
            +payload.fontSize || undefined,
            +payload.angle || undefined,
            payload.fill,
            payload.fontFamily || undefined,
            payload.lineHeight || undefined
          );
          break;
        case "add-image":
          addImageLayer(payload.url, payload.url, payload._id);
          break;
        case "update-image":
          selectedImage.current = {
            ...selectedImage.current,
            ...payload,
          };
          updateImage(
            +payload.top || undefined,
            +payload.left || undefined,
            +payload.angle || undefined,
            +payload.scale
          );
          break;
        case "change-color":
          changeColor(payload.clr);
          break;
        case "rotate-control":
          setanimatedCanvas(payload.enable);
          if (payload.enable) {
            canvas.current.getObjects().forEach((it) =>
              it.set({
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
              })
            );
          } else {
            canvas.current.getObjects().forEach((it) =>
              it.set({
                selectable: true,
                evented: true,
                lockMovementX: false,
                lockMovementY: false,
                lockRotation: false,
                lockScalingX: false,
                lockScalingY: false,
              })
            );
          }

          break;
        case "delete-layer":
          canvas.current.remove(
            canvas.current.getObjects().find((it) => it._id === payload._id)
          );
          break;
        case "lock-layer":
          const seletedObj = canvas.current
            .getObjects()
            .find((it) => it._id === payload._id);
          if (payload.lock) {
            canvas.current.discardActiveObject().renderAll();
            seletedObj.set({
              selectable: false,
              evented: false,
              lockMovementX: true,
              lockMovementY: true,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true,
            });
          } else {
            seletedObj.set({
              selectable: true,
              evented: true,
              lockMovementX: false,
              lockMovementY: false,
              lockRotation: false,
              lockScalingX: false,
              lockScalingY: false,
            });
          }
          break;
        case "export-data":
          const url = threeCanvas.current.toDataURL("image/png");
          window.parent.postMessage(
            {
              type: "export-image",
              payload: { url: url },
            },
            "*"
          );
          break;
        case "reset-view":
          canvas.current.clear();
          changeColor("#ffffff");
          break;
        case "select-layer":
          const layer_sel = canvas.current
            .getObjects()
            .find((it) => it._id === payload._id);
          layer_sel && canvas.current.setActiveObject(layer_sel);
          canvas.current.renderAll();
          break;
        case "ini-layers":
          const TextsLay = payload.textLayers;
          const ImagesLay = payload.imageLayers;
          ImagesLay.forEach((it) => addImageLayer(it.url, it.url, it._id));
          setTimeout(() => {
            TextsLay.forEach((it) => {
              addTextLayer(it.text, it._id, it.fontFamily);
            });
          }, 200);
          break;
        case "remove-bg":
          const selectedBg = canvas.current
            .getObjects()
            .find((it) => it._id === payload._id);

          removeBg(selectedBg.url).then((e) => {
            const newUrl = URL.createObjectURL(e);
            selectedBg.setSrc(newUrl, async () => {
              canvas.current.renderAll();
              updateImage(
                selectedImage.current.top,
                selectedImage.current.left,
                selectedImage.current.angle,
                selectedImage.current.scale
              );
              window.parent.postMessage(
                {
                  type: "loading-false-image",
                  payload: {
                    loading: false,
                    url: await blobToBase64(e),
                    _id: selectedBg._id,
                    backgroundRemoved: true,
                  },
                },
                "*"
              );
            });
          });

          break;
      }
    },
    [selectedText]
  );

  const loadWebFont = async () => {
    const WebFont = await import("webfontloader");
    return WebFont.load;
  };

  const loadDesireFont = async () => {
    return new Promise(async (resolve, reject) => {
      await loadWebFont().then((WebFontLoader) => {
        WebFontLoader({
          google: {
            families: [
              "Roboto",
              "Hammersmith One",
              "Ultra",
              "Pacifico",
              "Lobster",
              "Oswald",
              "Montserrat",
              "Poppins",
              "Raleway",
              "Anton",
              "Bebas Neue",
              "Playfair Display",
              "Ubuntu",
              "Merriweather",
              "Open Sans",
              "Catamaran",
              "Shadows Into Light",
              "Dancing Script",
              "Josefin Sans",
              "Nunito",
              "Fira Sans",
              "Work Sans",
              "Kanit",
              "Exo 2",
              "Source Sans Pro",
              "Quicksand",
              "Great Vibes",
              "Amatic SC",
              "Indie Flower",
              "Cinzel",
              "Abril Fatface",
              "Righteous",
              "Teko",
              "Zilla Slab",
              "Fredoka One",
              "Signika",
              "Archivo Black",
            ],
          },
          active: () => {
            resolve();
          },
          inactive: () => {
            reject();
          },
        });
      });
    });
  };

  useEffect(() => {
    loadDesireFont();
    window.addEventListener("message", EventFunc);
    window.addEventListener("error", function (event) {
      if (
        event.message.includes(
          "Cannot read properties of undefined (reading 'object')"
        ) ||
        event.message.includes("Cannot read properties of null (reading 'uv')")
      ) {
        event.preventDefault();
      }
    });
    return () => window.removeEventListener("message", EventFunc);
  }, []);

  //   initializing canvas in ref
  useEffect(() => {
    canvas.current = initCanvas();
  }, []);
  //  setting state for offset of canvas
  useEffect(() => {
    canvas.current._offset && setcanvasOffset(canvas.current._offset);
  }, [canvas.current]);

  const getWidth = (temp_Obj) => {
    let tempcanvas = document.createElement("canvas");
    var context = tempcanvas.getContext("2d");
    context.font = `${temp_Obj.fontSize}px ${temp_Obj.fontFamily}`;
    var metrics = context.measureText(temp_Obj.text);
    return metrics;
  };

  return (
    <ContextTool.Provider
      value={{
        UpdateText,
        selectedText,
        canvas: canvas.current,
        addTextLayer,
        canvasOffset,
        selectedObject,
        changeColor,
        addImageLayer,
        updateImage,
        selectedImage,
        update,
        setupdate,
        unsportedDevice: unsportedDevice.current,
        smScreen,
        updateTextureFunc,
        imagesDisplayed,
        setimagesDisplayed,
        animatedCanvas,
        setanimatedCanvas,
        textsCanvas,
        setTextsCanvas,
        selectedModel,
        threeCanvas,
        orbitRef,
      }}
    >
      {children}
    </ContextTool.Provider>
  );
}

export default Mainstatetool;

export { ContextTool };



