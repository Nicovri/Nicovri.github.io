import { getState, setState } from "./index.js";

export function renderGraph() {
  const state = getState();
  // Draw the chart
  const canvas = document.getElementById("myChart");
  const ctx = canvas.getContext("2d");

  const defaultKey = "endring_siste_aar";
  const selectedKey = state.params.filteredCol || defaultKey;

  const chartData = {
    labels: state.data.map((item) => item.region),
    datasets: [
      {
        label:
          state.data.length > 0 ? state.data[0][selectedKey].label : "Data",
        data: state.data.map((item) => item[selectedKey].value),
        backgroundColor: state.data.map((item) =>
          item.region === "Norge"
            ? "rgba(255, 99, 132, 0.2)"
            : "rgb(76, 175, 80, 0.2)"
        ),
        borderColor: state.data.map((item) =>
          item.region === "Norge"
            ? "rgba(255, 99, 132, 1)"
            : "rgb(76, 175, 80, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const drawChart = (ctx, chartData) => {
    const { labels, datasets } = chartData;
    const { data, backgroundColor, borderColor, borderWidth } = datasets[0];

    const maxDataValue = Math.max(...data);
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const barWidth = canvasWidth / labels.length;
    const titleHeight = 30;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const title = datasets[0].label;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "20px Arial";
    ctx.fillText(title, canvasWidth / 2, 10);

    labels.forEach((label, index) => {
      const barHeight =
        (data[index] / maxDataValue) * (canvasHeight - titleHeight - 20);
      const x = index * barWidth;
      const y = canvasHeight - barHeight;

      ctx.fillStyle = backgroundColor[index];
      ctx.fillRect(x, y, barWidth - 10, barHeight);

      ctx.strokeStyle = borderColor[index];
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(x, y, barWidth - 10, barHeight);

      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(label, x + (barWidth - 10) / 2, canvasHeight - 5);
    });
  };

  drawChart(ctx, chartData);

  // Add interactivity
  let tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);
  }

  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const barWidth = canvas.width / chartData.labels.length;
    const barIndex = Math.floor(x / barWidth);

    if (barIndex >= 0 && barIndex < chartData.labels.length) {
      const label = chartData.labels[barIndex];
      const value = chartData.datasets[0].data[barIndex];
      const barHeight =
        (value / Math.max(...chartData.datasets[0].data)) *
        (canvas.height - 20);
      const barY = canvas.height - barHeight;

      if (y >= barY && y <= canvas.height) {
        tooltip.innerHTML = `${label}: ${value}`;
        tooltip.style.left = `${event.clientX + 10 + window.scrollX}px`;
        tooltip.style.top = `${event.clientY - 25 + window.scrollY}px`;
        tooltip.classList.add("visible");
      } else {
        tooltip.classList.remove("visible");
      }
    } else {
      tooltip.classList.remove("visible");
    }
  });

  canvas.addEventListener("mouseleave", () => {
    tooltip.classList.remove("visible");
  });
}
