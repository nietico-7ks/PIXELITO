// Variables de estado
let hambre = 100;
let diversion = 100;
let carino = 100;
let salud = 100;
let vivo = true;

// Elementos
const pixelito = document.getElementById("pixelito");
const hambreBar = document.getElementById("hambreBar");
const diversionBar = document.getElementById("diversionBar");
const carinoBar = document.getElementById("carinoBar");
const saludBar = document.getElementById("saludBar");
const hambreText = document.getElementById("hambreText");
const diversionText = document.getElementById("diversionText");
const carinoText = document.getElementById("carinoText");
const saludText = document.getElementById("saludText");
const estado = document.getElementById("estadoPixelito");

// Animación
function animarPixelito() {
  pixelito.classList.add("animar");
  setTimeout(() => pixelito.classList.remove("animar"), 200);
}

// Funciones de interacción
function alimentar() {
  if (!vivo) return;
  animarPixelito();
  hambre = Math.min(hambre + 25, 100);
  salud = Math.min(salud + 5, 100);
  actualizarEstado();
}

function jugar() {
  if (!vivo) return;
  animarPixelito();
  diversion = Math.min(diversion + 25, 100);
  hambre = Math.max(hambre - 10, 0);
  salud = Math.max(salud - 5, 0);
  actualizarEstado();
}

function acariciar() {
  if (!vivo) return;
  animarPixelito();
  carino = Math.min(carino + 20, 100);
  actualizarEstado();
}

// Actualizar estado
function actualizarEstado() {
  hambreBar.value = hambre;
  diversionBar.value = diversion;
  carinoBar.value = carino;
  saludBar.value = salud;

  hambreText.textContent = hambre + "%";
  diversionText.textContent = diversion + "%";
  carinoText.textContent = carino + "%";
  saludText.textContent = salud + "%";

  if (!vivo) return;

  if (salud <= 0 || (hambre <= 0 && diversion <= 0 && carino <= 0)) {
    morir();
    return;
  }

  // Cambiar imagen y mensaje
  const body = document.body;

  if (salud <= 30) {
    pixelito.src = "Imagenes/Pixelito Enfermo.png";
    estado.textContent = "Pixelito está enfermo 🤒";
    body.style.background = "linear-gradient(135deg, #ffb3b3, #ff9999)";
  } else if (hambre <= 30 && diversion <= 30) {
    pixelito.src = "Imagenes/Pixelito enojado.png";
    estado.textContent = "Pixelito está enojado 😠";
    body.style.background = "linear-gradient(135deg, #ffd480, #ffb84d)";
  } else if (carino <= 30) {
    pixelito.src = "Imagenes/Pixelito triste.png";
    estado.textContent = "Pixelito está triste 💔";
    body.style.background = "linear-gradient(135deg, #b3d9ff, #80bfff)";
  } else if (hambre <= 30) {
    pixelito.src = "Imagenes/Pixelito Hambiento.png";
    estado.textContent = "Pixelito tiene hambre 🍽️";
    body.style.background = "linear-gradient(135deg, #ffe0b2, #ffcc80)";
  } else if (diversion <= 30) {
    pixelito.src = "Imagenes/Pixelito Aburrido.png";
    estado.textContent = "Pixelito está aburrido 😒";
    body.style.background = "linear-gradient(135deg, #e0e0e0, #bdbdbd)";
  } else {
    pixelito.src = "Imagenes/pixelito feliz.png";
    estado.textContent = "Pixelito está feliz 😄";
    body.style.background = "linear-gradient(135deg, #fff3e0, #ffe0b2)";
  }
}

function reiniciar() {
  // Restaurar valores
  hambre = 100;
  diversion = 100;
  carino = 100;
  salud = 100;
  vivo = true;

  // Volver a habilitar los botones
  const botones = document.querySelectorAll("button");
  botones.forEach(boton => boton.disabled = false);

  pixelito.src = "Imagenes/pixelito feliz.png";
  estado.textContent = "Pixelito ha renacido 🌱 ¡Está feliz otra vez!";
  document.body.style.background = "linear-gradient(135deg, #fff3e0, #ffe0b2)";
  
  actualizarEstado();
}


// Muerte
function morir() {
  vivo = false;
  pixelito.src = "Imagenes/Pixelito Muerto.png";
  estado.textContent = "Pixelito ha muerto 💀";
  const botones = document.querySelectorAll("button");
  botones.forEach(boton => boton.disabled = true);
}

// Decaimiento con el tiempo
setInterval(() => {
  if (!vivo) return;
  hambre = Math.max(hambre - 5, 0);
  diversion = Math.max(diversion - 3, 0);
  carino = Math.max(carino - 2, 0);
  salud = Math.max(salud - 1, 0);
  actualizarEstado();
}, 5000);

// Inicializar
actualizarEstado();
