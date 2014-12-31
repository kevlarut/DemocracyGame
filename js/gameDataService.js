var democracyGame = angular.module('democracyGame');

democracyGame.service('gameDataService', function() {
	this.democraticActions = [
		'Sell military secrets to the Chinese',
		'Host an air force bake sale',
		'Beg the International Monetary Fund for a loan',
		'Threaten the U.N. with nuclear war',
		'Blackmail a political opponent',
		'Host a campaign fundraiser',
		'Take a bribe from a lobbyist',
		'Write a memoir',
		'Wage a war on poverty',
		'Promise lower taxes',
		'Deliver talking points',
		'Pledge support for Israel',
		'Reform health care',
		'Hope and change',
		'Play golf at the presidential retreat',
		'Work late with an intern'
	];
	
	this.policies = [
		{
			name: 'Free contraceptives', 
			cost: 1000, 
			description: '-5% birth rate, +5% per capita income',
			effects: [
				{
					name: 'birthRate',
					modifier: -0.05
				},
				{
					name: 'perCapitaIncome',
					modifier: 0.05
				}
			]
		},		
		{
			name: 'Raise taxes', 
			cost: 7500, 
			description: '+5% tax rate, -5% approval rating',
			effects: [
				{
					name: 'taxRate',
					modifier: 0.05
				},
				{
					name: 'approvalRating',
					modifier: -0.05
				}
			]
		},
		{
			name: 'Charter an agricultural college', 
			cost: 100000, 
			description: '+10% per capita income',
			effects: [
				{
					name: 'perCapitaIncome',
					modifier: 0.1
				}
			]
		},
		{
			name: 'Annex land', 
			cost:1000000, 
			description: 'Double carrying capacity',
			effects: [
				{
					name: 'carryingCapacity',
					modifier: 1.0
				}
			]
		},
		{
			name: 'Build a police station', 
			cost:1000000, 
			description: 'Reduce crime rate in half',
			effects: [
				{
					name: 'crimeRate',
					modifier: -0.5
				}
			]
		}
	];
	
	this.races = [
		{name: 'Braniac', population: 10, iq: 115, color: "#5cb85c", immigrationCost: 10000}, 
		{name: 'Middling', population: 80, iq: 100, color: "#f0ad4e", immigrationCost: 5000}, 
		{name: 'Dumbum', population: 10, iq: 85, color: "#d9534f", immigrationCost: 1000}
	];
});