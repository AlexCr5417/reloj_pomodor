import { secondsToHHMMSS } from "../utils/time.js";
import { swapButtons } from "../utils/dom.js";
import { cardEndCycle } from "./cardEndCycle.js";
let intervalo;
let timeClock;

export async function gestorReloj() {
  let data = JSON.parse(localStorage.getItem("cycles"));

  if (data) {
    //hacemos que cualquier otro reloj ejecutandose termine
    if (intervalo) {
      clearInterval(intervalo);
    }
    //ocultar el boton de iniciar y mostrar el boton de pausa
    swapButtons("#button_clock_iniciar", "#button_clock_pausar");

    let repeats = data.repeat;
    let cycles = data.cycle;
    let tipoAlarma = data.alarmType;
    let clockMain = document.querySelector(".clock_timer_main");

    //si no hay reloj para cambiar, dar un error.
    if (!clockMain)
      throw new Error("No se encontró el elemento .clock_timer_main");

    //corremos el reloj en bucle
    for (let repeat = 0; repeat < repeats; repeat++) {
      for (let cycle = 0; cycle < cycles.length; cycle++) {
        //esperamos a que el reloj termine
        await clock.run_timer(cycles[cycle], clockMain);

        if (cycle != cycles.length - 1) {
          //reiniciamos cualquier audio anterior
          Alarma.reiniciar();
          //Hacemos sonar el audio
          Alarma.ejecutar(tipoAlarma, document.body);
          //abrimos el mensaje de confirmacion
          cardEndCycle.open();
          //esperamos a que el usuario confirme que quiere continuar
          await cardEndCycle.confirmContinue();
          //hacemos que la alarama deje de sonar
          Alarma.reiniciar();
          //cermmas el mensaje de confirmacion
          cardEndCycle.close();
        }
      }
      if (repeat != repeats - 1) {
        //reiniciamos cualquier audio anterior
        Alarma.reiniciar();
        //Hacemos sonar el audio
        Alarma.ejecutar(tipoAlarma, document.body);
        cardEndCycle.open();
        await cardEndCycle.confirmContinue();
        //hacemos que la alarama deje de sonar
        Alarma.reiniciar();
        cardEndCycle.close();
      }
    }
    swapButtons("#button_clock_pausar", "#button_clock_iniciar"); //volvemos a mosta
  }
}

//funciones de el reloj
export const clock = {
  open_form: () => {
    document.querySelector(".overlay").style.display = "flex";
    document.querySelector(".form_clock").style.display = "flex";
  },
  stop: () => {
    clearInterval(intervalo);
    let clock_localStorage = {
      repeat: 0,
      cycle: [],
    };
    localStorage.setItem("cycles", JSON.stringify(clock_localStorage));
    let clock = document.querySelector(".clock_timer_main");
    clock.textContent = "00:00:00";
  },
  restart: () => {
    clearInterval(intervalo);
    swapButtons("#button_clock_pausar", "#button_clock_iniciar");
    gestorReloj();
  },
  pause: () => {
    clearInterval(intervalo);
    swapButtons("#button_clock_pausar", "#button_clock_iniciar");
  },
  continue: () => {
    return new Promise((resolve) => {
      elemtHtml.textContent = secondsToHHMMSS(timeClock); //para que no tarde un segundo en actualizar el reloj
      intervalo = setInterval(() => {
        timeClock--;
        if (timeClock <= 0) {
          clearInterval(intervalo);
          elemtHtml.textContent = `00:00:00`;
          resolve("termino");
        } else {
          elemtHtml.textContent = secondsToHHMMSS(timeClock);
        }
      }, 1000);
    });
  },
  run_timer: (seconds, elemtHtml) => {
    return new Promise((resolve) => {
      timeClock = seconds;

      elemtHtml.textContent = secondsToHHMMSS(timeClock); //para que no tarde un segundo en actualizar el reloj
      intervalo = setInterval(() => {
        timeClock--;
        if (timeClock <= 0) {
          clearInterval(intervalo);
          elemtHtml.textContent = `00:00:00`;
          resolve("termino");
        } else {
          elemtHtml.textContent = secondsToHHMMSS(timeClock);
        }
      }, 1000);
    });
  },
};

// Instancias de los archivos MP3
export const pistasAlarma = {
  1: {
    audio: new Audio("./sounds/zen.mp3"),
    clase: "flash-zen",
    tiempo: 4000,
  },
  2: {
    audio: new Audio("./sounds/normal.mp3"),
    clase: null,
    tiempo: null,
  },
  3: {
    audio: new Audio("./sounds/fuerte.mp3"),
    clase: "flash-alert",
    tiempo: 2500,
  },
};

export const Alarma = {
  // Aqui abajo añadimos una funcion asistente/coopera a la que ya esta realizando el conteo hacia atras que se encargara
  // de añadir el audio de la alarma
  ejecutar: (tipo = 2, elementoBody) => {
    const audioSeleccionado = pistasAlarma[tipo];

    //verificamos que la alarma exista
    if (!audioSeleccionado)
      throw new Error(
        "El audio que intentas reproducir no existe en la base de datos.",
      );
    // Reproduciremos el archivo mp3
    audioSeleccionado.audio.play().catch((error) => {
      console.log(
        "La reproduccion de audio fue bloqueada por el navegador hasta una interaccion del usuario. ",
        error,
      );
    });

    //ejecutamos los efectos en el dom y despues de un tiempo lo quitamos.
    const clase = audioSeleccionado.clase;
    const tiempo = audioSeleccionado.tiempo;
    if (clase) {
      elementoBody.classList.add(clase);
      setTimeout(() => elementoBody.classList.remove(clase), tiempo);
    }
  },
  habilitarAudios: () => {
    Object.values(pistasAlarma).forEach((element) => {
      element.audio
        .play()
        .then(() => {
          element.audio.pause();
          element.audio.currentTime = 0;
        })
        .catch((e) =>
          console.log("Audios listos para reproducirse mas tarde."),
        );
    });
  },
  reiniciar: () => {
    // Reseteamos cualquier pista de audio la cual estubiera sonando previamente
    Object.values(pistasAlarma).forEach((element) => {
      element.audio.pause(); // Aqui detenemos la pista de audio
      element.audio.currentTime = 0;
    });
  },
  asignarAudio: () => {},
};
