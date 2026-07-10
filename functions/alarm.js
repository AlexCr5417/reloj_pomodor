// Instancias de los archivos MP3
export const pistasAlarma = {
  1: {
    audio: new Audio("./assets/sounds/zen.mp3"),
    clase: "flash-zen",
    tiempo: 4000,
  },
  2: {
    audio: new Audio("./assets/sounds/ringtones-bojack-openingcredit.mp3"),
    clase: null,
    tiempo: null,
  },
  3: {
    audio: new Audio("./assets/sounds/fuerte.mp3"),
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
    audioSeleccionado.audio.loop = true;
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
};
