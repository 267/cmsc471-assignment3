function createWhiteHat(data) {
  const margin = { top: 80, right: 60, bottom: 60, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select("#white-hat")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
}

function createBlackHat(data) {
  const margin = { top: 80, right: 60, bottom: 60, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select("#black-hat")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
}

function init() {
  d3.csv("data/allegations.csv")
    .then((data) => {
      createWhiteHat(data);
      createBlackHat(data);
    })
    .catch((error) => console.error("Error loading data:", error));
}

window.addEventListener("load", init);
