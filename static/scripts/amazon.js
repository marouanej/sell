
import {fetchDATA,RatingCalibre} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

function productUSER(product,usersData){
  let productUser;
usersData.forEach((user)=>{
    if(user.pk===product.fields.user){
      productUser=user;
    }
  })
  return productUser;
}

const productsGrid=document.querySelector('.js-products-grid');
function productsDisplay(productsData){
  let productsHTML = '';
productsData.forEach((product) => {
  const productUser=productUSER(product,usersData);
  const srcRating =srcURL+"images/ratings/rating-"+RatingCalibre(product.fields.avg_rating) * 10+".png";
  console.log(product.fields.avg_rating);
  console.log(RatingCalibre(product.fields.avg_rating));
  const accountURL ="account/"+productUser.fields.username;
  const imageURL = "/media/"+product.fields.image;
  const profileURL ="/media/"+productUser.fields.profile_picture;
  let buttonHTML = '';
  console.log(productUSER);
  if (productUser.fields.is_staff) {
    // User is a staff member, show Add to Cart button
    buttonHTML = `
      <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.pk}">
        Add to Cart
      </button>`;
  } else {
    // User is not a staff member, show Visit Profile button
    buttonHTML = `
      <a href="${accountURL}">
        <button class="visit-profile-button ">
          Visit Profile
        </button>
      </a>`;
  }
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src='${imageURL}'>
      </div>
      <div class="product-name limit-text-to-2-lines">
        ${product.fields.name}
      </div>
      <a href=${accountURL}>
        <div class="product-user">
          <img class="mini-profile-picture" src='${profileURL}'>
          ${productUser.fields.username}
        </div>
      </a>
      <div class="product-rating-container">
        <img class="product-rating-stars"
          src='${srcRating}'>
        <div class="product-rating-count link-primary">
          ${product.fields.total_ratings}
        </div>
      </div>
      <div class="product-price">
        ${(product.fields.price)}MAD
      </div>
      <div class="product-quantity-container">
        <select class="js-select-quantity" data-product-id="${product.pk}">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div class="product-spacer"></div>
      <div class="added-to-cart">
        <img src=${srcURL+"images/icons/checkmark.png"}>
        Added
      </div>
      ${buttonHTML}
    </div>
  `;
});
productsGrid.innerHTML += productsHTML;

}
productsDisplay(productsData);

document.querySelectorAll('.js-add-to-cart').forEach(button => {
  button.addEventListener('click', (event) => {
      const productId = button.getAttribute('data-product-id');
      const productContainer = button.closest('.product-container');
      const selectedQuantity = productContainer.querySelector('.js-select-quantity');
      const data = {post_data:'Data to post',product_quantity:selectedQuantity.value};
     // Define the URL of your Django view
      const url = `/add_to_cart/${productId}/`;
      const task = (data) => {
        document.querySelector('.js-cart-quantity').innerHTML = data.cartQuantity;
      };
      event.stopPropagation();
      // Make a POST request to the view
      fetchDATA(url,data,task);
  });
});

const linkModal =document.querySelector('.js-link-to-modal');
linkModal?.addEventListener('click',()=>{
  const modal=document.querySelector('.modal');
  modal.style.display='block';
})
document.querySelectorAll('.closs').forEach((closeBt)=>{
  closeBt.addEventListener('click',()=>{
    const modal=document.querySelector('.modal');
    modal.style.display='none';
  })
})

const searchBar=document.getElementById("searchBar");
const searchbarBT=document.getElementById("searchbarBT");
searchBar.addEventListener("keyup", (event) => {
  // Check if the pressed key is Enter (key code 13)
  if (event.key === "Enter") {
    performSearch();
  }
});

searchbarBT.addEventListener("click", () => {
  performSearch();
});

function performSearch() {
  const query = searchBar.value;
  // Make an AJAX request to the Django view
  fetch(`/search/?q=${query}`)
    .then(response => response.json())
    .then(data => {
      productsData = JSON.parse(data.products);
      productsDisplay(productsData);
    })
    .catch(error => console.error('Error:', error));
}