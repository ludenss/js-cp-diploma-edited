function createRequest(argument, func) {
    const xhr = new XMLHttpRequest();
  
    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText);
      
      func(response);
    });
  
    xhr.open('POST', 'https://jscp-diplom.netoserver.ru/', true);
  
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  
    xhr.send(argument);
  }
  