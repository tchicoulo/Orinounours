"use strict";

function getJsonId() {
  
  //URLSearchParams
  let queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const nounoursId = urlParams.get("id");

  fetch("http://localhost:3000/api/teddies/" + nounoursId)
    .then((response) => {  // Retourne une Promesse (résolue ou rompue)
      if (response.ok) {  // Si le status de la requête est accepté...
        response.json()
      .then((data) => { // La promesse sera résolue : succès
        showProduct(data);
        addToCart(data);
    })
      } else {
        alert('Une erreur est survenue : Requête non acceptée \n' + 'Status code de la réponse : ' + response.status + ' : '+ response.statusText);
      }
    })
    .catch((err) => console.log("erreur" + err)); // La promesse sera rompue : Erreur
}

// Voir le produit sélectionné dans la page product.html
function showProduct(jsonId) {
  //Lien avec la page
  let productContent = document.querySelector(".content_product_js");

  // Creation d'éléments
  let productDivLeft = document.createElement("div");
  let productH2 = document.createElement("h2");
  let productP = document.createElement("p");
  let productSelect = document.createElement("select");
  let productOptionHeading = document.createElement("option");
  let productPrice = document.createElement("h3");
  
  let productDivRight = document.createElement("div");
  let productImg = document.createElement("img");
  let productButton = document.createElement("button");

  // Ajout de classes
  productDivLeft.classList.add("product");
  productH2.classList.add("product__name");
  productP.classList.add("product__description");
  productSelect.classList.add("product__select");
  productPrice.classList.add("product__price");
  //
  productDivRight.classList.add("product");
  productImg.classList.add("product__img");
  productButton.classList.add("product__add");

  // Ajout d'attributs

  productOptionHeading.setAttribute("disabled", "true");
  productOptionHeading.setAttribute("selected", true);
  productImg.setAttribute("src", jsonId.imageUrl);
  productImg.setAttribute("alt", "Image de " + jsonId.name);

  //injection de texte
  productH2.textContent = jsonId.name;
  productP.textContent = jsonId.description;
  productPrice.textContent = "Prix : " + jsonId.price / 100 + " €";
  productButton.textContent = "Ajouter au panier";

  //appenChild
  productDivLeft.appendChild(productH2);
  productDivLeft.appendChild(productP);
  productDivLeft.appendChild(productSelect);
  productDivLeft.appendChild(productPrice);

  productDivRight.appendChild(productImg);
  productDivRight.appendChild(productButton);

  productContent.appendChild(productDivLeft);
  productContent.appendChild(productDivRight);

  // Boucle pour ajouter chaque couleur dans la balise option
  jsonId.colors.forEach((elem) => {
    let productOption = document.createElement("option");
    productOption.innerHTML = elem;
    productSelect.appendChild(productOption);
  });

  //J'insère la premiere option comme header a mon select
  productOptionHeading.textContent = "Choisissez une couleur";
  productSelect.insertAdjacentElement("afterbegin", productOptionHeading);
}

//function ajouter au panier
function addToCart(product) {
  let boutonAdd = document.querySelector(".product__add");
  let productSelect = document.querySelector(".product__select");

  boutonAdd.addEventListener("click", function () {
    // Si une couleur a été sélectionné...
    if (productSelect.selectedIndex != 0) {
      cartNumbers(product);
      totalCost(product);
    } else {
      alert("Veuillez sélectionner une couleur");
    }
  });
}

// Charger automatiquement le nombre d'articles dans le compteur du panier
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart-numbers").textContent = productNumbers;
  }
}

//Nombre d'articles dans le panier avec localStorage
function cartNumbers(product) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers); // données String converti en nombre puisque (par défaut) localStorage enregistre tout types de données en string.
  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart-numbers").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart-numbers").textContent = 1;
  }
  setItems(product);
}

//Ajouter les produits dans le localStorage
function setItems(product) {
  let productSelect = document.querySelector(".product__select");
  let colorSelected = productSelect.value;
  let cartItems = localStorage.getItem("productInCart");

  cartItems = JSON.parse(cartItems); //convertir en Objet
  // si l'objet existe
  if (cartItems != null) {
    if (cartItems[product.name] == undefined) {
      cartItems = {
        ...cartItems,
        [product.name]: product,
      };
    }
    if (cartItems[product.name].inCart == null) {
      cartItems[product.name].inCart = 0;
    }
    
    cartItems[product.name].colors= colorSelected;
    cartItems[product.name].inCart += 1;
  } else {  //si l'object n'existe pas
    product.colors= colorSelected;
    product.inCart = 1;
    cartItems = {
      [product.name]: product,
    };
  }
  localStorage.setItem("productInCart", JSON.stringify(cartItems)); // objet converti en string pour localStorage

}

//Prix total du panier dans le localStorage
function totalCost(product) {
  let cartCost = localStorage.getItem("totalCost");

  if (cartCost != null) {
    //String to Number
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price / 100);
  } else {
    localStorage.setItem("totalCost", product.price / 100);
  }
}

onLoadCartNumbers();
getJsonId();
