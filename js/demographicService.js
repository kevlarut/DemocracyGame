var democracyGame = angular.module('democracyGame');

democracyGame.service('demographicService', function(constantsService, playerService, policyService) {
		
	this.approvalRating = function() {
		return policyService.getAttributeValueAfterModificationByPolicies('approvalRating', constantsService.baseApprovalRating);
	}
	
	this.crimeRate = function() {
		var rate = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			if (race.iq < 100) {
				rate += race.population;
			}
		}
		rate = policyService.getAttributeValueAfterModificationByPolicies('crimeRate', rate / 10);
		return rate;
	}
	
	this.populationPercentage = function(population) {
		return this.populationProportion(population) * 100;
	}
	
	this.populationProportion = function(segmentPopulation) {
		return segmentPopulation / this.population();		
	}
	
	this.averageIQ = function() {		
		var totalIQ = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			totalIQ += race.iq * race.population;
		}
		return totalIQ / this.population();
	};
	
	this.perCapitaIncomePerYear = function() {		
		return policyService.getAttributeValueAfterModificationByPolicies('perCapitaIncome', this.averageIQ());
	};
	this.perCapitaIncomePerSecond = function() {
		return this.perCapitaIncomePerYear() / constantsService.secondsPerYear;
	};
	
	this.populationGrowthRate = function() {			
		var K = this.carryingCapacity();
		var N0 = this.population();		
		var t = 1;
		var Nt = this.populationGrowth(N0, K, t);
		
		return (Nt / N0 * 1000) - 1000;
	};
		
	// Maximum, unrestricted population growth rate; that is, the rate at which the population grows when it is very small; e.g., 50 per thousand population per year
	this.malthusianParameter = function() {
		return policyService.getAttributeValueAfterModificationByPolicies('birthRate', constantsService.baseMalthusianParameter);
	}
	
	this.population = function() {
		var population = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			if (!isNaN(playerService.races[i].population)) {
				population += playerService.races[i].population;
			}
		}
		return population;
	}
	
	this.populationGrowth = function(initialPopulation, carryingCapacity, t) {		
		var K = carryingCapacity;
		var N0 = initialPopulation;
		var r = this.malthusianParameter();
		var Nt = K / (1 + ((K - N0) / N0) * Math.pow(Math.E, 0 - r * t) );
		
		return Nt;
	}
	
	this.eugenicsRate = function() {	
		return policyService.getAttributeValueAfterModificationByPolicies('eugenicsRate', 1);
	}
	
	this.growPopulationForEachAndEveryRace = function() {		
		var initialTotalPopulation = this.population();	
		var t = 1 / constantsService.secondsPerYear / constantsService.framesPerSecond;
		var totalPopulationAfterGrowth = this.populationGrowth(initialTotalPopulation, this.carryingCapacity(), t);
	
		var weightedProportions = [];
		var totalWeightedProportions = 0;
		for (var i = 0; i < playerService.races.length; i++) {
		
			var race = playerService.races[i];
			
			var weightedProportion = this.populationProportion(race.population);
			if (race.iq > 100) {
				weightedProportion *= this.eugenicsRate();
			}
			if (race.iq < 100) {
				weightedProportion *= 2 - this.eugenicsRate(); 
			}
			weightedProportions.push(weightedProportion);
			totalWeightedProportions += weightedProportion;
		}
	
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			var growthForThisRace = (totalPopulationAfterGrowth - initialTotalPopulation) * weightedProportions[i] / totalWeightedProportions;
			var racePopulationAfterGrowth = race.population + growthForThisRace;			
			race.population = racePopulationAfterGrowth;
		}
	}
	
	this.carryingCapacity = function() {
		return policyService.getAttributeValueAfterModificationByPolicies('carryingCapacity', constantsService.baseCarryingCapacity);
	}
});