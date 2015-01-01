var democracyGame = angular.module('democracyGame');

democracyGame.controller('gameController', ['$scope', '$timeout', 'constantsService', 'demographicService', 'gameDataService', 'playerService', 'localStorageService', 'policyService', 'eventService', function($scope, $timeout, constantsService, demographicService, gameDataService, playerService, localStorageService, policyService, eventService) {

	$scope.demographicService = demographicService;
	$scope.eventService = eventService;
	$scope.gameDataService = gameDataService;
	$scope.playerService = playerService;
	$scope.policyService = policyService;
		
	$scope.democraticAction = '';
	
	$scope.taxRate = function() {
		var rate = constantsService.baseTaxRate;
		return rate * policyService.getPolicyModifier('taxRate');		
	};
	
	$scope.incomePerSecond = function() {
		return demographicService.population() * demographicService.perCapitaIncomePerSecond() * $scope.taxRate() / 100;
	};	
		
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
		
	$scope.currentEvent = null;
		
	$scope.update = function() {		
		now = new Date();
		var timeSinceLastUpdate = now.getTime() - $scope.lastUpdated.getTime();
		
		playerService.money += $scope.incomePerSecond() / constantsService.framesPerSecond;
		demographicService.growPopulationForEachAndEveryRace();

		var newEvent = eventService.spawnNewEventPerhaps($scope.currentEvent);
		if (newEvent) {
			$scope.currentEvent = newEvent;
		}
		
		localStorageService.saveToLocalStorage();	
		
		$scope.lastUpdated = now;		
		$timeout($scope.update, 1000 / constantsService.framesPerSecond);
	};
	
	localStorageService.loadFromLocalStorage();
	$scope.getNextDemocraticAction();
	$scope.update();
	
}]);