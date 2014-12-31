var democracyGame = angular.module('democracyGame');

democracyGame.service('playerService', function(gameDataService) {
	this.enactedPolicies = [];
	this.money = 0;
	this.races = gameDataService.races;
});