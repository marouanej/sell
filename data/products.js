export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const csrftoken = getCookie('csrftoken');
export function fetchDATA(url,data,task){
    const csrftoken = getCookie('csrftoken');
    fetch(url, {
        method: 'POST',  // You can use 'GET', 'POST', 'PUT', 'DELETE', etc.
        credentials: 'same-origin',
        headers:{
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
            'X-CSRFToken': csrftoken,},
        body: JSON.stringify(data) //JavaScript object of data to POST
    })
        // Add a request body if required (e.g., JSON data)
        // body: JSON.stringify({ key: value }),
    
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Handle the response data here (e.g., update the cart quantity)
        if (data.success) {
          task(data);
    
            console.log(data.message);}
    })
    .catch(error => {
        console.error('Error:', error);
    });
     
};
export function RatingCalibre(rate) {
    // Round down to the nearest 0.5
    let rating = Math.floor(rate * 2) / 2;
  
    // If you want to round up to the nearest 0.5, use Math.ceil instead:
    // let rating = Math.ceil(rate * 2) / 2;
  
    // Add any additional logic or return statements based on your requirements
    return rating;
  }
export function getproductbyID(productId, productsData) {
    for (const product of productsData) {
      if (parseInt(productId) === product.pk) {
        return product;
      }
    }
    // If no matching product is found, return null or handle the case accordingly
    return null;
  }
let currentProductID;

export function setCurrentProductID(productID) {
currentProductID = productID;
}

export function getCurrentProductID() {
return currentProductID;
}