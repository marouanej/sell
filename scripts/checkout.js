import {formatCurrency} from './utils/money.js';
import {fetchDATA,getCookie} from '../data/products.js';

function product_cart_HTML(){
  let productINCartHTML='' ;

productsINCart.forEach((productINCart)=>{

    const productQuantity=product_in_cart_quantity(productINCart,cartItems);
    const imageURL = "media/"+productINCart.fields.image;
    
    productINCartHTML += `
    <div class="cart-item-container
      js-cart-item-container-${productINCart.pk}">

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${imageURL}">

        <div class="cart-item-details">
          <div class="product-name">
            ${productINCart.fields.name}
          </div>
          <div class="product-price">
            ${(productINCart.fields.price)}MAD
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${productQuantity}</span>
            </span>
            <span>
              <input type='number' min= "0" class="quantity-input" style='display:none;width:40px;
              appearance: none;'>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${productINCart.pk}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productINCart.pk}">
              Delete
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
})
const shippingValue=document.querySelector('.shipping-value');
document.querySelector('.js-shipping-option').addEventListener('change', function() {
    const shippingPrice=parseInt(this.value);
    shippingValue.innerHTML=shippingPrice;
    paymentSummary()
    console.log('change')
  });



document.querySelector('.js-order-summary')
.innerHTML = productINCartHTML;

}
//function that search for the product in the cart to get the quantity
function product_in_cart_quantity(productINCart,cartItems){
  let productQuantity=0;
  cartItems.forEach((cartitem)=>{
    if (cartitem.fields.product === productINCart.pk){
      productQuantity=cartitem.fields.quantity;
    }
  })
  return productQuantity;
}
product_cart_HTML();
document.querySelectorAll('.js-delete-link').forEach((deleteLink) => {
  deleteLink.addEventListener('click', () => {
    const productId = deleteLink.dataset.productId;
    const itemToDelete = document.querySelector(`.js-cart-item-container-${productId}`);
    const span = deleteLink.closest('.cart-item-container');
    const selectedQuantity = span.querySelector('.quantity-label');
    if (itemToDelete) {
      itemToDelete.remove();
    }
    const data = {post_data:'Data to post',product_quantity:selectedQuantity.value};
     // Define the URL of your Django view
      const url = `/delete_from_cart/${productId}/`;
      const csrftoken = getCookie('csrftoken');
      const task = (data)=>{
        document.querySelector('.return-to-home-link').innerHTML=data.cartQuantity;
            document.querySelector('.items-count').innerHTML=`Items ("${data.cartQuantity}")`;
            document.querySelector('.js-cart-price').innerHTML=data.cartPrice;
            paymentSummary()

      }
      // Make a POST request to the view
      fetchDATA(url,data,task);
  });
  });
  
  function paymentSummary(){
    const shippingValue=document.querySelector('.shipping-value');
    const cPrice=document.querySelector('.js-cart-price').innerHTML;
    const sPrice=shippingValue.innerHTML;
    const tprice = parseFloat(cPrice)+parseFloat(sPrice);
    document.querySelector('.js-total-price').innerHTML=tprice;
  }



  document.querySelectorAll('.update-quantity-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      const itemToUpdate = document.querySelector(`.js-cart-item-container-${productId}`);
      const span = updateLink.closest('.cart-item-container');
      const selectedQuantity = span.querySelector('.quantity-label');
      const inputQuantity = span.querySelector('.quantity-input');
      
      
      inputQuantity.style.display = 'inline';
      selectedQuantity.style.display = 'none';
inputQuantity.addEventListener('blur',()=>{
        selectedQuantity.textContent=inputQuantity.value;
        inputQuantity.style.display ='none' ;
        selectedQuantity.style.display = 'inline';
        const data = {post_data:'Data to post',updated_quantity:inputQuantity.value};
       // Define the URL of your Django view
        const url = `/update_quantity/${productId}/`;
        const csrftoken = getCookie('csrftoken');
        const task =(data)=>{
          document.querySelector('.return-to-home-link').innerHTML=data.cartQuantity;
            document.querySelector('.items-count').innerHTML=`Items ("${data.cartQuantity}")`;
            document.querySelector('.js-cart-price').innerHTML=data.cartPrice;
            paymentSummary()

        }
        // Make a POST request to the view
        fetchDATA(url,data,task);
        
    });
      });
    });

    paymentSummary();