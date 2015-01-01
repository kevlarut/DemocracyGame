var democracyGame = angular.module('democracyGame');

democracyGame.service('localStorageService', function(playerService) {
	
	this.loadFromLocalStorage = function() {
		var savedGame = localStorage.getItem('game');
		if (savedGame != null && typeof savedGame != 'undefined') {
			var parsedSavedGame = JSON.parse(savedGame);
			for (var property in playerService) {
				playerService[property] = parsedSavedGame[property];
			}
		}
	};
	
	this.saveToLocalStorage = function() {
		localStorage.setItem('game', JSON.stringify(playerService));
	};
});