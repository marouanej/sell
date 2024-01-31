import {  } from '../data/products.js';

const changePassword=document.getElementById("changePassword");
const profileInfo=document.getElementById("profileInfo");
const accountInfo=document.getElementById("accountInfo");
const followInfo=document.getElementById("followInfo");

const changePasswordForm = document.getElementById("cpForm");
const profileInfoForm = document.getElementById("piForm");
const accountInfoForm = document.getElementById("aiForm");
const followInfoForm = document.getElementById("followForm");

    

// Function to set the selected form in sessionStorage
function setSelectedForm(formId) {
    sessionStorage.setItem('selectedForm', formId);
}

// Function to get the selected form from sessionStorage
function getSelectedForm() {
    return sessionStorage.getItem('selectedForm');
}

// Function to handle link clicks
function handleLinkClick(link, formToDisplay) {
    const userId = link.getAttribute('data-message');
    const setting=link.getAttribute('data-settings');
    setSelectedForm(setting);
    if (userId) {
        window.location.href = '/messenger/' + userId + '/';
    }

    // Remove "selected" class from all links
    changePassword.classList.remove("selected");
    profileInfo.classList.remove("selected");
    accountInfo.classList.remove("selected");
    followInfo.classList.remove("selected");

    // Add "selected" class to the clicked link
    link.classList.add("selected");

    if(formToDisplay){
    changePasswordForm.classList.add("hide");
    profileInfoForm.classList.add("hide");
    accountInfoForm.classList.add("hide");
    followInfoForm.classList.add("hide");

    // Show the specified form
    formToDisplay.classList.remove("hide");
    setSelectedForm(formToDisplay.id);
    }
    
    
}

// Retrieve the selected form from sessionStorage on page load
document.addEventListener("DOMContentLoaded", function () {
    const selectedFormId = getSelectedForm();

    if (selectedFormId) {
        const selectedForm = document.getElementById(selectedFormId);
        if (selectedForm) {
            changePasswordForm.classList.add("hide");
            profileInfoForm.classList.add("hide");
            accountInfoForm.classList.add("hide");
            followInfoForm.classList.add("hide");
            selectedForm.classList.remove("hide");
            // Add "selected" class to the corresponding link
            switch (selectedFormId) {
                case 'cpForm':
                    changePassword.classList.add("selected");
                    break;
                case 'piForm':
                    profileInfo.classList.add("selected");
                    break;
                case 'aiForm':
                    accountInfo.classList.add("selected");
                    break;
                case 'followForm':
                    followInfo.classList.add("selected");
                    break;
                default:
                    break;
            }
        }
    }
});

// Adding click event listeners to the links
changePassword.addEventListener("click", () => {
    handleLinkClick(changePassword, changePasswordForm);
});

profileInfo.addEventListener("click", () => {
    handleLinkClick(profileInfo, profileInfoForm);
});

accountInfo.addEventListener("click", () => {
    handleLinkClick(accountInfo, accountInfoForm);
});
followInfo.addEventListener("click", () => {
    handleLinkClick(followInfo, followInfoForm);
});

const logoutLink = document.getElementById("logOut");
// Adding click event listener to the logout link
logoutLink.addEventListener("click", function() {
    // Navigating to the specified URL
    window.location.href = "/log_out";
});





