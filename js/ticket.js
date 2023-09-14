const selectSeanse = JSON.parse(sessionStorage.selectSeanse);

document.addEventListener("DOMContentLoaded", function() {
  let places = "";
  let price = 0;
  
  selectSeanse.salesPlaces.forEach(salePlace => {
    if (places !=="") {
      places += ", ";
    }
    places += `${salePlace.row}/${salePlace.place}`;
    price += salePlace.type === "standart" ? Number(selectSeanse.priceStandart) : Number(selectSeanse.priceVip);
  });
  
  document.querySelector(".ticket__title").innerHTML = selectSeanse.filmName;  
  document.querySelector(".ticket__chairs").innerHTML = places; 
  document.querySelector(".ticket__hall").innerHTML = selectSeanse.hallName;  
  document.querySelector(".ticket__start").innerHTML = selectSeanse.seanceTime;  
  
  
  const date = new Date(Number(selectSeanse.seanceTimeStamp * 1000));
 
  const dateStr = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  let textQR =`
  Фильм: ${selectSeanse.filmName}
  Зал: ${selectSeanse.hallName}
  Ряд/Место ${places}
  Дата: ${dateStr}
  Начало сеанса: ${selectSeanse.seanceTime}
  Билет действителен строго на свой сеанс`;

  const qrcode = QRCreator(textQR, { image: "SVG"	});
  
  document.querySelector(".ticket__info-qr").append(qrcode.result);
  console.log(qrcode.result);
});