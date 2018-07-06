let samples = new Array(20).fill(0)


samples = samples
  .map(() => Math.random().toString(36).substr(2, Math.max(3, Math.floor(Math.random() * 10))))
  