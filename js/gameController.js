var democracyGame = angular.module('democracyGame');

democracyGame.controller('gameController', ['$scope', '$timeout', 'constantsService', 'gameDataService', function($scope, $timeout, constantsService, gameDataService) {
		
	$scope.approvalRating = function() {
		var rate = constantsService.baseApprovalRating;
		
		for (var i = 0; i < $scope.enactedPolicies.length; i++) {
			var modifier = $scope.enactedPolicies[i].approvalRating;
			if (modifier != undefined) {
				rate += rate * modifier;
			}
		}
		
		return rate;
	};
	$scope.democraticAction = '';
	$scope.enactedPolicies = [];
	
	$scope.policies = gameDataService.policies;
	$scope.races = gameDataService.races;
	
	$scope.populationPercentage = function(population) {
		return population / $scope.population() * 100;
	};
	
	$scope.averageIQ = function() {		
		var totalIQ = 0;
		for (var i = 0; i < gameDataService.races.length; i++) {
			var race = gameDataService.races[i];
			totalIQ += race.iq * race.population;
		}
		return totalIQ / $scope.population();
	};
	
	$scope.taxRate = function() {
		var rate = constantsService.baseTaxRate;
		
		for (var i = 0; i < $scope.enactedPolicies.length; i++) {
			var modifier = $scope.enactedPolicies[i].taxRate;
			if (modifier != undefined) {
				rate += rate * modifier;
			}
		}
		
		return rate;
	};
	$scope.money = 0;
	$scope.perCapitaIncomePerYear = function() {
		
		var income = $scope.averageIQ();
	
		for (var i = 0; i < $scope.enactedPolicies.length; i++) {
			var modifier = $scope.enactedPolicies[i].perCapitaIncome;
			if (modifier != undefined) {
				income += income * modifier;
			}
		}
	
		return income; 		
	};
	$scope.perCapitaIncomePerSecond = function() {
		return $scope.perCapitaIncomePerYear() / constantsService.secondsPerYear;
	};
	$scope.incomePerSecond = function() {
		return $scope.population() * $scope.perCapitaIncomePerSecond() * $scope.taxRate() / 100;
	};	
	
	$scope.carryingCapacity = function() {		
		var capacity = constantsService.baseCarryingCapacity;
		
		for (var i = 0; i < $scope.enactedPolicies.length; i++) {
			var modifier = $scope.enactedPolicies[i].carryingCapacity;
			if (modifier != undefined) {
				capacity += capacity * modifier;
			}
		}
		
		return capacity;
	};
		
	$scope.birthRate = function() {	
		
		var K = $scope.carryingCapacity();
		var N0 = $scope.population();
		var r = $scope.malthusianParameter();
		var t = 1;
		var Nt = K / (1 + ((K - N0) / N0) * Math.pow(Math.E, 0 - r * t) );
		
		return (Nt / N0 * 1000) - 1000;
	};
		
	// Maximum, unrestricted population growth rate; that is, the rate at which the population grows when it is very small; e.g., 50 per thousand population per year
	$scope.malthusianParameter = function() {
		var rate = constantsService.baseMalthusianParameter;
	
		for (var i = 0; i < $scope.enactedPolicies.length; i++) {
			var modifier = $scope.enactedPolicies[i].birthRate;
			if (modifier != undefined) {
				rate = rate + rate * modifier;
			}
		}
	
		return rate; 
	};
	$scope.population = function() {
		var population = 0;
		for (var i = 0; i < gameDataService.races.length; i++) {
			population += gameDataService.races[i].population;
		}
		return population;
	};
	$scope.populationGrowth = function(initialPopulation, carryingCapacity) {		
		var K = carryingCapacity;
		var N0 = initialPopulation;
		var r = $scope.malthusianParameter();
		var t = 1 / constantsService.secondsPerYear / constantsService.framesPerSecond;
		var Nt = K / (1 + ((K - N0) / N0) * Math.pow(Math.E, 0 - r * t) );
		
		return Nt;
	};
	$scope.growPopulationForEachRace = function() {	
		var totalPopulation = $scope.population();
	
		for (var i = 0; i < gameDataService.races.length; i++) {
			var race = gameDataService.races[i];
			var outGroupPopulation = totalPopulation - race.population;
			var carryingCapacity = $scope.carryingCapacity() - outGroupPopulation;
			race.population = $scope.populationGrowth(race.population, carryingCapacity);
		}
	}
	
	$scope.lastUpdated = new Date();
	$scope.now = new Date();
	
	$scope.getNextDemocraticAction = function() {
		var random = Math.floor(Math.random() * gameDataService.democraticActions.length);
		$scope.democraticAction = gameDataService.democraticActions[random];
	};
	$scope.doSomethingDemocratic = function() {
		$scope.money += 100;
		$scope.getNextDemocraticAction();		
	};
	$scope.buyImmigrant = function(race) {
		$scope.money -= race.immigrationCost;
		race.population++;
	};
	
	$scope.canBuyPolicy = function(policy) {
		var cost = 0;
		for (var i = 0; i < $scope.enactedPolicies.length; i++) {
			if ($scope.enactedPolicies[i].name === policy.name) {
				return false;
				break;
			}
		}
		if ($scope.money < policy.cost) {
			return false;
		}
		else {
			return true;
		}
	};
	$scope.buyPolicy = function(policy) {
		$scope.money -= policy.cost;
		$scope.enactedPolicies.push(policy);
	}
	
	$scope.update = function() {		
		now = new Date();
		var timeSinceLastUpdate = now.getTime() - $scope.lastUpdated.getTime();
		
		$scope.money += $scope.incomePerSecond() / constantsService.framesPerSecond;
		$scope.growPopulationForEachRace();

		$scope.lastUpdated = now;		
		$timeout($scope.update, 1000 / constantsService.framesPerSecond);
	};
	
	$scope.getNextDemocraticAction();
	$scope.update();
	
}]);