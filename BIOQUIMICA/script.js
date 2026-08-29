const REF_PT_MIN = 30;   // mg/24 hs
const REF_PT_MAX = 140;  // mg/24 hs

function calcular(){
  const diuresis = parseFloat(document.getElementById('diuresis').value);
  const proteina = parseFloat(document.getElementById('proteina').value);
  const resultadoSpan = document.getElementById('resultadoCalculado');
  const estadoDiv = document.getElementById('estado');

  if(isNaN(diuresis) || isNaN(proteina) || diuresis < 0 || proteina < 0){
    return;
  }

  // Fórmula: PT ORINA 24 HS (mg/24h) = (PROT. EN ORINA [mg/dL] × DIURESIS [mL]) / 100
  const resultado = (proteina * diuresis) / 100;
  const resultadoEntero = Math.round(resultado);

  resultadoSpan.textContent = resultadoEntero.toLocaleString('es');

  // Aviso de rango de referencia desactivado
  estadoDiv.textContent = '';
}

// Recalcula automáticamente al escribir en DIURESIS o PROT. EN ORINA
document.addEventListener('DOMContentLoaded', () => {
  ['diuresis', 'proteina'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const d = document.getElementById('diuresis').value;
      const p = document.getElementById('proteina').value;
      if(d !== '' && p !== ''){
        calcular();
      }
    });
  });

  actualizarListaRegistros();
});

/* GUARDAR / CARGAR REGISTROS (localStorage) */
const CLAVE_STORAGE = 'proteinuria_registros';

function obtenerRegistros(){
  const datos = localStorage.getItem(CLAVE_STORAGE);
  return datos ? JSON.parse(datos) : [];
}

function actualizarListaRegistros(){
  const select = document.getElementById('listaRegistros');
  const registros = obtenerRegistros();

  select.innerHTML = '<option value=""> Seleccionar </option>';
  registros.forEach((r, i) => {
    const opcion = document.createElement('option');
    opcion.value = i;
    opcion.textContent = `${r.nombre} — ${r.fecha || 'sin fecha'}`;
    select.appendChild(opcion);
  });
}

function cargarRegistro(){
  const select = document.getElementById('listaRegistros');
  const indice = select.value;
  if(indice === '') return;

  const registros = obtenerRegistros();
  const r = registros[indice];

  document.getElementById('nombre').value = r.nombre;
  document.getElementById('fecha').value = r.fecha;
  document.getElementById('protocolo').value = r.protocolo;
  document.getElementById('tipoMuestra').value = r.tipoMuestra;
  document.getElementById('diuresis').value = r.diuresis;
  document.getElementById('proteina').value = r.proteina;

  calcular();
}

function eliminarRegistro(){
  const select = document.getElementById('listaRegistros');
  const indice = select.value;
  if(indice === ''){
    alert('Selecciona un registro para eliminar.');
    return;
  }

  const registros = obtenerRegistros();
  registros.splice(indice, 1);
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(registros));
  actualizarListaRegistros();
}

/* IMPRIMIR (guarda automáticamente antes)*/
function guardarEImprimir(){
  const registro = {
    nombre: document.getElementById('nombre').value,
    fecha: document.getElementById('fecha').value,
    protocolo: document.getElementById('protocolo').value,
    tipoMuestra: document.getElementById('tipoMuestra').value,
    diuresis: document.getElementById('diuresis').value,
    proteina: document.getElementById('proteina').value
  };

  if(registro.nombre){
    const registros = obtenerRegistros();
    registros.push(registro);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(registros));
    actualizarListaRegistros();
  }

  window.print();
}

/* LIMPIAR FORMULARIO (único botón que limpia)*/
function limpiarFormulario(){
  document.getElementById('nombre').value = '';
  document.getElementById('protocolo').value = '';
  document.getElementById('diuresis').value = '';
  document.getElementById('proteina').value = '';
  document.getElementById('resultadoCalculado').textContent = '—';
  document.getElementById('estado').textContent = '';
  document.getElementById('listaRegistros').value = '';
}
