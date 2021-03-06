import * as d3 from "d3";
import _ from "lodash";

export const createLine = (x, y) => {
  return d3.line()
    .x(d => x(d.timestamp))
    .y(d => y(d.sleep_stage))
    .curve(d3.curveStepAfter);
};

export const createHypnogramChart = (g, data, line, color) => {
  const g_chart = g.append("g")
    .attr("class", "hypnogram-lines");

  g_chart.selectAll()
    .data(data)
    .enter().append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", x => line(x.values))
    .attr("stroke", x => color(x.name))
    .attr("stroke-width", 2);

  return g_chart;
};

export const createAxes = (g, xAxis, yAxis, dimensions, margin) => {
  const { height, width } = dimensions;

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  g.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  g.append("text").text("Time")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + (1/2)*margin.bottom);

  g.append("text").text("Sleep stage")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", -(1/2)*margin.left);
};

export const createTitle = (g, title, dimensions, margin) => {
  g.append("text").text(title)
    .attr("class", "chart-title")
    .attr("text-anchor", "middle")
    .attr("y", -(3/4)*margin.top)
    .attr("x", (1/2)*dimensions.width);
};

export const createLegend = (g, hypnogramNames, comparativeColors, dimensions, margin) => {
  const legendData = _.zip(hypnogramNames, comparativeColors).map(x => {
    return {
      "name": x[0],
      "color": x[1],
    };
  });

  g.selectAll(".rect.legend")
    .data(legendData)
  .enter().append("rect")
    .attr("class", "legend")
    .attr("stroke-width", 1)
    .attr("fill", x => x.color)
    .attr("width", "1em")
    .attr("height", "1em")
    .attr("y", -(1/2)*margin.top)
    .attr("x", (_, i) => `${i * 8}em`);

  g.selectAll(".text.legend")
    .data(legendData)
  .enter().append("text")
    .attr("class", "legend")
    .text(x => x.name)
    .attr("font-size", 12)
    .attr("dominant-baseline", "hanging")
    .attr("y", -(1/2)*margin.top)
    .attr("dy", 0.25+"em")
    .attr("x", (_, i) => `${1.5 + i * 11}em`);
};