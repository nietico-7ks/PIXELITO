// Variables de estado
let hambre = 100;
let diversion = 100;
let carino = 100;
let salud = 100;
let vivo = true;

// Elemento Pixelito
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

// Funciones de interacción
function alimentar() {
    if (!vivo) return;
    hambre = Math.min(hambre + 25, 100);//Hambre aumenta al comer
    salud = Math.min(salud + 5, 100); // Comer mejora salud
    actualizarEstado();
}

function jugar() {
    if (!vivo) return;
    diversion = Math.min(diversion + 25, 100);
    hambre = Math.max(hambre - 10, 0); // Jugar da hambre
    salud = Math.max(salud - 5, 0);    // Cansa un poco
    actualizarEstado();
}

function acariciar() {
    if (!vivo) return;
    carino = Math.min(carino + 20, 100);
    actualizarEstado();
}

// Función que actualiza barras y estado de Pixelito
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

    if (salud <= 30) {
        pixelito.src = "Imagenes/Pixelito Enfermo.png";
        pixelito.alt = "Pixelito está enfermo 🤒";
    } else if (hambre <= 30 && diversion <= 30) {
        pixelito.src = "Imagenes/Pixelito enojado.png";
        pixelito.alt = "Pixelito está enojado 😠";
    } else if (carino <= 30) {
        pixelito.src = "Imagenes/Pixelito triste.png";
        pixelito.alt = "Pixelito está triste 💔";
    } else if (hambre <= 30) {
        pixelito.src = "Imagenes/Pixelito Hambiento.png";
        pixelito.alt = "Pixelito tiene hambre 🍽️";
    } else if (diversion <= 30) {
        pixelito.src = "Imagenes/Pixelito Aburrido.png";
        pixelito.alt = "Pixelito está aburrido 😒";
    } else {
        pixelito.src = "Imagenes/pixelito feliz.png";
        pixelito.alt = "Pixelito está feliz 😄";
    }
}

// Función cuando Pixelito muere
function morir() {
    vivo = false;
    pixelito.src = "Imagenes/Pixelito Muerto.png";
    pixelito.alt = "Pixelito ha muerto 💀";

    // Desactivar todos los botones
    const botones = document.querySelectorAll("button");
    botones.forEach(boton => boton.disabled = true);
}

// Intervalo que reduce sus necesidades cada 5 segundos
setInterval(() => {
    if (!vivo) return;

    hambre = Math.max(hambre - 5, 0);
    diversion = Math.max(diversion - 3, 0);
    carino = Math.max(carino - 2, 0);
    salud = Math.max(salud - 1, 0);

    actualizarEstado();
}, 5000);

// Inicializar estado
actualizarEstado();
