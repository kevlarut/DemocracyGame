var democracyGame = angular.module('democracyGame');

democracyGame.service('immigrationService', function(constantsService, demographicService, playerService, policyService) {
	
	this.addStupidImmigrant = function(populationIncrease) {
		var indexOfStupidestRace = null;
		for (var i = 0; i < playerService.races.length; i++) {			
			if (indexOfStupidestRace === null || playerService.races[i].iq < playerService.races[indexOfStupidestRace].iq) {
				indexOfStupidestRace = i;
			}
		}
		playerService.races[indexOfStupidestRace].population += populationIncrease;
	};
	
	this.buyImmigrant = function(race) {
		playerService.money -= race.immigrationCost;
		race.population++;
	};
	
	this.immigrantsPerSecond = function() {
		var rate = policyService.getAttributeValueAfterModificationByPolicies('immigrationRate', 0);
		return rate;
	};
	
	this.processImmigration = function() {
		var populationIncrease = this.immigrantsPerSecond() / constantsService.framesPerSecond;
		var chanceOfGettingAnIndolentImmigrantBecauseOfWelfare = demographicService.welfareSaturation() / 100;
		var randomRoll = Math.random();
		if (randomRoll < chanceOfGettingAnIndolentImmigrantBecauseOfWelfare) {
			this.addStupidImmigrant(populationIncrease);
		}
		else {
		
			var rollRequiredToAddToThisRace = 0;
			var totalPopulation = demographicService.population();
			for (var i = 0; i < playerService.races.length; i++) {
				var race = playerService.races[i];
				var thisRacePercentageOfTotalPopulation = race.population / totalPopulation;
				rollRequiredToAddToThisRace += thisRacePercentageOfTotalPopulation;
				if (randomRoll <= rollRequiredToAddToThisRace) {
					race.population += populationIncrease;
					break;
				}
			}
		}
	};
	
});