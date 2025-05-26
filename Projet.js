const codePostal = document.getElementById("codeP")
const inputV = document.getElementById("inputCode")

codePostal.addEventListener('click', () => {
    event.preventDefault();  // Empêche le rechargement de la page

    const code = inputV.value
    //alert(code)
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${code}`)

    
        .then(response => response.json())
        .then(data => {
            console.table(data)
            return(data)
        })
})

/* event.preventDefault() : Ton code HTML et JavaScript est bien structuré pour démarrer une recherche de communes via le code postal. Cependant, il y a un problème courant ici : le comportement par défaut du bouton dans un formulaire HTML est de soumettre le formulaire, ce qui provoque un rafraîchissement de la page, interrompant le fonctionnement du JavaScript (fetch).
Il faut empêcher le rechargement de la page lors du clic sur le bouton en ajoutant event.preventDefault() dans le gestionnaire d'événement.


/*
fetch(url)
.then(response => response.json())
.then(data => {
    let adviceElement = document.createElement('p');

})
*/


/*

DOM : ???
defer: execution une foie la page charché

fonction asynchrone : on connais pas reponse du serveur
await : attendre la reponse

console table : liste d'enregistrement de maniere tabulaire
innerhtml : ecrit du html dans la balise


commune.appendChild(optino) : ajoute option dans le select


communeSelect.style.display = "block";
validationButton.style.display = "block";

=> pas vilsible de base, donc on utilise block 

communeSelect.style.display = "block";
validationButton.style.display = "block";

=> masquer les deuc champs

createCard(data): 
*/