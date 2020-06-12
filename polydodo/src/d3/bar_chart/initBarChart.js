import * as d3 from "d3";
import tip from "d3-tip";

import barChartData from "assets/data/hypnogram.csv";
import {
  domainColor,
  domainX,
  domainY,
  convertSource,
  createSources,
  calculateStagesPortion,
  findFirstStageIndex,
} from "./preproc";
import { barLegend } from "./legend";
import {
  createStackedBarChart,
  getToolTipText,
  getStackedToolTipText,
} from "./stages-charts";
import { addTransitions } from "./transition";
import { STATES, STATES_ORDERED, WIDTH, MARGIN } from "./constants";

const initializeBarChart = async (g, heigth, useTransitions = true) => {
  const barHeight = Math.round(
    useTransitions ? heigth / STATES.length : heigth
  );

  /***** Échelles *****/
  var x = d3.scaleTime().range([0, WIDTH]);
  var y = d3
    .scaleOrdinal()
    .range([
      0,
      Math.round(heigth * 0.2),
      Math.round(heigth * 0.4),
      Math.round(heigth * 0.6),
      Math.round(heigth * 0.8),
      heigth,
    ]);

  /****** Axes *******/
  var xAxis = d3.axisBottom(x).tickFormat((d) => `${d.getHours()}h`);
  var yAxis = d3.axisLeft().scale(y).tickSize(-WIDTH); //will create the lines in second visualisation

  // Groupe affichant le graphique principal ().
  var gBarChart = g
    .append("g")
    .attr("transform", "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

  /***** Chargement des données *****/
  const data = await d3.csv(barChartData);
  /***** Prétraitement des données *****/
  var totalTimeStamp = data.length;
  var color = d3.scaleOrdinal();
  var tooltip = tip().attr("class", "d3-tip").offset([-10, 0]);

  var tipStacked = tip().attr("class", "d3-tip").offset([-10, 0]);

  domainColor(color, STATES);
  convertSource(data);

  var sources = createSources(data, STATES, STATES_ORDERED);

  //For visualisation 3
  var totalStagesPortion = calculateStagesPortion(data, STATES, STATES_ORDERED);
  var firstStagesIndex = findFirstStageIndex(sources);

  domainX(x, data);
  domainY(y, STATES_ORDERED);

  /***** Création du graphique Stacked bar chart *****/
  createStackedBarChart(gBarChart, sources, x, color, tooltip, barHeight);
  if (useTransitions) {
    var gSecondBarChart = g
      .append("g")
      .attr(
        "transform",
        "translate(" + MARGIN.LEFT + "," + (2 * MARGIN.TOP + barHeight) + ")"
      );

    var gThirdBarChart = g
      .append("g")
      .attr(
        "transform",
        "translate(" +
          MARGIN.LEFT +
          "," +
          (3 * MARGIN.TOP + 2 * barHeight) +
          ")"
      );

    addTransitions(
      gBarChart,
      gSecondBarChart,
      gThirdBarChart,
      sources,
      color,
      barHeight,
      barHeight,
      WIDTH,
      tipStacked,
      xAxis,
      yAxis,
      firstStagesIndex,
      totalStagesPortion,
      totalTimeStamp
    );
  }
  // Axes
  gBarChart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + barHeight + ")")
    .call(xAxis);

  //get tick
  d3.selectAll(".tick").select("text").style("font-weight", 540);

  /***** Création de l'infobulle *****/
  tooltip.html(function (d) {
    return getToolTipText.call(this, d);
  });
  g.call(tooltip);

  tipStacked.html(function (d) {
    return getStackedToolTipText.call(
      this,
      d,
      totalStagesPortion,
      totalTimeStamp
    );
  });
  g.call(tipStacked);

  /***** Création de la légende *****/
  barLegend(g, STATES, color);
};

export default initializeBarChart;
