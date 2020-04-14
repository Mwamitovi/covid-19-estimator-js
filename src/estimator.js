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

  // Estimate number of infected people, 30 days from now
  Object.assign(outputData.impact, {
    infectionsByRequestedTime: outputData.impact.currentlyInfected * 1024
  });

  Object.assign(outputData.severeImpact, {
    infectionsByRequestedTime: outputData.severeImpact.currentlyInfected * 1024
  });

  // Estimate number of severe positive cases that need hospitalization to recover
  Object.assign(outputData.impact, {
    severeCasesByRequestedTime: outputData.impact.infectionsByRequestedTime * 0.15
  });

  Object.assign(outputData.severeImpact, {
    severeCasesByRequestedTime: outputData.severeImpact.infectionsByRequestedTime * 0.15
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
