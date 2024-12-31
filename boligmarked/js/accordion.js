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

    Object.keys(item).forEach((key) => {
      if (key !== "region") {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${item[key].label}:</strong> ${
          item[key].value
        } ${key.includes("pris") ? "kr" : "%"}`;
        div.appendChild(p);
      }
    });

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
