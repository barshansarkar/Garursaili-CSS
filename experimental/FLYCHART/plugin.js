// plugins.js - EXTENDS WITHOUT MODIFYING ORIGINAL
FlyChart.plugins = [];

FlyChart.prototype.registerPlugin = function(plugin) {
  if (typeof plugin.beforeDraw === 'function') {
    FlyChart.plugins.push(plugin);
  }
};

// Override draw method to support plugins
const originalDraw = FlyChart.prototype.draw;
FlyChart.prototype.draw = function() {
  // Execute beforeDraw hooks
  FlyChart.plugins.forEach(plugin => {
    if (plugin.beforeDraw) plugin.beforeDraw(this.ctx, this.config);
  });

  originalDraw.call(this);

  // Execute afterDraw hooks
  FlyChart.plugins.forEach(plugin => {
    if (plugin.afterDraw) plugin.afterDraw(this.ctx, this.config);
  });
};

// Example plugin: Grid Lines
const gridPlugin = {
  beforeDraw: function(ctx, config) {
    const { width, height } = ctx.canvas;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;

    // Draw vertical grid lines
    for (let x = 0; x <= width; x += width / 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += height / 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
};