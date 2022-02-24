const cartes = document.querySelectorAll('.carte'); // on récupère toutes les cartes

let carteRetournee = false;
let premiereCarte, secondeCarte;
let verouillage = false; // Verrouillage des carte quand deux d entre elles sont retourner
let timeInSecs; // Variable pour le temps secs
let ticker;
let totalCartesRetourner = []; // On crée un tableau pour stocker les cartes retournées



cartes.forEach(carte => { // Pour chaque carte   
    carte.addEventListener('click', retourneCarte)  // on ajoute un écouteur d'événement sur chaque carte

})



function retourneCarte() { // Fonction pour retourner les cartes      

    if (verouillage) return; // Si le verouillage est activé, on ne fait rien

    this.childNodes[1].classList.toggle('active'); // On toggle la classe active sur la carte

    if (!carteRetournee) { // Si la carte n'est pas retournée

        carteRetournee = true; // On met la carte en retournée
        premiereCarte = this; // On met la première carte en variable
        return;
    }

    carteRetournee = false; // On remet la carte en non retournée
    secondeCarte = this; // On met la seconde carte en variable

    // console.log(premiereCarte, secondeCarte);

    correspondance(); // On appelle la fonction correspondance
}



function correspondance() { // Fonction pour vérifier si les cartes correspondent

    if (premiereCarte.getAttribute('data-attr') === secondeCarte.getAttribute('data-attr')) { // Si les cartes correspondent

        premiereCarte.removeEventListener('click', retourneCarte); // On supprime l'écouteur d'événement sur la première carte
        secondeCarte.removeEventListener('click', retourneCarte); // On supprime l'écouteur d'événement sur la seconde carte
        // ont ajouter les carte retoruner dans totalCartesRetourner
        totalCartesRetourner.push(premiereCarte); // On ajoute la première carte dans le tableau
        totalCartesRetourner.push(secondeCarte); // On ajoute la seconde carte dans le tableau
        if (totalCartesRetourner.length == 12) { // Si le nombre de carte retournées est égal à 12
            clearInterval(ticker);
            alert('Bravo ! Vous avez gagné en ' + timeInSecs + ' secondes !'); // On affiche un message de victoire
            sendBdd(tick()); // On envoi les données dans la base de données

        }
        console.log(totalCartesRetourner.length);
        // console.log(totalCartesRetourner);
    } else {
        verouillage = true; // Sinon on active le verouillage
        setTimeout(() => { // On met en place un timeout 

            premiereCarte.childNodes[1].classList.remove('active'); // On retire la classe active sur la première carte
            secondeCarte.childNodes[1].classList.remove('active'); // On retire la classe active sur la seconde carte

            verouillage = false; // On désactive le verouillage
        }, 1500) // On supprime le verouillage après 1.5 secondes
    }

    //si toute les cartes sont retournées on affiche le message de victoire et ont envoi en base de données le temps de jeu



}


function aleatoire() { // Fonction pour générer un nombre aléatoire
    cartes.forEach(card => { // Pour chaque carte
        let randomPos = Math.floor(Math.random() * 12); // On génère un nombre aléatoire entre 0 et 12
        card.style.order = randomPos; // On met la carte dans la position aléatoire
    })
}
aleatoire(); // On appelle la fonction aleatoire



function startTimer(secs) {
    timeInSecs = parseInt(secs);
    ticker = setInterval("tick()", 1000);
}

function tick() {
    var secs = timeInSecs;
    if (secs > 0) {
        timeInSecs--;
    }
    else {
        clearInterval(ticker);
        startTimer(1 * 60);
    }

    var mins = Math.floor(secs / 60);
    secs %= 60;
    var pretty = ((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs;



    if (pretty == "00:00") {  //si le temps est écoulé on envoi un message de défaite
        alert("temps écoulé");
        clearInterval(ticker);
    }

    document.getElementById("countdown").innerHTML = pretty; // On affiche le temps dans le HTML

    return pretty;
}

startTimer(1 * 60);


function sendBdd(timer) { // Fonction pour envoyer les données dans la base de données
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'bdd.php', true);
    xhr.send(JSON.stringify(timer));
}
