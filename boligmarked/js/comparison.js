import { getState, setState, resetFilteredRow } from "./index.js";

export function renderComparison() {
  const state = getState();
  const comparisonChoice = document.getElementById("comparisonChoice");
  const comparisonContainer = document.getElementById("comparisonContainer");

  comparisonChoice.innerHTML = "";
  comparisonContainer.innerHTML = "";

  const citySelect1 = document.createElement("select");
  citySelect1.id = "citySelect1";
  const citySelect2 = document.createElement("select");
  citySelect2.id = "citySelect2";
  const compareButton = document.createElement("button");
  compareButton.id = "compareCities";
  compareButton.textContent = "Compare";
  const resetButton = document.createElement("button");
  resetButton.id = "resetComparison";
  resetButton.textContent = "Reset";

  const defaultOption1 = document.createElement("option");
  defaultOption1.value = "";
  defaultOption1.textContent = "Select Region 1";
  citySelect1.appendChild(defaultOption1);

  const defaultOption2 = document.createElement("option");
  defaultOption2.value = "";
  defaultOption2.textContent = "Select Region 2";
  citySelect2.appendChild(defaultOption2);

  state.data.forEach((item) => {
    const option1 = document.createElement("option");
    option1.value = item.region;
    option1.textContent = item.region;
    citySelect1.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = item.region;
    option2.textContent = item.region;
    citySelect2.appendChild(option2);
  });

  comparisonChoice.appendChild(citySelect1);
  comparisonChoice.appendChild(citySelect2);
  comparisonChoice.appendChild(compareButton);
  comparisonChoice.appendChild(resetButton);

  if (state.params.filteredRow && state.params.filteredRow.length === 2) {
    citySelect1.value = state.params.filteredRow[0];
    citySelect2.value = state.params.filteredRow[1];
    filterComparison(false);
  }

  compareButton.addEventListener("click", () => {
    const region1 = citySelect1.value;
    const region2 = citySelect2.value;

    if (region1 && region2 && region1 !== region2) {
      setState({
        params: { ...state.params, filteredRow: [region1, region2] },
      });
      filterComparison(true);
    }
  });

  resetButton.addEventListener("click", () => {
    resetComparison();
  });
}

function filterComparison(setStateFlag) {
  const state = getState();
  const comparisonContainer = document.getElementById("comparisonContainer");
  const filteredRegions = state.params.filteredRow;

  if (filteredRegions && filteredRegions.length === 2) {
    const filteredData = state.data.filter((item) =>
      filteredRegions.includes(item.region)
    );

    if (setStateFlag) {
      setState({ data: filteredData });
    }

    comparisonContainer.innerHTML = "";

    const region1Data = filteredData.find(
      (item) => item.region === filteredRegions[0]
    );
    const region2Data = filteredData.find(
      (item) => item.region === filteredRegions[1]
    );

    const createCard = (region, data) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${region}</h3>`;
      Object.keys(data).forEach((key) => {
        if (key !== "region") {
          card.innerHTML += `<p>${data[key].label}: ${data[key].value}</p>`;
        }
      });
      return card;
    };

    comparisonContainer.appendChild(
      createCard(filteredRegions[0], region1Data)
    );
    comparisonContainer.appendChild(
      createCard(filteredRegions[1], region2Data)
    );
  }
}

function resetComparison() {
  resetFilteredRow();
}
