'use strict';

//Structure de la page confirmation.html
(function confirmOrder () {

  //Ciblage des classes
  let contentConfirm = document.querySelector('.content-confirm');
  let hideCart = document.querySelector('img.logo'); 
  let hideLogo = document.querySelector('.cart'); 
  let header = document.querySelector('header');

  //Cacher le logo + panier
  hideCart.remove();
  hideLogo.remove();

  header.style.backgroundSize = '25%';

  let order =localStorage.getItem('order');
  order = JSON.parse(order);    //Convertir en objet pour la manipulation
  
  //Structuration dans la page html
  contentConfirm.innerHTML = `
  <article class="confirm">
  <h2 class="confirm__header">Votre commande a bien été enregistré, Nous vous remercions.</h2><br>
  <h3 class= "confirm__total">Prix total des articles : <br><b>${localStorage.getItem('totalCost')} €</b></h3><br>
  <br>
  <h3 class="confirm__order">Commande numéro :<br><b>${order.orderId}</b> </h3><br>
  <h2>À Bientôt ! </h2>
  <button class="btn-reset">Retour à la page principale</button>
  <img class='img-confirm' src='./images/final-img.jpg' />
  </article>
  `
    clearCart();
}());


//Vider le localStorage/panier
function clearCart() {
    let btnReset = document.querySelector('.btn-reset')
    btnReset.addEventListener('click', function() {
        this.style.backgroundColor = "burlywood";
        localStorage.clear();
        window.location = "./index.html"; //redirection vers la page d'acceuil
    })
}