var democracyGame = angular.module('democracyGame');

democracyGame.service('playerService', function(gameDataService) {
	this.enactedPolicyNames = [];
	this.money = 0;
	this.races = gameDataService.races;
});