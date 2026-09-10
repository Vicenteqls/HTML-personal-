"use strict";

// Referencias a elementos del DOM

const btnTema = document.querySelector("#btnTema");
const btnEstiloVidrio = document.querySelector("#btnEstiloVidrio");
const avatar = document.querySelector("#avatar");
const nombrePerfil = document.querySelector("#nombrePerfil");
const buscador = document.querySelector("#buscador");

// 1. Botón para alternar entre tema claro y oscuro.

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");

    const oscuro = document.body.classList.contains("oscuro");

    btnTema.textContent = oscuro ? "Tema claro" : "Tema oscuro";

    if (musicaActivada) {
        reproducirPistaAleatoria();
    }
});

// 2. Botón para alternar entre el estilo Aero Glass y el estilo Liquid Glass.

btnEstiloVidrio.addEventListener("click", () => {
    document.body.classList.toggle("liquido");

    const liquido = document.body.classList.contains("liquido");

    btnEstiloVidrio.textContent = liquido ? "Estilo: Liquid Glass" : "Estilo: Aero Glass";
});

// 3. Música ambiental: cada tema tiene su propia carpeta OST y las pistas se eligen al azar.

const musicaFondo = document.querySelector("#musicaFondo");
const btnMusica = document.querySelector("#btnMusica");
const pistaActual = document.querySelector("#pistaActual");

const pistasTemaClaro = [
    "ost de la tienda tema claro/John Tay - [Alternate] Sandopolis Act 1 (YM2612  SN76489).mp3",
    "ost de la tienda tema claro/Rayman Raving Rabbids - Hip Hop Hooray.mp3",
    "ost de la tienda tema claro/Blood on the Dance Floor.mp3"
];

const pistasTemaOscuro = [
    "ost de la tienda tema oscuro/John Tay - [Alternate] Hidden Palace Zone (YM2612  SN76489).mp3",
    "ost de la tienda tema oscuro/Donkey Kong Country 2 - Forest Interlude [Restored] Extended.mp3",
    "ost de la tienda tema oscuro/Wolfgang Amadeus Mozart - Piano Concerto No. 21 - Andante.mp3"
];

let musicaActivada = false;
let ultimaPista = "";

function obtenerListaSegunTema() {
    return document.body.classList.contains("oscuro") ? pistasTemaOscuro : pistasTemaClaro;
}

function elegirPistaAleatoria(lista) {
    if (lista.length === 1) {
        return lista[0];
    }

    let pista;
    do {
        pista = lista[Math.floor(Math.random() * lista.length)];
    } while (pista === ultimaPista);

    return pista;
}

function nombrePista(rutaPista) {
    const archivo = rutaPista.split("/").pop();
    return archivo.replace(".mp3", "");
}

function reproducirPistaAleatoria() {
    const lista = obtenerListaSegunTema();
    const pista = elegirPistaAleatoria(lista);
    ultimaPista = pista;

    musicaFondo.src = encodeURI(pista);
    pistaActual.textContent = `♪ ${nombrePista(pista)}`;

    musicaFondo.play().catch(() => {
        // Algunos navegadores bloquean la reproducción automática sin interacción previa del usuario.
    });
}

musicaFondo.addEventListener("ended", reproducirPistaAleatoria);

btnMusica.addEventListener("click", () => {
    musicaActivada = !musicaActivada;

    if (musicaActivada) {
        reproducirPistaAleatoria();
        btnMusica.textContent = "🔇 Pausar música";
        btnMusica.setAttribute("aria-pressed", "true");
    } else {
        musicaFondo.pause();
        btnMusica.textContent = "🔊 Reproducir música";
        btnMusica.setAttribute("aria-pressed", "false");
        pistaActual.textContent = "";
    }
});

// 4. Easter eggs: cada uno tiene su imagen y su pista de audio propia.

const easterEggOverlay = document.querySelector("#easterEggOverlay");
const easterEggImagen = document.querySelector("#easterEggImagen");
const easterEggTexto = document.querySelector("#easterEggTexto");
const easterEggAudio = document.querySelector("#easterEggAudio");
const cerrarEasterEgg = document.querySelector("#cerrarEasterEgg");

const easterEggs = {
    rice: {
        imagen: "Easter egg/rice.jpg",
        audio: "ost del Easter egg/rice.mp3",
        texto: "Encontraste el easter egg escribiendo \"rice\" en la terminal."
    },
    oguri: {
        imagen: "Easter egg/oguri.jpg",
        audio: "ost del Easter egg/oguri.mp3",
        texto: "Encontraste el easter egg haciendo clic en el nombre."
    },
    gatoctm: {
        imagen: "Easter egg/gatoctm.jpg",
        audio: "ost del Easter egg/gatoctm.mp3",
        texto: "Encontraste el easter egg haciendo clic en la foto de perfil."
    }
};

let musicaEstabaActivaAntesDelEgg = false;

function mostrarEasterEgg(nombre) {
    const egg = easterEggs[nombre];

    if (!egg) {
        return;
    }

    musicaEstabaActivaAntesDelEgg = musicaActivada && !musicaFondo.paused;
    musicaFondo.pause();

    easterEggImagen.src = encodeURI(egg.imagen);
    easterEggImagen.alt = nombre;
    easterEggTexto.textContent = egg.texto;

    easterEggAudio.src = encodeURI(egg.audio);
    easterEggAudio.currentTime = 0;
    easterEggAudio.play().catch(() => {});

    easterEggOverlay.hidden = false;
}

function ocultarEasterEgg() {
    easterEggOverlay.hidden = true;

    easterEggAudio.pause();
    easterEggAudio.currentTime = 0;

    if (musicaEstabaActivaAntesDelEgg) {
        musicaFondo.play().catch(() => {});
    }
}

cerrarEasterEgg.addEventListener("click", ocultarEasterEgg);

easterEggOverlay.addEventListener("click", evento => {
    if (evento.target === easterEggOverlay) {
        ocultarEasterEgg();
    }
});

// Easter egg "rice": se activa al escribir exactamente "rice" en la terminal.
buscador.addEventListener("input", () => {
    if (buscador.value.trim().toLowerCase() === "rice") {
        mostrarEasterEgg("rice");
    }
});

// Easter egg "oguri": se activa al hacer clic en el nombre.
nombrePerfil.addEventListener("click", () => {
    mostrarEasterEgg("oguri");
});

// Easter egg "gatoctm": se activa al hacer clic en la foto de perfil.
avatar.addEventListener("click", () => {
    mostrarEasterEgg("gatoctm");
});

// 5. Botón "cerrar": reproduce un video y, al terminar, simula un kernel panic.

const btnCerrarVentana = document.querySelector("#btnCerrarVentana");
const cierreOverlay = document.querySelector("#cierreOverlay");
const videoCierre = document.querySelector("#videoCierre");
const kernelPanicOverlay = document.querySelector("#kernelPanicOverlay");
const kernelPanicAyuda = document.querySelector("#kernelPanicAyuda");

btnCerrarVentana.addEventListener("click", () => {
    musicaFondo.pause();
    easterEggAudio.pause();
    easterEggOverlay.hidden = true;

    cierreOverlay.hidden = false;

    videoCierre.currentTime = 0;
    videoCierre.play().catch(() => {});
});

videoCierre.addEventListener("ended", () => {
    cierreOverlay.hidden = true;
    provocarKernelPanic();
});

function provocarKernelPanic() {
    kernelPanicAyuda.hidden = true;
    kernelPanicOverlay.classList.remove("se-puede-cerrar");
    kernelPanicOverlay.hidden = false;

    setTimeout(() => {
        kernelPanicAyuda.hidden = false;
        kernelPanicOverlay.classList.add("se-puede-cerrar");
    }, 4000);
}

kernelPanicOverlay.addEventListener("click", () => {
    if (kernelPanicOverlay.classList.contains("se-puede-cerrar")) {
        kernelPanicOverlay.hidden = true;
    }
});

console.log("JavaScript cargado correctamente");
