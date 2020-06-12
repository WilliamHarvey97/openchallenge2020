export const domainColor = (color, states) => {
  color
    .domain(states)
    .range(["#E3624B", "#B0C9D9", "#4da6fe", "#48587f", "#FFD443"]);
};

export const domainX = (xFocus, data) => {
  xFocus.domain([data[0].timestamp, data[data.length - 1].timestamp]);
};

export const domainY = (yFocus, states) => {
  yFocus.domain(states);
};

export const convertSource = (data) => {
  data.forEach((row) => {
    const date = new Date(row.timestamp * 1000);
    row.timestamp = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDay(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  });
};

export const createSources = (data, states, statesOrder) => {
  const sources = [];
  const totalTimestamps = data.length - 1;
  let currentStageDebut = data[0].timestamp;
  let currentStage = 0;
  let stagePortion = 0; //portion in the night of the current stage

  data.forEach((row, i) => {
    stagePortion++;
    //We sum the portions of the current stage
    if (row.sleep_stage !== currentStage || i === data.length - 1) {
      sources.push({
        stageText: states[currentStage],
        stage: statesOrder.indexOf(states[currentStage]),
        stagePortion: (stagePortion / totalTimestamps) * 100,
        currentStageDebut: currentStageDebut,
        currentStageEnd: row.timestamp,
      });
      //next sleep stage
      currentStageDebut = row.timestamp;
      currentStage = row.sleep_stage;
      stagePortion = 0;
    }
  });

  return sources;
};

//Calculate the total portion of each sleep stage (for Viz 3)
export const calculateStagesPortion = (data, states, statesOrder) => {
  var stageProportionCounts = [0, 0, 0, 0, 0];
  var totalTimestamp = data.length;
  //lets find how much % of the night does all stages have
  data.forEach((row) => {
    ++stageProportionCounts[statesOrder.indexOf(states[row.sleep_stage])];
  });

  stageProportionCounts.forEach((stagePortion, i) => {
    stageProportionCounts[i] = stagePortion / totalTimestamp;
  });

  return stageProportionCounts;
};

//Finds the index of the first element of each sleep stage (for Viz 3)
export const findFirstStageIndex = (states) => {
  var firstIndexes = [];

  for (let stage = 0; stage < 5; stage++) {
    firstIndexes.push(states.findIndex((element) => element.stage === stage));
  }

  return firstIndexes;
};
