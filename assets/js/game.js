const myModule = (() => {
	'use strict';

	let deck = [];
	const types = ['C', 'D', 'H', 'S'],
		specials = ['A', 'J', 'Q', 'K'];

	let playersPoints = [];

	// Referencias del HTML
	const btnAsk = document.querySelector('#btnAsk'),
		btnStop = document.querySelector('#btnStop');

	const divPlayersCards = document.querySelectorAll('.divCards'),
		pointsHTML = document.querySelectorAll('small');

	// Esta función inicializa el juego
	const initializeGame = (numPlayers = 2) => {
		deck = createDeck();

		playersPoints = [];
		for (let i = 0; i < numPlayers; i++) {
			playersPoints.push(0);
		}

		pointsHTML.forEach((element) => (element.innerText = 0));
		divPlayersCards.forEach((element) => (element.innerHTML = ''));

		btnAsk.disabled = false;
		btnStop.disabled = false;
	};

	// Esta función crea un nuevo deck
	const createDeck = () => {
		deck = [];

		for (let i = 2; i <= 10; i++) {
			for (let type of types) {
				deck.push(i + type);
			}
		}

		for (let type of types) {
			for (let special of specials) {
				deck.push(special + type);
			}
		}
		return _.shuffle(deck);
	};

	// Esta función me permite tomar una carta
	const askCard = () => {
		if (deck.length === 0) {
			throw 'No hay cartas en el deck';
		}
		return deck.pop();
	};

	const cardValue = (card) => {
		const value = card.substring(0, card.length - 1);
		return isNaN(value) ? (value === 'A' ? 11 : 10) : value * 1;
	};

	// Turno: 0 = Primer jugador y el último será la computadora
	const accumulatePoints = (card, turn) => {
		playersPoints[turn] = playersPoints[turn] + cardValue(card);
		pointsHTML[turn].innerText = playersPoints[turn];
		return playersPoints[turn];
	};

	const createCard = (card, turn) => {
		const imgCard = document.createElement('img');
		imgCard.src = `assets/cards/${card}.png`;
		imgCard.classList.add('card');
		divPlayersCards[turn].append(imgCard);
	};

	const determineWinner = () => {
		const [minimunPoints, computerPoints] = playersPoints;

		setTimeout(() => {
			if (computerPoints === minimunPoints) {
				alert('Nadie gana');
			} else if (minimunPoints > 21) {
				alert('La computadora gana');
			} else if (computerPoints > 21) {
				alert('Jugador gana');
			} else {
				alert('Computadora gana');
			}
		}, 100);
	};

	// Turno de la computadora
	const computerTurn = (minimunPoints) => {
		let computerPoints = 0;

		do {
			const card = askCard();
			computerPoints = accumulatePoints(card, playersPoints.length - 1);
			createCard(card, playersPoints.length - 1);
		} while (computerPoints < minimunPoints && minimunPoints <= 21);

		determineWinner();
	};

	// Eventos
	btnAsk.addEventListener('click', () => {
		const card = askCard();
		const playerPoints = accumulatePoints(card, 0);

		createCard(card, 0);

		if (playerPoints > 21) {
			btnAsk.disabled = true;
			btnStop.disabled = true;
			computerTurn(playerPoints);
		} else if (playerPoints === 21) {
			btnAsk.disabled = true;
			btnStop.disabled = true;
			computerTurn(playerPoints);
		}
	});

	btnStop.addEventListener('click', () => {
		btnAsk.disabled = true;
		btnStop.disabled = true;
		computerTurn(playersPoints[0]);
	});

	return {
		newGame: initializeGame
	};
})();
