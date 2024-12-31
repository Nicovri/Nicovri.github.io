import { getState, setState, filterByRow, resetFilteredRow } from "./index.js";

function loadSVG(url, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((svgText) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      callback(svgElement);
    })
    .catch((error) => console.error("Error loading SVG:", error));
}

function initializeMap() {
  const state = getState();

  let tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);
  }

  const regions = document.querySelectorAll(".region");

  // Check if filteredRow has values and update region classes
  if (state.params.filteredRow && state.params.filteredRow.length > 0) {
    regions.forEach((region) => {
      const city = region.id;
      if (state.params.filteredRow.includes(city)) {
        region.classList.add("region-selected");
        region.classList.remove("region-disabled");
      } else {
        region.classList.add("region-disabled");
        region.classList.remove("region-selected");
      }
    });
  } else {
    regions.forEach((region) => {
      region.classList.remove("region-selected", "region-disabled");
    });
  }

  regions.forEach((region) => {
    region.addEventListener("mouseover", (e) => {
      const city = e.target.id;
      const stats = state.originalData.find((item) => item.region === city);
      console.log(stats);

      if (stats) {
        tooltip.style.display = "block";
        let tooltipContent = `<strong style="font-size: 16px;">${city.toUpperCase()}</strong><br>`;
        Object.keys(stats).forEach((key) => {
          if (key !== "region") {
            tooltipContent += `${stats[key].label}: ${stats[key].value}<br>`;
          }
        });
        tooltip.innerHTML = tooltipContent;
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.classList.add("visible");
      }
    });
    region.addEventListener("mouseout", () => {
      tooltip.classList.remove("visible");
    });
    region.addEventListener("click", (e) => {
      const city = e.target.id;
      if (state.params.filteredRow.includes(city)) {
        resetFilteredRow();
      } else {
        const stats = state.originalData.find((item) => item.region === city);
        if (stats) {
          if (region.classList.contains("region-disabled")) {
            resetFilteredRow();
          }
          setState({
            params: { ...state.params, filteredRow: [city, "Norge"] },
          });
          filterByRow();
        }
      }
    });
  });
}

export function renderMap() {
  loadSVG("./norway.svg", (svgElement) => {
    const mapContainer = document.querySelector(".map-container");
    mapContainer.innerHTML = "";
    mapContainer.appendChild(svgElement);
    initializeMap();
  });
}
