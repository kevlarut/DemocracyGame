var democracyGame = angular.module('democracyGame');

democracyGame.service('policyService', function(gameDataService, infrastructureService, playerService) {

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
		return !policy.restricted && !this.isPolicyAlreadyEnacted(policy) && this.havePolicyPrerequisitesBeenMet(policy);
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
	
	this.getAttributeValueAfterModificationByPolicies = function(attributeName, baseValue) {	
		var value = baseValue;
		
		value += this.getPolicyAbsoluteIncrease(attributeName);
		value += infrastructureService.getAttributeAbsoluteIncrease(attributeName);
		value *= this.getPolicyModifier(attributeName);
		value *= infrastructureService.getAttributeModifier(attributeName);
		
		return value;
	};
	
	this.getPolicyAbsoluteIncrease = function(attributeName) {
		
		var increase = 0;
		
		for (var i = 0; i < playerService.enactedPolicyNames.length; i++) {
			var policy = this.getPolicyByName(playerService.enactedPolicyNames[i]);
			for (var j = 0; j < policy.effects.length; j++) {
				var effect = policy.effects[j];
				if (effect.name === attributeName) {
					if (typeof effect.absoluteIncrease !== 'undefined') {
						increase += effect.absoluteIncrease;
					}
				}
			}
		}
		
		return increase;
	};
	
	this.getPolicyModifier = function(attributeName) {
		
		var rate = 1;
		
		for (var i = 0; i < playerService.enactedPolicyNames.length; i++) {
			var policy = this.getPolicyByName(playerService.enactedPolicyNames[i]);
			for (var j = 0; j < policy.effects.length; j++) {
				var effect = policy.effects[j];
				if (effect.name === attributeName) {
					if (typeof effect.modifier !== 'undefined') {
						rate *= 1 + effect.modifier;
					}
				}
			}
		}
		
		return rate;
	};
	
	this.havePolicyPrerequisitesBeenMet = function(policy) {
		if (typeof policy.prerequisite === 'undefined') {
			return true;
		}
		else {
			return this.isPolicyAlreadyEnacted(policy.prerequisite);
		}
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
	
		if (playerService.money >= policy.cost) {
			playerService.money -= policy.cost;
			for (var i = 0; i < gameDataService.policies.length; i++) {
				if (gameDataService.policies[i].name === policy.name) {
					playerService.enactedPolicyNames.push(policy.name);
				}
			}
			return true;
		}
		return false;
	};
	
	this.buyPolicyByName = function(policyName) {
		var policy = this.getPolicyByName(policyName);
		if (policy !== null) {
			this.buyPolicy(matchingPolicy);
		}
	}
});