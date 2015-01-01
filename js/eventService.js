var democracyGame = angular.module('democracyGame');

democracyGame.service('eventService', function(demographicService, gameDataService, playerService) {
		
	this.clearCurrentEventAndBuyPolicyByName = function(nameOfPolicyToEnact) {
		$scope.currentEvent = null;
		$scope.buyPolicyByName(nameOfPolicyToEnact);
	};
	
	this.canBuyEveryPolicyInEvent = function(eventIndex) {
		var event = gameDataService.events[i];
		for (var i = 0; i < event.choices.length; i++) {
			var policy = policyService.getPolicyByPolicyName(event.choices[i].nameOfPolicyToEnactIfChosen);
			if (!policyService.canBuyPolicy(policy)) {
				return false;
			}
		}
		return true;
	};
	
	this.spawnNewEventPerhaps = function(currentEvent) {
		var approvalRating = demographicService.approvalRating();
		
		if (currentEvent === null) {
			if (approvalRating < 20) {
				if (Math.random() >= 0.99) {
					if (this.canBuyEveryPolicyInEvent(0)) {
						return gameDataService.events[0];
					}
				}
			}
		}
		
		return currentEvent;
	};
	
});