// chart-types.js - EXTENDS CHART TYPES
FlyChart.chartTypes = {};

FlyChart.prototype.registerChartType = function(typeName, drawFunction) {
  FlyChart.chartTypes[typeName] = drawFunction;
};

// Override draw to support dynamic chart types
FlyChart.prototype.draw = function() {
  const { type, data, options } = this.config;

  if (FlyChart.chartTypes[type]) {
    FlyChart.chartTypes[type].call(this, data, options);
  } else {
    // Fall back to original switch statement
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
};

// Register new chart types
FlyChart.prototype.registerChartType("pie", function(data, options) {
  const { ctx } = this;
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  let total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  let startAngle = 0;

  data.datasets[0].data.forEach((value, i) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    ctx.fillStyle = this.getColor(i);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    startAngle += sliceAngle;
  });
});

// Helper method for colors
FlyChart.prototype.getColor = function(index) {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  return colors[index % colors.length];
};