function createWhiteHat(rawData) {
  const data = d3
    .rollups(
      rawData,
      (d) => d.length,
      (d) => {
        let c_gender = d.complainant_gender;
        if (c_gender === "") {
          c_gender = "Not described";
        }

        let m_gender = d.mos_gender;
        if (m_gender === "M") {
          m_gender = "Male Officer";
        } else if (m_gender === "F") {
          m_gender = "Female Officer";
        }

        return `${c_gender} -> ${m_gender}`;
      },
    )
    .sort(([_x, x], [_y, y]) => d3.descending(x, y));
  console.log(data);

  const margin = { top: 80, right: 60, bottom: 140, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select("#white-hat")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand(
      data.map(([k, _]) => k),
      [0, width],
    )
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  const y = d3.scaleLinear([0, d3.max(data, ([_, v]) => v)], [height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("barz")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", ([k, _]) => x(k))
    .attr("y", ([_, v]) => y(v))
    .attr("width", x.bandwidth())
    .attr("height", ([_, v]) => height - y(v))
    .attr("fill", "#4e6bba")
    .on("mouseover", function (event, [_, v]) {
      d3.select("#tooltip")
        .style("display", "block")
        .html(
          `<strong>Number of complaints: ${v}</strong>`
        )
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 28 + "px");
      d3.select(this)
        .style("strong", "black")
        .style("stroke-width", "4px");
    })
    .on("mouseout", function (event, d) {
      d3.select("#tooltip").style("display", "none");
      d3.select(this).style("stroke", "none");
    });
}

function createBlackHat(data) {
  const margin = { top: 80, right: 60, bottom: 60, left: 100 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // const d = data.
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
