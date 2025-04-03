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
      (d) => d.rank_incident,
    )
    .map(([genders, ranks]) => ({
      genders,
      ranks: ranks.sort(([_x, x], [_y, y]) => d3.descending(x, y)),
      total: ranks.reduce((acc, [_, x]) => acc + x, 0),
    }))
    .sort((x, y) => d3.descending(x.total, y.total));
  console.log(data);

  const margin = { top: 80, right: 60, bottom: 160, left: 100 };
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
      data.map((d) => d.genders),
      [0, width]
    )
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  const y = d3.scaleLinear([0, d3.max(data, (d) => d.total)], [height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -50)
    .text("Police Officer Allegations in New York")
    .style("fill", "#555555")
    .style("font-size", "16px")
    .style("font-weight", 600)
    .style("text-anchor", "middle")
    .style("text-transform", "uppercase");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .text(
      "Number of incidents between police officers and citizens labeled by gender"
    )
    .style("fill", "#555555")
    .style("font-size", "12px")
    .style("font-weight", 600)
    .style("text-anchor", "middle")
    .style("text-transform", "uppercase");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Gender on Gender Incidents");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 30)
    .style("text-anchor", "middle")
    .text("Number of Reported Incidents");

  svg
    .selectAll("barz")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.genders))
    .attr("y", (d) => y(d.total))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.total))
    .attr("fill", "#4e6bba")
    .on("mouseover", function (event, d) {
      d3.select("#tooltip")
        .style("display", "block")
        .html(
          `<strong>
            Number of complaints: ${d.total}<br>
            ${d.ranks.map(([rank, n]) => `${rank}: ${n}`).join("<br>")}
          </strong>`
        )
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY - 28 + "px");
      d3.select(this).style("strong", "black").style("stroke-width", "4px");
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("display", "none");
      d3.select(this).style("stroke", "none");
    });
}

function createBlackHat(rawData) {
const data = d3
    .rollups(
      rawData.filter((d) => d.rank != "Sergeant"),
      (d) => d.length,
      (d) => `${d.complainant_gender} -> ${d.mos_gender}`,
      (d) => d.rank_incident,
    )
    .map(([genders, ranks]) => ({
      genders,
      ranks: ranks.sort(([_x, x], [_y, y]) => d3.descending(x, y)),
      total: ranks.reduce((acc, [_, x]) => acc + x, 0),
    }))
    .sort((x, y) => d3.descending(x.total, y.total));
  const width = 800;
  const height = 800;
  const radius = Math.min(width, height) / 2 - 50;
  const svg = d3.select("#black-hat")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", `translate(${width / 2},${height / 2})`);
  const pie = d3.pie().value((d) => d.total);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const portions = svg
        .selectAll(".portion")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "portion");
  portions
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colorScale(i))
    .attr("stroke", "white")
    .attr("stroke-width", 2);
  portions
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text((d) => d.data.genders);
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
