"use strict";

// Charger automatiquement le nombre d'articles dans le compteur du panier sur toutes les pages
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart-numbers").textContent = productNumbers;
  } 
  
}

onLoadCartNumbers();


