/*********************************************************************************
 *
 * Ce fichier contient toutes les fonctions nécessaires au login
 *
 *********************************************************************************/

const url = "http://localhost:5678/api/users/login";

document.querySelector('#login form').addEventListener('submit', (e)=> {
    e.preventDefault()
    let emailInput = document.querySelector('input[type = email]').value;
    let passwordInput = document.querySelector('input[type = password]').value;
    
    const userData = {
        email: emailInput,
        password: passwordInput
    };
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    };
    
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur réseau ou côté serveur");
        }
        return response.json();
    })
    .then(data => {
        const token = data.token;
        console.log("Token reçu:", token);
        window.location.href = "./index.html"
        // Vous pouvez par exemple sauvegarder ce token dans le localStorage ou ailleurs
        localStorage.setItem("userToken", token);
        localStorage.setItem("accessToken", "true")
    })
    .catch(error => {
        console.error("Une erreur s'est produite:", error.message);
        document.querySelector(".errorLogin").textContent = "Woups, erreur d'identifiants ?" 

    });

    
});

