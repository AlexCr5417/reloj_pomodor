//funciones formulario de configuracion
export const form_configuration = {
  open: () => {
    document.querySelector(".overlay").style.display = "flex";
    document.querySelector(".form_clock").style.display = "flex";
  },
  ocultar: () => {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".form_clock").style.display = "none";
  },
  reiniciar: () => {
    let container = document.querySelector(".container_cycles");
    container.innerHTML = `
  <div class="cycle_card" id="cycle_card_1">
                <input
                  class="cycle_card_title"
                  type="text"
                  name=""
                  id=""
                  value="Bloque 1"
                />
                <div class="cycle_card_timer">
                  <input
                    class="cycle_card_timer_content"
                    type="number"
                    name=""
                    id=""
                    min="0"
                    placeholder="horas"
                  />
                  <input
                    class="cycle_card_timer_content"
                    type="number"
                    name=""
                    id=""
                    min="0"
                    max="60"
                    placeholder="minutos"
                  />
                  <input
                    class="cycle_card_timer_content"
                    type="number"
                    name=""
                    id=""
                    min="0"
                    max="60"
                    placeholder="segundos"
                  />
                </div>
                <div class="cycle_card_options">:</div>
              </div>
  `;
  },
  guardar: () => {
    //data
    let repeats = Number(document.querySelector(".repeat_number").value);
    // Añado un nuevo dato para capturar el valor de la alarma
    let alarmaSelected = Number(
      document.querySelector("#alarm_mood")?.value || 2,
    );
    let cyclesOnSeconds = [];
    document.querySelectorAll(".cycle_card_timer").forEach((cycle, index) => {
      const timers = cycle.querySelectorAll(".cycle_card_timer_content");
      const hours = Number(timers[0].value);
      const minutes = Number(timers[1].value);
      const seconds = Number(timers[2].value);
      const result = hours * 3600 + minutes * 60 + seconds;
      cyclesOnSeconds.push(result);
    });

    //resultado
    let clock = {
      repeat: repeats,
      cycle: cyclesOnSeconds,
      alarmType: alarmaSelected,
    };
    localStorage.setItem("cycles", JSON.stringify(clock));
  },
  //funciones de el ciclo
  cycle: {
    new_card: () => {
      let container = document.querySelector(".container_cycles");
      let cards = container.querySelectorAll(".cycle_card");
      let lastCard = cards[cards.length - 1];
      let lastCardId = 0;
      if (cards.length > 0) {
        lastCardId = Number(lastCard.id.split("_")[2]);
      }

      let lastContent = lastCard.querySelectorAll(".cycle_card_timer_content");
      const hours = Number(lastContent[0].value);
      const minutes = Number(lastContent[1].value);
      const seconds = Number(lastContent[2].value);
      let lastTimer = hours + minutes + seconds;

      if (lastTimer <= 0) {
        console.log("el ultimo bloque no contiene niguna unidad de tiempo.");
      } else {
        //añadimos los valores faltantes a la ultima card
        if (hours <= 0) {
          lastContent[0].value = "00";
        }
        if (minutes <= 0) {
          lastContent[1].value = "00";
        }
        if (seconds <= 0) {
          lastContent[2].value = "00";
        }

        //inyeccion de la card en elk formulario
        container.insertAdjacentHTML(
          "beforeend",
          `
  <div class="cycle_card" id="cycle_card_${lastCardId + 1}">
                <input
                  class="cycle_card_title"
                  type="text"
                  name=""
                  id=""
                  value="Bloque ${lastCardId + 1}"
                />
                <div class="cycle_card_timer">
                  <input
                    class="cycle_card_timer_content"
                    type="number"
                    name=""
                    id=""
                    min="0"
                    placeholder="horas"
                  />
                  <input
                    class="cycle_card_timer_content"
                    type="number"
                    name=""
                    id=""
                    min="0"
                    max="60"
                    placeholder="minutos"
                  />
                  <input
                    class="cycle_card_timer_content"
                    type="number"
                    name=""
                    id=""
                    min="0"
                    max="60"
                    placeholder="segundos"
                  />
                </div>
                <div class="cycle_card_options">:</div>
              </div>
  `,
        );
      }
    },
  },
};

// EVENTOS DE INTERACTIVIDAD PARA LA ALARMA

//Se ejecutara automaticamente al arrastrar el control deslizandte
document.querySelector("#alarm_mood")?.addEventListener("input", (e) => {
  const valorNumerico = Number(e.target.value);

  //Aqui añadimos la logica visual
  document
    .querySelectorAll(".alarm_labels span")
    .forEach((s) => s.classList.remove("active_mood"));
  if (valorNumerico === 1) {
    document.querySelector("#label_zen").classList.add("active_mood");
  } else if (valorNumerico === 2) {
    document.querySelector("#label_active").classList.add("active_mood");
  } else if (valorNumerico === 3) {
    document.querySelector("#label_alert").classList.add("active_mood");
  }

  // Aqui añadimos la logica auditiva para que se oiga la alarma
  reproducirVistaPreviaAlarma(valorNumerico);
});

// Aqui voy a realizar una funcion interna para generar el sonido de prueba sin necesidad de ficheros externos
function reproducirVistaPreviaAlarma(tipo) {
  const audioCtx = new (window.AudioContext || window.WebkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (tipo === 1) {
    // Vista previa del modo Zen: sonido bajo, suave
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.4,
    );
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } else if (tipo === 2) {
    // Vista previa Activo: una campanada limpia e intermedia
    osc.type = "triangle";
    osc.frequency.setTargetAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.3,
    );
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } else if (tipo === 3) {
    // Vista previa Alerta: Un pulso estridente, corto y directo
    osc.type = "sawtooth";
    osc.frequency.setTargetAtTime(780, audioCtx.currentTime);
    gainNode.gain.setTargetAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.15,
    );
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }
}
