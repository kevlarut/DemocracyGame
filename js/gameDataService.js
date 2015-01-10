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
		{ 	// Feminism Level 1
			name: 'Women\'s suffrage', 
			cost: 1000, 
			description: 'Let women vote.  Increased per capita income; lower growthRate.',
			effects: [
				{
					name: 'growthRate',
					absoluteIncrease: -0.01
				},
				{
					name: 'perCapitaIncome',
					modifier: 0.1
				}
			]
		},
		{ 	// Feminism Level 2
			name: 'Free contraceptives', 
			cost: 2000, 
			description: 'Increased income, decreased birth rate.',
			effects: [
				{
					name: 'growthRate',
					absoluteIncrease: -0.01
				},
				{
					name: 'perCapitaIncome',
					modifier: 0.1
				}
			],
			prerequisite: 'Women\'s suffrage'
		},
		{	// Feminism Level 3
			name: 'Special training program for women', 
			cost: 3000, 
			description: 'Increased income, decreased birth rate.',
			effects: [
				{
					name: 'growthRate',
					absoluteIncrease: -0.01
				},
				{
					name: 'perCapitaIncome',
					modifier: 0.1
				}
			],
			prerequisite: 'Free contraceptives'
		},
		{	// Feminism Level 4
			name: 'Hiring preferences for women', 
			cost: 4000, 
			description: 'Affirmative action.  Increased income, decreased birth rate.',
			effects: [
				{
					name: 'growthRate',
					absoluteIncrease: -0.01
				},
				{
					name: 'perCapitaIncome',
					modifier: 0.1
				},
				{
					name: 'eugenicsRate',
					absoluteIncrease: -0.05
				}			
			],
			prerequisite: 'Special training program for women'
		},
		{	// Feminism Level 5
			name: 'Subsidized day care', 
			cost: 5000, 
			description: 'Increased income, decreased birth rate.',
			effects: [
				{
					name: 'growthRate',
					absoluteIncrease: -0.01
				},
				{
					name: 'perCapitaIncome',
					modifier: 0.1
				},
				{
					name: 'eugenicsRate',
					absoluteIncrease: -0.05
				}	
			],
			prerequisite: 'Hiring preferences for women'
		},
		{	// Eugenics Level 1
			name: 'Foreign scholarships', 
			cost: 10000, 
			description: 'Attract a higher caliber of immigrant.',
			effects: [
				{
					name: 'eugenicsRate',
					absoluteIncrease: 0.1
				}
			]
		},
		{	// Taxes Level 1
			name: 'Raise income taxes', 
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
		{	// Taxes Level 2
			name: 'Levy tax on avocado consumption', 
			cost: 10000, 
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
			],
			prerequisite: 'Raise income taxes'
		},
		{	// Taxes Level 3
			name: 'Create new junk food tax', 
			cost: 15000, 
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
			],
			prerequisite: 'Levy tax on avocado consumption'
		},
		{	// Taxes Level 4
			name: 'Tax people for not eating avocados', 
			cost: 20000, 
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
			],
			prerequisite: 'Create new junk food tax'
		},
		{
			name: 'Open borders', 
			cost: 15000, 
			description: 'Immigrants will arrive in your country for free; however, as your welfare spending increases, these immigrants will increasingly be of the impoverished and indolent variety.',
			effects: [
				{
					name: 'growthRate',
					absoluteIncrease: 0.05
				}
			]
		},	
		{
			name: 'Panem et circenses',
			cost: 0,
			description: '+10% approval rating, -10% per capita income',
			effects: [
				{
					name: 'approvalRating',
					modifier: 0.1
				},
				{
					name: 'perCapitaIncome',
					modifier: -0.1
				},
				{
					name: 'eugenicsRate',
					absoluteIncrease: -0.05
				}
			],
			restricted: true // For event: "The peasants are revolting!"
		},		
		{		
			name: 'Let them eat cake',
			cost: 0,
			description: '-10% approval rating',
			effects: [
				{
					name: 'approvalRating',
					modifier: -0.1
				}
			],
			restricted: true // For event: "The peasants are revolting!"		
		}
	];
	
	this.events = [
		{
			name: 'peasants-revolting',
			title: 'The peasants are revolting!',
			description: 'Your Excellency, the commoners are resisting your despotic rule!  They stand outside the presidential palace with torches and pitchforks.  What shall we do?',
			choices: [
				{
					nameOfPolicyToEnactIfChosen: 'Let them eat cake',
					title: 'Do nothing.  "Qu\'ils mangent de la brioche."'
				},
				{			
					nameOfPolicyToEnactIfChosen: 'Panem et circenses',
					title: 'Appease them with bread and circuses.'
				}
			]
		}
	];
	
	this.races = [
		{name: 'Braniac', population: 10, standardDeviationsFromMeanIQ: 1, color: "#5cb85c", immigrationCost: 10000}, 
		{name: 'Middling', population: 80, standardDeviationsFromMeanIQ: 0, color: "#f0ad4e", immigrationCost: 5000}, 
		{name: 'Dumbum', population: 10, standardDeviationsFromMeanIQ: -1, color: "#d9534f", immigrationCost: 1000}
	];
});