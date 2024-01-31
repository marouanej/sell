import {getCookie,fetchDATA,getCurrentProductID} from '../data/products.js';


let fileInput = document.getElementById("fileInput");
let productInput = document.getElementById("productInput");
let image = document.getElementById("image");
let productImage = document.getElementById("product-img");
let downloadButton = document.getElementById("download");
const previewButton = document.getElementById("previewBT");
const previewButton2 = document.getElementById("previewBT2");
const previewImage = document.getElementById("preview-image");
const productPreviewImage = document.getElementById("product-preview-image");

let cropper = "";
let fileName = "";
let croppable=false;

fileInput.onchange = () => {
  previewImage.src = "";
 
  downloadButton.classList.add("hide");
  //The FileReader object helps to read contents of file stored on the computer
  let reader = new FileReader();
  //readAsDataURL reads the content of input file
  reader.readAsDataURL(fileInput.files[0]);
  reader.onload = () => {
    image.setAttribute("src", reader.result);
    if (cropper) {
      cropper.destroy();
    }
    //Initialize cropper
    cropper = new Cropper(image,{
        aspectRatio: 1,
        viewMode: 1,
        ready: function() {
          croppable = true;
        }});
    //options.classList.remove("hide");
    previewButton.classList.remove("hide");
  };
  fileName = fileInput.files[0].name.split(".")[0];
};

productInput.onchange = () => {
  productPreviewImage.src = "";
 
  //The FileReader object helps to read contents of file stored on the computer
  let reader = new FileReader();
  //readAsDataURL reads the content of input file
  reader.readAsDataURL(productInput.files[0]);
  reader.onload = () => {
    productImage.setAttribute("src", reader.result);
    if (cropper) {
      cropper.destroy();
    }
    //Initialize cropper
    cropper = new Cropper(productImage,{
        ready: function() {
          croppable = true;
        }});
    //options.classList.remove("hide");
    previewButton2.classList.remove("hide");
  };
  fileName = productInput.files[0].name.split(".")[0];
};

previewButton.addEventListener("click", (e) => {
  e.preventDefault();
  let imgSrc = getRoundedCanvas(cropper.getCroppedCanvas({})).toDataURL();
  //Set preview
  previewImage.src = imgSrc;
  downloadButton.download = `cropped_${fileName}.png`;
  downloadButton.setAttribute("href", imgSrc);
});
previewButton2.addEventListener("click", (e) => {
  e.preventDefault();
  let imgSrc = cropper.getCroppedCanvas({}).toDataURL();
  //Set preview
  productPreviewImage.src = imgSrc;
  
});


const uploadBT =document.querySelector('.upload-button');
const profilePicture=document.querySelector('.profile-picture');
const overLay = document.querySelector('.overlay');
const profilePictureModal=document.querySelector('.profile-picture-modal');
uploadBT.addEventListener("click",()=>{
      const canva= cropper.getCroppedCanvas({});
      const imageUrl=canva.toDataURL("image/jpeg");
      const imageData =`<img src="${imageUrl}" class="image-preview" alt="Preview">`;
      profilePicture.innerHTML =imageData;
      overLay.style.display='none';
      profilePictureModal.style.display='none';
      
      // Convert data URL to Blob
      const blob = dataURLtoBlob(imageUrl);
      console.log(blob);

      // Create FormData object and append the Blob
      const formData = new FormData();
      formData.append('profile_image', blob, 'profile_image.jpg');
      for (const pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      
     // Define the URL of your Django view
      const url = `/profile_picture`;
      const csrftoken = getCookie('csrftoken');
      const task = (data) => {
        ;
    };
    
      fetch(url, {
          method: 'POST',  // You can use 'GET', 'POST', 'PUT', 'DELETE', etc.
          credentials: 'same-origin',
          headers:{
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
              'X-CSRFToken': csrftoken,},
          body: formData //JavaScript object of data to POST
      })
          // Add a request body if required (e.g., JSON data)
          // body: JSON.stringify({ key: value }),
      
      .then(response => response.json())  // Parse the JSON response
      .then(data => {
          // Handle the response data here 
          if (data.success) {
            task(data);
      
              console.log(data.message);}
      })
      .catch(error => {
          console.error('Error:', error);
      });
       
  });


 function dataURLtoBlob(dataURL) {
  let arr = dataURL.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}
window.onload = () => {
  download.classList.add("hide");

};

function getRoundedCanvas(sourceCanvas) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let width = sourceCanvas.width;
    let height = sourceCanvas.height;
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }
function remove(list,item){
  const indexToRemove = list.indexOf(item);
  list.splice(indexToRemove, 1);
    
  return list

}
const productKeyword=document.getElementById('productKeyword');
const keywordList=document.getElementById('keywordList');
let keywordData=[];
productKeyword.addEventListener("keydown",(event)=>{
  if (event.key === "Enter") {
    event.preventDefault();

    const keyword = productKeyword.value.trim();
    if (keyword !== "") {
        // Append the keyword to the visible list
        const listItem = document.createElement("li");
        listItem.addEventListener('click',()=>{
          keywordList.removeChild(listItem);
          keywordData=remove(keywordData,listItem.textContent);
        
        })
        listItem.textContent = keyword;
        keywordList.appendChild(listItem);
        keywordData.push(keyword);

        // Clear the input field
        productKeyword.value = "";
    };
  };
});

  const productModal = document.querySelector('.product-modal')
  const createBT =document.querySelector('.create-button');
  createBT.addEventListener("click",()=>{
        console.log(productPreviewImage.src)
        const canva = cropper ? cropper.getCroppedCanvas({}) : null;
        const imageUrl = canva ? canva.toDataURL("image/jpeg") : productPreviewImage.src;
        console.log(imageUrl)
        overLay.style.display='none';
        productModal.style.display='none';
        const productName = document.getElementById("productName");
        const productPrice = document.getElementById("productPrice");
        const productDescription = document.getElementById("productDescription");
        const productId=getCurrentProductID();
        // Convert data URL to Blob
        let blob='';
        if(imageUrl===productPreviewImage.src){
          blob=imageUrl

        }
        else{blob = dataURLtoBlob(imageUrl);}
        
        console.log(blob);
  
        // Create FormData object and append the Blob
        const formData = new FormData();
        formData.append('product_image', blob);
        formData.append('product_name', productName.value );
        formData.append('product_price', productPrice.value);
        formData.append('product_description', productDescription.value);
        formData.append('product_keyword', keywordData);
        for (const pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }
        
       // Define the URL of your Django view
        const url = productId ? `/update_product/${productId}/` : `/add_product`;
        const csrftoken = getCookie('csrftoken');
        const task = (data) => {
          ;
      };
      
        fetch(url, {
            method: 'POST',  // You can use 'GET', 'POST', 'PUT', 'DELETE', etc.
            credentials: 'same-origin',
            headers:{
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
                'X-CSRFToken': csrftoken,},
            body: formData //JavaScript object of data to POST
        })
            // Add a request body if required (e.g., JSON data)
            // body: JSON.stringify({ key: value }),
        
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            // Handle the response data here 
            if (data.success) {
              task(data);
        
                console.log(data.message);}
        })
        .catch(error => {
            console.error('Error:', error);
        });
         
    });
  