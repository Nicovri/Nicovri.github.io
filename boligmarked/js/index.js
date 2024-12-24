import { renderTable } from "./table.js";
import { renderGraph } from "./graph.js";
import { renderAccordion } from "./accordion.js";

let state = {
  data: [],
  sort: {
    index: 0, // Index of the column being sorted
    order: "asc", // Sorting order: 'asc' or 'desc'
  },
  // Add other state properties as needed
};

export function setState(newState) {
  state = { ...state, ...newState };
  renderAll();
}

export function getState() {
  return state;
}

function renderAll() {
  renderTable();
  renderGraph();
  renderAccordion();
}

fetch("boligprisstatistikk.json")
  .then((response) => response.json())
  .then((data) => {
    const transformedData = Object.keys(data).map((region) => ({
      region,
      endring_siste_maaned: {
        label: "Endring siste måned (%)",
        value: data[region]["Endring siste måned"],
      },
      endring_sesongjustert_siste_maaned: {
        label: "Endring sesongjustert siste måned (%)",
        value: data[region]["Endring sesongjustert siste måned"],
      },
      endring_hittil_i_aar: {
        label: "Endring hittil i år (%)",
        value: parseFloat(data[region]["Endring hittil i år"]),
      },
      endring_siste_aar: {
        label: "Endring siste år (%)",
        value: data[region]["Endring siste år"],
      },
      endring_siste_5_aar: {
        label: "Endring siste 5 år (%)",
        value: data[region]["Endring siste 5 år"],
      },
      endring_siste_10_aar: {
        label: "Endring siste 10 år (%)",
        value: data[region]["Endring siste 10 år"],
      },
      gjennomsnitt_kvm_pris: {
        label: "Gjennomsnitt kvm. pris (kr)",
        value: data[region]["Gjennomsnitt kvm. pris"],
      },
      gjennomsnitt_pris: {
        label: "Gjennomsnittspris (kr)",
        value: data[region]["Gjennomsnittspris"],
      },
    }));

    setState({ data: transformedData });
  })
  .catch((error) => console.error("Error fetching data:", error));
