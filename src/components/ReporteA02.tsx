import React from "react";
import type {
  A02ResultadoDTO,
  A02CabeceraDTO,
  AlmacenLineaDTO,
} from "../dto/A02.types";
import "../style/ReporteA02.css";

// Formatear número o "—" si es null/undefined
const n = (v: number | null | undefined, d = 1) =>
  v === null || v === undefined
    ? "–"
    : new Intl.NumberFormat("en-EN", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      }).format(v);

const fmtK = (v: number | null, d = 0) => (v == null ? "–" : v.toFixed(d));

const nBlankZero = (v: number | null | undefined, d = 0) =>
  v === null || v === undefined
    ? "–"
    : Number(v) === 0
    ? ""
    : new Intl.NumberFormat("en-EN", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      }).format(Number(v));

// Formatear texto o "—" si es null/undefined/empty
const t = (v?: string | null) => (v?.trim() ? v : "–");

export default function ReportA02(
{
  data, 
  filtros,
}: {
  data: A02ResultadoDTO | null;
  filtros: 
    { 
      codArt: string; 
      fechaIni: string; 
      fechaFin: string 
    };
}) {
  const cab: A02CabeceraDTO | null = data?.cabecera ?? null;
  const lineas: AlmacenLineaDTO[] = data?.lineas ?? [];

  const metas = data?.almacenes ?? [];
  const orden = metas.map(a => a.codigo);

  const cols = orden.filter((a) => lineas.some((l) => l.almacen === a));
  const por: Record<string, AlmacenLineaDTO> = Object.fromEntries(
    cols.map((c) => [c, lineas.find((l) => l.almacen === c)!])
  );

  /* = = = = = = = = = CALCULOS PRIMERA FILA = = = = = = = = = */
  function calcRatio<K extends keyof AlmacenLineaDTO>
  (
    lin: AlmacenLineaDTO | undefined,
    afcant: number | null | undefined,
    field: K
  ) 
  {
    const afc = Number(afcant ?? 0);
    const num = Number(lin?.[field] ?? 0);
    if (!lin || afc <= 0 || !isFinite(num)) return null;
    return num / afc;
  }

  function calcDS(lin: AlmacenLineaDTO | undefined) 
  {
    const sal = Number(lin?.salidas ?? 0);
    if (sal <= 0) return null;

    const stock = Number(lin?.stockFinal ?? 0);
    const pte   = Number(lin?.pendienteRecibir ?? 0); 
    const tpte  = Number(lin?.pendienteServir  ?? 0); 

    return (stock + pte + tpte) / (sal / 365);
  }

  const K = (cod: string) => calcRatio(por[cod], cab?.afcant, "salidas");

  function daysInclusiveUTC(iniISO: string, finISO: string) {
  const [yi, mi, di] = iniISO.split("-").map(Number); 
  const [yf, mf, df] = finISO.split("-").map(Number);

  const ini = Date.UTC(yi, (mi ?? 1) - 1, di ?? 1);
  const fin = Date.UTC(yf ?? yi, (mf ?? mi) - 1, df ?? di);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.floor((fin - ini) / msPerDay) + 1;
  return Math.max(1, diff);
}

const diasFinal = daysInclusiveUTC(filtros.fechaIni, filtros.fechaFin);
  
  return (
    <div className="page">
      <div className="sheet">
        <div className="cabecera">
            <div className="superior">
                <div className="nombre">
                    <p>Lorenzo<span className="badge" /></p> 
                    <p style={{color:"red"}}>Cardenas <span className="badge" /></p> 
                    <p style={{color:"#0039ff"}}>A. Zafra <span className="badge" /></p> 
                    <p style={{color:"rgb(0, 128, 0)"}}>A. Luque <span className="badge" /></p> 
                    <p>Lorenzo<span className="badge" /></p> 
                </div>
                
                <div className="infoGeneral">
                    <div className="tituloInfo">
                        <p>Propuesta Pedido de Central-Cash</p>
                    </div>

                    <div className="comprador">
                        <div><p id="titu">Comprador: </p></div>
                        <div><p id="nomCom">{t(cab?.comprador)}</p></div>
                    </div>
                    
                    <div className="meta">
                        <p>{new Date().toLocaleDateString("es-ES")}</p>

                        <p>
                            {new Date().toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                        <p style={{marginRight:"30pt"}}>Página 1 de 1</p>
                    </div>
                </div>
            </div>

            <div className="inferior">
                <div className="provInfo">
                    <p>Prov.</p>
                    <p id="provInfo"> {t(cab?.pdmayo)} {t(cab?.pdctaa)}&nbsp;&nbsp;&nbsp; - {t(cab?.proveedor)}</p>
                </div>

                <div className="responsable">
                    <p>{t(cab?.observa)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t(cab?.observa01)}</p>
                </div>
            </div>

        </div> {/* fin cabecera */}

        <div className="cuerpo">
          <div className="columTit">
            <div id="col1">
              <div id="pCod">Codigo</div>
              <div id="pArt">Articulo</div>
            </div>
            <div id="col2">
              <div>U/C</div>
              <div style={{marginLeft:"2.2pt"}}>Venta<br/>Total</div>
              <div style={{marginLeft:"7.6pt"}}>Vta.<br/>Ser.</div>
              <div style={{marginLeft:"11pt"}}>Vta.<br/>Cen</div>
              <div>Cen<br/>Cash</div>
              <div style={{fontWeight:"lighter", marginLeft:"5pt"}}>base</div>
              <div style={{fontWeight:"lighter"}}>alt.</div>
            </div>
            <div id="col3">
              {metas.map(a => (
                <div key={a.codigo}>
                  <p>{a.nombre}<br />{a.codigo}</p>
                </div>
              ))}
            </div>
          </div> {/* fin fila de titulos */}

          <div className="datos">
            <div id="artData">
              <div className="row">
                <div id="codArt">{t(cab?.arcodi)}</div>
                <div id="nomArt">{t(cab?.ardesc)}</div>
              </div>
              <div className="row alta">
                <p>Alta</p>
                <p id="altaData">{t(cab?.fechaAlta)}&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t(cab?.stubex)}</p>
              </div>
              <div className="row ean">
                <p id="eanTxt">Ean</p>
                <p id="eanData">{t(cab?.ean)}</p>
              </div>
              <div className="row ifa">
                <p>Oferta Ifa</p>
              </div>
              <div className="row fecDH">
                <p>Fecha D/H</p>
              </div>
              <div className="row diasCad">
                <p>Días Cad.</p>
                <p id="numDiasCad">{t(cab?.diasCaducidad)}</p>
                <p id="stock">Stock Seg.</p>
                <p id="numStock">{n(cab?.stMinuCalc)}</p>
              </div>
              <div className="row ofertaPart">
                <p>Oferta Particular:</p>
              </div>
              <div className="row p19Des">
                <p>{t(cab?.p19Des)}</p>
              </div>
              <div className="row fecDH">
                <p>Fecha D/H: </p>
                <p className="fecDHValue">{t(cab?.fecdesdep)}&nbsp;&nbsp;{t(cab?.fechastap)}</p>
                <p id="existeCash"></p>
              </div>
              <div className="row fecCadPicking">
                <p>Fecha Caducidad Picking Central: </p>
                <p id="fecCadPickingValue">{t(cab?.cadsema)}</p>
              </div>
            </div>
            <div id="genData">
              <div className="row tam">
                <div id="lblTAM">T.A.M.</div>
                <div id="valAfcant"><p>{n(cab?.afcant)}</p></div>
                <div id="valVentaTotal"><p>{n(cab?.ventaTotal, 0)}</p></div>
                <div id="valVtaSer"><p>{n(cab?.vtaSer, 0)}</p></div>
                <div id="valVtaCen"><p>{n(cab?.vtaCen, 0)}</p></div>
                <div id="valCenCash"><p>{n(cab?.cenCash, 0)}</p></div>
                <div id="valBaseAltura"><p>{t(cab?.baseAltura)}</p></div>
              </div>
              <div className="row stock">
                <p>Stock:</p>
                <div id="valTotalStock">
                  <p>{nBlankZero(cab?.totalStock, 0)}</p>
                </div>
                <div id="stockCentral">
                  <p>{nBlankZero(cab?.stockCentral, 1)}</p>
                </div>
                <p style={{color:"rgb(0, 128, 0)", marginLeft:"10px"}}>T.Cash: </p>
                <div id="stockCash">
                  <p>{nBlankZero(cab?.stockCash, 0)}</p>
                </div>
              </div>
              <div className="row">
                <p title="Días Stock">D.S.</p>
                <div id="diaStock">
                  <p>{n(cab?.diaStock, 0)}</p>
                </div>
                <div id="diasStockCentral">
                  <p>{n(cab?.diasStockCentral, 0)}</p>
                </div>
                <div id="diasStockCash">
                  <p>{n(cab?.diasStockCash, 0)}</p>
                </div>
              </div>
              <div className="row">
                <p>Precio Oferta</p>
                <div id="a9ot06">
                  <p>{n(cab?.a9ot06, 2)}</p>
                </div>
              </div>
              <div className="row">
                <p>Precio</p>
                <div id="artt06">
                  <p>{n(cab?.artt06, 2)}</p>
                </div>
              </div>
              <div className="row">
                <p id="valOrisco">{t(cab?.oricosto)}&nbsp;&nbsp;-&nbsp;&nbsp;{n(cab?.costo3, 3)}</p>
                <div id="margenCentral">
                  <p>{n(cab?.margenCentral, 2)}</p>
                </div>
              </div>
              <div className="row">
                <p>Pte. Prov.</p>
                <div id="totalPteProv">
                  <p>{nBlankZero(cab?.totalPteProv,0)}</p>
                </div>
                <div id="stsppu">
                  <p>{nBlankZero(cab?.stsppu, 0)}</p>
                </div>
              </div>
              <div className="row">
                <p>Pte. Central</p>
                <div id="totalPteCent">
                  <p>{nBlankZero(cab?.totalPteCent,0)}</p>
                </div>
              </div>
              <div className="row">
                <p>5 Millones</p>
                <p id="total5M">{nBlankZero(cab?.total5M, 0)}</p>
              </div>
              <div className="row">
                <p>F.E.</p>
                <div id="valFECentral">
                  <p>{t(cab?.valFECentral)}</p>
                </div>
              </div>
              <div className="row">
                <div className={`ValTotalDiaIni ${((cab?.totalDiaIni ?? 0) < 0) ? "valNegativo" : "valPositivo"}`}>
                  <p>{n(cab?.totalDiaIni, 1)}</p>
                </div>
                <div className={`valCentralDiaIni ${((cab?.valCentralDiaIni ?? 0) < 0) ? "valNegativo" : "valPositivo"}`}>
                  <p>{n(cab?.valCentralDiaIni, 1)}</p>
                </div>
                <div id="PInic">
                  <p>P.Inic.</p>
                </div>
                <div id="valPFinIni">
                  <p>1</p>
                </div>
              </div>
              <div className="row">
                <p>&nbsp;</p>
                <div className={`ValExiste ${((por["001"] as any)?.valExiste === "-" ? "baja" : "")}`}>
                      {(por["001"] as any)?.valExiste || ""}
                </div> 
              </div>
              <div className="row">
                <div className={`ValTotalDiaFin ${((cab?.totalDiaFin ?? 0) < 0) ? "valNegativo" : "valPositivo"}`}>
                  <p>{n(cab?.totalDiaFin, 1)}</p>
                </div>
                <div className={`valCentralDiaFin ${((cab?.valCentralDiaFin ?? 0) < 0) ? "valNegativo" : "valPositivo"}`}>
                  <p>{n(cab?.valCentralDiaFin, 1)}</p>
                </div>
                <div id="PFin">
                  <p>P.Final</p>
                </div>
                <div id="valPFinIni">
                  <p>{diasFinal}</p>
                </div>
              </div>
            </div>
            <div id="almData">
              {orden.map((cod, i) => {
                const lin  = por[cod];
                const kVal = K(cod);
                const stVal = calcRatio(lin, cab?.afcant, "stockFinal");
                const dsVal = calcDS(lin);

                return (
                  <div key={cod} className="Col" style={i === 0 ? {borderLeft: "#b4b2b2 1pt solid"} : undefined}>
                    <div className="ValTAM">{fmtK(kVal, 0)}</div>
                    <div className="ValStock">{nBlankZero(stVal, 1)}</div>
                    <div className="valDS">{fmtK(dsVal, 0)}</div>
                    <div className="ValOfer">{n((por[cod] as any)?.precioOferta, 2)}</div>
                    <div className="ValPrec">{n((por[cod] as any)?.precioBase, 2)}</div>
                    <div className="ValMargen">{n((por[cod] as any)?.valMargen, 2)}</div> 
                    <div className="ValPteProv">{nBlankZero(por[cod]?.valPteProv, 0)}</div>
                    <div className="ValPteCent">{nBlankZero(por[cod]?.valPteCent, 0)}</div>
                    <div className="Val5M">{nBlankZero(por[cod]?.val5M, 0)}</div>
                    <div className="ValFE">{t((por[cod] as any)?.valFE)}</div>

                    <div className={`ValCantX ${(por[cod] as any)?.valCantX < 0 ? "valNegativo" : "valPositivo"}`}>
                      {n((por[cod] as any)?.valCantX, 1)}
                    </div>

                    <div className={`ValExiste ${((por[cod] as any)?.valExiste === "-" ? "baja" : "")}`}>
                      {(por[cod] as any)?.valExiste || ""}
                    </div>

                    <div className={`ValCantY ${(por[cod] as any)?.valCantY < 0 ? "valNegativo" : "valPositivo"}`}>
                      {n((por[cod] as any)?.valCantY, 1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pie">
            <div className="fPie">
              <div className="titPie"><p>Total Pedidos 5 M.</p></div>
              <div id="total5MPie"><p>{nBlankZero(cab?.total5M, 0)}</p></div>
              <div id="M5Data">
                <div><p>{nBlankZero(por["170"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["020"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["160"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["030"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["050"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["060"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["070"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["080"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["090"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["100"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["110"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["120"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["130"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["180"]?.val5M)}</p></div>
                <div><p>{nBlankZero(por["150"]?.val5M)}</p></div>
              </div>
            </div>
            <div className="fPie">
              <div className="titPie"><p>Total Valor Euros Pedidos 5 M.</p></div>
              <div id="total5MPie"><p>{nBlankZero(cab?.valEuros5M, 0)}</p></div>
              <div id="M5Data">
                <div><p>{nBlankZero(por["170"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["020"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["160"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["030"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["050"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["060"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["070"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["080"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["090"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["100"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["110"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["120"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["130"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["180"]?.eu5m)}</p></div>
                <div><p>{nBlankZero(por["150"]?.eu5m)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
