import { renderTable } from "./table.js";
import { renderGraph } from "./graph.js";
import { renderAccordion } from "./accordion.js";
import { renderTimeline } from "./timeline.js";
import { renderComparison } from "./comparison.js";
import { renderMap } from "./map.js";

let state = {};
resetState();

export function setState(newState) {
  state = { ...state, ...newState };
  renderAll();
}

export function getState() {
  return state;
}

export function resetState() {
  state.data = [];
  state.originalData = [];
  state.params = {
    sort: {
      index: -1, // Index of the column being sorted
      order: "", // Sorting order: 'asc' or 'desc'
    },
    filteredCol: "", // Filter string for timeline
    filteredRow: [], // Filters for comparison
  };
  // Add other state properties as needed

  fetchData();
}

export function resetFilteredCol() {
  state.params.filteredCol = "";
  state.data = state.originalData;
  filterByRow();
}

export function resetFilteredRow() {
  state.params.filteredRow = [];
  state.data = state.originalData;
  filterByCol();
}

function fetchData() {
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

      setState({ data: transformedData, originalData: transformedData });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderAll() {
  renderTable();
  renderGraph();
  renderAccordion();
  renderTimeline();
  renderComparison();
  renderMap();
}

export function filterByCol() {
  if (state.params.filteredCol.length === 0) {
    setState(state);
    return;
  }
  const filteredData = state.data.map((item) => ({
    region: item.region,
    [state.params.filteredCol]: item[state.params.filteredCol],
  }));
  setState({ data: filteredData });
}

export function filterByRow() {
  if (state.params.filteredRow.length === 0) {
    setState(state);
    return;
  }
  const filteredData = state.data.filter((item) =>
    state.params.filteredRow.includes(item.region)
  );
  setState({ data: filteredData });
}
