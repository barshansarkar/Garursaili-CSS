// data-processor.js - ADDS DATA TRANSFORMATIONS
FlyChart.dataProcessors = {};

FlyChart.prototype.registerDataProcessor = function(name, processor) {
  FlyChart.dataProcessors[name] = processor;
};

FlyChart.prototype.processData = function(processorName) {
  if (FlyChart.dataProcessors[processorName]) {
    this.config.data = FlyChart.dataProcessors[processorName](this.config.data);
    this.draw();
  }
};

// Register data processors
FlyChart.prototype.registerDataProcessor('normalize', function(data) {
  const max = Math.max(...data.datasets[0].data);
  return {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.map(value => (value / max) * 100)
    }))
  };
});

FlyChart.prototype.registerDataProcessor('sort', function(data) {
  const sortedIndices = data.datasets[0].data
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .map(item => item.index);

  return {
    labels: sortedIndices.map(i => data.labels[i]),
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      data: sortedIndices.map(i => dataset.data[i])
    }))
  };
});