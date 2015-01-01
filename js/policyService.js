var democracyGame = angular.module('democracyGame');

democracyGame.service('policyService', function(playerService) {
		
	this.getPolicyModifier = function(modifierName) {
		
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
	
	this.canBuyPolicy = function(policy) {
		var cost = 0;
		for (var i = 0; i < playerService.enactedPolicies.length; i++) {
			if (playerService.enactedPolicies[i].name == policy.name) {
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
	
	this.buyPolicy = function(policy) {
		playerService.money -= policy.cost;
		playerService.enactedPolicies.push(policy);
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