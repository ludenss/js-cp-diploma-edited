const storedFilmName = localStorage.getItem('filmName');
const storedSeanceDate = localStorage.getItem('seanceDate');
const storedSeanceStart = localStorage.getItem('seanceTimeStart');
const storedHallName = localStorage.getItem('hallName');
const storedSeatsLocation = localStorage.getItem('seatsLocation');
const ticketInformation = 'Фильм: ' + storedFilmName + '; Дата сеанса: ' + storedSeanceDate + '; Начало сеанса: ' + storedSeanceStart + '; Зал: ' + storedHallName + '; Ряд/место: ' + storedSeatsLocation + '. Билет действителен строго на свой сеанс';
const filmTitle = document.querySelector('.ticket__title');
const seatsLocation = document.querySelector('.ticket__chairs');
const hallName = document.querySelector('.ticket__hall');
const filmStart = document.querySelector('.ticket__start');

filmTitle.textContent = storedFilmName;
seatsLocation.textContent = storedSeatsLocation;
hallName.textContent = storedHallName;
filmStart.textContent = storedSeanceStart;

const ticketInfoQr = document.querySelector('.ticket__info-qr');
const qrcode = QRCreator(ticketInformation, {modsize: 2});
const qrcodeContent = qrcode.result;
ticketInfoQr.append(qrcodeContent);