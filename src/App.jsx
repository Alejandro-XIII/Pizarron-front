import React, { useEffect,useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { Client } from "@stomp/stompjs"

export default function App(){
  const myCanvas = useRef(null);
  const [colorPincel, setColorPincel] = useState("black");
  const [dibujo, setDibujo] = useState({"lines":[],"width":500,"height":500});

  useEffect (()=> {
    const cliente = new Client({
      brokerURL: 'ws://localhost:8080/websocket' 
    })

    cliente.onConnect = () => {
      console.log('Conectado');
      cliente.subscribe('/pizarron/dibujo', (m) => {
        const nuevoDibujo = JSON.parse(m.body);
        setDibujo(nuevoDibujo);
      });
    }

    cliente.activate()
     return () => {
      if(cliente) {
       cliente.deactivate()
      }
    }
  },[])
    

  const guardar = () => {
    const dataCanvas = myCanvas.current.getSaveData();
    console.log(dataCanvas);
  };

  const borrar = () => {
    myCanvas.current.clear();
  };

  const cambiarColor = (nuevoColor) => {
    setColorPincel(nuevoColor);
  };

  return(
    <div>
      <button
        onClick={guardar}
        style={{
          backgroundColor: "green",
          position: "relative",
          transform: "translate(610px, 300px)",
        }}
      >
        Guardar
      </button>
      <button
        onClick={borrar}
        style={{
          backgroundColor: "red",
          position: "relative",
          transform: "translate(410px, 300px)",
        }}
      >
        Borrar
      </button>
      <button
        onClick={() => cambiarColor("red")}
        style={{
          backgroundColor: "red",
          position: "relative",
          transform: "translate(325px, 150px)",
          width: "50px",
          height: "50px",
        }}
      ></button>
      <button
        onClick={() => cambiarColor("green")}
        style={{
          backgroundColor: "green",
          position: "relative",
          transform: "translate(330px, 150px)",
          width: "50px",
          height: "50px",
        }}
      ></button>
      <button
        onClick={() => cambiarColor("blue")}
        style={{
          backgroundColor: "blue",
          position: "relative",
          transform: "translate(335px, 150px)",
          width: "50px",
          height: "50px",
        }}
      ></button>
      <button
        onClick={() => cambiarColor("black")}
        style={{
          backgroundColor: "black",
          position: "relative",
          transform: "translate(340px, 150px)",
          width: "50px",
          height: "50px",
        }}
      ></button>
      <span
        style={{
          position: "relative",
          top: "100px", 
          left: "120px", 
          fontSize: "40px",
          color: "white",
        }}
      >
        Cambiar color
      </span>
      <CanvasDraw
        brushRadius={1.5}
        brushColor={colorPincel}
        catenaryColor={colorPincel}
        hideGrid={true}
        canvasWidth={500}
        canvasHeight={500}
        ref={myCanvas}
      />
    </div>
  )
}