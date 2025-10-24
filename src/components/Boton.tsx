import React from "react";
import "../style/boton.css";


interface BotonProps {
  texto: string; 
  onClick?: () => void; 
  tipo?: "primario" | "secundario" | "peligro";
}

const Boton: React.FC<BotonProps> = ({ texto, onClick, tipo = "primario" }) => {
  return (
    <button className={`boton ${tipo}`} onClick={onClick}>
      {texto}
    </button>
  );
};

export default Boton;