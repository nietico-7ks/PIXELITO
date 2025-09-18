// Variables de estado
let hambre = 100;
let diversion = 100;
let carino = 100;
let salud = 100;
let vivo = true;

const pixelito = document.getElementById("pixelito");

// Barras de progreso
const hambreBar = document.getElementById("hambreBar");
const diversionBar = document.getElementById("diversionBar");
const carinoBar = document.getElementById("carinoBar");
const saludBar = document.getElementById("saludBar");

// Textos de porcentaje
const hambreText = document.getElementById("hambreText");
const diversionText = document.getElementById("diversionText");
const carinoText = document.getElementById("carinoText");
const saludText = document.getElementById("saludText");

// Botones
const botones = document.querySelectorAll("button");

// --- FUNCIONES DE INTERACCIÓN ---
function alimentar() {
  if (!vivo) return;
  hambre = Math.min(hambre + 25, 100);
  salud = Math.min(salud + 5, 100); // comer ayuda a la salud
  actualizarEstado();
}

function jugar() {
  if (!vivo) return;
  diversion = Math.min(diversion + 25, 100);
  hambre = Math.max(hambre - 10, 0); // jugar da hambre
  salud = Math.max(salud - 5, 0); // jugar mucho puede cansar
  actualizarEstado();
}

function acariciar() {
  if (!vivo) return;
  carino = Math.min(carino + 20, 100);
  actualizarEstado();
}

// --- FUNCIÓN PARA ACTUALIZAR EL ESTADO ---
function actualizarEstado() {
  // Actualizar barras
  hambreBar.value = hambre;
  diversionBar.value = diversion;
  carinoBar.value = carino;
  saludBar.value = salud;

  // Actualizar porcentajes
  hambreText.textContent = hambre + "%";
  diversionText.textContent = diversion + "%";
  carinoText.textContent = carino + "%";
  saludText.textContent = salud + "%";

  // Revisar si está muerto
  if (salud <= 0 || (hambre <= 0 && diversion <= 0 && carino <= 0)) {
    morir();
    return;
  }

  // --- ORDEN CORREGIDO DE ESTADOS ---
  if (salud <= 30) {
    pixelito.src = "Imagenes/Pixelito Enfermo.png";
    pixelito.alt = "Pixelito está enfermo 🤒";
    console.log("Pixelito está enfermo 🤒");
  } else if (hambre <= 30 && diversion <= 30) {
    pixelito.src = "Imagenes/Pixelito enojado.png";
    pixelito.alt = "Pixelito está enojado 😠";
    console.log("Pixelito está enojado 😠");
  } else if (carino <= 30) {
    pixelito.src = "Imagenes/Pixelito t roste.png";
    pixelito.alt = "Pixelito está triste 💔";
    console.log("Pixelito está triste 💔");
  } else if (hambre <= 30) {
    pixelito.src = "Imagenes/Pixelito Hambiento.png";
    pixelito.alt = "Pixelito tiene hambre 🍽️";
    console.log("Pixelito tiene hambre 🍽️");
  } else if (diversion <= 30) {
    pixelito.src = "Imagenes/Pixelito Aburrido.png";
    pixelito.alt = "Pixelito está aburrido 😒";
    console.log("Pixelito está aburrido 😒");
  } else {
    pixelito.src = "Imagenes/pixelito feliz.png";
    pixelito.alt = "Pixelito está feliz 😄";
    console.log("Pixelito está feliz 😄");
  }
}

// --- FUNCIÓN DE MUERTE ---
function morir() {
  vivo = false;
  pixelito.src = "Imagenes/pixelito muerto.png";
  pixelito.alt = "Pixelito ha muerto 💀";
  console.log("💀 Pixelito ha muerto 💀");

  // Desactivar botones
  botones.forEach(boton => boton.disabled = true);
}

// --- TIMER QUE REDUCE SUS NECESIDADES ---
setInterval(() => {
  if (!vivo) return;

  hambre = Math.max(hambre - 5, 0);
  diversion = Math.max(diversion - 3, 0);
  carino = Math.max(carino - 2, 0);
  salud = Math.max(salud - 1, 0);

  actualizarEstado();
}, 5000); // cada 5 segundos pierde puntos

// Inicializar estado
actualizarEstado();
