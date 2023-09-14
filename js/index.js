const mainBlock = document.querySelector('main');
const navDays = Array.from(document.querySelectorAll('.page-nav__day'));

function weekdayDeterminator(date, index, days) {
  let weekday = date.getDay();
  let weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  if (weekday === 0 || weekday === 6) {
    days[index].classList.add('page-nav__day_weekend');
  }

  return weekdays[weekday];
}

navDays.forEach((navDay, index, array) => {
  let day = new Date();
  day.setDate(day.getDate() + index);
  day.setHours(0, 0, 0, 0);
  let currentDayTimestamp = Math.trunc(+day / 1000);
  let seanceDayNumber = day.getDate();
  navDay.querySelector('.page-nav__day-number').textContent = seanceDayNumber;
  let dayWeek = weekdayDeterminator(day, index, array);
  navDay.querySelector('.page-nav__day-week').textContent = dayWeek;
  let month = +day.getMonth() + 1;
  let correctMonth = (month < 10) ? '0' + month : month;
  let correctDay = (seanceDayNumber < 10) ? '0' + seanceDayNumber : seanceDayNumber;
  let seanceDate = correctDay + '.' + correctMonth + '.' + day.getFullYear();
  navDay.setAttribute('data-seance-date', seanceDate);
  navDay.setAttribute('data-day-timestamp', currentDayTimestamp);
});

let argumentForSend = 'event=update';

function fillingPageIndex(response) {
  let films = response.films.result;
  let halls = response.halls.result;
  let seances = response.seances.result;

  for (let i = 0; i < films.length; i++) {
    mainBlock.insertAdjacentHTML('beforeEnd', '<section class="movie"></section>');
    let movie = mainBlock.querySelectorAll('.movie')[i];
    movie.insertAdjacentHTML('beforeEnd', '<div class="movie__info"></div>');
    let movieInfo = movie.querySelector('.movie__info');
    movieInfo.insertAdjacentHTML('beforeEnd', '<div class="movie__poster"><img class="movie__poster-image"></div>');
    let namePoster = films[i]['film_name'] + 'постер';
    let linkPoster = films[i]['film_poster'];
    movieInfo.querySelector('.movie__poster-image').setAttribute('alt', namePoster);
    movieInfo.querySelector('.movie__poster-image').setAttribute('src', linkPoster);   
    movieInfo.insertAdjacentHTML('beforeEnd', '<div class="movie__description"><h2 class="movie__title"></h2><p class="movie__synopsis"></p><p class="movie__data"><span class="movie__data-duration"></span><span class="movie__data-origin"></span></p></div>');
    let filmName = films[i]['film_name'];
    movie.setAttribute('data-film-name', filmName);
    movieInfo.querySelector('.movie__title').textContent = filmName;
    let filmDescription = films[i]['film_description'];
    movieInfo.querySelector('.movie__synopsis').textContent = filmDescription;
    let filmDuration = films[i]['film_duration'];
    movieInfo.querySelector('.movie__data-duration').textContent = filmDuration + ' мин ';
    let filmOrigin = films[i]['film_origin'];
    movieInfo.querySelector('.movie__data-origin').textContent = filmOrigin;
    let filmId = films[i]['film_id'];
    movie.setAttribute('data-film-id', filmId);

    let hallsOpen = halls.filter(hall => hall['hall_open'] === '1');
    let filmHalls = [];
    hallsOpen.forEach(hall => {
      let hallId = hall['hall_id'];
      let hallName = hall['hall_name']; 
      let hallConfig = hall['hall_config'];
      let priceStandart = hall['hall_price_standart'];
      let priceVip = hall['hall_price_vip'];
      let seanceInHall = seances.find(seance => seance['seance_filmid'] === filmId && seance['seance_hallid'] === hallId);
      if (seanceInHall) {
        filmHalls.push({hallId, hallName, hallConfig, priceStandart, priceVip});
        movie.insertAdjacentHTML('beforeEnd', '<div class="movie-seances__hall"><h3 class="movie-seances__hall-title"></h3><ul class="movie-seances__list"></ul></div>');
      }
    });

    filmHalls.forEach((item, index) => {
      let filmSeances = seances.filter(seance => seance['seance_filmid'] === filmId && seance['seance_hallid'] === item['hallId']);
      let hallName = item['hallName'];      
      let hallNumber = hallName.substring(hallName.length - 1);
      movie.querySelectorAll('.movie-seances__hall-title')[index].textContent = 'Зал ' + hallNumber;
      movie.querySelectorAll('.movie-seances__hall')[index].setAttribute('data-hall-name', hallNumber);
      let itemHallId = item['hallId'];
      movie.querySelectorAll('.movie-seances__hall')[index].setAttribute('data-hall-id', itemHallId);
      let itemHallConfig = item['hallConfig'];
      movie.querySelectorAll('.movie-seances__hall')[index].setAttribute('data-hall-config', itemHallConfig);
      let hallPriceStandart = item['priceStandart'];
      movie.querySelectorAll('.movie-seances__hall')[index].setAttribute('data-hall-price-standart', hallPriceStandart);
      let hallPriceVip  = item['priceVip'];
      movie.querySelectorAll('.movie-seances__hall')[index].setAttribute('data-hall-price-vip', hallPriceVip);
      let seancesList = movie.querySelectorAll('.movie-seances__list')[index];
      filmSeances.forEach((seance, i) => {
        seancesList.insertAdjacentHTML('beforeEnd', '<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html"></a></li>');
        let seanceTime = seancesList.querySelectorAll('.movie-seances__time')[i];
        let seanceStart = seance['seance_start'];
        seanceTime.setAttribute('data-seance-start', seanceStart);
        let seanceTimeStart = seance['seance_time'];
        seanceTime.textContent = seanceTimeStart;
        seanceTime.setAttribute('data-seance-time-start', seanceTimeStart);
        let seanceId = seance['seance_id'];
        seanceTime.setAttribute('data-seance-id', seanceId); 
      });  
    }); 
  }

  const mainBlockContent = mainBlock.innerHTML;
  localStorage.setItem('mainBlockContent', mainBlockContent);

  let activeNumberPage = 0;

  navDays.forEach((navDay, index, array) => {    
    
    function fillingPageIndexToday() {
      Array.from(mainBlock.querySelectorAll('.movie')).forEach(movie => {
        let hallsOfFilm = Array.from(movie.querySelectorAll('.movie-seances__hall'));
        hallsOfFilm.forEach((hall, index, array) => {
          let timesOfSeances = Array.from(hall.querySelectorAll('.movie-seances__time'));
          timesOfSeances.forEach(time => {
            let seanceStart = time.dataset.seanceStart;
            let todayTimestamp = navDay.dataset.dayTimestamp;
            let seanceTimeStamp = +todayTimestamp + seanceStart * 60;
            let nowTimestamp = Math.trunc(Date.now() / 1000); 
            if (seanceTimeStamp < nowTimestamp) { 
              let timeBlockToday = time.closest('.movie-seances__time-block');
              timeBlockToday.remove();         
            }
          }); 
        });

        hallsOfFilm.forEach(hall => {
          let currentTimesOfSeances = Array.from(hall.querySelectorAll('.movie-seances__time'));
          if (currentTimesOfSeances.length === 0) {
            hall.remove();
          }  
        });
      }); 
    }

    function seanceInformationProcessing() {
      Array.from(document.querySelectorAll('.movie-seances__time')).forEach(seance => {
        seance.addEventListener('click', (e) => {
          e.preventDefault();

          let storedSeanceId = seance.dataset.seanceId;
          localStorage.setItem('seanceId', storedSeanceId);
          let initialStart = seance.dataset.seanceStart; 
          let dayTimestamp = navDay.dataset.dayTimestamp;
          let currentTimestamp = +dayTimestamp + initialStart * 60;    
          localStorage.setItem('seanceTimestamp', currentTimestamp);
          let storedSeanceTimeStart = seance.dataset.seanceTimeStart;
          localStorage.setItem('seanceTimeStart', storedSeanceTimeStart);
          let filmOfSeance = seance.closest('.movie');
          let storedfilmName = filmOfSeance.dataset.filmName;
          localStorage.setItem('filmName', storedfilmName);
          let hallOfSeance = seance.closest('.movie-seances__hall');
          let storedHallId = hallOfSeance.dataset.hallId;
          localStorage.setItem('hallId', storedHallId);
          let storedHallName = hallOfSeance.dataset.hallName;
          localStorage.setItem('hallName', storedHallName);
          let storedHallConfig = hallOfSeance.dataset.hallConfig;
          localStorage.setItem('hallConfig', storedHallConfig);
          let storedHallPriceStandart = hallOfSeance.dataset.hallPriceStandart;
          localStorage.setItem('hallPriceStandart', storedHallPriceStandart);
          let storedHallPriceVip = hallOfSeance.dataset.hallPriceVip;
          localStorage.setItem('hallPriceVip', storedHallPriceVip);
          let storedSeanceDate = navDay.dataset.seanceDate;
          localStorage.setItem('seanceDate', storedSeanceDate);

          location.assign('hall.html');   
        });
      });  
    }

    if (index === 0) {
      fillingPageIndexToday();

      seanceInformationProcessing();
    } 

    navDay.addEventListener('click', (e) => {
      e.preventDefault();

      if (index === 0) {
        fillingPageIndexToday();
    } else {
      mainBlock.innerHTML = localStorage.getItem('mainBlockContent');
    }

      array[activeNumberPage].classList.remove('page-nav__day_chosen');
      navDay.classList.add('page-nav__day_chosen');
      activeNumberPage = index;

      seanceInformationProcessing(); 
    });
  }); 
}

createRequest(argumentForSend, fillingPageIndex);