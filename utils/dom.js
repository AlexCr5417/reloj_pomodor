export function swapButtons(hide, show) {
  document.querySelector(hide).style.display = "none";
  document.querySelector(show).style.display = "flex";
}
