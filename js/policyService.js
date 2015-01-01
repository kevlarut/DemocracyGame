var democracyGame = angular.module('democracyGame');

democracyGame.service('policyService', function(gameDataService, playerService) {
		
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
	
	this.getPolicyByName = function(policyName) {
		for (var i = 0; i < gameDataService.policies.length; i++) {
			var policy = gameDataService.policies[i];
			if (policy.name == policyName) {
				return policy;
			}
		}
		
		alert('Error: Could not find any policy with name: ' + policyName);			
		return null;
	};
	
	this.getPolicyModifier = function(modifierName) {
		
		var rate = 1;
		
		for (var i = 0; i < playerService.enactedPolicyNames.length; i++) {
			var policy = this.getPolicyByName(playerService.enactedPolicyNames[i]);
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
		for (var i = 0; i < playerService.enactedPolicyNames.length; i++) {
			if (playerService.enactedPolicyNames[i] == policy.name) {
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
				playerService.enactedPolicyNames.push(policy.name);
			}
		}
	};
	
	this.buyPolicyByName = function(policyName) {
		var policy = this.getPolicyByName(policyName);
		if (policy !== null) {
			this.buyPolicy(matchingPolicy);
		}
	}
});