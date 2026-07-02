//funciones formulario de configuracion
export function ocultar_configuracion() {
  let form_clock = document.querySelector(".overlay");
  form_clock.style.display = "none";
}
export function reiniciar_configuracion() {
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
}
export function save_form_configuration() {
  //data
  let repeats = Number(document.querySelector(".repeat_number").value);
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
  };
  localStorage.setItem("cycles", JSON.stringify(clock));
}
export function newCard_CycleContainer() {
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
}
