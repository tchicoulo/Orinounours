"use strict";

//Creation de l'object Contact et du tableau de produits.
let contact = {};
let products = [];

//Voir les produits selectionnés dans le panier
function showProductsInCart() {
  let cartItems = localStorage.getItem("productInCart");
  cartItems = JSON.parse(cartItems);
  let cartProducts = document.querySelector(".cart-products");
  if (cartItems && cartProducts) { //Si le panier contient des articles...
    
    Object.values(cartItems).map((article) => { 

      //ajout de l'id de chaque produits dans le tableau products pour l'API
      for (let i=0; i < parseInt(article.inCart); i++) {
        products.push(article._id);
      }

        //Création du tableau de produits dans html
        cartProducts.innerHTML += `
        <div class ="cart-header__title">
            <img class= "img-cart" src= ${article.imageUrl}>
            <span>${article.name}</span>
        </div>
        <div class ="cart-header__price">${article.price / 100} €</div>
        <div class ="cart-header__color">${article.colors}</div>
        <div class ="cart-header__quantity">${article.inCart}</div>
        <div class ="cart-header__total">${ (article.inCart * article.price) / 100 } €</div>
        `;
    });
  cartProducts.innerHTML += `
  <div class ="sub-array">
      <span class ="total-product">Prix total des articles : <b>${localStorage.getItem("totalCost")} €.</b></span>
      <div class="clear-cart">Annuler ?</div>
  </div>`;
  validForm(products);
  deleteProduct();
  } else {  // si le panier est vide... 
    checkCartEmpty();
  }
}


//Vérification Panier Vide
function checkCartEmpty() {

  let cartH1 = document.querySelector('.cart-title-page');
    let cartContainer = document.querySelector('.cart-container');
    let formHeading = document.querySelector('.form-heading');
    let form = document.querySelector('form');

    //changement et suppression de certaines balises
    cartH1.innerHTML = "Nous sommes désolés !";
    cartContainer.remove();
    formHeading.innerHTML = "Votre panier est vide...<br> Veuillez sélectionner des articles dans la page d\'acceuil";
    formHeading.style.fontSize = "1.8rem";
    formHeading.style.marginBottom = "15rem";
    form.remove();

    // redirection automatique vers la page d'acceuil
    setTimeout(function() {
      window.location = "./index.html"}, 4000);
}

// Annuler/ supprimer les articles dans le panier
function deleteProduct() {
  let clearCart = document.querySelector('.clear-cart');

  clearCart.addEventListener('click', function() {
    alert('Votre panier à été annulé \n retour à la page d\'acceuil');
    localStorage.clear();
    window.location = "./index.html";
  })
}

showProductsInCart();

// Vérification des inputs du formulaire
function checkInput() {

  //Controle Regex
  let checkNumber = /[0-9]/;  //Regex de nombres
  let checkMinCharacter = /[a-zA-Z]{2,}/; //Regex qui vérifie si l'utilisateur tape au moins 2 lettres dans le champs
  let checkSpecialCharacter = /[&~#"()"|%$^*{}!/><£€µ¤]/; //Regex de caractères spéciaux
  let checkMail = /^\w{2,}@[a-z1-9]{2,}\.[a-z]{1,}$/; //Regex pour vérifier l'adresse e-mail

  // Ciblage des valeurs des inputs des utilisateurs
  let firstName = document.getElementById("first-name").value;
  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("mail").value;

  // Message final sur la vérification des input.
  let verifyInput = "";

  // test de l'input du prénom
  if (
    checkNumber.test(firstName) ||  //Si le prénom contient des nombres...
    checkSpecialCharacter.test(firstName) || //si le prénom contient des caractères spéciaux
    (checkMinCharacter.test(firstName) == false) ||
    firstName == ""
  ) {
    verifyInput = "Concernant votre prénom, Vous devez entrer au minimum deux caractères alphabétiques. Les caractères spéciaux et les chiffres ne sont pas autorisés." + "\n";
  } else {
    console.log("Input du prénom accepté");
  }

  // test de l'input du nom
  if (
    checkNumber.test(name) ||
    checkSpecialCharacter.test(name) ||
    (checkMinCharacter.test(name) == false) ||
    name == ""
  ) {
    verifyInput += "Concernant votre nom, Vous devez entrer au minimum deux caractères alphabétiques. Les caractères spéciaux et les chiffres ne sont pas autorisés." + "\n";
  } else {
    console.log("Input du nom accepté");
  }

  // test de l'input adresse
  if (checkSpecialCharacter.test(address) || 
    (checkMinCharacter.test(address) == false) ||
    address == "" || address.length > 150) { //si l'adresse tapé a plus de 150 caractères.
    verifyInput += "Concernant votre adresse, Vous devez entrer au minimum deux caractères alphabétiques. Les caractères spéciaux ne sont pas autorisés." + "\n";
  } else {
    console.log('Input de l\'adresse accepté');
  }

  // test de l'input ville
  if (checkNumber.test(city) || 
    (checkMinCharacter.test(city) == false) ||
    checkSpecialCharacter.test(city) || 
    city == "") {
    verifyInput += "Concernant votre ville, Vous devez entrer au minimum deux caractères alphabétiques. Les caractères spéciaux et les chiffres ne sont pas autorisés." + "\n";
  } else {
    console.log('Input de la ville accepté');
  }

  // test de l'input de l'adresse électronique
  if (checkMail.test(email) == false) {  //Test Regex pour l'adresse e-mail
    verifyInput += "E-mail non autorisé, veuillez vérifier vos informations";
  } else {
    console.log('e-mail accepté');
  }

  // Vérification Input(s)
  if (verifyInput != "") {
    alert('Nous avons rencontrés des problèmes sur les informations que vous nous avez communiqué: ' + '\n\n' + verifyInput)

  } else { //Si tous les Input(s) sont acceptés...
    console.log("Informations valides")

  //Construction de l'objet Contact
   contact = {
      firstName: firstName,
      lastName: name,
      address: address,
      city: city,
      email : email
    }
    return true;   
  } 
}

//Methode POST de l'object contact et id des produits
function postOrder(orderString) {

  const options = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body : orderString
  }

  fetch("http://localhost:3000/api/teddies/order", options)
  .then((response) => { // Retourne une Promesse (résolue ou rompue)
    if (response.ok) {  // Si le status de la requête est accepté...
      response.json()
  .then((order) => {  // La promesse sera résolue : succès
    localStorage.setItem('order', JSON.stringify(order));
    contact = {};
    products = [];
    window.location = './confirmation.html';
  })
    } else {
      alert('Une erreur est survenue : Requête non acceptée \n' + 'Status code de la réponse : ' + response.status + ' : '+ response.statusText);
    }
  })
  .catch((err) => console.log('erreur lors de la requette POST ' + err)); // La promesse sera rompue : Erreur
}


function validForm(products) {
  let formContact = document.querySelector(".form-contact");

  formContact.addEventListener("submit", function (event) {
  if (checkInput() == true) {
    event.preventDefault();

    //création de l'objet order
    let order = {contact,products};
    let orderString = JSON.stringify(order);

    //Envoi de orderString dans la fonction
    postOrder(orderString);  
  } 
  else {
    event.preventDefault();
  }  
});
}








