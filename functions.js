/**
 * Módulo Pixelito - Con sistema de mini-juegos
 * @author Anerix Software
 * @version 3.3
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
        DURACION_REDBULL: 5000,
        DURACION_JUEGO: 8000, // Duración de los mini-juegos
        
        // Guardado
        CLAVE_GUARDADO: 'pixelito_save',
        INTERVALO_AUTO_GUARDADO: 10000
    };

    // ==========================================
    // SISTEMA DE MINI-JUEGOS
    // ==========================================
    const MINI_JUEGOS = {
        futbol: {
            nombre: '⚽ Fútbol',
            icono: 'Imagenes/icono-futbol.png',
            imagen: 'Imagenes/Pixelito futbol.png',
            diversion: 35,
            hambre: -15,
            salud: -8,
            mensaje: '¡Pixelito está jugando fútbol! ⚽🏃',
            descripcion: 'Juega un partido con Pixelito'
        },
        xbox: {
            nombre: '🎮 Xbox',
            icono: 'Imagenes/icono-xbox.png',
            imagen: 'Imagenes/Pixelito xbox.png',
            diversion: 40,
            hambre: -5,
            salud: -3,
            mensaje: '¡Pixelito está jugando Xbox! 🎮✨',
            descripcion: 'Sesión de videojuegos'
        },
        musica: {
            nombre: '🎵 Música',
            icono: 'Imagenes/icono-musica.png',
            imagen: 'Imagenes/Pixelito musica.png',
            diversion: 30,
            hambre: -8,
            salud: 5,
            carino: 10,
            mensaje: '¡Pixelito está escuchando música! 🎵🎧',
            descripcion: 'Relájate con música'
        }
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
            especial: 'alas'
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
    let intervaloAutoGuardado = null;
    let menuAlimentosAbierto = false;
    let menuJuegosAbierto = false;
    let jugandoMiniJuego = false;
    let imagenOriginalPixelito = 'Imagenes/pixelito feliz.png';
    
    let estadisticasJuego = {
        tiempoVivo: 0,
        vecesAlimentado: 0,
        vecesJugado: 0,
        vecesAcariciado: 0,
        vecesReiniciado: 0,
        partidosFutbol: 0,
        partidosXbox: 0,
        sesionesMusica: 0,
        fechaCreacion: new Date().toISOString(),
        ultimaVisita: new Date().toISOString()
    };

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
        menuAlimentos: null,
        menuJuegos: null
    };

    // ==========================================
    // SISTEMA DE GUARDADO
    // ==========================================
    
    const guardarProgreso = () => {
        const datosGuardado = {
            estadisticas: estadisticas,
            vivo: vivo,
            estadisticasJuego: estadisticasJuego,
            version: '3.3'
        };
        
        try {
            localStorage.setItem(CONFIG.CLAVE_GUARDADO, JSON.stringify(datosGuardado));
            console.log('💾 Progreso guardado');
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const cargarProgreso = () => {
        try {
            const datosGuardados = localStorage.getItem(CONFIG.CLAVE_GUARDADO);
            
            if (!datosGuardados) {
                console.log('No hay progreso guardado. Iniciando juego nuevo.');
                return false;
            }

            const datos = JSON.parse(datosGuardados);
            
            estadisticas = datos.estadisticas || estadisticas;
            vivo = datos.vivo !== undefined ? datos.vivo : true;
            estadisticasJuego = datos.estadisticasJuego || estadisticasJuego;
            estadisticasJuego.ultimaVisita = new Date().toISOString();
            
            console.log('✅ Progreso cargado');
            mostrarNotificacion('¡Bienvenido de vuelta! 🎮', 'success');
            
            return true;
        } catch (error) {
            console.error('Error al cargar progreso:', error);
            return false;
        }
    };

    const borrarProgreso = () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el progreso?')) {
            localStorage.removeItem(CONFIG.CLAVE_GUARDADO);
            mostrarNotificacion('Progreso eliminado. Recarga la página.', 'warning');
            console.log('🗑️ Progreso borrado');
        }
    };

    const iniciarAutoGuardado = () => {
        intervaloAutoGuardado = setInterval(() => {
            if (vivo) {
                estadisticasJuego.tiempoVivo += CONFIG.INTERVALO_AUTO_GUARDADO / 1000;
            }
            guardarProgreso();
        }, CONFIG.INTERVALO_AUTO_GUARDADO);
    };

    const exportarProgreso = () => {
        const datos = localStorage.getItem(CONFIG.CLAVE_GUARDADO);
        if (!datos) {
            alert('No hay progreso para exportar');
            return;
        }
        
        const blob = new Blob([datos], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixelito_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        mostrarNotificacion('Backup descargado', 'success');
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
    
    const efectoRedBull = () => {
        imagenOriginalPixelito = elementos.pixelito.src;
        elementos.pixelito.src = 'Imagenes/Pixelito con alas.png';
        elementos.pixelito.classList.add('con-alas');
        elementos.estado.textContent = '¡RedBull le da alas! 🪽✨';
        
        setTimeout(() => {
            elementos.pixelito.classList.remove('con-alas');
            actualizarEstado();
        }, CONFIG.DURACION_REDBULL);
    };

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
    // SISTEMA DE MINI-JUEGOS
    // ==========================================
    
    /**
     * Crea el menú de mini-juegos
     */
    const crearMenuJuegos = () => {
        if (elementos.menuJuegos) return;
        
        const menu = document.createElement('div');
        menu.id = 'menuJuegos';
        menu.className = 'menu-alimentos oculto'; // Reutilizamos estilos
        
        let htmlMenu = '<div class="menu-contenido">';
        htmlMenu += '<h3>🎮 ¿A qué quieres jugar con Pixelito?</h3>';
        htmlMenu += '<div class="grid-alimentos">'; // Reutilizamos grid
        
        for (const [key, juego] of Object.entries(MINI_JUEGOS)) {
            htmlMenu += `
                <button class="item-alimento" onclick="Pixelito.jugarMiniJuego('${key}')">
                    <img src="${juego.icono}" alt="${juego.nombre}" class="imagen-alimento">
                    <span class="nombre-alimento">${juego.nombre}</span>
                    <p class="descripcion-juego">${juego.descripcion}</p>
                    <div class="stats-alimento">
                        <span class="positivo">🎮 +${juego.diversion}</span>
                        ${juego.hambre !== 0 ? `<span class="negativo">🍽️ ${juego.hambre}</span>` : ''}
                        ${juego.salud !== 0 ? `<span class="${juego.salud > 0 ? 'positivo' : 'negativo'}">❤️ ${juego.salud > 0 ? '+' : ''}${juego.salud}</span>` : ''}
                    </div>
                </button>
            `;
        }
        
        htmlMenu += '</div>';
        htmlMenu += '<button class="btn-cerrar" onclick="Pixelito.cerrarMenuJuegos()">❌ Cerrar</button>';
        htmlMenu += '</div>';
        
        menu.innerHTML = htmlMenu;
        document.body.appendChild(menu);
        elementos.menuJuegos = menu;
    };

    /**
     * Abre el menú de mini-juegos
     */
    const abrirMenuJuegos = () => {
        if (!vivo || jugandoMiniJuego) return;
        
        crearMenuJuegos();
        elementos.menuJuegos.classList.remove('oculto');
        menuJuegosAbierto = true;
    };

    /**
     * Cierra el menú de mini-juegos
     */
    const cerrarMenuJuegos = () => {
        if (elementos.menuJuegos) {
            elementos.menuJuegos.classList.add('oculto');
        }
        menuJuegosAbierto = false;
    };

    /**
     * Inicia un mini-juego específico
     */
    const jugarMiniJuego = (tipoJuego) => {
        if (!vivo || jugandoMiniJuego) return;
        
        const juego = MINI_JUEGOS[tipoJuego];
        if (!juego) return;
        
        jugandoMiniJuego = true;
        cerrarMenuJuegos();
        
        // Guardar imagen original
        imagenOriginalPixelito = elementos.pixelito.src;
        
        // Cambiar a imagen del juego
        elementos.pixelito.src = juego.imagen;
        elementos.pixelito.classList.add('jugando-minijuego');
        elementos.estado.textContent = juego.mensaje;
        
        // Mostrar notificación
        mostrarNotificacion(`¡A jugar ${juego.nombre}!`, 'info');
        
        // Después del tiempo de juego, aplicar efectos
        setTimeout(() => {
            // Aplicar cambios en estadísticas
            estadisticas.diversion = limitarValor(estadisticas.diversion + juego.diversion);
            estadisticas.hambre = limitarValor(estadisticas.hambre + juego.hambre);
            estadisticas.salud = limitarValor(estadisticas.salud + juego.salud);
            
            if (juego.carino) {
                estadisticas.carino = limitarValor(estadisticas.carino + juego.carino);
            }
            
            // Actualizar estadísticas de juego
            estadisticasJuego.vecesJugado++;
            if (tipoJuego === 'futbol') estadisticasJuego.partidosFutbol++;
            if (tipoJuego === 'xbox') estadisticasJuego.partidosXbox++;
            if (tipoJuego === 'musica') estadisticasJuego.sesionesMusica++;
            
            // Restaurar estado normal
            elementos.pixelito.classList.remove('jugando-minijuego');
            jugandoMiniJuego = false;
            
            actualizarEstado();
            guardarProgreso();
            
            mostrarNotificacion('¡Juego terminado! 🎉', 'success');
        }, CONFIG.DURACION_JUEGO);
    };

    // ==========================================
    // SISTEMA DE ALIMENTACIÓN
    // ==========================================
    
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

    const darAlimento = (tipoAlimento) => {
        if (!vivo) return;
        
        const alimento = ALIMENTOS[tipoAlimento];
        if (!alimento) return;
        
        animarPixelito();
        
        estadisticas.hambre = limitarValor(estadisticas.hambre + alimento.hambre);
        estadisticas.salud = limitarValor(estadisticas.salud + alimento.salud);
        estadisticas.diversion = limitarValor(estadisticas.diversion + alimento.diversion);
        
        estadisticasJuego.vecesAlimentado++;
        
        if (alimento.especial === 'alas') {
            efectoRedBull();
        } else {
            actualizarEstado();
        }
        
        let mensaje = `Pixelito comió ${alimento.nombre}`;
        let tipo = 'info';
        
        if (alimento.salud < -15) {
            tipo = 'warning';
            mensaje += ' ¡Cuidado!';
        } else if (alimento.salud > 15) {
            tipo = 'success';
            mensaje += ' ¡Saludable!';
        }
        
        mostrarNotificacion(mensaje, tipo);
        cerrarMenuAlimentos();
        guardarProgreso();
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
        abrirMenuJuegos();
    };

    const acariciar = () => {
        if (!vivo) return;
        
        animarPixelito();
        estadisticas.carino = limitarValor(estadisticas.carino + CONFIG.INCREMENTO_CARINO);
        
        estadisticasJuego.vecesAcariciado++;
        actualizarEstado();
        guardarProgreso();
    };

    const reiniciar = () => {
        if (!confirm('¿Estás seguro de que quieres reiniciar a Pixelito?')) {
            return;
        }
        
        estadisticas = {
            hambre: CONFIG.VALOR_MAXIMO,
            diversion: CONFIG.VALOR_MAXIMO,
            carino: CONFIG.VALOR_MAXIMO,
            salud: CONFIG.VALOR_MAXIMO
        };
        
        vivo = true;
        estadisticasJuego.vecesReiniciado++;
        estadisticasJuego.tiempoVivo = 0;

        elementos.botones.forEach(boton => {
            boton.disabled = false;
        });

        elementos.pixelito.classList.remove('con-alas');
        actualizarApariencia(ESTADOS.FELIZ);
        elementos.estado.textContent = 'Pixelito ha renacido 🌱';
        
        actualizarEstado();

        if (!intervaloDecaimiento) {
            iniciarDecaimiento();
        }
        
        guardarProgreso();
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
        cerrarMenuJuegos();
        guardarProgreso();
    };

    // ==========================================
    // DECAIMIENTO AUTOMÁTICO
    // ==========================================
    
    const aplicarDecaimiento = () => {
        if (!vivo || jugandoMiniJuego) return;

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
        const progresoCargado = cargarProgreso();
        
        actualizarEstado();
        iniciarDecaimiento();
        iniciarAutoGuardado();
        
        window.addEventListener('beforeunload', () => {
            guardarProgreso();
        });
        
        console.log('🎮 Pixelito v3.3 iniciado - Mini-juegos activados');
        console.log('📊 Estadísticas:', estadisticasJuego);
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
        jugarMiniJuego,
        abrirMenuAlimentos,
        cerrarMenuAlimentos,
        abrirMenuJuegos,
        cerrarMenuJuegos,
        guardarProgreso,
        borrarProgreso,
        exportarProgreso,
        getEstadisticas: () => ({ ...estadisticas }),
        getEstadisticasJuego: () => ({ ...estadisticasJuego }),
        getVivo: () => vivo
    };
})();