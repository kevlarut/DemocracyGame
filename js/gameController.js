var democracyGame = angular.module('democracyGame');

democracyGame.controller('gameController', ['$scope', '$timeout', 'constantsService', 'gameDataService', 'playerService', 'localStorageService', function($scope, $timeout, constantsService, gameDataService, playerService, localStorageService) {

	$scope.murderRate = function() {
		var rate = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			if (race.iq < 100) {
				rate += race.population;
			}
		}
		rate /= 5000 * $scope.getPolicyModifier('crimeRate');
		return rate;
	};
		
	$scope.getPolicyModifier = function(modifierName) {
		
		var rate = 1;
		
		for (var i = 0; i < playerService.enactedPolicies.length; i++) {
			var policy = playerService.enactedPolicies[i];
			for (var j = 0; j < policy.effects.length; j++) {
				var effect = policy.effects[j];
				if (effect.name === modifierName) {
					rate *= 1 + effect.modifier;
				}
			}
		}
		
		return rate;
	};
		
	$scope.approvalRating = function() {
		var rate = constantsService.baseApprovalRating;
		return rate * $scope.getPolicyModifier('approvalRating');
	};
	$scope.democraticAction = '';
	
	$scope.policies = gameDataService.policies;
	
	$scope.populationPercentage = function(population) {
		return population / $scope.population() * 100;
	};
	
	$scope.averageIQ = function() {		
		var totalIQ = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
			totalIQ += race.iq * race.population;
		}
		return totalIQ / $scope.population();
	};
	
	$scope.taxRate = function() {
		var rate = constantsService.baseTaxRate;
		return rate * $scope.getPolicyModifier('taxRate');		
	};
	$scope.playerService = playerService;
	$scope.perCapitaIncomePerYear = function() {		
		var rate = $scope.averageIQ();
		return rate * $scope.getPolicyModifier('perCapitaIncome');
	};
	$scope.perCapitaIncomePerSecond = function() {
		return $scope.perCapitaIncomePerYear() / constantsService.secondsPerYear;
	};
	$scope.incomePerSecond = function() {
		return $scope.population() * $scope.perCapitaIncomePerSecond() * $scope.taxRate() / 100;
	};	
	
	$scope.carryingCapacity = function() {		
		var rate = constantsService.baseCarryingCapacity;
		return rate * $scope.getPolicyModifier('carryingCapacity');
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
		return rate * $scope.getPolicyModifier('birthRate');
	};
	$scope.population = function() {
		var population = 0;
		for (var i = 0; i < playerService.races.length; i++) {
			population += playerService.races[i].population;
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
	
		for (var i = 0; i < playerService.races.length; i++) {
			var race = playerService.races[i];
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
		playerService.money += 100;
		$scope.getNextDemocraticAction();	
	};
	$scope.buyImmigrant = function(race) {
		playerService.money -= race.immigrationCost;
		race.population++;
	};
	
	$scope.canBuyPolicy = function(policy) {
		var cost = 0;
		for (var i = 0; i < playerService.enactedPolicies.length; i++) {
			if (playerService.enactedPolicies[i].name === policy.name) {
				return false;
				break;
			}
		}
		if (playerService.money < policy.cost) {
			return false;
		}
		else {
			return true;
		}
	};
	$scope.buyPolicy = function(policy) {
		playerService.money -= policy.cost;
		playerService.enactedPolicies.push(policy);
	}
	
	$scope.update = function() {		
		now = new Date();
		var timeSinceLastUpdate = now.getTime() - $scope.lastUpdated.getTime();
		
		playerService.money += $scope.incomePerSecond() / constantsService.framesPerSecond;
		$scope.growPopulationForEachRace();

		localStorageService.saveToLocalStorage();	
		
		$scope.lastUpdated = now;		
		$timeout($scope.update, 1000 / constantsService.framesPerSecond);
	};
	
	localStorageService.loadFromLocalStorage();
	$scope.getNextDemocraticAction();
	$scope.update();
	
}]);