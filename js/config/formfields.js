// Toda la configuración y mapeo de campos de tus 3 formularios

export const mapaFormularios = {
  form1: ["viewParte1", "viewParte2", "viewParte3", "viewParte4", "viewParteChecklist"],
  form2: ["viewPuestaServicio"],
  form3: ["viewCambioAjuste", "viewCambioAjuste2"]
};

export const vistasProtegidas = [
  "viewParte1", "viewParte2", "viewParte3", "viewParteChecklist",
  "viewCambioAjuste", "viewCambioAjuste2", "viewPuestaServicio"
];

// ============================================
// FORMULARIO 1: Protocolo de Pruebas (PP)
// ============================================
export const CAMPOS_FORMULARIO_PP = [
    "CodigoUnico","sed","alim","nodofinal","enlace","FormatoListaVerificacion","circuito","fecha","semana","hora","tension","Celda","equipo","tipoprueba","kardexrele","marcarele",
    "modelorele","serierele","seriereleSAP","CapacidadR","CapacidadT","VnRele","AlimentacionRele","AnioFabricacionRele","kardexequipo","marcaequipo","modeloequipo","tipoInstalacion","Tiporele","serieequipo",
    "serieequipoSAP","Inominal","ruptura","Tnominal","extincion","AnioFabricacionEquipo","ModemPP","IPRelePP","IPRouterPP","marcatoroidal","ClaseToroidal","RelConectToroidal","marcaTC","InstalacionTC","ClaseTC","InomPrim","InomSec",
    "RelConectTC","marcaTT","ClaseTT","VnomPrim","VnomSec","RelConectTT","Antiferrorresonante","CurvaRecomendado51P","IPrimRecomendado51P","ISecRecomendado51P","TMSRecomendado51P","Recomendado3Uo51P",
    "ForwardRecomendado51P","AnguloRecomendado51P","CurvaRealizado51P","IPrimRealizado51P","ISecRealizado51P","TMSRealizado51P","Realizado3Uo51P","ForwardRealizado51P","AnguloRealizado51P",
    "CurvaRecomendado50P1","IPrimRecomendado50P1","ISecRecomendado50P1","TMSRecomendado50P1","Recomendado3Uo50P1","ForwardRecomendado50P1","AnguloRecomendado50P1","CurvaRealizado50P1",
    "IPrimRealizado50P1","ISecRealizado50P1","TMSRealizado50P1","Realizado3Uo50P1","ForwardRealizado50P1","AnguloRealizado50P1","CurvaRecomendado50P2","IPrimRecomendado50P2","ISecRecomendado50P2",
    "TMSRecomendado50P2","CurvaRealizado50P2","IPrimRealizado50P2","ISecRealizado50P2","TMSRealizado50P2","CurvaRecomendado50P3","IPrimRecomendado50P3","ISecRecomendado50P3","TMSRecomendado50P3",
    "CurvaRealizado50P3","IPrimRealizado50P3","ISecRealizado50P3","TMSRealizado50P3","CurvaRecomendado51N","IPrimRecomendado51N","ISecRecomendado51N","TMSRecomendado51N","CurvaRealizado51N","IPrimRealizado51N",
    "ISecRealizado51N","TMSRealizado51N","Medicion51N","CurvaRecomendado50N","IPrimRecomendado50N","ISecRecomendado50N","TMSRecomendado50N","CurvaRealizado50N","IPrimRealizado50N","ISecRealizado50N","TMSRealizado50N","Medicion50N","CurvaRecomendado67N1",
    "IPrimRecomendado67N1","ISecRecomendado67N1","TMSRecomendado67N1","Recomendado3Uo67N1","ForwardRecomendado67N1","AnguloRecomendado67N1","CurvaRealizado67N1","IPrimRealizado67N1",
    "ISecRealizado67N1","TMSRealizado67N1","Realizado3Uo67N1","ForwardRealizado67N1","AnguloRealizado67N1","Medicion67N1","CurvaRecomendado67N2","IPrimRecomendado67N2","ISecRecomendado67N2",
    "TMSRecomendado67N2","Recomendado3Uo67N2","ForwardRecomendado67N2","AnguloRecomendado67N2","CurvaRealizado67N2","IPrimRealizado67N2","ISecRealizado67N2","TMSRealizado67N2",
    "Realizado3Uo67N2","ForwardRealizado67N2","AnguloRealizado67N2","Medicion67N2","CurvaRecomendado46","IPrimRecomendado46","ISecRecomendado46","TMSRecomendado46","CurvaRealizado46","IPrimRealizado46",
    "ISecRealizado46","TMSRealizado46","CurvaRecomendado59N1","TMSRecomendado59N1","Recomendado3Uo59N1","CurvaRealizado59N1","TMSRealizado59N1","Realizado3Uo59N1","CurvaRecomendado59N2",
    "TMSRecomendado59N2","Recomendado3Uo59N2","CurvaRealizado59N2","TMSRealizado59N2","Realizado3Uo59N2","FRCorriente51P1","FRTiempo51P1","FRCorriente51P2","FRTiempo51P2","FRCorriente51P3",
    "FRTiempo51P3","FSCorriente51P1","FSTiempo51P1","FSCorriente51P2","FSTiempo51P2","FSCorriente51P3","FSTiempo51P3","FTCorriente51P1","FTTiempo51P1","FTCorriente51P2","FTTiempo51P2","FTCorriente51P3",
    "FTTiempo51P3","FNCorriente51P1","FNTiempo51P1","FNCorriente51P2","FNTiempo51P2","FNCorriente51P3","FNTiempo51P3","FRCorriente50P11","FRTiempo50P11","FRCorriente50P12","FRTiempo50P12","FRCorriente50P13",
    "FRTiempo50P13","FSCorriente50P11","FSTiempo50P11","FSCorriente50P12","FSTiempo50P12","FSCorriente50P13","FSTiempo50P13","FTCorriente50P11","FTTiempo50P11","FTCorriente50P12","FTTiempo50P12","FTCorriente50P13",
    "FTTiempo50P13","FNCorriente50P11","FNTiempo50P11","FNCorriente50P12","FNTiempo50P12","FNCorriente50P13","FNTiempo50P13","FRCorriente50P21","FRTiempo50P21","FRCorriente50P22","FRTiempo50P22","FRCorriente50P23",
    "FRTiempo50P23","FSCorriente50P21","FSTiempo50P21","FSCorriente50P22","FSTiempo50P22","FSCorriente50P23","FSTiempo50P23","FTCorriente50P21","FTTiempo50P21","FTCorriente50P22","FTTiempo50P22","FTCorriente50P23",
    "FTTiempo50P23","FNCorriente50P21","FNTiempo50P21","FNCorriente50P22","FNTiempo50P22","FNCorriente50P23","FNTiempo50P23","FRCorriente50P31","FRTiempo50P31","FRCorriente50P32","FRTiempo50P32","FRCorriente50P33",
    "FRTiempo50P33","FSCorriente50P31","FSTiempo50P31","FSCorriente50P32","FSTiempo50P32","FSCorriente50P33","FSTiempo50P33","FTCorriente50P31","FTTiempo50P31","FTCorriente50P32","FTTiempo50P32","FTCorriente50P33",
    "FTTiempo50P33","FNCorriente50P31","FNTiempo50P31","FNCorriente50P32","FNTiempo50P32","FNCorriente50P33","FNTiempo50P33","FRCorriente51N1","FRTiempo51N1","FRCorriente51N2","FRTiempo51N2","FRCorriente51N3",
    "FRTiempo51N3","FSCorriente51N1","FSTiempo51N1","FSCorriente51N2","FSTiempo51N2","FSCorriente51N3","FSTiempo51N3","FTCorriente51N1","FTTiempo51N1","FTCorriente51N2","FTTiempo51N2","FTCorriente51N3","FTTiempo51N3",
    "FNCorriente51N1","FNTiempo51N1","FNCorriente51N2","FNTiempo51N2","FNCorriente51N3","FNTiempo51N3","FRCorriente50N1","FRTiempo50N1","FRCorriente50N2","FRTiempo50N2","FRCorriente50N3","FRTiempo50N3","FSCorriente50N1",
    "FSTiempo50N1","FSCorriente50N2","FSTiempo50N2","FSCorriente50N3","FSTiempo50N3","FTCorriente50N1","FTTiempo50N1","FTCorriente50N2","FTTiempo50N2","FTCorriente50N3","FTTiempo50N3","FNCorriente50N1","FNTiempo50N1",
    "FNCorriente50N2","FNTiempo50N2","FNCorriente50N3","FNTiempo50N3","FRCorriente67N11","FR3Uo67N11","FRTiempo67N11","FRCorriente67N12","FR3Uo67N12","FRTiempo67N12","FRCorriente67N13","FR3Uo67N13","FRTiempo67N13",
    "FSCorriente67N11","FS3Uo67N11","FSTiempo67N11","FSCorriente67N12","FS3Uo67N12","FSTiempo67N12","FSCorriente67N13","FS3Uo67N13","FSTiempo67N13","FTCorriente67N11","FT3Uo67N11","FTTiempo67N11","FTCorriente67N12",
    "FT3Uo67N12","FTTiempo67N12","FTCorriente67N13","FT3Uo67N13","FTTiempo67N13","FNCorriente67N11","FN3Uo67N11","FNTiempo67N11","FNCorriente67N12","FN3Uo67N12","FNTiempo67N12","FNCorriente67N13","FN3Uo67N13","FNTiempo67N13",
    "FRCorriente67N21","FR3Uo67N21","FRTiempo67N21","FRCorriente67N22","FR3Uo67N22","FRTiempo67N22","FRCorriente67N23","FR3Uo67N23","FRTiempo67N23","FSCorriente67N21","FS3Uo67N21","FSTiempo67N21","FSCorriente67N22","FS3Uo67N22",
    "FSTiempo67N22","FSCorriente67N23","FS3Uo67N23","FSTiempo67N23","FTCorriente67N21","FT3Uo67N21","FTTiempo67N21","FTCorriente67N22","FT3Uo67N22","FTTiempo67N22","FTCorriente67N23","FT3Uo67N23","FTTiempo67N23","FNCorriente67N21",
    "FN3Uo67N21","FNTiempo67N21","FNCorriente67N22","FN3Uo67N22","FNTiempo67N22","FNCorriente67N23","FN3Uo67N23","FNTiempo67N23","FRCorriente461","FRTiempo461","FRCorriente462","FRTiempo462","FRCorriente463","FRTiempo463","FSCorriente461",
    "FSTiempo461","FSCorriente462","FSTiempo462","FSCorriente463","FSTiempo463","FTCorriente461","FTTiempo461","FTCorriente462","FTTiempo462","FTCorriente463","FTTiempo463","FNCorriente461","FNTiempo461","FNCorriente462","FNTiempo462",
    "FNCorriente463","FNTiempo463","FRTension59N11","FRTiempo59N11","FRTension59N12","FRTiempo59N12","FRTension59N13","FRTiempo59N13","FSTension59N11","FSTiempo59N11","FSTension59N12","FSTiempo59N12","FSTension59N13","FSTiempo59N13",
    "FTTension59N11","FTTiempo59N11","FTTension59N12","FTTiempo59N12","FTTension59N13","FTTiempo59N13","FNTension59N11","FNTiempo59N11","FNTension59N12","FNTiempo59N12","FNTension59N13","FNTiempo59N13","FRTension59N21","FRTiempo59N21",
    "FRTension59N22","FRTiempo59N22","FRTension59N23","FRTiempo59N23","FSTension59N21","FSTiempo59N21","FSTension59N22","FSTiempo59N22","FSTension59N23","FSTiempo59N23","FTTension59N21","FTTiempo59N21","FTTension59N22","FTTiempo59N22",
    "FTTension59N23","FTTiempo59N23","FNTension59N21","FNTiempo59N21","FNTension59N22","FNTiempo59N22","FNTension59N23","FNTiempo59N23","ActivacionArranqueFallas","AnguloPolarizacion","Observaciones", "Pregunta1","Pregunta2","Pregunta3",
    "Pregunta4","Pregunta5","Pregunta6","Pregunta7","Pregunta8","Pregunta9","Pregunta10","Pregunta11","Pregunta12","Pregunta13","Pregunta14","Pregunta15","Pregunta16","Pregunta17","Pregunta18","Pregunta19","Pregunta20","Pregunta21","Pregunta22",
    "Pregunta23","Pregunta24","Pregunta25","Pregunta26","Pregunta27","Pregunta28","Pregunta29","Pregunta30","Pregunta31","TipoProteccion","OtrasObservaciones","Nombre1","CodigoLDS1","Nombre2","CodigoLDS2","Correo1","Correo2"
];

// ============================================
// FORMULARIO 1: Sin checklist
// ============================================

export const CAMPOS_FORMULARIO_PP_SC = [
    "CodigoUnico","sed","alim","nodofinal","enlace","FormatoListaVerificacion","circuito","fecha","semana","hora","tension","Celda","equipo","tipoprueba","kardexrele","marcarele",
    "modelorele","serierele","seriereleSAP","CapacidadR","CapacidadT","VnRele","AlimentacionRele","AnioFabricacionRele","kardexequipo","marcaequipo","modeloequipo","tipoInstalacion","Tiporele","serieequipo",
    "serieequipoSAP","Inominal","ruptura","Tnominal","extincion","AnioFabricacionEquipo","ModemPP","IPRelePP","IPRouterPP","marcatoroidal","ClaseToroidal","RelConectToroidal","marcaTC","InstalacionTC","ClaseTC","InomPrim","InomSec",
    "RelConectTC","marcaTT","ClaseTT","VnomPrim","VnomSec","RelConectTT","Antiferrorresonante","CurvaRecomendado51P","IPrimRecomendado51P","ISecRecomendado51P","TMSRecomendado51P","Recomendado3Uo51P",
    "ForwardRecomendado51P","AnguloRecomendado51P","CurvaRealizado51P","IPrimRealizado51P","ISecRealizado51P","TMSRealizado51P","Realizado3Uo51P","ForwardRealizado51P","AnguloRealizado51P",
    "CurvaRecomendado50P1","IPrimRecomendado50P1","ISecRecomendado50P1","TMSRecomendado50P1","Recomendado3Uo50P1","ForwardRecomendado50P1","AnguloRecomendado50P1","CurvaRealizado50P1",
    "IPrimRealizado50P1","ISecRealizado50P1","TMSRealizado50P1","Realizado3Uo50P1","ForwardRealizado50P1","AnguloRealizado50P1","CurvaRecomendado50P2","IPrimRecomendado50P2","ISecRecomendado50P2",
    "TMSRecomendado50P2","CurvaRealizado50P2","IPrimRealizado50P2","ISecRealizado50P2","TMSRealizado50P2","CurvaRecomendado50P3","IPrimRecomendado50P3","ISecRecomendado50P3","TMSRecomendado50P3",
    "CurvaRealizado50P3","IPrimRealizado50P3","ISecRealizado50P3","TMSRealizado50P3","CurvaRecomendado51N","IPrimRecomendado51N","ISecRecomendado51N","TMSRecomendado51N","CurvaRealizado51N","IPrimRealizado51N",
    "ISecRealizado51N","TMSRealizado51N","Medicion51N","CurvaRecomendado50N","IPrimRecomendado50N","ISecRecomendado50N","TMSRecomendado50N","CurvaRealizado50N","IPrimRealizado50N","ISecRealizado50N","TMSRealizado50N","Medicion50N","CurvaRecomendado67N1",
    "IPrimRecomendado67N1","ISecRecomendado67N1","TMSRecomendado67N1","Recomendado3Uo67N1","ForwardRecomendado67N1","AnguloRecomendado67N1","CurvaRealizado67N1","IPrimRealizado67N1",
    "ISecRealizado67N1","TMSRealizado67N1","Realizado3Uo67N1","ForwardRealizado67N1","AnguloRealizado67N1","Medicion67N1","CurvaRecomendado67N2","IPrimRecomendado67N2","ISecRecomendado67N2",
    "TMSRecomendado67N2","Recomendado3Uo67N2","ForwardRecomendado67N2","AnguloRecomendado67N2","CurvaRealizado67N2","IPrimRealizado67N2","ISecRealizado67N2","TMSRealizado67N2",
    "Realizado3Uo67N2","ForwardRealizado67N2","AnguloRealizado67N2","Medicion67N2","CurvaRecomendado46","IPrimRecomendado46","ISecRecomendado46","TMSRecomendado46","CurvaRealizado46","IPrimRealizado46",
    "ISecRealizado46","TMSRealizado46","CurvaRecomendado59N1","TMSRecomendado59N1","Recomendado3Uo59N1","CurvaRealizado59N1","TMSRealizado59N1","Realizado3Uo59N1","CurvaRecomendado59N2",
    "TMSRecomendado59N2","Recomendado3Uo59N2","CurvaRealizado59N2","TMSRealizado59N2","Realizado3Uo59N2","FRCorriente51P1","FRTiempo51P1","FRCorriente51P2","FRTiempo51P2","FRCorriente51P3",
    "FRTiempo51P3","FSCorriente51P1","FSTiempo51P1","FSCorriente51P2","FSTiempo51P2","FSCorriente51P3","FSTiempo51P3","FTCorriente51P1","FTTiempo51P1","FTCorriente51P2","FTTiempo51P2","FTCorriente51P3",
    "FTTiempo51P3","FNCorriente51P1","FNTiempo51P1","FNCorriente51P2","FNTiempo51P2","FNCorriente51P3","FNTiempo51P3","FRCorriente50P11","FRTiempo50P11","FRCorriente50P12","FRTiempo50P12","FRCorriente50P13",
    "FRTiempo50P13","FSCorriente50P11","FSTiempo50P11","FSCorriente50P12","FSTiempo50P12","FSCorriente50P13","FSTiempo50P13","FTCorriente50P11","FTTiempo50P11","FTCorriente50P12","FTTiempo50P12","FTCorriente50P13",
    "FTTiempo50P13","FNCorriente50P11","FNTiempo50P11","FNCorriente50P12","FNTiempo50P12","FNCorriente50P13","FNTiempo50P13","FRCorriente50P21","FRTiempo50P21","FRCorriente50P22","FRTiempo50P22","FRCorriente50P23",
    "FRTiempo50P23","FSCorriente50P21","FSTiempo50P21","FSCorriente50P22","FSTiempo50P22","FSCorriente50P23","FSTiempo50P23","FTCorriente50P21","FTTiempo50P21","FTCorriente50P22","FTTiempo50P22","FTCorriente50P23",
    "FTTiempo50P23","FNCorriente50P21","FNTiempo50P21","FNCorriente50P22","FNTiempo50P22","FNCorriente50P23","FNTiempo50P23","FRCorriente50P31","FRTiempo50P31","FRCorriente50P32","FRTiempo50P32","FRCorriente50P33",
    "FRTiempo50P33","FSCorriente50P31","FSTiempo50P31","FSCorriente50P32","FSTiempo50P32","FSCorriente50P33","FSTiempo50P33","FTCorriente50P31","FTTiempo50P31","FTCorriente50P32","FTTiempo50P32","FTCorriente50P33",
    "FTTiempo50P33","FNCorriente50P31","FNTiempo50P31","FNCorriente50P32","FNTiempo50P32","FNCorriente50P33","FNTiempo50P33","FRCorriente51N1","FRTiempo51N1","FRCorriente51N2","FRTiempo51N2","FRCorriente51N3",
    "FRTiempo51N3","FSCorriente51N1","FSTiempo51N1","FSCorriente51N2","FSTiempo51N2","FSCorriente51N3","FSTiempo51N3","FTCorriente51N1","FTTiempo51N1","FTCorriente51N2","FTTiempo51N2","FTCorriente51N3","FTTiempo51N3",
    "FNCorriente51N1","FNTiempo51N1","FNCorriente51N2","FNTiempo51N2","FNCorriente51N3","FNTiempo51N3","FRCorriente50N1","FRTiempo50N1","FRCorriente50N2","FRTiempo50N2","FRCorriente50N3","FRTiempo50N3","FSCorriente50N1",
    "FSTiempo50N1","FSCorriente50N2","FSTiempo50N2","FSCorriente50N3","FSTiempo50N3","FTCorriente50N1","FTTiempo50N1","FTCorriente50N2","FTTiempo50N2","FTCorriente50N3","FTTiempo50N3","FNCorriente50N1","FNTiempo50N1",
    "FNCorriente50N2","FNTiempo50N2","FNCorriente50N3","FNTiempo50N3","FRCorriente67N11","FR3Uo67N11","FRTiempo67N11","FRCorriente67N12","FR3Uo67N12","FRTiempo67N12","FRCorriente67N13","FR3Uo67N13","FRTiempo67N13",
    "FSCorriente67N11","FS3Uo67N11","FSTiempo67N11","FSCorriente67N12","FS3Uo67N12","FSTiempo67N12","FSCorriente67N13","FS3Uo67N13","FSTiempo67N13","FTCorriente67N11","FT3Uo67N11","FTTiempo67N11","FTCorriente67N12",
    "FT3Uo67N12","FTTiempo67N12","FTCorriente67N13","FT3Uo67N13","FTTiempo67N13","FNCorriente67N11","FN3Uo67N11","FNTiempo67N11","FNCorriente67N12","FN3Uo67N12","FNTiempo67N12","FNCorriente67N13","FN3Uo67N13","FNTiempo67N13",
    "FRCorriente67N21","FR3Uo67N21","FRTiempo67N21","FRCorriente67N22","FR3Uo67N22","FRTiempo67N22","FRCorriente67N23","FR3Uo67N23","FRTiempo67N23","FSCorriente67N21","FS3Uo67N21","FSTiempo67N21","FSCorriente67N22","FS3Uo67N22",
    "FSTiempo67N22","FSCorriente67N23","FS3Uo67N23","FSTiempo67N23","FTCorriente67N21","FT3Uo67N21","FTTiempo67N21","FTCorriente67N22","FT3Uo67N22","FTTiempo67N22","FTCorriente67N23","FT3Uo67N23","FTTiempo67N23","FNCorriente67N21",
    "FN3Uo67N21","FNTiempo67N21","FNCorriente67N22","FN3Uo67N22","FNTiempo67N22","FNCorriente67N23","FN3Uo67N23","FNTiempo67N23","FRCorriente461","FRTiempo461","FRCorriente462","FRTiempo462","FRCorriente463","FRTiempo463","FSCorriente461",
    "FSTiempo461","FSCorriente462","FSTiempo462","FSCorriente463","FSTiempo463","FTCorriente461","FTTiempo461","FTCorriente462","FTTiempo462","FTCorriente463","FTTiempo463","FNCorriente461","FNTiempo461","FNCorriente462","FNTiempo462",
    "FNCorriente463","FNTiempo463","FRTension59N11","FRTiempo59N11","FRTension59N12","FRTiempo59N12","FRTension59N13","FRTiempo59N13","FSTension59N11","FSTiempo59N11","FSTension59N12","FSTiempo59N12","FSTension59N13","FSTiempo59N13",
    "FTTension59N11","FTTiempo59N11","FTTension59N12","FTTiempo59N12","FTTension59N13","FTTiempo59N13","FNTension59N11","FNTiempo59N11","FNTension59N12","FNTiempo59N12","FNTension59N13","FNTiempo59N13","FRTension59N21","FRTiempo59N21",
    "FRTension59N22","FRTiempo59N22","FRTension59N23","FRTiempo59N23","FSTension59N21","FSTiempo59N21","FSTension59N22","FSTiempo59N22","FSTension59N23","FSTiempo59N23","FTTension59N21","FTTiempo59N21","FTTension59N22","FTTiempo59N22",
    "FTTension59N23","FTTiempo59N23","FNTension59N21","FNTiempo59N21","FNTension59N22","FNTiempo59N22","FNTension59N23","FNTiempo59N23","ActivacionArranqueFallas","AnguloPolarizacion","Observaciones", "TipoProteccion","OtrasObservaciones",
    "Nombre1","CodigoLDS1","Nombre2","CodigoLDS2","Correo1","Correo2"
];

// ============================================
// FORMULARIO 1: Campos checklist en blanco (Formulario PP)
// ============================================

export const camposChecklistPreguntas = [
    "Pregunta1","Pregunta2","Pregunta3","Pregunta4","Pregunta5","Pregunta6","Pregunta7","Pregunta8","Pregunta9","Pregunta10",
    "Pregunta11","Pregunta12","Pregunta13","Pregunta14","Pregunta15","Pregunta16","Pregunta17","Pregunta18","Pregunta19","Pregunta20",
    "Pregunta21","Pregunta22","Pregunta23","Pregunta24","Pregunta25","Pregunta26","Pregunta27","Pregunta28","Pregunta29","Pregunta30",
    "Pregunta31"
    ];

// ============================================
// FORMULARIO 2: Puesta en Servicio (PS)
// ============================================
export const CAMPOS_FORMULARIO_PS = [
    "CodigoUnicoPS", "TensionRC", "AlimentadorRC", "RC", "equipoPS","CircuitoPS", "PDS", "fechaPS", "SemanaPS", "horaPS", "ProtocoloRC", "Nombre1PS", "Correo1PS", "Nombre2PS", "Correo2PS", "MarcaRC", "CapacidadRC", "CapRupturaRC", "MExtinsionRC", "NSerieRC", "NSerieRCSAP","TNominalRC", "FuenteCargaRC", "SecuenciaFasesRC","AnoRC", "Kardex1RC", "Kardex2RC", "MarcaPS", 
    "ModeloReleRC", "NSerieReleRC", "NSerieReleRCSAP", "AlimentacionControlRele", "Modem", "IPRele", "IPRouter", "ClaveRouter", "ClaveWifi", "I5150P", "Curva5150P", "T5150P", "I5150P2", "T5150P2", "Funcion67P1", "Curva67P1", "Direc67P1", "Ang67P1", "T67P1", "Io67N1", "Curva67N1", "ForRev67N1", "Ang67N1", "To67N1", "Funcion3v067N1", "Io67N2", "Curva67N2", "ForRev67N2", 
    "Ang67N2", "To67N2", "Funcion3v067N2", "Io5150N", "Curva5150N", "T05150N", "Io5150N2", "To5150N2", "Funcion3vo59N", "T59N", "BT", "MT","TransformadorPropio", "ServicioParticular", "TensionAlimentacionSP","AjusteTermicoBT", "Controldereconectador", "AjusteProteccionCorrecta", "BotonOnOff", "SujecionCableCA", "TierraMT", "TierraBT", "PuestaenServicio", "RevisionPeriodica", 
    "InstalacionComponente", "AjusteOscilografia", "CorrienteHMI", "BotonOnOff2", "ObservacionesRC"
];

// ============================================
// FORMULARIO 3: Cambio de Ajustes (CA)
// ============================================
export const CAMPOS_FORMULARIO_CA = [
    "CodigoUnicoCA","equipoCA","codigo", "Alimentador", "NodofinalCA", "enlaceCA", "CircuitoCA", "celdaCA", "MedicionFasesTC1", "MedicionFasesTC2", "MedicionHomopolarTC1", "MedicionHomopolarTC2", "MedicionFasesTT1", "MedicionFasesTT2", "MedicionHomopolarTT1", "MedicionHomopolarTT2",
    "MarcaCA", "ModeloCA", "InFasesCA", "InNeutroCA","VnReleCA", "NFabrica","NSerieSAP","NCatalogo", "NKardexCA", "TensionAlimentacionCA", "CurveType51PSolicitado", "StartValue51PSolicitado", "Time51PSolicitado", "DelayTime51PSolicitado", "DirectionalMode51PSolicitado", "Characteristic51PSolicitado",
    "Voltage51PSolicitado", "CurveType51PRealizado", "StartValue51PRealizado", "Time51PRealizado", "DelayTime51PRealizado", "DirectionalMode51PRealizado", "Characteristic51PRealizado", "Voltage51PRealizado", "Observaciones51P", "CurveType50P2Solicitado", "StartValue50P2Solicitado", "Time50P2olicitado",
    "DelayTime50P2Solicitado", "DirectionalMode50P2Solicitado", "Characteristic50P2Solicitado", "Voltage50P2Solicitado", "CurveType50P2Realizado", "StartValue50P2Realizado", "Time50P2Realizado", "DelayTime50P2Realizado", "DirectionalMode50P2Realizado", "Characteristic50P2Realizado", "Voltage50P2Realizado",
    "Observaciones50P2", "CurveType50P3Solicitado", "StartValue50P3Solicitado", "Time50P3Solicitado", "DelayTime50P3Solicitado", "DirectionalMode50P3Solicitado", "Characteristic50P3Solicitado", "Voltage50P3Solicitado", "CurveType50P3Realizado", "StartValue50P3Realizado", "Time50P3Realizado", "DelayTime50P3Realizado",
    "DirectionalMode50P3Realizado", "Characteristic50P3Realizado", "Voltage50P3Realizado", "Observaciones50P3", "StartValue50P1Solicitado", "DelayTime50P1Solicitado", "StartValue50P1Realizado", "DelayTime50P1Realizado", "Observaciones50P1", "CurveType67N1Solicitado", "StartValue67N1Solicitado", "Time67N1Solicitado",
    "DelayTime67N1Solicitado", "DirectionalMode67N1Solicitado", "Characteristic67N1Solicitado", "Voltage67N1Solicitado", "CurveType67N1Realizado", "StartValue67N1Realizado", "Time67N1Realizado", "DelayTime67N1Realizado", "DirectionalMode67N1Realizado", "Characteristic67N1Realizado", "Voltage67N1Realizado", 
    "Observaciones67N1", "CurveType67N2Solicitado", "StartValue67N2Solicitado", "Time67N2Solicitado", "DelayTime67N2Solicitado", "DirectionalMode67N2Solicitado", "Characteristic67N2Solicitado", "Voltage67N2Solicitado", "CurveType67N2Realizado", "StartValue67N2Realizado", "Time67N2Realizado", "DelayTime67N2Realizado", 
    "DirectionalMode67N2Realizado", "Characteristic67N2Realizado", "Voltage67N2Realizado", "Observaciones67N2", "CurveType50NSolicitado", "StartValue50NSolicitado", "Time50NSolicitado", "DelayTime50NSolicitado", "DirectionalMode50NSolicitado", "Characteristic50NSolicitado", "Voltage50NSolicitado", "CurveType50NRealizado", 
    "StartValue50NRealizado", "Time50NRealizado", "DelayTime50NRealizado", "DirectionalMode50NRealizado", "Characteristic50NRealizado", "Voltage50NRealizado", "Observaciones50N", "CurveType51NSolicitado", "StartValue51NSolicitado", "Time51NSolicitado", "DelayTime51NSolicitado", "CurveType51NRealizado", "StartValue51NRealizado",
    "Time51NRealizado", "DelayTime51NRealizado", "Observaciones51N", "StartValue59N1Solicitado", "DelayTime59N1Solicitado", "StartValue59N1Realizado", "DelayTime59N1Realizado", "Observaciones59N1", "StartValue59N2Solicitado", "DelayTime59N2Solicitado", "StartValue59N2Realizado", "DelayTime59N2Realizado", "Observaciones59N2", 
    "fechaCA", "SemanaCA", "Nombre1CA", "Correo1CA", "Nombre2CA", "Correo2CA"
];


// =======================================
// REGLAS PARA SELECCIÓN AUTOMÁTICA DE CURVA
// =======================================
export const reglasCurvaFormularioPP = {
  "51P": { selectId: "CurvaRecomendado51P", dependeDe: ["IPrimRecomendado51P", "TMSRecomendado51P"] },
  "50P-1": { selectId: "CurvaRecomendado50P1", dependeDe: ["IPrimRecomendado50P1", "TMSRecomendado50P1"] },
  "50P-2": { selectId: "CurvaRecomendado50P2", dependeDe: ["IPrimRecomendado50P2", "TMSRecomendado50P2"] },
  "50P-3": { selectId: "CurvaRecomendado50P3", dependeDe: ["IPrimRecomendado50P3", "TMSRecomendado50P3"] },
  "51N": { selectId: "CurvaRecomendado51N", dependeDe: ["IPrimRecomendado51N", "TMSRecomendado51N"] },
  "50N": { selectId: "CurvaRecomendado50N", dependeDe: ["IPrimRecomendado50N", "TMSRecomendado50N"] },
  "67N-1": { 
    selectId: "CurvaRecomendado67N1", 
    inputid: "ForwardRecomendado67N1", 
    inputid2: "AnguloRecomendado67N1",
    valortextinputid: "-", 
    valortextinputid2: "-",
    dependeDe: ["IPrimRecomendado67N1", "TMSRecomendado67N1", "Recomendado3Uo67N1"] 
  },
  "67N-2": { 
    selectId: "CurvaRecomendado67N2",
    inputid: "ForwardRecomendado67N2", 
    inputid2: "AnguloRecomendado67N2",
    valortextinputid: "-", 
    valortextinputid2: "-",
    dependeDe: ["IPrimRecomendado67N2", "TMSRecomendado67N2", "Recomendado3Uo67N2"] 
  },
  "46": { selectId: "CurvaRecomendado46", dependeDe: ["IPrimRecomendado46", "TMSRecomendado46"] },
  "59N-1": { selectId: "CurvaRecomendado59N1", dependeDe: ["Recomendado3Uo59N1", "TMSRecomendado59N1"] },
  "59N-2": { selectId: "CurvaRecomendado59N2", dependeDe: ["Recomendado3Uo59N2", "TMSRecomendado59N2"] }
};

export const reglasCurvaFormularioCA = {
  "51P": {
    selectId: "CurveType51PSolicitado",
    dependeDe: ["StartValue51PSolicitado", "DelayTime51PSolicitado"]
  },
  "50P-2": {
    selectId: "CurveType50P2Solicitado",
    dependeDe: ["StartValue50P2Solicitado", "DelayTime50P2Solicitado"]
  },
  "50P-3": {
    selectId: "CurveType50P3Solicitado",
    dependeDe: ["StartValue50P3Solicitado", "DelayTime50P3Solicitado"]
  },
  "51N": {
    selectId: "CurveType51NSolicitado",
    dependeDe: ["StartValue51NSolicitado", "DelayTime51NSolicitado"]
  },
  "50N": {
    selectId: "CurveType50NSolicitado",
    dependeDe: ["StartValue50NSolicitado", "DelayTime50NSolicitado"]
  },
  "67N-1": { 
    selectId: "CurveType67N1Solicitado",
    inputid: "DirectionalMode67N1Solicitado", 
    inputid2: "Characteristic67N1Solicitado",
    valortextinputid: "-", 
    valortextinputid2: "-",
    dependeDe: ["StartValue67N1Solicitado", "DelayTime67N1Solicitado", "Voltage67N1Solicitado"] 
  },
  "67N-2": { 
    selectId: "CurveType67N2Solicitado",
    inputid: "DirectionalMode67N2Solicitado", 
    inputid2: "Characteristic67N2Solicitado",
    valortextinputid: "-", 
    valortextinputid2: "-",
    dependeDe: ["StartValue67N2Solicitado", "DelayTime67N2Solicitado", "Voltage67N2Solicitado"] 
  }
};

// =============================
// MAPEO DE FORMULARIO DE PROTOCOLO PARA RELLENAR FUNCIONES RECOMENDADAS
// =============================

export const mapaRellenoFormularioPP = {
  "51P": {
    CurvaRecomendado51P: "CurvaRecomendado51P",
    IPrimRecomendado51P: "IPrimRecomendado51P",
    TMSRecomendado51P: "TMSRecomendado51P"
  },

  "50P-1": {
    CurvaRecomendado50P1: "CurvaRecomendado50P1",
    IPrimRecomendado50P1: "IPrimRecomendado50P1",
    TMSRecomendado50P1: "TMSRecomendado50P1"
  },

  "50P-2": {
    CurvaRecomendado50P2: "CurvaRecomendado50P2",
    IPrimRecomendado50P2: "IPrimRecomendado50P2",
    TMSRecomendado50P2: "TMSRecomendado50P2"
  },

  "50P-3": {
    CurvaRecomendado50P3: "CurvaRecomendado50P3",
    IPrimRecomendado50P3: "IPrimRecomendado50P3",
    TMSRecomendado50P3: "TMSRecomendado50P3"
  },

  "51N": {
    CurvaRecomendado51N: "CurvaRecomendado51N",
    IPrimRecomendado51N: "IPrimRecomendado51N",
    TMSRecomendado51N: "TMSRecomendado51N"
  },

  "50N": {
    CurvaRecomendado50N: "CurvaRecomendado50N",
    IPrimRecomendado50N: "IPrimRecomendado50N",
    TMSRecomendado50N: "TMSRecomendado50N"
  },

  "67N-1": {
    CurvaRecomendado67N1: "CurvaRecomendado67N1",
    IPrimRecomendado67N1: "IPrimRecomendado67N1",
    TMSRecomendado67N1: "TMSRecomendado67N1",
    Recomendado3Uo67N1: "Recomendado3Uo67N1"
  },

  "67N-2": {
    CurvaRecomendado67N2: "CurvaRecomendado67N2",
    IPrimRecomendado67N2: "IPrimRecomendado67N2",
    TMSRecomendado67N2: "TMSRecomendado67N2",
    Recomendado3Uo67N2: "Recomendado3Uo67N2"
  },

  "46": {
    CurvaRecomendado46: "CurvaRecomendado46",
    IPrimRecomendado46: "IPrimRecomendado46",
    TMSRecomendado46: "TMSRecomendado46"
  },

  "59N-1": {
    CurvaRecomendado59N1: "CurvaRecomendado59N1",
    Recomendado3Uo59N1: "Recomendado3Uo59N1",
    TMSRecomendado59N1: "TMSRecomendado59N1"
  },

  "59N-2": {
    CurvaRecomendado59N2: "CurvaRecomendado59N2",
    Recomendado3Uo59N2: "Recomendado3Uo59N2",
    TMSRecomendado59N2: "TMSRecomendado59N2"
  }
};

export const mapaRellenoFormularioCA = {
  "51P": {
    CurveType51PSolicitado: "CurveType51PSolicitado",
    StartValue51PSolicitado: "StartValue51PSolicitado",
    DelayTime51PSolicitado: "DelayTime51PSolicitado"
  },

  "50P-1": {
    StartValue50P1Solicitado: "StartValue50P1Solicitado",
    DelayTime50P1Solicitado: "DelayTime50P1Solicitado"
  },

  "50P-2": {
    CurveType50P2Solicitado: "CurveType50P2Solicitado",
    StartValue50P2Solicitado: "StartValue50P2Solicitado",
    DelayTime50P2Solicitado: "DelayTime50P2Solicitado"
  },

  "50P-3": {
    CurveType50P3Solicitado: "CurveType50P3Solicitado",
    StartValue50P3Solicitado: "StartValue50P3Solicitado",
    DelayTime50P3Solicitado: "DelayTime50P3Solicitado"
  },

  "51N": {
    CurveType51NSolicitado: "CurveType51NSolicitado",
    StartValue51NSolicitado: "StartValue51NSolicitado",
    DelayTime51NSolicitado: "DelayTime51NSolicitado"
  },

  "50N": {
    CurveType50NSolicitado: "CurveType50NSolicitado",
    StartValue50NSolicitado: "StartValue50NSolicitado",
    DelayTime50NSolicitado: "DelayTime50NSolicitado"
  },

  "67N-1": {
    CurveType67N1Solicitado: "CurveType67N1Solicitado",
    StartValue67N1Solicitado: "StartValue67N1Solicitado",
    DelayTime67N1Solicitado: "DelayTime67N1Solicitado",
    Voltage67N1Solicitado: "Voltage67N1Solicitado"
  },

  "67N-2": {
    CurveType67N2Solicitado: "CurveType67N2Solicitado",
    StartValue67N2Solicitado: "StartValue67N2Solicitado",
    DelayTime67N2Solicitado: "DelayTime67N2Solicitado",
    Voltage67N2Solicitado: "Voltage67N2Solicitado"
  },

  "59N-1": {
    StartValue59N1Solicitado: "StartValue59N1Solicitado",
    DelayTime59N1Solicitado: "DelayTime59N1Solicitado"
  },

  "59N-2": {
    StartValue59N2Solicitado: "StartValue59N2Solicitado",
    DelayTime59N2Solicitado: "DelayTime59N2Solicitado"
  }
};

// ============================================
// VALIDACION CRUZADA EN VIEWPARTE3
// ============================================

// Pares corriente-tiempo o tension-tiempo
export const paresCorrienteTiempo = [
    ["FRCorriente51P1", "FRTiempo51P1"],
    ["FRCorriente51P2", "FRTiempo51P2"],
    ["FRCorriente51P3", "FRTiempo51P3"],
    ["FSCorriente51P1", "FSTiempo51P1"],
    ["FSCorriente51P2", "FSTiempo51P2"],
    ["FSCorriente51P3", "FSTiempo51P3"],
    ["FTCorriente51P1", "FTTiempo51P1"],
    ["FTCorriente51P2", "FTTiempo51P2"],
    ["FTCorriente51P3", "FTTiempo51P3"],
    ["FNCorriente51P1", "FNTiempo51P1"],
    ["FNCorriente51P2", "FNTiempo51P2"],
    ["FNCorriente51P3", "FNTiempo51P3"],
    ["FRCorriente50P11",  "FRTiempo50P11"],
    ["FRCorriente50P12", "FRTiempo50P12"],
    ["FRCorriente50P13", "FRTiempo50P13"],
    ["FSCorriente50P11", "FSTiempo50P11"],
    ["FSCorriente50P12", "FSTiempo50P12"],
    ["FSCorriente50P13", "FSTiempo50P13"],
    ["FTCorriente50P11", "FTTiempo50P11"],
    ["FTCorriente50P12", "FTTiempo50P12"],
    ["FTCorriente50P13", "FTTiempo50P13"],
    ["FNCorriente50P11", "FNTiempo50P11"],
    ["FNCorriente50P12", "FNTiempo50P12"],
    ["FNCorriente50P13", "FNTiempo50P13"],
    ["FRCorriente50P21", "FRTiempo50P21"],
    ["FRCorriente50P22", "FRTiempo50P22"],
    ["FRCorriente50P23", "FRTiempo50P23"],
    ["FSCorriente50P21", "FSTiempo50P21"],
    ["FSCorriente50P22", "FSTiempo50P22"],
    ["FSCorriente50P23", "FSTiempo50P23"],
    ["FTCorriente50P21", "FTTiempo50P21"],
    ["FTCorriente50P22", "FTTiempo50P22"],
    ["FTCorriente50P23", "FTTiempo50P23"],
    ["FNCorriente50P21", "FNTiempo50P21"],
    ["FNCorriente50P22", "FNTiempo50P22"],
    ["FNCorriente50P23", "FNTiempo50P23"],
    ["FRCorriente50P31", "FRTiempo50P31"],
    ["FRCorriente50P32", "FRTiempo50P32"],
    ["FRCorriente50P33", "FRTiempo50P33"],
    ["FSCorriente50P31", "FSTiempo50P31"],
    ["FSCorriente50P32", "FSTiempo50P32"],
    ["FSCorriente50P33", "FSTiempo50P33"],
    ["FTCorriente50P31", "FTTiempo50P31"],
    ["FTCorriente50P32", "FTTiempo50P32"],
    ["FTCorriente50P33", "FTTiempo50P33"],
    ["FNCorriente50P31", "FNTiempo50P31"],
    ["FNCorriente50P32", "FNTiempo50P32"],
    ["FNCorriente50P33", "FNTiempo50P33"],
    ["FRCorriente51N1", "FRTiempo51N1"],
    ["FRCorriente51N2", "FRTiempo51N2"],
    ["FRCorriente51N3", "FRTiempo51N3"],
    ["FSCorriente51N1", "FSTiempo51N1"],
    ["FSCorriente51N2", "FSTiempo51N2"],
    ["FSCorriente51N3", "FSTiempo51N3"],
    ["FTCorriente51N1", "FTTiempo51N1"],
    ["FTCorriente51N2", "FTTiempo51N2"],
    ["FTCorriente51N3", "FTTiempo51N3"],
    ["FNCorriente51N1", "FNTiempo51N1"],
    ["FNCorriente51N2", "FNTiempo51N2"],
    ["FNCorriente51N3", "FNTiempo51N3"],
    ["FRCorriente50N1", "FRTiempo50N1"],
    ["FRCorriente50N2", "FRTiempo50N2"],
    ["FRCorriente50N3", "FRTiempo50N3"],
    ["FSCorriente50N1", "FSTiempo50N1"],
    ["FSCorriente50N2", "FSTiempo50N2"],
    ["FSCorriente50N3", "FSTiempo50N3"],
    ["FTCorriente50N1", "FTTiempo50N1"],
    ["FTCorriente50N2", "FTTiempo50N2"],
    ["FTCorriente50N3", "FTTiempo50N3"],
    ["FNCorriente50N1", "FNTiempo50N1"],
    ["FNCorriente50N2", "FNTiempo50N2"],
    ["FNCorriente50N3", "FNTiempo50N3"],
    ["FRCorriente461", "FRTiempo461"],
    ["FRCorriente462", "FRTiempo462"],
    ["FRCorriente463", "FRTiempo463"],
    ["FSCorriente461", "FSTiempo461"],
    ["FSCorriente462", "FSTiempo462"],
    ["FSCorriente463", "FSTiempo463"],
    ["FTCorriente461", "FTTiempo461"],
    ["FTCorriente462", "FTTiempo462"],
    ["FTCorriente463", "FTTiempo463"],
    ["FNCorriente461", "FNTiempo461"],
    ["FNCorriente462", "FNTiempo462"],
    ["FNCorriente463", "FNTiempo463"],
    ["FRTension59N11", "FRTiempo59N11"],
    ["FRTension59N12", "FRTiempo59N12"],
    ["FRTension59N13", "FRTiempo59N13"],
    ["FSTension59N11", "FSTiempo59N11"],
    ["FSTension59N12", "FSTiempo59N12"],
    ["FSTension59N13", "FSTiempo59N13"],
    ["FTTension59N11", "FTTiempo59N11"],
    ["FTTension59N12", "FTTiempo59N12"],
    ["FTTension59N13", "FTTiempo59N13"],
    ["FNTension59N11", "FNTiempo59N11"],
    ["FNTension59N12", "FNTiempo59N12"],
    ["FNTension59N13", "FNTiempo59N13"],
    ["FRTension59N21", "FRTiempo59N21"],
    ["FRTension59N22", "FRTiempo59N22"],
    ["FRTension59N23", "FRTiempo59N23"],
    ["FSTension59N21", "FSTiempo59N21"],
    ["FSTension59N22", "FSTiempo59N22"],
    ["FSTension59N23", "FSTiempo59N23"],
    ["FTTension59N21", "FTTiempo59N21"],
    ["FTTension59N22", "FTTiempo59N22"],
    ["FTTension59N23", "FTTiempo59N23"],
    ["FNTension59N21", "FNTiempo59N21"],
    ["FNTension59N22", "FNTiempo59N22"],
    ["FNTension59N23", "FNTiempo59N23"]
  ];

  export const gruposCorriente3uoTiempo = [
    ["FRCorriente67N11", "FR3Uo67N11", "FRTiempo67N11"],
    ["FRCorriente67N12", "FR3Uo67N12", "FRTiempo67N12"],
    ["FRCorriente67N13", "FR3Uo67N13", "FRTiempo67N13"],
    ["FSCorriente67N11", "FS3Uo67N11", "FSTiempo67N11"],
    ["FSCorriente67N12", "FS3Uo67N12", "FSTiempo67N12"],
    ["FSCorriente67N13", "FS3Uo67N13", "FSTiempo67N13"],
    ["FTCorriente67N11", "FT3Uo67N11", "FTTiempo67N11"],
    ["FTCorriente67N12", "FT3Uo67N12", "FTTiempo67N12"],
    ["FTCorriente67N13", "FT3Uo67N13", "FTTiempo67N13"],
    ["FNCorriente67N11", "FN3Uo67N11", "FNTiempo67N11"],
    ["FNCorriente67N12", "FN3Uo67N12", "FNTiempo67N12"],
    ["FNCorriente67N13", "FN3Uo67N13", "FNTiempo67N13"],
    ["FRCorriente67N21", "FR3Uo67N21", "FRTiempo67N21"],
    ["FRCorriente67N22", "FR3Uo67N22", "FRTiempo67N22"],
    ["FRCorriente67N23", "FR3Uo67N23", "FRTiempo67N23"],
    ["FSCorriente67N21", "FS3Uo67N21", "FSTiempo67N21"],
    ["FSCorriente67N22", "FS3Uo67N22", "FSTiempo67N22"],
    ["FSCorriente67N23", "FS3Uo67N23", "FSTiempo67N23"],
    ["FTCorriente67N21", "FT3Uo67N21", "FTTiempo67N21"],
    ["FTCorriente67N22", "FT3Uo67N22", "FTTiempo67N22"],
    ["FTCorriente67N23", "FT3Uo67N23", "FTTiempo67N23"],
    ["FNCorriente67N21", "FN3Uo67N21", "FNTiempo67N21"],
    ["FNCorriente67N22", "FN3Uo67N22", "FNTiempo67N22"],
    ["FNCorriente67N23", "FN3Uo67N23", "FNTiempo67N23"]
  ];

// ============================================
// CAMPOS DE EXCLUIDOS
// ============================================
export const exclusionesPorVista = {
  viewParte1: ["fecha", "semana", "hora"],
  viewCambioAjuste: ["fechaCA", "SemanaCA", "VnReleCA", "NCatalogo"],
  viewPuestaServicio: ["fechaPS", "SemanaPS", "horaPS"]
};

export const CAMPOS_CRITICOS = [
  "CodigoUnico", "CodigoUnicoCA", "CodigoUnicoPS", "hora", "horaPS" 
];

export const CAMPOS_CODIGO = ["CodigoUnico", "CodigoUnicoCA", "CodigoUnicoPS"];

export const CAMPOS_HORA = ["hora", "horaPS"];

// ============================================
// CAMPOS DE FOTOS A ENVIAR - FORMULARIO PP
// ============================================
export const camposFotos = [
    "fotoPlacaRele", "fotoPlacaEquipoMT", "fotoPuertaCelda", "fotoCeldaInterior", "fotoGabinete"
  ];

// ============================================
// RELACIONES: Cuál combobox controla qué campos
// ============================================

export const COMBOBOX_MAPPINGS = {
  viewParte2: {
    "opciones-combobox": {
    "(51P) / 67P-1": ["campo51P", "ValorPrueba51P"],
    "(50P-1) / 67P-2": ["campo50P1", "ValorPrueba50P1"],
    "(50P-2)": ["campo50P2", "ValorPrueba50P2"],
    "(50P-3)": ["campo50P3", "ValorPrueba50P3"],
    "(51N)": ["campo51N", "ValorPrueba51N"],
    "(50N)": ["campo50N", "ValorPrueba50N"],
    "(67N-1)": ["campo67N1", "ValorPrueba67N1"],
    "(67N-2)": ["campo67N2", "ValorPrueba67N2"],
    "(46)": ["campo46", "ValorPrueba46"],
    "(59N-1)": ["campo59N1", "ValorPrueba59N1"],
    "(59N-2)": ["campo59N2", "ValorPrueba59N2"]
    }
  },
  viewParte3: {
    "opciones-combobox-ValoresPrueba": {
    "Fase R": ["FaseR_51P", "FaseR_50P1", "FaseR_50P2", "FaseR_50P3", "FaseR_51N", "FaseR_50N", "FaseR_67N1", "FaseR_67N2", "FaseR_46", "FaseR_59N1", "FaseR_59N2"],
    "Fase S": ["FaseS_51P", "FaseS_50P1", "FaseS_50P2", "FaseS_50P3", "FaseS_51N", "FaseS_50N", "FaseS_67N1", "FaseS_67N2", "FaseS_46", "FaseS_59N1", "FaseS_59N2"],
    "Fase T": ["FaseT_51P",  "FaseT_50P1", "FaseT_50P2", "FaseT_50P3", "FaseT_51N", "FaseT_50N", "FaseT_67N1", "FaseT_67N2", "FaseT_46", "FaseT_59N1", "FaseT_59N2"],
    "Fase Neutro": ["FaseNeutro_51P",  "FaseNeutro_50P1", "FaseNeutro_50P2", "FaseNeutro_50P3", "FaseNeutro_51N", "FaseNeutro_50N", "FaseNeutro_67N1", "FaseNeutro_67N2", "FaseNeutro_46", "FaseNeutro_59N1", "FaseNeutro_59N2"],
    }
  },
  viewPuestaServicio: {
    "opciones-combobox-PuestaenServicio": {
    "51/50P": ["51/50P"],
    "67P-1": ["67P-1"],
    "67N-1": ["67N-1"],
    "67N-2": ["67N-2"],
    "51/50N": ["51/50N"],
    "59N": ["59N"]
    }
  },
  viewCambioAjuste2: {
    "opciones-combobox-Nuevo": {
    "Sobrecorriente de fases 51P": ["Sobrecorriente51P", "Observacion51P"],
    "Sobrecorriente de fases 50P-2": ["Sobrecorriente50P2", "Observacion50P2"],
    "Sobrecorriente de fases 50P-3": ["Sobrecorriente50P3", "Observacion50P3"],
    "Sobrecorriente de fases 50P-1": ["Sobrecorriente50P1", "Observacion50P1"],
    "Falla a tierra 67N-1": ["FallaTierra67N1", "Observacion67N1"],
    "Falla a tierra 67N-2": ["FallaTierra67N2", "Observacion67N2"],
    "Falla a tierra 50N": ["FallaTierra50N", "Observacion50N"],
    "Falla a tierra 51N": ["FallaTierra51N", "Observacion51N"],
    "Tension homopolar 59N-1": ["TensionHomopolar59N1", "Observacion59N1"],
    "Tension homopolar 59N-2": ["TensionHomopolar59N2", "Observacion59N2"]
    }
  }
};
