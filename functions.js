/**
 * Módulo Pixelito - Gestión de mascota virtual
 * Con sistema de alimentos usando imágenes
 * @author Anerix Software
 * @version 3.1
 */
const Pixelito = (() => {
    // ==========================================
    // CONSTANTES DE CONFIGURACIÓN
    // ==========================================
    const CONFIG = {
        VALOR_MAXIMO: 100,
        VALOR_MINIMO: 0,
        
        // Incrementos por acción básica
        INCREMENTO_DIVERSION: 25,
        INCREMENTO_CARINO: 20,
        
        // Decrementos por acción
        DECREMENTO_HAMBRE_POR_JUEGO: 10,
        DECREMENTO_SALUD_POR_JUEGO: 5,
        
        // Decaimiento automático
        DECAIMIENTO_HAMBRE: 5,
        DECAIMIENTO_DIVERSION: 3,
        DECAIMIENTO_CARINO: 2,
        DECAIMIENTO_SALUD: 1,
        INTERVALO_DECAIMIENTO: 5000,
        
        // Umbrales
        UMBRAL_CRITICO: 30,
        UMBRAL_MUERTE: 0,
        
        // Animación
        DURACION_ANIMACION: 200,
        DURACION_REDBULL: 5000 // 5 segundos con alas
    };

    // ==========================================
    // SISTEMA DE ALIMENTOS Y BEBIDAS
    // ==========================================
    const ALIMENTOS = {
        carne: {
            nombre: 'Filete de Carne',
            imagen: 'Imagenes/carne.png',
            hambre: 25,
            salud: 10,
            diversion: 0
        },
        cereal: {
            nombre: 'Cereal',
            imagen: 'Imagenes/cereal.png',
            hambre: 10,
            salud: -5,
            diversion: 0
        },
        verduras: {
            nombre: 'Verduras',
            imagen: 'Imagenes/verduras.png',
            hambre: 10,
            salud: 30,
            diversion: 0
        },
        yogurt: {
            nombre: 'Yogurt',
            imagen: 'Imagenes/yogurt.png',
            hambre: 5,
            salud: -10,
            diversion: 0
        },
        caramelo: {
            nombre: 'Bastón de Caramelo',
            imagen: 'Imagenes/caramelo.png',
            hambre: 2,
            salud: -20,
            diversion: 15
        },
        agua: {
            nombre: 'Agua',
            imagen: 'Imagenes/agua.png',
            hambre: 10,
            salud: 0,
            diversion: -20
        },
        redbull: {
            nombre: 'RedBull',
            imagen: 'Imagenes/redbull.png',
            hambre: 10,
            salud: -25,
            diversion: 20,
            especial: 'alas' // Efecto especial
        }
    };

    // ==========================================
    // DEFINICIÓN DE ESTADOS
    // ==========================================
    const ESTADOS = {
        ENFERMO: {
            nombre: 'enfermo',
            imagen: 'Imagenes/Pixelito Enfermo.png',
            mensaje: 'Pixelito está enfermo 🤒',
            condicion: (stats) => stats.salud <= CONFIG.UMBRAL_CRITICO
        },
        ENOJADO: {
            nombre: 'enojado',
            imagen: 'Imagenes/Pixelito enojado.png',
            mensaje: 'Pixelito está enojado 😠',
            condicion: (stats) => stats.hambre <= CONFIG.UMBRAL_CRITICO && stats.diversion <= CONFIG.UMBRAL_CRITICO
        },
        TRISTE: {
            nombre: 'triste',
            imagen: 'Imagenes/Pixelito triste.png',
            mensaje: 'Pixelito está triste 💔',
            condicion: (stats) => stats.carino <= CONFIG.UMBRAL_CRITICO
        },
        HAMBRIENTO: {
            nombre: 'hambriento',
            imagen: 'Imagenes/Pixelito Hambiento.png',
            mensaje: 'Pixelito tiene hambre 🍽️',
            condicion: (stats) => stats.hambre <= CONFIG.UMBRAL_CRITICO
        },
        ABURRIDO: {
            nombre: 'aburrido',
            imagen: 'Imagenes/Pixelito Aburrido.png',
            mensaje: 'Pixelito está aburrido 😒',
            condicion: (stats) => stats.diversion <= CONFIG.UMBRAL_CRITICO
        },
        FELIZ: {
            nombre: 'feliz',
            imagen: 'Imagenes/pixelito feliz.png',
            mensaje: 'Pixelito está feliz 😄',
            condicion: () => true
        },
        MUERTO: {
            nombre: 'muerto',
            imagen: 'Imagenes/Pixelito Muerto.png',
            mensaje: 'Pixelito ha muerto 💀',
            condicion: null
        }
    };

    // ==========================================
    // ESTADO INTERNO
    // ==========================================
    let estadisticas = {
        hambre: CONFIG.VALOR_MAXIMO,
        diversion: CONFIG.VALOR_MAXIMO,
        carino: CONFIG.VALOR_MAXIMO,
        salud: CONFIG.VALOR_MAXIMO
    };

    let vivo = true;
    let intervaloDecaimiento = null;
    let menuAlimentosAbierto = false;
    let imagenOriginalPixelito = 'Imagenes/pixelito feliz.png';

    // ==========================================
    // REFERENCIAS AL DOM
    // ==========================================
    const elementos = {
        pixelito: document.getElementById('pixelito'),
        estado: document.getElementById('estadoPixelito'),
        body: document.body,
        barras: {
            hambre: document.getElementById('hambreBar'),
            diversion: document.getElementById('diversionBar'),
            carino: document.getElementById('carinoBar'),
            salud: document.getElementById('saludBar')
        },
        textos: {
            hambre: document.getElementById('hambreText'),
            diversion: document.getElementById('diversionText'),
            carino: document.getElementById('carinoText'),
            salud: document.getElementById('saludText')
        },
        botones: document.querySelectorAll('.botones button'),
        menuAlimentos: null
    };

    // ==========================================
    // FUNCIONES UTILITARIAS
    // ==========================================
    
    const limitarValor = (valor, min = CONFIG.VALOR_MINIMO, max = CONFIG.VALOR_MAXIMO) => {
        return Math.max(min, Math.min(max, valor));
    };

    const animarPixelito = () => {
        elementos.pixelito.classList.add('animar');
        setTimeout(() => {
            elementos.pixelito.classList.remove('animar');
        }, CONFIG.DURACION_ANIMACION);
    };

    const determinarEstado = () => {
        if (estadisticas.salud <= CONFIG.UMBRAL_MUERTE || 
            (estadisticas.hambre <= CONFIG.UMBRAL_MUERTE && 
             estadisticas.diversion <= CONFIG.UMBRAL_MUERTE && 
             estadisticas.carino <= CONFIG.UMBRAL_MUERTE)) {
            return ESTADOS.MUERTO;
        }

        for (const estado of Object.values(ESTADOS)) {
            if (estado.condicion && estado.condicion(estadisticas)) {
                return estado;
            }
        }

        return ESTADOS.FELIZ;
    };

    // ==========================================
    // EFECTOS ESPECIALES
    // ==========================================
    
    /**
     * Efecto RedBull - Le salen alas a Pixelito (cambia la imagen)
     */
    const efectoRedBull = () => {
        // Guardar la imagen actual
        imagenOriginalPixelito = elementos.pixelito.src;
        
        // Cambiar a la imagen con alas
        elementos.pixelito.src = 'Imagenes/Pixelito con alas.png';
        elementos.pixelito.classList.add('con-alas');
        elementos.estado.textContent = '¡RedBull le da alas! 🪽✨';
        
        // Volver a la imagen normal después de 5 segundos
        setTimeout(() => {
            elementos.pixelito.classList.remove('con-alas');
            actualizarEstado(); // Esto restaurará la imagen correcta según el estado
        }, CONFIG.DURACION_REDBULL);
    };

    /**
     * Mostrar notificación flotante
     */
    const mostrarNotificacion = (mensaje, tipo = 'info') => {
        const notif = document.createElement('div');
        notif.className = `notificacion notif-${tipo}`;
        notif.textContent = mensaje;
        document.body.appendChild(notif);
        
        setTimeout(() => notif.classList.add('show'), 10);
        
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 2500);
    };

    // ==========================================
    // SISTEMA DE ALIMENTACIÓN
    // ==========================================
    
    /**
     * Crea el menú de alimentos con imágenes
     */
    const crearMenuAlimentos = () => {
        if (elementos.menuAlimentos) return;
        
        const menu = document.createElement('div');
        menu.id = 'menuAlimentos';
        menu.className = 'menu-alimentos oculto';
        
        let htmlMenu = '<div class="menu-contenido">';
        htmlMenu += '<h3>🍽️ Elige qué darle a Pixelito</h3>';
        htmlMenu += '<div class="grid-alimentos">';
        
        for (const [key, alimento] of Object.entries(ALIMENTOS)) {
            htmlMenu += `
                <button class="item-alimento" onclick="Pixelito.darAlimento('${key}')">
                    <img src="${alimento.imagen}" alt="${alimento.nombre}" class="imagen-alimento">
                    <span class="nombre-alimento">${alimento.nombre}</span>
                    <div class="stats-alimento">
                        ${alimento.hambre !== 0 ? `<span class="${alimento.hambre > 0 ? 'positivo' : 'negativo'}">🍽️ ${alimento.hambre > 0 ? '+' : ''}${alimento.hambre}</span>` : ''}
                        ${alimento.salud !== 0 ? `<span class="${alimento.salud > 0 ? 'positivo' : 'negativo'}">❤️ ${alimento.salud > 0 ? '+' : ''}${alimento.salud}</span>` : ''}
                        ${alimento.diversion !== 0 ? `<span class="${alimento.diversion > 0 ? 'positivo' : 'negativo'}">🎮 ${alimento.diversion > 0 ? '+' : ''}${alimento.diversion}</span>` : ''}
                    </div>
                </button>
            `;
        }
        
        htmlMenu += '</div>';
        htmlMenu += '<button class="btn-cerrar" onclick="Pixelito.cerrarMenuAlimentos()">❌ Cerrar</button>';
        htmlMenu += '</div>';
        
        menu.innerHTML = htmlMenu;
        document.body.appendChild(menu);
        elementos.menuAlimentos = menu;
    };

    const abrirMenuAlimentos = () => {
        if (!vivo) return;
        
        crearMenuAlimentos();
        elementos.menuAlimentos.classList.remove('oculto');
        menuAlimentosAbierto = true;
    };

    const cerrarMenuAlimentos = () => {
        if (elementos.menuAlimentos) {
            elementos.menuAlimentos.classList.add('oculto');
        }
        menuAlimentosAbierto = false;
    };

    /**
     * Da un alimento específico a Pixelito
     */
    const darAlimento = (tipoAlimento) => {
        if (!vivo) return;
        
        const alimento = ALIMENTOS[tipoAlimento];
        if (!alimento) return;
        
        animarPixelito();
        
        // Aplicar efectos
        estadisticas.hambre = limitarValor(estadisticas.hambre + alimento.hambre);
        estadisticas.salud = limitarValor(estadisticas.salud + alimento.salud);
        estadisticas.diversion = limitarValor(estadisticas.diversion + alimento.diversion);
        
        // Efecto especial de RedBull
        if (alimento.especial === 'alas') {
            efectoRedBull();
        } else {
            actualizarEstado();
        }
        
        // Mostrar notificación
        let mensaje = `Pixelito comió ${alimento.nombre}`;
        let tipo = 'info';
        
        if (alimento.salud < -15) {
            tipo = 'warning';
            mensaje += ' ¡Cuidado con su salud!';
        } else if (alimento.salud > 15) {
            tipo = 'success';
            mensaje += ' ¡Muy saludable!';
        }
        
        mostrarNotificacion(mensaje, tipo);
        
        cerrarMenuAlimentos();
    };

    // ==========================================
    // ACTUALIZACIÓN DE INTERFAZ
    // ==========================================
    
    const actualizarBarrasEstadisticas = () => {
        for (const [key, valor] of Object.entries(estadisticas)) {
            elementos.barras[key].value = valor;
            elementos.textos[key].textContent = `${Math.round(valor)}%`;
            
            const contenedor = elementos.textos[key].parentElement.parentElement;
            if (valor <= CONFIG.UMBRAL_CRITICO) {
                contenedor.classList.add('stat-critica');
            } else {
                contenedor.classList.remove('stat-critica');
            }
        }
    };

    const actualizarApariencia = (estado) => {
        elementos.pixelito.src = estado.imagen;
        elementos.estado.textContent = estado.mensaje;
        elementos.body.dataset.estado = estado.nombre;
    };

    const actualizarEstado = () => {
        actualizarBarrasEstadisticas();

        if (!vivo) return;

        const estadoActual = determinarEstado();

        if (estadoActual === ESTADOS.MUERTO) {
            morir();
            return;
        }

        actualizarApariencia(estadoActual);
    };

    // ==========================================
    // ACCIONES DEL JUGADOR
    // ==========================================
    
    const alimentar = () => {
        abrirMenuAlimentos();
    };

    const jugar = () => {
        if (!vivo) return;
        
        animarPixelito();
        estadisticas.diversion = limitarValor(estadisticas.diversion + CONFIG.INCREMENTO_DIVERSION);
        estadisticas.hambre = limitarValor(estadisticas.hambre - CONFIG.DECREMENTO_HAMBRE_POR_JUEGO);
        estadisticas.salud = limitarValor(estadisticas.salud - CONFIG.DECREMENTO_SALUD_POR_JUEGO);
        actualizarEstado();
    };

    const acariciar = () => {
        if (!vivo) return;
        
        animarPixelito();
        estadisticas.carino = limitarValor(estadisticas.carino + CONFIG.INCREMENTO_CARINO);
        actualizarEstado();
    };

    const reiniciar = () => {
        estadisticas = {
            hambre: CONFIG.VALOR_MAXIMO,
            diversion: CONFIG.VALOR_MAXIMO,
            carino: CONFIG.VALOR_MAXIMO,
            salud: CONFIG.VALOR_MAXIMO
        };
        
        vivo = true;

        elementos.botones.forEach(boton => {
            boton.disabled = false;
        });

        elementos.pixelito.classList.remove('con-alas');

        actualizarApariencia(ESTADOS.FELIZ);
        elementos.estado.textContent = 'Pixelito ha renacido 🌱 ¡Está feliz otra vez!';
        
        actualizarEstado();

        if (!intervaloDecaimiento) {
            iniciarDecaimiento();
        }
    };

    // ==========================================
    // MUERTE
    // ==========================================
    
    const morir = () => {
        vivo = false;
        actualizarApariencia(ESTADOS.MUERTO);
        
        elementos.botones.forEach(boton => {
            if (!boton.textContent.includes('Reiniciar')) {
                boton.disabled = true;
            }
        });

        if (intervaloDecaimiento) {
            clearInterval(intervaloDecaimiento);
            intervaloDecaimiento = null;
        }
        
        cerrarMenuAlimentos();
    };

    // ==========================================
    // DECAIMIENTO AUTOMÁTICO
    // ==========================================
    
    const aplicarDecaimiento = () => {
        if (!vivo) return;

        estadisticas.hambre = limitarValor(estadisticas.hambre - CONFIG.DECAIMIENTO_HAMBRE);
        estadisticas.diversion = limitarValor(estadisticas.diversion - CONFIG.DECAIMIENTO_DIVERSION);
        estadisticas.carino = limitarValor(estadisticas.carino - CONFIG.DECAIMIENTO_CARINO);
        estadisticas.salud = limitarValor(estadisticas.salud - CONFIG.DECAIMIENTO_SALUD);
        
        actualizarEstado();
    };

    const iniciarDecaimiento = () => {
        intervaloDecaimiento = setInterval(aplicarDecaimiento, CONFIG.INTERVALO_DECAIMIENTO);
    };

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    
    const inicializar = () => {
        actualizarEstado();
        iniciarDecaimiento();
        
        console.log('🎮 Pixelito v3.1 iniciado - Sistema de alimentación con imágenes activado');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    // ==========================================
    // API PÚBLICA
    // ==========================================
    return {
        alimentar,
        jugar,
        acariciar,
        reiniciar,
        darAlimento,
        abrirMenuAlimentos,
        cerrarMenuAlimentos,
        getEstadisticas: () => ({ ...estadisticas }),
        getVivo: () => vivo,
        getConfig: () => ({ ...CONFIG })
    };
})();