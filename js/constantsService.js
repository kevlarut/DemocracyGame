var democracyGame = angular.module('democracyGame');

democracyGame.service('constantsService', function() {
	this.baseApprovalRating = 60;
	this.baseCarryingCapacity = 1000;
	this.baseMalthusianParameter = 0.05;
	this.baseTaxRate = 10;
	this.framesPerSecond = 10;
	this.secondsPerYear = 365;
});