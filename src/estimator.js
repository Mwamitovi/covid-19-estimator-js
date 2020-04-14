const inputData = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

const covid19ImpactEstimator = (data = inputData) => {
  /**
   *  @param nested {object} (see "data")
   *
   *  @return flat {object} e.g,
   *
   *  {
   *    data: {},        // the input data
   *    impact: {},      // best case estimation
   *    severeImpact: {}     // severe case estimation
   *  }
   *
   */

  const outputData = { data, impact: {}, severeImpact: {} };

  // Estimate the number of currently infected persons
  outputData.impact = { currentlyInfected: data.reportedCases * 10 };
  outputData.severeImpact = { currentlyInfected: data.reportedCases * 50 };

  // Projected number of infections after 58 days
  // We take 19 sets of 3 days, plus (2/3) person infected per day
  const numberOfInfections = (infected, period = 'days', time = 58) => {
    let factor;

    if (period === 'days') {
      // Daily
      factor = 1;
    } else if (period === 'weeks') {
      // Weekly
      factor = 2.5;
    } else {
      // Monthly
      factor = 10;
    }

    return (infected * (time * (2 ** factor)));
  };

  // Estimate number of infected people, 58 days from now
  Object.assign(outputData.impact, {
    infectionsByRequestedTime: numberOfInfections(outputData.impact.currentlyInfected)
  });

  Object.assign(outputData.severeImpact, {
    infectionsByRequestedTime: numberOfInfections(outputData.severeImpact.currentlyInfected)
  });

  // Estimate number of severe positive cases that need hospitalization to recover
  Object.assign(outputData.impact, {
    severeCasesByRequestedTime: Math.floor(outputData.impact.infectionsByRequestedTime * 0.15)
  });

  Object.assign(outputData.severeImpact, {
    severeCasesByRequestedTime: Math.floor(outputData.severeImpact.infectionsByRequestedTime * 0.15)
  });

  const availableBeds = (param) => (Math.floor((data.totalHospitalBeds * 0.35) - param));

  // Estimate number of available beds for severe COVID-19 patients
  Object.assign(outputData.impact, {
    hospitalBedsByRequestedTime: availableBeds(outputData.impact.severeCasesByRequestedTime)
  });

  Object.assign(outputData.severeImpact, {
    hospitalBedsByRequestedTime: availableBeds(outputData.severeImpact.severeCasesByRequestedTime)
  });

  return outputData;
};

export default covid19ImpactEstimator;
