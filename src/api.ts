import axios from "axios";
import type { A02ResultadoDTO } from "./dto/A02.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function getA02(codArt: string, fechaIni: string, fechaFin: string) {
  const r = await api.get<A02ResultadoDTO>("/api/informes/a02", {
    params: { codArt, 
              fechaIni, 
              fechaFin },
  });
  return r.data;
}

