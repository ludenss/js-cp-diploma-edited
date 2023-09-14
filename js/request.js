function createRequest(requestBodyString, requestSourceString = "", callback, uploadInfoIsNeed = false) {
    let XMLH = new XMLHttpRequest();
    XMLH.open("POST", "https://jscp-diplom.netoserver.ru/");
    XMLH.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    XMLH.send(requestBodyString);

    if (uploadInfoIsNeed) {
        XMLH.upload.onprogress = function (event) {
            console.log(`Sending data... ${event.loaded} of ${event.total} bytes`);
        };

        XMLH.upload.onerror = function () {
            console.log("data error");
        };
    }

    XMLH.onload = function () {
        if (XMLH.status != 200) {
            alert("error: " + XMLH.status);
            return;
        }

        console.log(`${requestSourceString} - status request: ${XMLH.status} (${XMLH.statusText})`);
        callback(XMLH.response);

    };

    XMLH.onerror = function () {
        alert("request error");
    };

};

function setItem(key, value) {
    try {
        return window.sessionStorage.setItem(key, value);
    } catch (e) {
        console.log(e);
    }
}

function getItem(key) {
    try {
        return window.sessionStorage.getItem(key);
    } catch (e) {
        console.log(e);
    }
}

function setJSON(key, value) {
    try {
        const jSon = JSON.stringify(value);

        setItem(key, jSon);
    } catch (e) {
        console.error(e);
    }
}

function getJSON(key) {
    try {
        const jSon = getItem(key);

        return JSON.parse(jSon);
    } catch (e) {
        console.error(e);
    }
}