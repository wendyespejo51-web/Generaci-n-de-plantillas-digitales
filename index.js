// SERVICE WORKER REGISTRATION (OPTIMIZADO PARA iOS + TOAST UPDATES)
if ('serviceWorker' in navigator) {
  // 🔧 Esperar a que la página cargue antes de registrar
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      '/Generaci-n-de-plantillas-digitales/service-worker.js',
      { 
        scope: '/Generaci-n-de-plantillas-digitales/'
        // ❌ NO agregar type: 'module' aquí (causa problemas en iOS)
      }
    ).then((registration) => {
      console.log('✅ Service Worker registrado correctamente');
      
      // 🔄 Escuchar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          // Estado: installed = nueva versión descargada pero no activada
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Nueva versión disponible. Mostrando notificación al usuario');
            mostrarToastActualizacion();
          }
        });
      });

      // 🔄 Chequear actualizaciones cada 60 segundos (solo en iOS funciona bien)
      setInterval(() => {
        registration.update();
      }, 60000);

    }).catch((error) => {
      console.error('❌ Error registrando Service Worker:', error);
    });
  });

  // 🔄 Si el controlador cambia, recarga la página
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Reloading página con nuevo Service Worker...');
    window.location.reload();
  });
}

// TOAST DE ACTUALIZACIÓN CON BOTONES
function mostrarToastActualizacion() {
  // Verificar si el toast ya existe
  if (document.getElementById('toast-actualizacion')) {
    return;
  }

  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-actualizacion';
  toastContainer.className = 'toast-actualizacion';
  
  toastContainer.innerHTML = `
    <div class="toast-contenido">
      <div class="toast-icono">🔄</div>
      <div class="toast-mensaje">
        <strong>Nueva versión disponible</strong>
        <p>Actualiza para obtener las últimas mejoras</p>
      </div>
      <button id="btnActualizar" class="btn-actualizar">Actualizar ahora</button>
      <button id="btnDespues" class="btn-despues">Después</button>
    </div>
  `;

  document.body.appendChild(toastContainer);

  // 🔘 Botón ACTUALIZAR
  document.getElementById('btnActualizar').addEventListener('click', () => {
    toastContainer.remove();
    // Recarga para activar la nueva versión
    window.location.reload();
  });

  // 🔘 Botón DESPUÉS
  document.getElementById('btnDespues').addEventListener('click', () => {
    toastContainer.remove();
  });

  // 🔄 Auto-descartar después de 8 segundos
  setTimeout(() => {
    if (toastContainer.parentNode) {
      toastContainer.remove();
    }
  }, 8000);
}

// ===== IMPORTS DE MÓDULOS SECUNDARIOS =====
import { DATA_LISTS, diccionarioMarcas, trabajadores } from './config/datalist.js';
import { ENDPOINTS } from './config/endpoints.js';
import { 
  mapaFormularios, 
  vistasProtegidas, 
  CAMPOS_FORMULARIO_PP,
  CAMPOS_FORMULARIO_PP_SC,
  CAMPOS_FORMULARIO_PS,
  CAMPOS_FORMULARIO_CA,
  camposChecklistPreguntas,
  reglasCurvaFormularioPP,
  reglasCurvaFormularioCA,
  camposFotos,
  exclusionesPorVista,
  CAMPOS_CRITICOS,
  CAMPOS_CODIGO,
  CAMPOS_HORA,
  COMBOBOX_MAPPINGS,
  paresCorrienteTiempo,
  gruposCorriente3uoTiempo,
  mapaRellenoFormularioPP,
  mapaRellenoFormularioCA
} from './config/formfields.js';

// =============================
// Variables principales
// =============================
document.getElementById("buscarAnio").value = new Date().getFullYear();
document.getElementById("opciones-combobox").value = "(51P) / 67P-1"; // Valor por defecto
document.getElementById("opciones-combobox-Nuevo").value = "Sobrecorriente de fases 51P"; // Valor por defecto
document.getElementById("opciones-combobox-PuestaenServicio").value = "51/50P"; // Valor por defecto


const viewFormatos = document.getElementById("viewFormatos");
const viewHistorial = document.getElementById("viewHistorial");
const mainTabs = document.getElementById("main-tabs");
const header = document.querySelector("header");
const popupChecklist = document.getElementById("popupChecklist");
const btnFormatos = document.getElementById("btnFormatos");
const btnHistorial = document.getElementById("btnHistorial");
const nextButton = document.getElementById("next-button");
const modificarButton = document.getElementById("btnModificar");
const btnVolverDetalle = document.getElementById("btnVolverDetalle");
const pdfViewer = document.getElementById("pdf-viewer");

const backButton = document.getElementById("back-button");
const backButton1 = document.getElementById("back-to-parte1");
const backButton2 = document.getElementById("back-to-parte2");
const backButton3 = document.getElementById("back-to-parte3");
const backButton4 = document.getElementById("back-to-parteInicialCA");
const backButton5 = document.getElementById("back-to-parteInicialCA2");
const backButton6 = document.getElementById("back-to-parteInicialPS");


let formularioSeleccionado = null;
let popupChecklistMostrado = false;
let datosANSICargados = null;
let modoEdicionCamposPreview = false;
let ultimaBusqueda = "";
let autocompleteSEDActivo = false;
let codigoAutocompleteActivo = false;
let debounceBusqueda = null;
let controladorFetch = null;
let ultimoModoHistorial = "ultimos7";
let ultimosFiltrosHistorial = null;
let historialCache = null;
let historialCargado = false;
let restauracionBloqueada = false;

const cacheDetalleRegistros = {};

const formatoCards = document.querySelectorAll(".formato-card");

const selectEquipo = document.getElementById("equipo");
const selectEquipoCA = document.getElementById("equipoCA");
const selectEquipoPS = document.getElementById("equipoPS");
const inputMarcaReleAutorellenado = document.getElementById("marcarele");

// =============================
// ESTADO GLOBAL
// =============================

function limpiarDraftsFormulario(formulario = null) {
  
  if (!formulario) {
    formulario = obtenerFormularioActual();
  }

  if (!formulario) return;

  const draftKey = 'formulario_draft_' + formulario;
  localStorage.removeItem(draftKey);
  console.log(`[Draft] Eliminado: ${draftKey}`);
}

function limpiarTodosDrafts() {
  Object.keys(mapaFormularios).forEach(form => {
    localStorage.removeItem(`formulario_draft_${form}`);
  });

  console.log(`🗑️ Todos los drafts eliminados`);
}

window.formularioEnProceso = false;

const vistasConTabs = [
  "viewFormatos",
  "viewHistorial"
];

window.valorOriginalSED = "";
window.valorOriginalCodigo = "";

window.rellenandoFormulario = false;

window.restauracionEnProceso = false;

window.modoEdicionActivo = false;

document.addEventListener("DOMContentLoaded", () => {
  registrarListenersGlobales();
});

function registrarListenersGlobales() {

  if (selectEquipo) {
    selectEquipo.addEventListener("change", () => {
      actualizarCampoSed();
      actualizarVisibilidadNodoFinal();
      actualizarVisibilidadSegunPlantilla();
    });
  }

  if (selectEquipoCA) {
    selectEquipoCA.addEventListener("change", () => {
      actualizarCampoCodigo();
      actualizarVisibilidadNodoFinalCA();
    });
  }

  if (selectEquipoPS) {
    selectEquipoPS.addEventListener("change", actualizarCampoRC);
  }

}

// =========================
// LOADER GLOBAL (AISLADO)
// =========================
// No esperes al DOMContentLoaded para declarar la lógica
const getLoader = () => document.getElementById("loaderGlobal");

function mostrarLoader() {
  const loader = getLoader();
  if (!loader) return;
  
  // Forzamos el display y quitamos la clase de ocultado
  loader.style.setProperty("display", "flex", "important"); 
  loader.classList.remove("oculto");
}

function ocultarLoader() {
  const loader = getLoader();
  if (!loader) return;
  
  loader.classList.add("oculto");
  // Un pequeño retraso para el display none ayuda si tienes transiciones
  setTimeout(() => {
    loader.style.display = "none";
  }, 300);
}

// Evento para ocultar cuando la página cargue totalmente
window.addEventListener("load", ocultarLoader);

// =========================
// PROGRESO DEL LOADER
// =========================
const circle = document.querySelector(".progress-ring__circle");
const percentText = document.getElementById("loaderPercent");

const radius = 60;
const circumference = 2 * Math.PI * radius;

if (circle) {
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
}

function setLoaderProgress(percent) {
  if (!circle || !percentText) return;

  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  percentText.textContent = `${Math.round(percent)}%`;
}

let loaderInterval = null;

function iniciarLoader() {
  let progreso = 15;
  setLoaderProgress(progreso);

  loaderInterval = setInterval(() => {
    if (progreso < 90) {
      progreso += Math.random() * 6;
      setLoaderProgress(progreso);
    }
  }, 250);
}

// =============================
// PROTECCIÓN CONTRA RECARGA
// =============================

// Bloquea F5 y Ctrl/Cmd + R
function bloquearTeclasRecarga() {
    document.addEventListener("keydown", bloquearEventoRecarga);
}

function desbloquearTeclasRecarga() {
    document.removeEventListener("keydown", bloquearEventoRecarga);
}

function bloquearEventoRecarga(e) {
    if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")) {
        e.preventDefault();
    }
}

// Muestra advertencia del navegador si intenta recargar/cerrar
function activarProteccionRecarga() {
    window.onbeforeunload = function () {
        return true; // Previene recarga accidental
    };
}

function desactivarProteccionRecarga() {
    window.onbeforeunload = null;
}

/********************************************
 * REEMPLAZO DE: showView / showNext / activarVista
 ********************************************/

// Estado único y consistente
window.vistaActual = window.vistaActual || null;
window.currentView = window.currentView || window.vistaActual || "viewFormatos";

// Helper: obtiene elemento view desde id o elemento
function resolveViewElement(viewOrId) {
  if (!viewOrId) return null;
  if (typeof viewOrId === "string") {
    return document.getElementById(viewOrId) || null;
  }
  // si ya es elemento DOM, retornarlo
  if (viewOrId instanceof Element) return viewOrId;
  return null;
}

/**
 * showView: muestra una vista (acepta elemento DOM o id de la vista).
 * - Actualiza clases .active-view
 * - Activa/desactiva la protección contra recarga según vistasProtegidas
 * - Muestra u oculta el combobox segun viewParte2/viewParte3
 */
function showView(viewOrId) {
  // 🔒 LIMPIEZA GLOBAL (ANTI-LOADER COLGADO)
  ocultarLoader();
  const viewElem = resolveViewElement(viewOrId);
  if (!viewElem) {
    console.warn("showView: vista inválida recibida:", viewOrId);
    return;
  }

  // Quitar active-view de todas las vistas y poner en la solicitada
  const allViews = document.querySelectorAll(".view");
  allViews.forEach(view => view.classList.remove("active-view"));
  viewElem.classList.add("active-view");

  // ---- PROTECCIÓN CONTRA RECARGA ----
  const viewId = viewElem.id;

  if (vistasProtegidas.includes(viewId)) {
    activarProteccionRecarga();
    bloquearTeclasRecarga();
  } else {
    desactivarProteccionRecarga();
    desbloquearTeclasRecarga();
  }

  if (vistasProtegidas.includes(viewId)) {
  window.formularioEnProceso = true;
  } else {
    window.formularioEnProceso = false;
  }

  // Mostrar combobox solo en viewParte2 y viewParte3
  const combo = document.getElementById("combo-general");
  if (combo) {
    if (viewId === "viewParte2" || viewId === "viewParte3") {
      combo.style.display = "block";
      const backBtn = viewElem.querySelector(".back-btn");
      if (backBtn && backBtn.nextSibling) {
        viewElem.insertBefore(combo, backBtn.nextSibling);
      } else if (backBtn) {
        backBtn.insertAdjacentElement("afterend", combo);
      }
    } else {
      combo.style.display = "none";
    }
  }
}

function limpiarCamposRecomendadosPorVista(vistaId) {

  const configuracionPorVista = {
    viewParte2: mapaRellenoFormularioPP,
    viewCambioAjuste2: mapaRellenoFormularioCA
  };

  const mapa = configuracionPorVista[vistaId];
  if (!mapa) return;

  const vista = document.getElementById(vistaId);
  if (!vista) return;

  Object.values(mapa).forEach(grupo => {

    Object.values(grupo).forEach(nombreCampo => {

      const elemento = vista.querySelector(`#${nombreCampo}, [name="${nombreCampo}"]`);

      if (!elemento) return;

      if (elemento.type === "checkbox" || elemento.type === "radio") {
        elemento.checked = false;
      } else {
        elemento.value = "";
      }

    });

  });

}

// 🔥 Al final del archivo, en el DOMContentLoaded
document.addEventListener("input", (e) => {
  if (CAMPOS_CRITICOS.includes(e.target.id)) {
    guardarCamposCriticosEnStorage();
  }
});

document.addEventListener("change", (e) => {
  if (CAMPOS_CRITICOS.includes(e.target.id)) {
    guardarCamposCriticosEnStorage();
  }
});

document.addEventListener("DOMContentLoaded", () => {

  const ultimaVista = localStorage.getItem("ultima_vista_activa");

  if (ultimaVista) {
    activarVista(ultimaVista);
    
  } else {
    activarVista("viewFormatos");
  }

  const datosGuardados = localStorage.getItem("datosANSI");

  if (datosGuardados && ultimaVista) {

    const datosANSI = JSON.parse(datosGuardados);

    const configuracionPorVista = {
      viewParte1: {
        mapa: mapaRellenoFormularioPP,
        reglas: reglasCurvaFormularioPP
      },
      viewCambioAjuste: {
        mapa: mapaRellenoFormularioCA,
        reglas: reglasCurvaFormularioCA
      }
    };

    const config = configuracionPorVista[ultimaVista];

    if (config) {
      limpiarCamposAutorellenados(ultimaVista);
      rellenarCamposSegunMapa(
        { ANSI: datosANSI },
        config.mapa,
        config.reglas
      );
    }
  }

  // Agrgar listeners para limpiar ANSI guardados en caso se cambie algun valor del enlace
  document.getElementById("enlace")?.addEventListener("change", () => {

  // 1️⃣ Borrar almacenamiento
  localStorage.removeItem("datosANSI");

  // 2️⃣ Borrar variable en memoria
  datosANSICargados = null;

  // 3️⃣ Limpiar campos visualmente
  limpiarCamposRecomendadosPorVista();

});

  document.getElementById("enlaceCA")?.addEventListener("change", () => {
    // 1️⃣ Borrar almacenamiento
  localStorage.removeItem("datosANSI");

  // 2️⃣ Borrar variable en memoria
  datosANSICargados = null;

  // 3️⃣ Limpiar campos visualmente
  limpiarCamposRecomendadosPorVista();

});

});

//Lógica de regreso a viewParte3 en UN SOLO listener
document.addEventListener("viewChanged", () => {

  // 🔄 Entrando a viewParte3
  if (window.currentView === "viewParte3") {

    // 👉 Si venimos desde viewParte2, reset total
    if (window.vistaAnterior === "viewParte2") {
      resetearDecisionChecklist();
    } else {
      // 👉 Cualquier otro caso, solo sincroniza
      sincronizarBotonesParte3();
    }
  }
});

//Lógica de cargar historial en vista Historial
document.addEventListener("viewChanged", async () => {

  if (window.currentView !== "viewHistorial") return;

  console.log("[Historial] Entrando a viewHistorial");

  try {

    if (!ultimoModoHistorial) {

      await cargarHistorial({
        modo: "ultimos7"
      });

    } else {

      await cargarHistorial({
        modo: ultimoModoHistorial,
        filtros: ultimosFiltrosHistorial
      });

    }

    console.log("[Historial] Historial cargado correctamente");

  } catch (err) {
    console.error("[Historial] Error cargando historial:", err);
  }

});

document.addEventListener("viewChanged", () => {
  ocultarLoader();
});

/**
 * showNext: avanzar a la siguiente vista (mantiene compatibilidad)
 * - Calcula cuál es la vista siguiente dentro del DOM
 * - Llama a activarVista con el id de la siguiente vista
 */
function showNext() {
  const allViews = Array.from(document.querySelectorAll(".view"));
  const currentIndex = allViews.findIndex(v => v.classList.contains("active-view"));
  if (currentIndex === -1) return;
  if (currentIndex < allViews.length - 1) {
    const next = allViews[currentIndex + 1];
    if (next && next.id) activarVista(next.id);
  }
}

function limpiarCamposAutorellenados(idVista) {

  const vista = document.getElementById(idVista);
  if (!vista) return;

  const campos = vista.querySelectorAll("[data-autorellenado='true']");

  campos.forEach(el => {

    if (el.tagName === "SELECT") {
      el.selectedIndex = 0;
    } else {
      el.value = "";
    }

    delete el.dataset.autorellenado;

  });

}

// =============================
// SISTEMA DE NAVEGACIÓN DINÁMICO
// =============================

// Stack (pila) para guardar el historial de vistas
let viewStack = ["viewFormatos"];

// Función para registrar una vista cuando se navega
function registrarVista(viewId) {
  // Evitar duplicados consecutivos
  if (viewStack[viewStack.length - 1] !== viewId) {
    viewStack.push(viewId);
  }
}

// Función para retroceder a la vista anterior
function retrocederVista() {
  if (viewStack.length > 1) {
    viewStack.pop(); // Sacar la vista actual
    const vistaAnterior = viewStack[viewStack.length - 1];
    activarVista(vistaAnterior);
  } else {
    // Si no hay historial, ir a la vista inicial
    activarVista("viewFormatos");
  }
}

// Obtener la vista anterior sin retroceder
function obtenerVistaAnterior() {
  if (viewStack.length > 1) {
    return viewStack[viewStack.length - 2];
  }
  return "viewFormatos";
}

// Mostrar el estado actual del historial (útil para debugging)
function mostrarHistorialVistas() {
  console.log("📚 Historial de vistas:", viewStack);
}

/**
 * activarVista: cambia la vista **por id** y dispara eventos/globales.
 * - Actualiza window.vistaActual y window.currentView
 * - Llama a showView para hacer el DOM update + protecciones
 */
function activarVista(viewId) {
  if (!viewId) {
    // limpiar vista actual
    window.vistaActual = null;
    window.currentView = null;
    document.dispatchEvent(new Event("viewChanged"));
    return;
  }

  const viewElem = resolveViewElement(viewId);
  if (!viewElem) {
    console.warn("activarVista: vista no encontrada:", viewId);
    return;
  }

  // Registrar la vista en el historial
  registrarVista(viewId);

  // Guardar vista anterior
  window.vistaAnterior = window.currentView;

  // Actualizar DOM + protecciones
  showView(viewElem);

  // Actualizar estado
  window.vistaActual = viewElem.id;
  window.currentView = viewElem.id;
  restaurarFormulario();

  localStorage.setItem("ultima_vista_activa", viewElem.id);

  // ---- CONTROL CENTRAL DE TABS ----

  if (vistasConTabs.includes(viewElem.id)) {
    mainTabs?.classList.remove("hidden-tabs");
    header?.classList.remove("hidden");
  } else {
    mainTabs?.classList.add("hidden-tabs");
    header?.classList.add("hidden");
  }

  //  AGREGAR SCROLL AUTOMÁTICO 
  try {
    // usar el padre con scroll o el documento
    const parent = getScrollParent(viewElem);
    parent.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    console.warn("Scroll en activarVista falló:", e);
  }

  // Notificar a listeners que la vista cambió
  document.dispatchEvent(new Event("viewChanged"));

}

function actualizarCampoSed() {

  if (window.rellenandoFormulario) {
    return;
  }

  if (!window.restauracionEnProceso) {
   // lógica sensible
  }

  console.log("actualizarCampoSed ejecutado");

  const valorEquipo = selectEquipo.value;
  const labelSed = document.querySelector('label[for="sed"]');
  const labelCircuito = document.querySelector('label[for="circuito"]');
  const suggestionsSed = document.getElementById("suggestions-sed");
  const inputSed = document.getElementById("sed");
  const mensajepequeño = document.getElementById("info-codigo");

  const esEquipoMT =
    valorEquipo === "Recloser" ||
    valorEquipo === "Seccionador de potencia con telemando";

  if (esEquipoMT) {

    labelSed.textContent = "Número de equipo MT";

    labelCircuito.textContent = "Circuito";

    if (mensajepequeño) {
      mensajepequeño.classList.add("activo");
    }

    activarSEDNumerico();

    suggestionsSed.style.display = "none";

    inputSed.value = limpiarNumeroEquipo(inputSed.value);

  } else {

    labelSed.textContent = "Subestación";

    labelCircuito.textContent = "Rotulado de puerta de celda";

    if (mensajepequeño) {
      mensajepequeño.classList.remove("activo");
    }

    activarSEDTexto();

    suggestionsSed.style.display = "";

  }

}

  function actualizarVisibilidadNodoFinal() {
    if (window.rellenandoFormulario) return;
    const valorEquipo = selectEquipo.value;
    //const campocircuito = document.getElementById("campo-circuito");
    const inputcircuito = document.getElementById("circuito");
    const campoNodoFinal = document.getElementById("campo-nodofinal");
    const inputNodoFinal = document.getElementById("nodofinal");

    if (
    valorEquipo === "Recloser" ||
    valorEquipo === "Seccionador de potencia con telemando"
    ) {
    // 👉 OCULTAR
    //campocircuito.classList.add("hidden-field");
    inputcircuito.required = false;
    campoNodoFinal.classList.add("hidden-field");
    inputNodoFinal.required = false;
    inputNodoFinal.value = "";
    // 🔥 FORZAR RECONCATENACIÓN
    actualizarConcatenacion();
    } else {
    // 👉 MOSTRAR
    //campocircuito.classList.remove("hidden-field");
    inputcircuito.required = true;
    campoNodoFinal.classList.remove("hidden-field");
    inputNodoFinal.required = true;

    actualizarConcatenacion();
    }
  }

  function actualizarCampoCodigo() {

  if (!window.restauracionEnProceso && !window.rellenandoFormulario) {
   // lógica sensible
  }

  const valorEquipoCA = selectEquipoCA.value;
  const labelCodigo = document.querySelector('label[for="codigo"]');
  const labelCircuitoCA = document.querySelector('label[for="CircuitoCA"]');
  //const inputCircuitoCA = document.getElementById("CircuitoCA");
  const suggestionsCodigo = document.getElementById("suggestions-codigo");
  const inputCodigo = document.getElementById("codigo");
  const mensajepequeñoCA = document.getElementById("info-codigo");

  const esEquipoMT =
    valorEquipoCA === "Recloser" ||
    valorEquipoCA === "Seccionador de potencia con telemando";

  if (esEquipoMT) {

    labelCodigo.textContent = "Número de equipo MT";

    labelCircuitoCA.textContent = "Circuito";

    if (mensajepequeñoCA) {
      mensajepequeñoCA.classList.add("activo");
    }

    activarCodigoNumerico();

    suggestionsCodigo.style.display = "none";

    //inputCircuitoCA.removeAttribute("readonly");

    inputCodigo.value = limpiarNumeroEquipo(inputCodigo.value);

  } else {

    labelCodigo.textContent = "SED";

    labelCircuitoCA.textContent = "Rotulado de puerta de celda";

    if (mensajepequeñoCA) {
      mensajepequeñoCA.classList.remove("activo");
    }

    activarCodigoTexto();

    suggestionsCodigo.style.display = "";

    //inputCircuitoCA.setAttribute("readonly", true);

  }

}

  function actualizarVisibilidadNodoFinalCA() {
    if (window.rellenandoFormulario) return;
    const valorEquipoCA = selectEquipoCA.value;
    //const campocircuitoCA = document.getElementById("campo-circuitoCA");
    const inputcircuitoCA = document.getElementById("CircuitoCA");
    const campoNodoFinalCA = document.getElementById("campo-nodofinalCA");
    const inputNodoFinalCA = document.getElementById("NodofinalCA");

    if (
    valorEquipoCA === "Recloser" ||
    valorEquipoCA === "Seccionador de potencia con telemando"
    ) {
    // 👉 OCULTAR
    //campocircuitoCA.classList.add("hidden-field");
    inputcircuitoCA.required = false;
    campoNodoFinalCA.classList.add("hidden-field");
    inputNodoFinalCA.required = false;
    inputNodoFinalCA.value = "";
    // 🔥 FORZAR RECONCATENACIÓN
    actualizarConcatenacionCambioAjuste();
    } else {
    // 👉 MOSTRAR
    //campocircuitoCA.classList.remove("hidden-field");
    inputcircuitoCA.required = true;
    campoNodoFinalCA.classList.remove("hidden-field");
    inputNodoFinalCA.required = true;
    actualizarConcatenacionCambioAjuste();
   }
 }

 function actualizarCampoRC() {
   const valorRC = selectEquipoPS.value;
   const labelRC = document.querySelector('label[for="RC"]');

   if (
   valorRC === "Seccionador"
   ) {
  // 🔹 Cambiar label
  labelRC.textContent = "Seccionador MT";

  } else {
  // 🔹 Restaurar label
  labelRC.textContent = "Reconectador MT";

   }
 }

 function activarSelectConOtros({
    wrapperId,
    selectId,
    btnVolverId,
    placeholderTexto
    }) {
    const wrapper = document.getElementById(wrapperId);
    const btnVolver = document.getElementById(btnVolverId);

    let selectOriginal = document.getElementById(selectId);
    const selectClonado = selectOriginal.cloneNode(true);

    function convertirAInput(valorGuardado = "") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = selectId;
    input.name = selectId;
    input.placeholder = placeholderTexto;
    input.value = valorGuardado;

    wrapper.replaceChild(input, document.getElementById(selectId));
    btnVolver.classList.remove("oculto");
    input.focus();
    }

    // 🔥 NUEVO BLOQUE IMPORTANTE
    setTimeout(() => {

    if (window.rellenandoFormulario) return;

    const selectActual = document.getElementById(selectId);
    if (!selectActual || selectActual.tagName !== "SELECT") return;

    const valorActual = selectActual.value;

    const existeEnOpciones = Array.from(selectActual.options)
      .some(opt => opt.value === valorActual);

    if (valorActual && !existeEnOpciones) {
      convertirAInput(valorActual);
    }

    }, 0);

    btnVolver.addEventListener("click", () => {
  const inputActual = document.getElementById(selectId);

  const nuevoSelect = selectClonado.cloneNode(true);
  nuevoSelect.value = "";

  wrapper.replaceChild(nuevoSelect, inputActual);
  btnVolver.classList.add("oculto");

    });
  }

function actualizarVisibilidadSegunPlantilla() {

  const extraFields = document.querySelectorAll(".extra-protocolo");

  // 📸 Seleccionamos los 5 campos de fotos específicos
  const idsFotos = ["fotoPlacaRele", "fotoPlacaEquipoMT", "fotoPuertaCelda", "fotoCeldaInterior", "fotoGabinete"];

  let mostrar = false;

  // 1️⃣ Si hay tarjeta activa
  const activeCard = document.querySelector(".formato-card.active");

  if (activeCard) {

    const selectedPdf = activeCard.getAttribute("data-pdf");

    if (selectedPdf === "Protocolodepruebas.pdf") {
      mostrar = true;
    }

  }

  // 2️⃣ Si estamos en modo edición
  else if (window.modoEdicionActivo && registroEnEdicion) {

    if (window.modoEdicionActivo && registroEnEdicion) {

    if (registroEnEdicion.tipo === "FORMPROTOCOLOPRUEBA") {

      document
        .querySelectorAll(".extra-protocolo")
        .forEach(el => el.classList.add("activo"));

    } else {

      document
        .querySelectorAll(".extra-protocolo")
        .forEach(el => el.classList.remove("activo"));
    }

      return; // 🔥 IMPORTANTE: cortar aquí
    }
  }

  // 3️⃣ Si se restauró desde localStorage
  const codigo = document.getElementById("CodigoUnico")?.value;

  if (codigo && codigo.startsWith("PP-")) {
    mostrar = true;
  }

  // aplicar visibilidad
  extraFields.forEach(el => {

    if (mostrar) {
      el.classList.add("activo");
    } else {
      el.classList.remove("activo");
    }

  });

  // --- 🆕 GESTIÓN DE OBLIGATORIEDAD (Solo para FORMPROTOCOLOPRUEBA) ---
  idsFotos.forEach(id => {
    const inputFoto = document.getElementById(id);
    if (inputFoto) {
      if (window.modoEdicionActivo && registroEnEdicion?.tipo === "FORMPROTOCOLOPRUEBA") {
        // En EDICIÓN: Dejan de ser obligatorios
        inputFoto.required = false;
      } else if (mostrar) {
        // En NUEVO REGISTRO: Son obligatorios si el protocolo está activo
        inputFoto.required = true;
      } else {
        // Si no se muestra el protocolo, no son obligatorios
        inputFoto.required = false;
      }
    }
  });

  // --- 🆕 CONTROL DE FOTOS PANORÁMICAS SEGÚN EQUIPO ---

  const equipoSeleccionado = document.getElementById("equipo")?.value;

  const esEquipoMT =
    equipoSeleccionado === "Recloser" ||
    equipoSeleccionado === "Seccionador de potencia con telemando";

  const grupoPanoramicas = document.getElementById("fotos-panoramicas-convencional");

  const idsPanoramicas = [
    "fotoPuertaCelda",
    "fotoCeldaInterior",
    "fotoGabinete"
  ];

  if (grupoPanoramicas) {

    if (esEquipoMT) {

      // ocultar panorámicas
      grupoPanoramicas.style.display = "none";

      // quitar obligatoriedad
      idsPanoramicas.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.required = false;
      });

    } else {

      // mostrar panorámicas
      grupoPanoramicas.style.display = "block";

      // restaurar required solo si no es edición
      if (!(window.modoEdicionActivo && registroEnEdicion?.tipo === "FORMPROTOCOLOPRUEBA")) {

        idsPanoramicas.forEach(id => {
          const input = document.getElementById(id);
          if (input) input.required = true;
        });
      }
    }
  }
}

// =============================
// 🔐 GESTIÓN DE CAMPOS CRÍTICOS EN LOCALSTORAGE
// =============================

function guardarCamposCriticosEnStorage() {
  const criticos = {};
  
  CAMPOS_CRITICOS.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value && el.value.trim() !== "") {
      criticos[id] = el.value;
    }
  });

  CAMPOS_HORA.forEach(id => {
    const el = document.getElementById(id);

    if (el) {
      if (!el.value) {
        el.value = obtenerHoraActual();
      }

      criticos[id] = el.value;
    }
  });
  
  if (Object.keys(criticos).length > 0) {
    localStorage.setItem("campos_criticos", JSON.stringify(criticos));
    console.log("💾 Campos críticos guardados en localStorage:", criticos);
  }
}

function restaurarCamposCriticosDesdeStorage() {
  const guardados = localStorage.getItem("campos_criticos");
  
  if (!guardados) {
    console.log("ℹ️ No hay campos críticos guardados en localStorage");
    return;
  }

  try {
    const criticos = JSON.parse(guardados);
    console.log("📌 Intentando restaurar campos críticos:", criticos);
    
    Object.entries(criticos).forEach(([id, valor]) => {
      const el = document.getElementById(id);
      if (el && valor) {
        el.value = valor;
        console.log(`✅ Campo crítico restaurado: ${id} = ${valor}`);
      }
    });
  } catch (e) {
    console.error("❌ Error restaurando campos críticos:", e);
  }
}

function guardarCamposCriticosTemporales() {
  const criticos = {};
  CAMPOS_CRITICOS.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value) {
      criticos[id] = el.value;
    }
  });
  return criticos;
}

function restaurarCamposCriticosTemporales(criticos) {
  if (!criticos || Object.keys(criticos).length === 0) return;
  
  Object.entries(criticos).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = valor;
      console.log(`🔄 Campo crítico restaurado (temporal): ${id} = ${valor}`);
    }
  });
}

// =============================================
// BOTÓN NEXT Y MODIFICAR - ÚNICO LISTENER GLOBAL
// =============================================

    function inicializarFormulario(modo = "nuevo") {


    // Guardar campos críticos ANTES de cualquier cosa
    let camposCriticosGuardados = {};
    if (modo === "nuevo") {
      camposCriticosGuardados = guardarCamposCriticosTemporales();
      console.log("💾 Campos críticos guardados (temporal):", camposCriticosGuardados);
    }

    // =============================================
    // 🔥 LIMPIAR DATOS ANTIGUOS AL INICIAR NUEVO FORMULARIO
    // =============================================
    if (modo === "nuevo") {
      // Borrar todos los drafts anteriores
      limpiarTodosDrafts();
      
      // También borrar datos ANSI
      localStorage.removeItem('datosANSI');
      datosANSICargados = null;

      console.log("🆕 Nuevo formulario iniciado - todos los datos antiguos limpiados");

      inicializarFechaYSemana;

      console.log("🆕 Nuevo formulario iniciado - todos los datos antiguos limpiados");

     }
     

    // =============================================
    // 1. GENERAR DATOS INICIALES EN NUEVO REGISTRO
    // =============================================

        if (modo === "nuevo") {

        aplicarNormalizacionAlimentador();

        const codigoInput = document.getElementById("CodigoUnico");

        if (!codigoInput.value) {
          const prefijoCodigo = obtenerPrefijoDesdeCard();
          const codigo = generarCodigoUnico(prefijoCodigo);

          codigoInput.value = codigo;

          document.getElementById("CodigoUnicoCA").value = codigo;
          document.getElementById("CodigoUnicoPS").value = codigo;
        }

          inicializarFechaYSemana("fecha", "semana");

          inicializarFechaYSemana("fechaCA", "SemanaCA");

          inicializarFechaYSemana("fechaPS", "SemanaPS");

          // RESTAURAR CAMPOS CRÍTICOS DESPUÉS DE INICIALIZAR
          restaurarCamposCriticosTemporales(camposCriticosGuardados);

        guardarProgresoFormulario();
      }
        // =============================================
        // 2. DETECTAR QUÉ PLANTILLA FUE SELECCIONADA
        // =============================================
        const activeCard = document.querySelector(".formato-card.active");
        if (!activeCard) return;

        const selectedPdf = activeCard.getAttribute("data-pdf");

        // Ocultar todas las views
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active-view"));

        // =============================================
        // PLANTILLA 1 → Protocolo de pruebas
        // =============================================
        if (selectedPdf === "Protocolodepruebas.pdf") {

            formularioSeleccionado = "Protocolodepruebas.pdf"; 

            document.getElementById("viewParte1").classList.add("active-view");
            activarVista("viewParte1");

          // ❌ quitar listeners antiguos
          selectEquipo.removeEventListener("change", actualizarCampoSed);
          selectEquipo.removeEventListener("change", actualizarVisibilidadNodoFinal);

          // ✅ volver a registrar listeners limpios
          selectEquipo.addEventListener("change", actualizarCampoSed);
          selectEquipo.addEventListener("change", actualizarVisibilidadNodoFinal);

          // ✅ aplicar estado inicial
          actualizarCampoSed();
          actualizarVisibilidadNodoFinal();

            // Ocultar campos exclusivos de PS
            document.querySelectorAll(".only-for-ps").forEach(el => {
                el.classList.add("hidden-field");
                const inputnew = el.querySelector("select, input, textarea");
                if (inputnew) inputnew.removeAttribute("required");
            });
        }

        // =============================================
        // PLANTILLA 2 → Puesta en Servicio (PS)
        // =============================================
        else if (selectedPdf === "Puestaenservicioderele.pdf") {

            formularioSeleccionado = "Puestaenservicioderele.pdf";

            document.getElementById("viewPuestaServicio").classList.add("active-view");
            activarVista("viewPuestaServicio");

            // Escuchar cambios
            selectEquipoPS.removeEventListener("change", actualizarCampoRC);
            selectEquipoPS.addEventListener("change", actualizarCampoRC);

            // Estado inicial
            actualizarCampoRC();

            //Cambiar tipo de campos (Select a Text, Text a Select)
            activarSelectConOtros({
            wrapperId: "wrapperNombre2",
            selectId: "Nombre2PS",
            btnVolverId: "btnVolverNombre2",
            placeholderTexto: "Ingrese el nombre"
            });

            activarSelectConOtros({
            wrapperId: "wrapperTensionAlimentacionSP",
            selectId: "TensionAlimentacionSP",
            btnVolverId: "btnVolverTensionAlimentacionSP",
            placeholderTexto: "Ingrese la tensión de alimentación"
            });
        }

        // =============================================
        // PLANTILLA 3 → Cambio de Ajustes
        // =============================================
        else if (selectedPdf === "Cambiodeajustes.pdf") {

            formularioSeleccionado = "Cambiodeajustes.pdf";

            document.getElementById("viewCambioAjuste").classList.add("active-view");
            activarVista("viewCambioAjuste");

        // ❌ quitar listeners antiguos
        selectEquipoCA.removeEventListener("change", actualizarCampoCodigo);
        selectEquipoCA.removeEventListener("change", actualizarVisibilidadNodoFinalCA);

        // ✅ volver a registrar listeners limpios
        selectEquipoCA.addEventListener("change", actualizarCampoCodigo);
        selectEquipoCA.addEventListener("change", actualizarVisibilidadNodoFinalCA);

        // ✅ aplicar estado inicial
        actualizarCampoCodigo();
        actualizarVisibilidadNodoFinalCA();

        }
    }

function registrarListenersFormulario() {

  if (selectEquipo && !selectEquipo.dataset.listener) {
    selectEquipo.addEventListener("change", actualizarCampoSed);
    selectEquipo.dataset.listener = "true";
  }

  if (selectEquipoCA && !selectEquipoCA.dataset.listener) {
    selectEquipoCA.addEventListener("change", actualizarCampoCodigo);
    selectEquipoCA.dataset.listener = "true";
  }

  if (selectEquipoPS && !selectEquipoPS.dataset.listener) {
    selectEquipoPS.addEventListener("change", actualizarCampoRC);
    selectEquipoPS.dataset.listener = "true";
  }
}

function normalizarAlimentador(valor) {
  if (!valor) return "";

  return valor
    .normalize("NFD")                 // elimina acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")     // elimina todo lo que no sea letra o número
    .toUpperCase();                   // opcional: uniformizar
}

function aplicarNormalizacionAlimentador() {

  ["alim","Alimentador","AlimentadorRC"].forEach(id => {

    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", () => {

      if (!input.value) return;

      input.value = normalizarAlimentador(input.value);

    });

  });

}

// ===== 1. LISTA DE DATOS PARA LOS CAMPOS =====
// SED y CODIGO son nodos iniciales, usan la misma lista.
const listaNodos = DATA_LISTS.NODOS;

// ===== LISTA DE SUGERENCIA PARA TRABAJO EFECTUADO =====
const listadetrabajoefectuado = DATA_LISTS.TRABAJO_EFECTUADO;

// ===== LISTA DE SUGERENCIA PARA MARCA DE EQUIPO =====
const ListaMarcaEquipo = DATA_LISTS.MARCA_EQUIPO;

// ===== LISTA DE SUGERENCIA PARA MODELO DE EQUIPO =====
const ListaModeloEquipo = DATA_LISTS.MODELO_EQUIPO;

// ===== LISTA DE SUGERENCIA PARA MARCA DE RELE =====
const ListaMarcaRele = DATA_LISTS.MARCA_RELE;

// ===== LISTA DE SUGERENCIA PARA MODELO DE EQUIPO =====
const ListaModeloRele = DATA_LISTS.MODELO_RELE;

function formatearFecha(fechaISO) {
  if (!fechaISO) return '-';

  const partes = fechaISO.split('-');
  if (partes.length !== 3) return fechaISO;

  const [yyyy, mm, dd] = partes;
  return `${dd}/${mm}/${yyyy}`;
}

function mostrarLoaderHistorial() {
  document.getElementById("loaderHistorial")?.classList.remove("hidden");
}

function ocultarLoaderHistorial() {
  document.getElementById("loaderHistorial")?.classList.add("hidden");
}

//FUNCIONES PARA VISUALIZAR REGISTROS EXISTENTES EN HISTORIAL
function renderHistorial(registros) {

  console.log("[Historial] registros:", registros);

  if (!Array.isArray(registros)) {
    console.warn("[Historial] registros no es array:", registros);
    return;
  }

  const contenedor = document.getElementById('historialList');
  contenedor.innerHTML = '';

  registros.forEach(reg => {

    const responsableTexto = reg.Responsable2
      ? `${reg.Responsable1} y ${reg.Responsable2}`
      : reg.Responsable1 || '-';

    const card = document.createElement('div');
    card.className = 'historial-item';

    // Valores ocultos
    card.dataset.id = reg.ID;
    card.dataset.lista = reg.Lista;

    card.innerHTML = `
      <div class="historial-row top">
        <span><strong>Fecha de prueba:</strong> ${formatearFecha(reg.Fecha)}</span>
        <span class="semana">${reg.Semana || '-'}</span>
      </div>

      <div class="historial-row tipo">
        ${reg.Tipo || '-'}
      </div>

      <div class="historial-row doble">
        <span>${reg.Alim || '-'}</span>
        <span>${reg.Enlace || '-'}</span>
      <button class="btn-detalle" type="button">
        Ver detalles
      </button>
      </div>

      <div class="historial-row equipo">
        ${reg.Equipo || '-'}
      </div>

      <div class="historial-row responsable">
        <strong>Responsable:</strong> ${responsableTexto}
      </div>
    `;

    const btnDetalle = card.querySelector('.btn-detalle');
    btnDetalle.addEventListener('click', (e) => {
      e.stopPropagation(); // 🔴 MUY IMPORTANTE
      abrirDetalleRegistro(reg);
    });

    card.addEventListener('click', () => seleccionarRegistro(card));
    contenedor.appendChild(card);
  });
}

//SELECCION DE TARJETA VISUAL
let registroEnEdicion = {
  id: null,
  lista: null,
  tipo: null // PP | PS | CA
};

let modoEdicion = false;

function seleccionarRegistro(card) {

  document.querySelectorAll('.historial-item')
    .forEach(i => i.classList.remove('selected'));

  card.classList.add('selected');

  registroEnEdicion.id = card.dataset.id;
  registroEnEdicion.lista = card.dataset.lista;
  registroEnEdicion.tipo = obtenerTipoFormularioDesdeID(card.dataset.lista);

  console.log("Seleccionado:", registroEnEdicion);
}

function buscarConDebounce(filtros) {

  clearTimeout(debounceBusqueda);

  debounceBusqueda = setTimeout(() => {

    cargarHistorial({
      modo: "busqueda",
      filtros: filtros,
      force: true
    });

  }, 400); // tiempo de espera
}


const btn = document.getElementById("btn-buscar");
btn.addEventListener("click", buscarHistorial);

async function buscarHistorial() {

  if (btn.disabled) return;

  const codigo = document.getElementById("buscarCodigo").value.trim();
  const tipoFormato = document.getElementById("buscarTipoFormato").value;
  const responsable = document.getElementById("buscarResponsable").value;
  const semana = document.getElementById("buscarSemana").value;
  const anio = document.getElementById("buscarAnio").value;

  if (!tipoFormato) {
    mostrarMensaje("Debe seleccionar el tipo de formato", "warning");
    btn.disabled = false;
    return;
  }

  let semanaTrabajo = null;

  if (semana && anio) {
    semanaTrabajo = `Semana ${semana} - ${anio}`;
  } else if (semana) {
    semanaTrabajo = `Semana ${semana} -`; // incluir guion
  } else if (anio) {
    semanaTrabajo = `- ${anio}`; // incluye espacio antes del guion
  }

  btn.disabled = true;
  btn.textContent = "⏳ Buscando...";

  const filtros = {
    codigo: codigo || null,
    tipoFormato: tipoFormato,
    responsable: responsable || null,
    semanaTrabajo: semanaTrabajo || null
  };

  // 🔥 AQUÍ VA
  const key = JSON.stringify(filtros);

  if (key === ultimaBusqueda) {
    console.log("🔁 Misma búsqueda detectada→ forzando actualización");

    // ⚠️ IMPORTANTE: en tu caso NO bloqueamos
    // solo informamos (porque quieres permitir refrescar)
  }

  ultimaBusqueda = key;

  // 🔹 limpiar resultados anteriores
  const lista = document.getElementById("historialList");
  if (lista) lista.innerHTML = "";

  buscarConDebounce(filtros, true);
}

function limpiarFiltros() {
    // Limpia el input de texto
    const inputCodigo = document.getElementById("buscarCodigo");
    if (inputCodigo) inputCodigo.value = "";
    
    // Resetea los selectores al valor por defecto
    const selectFormato = document.getElementById("buscarTipoFormato");
    if (selectFormato) selectFormato.selectedIndex = 0;

    const selectSemana = document.getElementById("buscarSemana");
    if (selectSemana) selectSemana.selectedIndex = 0;

    const selectAnio = document.getElementById("buscarAnio");
    if (selectAnio) selectAnio.value = "";
    
    const selectResponsable = document.getElementById("buscarResponsable");
    if (selectResponsable) selectResponsable.selectedIndex = 0;

    mostrarMensaje("🗳️ Filtros borrados correctamente", "info");
}

const btnLimpiar = document.getElementById("btn-borrarfiltros");

if (btnLimpiar) {
  btnLimpiar.addEventListener("click", limpiarFiltros);
}

//LLAMADA A FLUJO PARA CARGAR HISTORIAL DE REGISTROS

let cacheBusqueda = {};

async function cargarHistorial(opciones = {}) {

  const { modo = "ultimos7", filtros = null, force = false } = opciones;

  ultimoModoHistorial = modo;
  ultimosFiltrosHistorial = filtros;

  if (controladorFetch) {
  controladorFetch.abort();
  }

  controladorFetch = new AbortController();

  // 🔹 cache para últimos 7 días
  if (
    modo === "ultimos7" &&
    historialCargado &&
    historialCache &&
    !force
  ) {
    console.log("[Historial] Usando cache últimos 7");
    renderHistorial(historialCache);
    return;
  }

  // 🔹 cache para búsquedas
  if (modo === "busqueda" && filtros && !force) {

    const key = JSON.stringify(filtros);

    if (cacheBusqueda[key]) {
      console.log("[Historial] Usando cache búsqueda");
      renderHistorial(cacheBusqueda[key]);
      return;
    }
  }

  mostrarLoaderHistorial();

  try {

    let body = {};

    if (modo === "ultimos7") {
      body = { dias: 7 };
    }

    if (modo === "busqueda" && filtros) {
      body = {
        modo: "busqueda",
        ...filtros
      };
    }

    const response = await fetch(ENDPOINTS.HISTORIAL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controladorFetch.signal
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Flujo error ${response.status}`);
    }

    // El flujo devuelve { total, data }
    const registros = Array.isArray(result.data)
      ? result.data
      : JSON.parse(result.data);

    // 🔹 Guardar cache solo si es últimos 7 días
    if (modo === "ultimos7") {
      historialCache = registros;
      historialCargado = true;
    }

    // 🔹 guardar cache búsqueda
    if (modo === "busqueda" && filtros) {
      const key = JSON.stringify(filtros);
      cacheBusqueda[key] = registros;
    }

    renderHistorial(registros);

  } catch (err) {

  if (err.name === "AbortError") {
    console.log("[Historial] Fetch cancelado");
    return;
  }

  console.error("[Historial] Error:", err);

} finally {
    ocultarLoaderHistorial();
    const btn = document.getElementById("btn-buscar");
    if (btn){
      btn.disabled = false;
      btn.textContent = "🔍 Buscar";
    }
  }
}

// Funcion para rellenar vista de detalles
if (btnVolverDetalle) {
  btnVolverDetalle.addEventListener("click", () => {
    showView(viewHistorial); // Muestra la vista principal/de selección
    activarVista("viewHistorial");
  });
}

function mostrarLoaderDetalle() {
  document.getElementById("loaderDetalle")?.classList.remove("hidden");
}

function ocultarLoaderDetalle() {
  document.getElementById("loaderDetalle")?.classList.add("hidden");
}

async function cargarDetalleRegistro(id, lista, tipoFormulario) {

  // 🔁 Si ya existe en cache → usarlo
  if (cacheDetalleRegistros[id]) {
    console.log("Usando detalle desde cache:", id);
    renderDetalleRegistro(cacheDetalleRegistros[id], tipoFormulario);
    return;
  }

  // 🧹 Limpia contenido anterior
  document.getElementById("detalleGeneral").innerHTML = "";
  document.getElementById("detalleEspecifico").innerHTML = "";

  // ▶️ Mostrar loader
  mostrarLoaderDetalle();

  try {

    console.log("Consultando flujo para detalle:", id);

    const response = await fetch(
      ENDPOINTS.DETALLE_REGISTRO,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, lista })
      }
    );

    const data = await response.json();

    // ✅ Guardar en cache
    cacheDetalleRegistros[id] = data;

    renderDetalleRegistro(data, tipoFormulario);

  } catch (err) {
    console.error("Error cargando detalle:", err);

  } finally {
    // ⛔ Siempre ocultar loader
    ocultarLoaderDetalle();
  }
}

function abrirDetalleRegistro(registro) {

  console.log("Registro recibido:", registro);

  registroEnEdicion.id = registro.ID;
  registroEnEdicion.lista = registro.Lista;
  registroEnEdicion.tipo = obtenerTipoFormularioDesdeID(registro.Lista);

  modoEdicion = true;   // 🔥 ESTA ERA LA PIEZA QUE FALTABA

  console.log("Editar listo:", registroEnEdicion);

  const btn = document.getElementById('btnModificar');
  if (btn) btn.disabled = false;

  activarVista("viewDetalleRegistro");
  cargarDetalleRegistro(registro.ID, registro.Lista, registroEnEdicion.tipo);
}

function renderItem(label, value) {
  if (value === null || value === undefined || value === "") return "";
  return `<div class="detalle-item"><span>${label}: </span><strong>${value}</strong></div>`;
}

function renderResponsable(resp1, resp2) {
  if (!resp1 && !resp2) return "";

  let texto = resp1 || "";
  if (resp1 && resp2) {
    texto += " y " + resp2;
  } else if (!resp1 && resp2) {
    texto = resp2;
  }

  return `<div class="detalle-item"><span>Responsable: </span><strong>${texto}</strong></div>`;
}


function renderDetalleGeneral(reg) {
  const cont = document.getElementById("detalleGeneral");

  cont.innerHTML = `
    ${renderItem("Fecha", formatearFecha(reg.Fecha))}
    ${renderItem(reg.Semana)}
    ${renderItem("Tipo", reg.Tipo)}
    ${renderItem("Alimentador", reg.Alim)}
    ${renderItem("Enlace", reg.Enlace)}
    ${renderItem("Tensión", reg.Tension)}
    ${renderItem("Equipo", reg.Equipo)}
    ${renderItem("Marca de relé", reg.MarcaRele)}
    ${renderItem("Modelo de relé", reg.ModeloRele)}
    ${renderResponsable(reg.Responsable1, reg.Responsable2)}
    ${renderItem("Ángulo de polarización en oscilografía", reg.AnguloPolarizacion)}
  `;
}

function renderDetalleRegistro(data, tipoFormulario) {
  renderDetalleGeneral(data.general);

  renderDetalleEspecifico(tipoFormulario, data.detalle);
}

function obtenerTipoFormularioDesdeID(id) {
  const prefijo = id.substring(0, 2);

  switch (prefijo) {
    case "PP": return "FORMPROTOCOLOPRUEBA";
    case "PS": return "FORMPUESTASERVICIO";
    case "CA": return "FORMCAMBIOAJUSTE";
    default: return null;
  }
}

function renderDetalleEspecifico(tipoFormulario, data) {
  const cont = document.getElementById("detalleEspecifico");
  cont.innerHTML = "";

  const config = FORM_CONFIG[tipoFormulario];
  if (!config) return;

  document.getElementById("tituloDetalleTecnico").textContent = config.titulo;

  config.secciones.forEach(sec => {
    if (sec.tipo === "tabla") {
      const tablaHTML = renderTabla(
      sec.titulo,
      sec.columnas,
      data[sec.titulo] || []
    );

      if (tablaHTML !== "") {
        cont.innerHTML += tablaHTML;
      }
    }
  });
}

  const FORM_CONFIG = {
  FORMPROTOCOLOPRUEBA: {
    titulo: "Funciones ANSI",
    secciones: [
      {
        titulo: "Ajustes recomendados",
        tipo: "tabla",
        columnas: ["Función", "Curva", "I prim (A)", "I sec (A)", "t (seg) / TMS", "3Uo (V) prim", "Forward/ Reverse", "Ángulo"]
      },
      {
        titulo: "Ajustes realizados",
        tipo: "tabla",
        columnas: ["Función", "Curva", "I prim (A)", "I sec (A)", "t (seg) / TMS", "3Uo (V) prim", "Forward/ Reverse", "Ángulo"]
      },
      {
        titulo: "Valores de prueba",
        tipo: "tabla",
        columnas: ["Parametros", "Prueba 1 (Fase R)", "Prueba 2 (Fase R)", "Prueba 3 (Fase R)", "Prueba 1 (Fase S)", "Prueba 2 (Fase S)", "Prueba 3 (Fase S)", "Prueba 1 (Fase T)", "Prueba 2 (Fase T)", "Prueba 3 (Fase T)", "Prueba 1 (Fase Neutro)", "Prueba 2 (Fase Neutro)", "Prueba 3 (Fase Neutro)"]
      }
    ]
  },

  FORMPUESTASERVICIO: {
    titulo: "Ajustes de la protección",
    secciones: [
      {
        titulo: "Ajuste 51/50P",
        tipo: "tabla",
        columnas: ["Parámetro", "Valor"]
      },
      {
        titulo: "Ajuste 67P-1",
        tipo: "tabla",
        columnas: ["Parámetro", "Valor"]
      },
      {
        titulo: "Ajuste 67N-1",
        tipo: "tabla",
        columnas: ["Parámetro", "Valor"]
      },
      {
        titulo: "Ajuste 51/50N",
        tipo: "tabla",
        columnas: ["Parámetro", "Valor"]
      },
      {
        titulo: "Ajuste 67N-2",
        tipo: "tabla",
        columnas: ["Parámetro", "Valor"]
      },
      {
        titulo: "Ajuste 59N",
        tipo: "tabla",
        columnas: ["Parámetro", "Valor"]
      }
    ]
  },

  FORMCAMBIOAJUSTE: {
    titulo: "Descripción de las funciones",
    secciones: [
      {
        titulo: "Sobrecorriente de fases DPHLPDOC1 67-1 (1)",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Sobrecorriente de fases DPHLPDOC2 67-1 (2)",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Sobrecorriente de fases DPHHPDOC1 67-2",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Sobrecorriente de fases PHIPTOC1 50P/51P",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Falla a tierra DEFLPDEF1 67N-1 (1)",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Falla a tierra DEFLPDEF2 67N-1 (2)",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Falla a tierra DEFHPDEF1 67N-2",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Falla a tierra EFLPTOC1 51N-1 (1)",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Tension homopolar ROVPTOV1 59G",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      },
      {
        titulo: "Tension homopolar ROVPTOV2 59G-2",
        tipo: "tabla",
        columnas: ["Parametros", "Ajuste Solicitado", "Ajuste Recomendado"]
      }
    ]
  }
};

function tieneValor(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  return true;
}

function renderTabla(titulo, columnas, filas) {

  if (!Array.isArray(filas)) return "";

  // 🔹 1. Filtrar filas con MENOS de 3 valores reales
  const filasValidas = filas.filter(fila => {
    if (!Array.isArray(fila)) return false;
    const valoresReales = fila.filter(v => tieneValor(v));
    return valoresReales.length >= 2;
  });

  // ❌ No queda ninguna fila útil → no mostrar tabla ni título
  if (filasValidas.length === 0) return "";

  // 🔹 2. Detectar columnas que aporten datos reales (≥ 2 valores)
  const columnasConDatos = columnas
    .map((_, colIndex) => {
      const count = filasValidas.filter(fila =>
        tieneValor(fila[colIndex])
      ).length;
      return count >= 1;
    })
    .map((ok, i) => ok ? i : -1)
    .filter(i => i !== -1);

  // ❌ Ninguna columna aporta información
  if (columnasConDatos.length === 0) return "";

  // 🔹 3. Render limpio
  return `
  <div class="detalle-table">
    <h3>${titulo}</h3>

    <div class="tabla-scroll">
      <table>
        <thead>
          <tr>
            ${columnasConDatos.map(i => `<th>${columnas[i]}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${filasValidas.map(fila => `
            <tr>
              ${columnasConDatos.map(i =>
                `<td>${tieneValor(fila[i]) ? fila[i] : ""}</td>`
              ).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

  </div>
`;
}

//FUNCIONES PARA MODIFICAR EL REGISTRO DESDE APP
document.addEventListener("click", function (e) {

  if (e.target.closest("#btnModificar")) {

    console.log("CLICK en botón modificar (delegado)");

    if (!registroEnEdicion?.id) {
      alert("Seleccione un registro primero");
      return;
    }

    console.log("Registro para editar:", registroEnEdicion);

    switch (registroEnEdicion.tipo) {

      case 'FORMPROTOCOLOPRUEBA':
        abrirFormulario1ParaEdicion();
        break;

      case 'FORMPUESTASERVICIO':
        abrirFormulario2ParaEdicion();
        break;

      case 'FORMCAMBIOAJUSTE':
        abrirFormulario3ParaEdicion();
        break;

      default:
        console.warn("Tipo no reconocido:", registroEnEdicion.tipo);
        alert("Tipo de registro no reconocido");
    }

    if (registroEnEdicion.tipo === "FORMPROTOCOLOPRUEBA") {

    document
      .querySelectorAll(".extra-protocolo")
      .forEach(el => el.classList.add("activo"));

    } else {

    document
      .querySelectorAll(".extra-protocolo")
      .forEach(el => el.classList.remove("activo"));
    }

    delete cacheDetalleRegistros[registroEnEdicion.id];
  }
});

async function esperarElementos(ids, timeout = 4000) {
  const inicio = Date.now();

  return new Promise((resolve, reject) => {

    const intervalo = setInterval(() => {

      const todosListos = ids.every(id => {
        const el = document.getElementById(id);
        return el && el.isConnected;
      });

      if (todosListos) {
        clearInterval(intervalo);
        resolve();
      }

      if (Date.now() - inicio > timeout) {
        clearInterval(intervalo);
        console.warn("Algunos campos no aparecieron a tiempo");
        resolve(); // no rechazar para no romper flujo
      }

    }, 100);

  });
}


function normalizarNumero(valor){

  if(!valor) return "";

  const numeros = valor.toString().match(/\d+/g);

  if(!numeros) return "";

  return numeros.join("");

}

function esEquipoMT(valor){
  return valor === "Recloser" ||
         valor === "Seccionador de potencia con telemando";
}

function aplicarDatos(data) {

  const equipoActual = data.equipo?.Value || data.equipo;
  const equipoCA = data.equipoCA?.Value || data.equipoCA;

  console.log("equipoActual:", equipoActual);
  console.log("equipoCA:", equipoCA);

  const equipoEsMT = esEquipoMT(equipoActual) || esEquipoMT(equipoCA);

  console.log("equipoEsMT:", equipoEsMT);

  for (const key of Object.keys(data)) {

    const el = document.getElementById(key);
    if (!el) continue;

    let valor = data[key];
    if (valor === null || valor === undefined) continue;

    // SharePoint Choice / Lookup
    if (typeof valor === "object" && valor.Value !== undefined) {
      valor = valor.Value;
    }

    // 🔥 Guardar valor original antes de cualquier modificación
    if (key === "sed") {
      window.valorOriginalSED = valor;
    }

    if (key === "codigo") {
      window.valorOriginalCodigo = valor;
    }

    console.log("Procesando campo:", key, "valor:", valor);

    if (
      (el.type === "number" || el.getAttribute("inputmode") === "numeric") &&
      key !== "sed" &&
      key !== "codigo"
    ) {
      el.value = normalizarNumero(valor);
    }
    else if (el.type === "checkbox") {
      el.checked = Boolean(valor);
    }
    else if (el.tagName === "SELECT") {
      el.value = valor;
    }
    else {

      if ((key === "sed" || key === "codigo") && equipoEsMT) {
        valor = normalizarNumero(valor);
      }

      el.value = valor;
    }
  }

  // Recalcular concatenaciones cuando Automate termina
  setTimeout(() => {
    actualizarConcatenacion();
    actualizarConcatenacionCambioAjuste();
  }, 50);

}

async function rellenarFormularioDinamico(data) {

  window.rellenandoFormulario = true;

  // 🔁 Primer pase
  aplicarDatos(data);

  // ⏳ Esperar a que se creen campos dependientes
  await esperarElementos(Object.keys(data));

  // 🔁 Segundo pase
  aplicarDatos(data);

  window.rellenandoFormulario = false;

  // 🔥 agregar esto
  await new Promise(r => setTimeout(r, 50));

  console.log("SED antes sync:", document.getElementById("sed")?.value);

  sincronizarEstadoDinamico();

  console.log("SED después sync:", document.getElementById("sed")?.value);

  // 🔧 volver a aplicar SED y CÓDIGO si cambiaron de tipo
  if (data.sed) {
    const sedEl = document.getElementById("sed");
    if (sedEl) sedEl.value = normalizarNumero(data.sed);
  }

  if (data.codigo) {
    const codEl = document.getElementById("codigo");
    if (codEl) codEl.value = normalizarNumero(data.codigo);
  }

  // 🔥 SOLO EN MODO EDICIÓN — normalizar después del cambio de tipo
  if (window.modoEdicionActivo) {
    document.querySelectorAll('input[type="number"]').forEach(el => {
      if (el.value) {
        el.value = normalizarNumero(el.value);
      }
    });
  }

  console.log("Formulario rellenado completamente");

}

/**
 * Obtiene el formulario actual basado en la vista activa
 */
function obtenerFormularioActual() {
  if (!window.currentView) return null;
  
  for (const [formulario, vistas] of Object.entries(mapaFormularios)) {
    if (vistas.includes(window.currentView)) {
      return formulario;
    }
  }
  
  return null;
}

function obtenerPrefijoPorCampo(id) {
  if (id === "CodigoUnico") return "PP";
  if (id === "CodigoUnicoCA") return "CA";
  if (id === "CodigoUnicoPS") return "PS";
  return null;
}

function asegurarCamposCriticos() {

  // 🔒 NO tocar en edición
  if (window.modoEdicionActivo) return;

  // 🔹 CODIGOS
  CAMPOS_CODIGO.forEach(id => {
  const el = document.getElementById(id);

  if (el && !el.value.trim()) {

    const prefijo = obtenerPrefijoPorCampo(id);

    if (!prefijo) {
      console.warn(`⚠️ No se pudo determinar prefijo para ${id}`);
      return;
    }

    el.value = generarCodigoUnico(prefijo);

    console.log(`🔄 Código único regenerado en ${id}`);
  }
});

  const nuevaHora = obtenerHoraActual();

  // 🔹 HORAS
  CAMPOS_HORA.forEach(id => {
    const el = document.getElementById(id);

    if (el && !el.value) {
      el.value = nuevaHora;
      console.warn(`⏰ Hora regenerada en ${id}`);
    }
  });

}

// =============================
// GUARDADO AUTOMÁTICO (GLOBAL)
// =============================
function guardarProgresoFormulario() {

  if (!window.currentView) return;

  const formActual = obtenerFormularioActual();
  if(!formActual) return;

  const vistas = mapaFormularios[formActual];
  if (!vistas || vistas.length === 0) return;

  const inputs = document.querySelectorAll(
    vistas.map(v => `#${v} input, #${v} textarea, #${v} select`).join(',')
  );
  const data = {};

  inputs.forEach(el => {

    const key = el.name || el.id;
    if (!key) return;

    if (el.type === 'file') return; // evitar errores

    if (el.type === 'checkbox') {
      data[key] = el.checked;
    }

    else if (el.type === 'radio') {
      if (el.checked) data[key] = el.value;
    }

    else {
      data[key] = el.value;
    }

  });

   // Guardar en localStorage
  const draftKey = `formulario_draft_${formActual}`;

  try {

    localStorage.setItem(
      draftKey,
      JSON.stringify(data)
    );

    // TAMBIÉN guardar campos críticos independientemente
    guardarCamposCriticosEnStorage();

  } catch (e) {

    console.warn("LocalStorage lleno o bloqueado");

  }

}

// LOADER INTERNO EN VISTAS DE FORMULARIO

function mostrarLoaderVista(viewId, formId){

  document
    .getElementById("loader-" + viewId)
    ?.classList.remove("hidden");

  document
    .getElementById(formId)
    ?.classList.add("hidden");
}

function ocultarLoaderVista(viewId, formId){

  document
    .getElementById("loader-" + viewId)
    ?.classList.add("hidden");

  document
    .getElementById(formId)
    ?.classList.remove("hidden");
}

async function cargarDatosFormulario(id, tipo) {

  console.log("Llamando flujo edición con:", { id, tipo });

  const response = await fetch(
    ENDPOINTS.CARGAR_DATOS_EDICION,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tipo })
    }
  );

  const result = await response.json();

  console.log("Respuesta del flujo:", result);

  return result;   // 👈 CLAVE
}

async function abrirFormulario1ParaEdicion() {

  window.modoEdicionActivo = true;

  localStorage.removeItem('formulario_draft_' + window.currentView);

  const vista = "viewParte1";
  const form = "protocolo-form1";

  activarVista(vista);
  registrarListenersFormulario();
  mostrarLoaderVista(vista, form);

  try {

    const data = await cargarDatosFormulario(registroEnEdicion.id, registroEnEdicion.tipo);

    // 🔹 2️⃣ Esperar que todos los campos existan
    const ids = Object.keys(data);
    await esperarElementos(ids);

    // 🔹 3️⃣ Rellenar datos del flujo
    await rellenarFormularioDinamico(data);

    actualizarVisibilidadSegunPlantilla();

    sincronizarTrabajadores();

    // 🔥 esperar que la lógica dinámica cree o modifique campos
    await new Promise(r => setTimeout(r, 100));

    // 🔹 4️⃣ Inicializar select/inputs dependientes SIN resetear campos
    sincronizarEstadoDinamico();

    if (!window.modoEdicionActivo) {
    guardarProgresoFormulario();
  }

    mostrarMensaje("Registro cargado exitosamente");

  } catch (e) {
    console.error(e);
    alert("Error cargando registro");
  }
  finally {
    ocultarLoaderVista(vista, form);
  }
}

async function abrirFormulario2ParaEdicion() {

  window.modoEdicionActivo = true;

  const vista = "viewPuestaServicio";
  const form  = "protocolo-form7";

  activarVista(vista);
  registrarListenersFormulario();
  mostrarLoaderVista(vista, form);

  try {

    const data = await cargarDatosFormulario(registroEnEdicion.id, registroEnEdicion.tipo);

    // 🔹 2️⃣ Esperar que todos los campos existan
    const ids = Object.keys(data);
    await esperarElementos(ids);

    // 🔹 3️⃣ Rellenar datos del flujo
    await rellenarFormularioDinamico(data);

    sincronizarTrabajadores();

    // 🔥 esperar que la lógica dinámica cree o modifique campos
    await new Promise(r => setTimeout(r, 100));

    // 🔹 4️⃣ Inicializar select/inputs dependientes SIN resetear campos
    sincronizarEstadoDinamico();

    if (!window.modoEdicionActivo) {
    guardarProgresoFormulario();
  }

    mostrarMensaje("Registro cargado exitosamente");

  } catch (e) {
    console.error(e);
    alert("Error al cargar registro");

  } finally {

    ocultarLoaderVista(vista, form);

  }
}

async function abrirFormulario3ParaEdicion() {

  window.modoEdicionActivo = true;

  const vista = "viewCambioAjuste";
  const form  = "protocolo-form5";

  activarVista(vista);
  registrarListenersFormulario();
  mostrarLoaderVista(vista, form);

  try {

    const data = await cargarDatosFormulario(registroEnEdicion.id, registroEnEdicion.tipo);

    // 🔹 2️⃣ Esperar que todos los campos existan
    const ids = Object.keys(data);
    await esperarElementos(ids);

    // 🔹 3️⃣ Rellenar datos del flujo
    await rellenarFormularioDinamico(data);

    sincronizarTrabajadores();
    
    // 🔥 esperar que la lógica dinámica cree o modifique campos
    await new Promise(r => setTimeout(r, 100));

    // 🔹 4️⃣ Inicializar select/inputs dependientes SIN resetear campos
    sincronizarEstadoDinamico();

    if (!window.modoEdicionActivo) {
    guardarProgresoFormulario();
  }

    mostrarMensaje("Registro cargado exitosamente");

  } catch (e) {
    console.error(e);
    alert("Error al cargar registro");

  } finally {

    ocultarLoaderVista(vista, form);

  }
}

// ===== 2. FUNCIÓN DE AUTOCOMPLETADO  =====
function setupAutocomplete(inputElement, dataList, suggestionsElement, onSelectCallback = null) {

  function onInput() {
    const value = inputElement.value.trim().toUpperCase();
    suggestionsElement.innerHTML = "";
    suggestionsElement.style.display = "none";

    // 🔥 CLAVE: actualizar concatenación AL ESCRIBIR
    if (onSelectCallback) {
      onSelectCallback();
    }

    if (value.length === 0) return;

    const filteredData = dataList.filter(item =>
      item.toUpperCase().includes(value)
    );

    if (filteredData.length > 0) {
      suggestionsElement.style.display = "block";

      filteredData.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;

        li.addEventListener("click", () => {
          inputElement.value = item;
          suggestionsElement.style.display = "none";
          inputElement.focus();

          if (onSelectCallback) {
            onSelectCallback();
          }
        });

        suggestionsElement.appendChild(li);
      });
    }
  }

  function onDocumentClick(e) {
    if (e.target !== inputElement && !suggestionsElement.contains(e.target)) {
      suggestionsElement.style.display = "none";
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      suggestionsElement.style.display = "none";
    }
  }

  // 🔹 ACTIVAR LISTENERS
  inputElement.addEventListener("input", onInput);
  document.addEventListener("click", onDocumentClick);
  inputElement.addEventListener("keydown", onKeyDown);

  // 🔹 DEVOLVER CONTROLADOR
  return {
    destroy() {
      inputElement.removeEventListener("input", onInput);
      document.removeEventListener("click", onDocumentClick);
      inputElement.removeEventListener("keydown", onKeyDown);
      suggestionsElement.innerHTML = "";
      suggestionsElement.style.display = "none";
    }
  };
}

// ===== 3. INICIALIZAR LA FUNCIÓN PARA CADA CAMPO CON COMPROBACIÓN =====
// El código se ejecutará siempre, pero solo inicializará el autocompletado si los elementos existen en la vista actual.

// --- Campo 1: SED (viewParte1) ---
const inputSED = document.getElementById("sed");
const suggestionsListSED = document.getElementById("suggestions-sed");

let sedAutocomplete = null;

// Activa el autocomplete
function activarAutocompleteSED() {
  if (autocompleteSEDActivo) return;

  sedAutocomplete = setupAutocomplete(
    inputSED,
    listaNodos,
    suggestionsListSED,
    actualizarConcatenacion
  );

  autocompleteSEDActivo = true;
}

function desactivarAutocompleteSED() {
  if (!autocompleteSEDActivo) return;

  suggestionsListSED.innerHTML = "";
  suggestionsListSED.style.display = "none";

  if (sedAutocomplete && sedAutocomplete.destroy) {
    sedAutocomplete.destroy();
    sedAutocomplete = null;
  }

  autocompleteSEDActivo = false;
}

// --- Campo 2: nodofinal (viewParte1) ---
const inputNodoFinal = document.getElementById("nodofinal");
const suggestionsListNodoFinal = document.getElementById("suggestions-nodofinal");
if (inputNodoFinal && suggestionsListNodoFinal) { 
    // 💡 PASAR el callback de concatenación
    setupAutocomplete(inputNodoFinal, listaNodos, suggestionsListNodoFinal, actualizarConcatenacion);
}

// --- Campo 3: codigo (viewCambioAjuste) ---
const inputCodigoCA = document.getElementById("codigo");
const suggestionsListCodigo = document.getElementById("suggestions-codigo");

let codigoAutocomplete = null;

function activarAutocompleteCodigo() {
  if (codigoAutocompleteActivo) return;

  codigoAutocomplete = setupAutocomplete(
    inputCodigoCA,
    listaNodos,
    suggestionsListCodigo,
    actualizarConcatenacionCambioAjuste
  );

  codigoAutocompleteActivo = true;
}

function desactivarAutocompleteCodigo() {
  if (!codigoAutocompleteActivo) return;

  // Limpieza visual
  suggestionsListCodigo.innerHTML = "";
  suggestionsListCodigo.style.display = "none";

  // Destruir listeners del autocomplete
  if (codigoAutocomplete && codigoAutocomplete.destroy) {
    codigoAutocomplete.destroy();
    codigoAutocomplete = null;
  }
  codigoAutocompleteActivo = false;
}

// --- Campo 4: NodofinalCA (viewCambioAjuste) ---
const inputNodoFinalCA = document.getElementById("NodofinalCA");
const suggestionsListNodoFinalCA = document.getElementById("suggestions-NodofinalCA");
if (inputNodoFinalCA && suggestionsListNodoFinalCA) {
    // 💡 PASAR el callback de concatenación CambioAjuste
    setupAutocomplete(inputNodoFinalCA, listaNodos, suggestionsListNodoFinalCA, actualizarConcatenacionCambioAjuste);
}

// --- Campo 5: Trabajo efectuado (viewParteChecklist) ---
const inputTrabajoefectuado = document.getElementById("OtrasObservaciones");
const suggestionsListadotrabajo = document.getElementById("suggestions-trabajoefectuado");
if (inputTrabajoefectuado && suggestionsListadotrabajo) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputTrabajoefectuado, listadetrabajoefectuado, suggestionsListadotrabajo); 
}

// --- Campo 6: Marca de equipo (viewParte1) ---
const inputMarcaEquipo = document.getElementById("marcaequipo");
const suggestionsMarcaEquipo = document.getElementById("suggestions-marcaequipo");
if (inputMarcaEquipo && suggestionsMarcaEquipo) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputMarcaEquipo, ListaMarcaEquipo, suggestionsMarcaEquipo); 
}

// --- Campo 7: Modelo de equipo (viewParte1) ---
const inputModeloEquipo = document.getElementById("modeloequipo");
const suggestionsModeloEquipo = document.getElementById("suggestions-modeloequipo");
if (inputModeloEquipo && suggestionsModeloEquipo) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputModeloEquipo, ListaModeloEquipo, suggestionsModeloEquipo); 
}

// --- Campo 8: Marca de rele (viewParte1) ---
const suggestionsMarcaRele = document.getElementById("suggestions-marcarele");
if (inputMarcaReleAutorellenado && suggestionsMarcaRele) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputMarcaReleAutorellenado, ListaMarcaRele, suggestionsMarcaRele); 
}

suggestionsMarcaRele.addEventListener("click", () => {
  inputMarcaReleAutorellenado.value = suggestionsMarcaRele.textContent;

  inputMarcaReleAutorellenado.dispatchEvent(
    new Event("input", { bubbles: true })
  );
});

// --- Campo 9: Marca de rele (viewCambioAjuste) ---
const inputMarcaReleCA = document.getElementById("MarcaCA");
const suggestionsMarcaReleCA = document.getElementById("suggestions-marcaCA");
if (inputMarcaReleCA && suggestionsMarcaReleCA) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputMarcaReleCA, ListaMarcaRele, suggestionsMarcaReleCA); 
}

// --- Campo 10: Modelo de rele (viewParte1) ---
const inputModeloRele = document.getElementById("modelorele");
const suggestionsModeloRele = document.getElementById("suggestions-modelorele");
if (inputModeloRele && suggestionsModeloRele) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputModeloRele, ListaModeloRele, suggestionsModeloRele); 
}

// --- Campo 11: Modelo de rele (viewCambioAjuste) ---
const inputModeloReleCA = document.getElementById("ModeloCA");
const suggestionsModeloReleCA = document.getElementById("suggestions-modeloCA");
if (inputModeloReleCA && suggestionsModeloReleCA) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputModeloReleCA, ListaModeloRele, suggestionsModeloReleCA); 
}

// --- Campo 12: Marca de rele (viewPuestaServicio) ---
const inputMarcaRelePS = document.getElementById("MarcaPS");
const suggestionsMarcaRelePS = document.getElementById("suggestions-marcaPS");
if (inputMarcaRelePS && suggestionsMarcaRelePS) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputMarcaRelePS, ListaMarcaRele, suggestionsMarcaRelePS); 
}

// --- Campo 13: Modelo de rele (viewPuestaServicio) ---
const inputModeloRelePS = document.getElementById("ModeloReleRC");
const suggestionsModeloRelePS = document.getElementById("suggestions-modelorelePS");
if (inputModeloRelePS && suggestionsModeloRelePS) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputModeloRelePS, ListaModeloRele, suggestionsModeloRelePS); 
}

// --- Campo 14: Marca de equipo (viewPuestaServicio) ---
const inputMarcaEquipoPS = document.getElementById("MarcaRC");
const suggestionsMarcaEquipoPS = document.getElementById("suggestions-marcaequipoPS");
if (inputMarcaEquipoPS && suggestionsMarcaEquipoPS) {
    // Llama a la función reutilizable sin callback de concatenación
    setupAutocomplete(inputMarcaEquipoPS, ListaMarcaEquipo, suggestionsMarcaEquipoPS); 
}

// =============================
// Helper globales (arreglan robustez y el scroll)
// =============================
function mostrarMensaje(mensaje, tipo = "success") {
  // función global reutilizable
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  // Forzar reflow para animación
  setTimeout(() => toast.classList.add("show"), 100);
  // Remover automáticamente
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

function getFieldValue(id) {
  const el = document.getElementById(id);
  if (!el) return "";
  if (el.type === "checkbox") return el.checked ? "true" : "";
  if (el.tagName.toLowerCase() === "select") return el.value.trim();
  return el.value?.trim() || "";
}

// Encuentra el ancestro con scroll (si existe)
function getScrollParent(node) {
  if (!node) return document.scrollingElement || document.documentElement;
  let parent = node.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}

// Hace scroll al elemento teniendo en cuenta header fijo
function scrollToElement(el) {
  if (!el) return;

  const parent = getScrollParent(el);
  const headerHeight = header ? header.offsetHeight : 0;
  const offsetExtra = 15; // espacio pequeño de margen

  // Calcula posición relativa dentro del scroll container
  const rectEl = el.getBoundingClientRect();
  const rectParent = parent.getBoundingClientRect();
  const topRelative = rectEl.top - rectParent.top + parent.scrollTop;

  const targetScroll = topRelative - headerHeight - offsetExtra;

  // Scroll suave
  parent.scrollTo({
    top: targetScroll,
    behavior: "smooth"
  });

  // En caso de que el contenedor sea el documento
  if (parent === document.documentElement || parent === document.scrollingElement) {
    window.scrollTo({
      top: el.offsetTop - headerHeight - offsetExtra,
      behavior: "smooth"
    });
  }
}

// =============================
// Eventos botones superiores
// =============================
btnFormatos.addEventListener("click", () => {
  btnFormatos.classList.add("active");
  btnFormatos.classList.remove("inactive");
  btnHistorial.classList.remove("active");
  btnHistorial.classList.add("inactive");
  activarVista(viewFormatos);
});

btnHistorial.addEventListener("click", () => {
  btnHistorial.classList.add("active");
  btnHistorial.classList.remove("inactive");
  btnFormatos.classList.remove("active");
  btnFormatos.classList.add("inactive");
  activarVista(viewHistorial);
});

// =============================
// Botones de retroceso dinamico
// =============================

if (backButton) {
  backButton.addEventListener("click", () => {
    retrocederVista();
  });
}

if (backButton1) {
  backButton1.addEventListener("click", () => {
    activarVista("viewParte1");
    //retrocederVista();
  });
}

if (backButton2) {
  backButton2.addEventListener("click", () => {
    activarVista("viewParte2");
    //retrocederVista();
  });
}

if (backButton3) {
  backButton3.addEventListener("click", () => {
    activarVista("viewParte3");
    //retrocederVista();
  });
}

if (backButton4) {
  backButton4.addEventListener("click", () => {
    retrocederVista();
  });
}

if (backButton5) {
  backButton5.addEventListener("click", () => {
    activarVista("viewCambioAjuste");
    //retrocederVista();
  });
}

if (backButton6) {
  backButton6.addEventListener("click", () => {
    retrocederVista();
  });
}

// =============================
// GENERAR CODIGO UNICO
// =============================

function generarCodigoUnico(prefijo) {
  const fecha = new Date();

  // Componentes de la fecha y hora
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const hora = String(fecha.getHours()).padStart(2, "0");
  const min = String(fecha.getMinutes()).padStart(2, "0");
  const seg = String(fecha.getSeconds()).padStart(2, "0");
  
  // 🆕 Milisegundos (3 dígitos)
  const ms = String(fecha.getMilliseconds()).padStart(3, "0"); 

  // Concatenación: PREFIJO-AAAAMMDDHHMMSSMMM
  return `${prefijo}-${año}${mes}${dia}${hora}${min}${seg}${ms}`;
}

// =============================
// Selección de formato (PDF)
// =============================
if (formatoCards && formatoCards.length) {
  formatoCards.forEach(card => {
    card.addEventListener("click", () => {

    limpiarDraftsFormulario();

    // 🔹 PRIMERO marcar activo
    formatoCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    // 🔹 AHORA sí obtener prefijo
    const prefijo = obtenerPrefijoDesdeCard();

    const nuevoCodigo = generarCodigoUnico(prefijo);

    CAMPOS_CODIGO.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = nuevoCodigo;
    });

    const nuevaHora = establecerHoraActual();

    CAMPOS_HORA.forEach(id => {
      const el = document.getElementById(id);
      console.log(`Hora actual en ${id}:`, el.value);
      if (el) el.value = nuevaHora;
    });

    guardarCamposCriticosEnStorage();

    // 🔹 resto igual (NO TOCAR)
    const pdfFile = card.getAttribute("data-pdf");
    if (pdfFile && pdfViewer) pdfViewer.src = pdfFile;

    if (nextButton) nextButton.classList.remove("hidden");
    });
  });
}

function obtenerPrefijoDesdeCard() {
        const activeCard = document.querySelector(".formato-card.active");
        if (!activeCard) return; 

        const pdf = activeCard.getAttribute("data-pdf");
        let prefijo = "1";
        if (pdf === "Protocolodepruebas.pdf") prefijo = "1"; // Formulario 1 con vistas viewParte1, viewParte2, viewParte3 y viewParteChecklist
        if (pdf === "Puestaenservicioderele.pdf") prefijo = "2"; //Formulario 2 de puesta en servicio
        if (pdf === "Cambiodeajustes.pdf") prefijo = "3"; // Formulario de viewCambioAjuste
        
        // Asume que esta función devuelve el prefijo basado en 'tipo'
        return obtenerPrefijoPlantilla(prefijo); 
    }

    // PREFIJOS POR PLANTILLA
    function obtenerPrefijoPlantilla(prefijo) {
        if (prefijo === "1") return "PP";
        if (prefijo === "2") return "PS";
        if (prefijo === "3") return "CA";
        return ""; // Valor por defecto si no coincide
    }

//FILTRAR INPUT TEXT DE SED Y CODIGO
function limpiarNumeroEquipo(valor) {

  if (!valor) return "";

  // quitar todo lo que no sea número
  let limpio = String(valor).replace(/[^0-9]/g, "");

  // quitar ceros a la izquierda
  limpio = limpio.replace(/^0+/, "");

  return limpio;

}

// FUNCION PARA CAMBIAR EL TIPO DE CAMPO (TEXTO A NUMERO) PARA CAMPO SED DE FORMULARIO PP
function activarSEDTexto() {
  const inputSED = document.getElementById("sed");

  inputSED.oninput = null; // 🔥 CLAVE
  inputSED.removeAttribute("inputmode");
  inputSED.readOnly = false;

   // 🔥 restaurar valor original si existe
  if (window.valorOriginalSED) {
    inputSED.value = window.valorOriginalSED;
  }


  activarAutocompleteSED();
}

function activarSEDNumerico() {

  const inputSED = document.getElementById("sed");

  // 🔹 guardar valor actual antes de cambiar modo
  const valorActual = inputSED.value;

  const saltarNormalizacion = window.restauracionEnProceso && inputSED.value;

  desactivarAutocompleteSED();

  inputSED.setAttribute("autocomplete","off");
  inputSED.setAttribute("inputmode", "numeric");

  if (!saltarNormalizacion && valorActual) {
  inputSED.value = limpiarNumeroEquipo(valorActual);
  }

  // limpiar solo si es nuevo formulario
  if (
    !window.rellenandoFormulario &&
    !window.modoEdicionActivo &&
    !window.restauracionEnProceso &&
    !valorActual
  ) {
    inputSED.value = "";
  }

  inputSED.oninput = () => {
    inputSED.value = limpiarNumeroEquipo(inputSED.value);
    actualizarConcatenacion();
  };
}

// FUNCION PARA CAMBIAR EL TIPO DE CAMPO (TEXTO A NUMERO) PARA CAMPO CODIGO DE FORMULARIO CA
function activarCodigoTexto() {
  const inputCod = document.getElementById("codigo");

  inputCod.oninput = null; // 🔥 CLAVE
  inputCod.removeAttribute("inputmode");
  inputCod.readOnly = false;

  if (window.valorOriginalCodigo) {
    inputCod.value = window.valorOriginalCodigo;
  }

  activarAutocompleteCodigo();
}

function activarCodigoNumerico() {

  const inputCod = document.getElementById("codigo");

  const valorActual = inputCod.value;

  const saltarNormalizacion = window.restauracionEnProceso && inputCod.value;

  desactivarAutocompleteCodigo();

  inputCod.setAttribute("autocomplete","off");
  inputCod.setAttribute("inputmode", "numeric");

  if (!saltarNormalizacion && valorActual) {
    inputCod.value = limpiarNumeroEquipo(valorActual);
  }

  if (
    !window.rellenandoFormulario &&
    !window.modoEdicionActivo &&
    !window.restauracionEnProceso &&
    !valorActual
  ) {
    inputCod.value = "";
  }

  inputCod.oninput = () => {
    inputCod.value = limpiarNumeroEquipo(inputCod.value);
    actualizarConcatenacionCambioAjuste();
  };
}

// =============================
// Cálculo de SEMANA
// =============================
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  return { y: Number(parts[0]), m: Number(parts[1]), d: Number(parts[2]) };
}

function utcTimestamp(y, m, d) {
  return Date.UTC(y, m - 1, d);
}

function primerLunesOnOrBeforeJan1UTC(year) {
  const jan1Utc = utcTimestamp(year, 1, 1);
  const weekday = new Date(jan1Utc).getUTCDay();
  const daysBack = (weekday + 6) % 7;
  return jan1Utc - daysBack * 24 * 60 * 60 * 1000;
}

function calcularSemanaDesdeYYYYMMDD(dateStr) {
  const pd = parseDateString(dateStr);
  if (!pd) return "";
  const selUtc = utcTimestamp(pd.y, pd.m, pd.d);
  const anio = pd.y;

  const primerLunesAnioUtc = primerLunesOnOrBeforeJan1UTC(anio);
  const primerLunesSiguienteUtc = primerLunesOnOrBeforeJan1UTC(anio + 1);

  function diffDays(aUtc, bUtc) {
    return Math.floor((bUtc - aUtc) / (24 * 60 * 60 * 1000));
  }

  let semana, resultado;
    if (selUtc >= primerLunesSiguienteUtc) {
  const dias = diffDays(primerLunesSiguienteUtc, selUtc);
  semana = Math.min(52, Math.floor(dias / 7) + 1);
  const semanaFormateada = String(semana).padStart(2, '0');
  resultado = `Semana ${semanaFormateada} - ${anio + 1}`;   // 👈 AÑO CORREGIDO
  } 
  else if (selUtc >= primerLunesAnioUtc) {
    const dias = diffDays(primerLunesAnioUtc, selUtc);
    semana = Math.min(52, Math.floor(dias / 7) + 1);
    const semanaFormateada = String(semana).padStart(2, '0');
    resultado = `Semana ${semanaFormateada} - ${anio}`;
  } 
  else {
    const primerLunesPrevUtc = primerLunesOnOrBeforeJan1UTC(anio - 1);
    const dias = diffDays(primerLunesPrevUtc, selUtc);
    semana = Math.min(52, Math.floor(dias / 7) + 1);
    const semanaFormateada = String(semana).padStart(2, '0');
    resultado = `Semana ${semanaFormateada} - ${anio - 1}`;   // 👈 TAMBIÉN CORRECTO
  }

  return resultado;
}

// =============================
// Inicializar fecha + semana (GENÉRICO, REEMPLAZA TU BLOQUE ACTUAL)
// =============================
function inicializarFechaYSemana(idFecha, idSemana) {
  const fechaInput = document.getElementById(idFecha);
  const semanaInput = document.getElementById(idSemana);

  if (!fechaInput || !semanaInput) return;

  // Establecer fecha actual
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  fechaInput.value = `${anio}-${mes}-${dia}`;

  // Función de actualización
  const actualizar = () => {
    const val = fechaInput.value;
    semanaInput.value = val ? calcularSemanaDesdeYYYYMMDD(val) : "";
  };

  // Eventos para recalcular semana
  fechaInput.addEventListener("change", actualizar);
  fechaInput.addEventListener("input", actualizar);

  // Calcular de inicio
  actualizar();
}

// =============================
// Inicializar todos los formularios
// =============================
document.addEventListener("DOMContentLoaded", () => {
  inicializarFechaYSemana("fecha", "semana");       // Formulario actual
  inicializarFechaYSemana("fechaCA", "SemanaCA");   // Nuevo formulario
  inicializarFechaYSemana("fechaPS", "SemanaPS");   // Nuevo formulario
});

// =============================
// Hora por defecto (establecer una vez)
// =============================

function obtenerHoraActual() {
  const ahora = new Date();

  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');

  return `${horas}:${minutos}`; // 🔥 clave
}

function establecerHoraActual() {
  const ahora = new Date();
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();

  horas = horas < 10 ? '0' + horas : horas;
  minutos = minutos < 10 ? '0' + minutos : minutos;

  const tiempo = `${horas}:${minutos}`;

  const horaInput = document.getElementById('hora');
  if (horaInput) horaInput.value = tiempo;

  const horaInputPS = document.getElementById('horaPS');
  if (horaInputPS) horaInputPS.value = tiempo;
}
// Evento del botón "next-button"
document.getElementById("next-button").addEventListener("click", function() {
  establecerHoraActual(); // ✅ Se establece al presionar
  guardarProgresoFormulario();
});

let autosaveTimer;

function activarAutoGuardado(){

  document.addEventListener("input", () => {

    clearTimeout(autosaveTimer);

    autosaveTimer = setTimeout(() => {

      guardarProgresoFormulario();

    }, 800);

  });

}

//FUNCION DE LIMPIEZA PARA CAMPO NODO FINAL (LIMPIAR DOBLE GUION)
function normalizarCodigoAlfaNumerico(valor) { // Limpia espacios, puntos y guiones en códigos tipo: CEPS.2039 → CEPS2039
  if (typeof valor !== "string") return "";

  return valor
    .trim()
    .replace(/[.\-\s]+/g, ""); // quita . - espacios
}

function limpiarNodoFinal(valor) {
  if (typeof valor !== "string") return "";

  const limpio = valor.trim();

  // ❌ vacío
  if (!limpio) return "";

  // ❌ solo guiones o signos
  if (/^[\W_]+$/.test(limpio)) return "";

  return limpio;
}

// =============================
// Concatenación SED + Nodo final -> enlace (Primer Formulario)
// =============================
// Usa SIEMPRE la misma referencia que inputSED
const sedinput = document.getElementById("sed");
const NodoFinalInput = document.getElementById("nodofinal");
const enlaceInput = document.getElementById("enlace");

function actualizarConcatenacion() {
  if (!sedinput || !enlaceInput) return;

  const equipoValor =
    document.getElementById("equipo")?.value ?? "";

  let sed = normalizarCodigoAlfaNumerico(sedinput.value);

  // 🔥 SOLO en equipos MT numéricos
  if (
    equipoValor === "Recloser" ||
    equipoValor === "Seccionador de potencia con telemando"
  ) {
    sed = limpiarNumeroEquipo(sed);
  }

  let nodofinal = "";

  if (
    NodoFinalInput &&
    NodoFinalInput.value &&
    (NodoFinalInput.offsetParent !== null ||
    window.rellenandoFormulario ||
    window.restauracionEnProceso ||
    window.modoEdicionActivo)
  ) {
    nodofinal = limpiarNodoFinal(NodoFinalInput.value);
  }

  if (!sed && !nodofinal) {
    enlaceInput.value = "";
    return;
  }

  if (!nodofinal) {
    if (equipoValor === "Recloser") {
      enlaceInput.value = "RC" + sed;
      return;
    }
    if (equipoValor === "Seccionador de potencia con telemando") {
      enlaceInput.value = "SP" + sed;
      return;
    }
  }

  enlaceInput.value = sed + (nodofinal ? "-" + nodofinal : "");
}

// =============================
// Concatenación codigo + Nodo final en Cambio de ajuste -> Circuito (Segundo Formulario)
// =============================
const codigoInput = document.getElementById("codigo");
const codigofinalInput = document.getElementById("NodofinalCA");
const enlaceCAInput = document.getElementById("enlaceCA"); 

function actualizarConcatenacionCambioAjuste() {
  if (!codigoInput) return;

  const equipoCAValor =
    document.getElementById("equipoCA")?.value ?? "";

  let codigo = normalizarCodigoAlfaNumerico(codigoInput.value);

  // 🔥 SOLO equipos MT
  if (
    equipoCAValor === "Recloser" ||
    equipoCAValor === "Seccionador de potencia con telemando"
  ) {
    codigo = limpiarNumeroEquipo(codigo);
  }

  let codigofinal = "";

  if (
    codigofinalInput &&
    codigofinalInput.value &&
    (codigofinalInput.offsetParent !== null ||
    window.rellenandoFormulario ||
    window.restauracionEnProceso ||
    window.modoEdicionActivo)
  ) {
    codigofinal = limpiarNodoFinal(codigofinalInput.value);
  }

  if (!codigo && !codigofinal) {
    //if (circuitoInput) circuitoInput.value = "";
    if (enlaceCAInput) enlaceCAInput.value = "";
    return;
  }

  let valorFinal = "";

  if (!codigofinal) {
    if (equipoCAValor === "Recloser") {
      valorFinal = "RC" + codigo;
    } else if (
      equipoCAValor === "Seccionador de potencia con telemando"
    ) {
      valorFinal = "SP" + codigo;
    } else {
      valorFinal = codigo;
    }
  } else {
    valorFinal = codigo + "-" + codigofinal;
  }

  //if (circuitoInput) circuitoInput.value = valorFinal;
  if (enlaceCAInput) enlaceCAInput.value = valorFinal;
}

// 📌 Mantenemos los listeners de 'input' por si el usuario escribe el valor completo.
if (sedinput) sedinput.addEventListener("input", actualizarConcatenacion);
if (NodoFinalInput) NodoFinalInput.addEventListener("input", actualizarConcatenacion);
if (codigoInput) codigoInput.addEventListener("input", actualizarConcatenacionCambioAjuste);
if (codigofinalInput) codigofinalInput.addEventListener("input", actualizarConcatenacionCambioAjuste);

// =============================
// Encabezado dinámico (datos del equipo)
// (Usas id con espacios en el HTML, lo respetamos)
 // id en tu HTML: 'Encabezado de datos del equipo'
const encabezado = document.getElementById('Encabezado de datos del equipo');

if (selectEquipo && encabezado) {
  selectEquipo.addEventListener('change', () => {
    const valorSeleccionado = selectEquipo.value;
    const textoSeleccionado = selectEquipo.options[selectEquipo.selectedIndex].text;
    encabezado.textContent = textoSeleccionado ? `Datos del ${textoSeleccionado}` : 'Datos del equipo';
    encabezado.dataset.equipo = valorSeleccionado;
  });
}

// =============================
// FUNCIÓN PARA LIMPIAR CAMPOS DEL FORMULARIO ACTUAL
// =============================

function limpiarFormulario() {

  const vistas = document.querySelectorAll(
    "#viewParte1, #viewParte2, #viewParte3, #viewCambioAjuste, #viewCambioAjuste2, #viewPuestaServicio"
  );

  vistas.forEach(vista => {

    const camposExcluidos = exclusionesPorVista[vista.id] || [];

    vista.querySelectorAll("input, select, textarea").forEach(el => {

      if (camposExcluidos.includes(el.id)) return;

      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      }
      else if (el.tagName.toLowerCase() === "select") {
        el.selectedIndex = 0;
      }
      else {
        el.value = "";
      }

    });
  });
}

  function limpiarDraftCompleto() {
  localStorage.removeItem("formulario_draft_viewParte1");
  localStorage.removeItem("formulario_draft_viewPuestaServicio");
  localStorage.removeItem("formulario_draft_viewCambioAjuste");
}

nextButton.addEventListener("click", () => {
   limpiarDraftCompleto();      // 🔥 borrar pasado
   limpiarFormulario();         // 🔥 limpiar inputs cuando inicializa
   window.modoEdicionActivo = false;
   inicializarFormulario("nuevo");
   actualizarVisibilidadSegunPlantilla();
});

modificarButton.addEventListener("click", () => {
   inicializarFormulario("editar");
   setTimeout(() => {
     restaurarFormulario(); // 🔥 CLAVE
     // 🔥 FORZAR visibilidad correcta DESPUÉS de todo
    actualizarVisibilidadSegunPlantilla();
   }, 100);
});

function sincronizarEstadoDinamico() {
  if (window.currentView === "viewCambioAjuste") {
    actualizarCampoCodigo();
    actualizarVisibilidadNodoFinalCA();
  }

  if (window.currentView === "viewParte1") {
    actualizarCampoSed();
    actualizarVisibilidadNodoFinal();
  }

  if (window.currentView === "viewPuestaServicio") {
    actualizarCampoRC();
  }

}

document.addEventListener("change", function (e) {

  if (window.rellenandoFormulario) return;

  const select = e.target;

  if (
    select.tagName === "SELECT" &&
    select.value === "Otros" &&
    select.closest("[id^='wrapper']")
  ) {

    const wrapper = select.closest("[id^='wrapper']");
    const btnVolver = wrapper.querySelector("button");

    const input = document.createElement("input");
    input.type = "text";
    input.id = select.id;
    input.name = select.name;
    input.placeholder = "Ingrese el valor";
    input.value = "";

    wrapper.replaceChild(input, select);

    if (btnVolver) {
      btnVolver.classList.remove("oculto");
    }

    input.focus();
  }
});

document.addEventListener("click", function (e) {

  const btn = e.target;

  if (!btn.id.startsWith("btnVolver")) return;

  const wrapper = btn.closest("[id^='wrapper']");
  if (!wrapper) return;

  const input = wrapper.querySelector("input");
  if (!input) return;

  const select = document.createElement("select");
  select.id = input.id;
  select.name = input.name;

  // 🔥 reconstruir opciones manualmente
  if (select.id === "Nombre2PS") {
    select.innerHTML = `
      <option value="" disabled selected hidden>Seleccione su nombre</option>  
      <option value="-">-</option>
      <option value="Raúl Ames">Raúl Ames</option>
      <option value="José Auccatoma">José Auccatoma</option>
      <option value="Gilber Mendoza">Gilber Mendoza</option>
      <option value="Carlos Muñoz">Carlos Muñoz</option>
      <option value="Evelio Salvador">Evelio Salvador</option>
      <option value="Noe Santos">Noe Santos</option>
      <option value="Carlos Vizcarra">Carlos Vizcarra</option>
      <option value="Otros">Otros</option>
    `;
  }

  if (select.id === "TensionAlimentacionSP") {
    select.innerHTML = `
      <option value="" disabled selected hidden>Seleccione una alternativa</option>
      <option value="110 AC">110 AC</option>
      <option value="220 AC">220 AC</option>
      <option value="Otros">Otros</option>
    `;
  }

  wrapper.replaceChild(select, input);
  btn.classList.add("oculto");

});

// =============================
// RESTAURACIÓN AUTOMÁTICA (MEJORADA)
// =============================
function restaurarFormulario() {
  
  const formActual = obtenerFormularioActual();
  
  if (!formActual) {
    console.warn(`ℹ️ No se encontró formulario para restaurar en: ${window.currentView}`);
    restaurarCamposCriticosDesdeStorage();
    return;
  }

  if (window.restauracionEnProceso || restauracionBloqueada || !window.currentView) {
    return;
  }

  const vistaActiva = document.getElementById(window.currentView);
  if (!vistaActiva) {
    console.warn("⏸️ Vista no encontrada en DOM:", window.currentView);
    return;
  }

  let data = null;

  try {
    const datosGuardados = localStorage.getItem('formulario_draft_' + formActual);
    
    if (!datosGuardados) {
      console.log("ℹ️ Sin datos guardados para:", formActual);
      restaurarCamposCriticosDesdeStorage();
      return;
    }

    data = JSON.parse(datosGuardados);
    console.log("📦 Datos encontrados en localStorage:", data);

  } catch(e) {
    console.warn("⚠️ Error leyendo draft del localStorage:", e);
    restaurarCamposCriticosDesdeStorage();
    return;
  }

  if (!data) {
    console.log("ℹ️ Los datos están vacíos");
    restaurarCamposCriticosDesdeStorage();
    return;
  }

  window.restauracionEnProceso = true;

  // EXTRAER Y PROTEGER LAS FECHAS ANTES DE PROCESAR
  const fechasAProteger = {};
  const camposFecha = ["fecha", "fechaCA", "fechaPS"];
  
  camposFecha.forEach(id => {
    if (data[id]) {
      fechasAProteger[id] = data[id];
    }
  });

  Object.entries(data).forEach(([key, value]) => {

    if (camposFecha.includes(key)) return;

    if (key === '_timestamp') return;

    // 🔥 PRESERVAR CAMPOS CRÍTICOS
    if (CAMPOS_CRITICOS.includes(key)) {

    const el = document.getElementById(key);

    // 🔥 SOLO restaurar si existe valor en storage
    if (el && value && value.trim() !== "") {
      el.value = value;
      console.log(`🔁 Campo crítico restaurado: ${key}`);
    }

    return;
  }

    const elementos = document.querySelectorAll(`[name="${key}"], #${key}`);

    elementos.forEach(el => {

      try {

        if (el.type === 'checkbox') {
          el.checked = Boolean(value);
          return;
        }

        if (el.type === 'radio') {
          if (el.value === value) el.checked = true;
          return;
        }

        if (el.tagName === "SELECT") {
          const existeEnOpciones = Array.from(el.options).some(opt => opt.value === value);

          if (!existeEnOpciones && value) {
            const wrapper = el.closest("[id^='wrapper']");
            const input = document.createElement("input");
            input.type = "text";
            input.id = key;
            input.name = key;
            input.value = value;

            if (wrapper) {
              wrapper.replaceChild(input, el);
              const btnVolver = wrapper.querySelector("button");
              if (btnVolver) btnVolver.classList.remove("oculto");
            }
            return;
          } else {
            el.value = value || '';
          }
          return;
        }

        el.value = value || '';
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("input", { bubbles: true }));

      } catch (e) {
        console.warn(`⚠️ Error restaurando campo ${key}:`, e);
      }

    });

  });

  setTimeout(() => {

    try {

      // 🔥 RESTAURAR LAS FECHAS GUARDADAS (SIN SOBRESCRIBIR)
      camposFecha.forEach(idFecha => {
        if (fechasAProteger[idFecha]) {
          const inputFecha = document.getElementById(idFecha);
          if (inputFecha) {
            inputFecha.value = fechasAProteger[idFecha];
            console.log(`📅 Fecha protegida restaurada: ${idFecha} = ${fechasAProteger[idFecha]}`);
            
            // 🔥 ACTUALIZAR SEMANA SIN REINICIALIZAR LA FECHA
            const idSemana = idFecha === "fecha" ? "semana" : 
                            idFecha === "fechaCA" ? "SemanaCA" : 
                            idFecha === "fechaPS" ? "SemanaPS" : null;
            
            if (idSemana) {
              const inputSemana = document.getElementById(idSemana);
              if (inputSemana) {
                inputSemana.value = calcularSemanaDesdeYYYYMMDD(fechasAProteger[idFecha]);
              }
            }
          }
        }
      });

      if (typeof sincronizarEstadoDinamico === "function") {
        sincronizarEstadoDinamico();
      }

      if (typeof restaurarCamposCriticos === "function") {
        restaurarCamposCriticos(data);
      }

      actualizarVisibilidadSegunPlantilla();
      actualizarCampoSed();
      actualizarCampoCodigo();
      actualizarConcatenacion();
      actualizarConcatenacionCambioAjuste();

      console.log("✅ Restauración completada");

    } catch (e) {
      console.error("❌ Error en sincronización post-restauración:", e);
    } finally {
      window.restauracionEnProceso = false;
    }

    asegurarCamposCriticos();
    
  }, 50);
}

activarAutoGuardado();

if (typeof actualizarVisibilidadSegunPlantilla === "function") {
  actualizarVisibilidadSegunPlantilla();
}

function restaurarCamposCriticos(data){

  // SED
  if (data.sed){
    const sed = document.getElementById("sed");
    if(sed) sed.value = data.sed;
  }

  // CODIGO
  if (data.codigo){
    const cod = document.getElementById("codigo");
    if(cod) cod.value = data.codigo;
  }

  // ENLACE
  if (data.enlace){
    const enlace = document.getElementById("enlace");
    if(enlace) enlace.value = data.enlace;
  }

  // ENLACE CA
  if (data.enlaceCA){
    const enlaceCA = document.getElementById("enlaceCA");
    if(enlaceCA) enlaceCA.value = data.enlaceCA;
  }

}

// =============================
// Combobox dinámico (viewParte2 y viewParte3)
const opcionesCombobox = document.getElementById("opciones-combobox");

if (opcionesCombobox) {
  const actualizarCampos = () => {
    const seleccion = opcionesCombobox.value;

    // Ocultar todos los campos posibles (tanto viewParte2 como viewParte3)
    Object.values(COMBOBOX_MAPPINGS.viewParte2["opciones-combobox"]).flat().forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("activo");
    });

    // Mostrar solo los que corresponden a la selección
    if (COMBOBOX_MAPPINGS.viewParte2["opciones-combobox"][seleccion]) {
      COMBOBOX_MAPPINGS.viewParte2["opciones-combobox"][seleccion].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("activo");
      });
    }

    const selectFase = document.getElementById("opciones-combobox-ValoresPrueba");

    if (selectFase) {
      selectFase.value = "Fase R"; // o la que quieras por defecto
      selectFase.dispatchEvent(new Event("change"));
    }
  };

  // Escuchar cambios
  opcionesCombobox.addEventListener("change", actualizarCampos);

  // Ejecutar al inicio para aplicar el valor preseleccionado
  actualizarCampos();
}

// ================== COMBOBOX ADICIONAL (SOLO PARA CONTENEDOR viewParte3) ==================
const opcionesValoresPrueba = document.getElementById("opciones-combobox-ValoresPrueba");

if (opcionesValoresPrueba) {

  const actualizarFases = () => {

    const seleccion = opcionesValoresPrueba.value;
    const contenedor = document.getElementById("viewParte3");

    if (!contenedor) return;

    // 🔴 Ocultar SOLO los fieldsets dentro de viewParte3
    Object.values(COMBOBOX_MAPPINGS.viewParte3["opciones-combobox-ValoresPrueba"])
      .flat()
      .forEach(id => {
        const el = contenedor.querySelector(`#${id}`);
        if (el) el.classList.remove("activo");
      });

    // 🟢 Mostrar los correspondientes
    const ids = COMBOBOX_MAPPINGS.viewParte3["opciones-combobox-ValoresPrueba"][seleccion];

    if (ids) {
      ids.forEach(id => {
        const el = contenedor.querySelector(`#${id}`);
        if (el) el.classList.add("activo");
      });
    }

  };

  opcionesValoresPrueba.addEventListener("change", actualizarFases);
  actualizarFases();
}


function aplicarDiccionario(marca) {

  if (window.rellenandoFormulario) return;
  
  const data = diccionarioMarcas[marca.toUpperCase()];

  if (!data) {
    limpiarCamposDiccionario();
    return;
  }

  Object.entries(data).forEach(([campo, valor]) => {
  if (campo === "marcarele") return;

    const el = document.querySelector(`#${campo}, [name="${campo}"]`);
    if (!el) return;

    if (el.tagName === "SELECT") {
      el.value = valor;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      el.value = valor;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
}

function limpiarCamposDiccionario() {
  Object.values(diccionarioMarcas).forEach(config => {
    Object.keys(config).forEach(campo => {
      const el = document.querySelector(`#${campo}, [name="${campo}"]`);
      if (!el) return;

      if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
      } else {
        el.value = "";
      }
    });
  });
}

inputMarcaReleAutorellenado.addEventListener("input", (e) => {

  if (window.rellenandoFormulario) return;

  const valorActual = e.target.value.trim().toUpperCase();

  if (diccionarioMarcas[valorActual]) {
    aplicarDiccionario(valorActual);
  } else {
    limpiarCamposDiccionario();
  }
});

// ====================================================================
// FUNCIÓN GENÉRICA DE VISIBILIDAD (Solo se define una vez)
// ====================================================================

function inicializarSelectorVisibilidad(comboboxElement, mapping) {
    if (!comboboxElement) {
        console.error("El elemento combobox proporcionado no existe.");
        return;
    }

    const actualizarVisibilidad = () => {
        const seleccion = comboboxElement.value;

        Object.values(mapping).flat().forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove("activo");
        });

        // 2. Mostrar solo los que correspondan a la selección actual
        if (mapping[seleccion]) {
            mapping[seleccion].forEach(id => {
                const el = document.getElementById(id);
                // Aquí se usa la clase 'activo' que tienes definida en CSS
                if (el) el.classList.add("activo"); 
            });
        }
    };

    // Asignar el listener y ejecutar al inicio
    comboboxElement.addEventListener("change", actualizarVisibilidad);
    actualizarVisibilidad();
}

// ====================================================================
// INICIALIZACIÓN DE AMBOS COMBOBOX
// ====================================================================

// Inicialización del Combobox de viewCambioAjuste
const opcionesAjuste = document.getElementById("opciones-combobox-Nuevo"); 
inicializarSelectorVisibilidad(opcionesAjuste, COMBOBOX_MAPPINGS.viewCambioAjuste2["opciones-combobox-Nuevo"]);

// Inicialización del Combobox de viewPuestaServicio
const opcionesPuestaEnServicio = document.getElementById("opciones-combobox-PuestaenServicio");
inicializarSelectorVisibilidad(opcionesPuestaEnServicio, COMBOBOX_MAPPINGS.viewPuestaServicio["opciones-combobox-PuestaenServicio"]);

// ===========================
//🔹 FUNCIÓN: VALIDAR CAMPOS REQUIRED (GENERAL)
// ===========================

// Función para obtener el texto del label asociado a un campo
function obtenerLabel(campoId) {  
  const label = document.querySelector(`label[for="${campoId}"]`);
  return label ? label.textContent.trim() : campoId;
}

// ===========================
// 🔹 FUNCIÓN: MOSTRAR ERROR EN UN CAMPO (UNIFICADA)
// ===========================
function mostrarErrorCampo(campo, mensaje = "Completa este campo obligatorio.") {
  if (!campo) return;

  // Elimina mensajes previos del mismo campo
  const msgPrevio = campo.nextElementSibling;
  if (msgPrevio && msgPrevio.classList.contains("mensaje-error")) {
    msgPrevio.remove();
  }

  // Marca visualmente el campo
  campo.classList.add("campo-invalido");

  // Crea el mensaje de error
  const msg = document.createElement("div");
  msg.className = "mensaje-error";
  msg.textContent = mensaje;

  // Intentar insertar después del campo
  try {
    campo.insertAdjacentElement("afterend", msg);
  } catch (e) {
    console.warn("No se pudo insertar mensaje después del campo:", campo.id, e);
    campo.parentNode.appendChild(msg); // plan B
  }

  // Escuchar cambios para limpiar error
  campo.addEventListener("input", () => {
    campo.classList.remove("campo-invalido");
    if (msg.parentNode) msg.remove();
  }, { once: true });
}

// ===========================
// 🔹 FUNCIÓN: VALIDAR CAMPOS REQUIRED (GENERAL)
// ===========================
function validarCamposRequeridos(vistaActual) {
  // Limpia advertencias previas dentro de la vista
  vistaActual.querySelectorAll(".campo-invalido").forEach(c => c.classList.remove("campo-invalido"));
  vistaActual.querySelectorAll(".mensaje-error").forEach(m => m.remove());

  const campos = Array.from(vistaActual.querySelectorAll("[required]")).filter(el => el.offsetParent !== null);
  const camposInvalidos = [];

  campos.forEach(campo => {
    const label = obtenerLabel(campo.id) || campo.name || campo.id;
    const valor = (campo.value || "").toString().trim();

    if (!valor) {
      camposInvalidos.push({ campo, label });
      mostrarErrorCampo(campo);
    }
  });

  if (camposInvalidos.length > 0) {
    mostrarMensaje(
      `⚠️ Debes completar los campos obligatorios: ${camposInvalidos.map(i => i.label).join(", ")}.`,
      "error"
    );
    scrollToElement(camposInvalidos[0].campo);
    return false;
  }

  return true;
}

  // Pares corriente-tiempo o tension-tiempo
  function validarCruces() {

  let erroresTiempo = [];

  for (const [campoId, tiempoId] of paresCorrienteTiempo) {
    const campo = getFieldValue(campoId);
    const tiempo = getFieldValue(tiempoId);

    if (campo && !tiempo) {
      const campoTiempo = document.getElementById(tiempoId);
      mostrarErrorCampo(campoTiempo, "Completa este campo obligatorio.");
      erroresTiempo.push(obtenerLabel(campoId));
    }
  }

   let errores3uoTiempo = [];

  for (const [corrienteId, tensionId, tiempoId] of gruposCorriente3uoTiempo) {
    const corriente = getFieldValue(corrienteId);
    const tension = getFieldValue(tensionId);
    const tiempo = getFieldValue(tiempoId);

    if (corriente && (!tension || !tiempo)) {
      if (!tension) mostrarErrorCampo(document.getElementById(tensionId), "Completa este campo obligatorio.");
      if (!tiempo) mostrarErrorCampo(document.getElementById(tiempoId), "Completa este campo obligatorio.");
      errores3uoTiempo.push(obtenerLabel(corrienteId));
    }
  }

// Mostrar mensajes generales
  if (erroresTiempo.length > 0) {
    mostrarMensaje(`⚠️ Debes llenar el campo de tiempo correspondiente a: ${erroresTiempo.join(", ")}.`, "error");
  }

  if (errores3uoTiempo.length > 0) {
    mostrarMensaje(`⚠️ Debes llenar los campos de 3Uo y tiempo correspondientes a: ${errores3uoTiempo.join(", ")}.`, "error");
  }

  // Si hay errores, detener el flujo
  if (erroresTiempo.length > 0 || errores3uoTiempo.length > 0) {
    const primerError = document.querySelector(".campo-invalido");
    if (primerError) scrollToElement(primerError);
    return false;
  }

  return true;
}

// =============================
// 🟦 FUNCIÓN PARA RELLENAR AJUSTES RECOMENDADOS - ANALISIS DE LA PROTECCION
// =============================

// 🔧 Control maestro del llamado al flujo
const FLUJO_HABILITADO = false;   // true = activo | false = desactivado

async function obtenerDatosDesdeFlujo(payload) {

  // ⛔ Bloqueo temporal
  if (!FLUJO_HABILITADO) {
    console.warn("Llamado al flujo deshabilitado temporalmente.");
    return null;   // No rompe lógica aguas abajo
  }

  const urlFlujo = ENDPOINTS.ANALISIS_PROTECCION;

  const response = await fetch(urlFlujo, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log("Status:", response.status);

  const texto = await response.text();
  console.log("Respuesta cruda:", texto);

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  // 👇 Parseas manualmente
  return JSON.parse(texto);
}

// =============================
// 🟦 FUNCIÓN AUXILIAR DE EXTRACCIÓN (Conectora)
// =============================
function extraerSemanaAnio(texto) {
  if (!texto) return { semana: "", anio: "" };
  
  // Expresión regular para capturar: "Semana [2 dígitos] - [4 dígitos]"
  const coincidencia = texto.match(/Semana\s(\d{2})\s-\s(\d{4})/);
  
  if (coincidencia) {
    return {
      semana: String(Number(coincidencia[1])), // Ejemplo: "02"
      anio: coincidencia[2]    // Ejemplo: "2025"
    };
  }
  return { semana: "", anio: "" };
}

// =============================
// PAYLOAD FORMULARIO 1
// =============================
function construirPayloadFormulario1() {
  const enlaceid = document.getElementById("enlace")?.value;
  const alim = document.getElementById("alim")?.value;
  const valorSemana = document.getElementById("semana")?.value;

  if (!enlaceid) return null;

  // 🔗 Conexión con la lógica de tratamiento
  const datosTemporales = extraerSemanaAnio(valorSemana);

  return {
    enlaceid,
    alimentador: normalizarAlimentador(alim),
    semana: datosTemporales.semana,
    anio: datosTemporales.anio
  };
}

// =============================
// PAYLOAD FORMULARIO 2
// =============================
function construirPayloadFormulario2() {
  const enlaceCA = document.getElementById("enlaceCA")?.value;
  const alimCA = document.getElementById("Alimentador")?.value;
  const valorSemanaCA = document.getElementById("semanaCA")?.value;

  if (!enlaceCA) return null;

  // 🔗 Conexión con la lógica de tratamiento
  const datosTemporales = extraerSemanaAnio(valorSemanaCA);

  return { 
    enlaceCA,
    alimentadorCA: normalizarAlimentador(alimCA),
    semanaCA: datosTemporales.semana,
    anioCA: datosTemporales.anio
  };
}

function hayAjustesRecomendados(datosANSI) {
  if (!datosANSI || typeof datosANSI !== "object") return false;

  return Object.values(datosANSI).some(bloque => {
    if (!bloque || typeof bloque !== "object") return false;

    return Object.values(bloque).some(valor =>
      valor !== null &&
      valor !== undefined &&
      String(valor).trim() !== ""
    );
  });
}

// FUNCIÓN GENÉRICA PARA APLICAR CURVAS Y RELLENAR CAMPOS ADICIONALES DE 67N1 Y 67N2
function aplicarCurvasAutomaticas(respuestaANSI, reglasCurva) {

  Object.entries(reglasCurva).forEach(([funcion, regla]) => {

    const datos = respuestaANSI[funcion];
    if (!datos) return;

    // 🔎 Validar que los campos dependientes tengan valor en el DOM
    const cumple = regla.dependeDe.every(id => {
      const el = document.getElementById(id);
      return el && el.value && el.value.trim() !== "";
    });

    if (!cumple) return;

    // 🟦 SELECT DE CURVA
    if (regla.selectId) {
      const select = document.getElementById(regla.selectId);

      if (select) {

        // 🔥 Buscar cualquier propiedad tipo curva enviada por Automate
        const claveCurvaAutomate = Object.keys(datos).find(k =>
          k.toLowerCase().includes("curva") ||
          k.toLowerCase().includes("curvetype")
        );

        const valorAutomate = claveCurvaAutomate ? datos[claveCurvaAutomate] : null;

        select.value =
          valorAutomate && String(valorAutomate).trim() !== ""
            ? valorAutomate
            : "TD";

        select.dataset.autorellenado = "true";
      }
    }

    // 🟩 INPUTS ADICIONALES (Directional / Characteristic / Forward / Angulo)
    [regla.inputid, regla.inputid2].forEach((id, index) => {

      if (!id) return;

      const input = document.getElementById(id);
      if (!input) return;

      const valorDefault =
        index === 0
          ? regla.valortextinputid
          : regla.valortextinputid2;

      if (!input.value || input.value.trim() === "") {
        input.value = valorDefault ?? "";
        input.dataset.autorellenado = "true";
      }

    });

  });
}

function funcionANSICompleta(bloque, funcion) {
  const sufijo = funcion.replace("-", "");
  const i = bloque[`IPrimRecomendado${sufijo}`];
  const t = bloque[`TMSRecomendado${sufijo}`];
  return i !== "" && t !== "";
}


function limpiarTensionPolar(datos) {
  ["67N-1", "67N-2"].forEach(funcion => {
    const bloque = datos[funcion];
    if (!bloque) return;

    if (!funcionANSICompleta(bloque, funcion)) {
      bloque[`Recomendado3Uo${funcion.replace("-", "")}`] = "";
    }
  });
}

//FUNCIÓN QUE RELLENA LOS CAMPOS DE FUNCIONES ANSI CON AJUSTES RECOMENDADOS

function obtenerComboboxPorVista(idVista) {
  if (idVista === "viewParte2") {
    return document.getElementById("opciones-combobox");
  }

  if (idVista === "viewCambioAjuste2") {
    return document.getElementById("opciones-combobox-Nuevo");
  }

  return null;
}

function rellenarCamposSegunMapa(respuesta, mapa, reglasCurva) {
  if (!respuesta?.ANSI) return;

  Object.entries(respuesta.ANSI).forEach(([funcion, datosFuncion]) => {
    const config = mapa[funcion];
    if (!config) return;

    Object.entries(config).forEach(([idHTML, keyJSON]) => {
      const el = document.getElementById(idHTML);
      const valor = datosFuncion[keyJSON];

      if (!el) return;
      if (!valor) return;

      el.value = valor;
      el.dataset.autorellenado = "true";
    });
  });

  // 🔥 aplicar reglas correctas
  if (reglasCurva) {
    aplicarCurvasAutomaticas(respuesta.ANSI, reglasCurva);
  }
}

function resaltarFuncionesANSI(datosANSI, combobox) {
  if (!combobox || !datosANSI) return;

  Array.from(combobox.options).forEach(opt =>
    opt.classList.remove("ansi-rellenado")
  );

  Object.entries(datosANSI).forEach(([funcion, bloque]) => {
    if (!bloque) return;

    const valoresNoVacios = Object.values(bloque).filter(
      v => v !== null && v !== ""
    );

    if (valoresNoVacios.length >= 2) {
      Array.from(combobox.options).forEach(opt => {
        if (opt.text.includes(funcion)) {
          opt.classList.add("ansi-rellenado");
        }
      });
    }
  });
}

function controlarResaltadoPorVista(idVista) {

  const combobox = obtenerComboboxPorVista(idVista);

  if (!combobox) return;

  if (!window.datosANSICargados) return;

  resaltarFuncionesANSI(window.datosANSICargados, combobox);

  if (hayAjustesRecomendados(window.datosANSICargados)) {
    mostrarMensaje(
      "Se cargaron ajustes recomendados según el enlace ingresado",
      "info"
    );
  } else {
    mostrarMensaje(
      "No se encontraron ajustes recomendados para el enlace ingresado. Asegurese de ingresar correctamente los datos del enlace",
      "warning"
    );
  }
}

// =============================
// Funciones para el Popup en viewParte3
// =============================

function mostrarPopupChecklist() {
  if (!popupChecklist) {
    console.warn("popupChecklist no existe en el DOM");
    console.log("POPUP CHECKLIST ACTIVADO");
    return;
  }
  popupChecklist.classList.remove("oculto");
}

function ocultarPopupChecklist() {
  if (!popupChecklist) return;
  popupChecklist.classList.add("oculto");
}

function sincronizarBotonesParte3() {
  const btnNextNormal = document.querySelector('#viewParte3 .btn-next');
  const btnEnviar = document.getElementById("btnEnviarParte3");

  if (!btnNextNormal && !btnEnviar) return;

  const decision = inputFormatoChecklist?.value;

  // Reset visual
  btnNextNormal?.classList.add("oculto");
  btnEnviar?.classList.add("oculto");

  // Estado 1: aún no decide → mostrar Siguiente normal
  if (!decision) {
    btnNextNormal?.classList.remove("oculto");
    return;
  }

  // Estado 2: eligió SI → Siguiente normal
  if (decision === "Si") {
    btnNextNormal?.classList.remove("oculto");
    return;
  }

  // Estado 3: eligió NO → botón Enviar
  if (decision === "No") {
    btnEnviar?.classList.remove("oculto");
  }
}

// =============================
// Enlazar todos los botones "Siguiente" con validación + scroll
// =============================

// 🔧 Control maestro loader
const LOADER_HABILITADO = false;   // true = visible | false = desactivado

const inputFormatoChecklist = document.getElementById("FormatoListaVerificacion");

document.querySelectorAll('.btn-next').forEach(btn => {

  btn.type = btn.getAttribute('type') || 'button';
  const target = btn.dataset?.target;

  btn.addEventListener('click', async e => {

    guardarProgresoFormulario();

    const vistaActual = btn.closest('.view');
    if (!vistaActual) return;

    // 1️⃣ Validar required
    if (!validarCamposRequeridos(vistaActual)) {
      e.preventDefault();
      return;
    }

    // 2️⃣ Validación cruzada SOLO Parte3
    if (vistaActual.id === "viewParte3") {

      if (!validarCruces()) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      mostrarPopupChecklist();
      return;
    }

    // 3️⃣ Construcción payload
    let payload = null;

    if (vistaActual.id === "viewParte1") {
      payload = construirPayloadFormulario1();
    }

    if (vistaActual.id === "viewCambioAjuste") {
      payload = construirPayloadFormulario2();
    }

    // 🔹 Si NO hay payload → navegación normal
    if (!payload) {
      if (target) {
        activarVista(target);
        setTimeout(() => controlarResaltadoPorVista(target), 150);
      }
      return;
    }

    try {

      btn.disabled = true;

      if (LOADER_HABILITADO) {
        mostrarLoader();
        iniciarLoader();
        setLoaderProgress(10);

        // 2. EL TRUCO: Esperar un "frame" para que el navegador lo pinte
      await new Promise(resolve => requestAnimationFrame(resolve));
      // O en su defecto: await new Promise(r => setTimeout(r, 0));
      }

      await new Promise(r => setTimeout(r, 50));


      const datosFlujo = await obtenerDatosDesdeFlujo(payload);

      if (LOADER_HABILITADO) setLoaderProgress(60);

      restauracionBloqueada = true;

      const datosANSI = datosFlujo?.ANSI;

      if (datosANSI) {

        window.datosANSICargados = datosANSI;
        limpiarTensionPolar(datosANSI);
        localStorage.setItem("datosANSI", JSON.stringify(datosANSI));

        const configuracionPorVista = {
          viewParte1: {
            mapa: mapaRellenoFormularioPP,
            reglas: reglasCurvaFormularioPP
          },
          viewCambioAjuste: {
            mapa: mapaRellenoFormularioCA,
            reglas: reglasCurvaFormularioCA
          }
        };

        const config = configuracionPorVista[vistaActual.id];

        if (config) {
          limpiarCamposAutorellenados(vistaActual);
          rellenarCamposSegunMapa(
            { ANSI: datosANSI },
            config.mapa,
            config.reglas
          );
        }
        const vistaActiva = document.querySelector('.active-view');
        if (vistaActiva) {
          localStorage.removeItem('formulario_draft_' + vistaActiva.id);
        }
      }

      if (LOADER_HABILITADO) {
        setLoaderProgress(100);
        await new Promise(r => setTimeout(r, 150));
      }

      if (target) {
        activarVista(target);
        setTimeout(() => {
          if (LOADER_HABILITADO) ocultarLoader();
          controlarResaltadoPorVista(target);
        }, 300);
      }

    } catch (err) {

      console.error("Error al rellenar datos:", err);
      mostrarMensaje("Error al obtener datos del flujo", "error");
      ocultarLoader();

    } finally {
      btn.disabled = false;
    }

  });

});

const btnChecklistSi = document.getElementById("btnChecklistSi");
const btnChecklistNo = document.getElementById("btnChecklistNo");
const btnNextParte3 = document.getElementById("btnEnviarParte3");

// Acción botón SI de Popup
btnChecklistSi.addEventListener("click", () => {
  inputFormatoChecklist.value = "Si";
  ocultarPopupChecklist();
  activarVista("viewParteChecklist");
});

// Acción botón NO de Popup
btnChecklistNo.addEventListener("click", () => {
  inputFormatoChecklist.value = "No";
  ocultarPopupChecklist();
  sincronizarBotonesParte3(); // opcional, por feedback inmediato
});

function resetearDecisionChecklist() {
  inputFormatoChecklist.value = "";
  ocultarPopupChecklist();
  sincronizarBotonesParte3();
}

function sincronizarTrabajadores() {
  document.querySelectorAll("select").forEach(select => {
    if (typeof select._actualizarTrabajador === "function") {
      select._actualizarTrabajador();
    }
  });
}

// Función genérica para enlazar un combo de nombre con sus campos (código y correo)
function conectarTrabajador(nombreId, codigoId, correoId) {
  const selectNombre = document.getElementById(nombreId);
  const inputCodigo = document.getElementById(codigoId);
  const inputCorreo = document.getElementById(correoId);

  if (!selectNombre) return;

  const actualizarDatos = () => {
    const seleccionado = selectNombre.value;
    const datostrabajador = trabajadores[seleccionado];

    if (inputCodigo) inputCodigo.value = datostrabajador ? datostrabajador.codigo : "";
    if (inputCorreo) inputCorreo.value = datostrabajador ? datostrabajador.correo : "";
  };

  selectNombre.addEventListener("change", actualizarDatos);

  // 🔥 Guardamos la función en el elemento
  selectNombre._actualizarTrabajador = actualizarDatos;

  actualizarDatos();
}

// Conectamos los pares que quieras
conectarTrabajador("Nombre1", "CodigoLDS1", "Correo1");
conectarTrabajador("Nombre2", "CodigoLDS2", "Correo2");
conectarTrabajador("Nombre1CA", "", "Correo1CA");
conectarTrabajador("Nombre2CA", "", "Correo2CA");
conectarTrabajador("Nombre1PS", "", "Correo1PS");
conectarTrabajador("Nombre2PS", "", "Correo2PS");

document.addEventListener("input", () => {
  if (!window.restauracionEnProceso && !window.modoEdicionActivo) {
    guardarProgresoFormulario();
  }
});

document.addEventListener("change", () => {
  if (!window.restauracionEnProceso && !window.modoEdicionActivo) {
    guardarProgresoFormulario();
  }
});

document.addEventListener("change", function(e) {
    if (e.target && e.target.classList.contains("foto-input")) {
        const input = e.target;
        const file = input.files[0];

        // 1. Eliminar preview anterior si existe
        const previewExistente = input.parentElement.querySelector(".contenedor-preview");
        if (previewExistente) previewExistente.remove();

        if (file) {
            // 2. Crear contenedor y elemento de imagen
            const reader = new FileReader();
            const contenedor = document.createElement("div");
            contenedor.className = "contenedor-preview";
            
            const img = document.createElement("img");
            img.className = "img-preview";

            reader.onload = function(e) {
                img.src = e.target.result;
            };

            reader.readAsDataURL(file);
            contenedor.appendChild(img);
            
            // 3. Insertar debajo del input
            input.insertAdjacentElement("afterend", contenedor);
        }
    }
});

function obtenerDatosFormularioCompleto(formKey) {

  const vistas = mapaFormularios[formKey];
  if (!vistas) return {};

  const inputs = document.querySelectorAll(
    vistas.map(v => `#${v} input, #${v} textarea, #${v} select`).join(',')
  );

  const datos = {};

  inputs.forEach(el => {

    const key = el.name || el.id;
    if (!key) return;

    if (el.type === "file") return;

    if (el.type === "checkbox") {
      datos[key] = el.checked ? "SI" : "NO"; // 🔥 importante para preview
    }

    else if (el.type === "radio") {
      if (el.checked) datos[key] = el.value;
    }

    else {
      datos[key] = el.value;
    }

  });

  return datos;
}

function abrirPreviewEnModal(formKey) {

  const datos = obtenerDatosFormularioCompleto(formKey);

  window.currentPreviewForm = formKey;

  localStorage.setItem("datosPreview", JSON.stringify(datos));

  const url = obtenerPreviewPorFormulario(formKey);

  const iframe = document.getElementById("previewFrame");
  iframe.src = url;

  // 🔥 RESET estado edición (AQUÍ ESTÁ LA CLAVE)
  window.modoEdicionActivo = false;

  const btn = document.getElementById("btnEditarCampos");
  btn.innerText = "✏️ Editar campos";
  btn.style.background = "";
  btn.style.color = "";

  document.getElementById("mensajeEdicion").classList.add("hidden");
  document.body.classList.remove("modo-edicion-preview");

  document.getElementById("cuadroPreview").classList.remove("hidden");
}

function cerrarPreview() {
  document.getElementById("cuadroPreview").classList.add("hidden");

  window.modoEdicionActivo = false;

  const btn = document.getElementById("btnEditarCampos");
  btn.innerText = "✏️ Editar campos";
  btn.style.background = "";
  btn.style.color = "";

  document.getElementById("mensajeEdicion").classList.add("hidden");
}

document.getElementById("btnCerrarPreview")
  .addEventListener("click", () => {
    cerrarPreview();
    //console.log("Preview cerrado correctamente");
  });

function obtenerPreviewPorFormulario(formKey) {
  const mapa = {
    form1: "preview-PP.html",
    form1_checklist: "preview-PP.html",
    form2: "preview-PS.html",
    form3: "preview-CA.html"
  };

  return mapa[formKey];
}

window.addEventListener("message", (event) => {

  if (event.data.tipo === "editarCampo") {

    const campo = event.data.campo;

    localStorage.setItem("campoEditar", campo);
    localStorage.setItem("formKey", window.currentPreviewForm);

    document.getElementById("cuadroPreview").classList.add("hidden");

    // 🔥 ejecutar redirección manualmente
    redirigirACampo();
  }

});

function esperarElementoPrueba(id, callback, intentos = 10) {
  const el = document.getElementById(id);

  if (el) {
    callback(el);
  } else if (intentos > 0) {
    setTimeout(() => {
      esperarElementoPrueba(id, callback, intentos - 1);
    }, 150);
  } else {
    console.warn("⚠️ Campo aún no visible:", id);
  }
}

document.getElementById("btnVolverPreview").addEventListener("click", () => {

  const formKey = window.currentPreviewForm;

  if (formKey) {
    abrirPreviewEnModal(formKey); // 🔥 recarga limpio
  }

  document.getElementById("btnVolverPreview").classList.add("hidden");
});

function redirigirACampo() {

  const campo = localStorage.getItem("campoEditar");
  const formKey = localStorage.getItem("formKey");

  if (!campo || !formKey) return;

  const vista = obtenerVistaCampo(campo, formKey);
  if (!vista) return;

  activarVista(vista);

  document.getElementById("btnVolverPreview").classList.remove("hidden");

  setTimeout(() => {

    const input = document.querySelector(`[name="${campo}"], #${campo}`);
    if (!input) return;

    // 🔥 activar combobox si es necesario
    if (formKey === "form1" || formKey === "form1_checklist") {
      // 🟦 PP (complejo)
      activarDesdeCampo(input);
    } else {
      // 🟩 PS y CA (simple)
      activarComboboxSimple(input, formKey);
    }

    setTimeout(() => {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus();
    }, 300);

  }, 400);

  localStorage.removeItem("campoEditar");
}

document.getElementById("btnEditarCampos").addEventListener("click", () => {

  const iframe = document.getElementById("previewFrame");

  iframe.contentWindow.postMessage("activarEdicion", "*");

  window.modoEdicionActivo = true; 

  const msg = document.getElementById("mensajeEdicion");
  msg.classList.remove("hidden");

  const btn = document.getElementById("btnEditarCampos");
  btn.innerText = "✔️ Modo edición activo";
  btn.style.background = "#dcfce7";
  btn.style.color = "#166534";
});

function obtenerVistaCampo(campo, formKey) {

  const vistas = mapaFormularios[formKey];

  for (const vista of vistas) {

    const contenedor = document.getElementById(vista);
    if (!contenedor) continue;

    const input = contenedor.querySelector(`[name="${campo}"], #${campo}`);

    if (input) return vista;
  }

  return null;
}

function obtenerContenedorDinamico(input) {

  // 🔍 Detectar si estamos en viewParte3
  const enParte3 = input.closest("#viewParte3");

  // ============================
  // 🟢 CASO: viewParte3 (Valores de prueba)
  // ============================
  if (enParte3) {

    const contenedorANSI = input.closest("[id^='ValorPrueba']");
    if (contenedorANSI) return contenedorANSI.id;

  }

  // ============================
  // 🔵 CASO: comportamiento normal (viewParte2 y otros)
  // ============================
  const fieldset = input.closest("fieldset[id]");
  if (fieldset) return fieldset.id;

  const contenedor = input.closest("div[id]");
  if (contenedor) return contenedor.id;

  return null;
}

function activarComboboxSimple(input, formKey) {

  const contenedorId = obtenerContenedorDinamico(input);
  if (!contenedorId) return;

  const vistas = mapaFormularios[formKey];

  for (const vistaId of vistas) {

    const mappingVista = COMBOBOX_MAPPINGS[vistaId];
    if (!mappingVista) continue;

    for (const [comboId, opciones] of Object.entries(mappingVista)) {

      for (const [valor, ids] of Object.entries(opciones)) {

        if (ids.includes(contenedorId)) {

          console.log("✅ Combobox encontrado en:", vistaId);

          // 🔥 cambiar a la vista correcta (IMPORTANTE)
          activarVista(vistaId);

          setTimeout(() => {
            const select = document.getElementById(comboId);

            if (select) {
              select.value = valor;
              select.dispatchEvent(new Event("change"));
            }
          }, 200);

          return;
        }
      }
    }
  }
}

function activarDesdeCampo(input) {

  const contenedorId = obtenerContenedorDinamico(input);
  if (!contenedorId) return;

  let proteccion = null;
  let fase = null;
  console.log("contenedorId:", contenedorId);
  // 🔥 detectar protección
  for (const [opcion, ids] of Object.entries(COMBOBOX_MAPPINGS.viewParte2["opciones-combobox"])) {
    if (ids.includes(contenedorId)) {
      proteccion = opcion;
      break;
    }
    console.log("Comparando con:", opcion, ids);
  }

  // 🔥 detectar fase
  for (const [opcion, ids] of Object.entries(COMBOBOX_MAPPINGS.viewParte3["opciones-combobox-ValoresPrueba"])) {
    if (ids.includes(contenedorId)) {
      fase = opcion;
      break;
    }
    console.log("Comparando con:", opcion, ids);
  }

  const selectProteccion = document.getElementById("opciones-combobox");
  const selectFase = document.getElementById("opciones-combobox-ValoresPrueba");

  // ============================
  // 🟦 PASO 1: activar PROTECCIÓN
  // ============================
  if (proteccion && selectProteccion) {
    selectProteccion.value = proteccion;
    selectProteccion.dispatchEvent(new Event("change"));
  }

  // ============================
  // 🟧 PASO 2: esperar render real
  // ============================
  requestAnimationFrame(() => {

    if (fase && selectFase) {
      selectFase.value = fase;
      selectFase.dispatchEvent(new Event("change"));
    }

    // ============================
    // 🟥 PASO 3: esperar siguiente render
    // ============================
    requestAnimationFrame(() => {

      // 🔥 validar que el campo ya sea visible
      if (input.offsetParent !== null) {
        esperarElementoPrueba(input.id, (el) => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      });
      } else {
        console.warn("Campo aún no visible:", input.id);
      }

    });

  });
}

// Función de lectura de archivos para reducir peso y convertir a Base64
async function procesarYComprimirImagen(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600; // Si quieres aumentar la resolución, aumenta el numero entero definido en el MAX_WITH
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertimos a JPEG con 70% de calidad
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // Si quieres aumentar la calidad, aumenta el numero decimal a 1 (100%)
        resolve({
          nombre: file.name.split('.')[0] + ".jpg",
          contenido: dataUrl.split(',')[1] // Solo el Base64 puro
        });
      };
    };
  });
}

// FUNCION PARA ENVIAR FOTOS A FLUJO SECUNDARIO
async function enviarFotosRegistro() {

  const urlFlujoFotos = ENDPOINTS.ENVIAR_FOTOS;

  // Obtenemos los valores originales
  const enlaceOriginal = document.getElementById("enlace")?.value || "";
  
  // --- NORMALIZACIÓN DEL ENLACE ---
  // Toma lo que esté antes del '-' o el valor completo si no hay '-'
  const enlaceNormalizado = enlaceOriginal.split('-')[0];

  const CodigoUnico = document.getElementById("CodigoUnico")?.value || "";
  const fecha = document.getElementById("fecha")?.value || "";
  const Celda = document.getElementById("Celda")?.value || "";

  const fotos = [];

  for (const id of camposFotos){

    const input = document.getElementById(id);

    if(!input || !input.files || input.files.length === 0){
      continue;
    }

    const fotoProcesada = await procesarYComprimirImagen(input.files[0]);

    const codigoLimpio = CodigoUnico.replace(/\D/g,"");
    //const celdaLimpia = Celda === "-" ? "" : "Celda" + Celda;
    const idLimpio = id.replace(/^foto/i,"");

    const nombreArchivo = [
      codigoLimpio,
      enlaceNormalizado,
      //celdaLimpia,
      idLimpio
    ].filter(Boolean).join("_") + ".jpg";

    fotos.push({
      campo:id,
      nombre:nombreArchivo,
      contenido:fotoProcesada.contenido
    });

  }

  if(fotos.length === 0){
    return;
  }

  const payload = {
    CodigoUnico: CodigoUnico,
    enlace: enlaceNormalizado,
    fecha: fecha,
    Celda: Celda,
    fotosenviadas: fotos
  };

  await fetch(urlFlujoFotos,{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });

}

// =============================
// 🟧 ENVÍO PLANTILLA 1 (viewParte1 + viewParteChecklist)
// =============================
document.getElementById("enviarBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const vistaActual = document.getElementById("viewParteChecklist");

    // 1️⃣ Validación Required
    if (!validarCamposRequeridos(vistaActual)) return;

  abrirPreviewEnModal("form1");
});

// =============================
// 🟥 ENVÍO PLANTILLA 3 (viewCambioAjuste)
// =============================
document.getElementById("enviarBtn2").addEventListener("click", (e) => {
  e.preventDefault();

    const vistaActual = document.getElementById("viewCambioAjuste2");

    // 1️⃣ Validación Required
    if (!validarCamposRequeridos(vistaActual)) return;

  abrirPreviewEnModal("form3");
});

// =============================
// 🟢 ENVÍO PLANTILLA 2 (viewParte1-3)
// =============================

if (btnNextParte3) {
  btnNextParte3.addEventListener("click", (e) => {
    e.preventDefault();

    const vistaActual = document.getElementById("viewParte3");

    // 1️⃣ Validación Required
    if (!validarCamposRequeridos(vistaActual)) return;

    // 2️⃣ Validación cruzada (igual que los botones Siguiente)
    if (!validarCruces()) return;

    abrirPreviewEnModal("form1_checklist");
  });
}

// =============================
// 🟢 ENVÍO PLANTILLA 2 (viewPuestaServicio)
// =============================
document.getElementById("enviarBtn3").addEventListener("click", (e) => {
    e.preventDefault();

    const vistaActual = document.getElementById("viewPuestaServicio");

    // 1️⃣ Validación Required
    if (!validarCamposRequeridos(vistaActual)) return;

    abrirPreviewEnModal("form2");
});

// =============================
// 🟦 FUNCIÓN GENÉRICA DE ENVÍO (común a todos los formularios)
// =============================
async function enviarFormulario(btn, campos, urlFlujo, enviarFotos=false, camposEnBlanco = []) {
  btn.disabled = true;
  btn.innerText = "Enviando...";

  try {
    let vistaActual = btn.closest(".view");
    if (!vistaActual && window.currentView) {
      vistaActual = document.getElementById(window.currentView);
    }

    if (!vistaActual) {
    console.error("❌ No se pudo determinar la vista actual desde el botón.");
    mostrarMensaje("⚠️ Error interno al identificar el formulario", "error");
    btn.disabled = false;
    btn.innerText = "Enviar";
    return;
  }

    //if (!validarCamposRequeridos(vistaActual)) {
    //  return;
   // }

    const datos = {};

    for (const id of campos) {
      const el = document.getElementById(id);
      // Si el elemento no existe en esta vista, saltar al siguiente ID
      if (!el) {
        console.warn(`⚠️ Elemento con id "${id}" no existe.`);
        datos[id] = ""; 
        continue;
      }

      // Saltar campos de imagen (se enviarán por otro flujo)
      if (el.type === "file") {
        continue;
      }

      // Lógica para campos de texto, select, etc.
      else {
        datos[id] = el.value ? el.value.trim() : "";
      }
    }

    // 2. LOGICA NUEVA: Forzar campos en blanco (Checklist)
    if (Array.isArray(camposEnBlanco)) {
      camposEnBlanco.forEach(id => {
        datos[id] = "";
      });
    }

    // Enviar fotos solo si el formulario lo requiere. Solo aplica para formulario PP
    if (enviarFotos) {
    enviarFotosRegistro()
        .then(() => {
            mostrarMensaje("📷 Fotos enviadas correctamente");
        })
        .catch((err) => {
            console.error("Error fotos:", err);
            mostrarMensaje("❌ Error al enviar las fotos", "error");
        });
      // NOTA: Sin 'await enviarFotosRegistro()' para no bloquear el envío de los 300 campos.
    }

    const response = await fetch(urlFlujo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (response.ok) {
      mostrarMensaje("✅ Datos enviados con éxito, pronto recibirá un correo");
      limpiarDraftsFormulario();
      limpiarFormulario();

    // ✅ Restaurar solo la fecha correspondiente
      const hoy = new Date();
      const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

      if (vistaActual.id.startsWith("viewParte")) {
        const fechaInput = document.getElementById("fecha");
        if (fechaInput) fechaInput.value = fechaHoy;
        if (typeof inicializarFechaYSemana === "function") inicializarFechaYSemana("fecha", "semana");
      }

      if (vistaActual.id === "viewCambioAjuste") {
        const fechaCAInput = document.getElementById("fechaCA");
        if (fechaCAInput) fechaCAInput.value = fechaHoy;
        if (typeof inicializarFechaYSemana === "function") inicializarFechaYSemana("fechaCA", "SemanaCA");
      }

      if (vistaActual.id === "viewPuestaServicio") {
        const fechaCAInput = document.getElementById("fechaPS");
        if (fechaCAInput) fechaCAInput.value = fechaHoy;
        if (typeof inicializarFechaYSemana === "function") inicializarFechaYSemana("fechaPS", "SemanaPS");
      }
      // 👇 Luego de enviar, volver a la vista principal
      btnFormatos.classList.add("active");
      btnFormatos.classList.remove("inactive");
      btnHistorial.classList.remove("active");
      btnHistorial.classList.add("inactive");
      cerrarPreview()
      activarVista("viewFormatos");
    } else {
      mostrarMensaje("❌ Error al enviar datos", "error");
    }
  } catch (error) {
    console.error("Error en fetch:", error);
    mostrarMensaje("⚠️ Hubo un problema con la conexión, no obstante, tus datos fueron enviados correctamente, pronto se le enviará un correo", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Enviar";
  }
}

const CONFIG_FORMULARIOS = {
  form1: {
    campos: CAMPOS_FORMULARIO_PP,
    endpoint: ENDPOINTS.ENVIAR_FORMULARIO_PP,
    enviarFotos: true,
    camposEnBlanco: []
  },
  form1_checklist: {
    campos: CAMPOS_FORMULARIO_PP_SC,
    endpoint: ENDPOINTS.ENVIAR_FORMULARIO_PP,
    enviarFotos: true,
    camposEnBlanco: camposChecklistPreguntas
  },
  form2: {
    campos: CAMPOS_FORMULARIO_PS,
    endpoint: ENDPOINTS.ENVIAR_FORMULARIO_PS
  },
  form3: {
    campos: CAMPOS_FORMULARIO_CA,
    endpoint: ENDPOINTS.ENVIAR_FORMULARIO_CA
  }
};

document.getElementById("btnConfirmar").addEventListener("click", (e) => {
  e.preventDefault();

  const cfg = CONFIG_FORMULARIOS[window.currentPreviewForm];

  if (!cfg) {
    console.error("❌ Configuración no encontrada");
    return;
  }

  enviarFormulario(
    e.target,
    cfg.campos,
    cfg.endpoint,
    cfg.enviarFotos || false,
    cfg.camposEnBlanco || []
  );
});