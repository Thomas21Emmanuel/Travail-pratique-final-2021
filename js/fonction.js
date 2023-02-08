

function enleverIntro() {
	window.removeEventListener("click", enleverIntro);
    //On enlève le conteneur de l'intro
    let intro = d.querySelector("#intro");
    intro.parentNode.removeChild(intro);
    

    //On met le conteneur du quiz visible
    d.querySelector(".quiz").style.display = "block";

    //On affiche la première question
    afficherQuestion(quiz.question1);
    let transition = document.querySelector(".quiz");
    transition.classList.add("transition");
    
}

function afficherQuestion(question) {

    //On récupère les balises où seront affichées les infos
    let titreQuestion = d.querySelector("#titreQuestion");
    titreQuestion.innerHTML = question.texte;
    
    
    let lesChoixDeReponses = d.querySelector("#lesChoix");
    let nbReponses = question.choix.length;
	let unChoix;
	let texteDuChoix;

    for (let i = 0; i < nbReponses; i++) {
		//on crée un élément choix
		unChoix = d.createElement("div");
		//on créé un objet texte pour le choix
		texteDuChoix = d.createTextNode(question.choix[i]);
		//ajout du texte comme enfant
		unChoix.appendChild(texteDuChoix);
		//ajout d'une classe choix
		unChoix.classList.add("choix");
		//si c'est la bonne réponse...
		if(i==question.bonneReponse){
			//affecte la valeur vraie
			unChoix.reponse = true;
		} else {
			//..sinon affecte la valeur fausse
			unChoix.reponse = false;
		}
       
		//On met un écouteur pour vérifier la réponse choisie
       unChoix.addEventListener("mousedown", verifierReponse);
		lesChoixDeReponses.appendChild(unChoix); 
    }
}

function verifierReponse(event){
    //si c'est la bonne réponse...
	if(event.target.reponse){
		//ajoute 1 au compteur de bonnes réponses
		noBonnesReponses++;
		//affiche feedback positif
		event.target.classList.add("bonChoix");
        
        let foot = document.querySelector("footer");
        
        foot.innerHTML = "Bonne Réponse";
        
        foot.classList.add("animBon");
        
        
        
	} else{
		//sinon affiche feedback négatif
		event.target.classList.add("mauvaisChoix");
        
        let foot = document.querySelector("footer");
        
        foot.innerHTML = "Mauvaise Réponse";
        
        foot.classList.add("animMauvais");

        
	}
	
	//empêche d'autres choix
	let lesChoix = d.querySelectorAll(".choix");
	for (let unChoix of lesChoix) {
		unChoix.removeEventListener("mousedown", verifierReponse);
	}
	
	//affiche message pour continuer
	d.querySelector("header").innerText="Cliquez ici pour continuer";
    
	//pour permettre la suite
	d.querySelector("header").addEventListener("click", gererProchaineQuestion);
    
}

function gererProchaineQuestion() {
	//vide pied de page
    let foot = document.querySelector("footer");
    foot.classList.remove("animMauvais");
    foot.classList.remove("animBon");
	d.querySelector("header").innerText="";
    d.querySelector("footer").innerText="";
	//enlève l'écouteur
	d.querySelector("header").removeEventListener("click", gererProchaineQuestion);
	
    //On incrémente le no de la prochaine question à afficher
    noQuestion++;

	//dans tous les cas, on enlève les choix
	let aEnlever = d.querySelectorAll(".choix");
	let leurParent = aEnlever[0].parentNode;
		
	while (leurParent.hasChildNodes()){
		//console.log(leurParent.firstChild);
		leurParent.removeChild(leurParent.firstChild);
	}
		
    //S'il reste une question on l'affiche, sinon c'est la fin du jeu...
    if (noQuestion <= quiz.nbQuestions) {		
        //On identifie la prochaine question et on l'affiche
        let prochaineQuestion = quiz["question" + noQuestion];
        let transition = document.querySelector(".quiz");
        transition.style.webkitAnimation = 'none';
        setTimeout(function() {
        transition.style.webkitAnimation = '';
    }, 10);
        afficherQuestion(prochaineQuestion);
        
    } else {
        afficherFinJeu();
    }
}

function afficherFinJeu() {
    //On enlève le quiz de l'affichage et on affiche la fin du jeu
    d.querySelector(".quiz").style.display = "none";
	
	//Message de résultat
	let leResultat;
	
	//on affiche le score
    let pourcentage = noBonnesReponses * 100 / quiz.nbQuestions;
	leResultat= `<p>Votre score est de ${noBonnesReponses} sur ${quiz.nbQuestions} pour un pourcentage de ${pourcentage}%</p>`
	
	//on vérifie le meilleur score et on l'affiche
	//on sauvegarde le meilleur score si nécessaire
	let meilleurScore = localStorage.getItem("leMeilleur");
		
	if (meilleurScore==null){
		leResultat += `<p>C'est un record!!</p>`
		localStorage.setItem("leMeilleur", noBonnesReponses);		
	}
	
	if (meilleurScore < noBonnesReponses){
		leResultat += `<p>Nouveau record atteint. Fécilications !</p>`
		localStorage.setItem("leMeilleur", noBonnesReponses)	
	} else {
		leResultat += `<p>Le meilleur résultat est: ${meilleurScore}</p>`
	}
	
	d.querySelector("#fin").innerHTML = leResultat;
	
	//on offre la possibilité de reprendre le quiz
	let unBouton = d.createElement("button");
	let sonTexte = d.createTextNode("Cliquez ici pour recommencer");
	unBouton.appendChild(sonTexte);
	unBouton.addEventListener("click", pourRecommencer);
	d.querySelector("#fin").appendChild(unBouton);
	
	//..et on affiche le tout
    d.querySelector("#fin").style.display = "block";
}


/**
 * Fonction permettant de recommencer
 * 
 */
function pourRecommencer() {
	//Ré-initialisation
	noQuestion = 1; 
	noBonnesReponses = 0; 
	afficherQuestion(quiz.question1);
	
	//vide et cache la fin
	let laFin = d.querySelector("#fin");
	while (laFin.hasChildNodes()){
		laFin.removeChild(laFin.firstChild);
	}
	d.querySelector("#fin").style.display = "none"; 
	
	//montre le quiz
	d.querySelector(".quiz").style.display = "block"; 
}
