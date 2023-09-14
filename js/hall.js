let selectedTimestamp = localStorage.getItem('seanceTimestamp');
let selectedHallId = localStorage.getItem('hallId');
let selectedSeanceId = localStorage.getItem('seanceId');
let argumentForHall = `event=get_hallConfig&timestamp=${selectedTimestamp}&hallId=${selectedHallId}&seanceId=${selectedSeanceId}`;

const selectedSeanceStart = localStorage.getItem('seanceTimeStart');
const selectedFilmName = localStorage.getItem('filmName');
const selectedHallName = localStorage.getItem('hallName');
const selectedHallConfig = localStorage.getItem('hallConfig');
const hallPriceStandart = localStorage.getItem('hallPriceStandart');
const hallPriceVip = localStorage.getItem('hallPriceVip');

const buyingInfoDescription = document.querySelector('.buying__info-description');
const filmTitle = document.querySelector('.buying__info-title');
const filmStart = document.querySelector('.buying__info-start');
const hallName = document.querySelector('.buying__info-hall');
const elementPriceStandart = document.querySelector('.price-standart');
const elementPriceVip = document.querySelector('.price-vip');

const acceptinButton = document.querySelector('.acceptin-button');
const configHall = document.querySelector('.conf-step__wrapper');

filmTitle.textContent = selectedFilmName;
filmStart.textContent = 'Начало сеанса: ' + selectedSeanceStart;
hallName.textContent = 'Зал ' + selectedHallName;
elementPriceStandart.textContent = hallPriceStandart;
elementPriceVip.textContent = hallPriceVip;

function fillingPageHall(response) {
  if (response === null) {
    configHall.innerHTML = selectedHallConfig;
  } else {
    configHall.innerHTML = response;
  }

  let seatsInfo = [];
  let rows = configHall.querySelectorAll('.conf-step__row');
  for (let indexRow = 0; indexRow < rows.length; indexRow++) {
    let seatsInRow = Array.from(rows[indexRow].querySelectorAll('.conf-step__chair')).filter(seat => seat.classList.contains('conf-step__chair_disabled') === false);  
    seatsInRow.forEach((seat, indexSeat) => {
      if (seat.classList.contains('conf-step__chair_taken') === false) {
        let seatPrice = 0;
        seat.addEventListener('click', () => {
          if (seat.classList.contains('conf-step__chair_vip')) {
            seat.classList.remove('conf-step__chair_vip');
            seat.classList.add('conf-step__chair_selected');
            seatPrice = hallPriceVip;
            seatsInfo.push({indexRow, indexSeat, seatPrice});           
          } else if (seat.classList.contains('conf-step__chair_standart')) {
            seat.classList.remove('conf-step__chair_standart');
            seat.classList.add('conf-step__chair_selected');
            seatPrice = hallPriceStandart;
            seatsInfo.push({indexRow, indexSeat, seatPrice});
          } else if (seat.classList.contains('conf-step__chair_selected')) {
            let indexForCancel = seatsInfo.findIndex(seatInfo => seatInfo.indexRow === indexRow && seatInfo.indexSeat === indexSeat);
            seatsInfo[indexForCancel]['seatPrice'] === hallPriceVip ? (
              seat.classList.remove('conf-step__chair_selected'),
              seat.classList.add('conf-step__chair_vip')
            ) : (
              seat.classList.remove('conf-step__chair_selected'),
              seat.classList.add('conf-step__chair_standart')
            );

            seatsInfo.splice(indexForCancel, 1);
          }          
        });
      }
    });
  }

  acceptinButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    let selectedSeats = Array.from(configHall.querySelectorAll('.conf-step__chair')).filter(seat => seat.classList.contains('conf-step__chair_selected'));
    selectedSeats.forEach(selectedSeat => {
      selectedSeat.classList.remove('conf-step__chair_selected');
      selectedSeat.classList.add('conf-step__chair_taken');
    });

    let newConfigHall = configHall.innerHTML;
    localStorage.setItem('newConfigHall', newConfigHall);

    let seatsLocation = ''; 
    seatsInfo.sort((a, b) => {
      let aRowSeat = JSON.stringify(a.indexRow) + JSON.stringify(a.indexSeat);
      let bRowSeat = JSON.stringify(b.indexRow) + JSON.stringify(b.indexSeat);
      if (+aRowSeat > +bRowSeat) {
        return 1;
      }
      
      if (+aRowSeat < +bRowSeat) {
        return -1;
      }
    });

    seatsInfo.reduce((accum, seatInfo, index, array) => {
      accum += +seatInfo.seatPrice;
      let numberOfRow = seatInfo.indexRow + 1;
      let numberOfSeat = seatInfo.indexSeat + 1;
      if (index === 0) {
        seatsLocation += numberOfRow + '/' + numberOfSeat;
      } else {
        seatsLocation += ', ' + numberOfRow + '/' + numberOfSeat;
      }
      
      if (index === array.length - 1) {
        localStorage.setItem('seatsLocation', seatsLocation);
        localStorage.setItem('costOfTickets', accum);
        
        location.assign('payment.html');
      }

      return accum;
    }, 0);  
  });
}

createRequest(argumentForHall, fillingPageHall);
