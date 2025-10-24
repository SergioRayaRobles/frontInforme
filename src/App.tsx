import { useState } from "react";
import { getA02 } from "./api";
import ReportA02 from "./components/ReporteA02";
import Boton from "./components/Boton";
import type { A02ResultadoDTO } from "./dto/A02.types";

type View = "form" | "report";

export default function App() {
  const [view, setView] = useState<View>("form");

  const [codArt, setCodArt] = useState("100800");
  const [fechaIni, setFechaIni] = useState("2025-10-01");
  const [fechaFin, setFechaFin] = useState("2025-10-30");

  const [data, setData] = useState<A02ResultadoDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErr(null);
      setLoading(true);
      const resp = await getA02(codArt, fechaIni, fechaFin);
      setData(resp);
      setView("report");

    } catch (ex: any) {
      setErr(ex?.response?.data ?? ex?.message ?? "Error");
      setData(null);

    } finally {
      setLoading(false);

    }
  }

  return (
    <div className="app-wrap">
      {view === "form" && (
        <form className="form" onSubmit={onSubmit}>
          <h1 className="form-title">Generar informe A02</h1>
          <div className="f-grid">
            <label>
              <span>Código de producto</span>
              <input value={codArt} onChange={(e) => setCodArt(e.target.value)} placeholder="p.ej. 100800" />
            </label>
            <label>
              <span>Fecha inicial</span>
              <input type="date" value={fechaIni} onChange={(e) => setFechaIni(e.target.value)} />
            </label>
            <label>
              <span>Fecha final</span>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Consultando…" : "Generar informe"}
          </button>
          {err && <div className="err">Atención! "{String(err)}"</div>}
        </form>
      )}

      {view === "report" && ( //Cuando se añadan más informes, cambiar esta condición
        <>
          <div className="toolbar">
            <div>
              <button className="btn btn-secondary" onClick={() => setView("form")}>← Volver</button>
              <Boton texto="Imprimir" tipo="primario" onClick={() => window.print()} />
            </div>
            <div className="toolbar-info">
              <span>Código: <b>{codArt}</b></span>
              <span>Rango: <b>{fechaIni}</b> → <b>{fechaFin}</b></span>
            </div>
          </div>
          <ReportA02 data={data} filtros={{ codArt, fechaIni, fechaFin }} />
        </>
      )}
    </div>
  );
}
