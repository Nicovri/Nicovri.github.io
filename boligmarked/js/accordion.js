import { getState, setState } from "./index.js";

export function renderAccordion() {
  const state = getState();

  const accordion = document.getElementById("accordion");
  accordion.innerHTML = "";

  state.data.forEach((item) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = item.region;

    const div = document.createElement("div");
    div.innerHTML = `
        <p>Endring siste måned: ${item.endring_siste_maaned.value} %</p>
        <p>Endring sesongjustert siste måned: ${item.endring_sesongjustert_siste_maaned.value} %</p>
        <p>Endring hittil i år: ${item.endring_hittil_i_aar.value} %</p>
        <p>Endring siste år: ${item.endring_siste_aar.value} %</p>
        <p>Endring siste 5 år: ${item.endring_siste_5_aar.value} %</p>
        <p>Endring siste 10 år: ${item.endring_siste_10_aar.value} %</p>
        <p>Gjennomsnitt kvm. pris: ${item.gjennomsnitt_kvm_pris.value} kr</p>
        <p>Gjennomsnittspris: ${item.gjennomsnitt_pris.value} kr</p>
        `;
    details.appendChild(summary);
    details.appendChild(div);
    accordion.appendChild(details);

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const openDetails = accordion.querySelector("details[open]");
      if (openDetails && openDetails !== details) {
        openDetails.removeAttribute("open");
        openDetails.querySelector("div").style.maxHeight = null;
      }

      if (details.hasAttribute("open")) {
        details.removeAttribute("open");
        div.style.maxHeight = null;
      } else {
        details.setAttribute("open", "");
        div.style.maxHeight = div.scrollHeight + "px";
        requestAnimationFrame(() => {
          div.style.maxHeight = div.scrollHeight + "px";
        });
      }
    });
  });
}
