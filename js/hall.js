const selectSeanse = JSON.parse(sessionStorage.selectSeanse);
const request = `event=get_hallConfig&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}`;


document.addEventListener("DOMContentLoaded", () => {
	const acceptinButton = document.querySelector(".acceptin-button");
	const buyingInfoTitle = document.querySelector(".buying__info-title");
	const buyingInfoStart = document.querySelector(".buying__info-start");
	const buyingInfoHall = document.querySelector(".buying__info-hall");
	const priceStandart = document.querySelector(".price-standart");
	const confStepWrapper = document.querySelector(".conf-step__wrapper");

	buyingInfoTitle.innerHTML = selectSeanse.filmName;
	buyingInfoStart.innerHTML = `Начало сеанса ${selectSeanse.seanceTime}`;
	buyingInfoHall.innerHTML = selectSeanse.hallName;
	priceStandart.innerHTML = selectSeanse.priceStandart;

    createRequest(request, (response) => {
        console.log(response);
        if(response) {
            selectSeanse.hallConfig = response;
        }

        confStepWrapper.innerHTML = selectSeanse.hallConfig;

		const chairs = Array.from(document.querySelectorAll(".conf-step__row .conf-step__chair"));
		acceptinButton.setAttribute("disabled", true);

		chairs.forEach((chair) => {
			chair.addEventListener('click', (event) => {
			  if (event.target.classList.contains("conf-step__chair_taken")) {
				return;
			  };
			  event.target.classList.toggle("conf-step__chair_selected");
			  let chairSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
			  if (chairSelected.length > 0) {
				acceptinButton.removeAttribute("disabled");
			  } else {
				acceptinButton.setAttribute("disabled", true);
			  };
			});
		  });
		});

		acceptinButton.addEventListener("click", (event) => {
			event.preventDefault();
			
			const selectedPlaces = Array();
			const rows = Array.from(document.getElementsByClassName("conf-step__row"));
			
			for (let i = 0; i < rows.length; i++) {
				const spanChair = Array.from(rows[i].getElementsByClassName("conf-step__chair"));
			  for (let j = 0; j < spanChair.length; j++) {
				if (spanChair[j].classList.contains("conf-step__chair_selected")) {
				  const typePlace = (spanChair[j].classList.contains("conf-step__chair_standart")) ? "standart" : "vip";
				  selectedPlaces.push({
					"row": i+1,
					"place": j+1,
					"type":  typePlace,
				  });
				};
			  };
			};
			
			const configurationWrapper = document.querySelector(".conf-step__wrapper").innerHTML;
			selectSeanse.hallConfig = configurationWrapper;
			selectSeanse.salesPlaces = selectedPlaces;
			
			sessionStorage.setItem("selectSeanse", JSON.stringify(selectSeanse));
			
			window.location.href = "payment.html";
		})
    })