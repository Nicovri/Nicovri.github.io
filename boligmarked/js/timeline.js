import { getState, setState, resetFilteredCol, filterByCol } from "./index.js";

export function renderTimeline() {
  const state = getState();
  const timelineContainer = document.querySelector(".timeline");

  timelineContainer.innerHTML = "";

  const periods = [
    { label: "Siste 10 år", key: "endring_siste_10_aar" },
    { label: "Siste 5 år", key: "endring_siste_5_aar" },
    { label: "Siste år", key: "endring_siste_aar" },
    { label: "Hittil i år", key: "endring_hittil_i_aar" },
    { label: "Siste måned", key: "endring_siste_maaned" },
  ];

  periods.forEach((period) => {
    if (
      state.params.filteredCol === "" ||
      period.key === state.params.filteredCol
    ) {
      const event = document.createElement("div");
      event.className = "timeline-event";

      event.addEventListener("click", () => {
        if (timelineContainer.classList.contains("filteredCol")) {
          resetFilteredCol();
          timelineContainer.classList.remove("filteredCol");
        } else {
          state.params.filteredCol = period.key;
          filterByCol();
          timelineContainer.classList.add("filteredCol");
        }
      });

      let eventContent = `<h4>${period.label}</h4>`;
      state.data.forEach((item) => {
        eventContent += `<p><strong class="${
          item.region === "Norge" ? "event-norge" : ""
        }">${item.region}:</strong> ${item[period.key].value} %</p>`;
      });

      event.innerHTML = eventContent;
      timelineContainer.appendChild(event);
    }
  });
}
