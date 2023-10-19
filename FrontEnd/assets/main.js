/*********************************************************************************
 *
 * Ce fichier contient toutes les fonctions nécessaires à la page index.html
 *
 *********************************************************************************/



/*************************************************************************/
/****************************** VARIABLES GLOBALES ***********************/
/*************************************************************************/
const body = document.querySelector("body");



/*************************************************************************/
/****************************** AFFICHAGE DES PROJETS ********************/
/*************************************************************************/
/**
 * Fonction "projectShow" qui permet d'afficher les projets sur la homepage.
 * @param {Array} tab Tableau des projets
 */
async function projectShow(){

  //***************************************
  //********** Connexion à l'API **********
  //***************************************
  const gallery = document.querySelector(".gallery");
  const response = await fetch(`http://localhost:5678/api/works/`);
  const data = await response.json();

  // Affichage des éléments de data
  let galleryContent = "";
  for (let i = 0; i < data.length; i++) {
    galleryContent +=
    `
    <figure>
    <img src="${data[i].imageUrl}" alt="${data[i].title}">
    <figcaption>${data[i].title}</figcaption>
    </figure>`;
  }
  gallery.innerHTML = galleryContent;
}


/*************************************************************************/
/****************************** FILTRE DES PROJETS ***********************/
/*************************************************************************/
/**
 * Fonction "projectShowFilter" qui permet de filtrer l'affichage des projets.
 * @param {Array} data 
 */
async function projectShowFilter(data){

  //***************************************
  //********** Connexion à l'API **********
  //***************************************
  const gallery = document.querySelector(".gallery");
  console.log(data);
  //***************************************

  let galleryContent = "";
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i]);
    galleryContent +=
    `
    <figure>
    <img src="${data[i].imageUrl}" alt="${data[i].title}">
    <figcaption>${data[i].title}</figcaption>
    </figure>`;
  }
  gallery.innerHTML = galleryContent;
}



/*************************************************************************/
/****************************** MODIFICATION DU DOM : MODE EDIT **********/
/*************************************************************************/
document.addEventListener("DOMContentLoaded", function() {
  // Le code sera exécuté après que le DOM soit complètement chargé
  let acces = localStorage.getItem("accessToken");

  // Code éxécuté si absence du token : génération des éléments vide
  if (acces == null){
    document.querySelector('.modeEdition').innerHTML = `<div></div>`;
    document.querySelector('.titleEdit').innerHTML = `<div></div>`;
    document.querySelector('header nav ul').innerHTML =`
    <li><a href="index.html#portfolio">Projets</a></li>
		<li><a href="index.html#contact">Contact</a></li>
		<li><a href="./login.html">Login</a></li>
		<li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
    `
  }

  // Code éxécuté si présence du token : génération des éléments complets
  else if (acces = "true") {
    // Création du header édition
    document.querySelector('.modeEdition').innerHTML = 
    `
    <div class="edit-mode">
      <i class="fa-regular fa-pen-to-square"></i>
      <p>Mode édition</p>
    </div>
    `;

    // Modification de la zone de filtre
    document.querySelector('.titleEdit').innerHTML = 
    `
    <h2>Mes Projets</h2>
			<div class="edit">
				<div id="editPortfolio">
					<i class="fa-regular fa-pen-to-square"></i>
					<p>modifier</p>
				</div>
			</div>
    `

    // Modification de la navbar
    document.querySelector('header nav ul').innerHTML =`
    <li><a href="index.html#portfolio">Projets</a></li>
		<li><a href="index.html#contact">Contact</a></li>
		<li><a href="index.html" class="logout">Logout</a></li>
		<li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
    `
  }

  // Fonctionnalité "Logout" de la navbar
  document.querySelector(".logout").addEventListener('click', (e) =>{
    localStorage.removeItem('userToken');
    localStorage.removeItem('accessToken');
    location.reload();
  })

  // Appel de la fonction "showModal1" pour générer la première modale d'édition
  document.querySelector("#editPortfolio").addEventListener('click', (e) =>{
    console.log("test");
    showModal1()
    body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  })
});



/*************************************************************************/
/****************************** CREATION DE LA MODALE 1 ******************/
/*************************************************************************/
/**
 * Fonction "showModal1" en charge des fonctionnalités de la modale 1
 */
async function showModal1() {
  // Récupérations des données de l'API pour affichage
  const newresponse = await fetch(`http://localhost:5678/api/works/`);
  const newdata = await newresponse.json();

  // Création du contenu de la modale
  document.querySelector('.edit-1').innerHTML = 
  `
  <i class="fa-solid fa-xmark" id="closeEdit-1"></i>
  <h2>Galerie photo</h2>
  <div class="img-area">
    
  </div>
  <div id="btn-area1">
    <button>Ajouter une photo</button>
  </div>
  `
  // Création d'une "card" par item du tableau data de l'API
  for (let i = 0; i < newdata.length; i++) {
    const img = newdata[i].imageUrl;
    document.querySelector(".img-area").innerHTML += 
    `
    <div class="img-area-display">
      <img src="${img}" alt="">
      <i id = "${i}" class="fa-solid fa-trash-can trash"></i>
    </div>
    `
    // Fonctionnalité "suppression" des cards
    const allIcons = document.querySelectorAll('.img-area-display i');
    allIcons.forEach((icon, index) => {
        icon.addEventListener("click", ()=>{
        const Token = localStorage.getItem("userToken");
        fetch(`http://localhost:5678/api/works/${newdata[index].id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        })
        .then(data => {
          body.style.backgroundColor = "rgba(255, 254, 248, 1)";
          projectShow();
          document.querySelector(".edit-1").innerHTML = "";
        })
        .catch(error => {
          console.error('Erreur:', error);
        });
      })
  });

}

  // Fermeture de la modale au click sur la croix
  document.querySelector('.edit-1').style.display = "block"
  document.querySelector("#closeEdit-1").addEventListener("click", ()=>{
    document.querySelector(".edit-1").innerHTML = "";
    body.style.backgroundColor = "rgba(255, 254, 248, 1)";
  })

  // Ouverture de la modale 2 au click sur le bouton et fermeture de la modale 1
  document.querySelector('#btn-area1').addEventListener("click", () => {
    document.querySelector(".edit-1").innerHTML = "";
    showModal2()
  })
}



/*************************************************************************/
/****************************** CREATION DE LA MODALE 2 ******************/
/*************************************************************************/
/**
 * Fonction "showModal2" en charge des fonctionnalités de la modale 2
 */

async function showModal2() {
// Création du contenu de la modale
  document.querySelector('.edit-2').innerHTML = 
  `
  <form class="edit-2">
    <div class="edit-2-icons">
      <i class="fa-solid fa-xmark" id="closeEdit-2"></i>
      <i class="fa-solid fa-arrow-left" id="returnEdit-1"></i>
    </div>
    <h2>Ajout photo</h2>
    <div class="upload-box">
      <input type="file" id="imageUpload" accept="image/*" required>
      <label for="imageUpload" class="upload-label">
      <div class="upload-background"></div>
    </div>
    <label for="edit2Title">Titre</label>
    <input type="text" id="edit2Title" required>

    <label for="edit2Categorie">Catégorie</label>
    <select id="categorySelect" name="categories" required>
      <option value="1">Objets</option>
      <option value="2">Appartements</option>
      <option value="3">Hôtels & Restaurants</option>
    </select>
    <div id="btn-area2">
      <button>Valider</button>
    </div>
  </form>
  `

  // Retour à la modale 1 au click sur la flèche
  document.querySelector("#returnEdit-1").addEventListener("click", () =>{
    document.querySelector(".edit-2").innerHTML = "";
    showModal1();
  })
  
  // Modification de l'image dans l'input file
  const imageUpload = document.getElementById('imageUpload');
  imageUpload.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const uploadBackground = document.querySelector('.upload-background');
            uploadBackground.style.backgroundImage = `url(${e.target.result})`;
          };
          reader.readAsDataURL(file);
      }
  });

  // Récupération des éléments du formulaire pour envoie à l'API
  document.querySelector('.edit-2').addEventListener('submit', (e) =>{
    e.preventDefault();

    let titleInput = document.querySelector('#edit2Title');
    let categoryInput = document.querySelector('#categorySelect').value;
    let file = imageUpload.files[0];
    const Token = localStorage.getItem("userToken");
    console.log(titleInput.value);
    console.log(typeof categoryInput);
    const formData = new FormData();
    console.log(file);
    formData.append('image', file);
    formData.append('title', titleInput.value); console.log();
    formData.append('category', categoryInput);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${Token}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();

    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  });

  // Fermeture de la modale au click sur la croix
  document.querySelector("#closeEdit-2").addEventListener("click", ()=>{
    document.querySelector(".edit-2").innerHTML = ""
    body.style.backgroundColor = "rgba(255, 254, 248, 1)";
  })
  document.querySelector('.edit-2').style.display = "block"
};



/*************************************************************************/
/****************************** GENERATION DES PROJETS *******************/
/*************************************************************************/
/**
 * Fonction "projectShow" en charge de la génération des projets
 */
const response = await fetch(`http://localhost:5678/api/works/`);
const data = await response.json();

projectShow();
const gallery = document.querySelector(".gallery");

//Annuler les filtres de la gallerie
document.querySelector(".filterAll").addEventListener("click", () =>{
  gallery.innerHTML = "";
  projectShow();
});
//Affiche uniquement la catégorie "objet" dans la gallerie
document.querySelector(".filterObjects").addEventListener("click", async () =>{
  const newresponse = await fetch(`http://localhost:5678/api/works/`);
  const newdata = await newresponse.json(); 
  const filterObject = newdata.filter(elt => elt.category.name === "Objets");
  gallery.innerHTML = "";
  projectShowFilter(filterObject);
});
//Affiche uniquement la catégorie "appartements" dans la gallerie
document.querySelector(".filterAppartments").addEventListener("click", async () =>{
  const newresponse = await fetch(`http://localhost:5678/api/works/`);
  const newdata = await newresponse.json(); 
  const filterObject = newdata.filter(elt => elt.category.name === "Appartements");
  
  gallery.innerHTML = "";
  projectShowFilter(filterObject);
});
//Affiche uniquement la catégorie "hotel & restaurants" dans la gallerie
document.querySelector(".filterHotelsAndRestaurants").addEventListener("click", async () =>{
  const newresponse = await fetch(`http://localhost:5678/api/works/`);
  const newdata = await newresponse.json(); 
  const filterObject = newdata.filter(elt => elt.category.name === "Hotels & restaurants");
  gallery.innerHTML = "";
  projectShowFilter(filterObject);
});




/*************************************************************************/
/****************************** REGEX CONTACT FORM ***********************/
/*************************************************************************/

const contactMsg = document.querySelector(".contactMsg");

document.querySelector(".contactForm").addEventListener("submit", () =>{
  const emailInput = document.getElementById("email");
  const email = emailInput.value;
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  if (!regex.test(email)) {
    contactMsg.textContent = "Veuillez entrer une adresse e-mail valide.";
    event.preventDefault(); // Empêche la soumission du formulaire
    console.log("pas ok");
    emailInput.style.border = "2px solid red";
  } else {
    // Reset le style et le message d'erreur si l'email est valide
    emailInput.style.border = "none"; // ou autre style par défaut
    contactMsg.textContent = "";
  }
});