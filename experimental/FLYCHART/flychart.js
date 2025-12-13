// chart.js
class FlyChart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.draw();
  }

  draw() {
    const { type, data, options } = this.config;

    switch (type) {
      case "bar":
        this.drawBarChart(data, options);
        break;
      case "line":
        this.drawLineChart(data, options);
        break;
      default:
        console.warn(`Chart type "${type}" not supported`);
    }
  }

  drawBarChart(data, options) {
    const { ctx } = this;
    const { labels, datasets } = data;
    const { width, height } = ctx.canvas;
    const barWidth = width / labels.length / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";

    datasets.forEach((dataset, i) => {
      ctx.fillStyle = dataset.backgroundColor || "#007bff";
      dataset.data.forEach((val, j) => {
        const x = (j + 0.5) * (width / labels.length);
        const y = height - val;
        ctx.fillRect(x - barWidth / 2, y, barWidth, val);
        ctx.fillText(labels[j], x, height - 5);
      });
    });
  }

  drawLineChart(data, options) {
    const { ctx } = this;
    const { labels, datasets } = data;
    const { width, height } = ctx.canvas;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;

    datasets.forEach(dataset => {
      ctx.beginPath();
      dataset.data.forEach((val, i) => {
        const x = (i + 1) * (width / (labels.length + 1));
        const y = height - val;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }
}

// global helper
function createFlyChart(canvasId, config) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  return new FlyChart(ctx, config);
}

window.FlyChart = FlyChart;
window.createFlyChart = createFlyChart;
