"use strict";

function getJsonFile() {

  fetch("http://localhost:3000/api/teddies/")
    .then((response) => { // Ceci me retournera une Promesse (résolue ou rompue) 
      if(response.ok) { // Si le status de la requête est accepté...
        response.json()  
      .then((data) => { // La promesse sera résolue : succès
       showTeddies(data);
    })
      } else {
        alert('Une erreur est survenue : Requête non acceptée \n' + 'Status code de la réponse : ' + response.status + ': '+ response.statusText);
      }
    })
    .catch((error) => console.log("error : " + error)); // La promesse sera rompue : Erreur
}

function showTeddies(teddies) {
  teddies.forEach((teddy) => {
    // Lien avec Page index.html
    let mainContent = document.querySelector(".content_js");

    // Création d'élements
    let myArticle = document.createElement("article");
    let myImg = document.createElement("img");
    let myH2 = document.createElement("h2");
    let myH3 = document.createElement("h3");
    let myA = document.createElement("a");

    //Ajout de classes / attributs /style
    myArticle.classList.add("cards");
    myImg.setAttribute("src", teddy.imageUrl);
    myImg.setAttribute("alt", "Photo de l'ours en peluche");
    myImg.style.height = "50%";
    myA.setAttribute("href", "./product.html?id=" + teddy._id);
    myA.classList.add("btn_product");

    //Injection de texte
    myH2.textContent = teddy.name;
    myH3.textContent = teddy.price / 100 + " €";
    myA.textContent = "Voir le produit";

    // AppendChild
    myArticle.appendChild(myImg);
    myArticle.appendChild(myH2);
    myArticle.appendChild(myH3);
    myArticle.appendChild(myA);
    mainContent.appendChild(myArticle);
  });
}

getJsonFile();
