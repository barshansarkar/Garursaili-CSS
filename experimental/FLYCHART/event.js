// events.js - ADDS INTERACTIVITY
FlyChart.prototype.events = {};

FlyChart.prototype.on = function(eventName, callback) {
  if (!this.events[eventName]) {
    this.events[eventName] = [];
  }
  this.events[eventName].push(callback);
};

FlyChart.prototype.trigger = function(eventName, data) {
  if (this.events[eventName]) {
    this.events[eventName].forEach(callback => callback(data));
  }
};

// Add click detection for bar charts
const originalDrawBarChart = FlyChart.prototype.drawBarChart;
FlyChart.prototype.drawBarChart = function(data, options) {
  originalDrawBarChart.call(this, data, options);
  this.addBarClickHandlers(data);
};

FlyChart.prototype.addBarClickHandlers = function(data) {
  const canvas = this.ctx.canvas;
  const { width, height } = canvas;
  const barWidth = width / data.labels.length / 2;

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    data.datasets.forEach((dataset, datasetIndex) => {
      dataset.data.forEach((val, dataIndex) => {
        const barX = (dataIndex + 0.5) * (width / data.labels.length);
        const barY = height - val;

        if (x >= barX - barWidth / 2 && x <= barX + barWidth / 2 &&
            y >= barY && y <= height) {
          this.trigger('barClick', {
            datasetIndex,
            dataIndex,
            value: val,
            label: data.labels[dataIndex]
          });
        }
      });
    });
  });
};