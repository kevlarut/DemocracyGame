var democracyGame = angular.module('democracyGame');

democracyGame.service('policyService', function($filter, gameDataService, playerService) {
		
	this.allPolicies = function() {
		return gameDataService.policies;
	};
	
	this.canBuyPolicy = function(policy) {
		if (this.isPolicyAlreadyEnacted(policy)) {
			return false;
		}
		else if (playerService.money < policy.cost) {
			return false;
		}
		else {
			return true;
		}
	};
	
	this.canShowPolicyInBuyList = function(policy) {
		return !policy.restricted && !this.isPolicyAlreadyEnacted(policy);
	};
	
	this.enactedPolicies = function() {
		return playerService.enactedPolicies;
	};	
	
	this.getPolicyModifier = function(modifierName) {
		
		var rate = 1;
		
		for (var i = 0; i < this.enactedPolicies().length; i++) {
			var policy = this.enactedPolicies()[i];
			for (var j = 0; j < policy.effects.length; j++) {
				var effect = policy.effects[j];
				if (effect.name === modifierName) {
					rate *= 1 + effect.modifier;
				}
			}
		}
		
		return rate;
	};
	
	this.isPolicyAlreadyEnacted = function(policy) {		
		for (var i = 0; i < this.enactedPolicies().length; i++) {
			if (this.enactedPolicies()[i].name == policy.name) {
				return true;
				break;
			}
		}
		return false;
	};
	
	this.buyPolicy = function(policy) {
		playerService.money -= policy.cost;
		for (var i = 0; i < gameDataService.policies.length; i++) {
			if (gameDataService.policies[i].name === policy.name) {
				playerService.enactedPolicies.push(policy);
			}
		}
	};
	
	this.getPolicyByPolicyName = function(policyName) {
		var matchingPolicy = null;
		for (var i = 0; i < gameDataService.policies.length; i++) {
			var policy = gameDataService.policies[i];
			if (policy.name == policyName) {
				matchingPolicy = policy;
				break;
			}
		}
		if (matchingPolicy === null) {
			alert('Error: Could not find any policy with name: ' + policyName);			
			return null;
		}
		return matchingPolicy;		
	};
	
	this.buyPolicyByName = function(policyName) {
		var policy = this.getPolicyByPolicyName(policyName);
		if (policy !== null) {
			this.buyPolicy(matchingPolicy);
		}
	}
});