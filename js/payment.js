const storedSeanceStart = localStorage.getItem('seanceTimeStart');
const storedFilmName = localStorage.getItem('filmName');
const storedSeatsLocation = localStorage.getItem('seatsLocation');
const storedHallName = localStorage.getItem('hallName');
const storedCostOfTickets = localStorage.getItem('costOfTickets');

const filmTitle = document.querySelector('.ticket__title');
const seatsLocation = document.querySelector('.ticket__chairs');
const hallName = document.querySelector('.ticket__hall');
const filmStart = document.querySelector('.ticket__start');
const ticketCost = document.querySelector('.ticket__cost');
const acceptinButton = document.querySelector('.acceptin-button');

filmTitle.textContent = storedFilmName;
seatsLocation.textContent = storedSeatsLocation;
hallName.textContent = storedHallName;
filmStart.textContent = storedSeanceStart;
ticketCost.textContent = storedCostOfTickets;

const storedTimestamp = localStorage.getItem('seanceTimestamp');
const storedHallId = localStorage.getItem('hallId');
const storedSeanceId = localStorage.getItem('seanceId');
const storedConfigHall = localStorage.getItem('newConfigHall');

let argumentForPayment = `event=sale_add&timestamp=${storedTimestamp}&hallId=${storedHallId}&seanceId=${storedSeanceId}&hallConfiguration=${storedConfigHall}`;

function goToPageTicket(response) {
  location.assign('ticket.html');
}

acceptinButton.addEventListener('click', (e) => {
  e.preventDefault();

  createRequest(argumentForPayment, goToPageTicket);
 });