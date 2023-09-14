document.addEventListener('DOMContentLoaded', () => {
    updateCalendar();
    updateData();
});

function updateCalendar() {
    const currentTimestamp = Date.now();
    const currentDay = new Date(currentTimestamp);
    let nextDay = currentDay;
    const options = {
        weekday: 'short',
    };

    const pageNavDay = document.querySelectorAll('.page-nav__day');
    let navDay = new Date()
        navDay = Number(navDay.getDate())

    pageNavDay.forEach((element, index) => {
    
    element.dataset.dayTimeStamp = nextDay.setHours(0, 0, 0, 0);
 
        let dayWeek = nextDay.getDay();
        let dayWeekText = nextDay.toLocaleDateString('ru-RU', options);

        const pageNavDayWeek = element.querySelector('.page-nav__day-week');
        const pageNavDayNumber = element.querySelector('.page-nav__day-number');

        pageNavDayWeek.textContent = dayWeekText;
        pageNavDayNumber.textContent = nextDay.getDate();

        if (dayWeek === 0 || dayWeek === 6) {
            element.classList.add('page-nav__day_weekend');
        } else {
            element.classList.remove('page-nav__day_weekend');
        }
        if (navDay === navDay+index) {
            element.dataset.dayTimeStamp = nextDay.setHours(0, 0, 0, 0);
            element.classList.add('page-nav__day_today');
            element.classList.add('page-nav__day_chosen');
        }
        nextDay.setDate(nextDay.getDate() + 1);
    });
}

function updateData() {
    createRequest('event=update', 'MAIN', updateHtmlMain);
};

function updateHtmlMain(serverResponse) {
    const response = JSON.parse(serverResponse);

    const arrFilms = response.films.result;
    const arrHalls = response.halls.result.filter((item) => item.hall_open !== '0');
    const arrSeances = response.seances.result;

    const configHalls = {};

    const selectedDayTimeStamp = (document.querySelector('nav .page-nav__day_chosen')).dataset.dayTimeStamp;
    const nowTimeStamp = Date.now();


    const mainSection = document.querySelector('main');
    mainSection.innerHTML = '';

    arrFilms.forEach((elementFilm) => {
        const textHtml = `
         <section class='movie'>
           <div class='movie__info'>
             <div class='movie__poster'>
               <img class='movie__poster-image' alt='${elementFilm.film_name} постер' src='${elementFilm.film_poster}'>
             </div>
             <div class='movie__description'>
               <h2 class='movie__title'>${elementFilm.film_name}</h2>
               <p class='movie__synopsis'>${elementFilm.film_description}</p>
               <p class='movie__data'>
                 <span class='movie__data-duration'>${elementFilm.film_duration} минут</span>
                 <span class='movie__data-origin'>${elementFilm.film_origin}</span>
               </p>
             </div>
           </div>
         </section>
       `;
        mainSection.insertAdjacentHTML('beforeend', textHtml);

        const movieSection = mainSection?.querySelector('.movie:last-child');

        arrHalls.forEach(elementHall => {

            configHalls[elementHall.hall_id] = elementHall.hall_config;

            const arrSeancesCurrentFilmAndHall = arrSeances.filter((seance, index, array) => {
                return seance.seance_filmid === elementFilm.film_id && seance.seance_hallid === elementHall.hall_id;
            });
            
            const hallNameText = `${elementHall.hall_name.slice(0, 3)} ${elementHall.hall_name.slice(3).trim()}`;

            if (arrSeancesCurrentFilmAndHall.length) {
                const textHtml = `
             <div class='movie-seances__hall'>
               <h3 class='movie-seances__hall-title'>${hallNameText}</h3>
               <ul class='movie-seances__list'>
               </ul>
             </div>
           `;
                movieSection.insertAdjacentHTML('beforeend', textHtml);


                const mooviSeancesList = movieSection?.querySelector('.movie-seances__hall:last-child > .movie-seances__list');

                arrSeancesCurrentFilmAndHall.forEach(elementSeance => {
                    const seanceTimeStamp = +selectedDayTimeStamp + (+elementSeance.seance_start * 60 * 1000);

                    if (nowTimeStamp < seanceTimeStamp) {
                        const textHtml = `
                 <li class='movie-seances__time-block'><a class='movie-seances__time' href='hall.html' data-film-id=${elementFilm.film_id} data-film-name='${elementFilm.film_name}' data-hall-id=${elementHall.hall_id} data-hall-name='${hallNameText}' data-price-vip=${elementHall.hall_price_vip} data-price-standart=${elementHall.hall_price_standart} data-seance-id=${elementSeance.seance_id} data-seance-time=${elementSeance.seance_time} data-seance-start=${elementSeance.seance_start} data-seance-time-stamp=${seanceTimeStamp}>${elementSeance.seance_time}</a></li>
               `;
                        mooviSeancesList.insertAdjacentHTML('beforeend', textHtml);
                    }
                });
            };
        });
    });

    setJSON('config-halls', configHalls);

    addListeners();
}

function onDayClick(event) {
    event.preventDefault();
    const pageNavDay = document.querySelectorAll('.page-nav__day');
    pageNavDay.forEach((element) => {
        element.classList.remove('page-nav__day_chosen');
    });

    event.currentTarget.classList.add('page-nav__day_chosen');

    updateData();
}

function onSeanceClick(event) {
    const seanceData = this.dataset;

    setJSON('data-of-the-selected-seance', seanceData);
}

function addListeners() {
    const pageNavDay = document.querySelectorAll('.page-nav__day');
    pageNavDay.forEach(element => {
        element.addEventListener('click', onDayClick);
    });

    const movieSeancesTime = document.querySelectorAll('.movie-seances__time');
    movieSeancesTime.forEach(element => {
        element.addEventListener('click', onSeanceClick);
    });
}