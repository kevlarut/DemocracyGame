var democracyGame = angular.module('democracyGame');

democracyGame.service('immigrationService', function(constantsService, demographicService, playerService, policyService) {		
	this.buyImmigrant = function(race) {
		playerService.money -= race.immigrationCost;
		race.population++;
	};
});