// animations.js - ADDS ANIMATIONS
FlyChart.prototype.animate = function(duration = 1000) {
  const originalDrawMethods = {
    bar: this.drawBarChart,
    line: this.drawLineChart
  };

  // Override draw methods with animations
  this.drawBarChart = function(data, options) {
    const startTime = Date.now();
    const { ctx } = this;
    const { width, height } = ctx.canvas;

    const animateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, width, height);

      // Create temporary data with animated values
      const animatedData = {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(value => value * progress)
        }))
      };

      originalDrawMethods.bar.call(this, animatedData, options);

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      }
    };

    animateFrame();
  };

  this.draw();
};