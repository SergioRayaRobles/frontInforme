export type Nullable<T> = T | null;

export interface A02CabeceraDTO {

  pdmayo?: string | null;
  pdctaa?: string | null;
  pddivi?: string | null;
  arcodi?: string | null;
  ardesc?: string | null;
  proveedor?: string | null;
  comprador?: string | null;

  observa?: string | null;
  observa01?: string | null;
  fechaAlta?: string | null;
  stubex?: string | null;
  ean?: string | null;
  diasCaducidad?: string | null;
  stMinuCalc?: number | null;
  p19Des?: string | null;
  cadsema?: string | null;
  
  fecdesdep?: string | null;
  fechastap?: string | null;

  totalSali?: number | null;
  afcant: number;
  dias020: number;
  horizonteInicialDias: number;
  horizonteFinalDias: number;
  totalPropuestaInicial?: number | null;
  totalPropuestaFinal?: number | null;
  tCash?: number | null;
  costo?: number | null;
  costo3?: number | null;
  oricosto?: string | null;
  ventaTotal?: number | null;
  vtaSer?: number | null;
  vtaCen?: number | null;
  cenCash?: number | null;

  baseAltura?: string | null;
  totalStock?: number | null;
  totalPteProv?: number | null;
  totalPteCent?: number | null;
  total5M?: number | null;
  totalDiaIni ?: number | null;
  totalDiaFin ?: number | null;
  diaStock?: number | null;
  diasStockCentral?: number | null;
  stockCentral?: number | null;

  a9ot06?: number | null;
  artt06?: number | null;
  margenCentral?: number | null;
  stsppu?: number | null;
  valFECentral?: string | null;
  valCentralDiaIni?: number | null;
  valCentralDiaFin?: number | null;
  stockCash?: number | null;
  diasStockCash?: number | null;

  valEuros5M?: number | null;
}

export interface AlmacenLineaDTO {
  almacen: string;
  stockInicial: number;
  entradas: number;
  salidas: number;
  stockFinal: number;
  pendienteServir: number;
  pendienteRecibir: number;
  ant: number;
  propuestaInicial: number;
  propuestaFinal: number;

  precioOferta?: number | null;
  precioBase?: number | null;
  valMargen?: number | null;
  valPteProv?: number | null;
  valPteCent?: number | null;
  val5M?: number | null;
  valFE?: string | null;

  valCantX: number;
  valCantY: number;

  eu5m?: number | null;
}

export interface A02ResultadoDTO {
  codArt: string;
  cabecera?: Nullable<A02CabeceraDTO>;
  lineas: AlmacenLineaDTO[];
  almacenes: AlmacenMetaDTO[];
}

export interface AlmacenMetaDTO {
  codigo: string;
  nombre: string;
  orden: number;
  tarifa?: number | null;
}
