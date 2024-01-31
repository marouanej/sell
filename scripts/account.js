import {fetchDATA,RatingCalibre,setCurrentProductID,getproductbyID} from '../data/products.js';
document.addEventListener('DOMContentLoaded', () => {
const settingsModal = document.querySelector('.js-settings-modal');
const clBT=document.querySelectorAll('.js-close-button');
const settings=document.querySelector('.js-settings');
const clickPicture = document.querySelector('.click-picture');
const profilePictureModal = document.querySelector('.profile-picture-modal');
const overLay=document.querySelector('.overlay');
const allProducts=document.querySelector(".js-p-products");
productsDisplay(productsData);

clBT.forEach((button)=>{
    button.addEventListener('click',()=>{
      console.log('clicked');
      settingsModal.style.display ='none';
      productViewModal.style.display='none';
      profilePictureModal.style.display='none';
      productViewModal.style.display='none';
      productModal.style.display='none';
      overLay.style.display='none';
  });
});
settings?.addEventListener('click',()=>{
    settingsModal.style.display ='flex';
    overLay.style.display='block';
    
})
clickPicture?.addEventListener('click',()=>{
    profilePictureModal.style.display='flex';
    overLay.style.display='block';
})

const viewProduct = document.querySelectorAll('.js-product');
const addProductElement = document.querySelector('.add-product');
const productModal = document.querySelector('.product-modal');
const productViewModal = document.querySelector('.product-view-modal');
const wantedProductContainer=document.querySelector('.wanted-product');
viewProduct.forEach((div)=>{
  div.addEventListener('click',()=>{
    const productID=div.dataset.productId;
    setCurrentProductID(productID);
    const productWanted=getproductbyID(productID,productsData);
    console.log(productWanted)
    wantedProductContainer.innerHTML=displayProduct(productWanted);
    starsRating(productID);
    productViewModal.style.display='block';
    overLay.style.display='block';
    const updateBT=document.getElementById("updateBT");
    const deleteBT=document.getElementById("deleteBT");
    const buyButton = document.getElementById("buyBT");
    updateBT?.addEventListener("click",()=>{
      
      productModal.style.display='flex';
      productViewModal.style.display='none';
      populateProductModal(productWanted);
    })
    deleteBT?.addEventListener("click",()=>{
      productViewModal.style.display='none';
      overLay.style.display='none';
      const url=`/delete_product/${productID}/`;
      const data='';
      const task=()=>{};
      fetchDATA(url,data,task);
    })
    buyButton?.addEventListener("click", function () {
      const productName = productWanted.fields.name;
      const productImageSrc = productWanted.fields.image;
      const message = `Hi, I'm interested in buying the following product:%0a%0a*Product Name:* ${productName}`;
      const sellerPhoneNumber = targetUser.fields.phone;
      // Construct the WhatsApp API link
      
      const whatsappLink = `https://wa.me/${sellerPhoneNumber}/?text=I'm%20interested%20in%20your%20products%20on%20your%20website`;
  
      // Redirect the user to WhatsApp
      window.location.href = whatsappLink;
  });

})
});
function populateProductModal(product) {
  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productDescription = document.getElementById("productDescription");
  const productPreviewImage = document.getElementById("product-preview-image");

  
  productName.value = product.fields.name;
  productPrice.value = product.fields.price;
  productDescription.value = product.fields.description;
  productPreviewImage.src = "/media/" + product.fields.image;
};
addProductElement?.addEventListener('click',()=>{
    productModal.style.display='flex';
    overLay.style.display='block';
})


/** display to buy or update */
function displayProduct(product){
    let productHtml='';
    const imageURL = "/media/"+product.fields.image;
    productHtml += `
    <div class="product__photo">
		<div class="photo-container"data-product-buy="${product.pk}">
			<div class="photo-main">
				<div class="controls">
          <i class="fa-solid fa-share"></i>
					<i class="fa-regular fa-heart"></i>
				</div>
				<img src='${imageURL}'>
			</div>
			
		</div>
	</div>
	<div class="product__info">
		<div class="title">
			<h1>${product.fields.name}</h1>
			<span>${product.pk}</span>
		</div>
		<div class="price">
			<span>${product.fields.price}</span>MAD
		</div>
		<div class="product-rating-container">
            <div class="star-rating" data-product-id="${product.pk}">
                ${generateStarRatingHTML(product.fields.avg_rating)}
            </div>
            <div class="product-rating-count link-primary">
                ${product.fields.total_ratings}
            </div>
        </div>
		<div class="description">
			<p>${product.fields.description}</p>
		</div>
    </div>
		
      `
    return productHtml
}

function generateStarRatingHTML(avgRating) {
  const maxStars = 5;
  let starHTML = '';

  for (let i = 1; i <= maxStars; i++) {
      const isActive = 6-i <= avgRating ? 'active' : '';
      starHTML += `<span class="star ${isActive}" data-stars="${6-i}">&#9733;</span>`;
  }
  
  return starHTML;
};
function starsRating(productId){
  let stars=document.querySelectorAll('.star-rating .star');
    for(const star of stars){
      star.addEventListener("click",()=>{
        let children=star.parentElement.children;
        for(let child of children){
          if(child.getAttribute("data-clicked")){
            return false
          }
        }
        star.setAttribute("data-clicked","true");
        console.log(star.dataset.stars);
        const data={'user_stars':star.dataset.stars}
        const url = `/rate_product/${productId}/`;
        let task = (data)=>{
          productsData = JSON.parse(data.products);
        
        }
        // Make a POST request to the view
        fetchDATA(url,data,task);
        
      })
    }
};


/** display product card */
function productsDisplay(productsData){
  let productsHTML = '';
productsData.forEach((product) => {
  //const productUser=productUSER(product,usersData);
  const srcRating =srcURL+"images/ratings/rating-"+RatingCalibre(product.fields.avg_rating) * 10+".png";
  //const accountURL ="account/"+productUser.fields.username;
  const imageURL = "/media/"+product.fields.image;
  //const profileURL ="/media/"+productUser.fields.profile_picture;
  productsHTML += `
  <div class="product js-product"id="product-${product.pk}" data-product-id="${product.pk}">
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src='${imageURL}'>
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.fields.name}
      </div>
      <div class="product-rating-container">
        <img class="product-rating-stars"
          src='${srcRating}'>
        <div class="product-rating-count link-primary">
          ${product.fields.total_ratings}
        </div>
      </div>

      <div class="product-price">
        ${product.fields.price}MAD
      </div>
    </div>
    </div>
  `;
});
allProducts.innerHTML += productsHTML;

}


const followBT=document.querySelector(".follow-button");
followBT?.addEventListener("click",()=>{
  if (followBT.textContent === "Follow") {
    followBT.textContent = "Unfollow"; 
    followBT.classList.add("unfollow");
    const userToFollowID=followBT.dataset.fuserid;
    const url=`/follow_user/${userToFollowID}`;
    const data={};
    const task=()=>{
      followBT.classList.add("unfollow");
     };
    fetchDATA(url,data,task);
  } else {
    followBT.textContent = "Follow";
    followBT.classList.remove("unfollow");
    const userToFollowID=followBT.dataset.fuserid;
    const url=`/unfollow_user/${userToFollowID}`;
    const data={};
    const task=()=>{
      followBT.classList.remove("unfollow");
     };
    fetchDATA(url,data,task);
  }
})

})






