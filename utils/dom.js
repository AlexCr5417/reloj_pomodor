export function swapButtons(hide, show) {
  document.querySelector(hide).style.display = "none";
  document.querySelector(show).style.display = "flex";
}
export function changeText(elemtHtml, content){
  document.querySelector(elemtHtml).textContent = content;
}