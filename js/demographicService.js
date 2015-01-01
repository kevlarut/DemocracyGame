var democracyGame = angular.module('democracyGame');

democracyGame.service('demographicService', function(constantsService, playerService, policyService) {
		
	this.approvalRating = function() {
		var rate = constantsService.baseApprovalRating;
		return rate * policyService.getPolicyModifier('approvalRating');
	};
	
	this.murderRate = function() {
		var rate = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			if (race.iq < 100) {
				rate += race.population;
			}
		}
		rate /= 5000 * policyService.getPolicyModifier('crimeRate');
		return rate;
	};
	
	this.populationPercentage = function(population) {
		return population / this.population() * 100;
	};
	
	this.averageIQ = function() {		
		var totalIQ = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			totalIQ += race.iq * race.population;
		}
		return totalIQ / this.population();
	};
	
	this.perCapitaIncomePerYear = function() {		
		var rate = this.averageIQ();
		return rate * policyService.getPolicyModifier('perCapitaIncome');
	};
	this.perCapitaIncomePerSecond = function() {
		return this.perCapitaIncomePerYear() / constantsService.secondsPerYear;
	};
	
	this.birthRate = function() {			
		var Nt = this.populationGrowth(N0, K);		
		return (Nt / N0 * 1000) - 1000;
	};
		
	// Maximum, unrestricted population growth rate; that is, the rate at which the population grows when it is very small; e.g., 50 per thousand population per year
	this.malthusianParameter = function() {
		var rate = constantsService.baseMalthusianParameter;
		return rate * policyService.getPolicyModifier('birthRate');
	};
	
	this.population = function() {
		var population = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			population += playerService.races[i].population;
		}
		return population;
	};
	
	this.populationGrowth = function(initialPopulation, carryingCapacity) {		
		var K = carryingCapacity;
		var N0 = initialPopulation;
		var r = this.malthusianParameter();
		var t = 1 / constantsService.secondsPerYear / constantsService.framesPerSecond;
		var Nt = K / (1 + ((K - N0) / N0) * Math.pow(Math.E, 0 - r * t) );
		
		return Nt;
	};
	
	this.growPopulationForEachAndEveryRace = function() {		
		var totalPopulation = this.population();	
		var totalPopulationGrowth = this.populationGrowth(totalPopulation, this.carryingCapacity());
	
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			var racePopulationAfterGrowth = totalPopulationGrowth * race.population / totalPopulation;			
			race.population = racePopulationAfterGrowth;
		}
	}
	
	this.carryingCapacity = function() {		
		var rate = constantsService.baseCarryingCapacity;
		return rate * policyService.getPolicyModifier('carryingCapacity');
	};
});