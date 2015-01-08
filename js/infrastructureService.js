var democracyGame = angular.module('democracyGame');

democracyGame.service('infrastructureService', function(playerService) {
	
	this.projects = [
		{	
			id: 'housing',
			initialCost: 100,
			name: 'Housing',
			effects: [
				{
					name: 'carryingCapacity',
					modifier: 1.0
				}
			],
			flavorfulLevelNames: [
				'Mud huts',
				'Cottages',
				'Single-family houses',
				'Townhouses',
				'Apartments',
				'High-rise apartments'
			]
		},
		// {
			// id: 'health',
			// initialCost: 100,
			// name: 'Health',
			// effects: [
				// {
					// name: 'carryingCapacity',
					// modifier: 1.0
				// }
			// ],
		// },
		{
			id: 'crime',
			initialCost: 100,
			name: 'Law Enforcement',
			effects: [
				{
					name: 'crimeRate',
					modifier: 1.0
				}
			],
		},
		{
			id: 'education',
			initialCost: 100,
			name: 'Education',
			effects: [
				{
					name: 'perCapitaIncome',
					modifier: 1.0
				}
			],
		},
		// {
			// id: 'defense',
			// initialCost: 100,
			// name: 'Defense',
			// effects: [
				// {
					// name: 'carryingCapacity',
					// modifier: 1.0
				// }
			// ],
		// }
	];
	
	this.canBuyUpgrade = function(id) {		
		var cost = this.getUpgradeCost(id);
		return playerService.money >= cost;
	};
	
	this.getInfrastructureLevel = function(id) {
	
		if (typeof playerService.infrastructure === 'undefined') {
			playerService.infrastructure = [];
		}
	
		for (var i = 0; i < playerService.infrastructure.length; i++) {
			var infrastructure = playerService.infrastructure[i];
			if (infrastructure.id === id) {
				return infrastructure.level;
				break;
			}
		}
		
		return 0;
	};
	
	this.getProjectById = function(id) {
	
		for (var i = 0; i < this.projects.length; i++) {
			var project = this.projects[i];
			if (project.id === id) {
				return project;
				break;
			}
		}
		
		alert("getProjectById could not find any infrastructure project with id '" + id + "'.");
		return null;
	};
	
	this.getFlavorfulLevelName = function(id, level) {
		var flavor = null;		
		var project = this.getProjectById(id);
		
		if (typeof project.flavorfulLevelNames !== 'undefined' && project.flavorfulLevelNames.length >= level) {
			return project.flavorfulLevelNames[level];
		}
		else {
			return project.name + ' Level ' + level;
		}
	}
	
	this.getFlavorfulLevelTextForCurrentLevel = function(id) {
		var level = this.getInfrastructureLevel(id);
		return this.getFlavorfulLevelName(id, level);
	};
	
	this.getFlavorfulLevelTextForNextLevel = function(id) {
		var level = this.getInfrastructureLevel(id) + 1;
		return this.getFlavorfulLevelName(id, level);
	};
	
	this.getUpgradeCost = function(id) {
		
		var project = this.getProjectById(id);
		var currentLevel = this.getInfrastructureLevel(id);
		
		var cost = project.initialCost;
		for (var i = 0; i <= currentLevel; i++) {
			cost *= 10;
		}
		
		return cost;
	}
	
	this.buyUpgrade = function(id, level) {
		var cost = this.getUpgradeCost(id);
		if (playerService.money >= cost) {
			playerService.money -= cost;
			
			for (var i = 0; i < playerService.infrastructure.length; i++) {
				if (playerService.infrastructure[i].id === id) {
					playerService.infrastructure[i].level++;
					return;
				}
			}
			
			playerService.infrastructure.push({
				id: id,
				level: 1
			});
			return true;
		}
		else {
			return false;
		}
	};
	
	this.getAttributeAbsoluteIncrease = function(attributeName) {
	
		var increase = 0;
	
		for (var i = 0; i < playerService.infrastructure.length; i++) {
			var infrastructure = playerService.infrastructure[i];
			if (infrastructure.level !== 0) {
				var project = this.getProjectById(infrastructure.id);
				for (var j = 0; j < project.effects.length; j++) {
					var effect = project.effects[j];
					if (effect.name === attributeName && typeof effect.absoluteIncrease !== 'undefined') {
						increase += effect.absoluteIncrease * infrastructure.level;
					}
				}
			}
		}
		
		return increase;
		
	};
	
	this.getAttributeModifier = function(attributeName) {
	
		var modifier = 1;
	
		for (var i = 0; i < playerService.infrastructure.length; i++) {
			var infrastructure = playerService.infrastructure[i];
			if (infrastructure.level !== 0) {
				var project = this.getProjectById(infrastructure.id);
				for (var j = 0; j < project.effects.length; j++) {
					var effect = project.effects[j];
					if (effect.name === attributeName && typeof effect.modifier !== 'undefined') {
						modifier *= 1 + effect.modifier * infrastructure.level;
					}
				}
			}
		}
		
		return modifier;
		
	};
});