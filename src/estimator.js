const inputData = {
	region: {
		name: "Africa",
		avgAge: 19.7,
		avgDailyIncomeInUSD: 5,
		avgDailyIncomePopulation: 0.71
	},
	periodType: "days",
	timeToElapse: 58,
	reportedCases: 674,
	population: 66622705,
	totalHospitalBeds: 1380614
};

const covid19ImpactEstimator = (data = inputData) => {
	/**
	 *	@param nested {object} (see "data")
	 *
	 *	@return flat {object} e.g,
	 *	
	 *	{
	 *		data: {}, 			 // the input data
	 *		impact: {}, 		 // best case estimation
	 *		severeImpact: {}     // severe case estimation
	 *	}
	 *
	 */

	let outputData = { data, impact: {}, severeImpact: {} };	

	// Estimate the number of currently infected persons
	outputData.impact = { currentlyInfected: data.reportedCases * 10 };
	outputData.severeImpact = { currentlyInfected: data.reportedCases * 50 };

	return outputData;
};

export default covid19ImpactEstimator;
