import { getState, setState } from "./index.js";

export function renderTable() {
  const state = getState();
  const contentDiv = document.getElementById("content");
  let html = "<table>";

  // Create table header
  html += "<thead><tr>";
  Object.keys(state.data[0]).forEach((key, index) => {
    let sortClass = "";
    if (state.params.sort.index === index) {
      sortClass = state.params.sort.order === "asc" ? "sort-asc" : "sort-desc";
    }
    if (key !== "region") {
      html += `<th class="${sortClass}">${state.data[0][key].label}</th>`;
    } else {
      html += `<th class="${sortClass}">Region</th>`;
    }
  });
  html += "</tr></thead>";

  // Create table body
  html += "<tbody>";
  state.data.forEach((item) => {
    const rowClass = item.region === "Norge" ? "highlight" : "";
    html += `<tr class="${rowClass}">
                    <td>${item.region}</td>`;
    Object.keys(item).forEach((key) => {
      if (key !== "region") {
        html += `<td>${item[key].value}</td>`;
      }
    });
    html += "</tr>";
  });
  html += "</tbody>";

  html += "</table>";
  contentDiv.innerHTML = html;

  document.querySelectorAll("th").forEach((header, index) => {
    header.addEventListener("click", () => {
      sortTableAndGraph(index, header);
    });
  });
}

function sortData(data, columnIndex, isAscending) {
  const direction = isAscending ? -1 : 1;

  const sortedData = [...data].sort((a, b) => {
    const aValue =
      columnIndex === 0 ? a.region : Object.values(a)[columnIndex].value;
    const bValue =
      columnIndex === 0 ? b.region : Object.values(b)[columnIndex].value;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction;
    } else {
      return (
        aValue.localeCompare(bValue, undefined, { numeric: true }) * direction
      );
    }
  });

  return sortedData;
}

function sortTableAndGraph(columnIndex, header) {
  const state = getState();

  const isAscending =
    state.params.sort.index === columnIndex &&
    state.params.sort.order === "asc";
  const newOrder = isAscending ? "desc" : "asc";

  // Remove sorting classes from all headers
  document.querySelectorAll("th").forEach((th) => {
    th.classList.remove("sort-asc", "sort-desc");
  });

  header.classList.toggle("sort-asc", !isAscending);
  header.classList.toggle("sort-desc", isAscending);

  const sortedData = sortData(state.data, columnIndex, !isAscending);

  setState({
    data: sortedData,
    params: { ...state.params, sort: { index: columnIndex, order: newOrder } },
  });
}
