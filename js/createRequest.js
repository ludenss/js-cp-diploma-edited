function createRequest(body, callback = () => {}) {
    const xhr = new XMLHttpRequest();
    xhr.open ("POST", "https://jscp-diplom.netoserver.ru", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.responseType = "json";

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(xhr.response);
            } else {
                console.error("Ошибка" + xhr.status);
                callback(null);
            }
        }   
    };

    xhr.onerror = function() {
        console.error("Ошибка запроса");
        callback(null);
    };
    xhr.send(body);
}