function eid(id){
    return document.getElementById(id);
}
function etid(id){
    eid(id).textContent = eval(id);
}
function etc(id, classe, nouveau){
    eid(id).getElementsByClassName(classe)[0].textContent = nouveau;
}
function ec(f){
    eid(f.name).addEventListener("click", f);
}
function ac(parent, children){
    eid(parent).appendChild(children)
}
var Niveau = 0;
var Or = 1000;
var Or_Gagné = 0;
var Or_Dépensé = 0;
var Nombre_Moulins = 0;
var Nombre_Baguettes = 0;
var Baguettes_Produites = 0;
var Nombre_Farine = 100;
var Farine_Produite = 0;
var Prix_Niveau = 100;
var Prix_Moulin = 80;
var open = eid("Boulangerie")
var Boulangerie_run
etid("Niveau");
etid("Or");
etid("Or_Gagné");
etid("Or_Dépensé");
etid("Nombre_Moulins");
etid("Nombre_Baguettes");
etid("Baguettes_Produites");
etid("Nombre_Farine");
etid("Farine_Produite");
etid("Prix_Niveau");
etid("Prix_Moulin");
var tableaucommande = eid("tableaucommandes")
for (i = 0; i < 10; ++i){
    let newligne = document.createElement("tr")
    newligne.id = i;
    let newnum = document.createElement("td");
    newnum.className = "num";
    newligne.appendChild(newnum);
    let newbag = document.createElement("td");
    newbag.className = "baguettes"
    newligne.appendChild(newbag);
    let newPU = document.createElement("td");
    newPU.className = "Prix_Unitaire";
    newligne.appendChild(newPU);
    let PT = document.createElement("td");
    PT.className = "Prix_Total";
    newligne.appendChild(PT);
    let TR = document.createElement("td");
    TR.className = "Temps";
    newligne.appendChild(TR);
    let dyn = document.createElement("td");
    dyn.className = "Actions_dynamiques";
    dyn.textContent = "En attente..."
    newligne.appendChild(dyn);
    tableaucommande.appendChild(newligne);
}
var maxid = 0;
class commande {
    constructor(i){
        this.id = ++maxid;
        etc(i, "num", this.id);
        //bag : nombre total de baguettes dans la commande
        this.bag = gri(5, 30 * Niveau);
        etc(i, "baguettes", this.bag);
        //bagf : nombre de baguettes finies
        this.bagf = 0;
        this.prix = grf(Niveau/100, 30 * Niveau / 100);
        etc(i, "Prix_Unitaire", this.prix);
        this.total = Math.floor(this.bag * this.prix * 100)/100;
        etc(i, "Prix_Total", this.total);
        this.temps = 90;
        etc(i, "Temps", this.temps);
        this.status = "nouvelle";
        let y = document.createElement("button");
        y.addEventListener("click", () => {ajoutercommande(i)})
        y.textContent = "Y"
        let n = document.createElement("button");
        n.textContent = "N"
        n.addEventListener("click", () => {commandes[i]=new attente(i)})
        eid(i).getElementsByClassName("Actions_dynamiques")[0].textContent = "";
        console.log(eid(i).getElementsByClassName("Actions_dynamiques"))
        eid(i).getElementsByClassName("Actions_dynamiques")[0].appendChild(y);
        eid(i).getElementsByClassName("Actions_dynamiques")[0].appendChild(n);
    }
}
class attente{
    constructor(i){
        this.temps = gri(10, 60);
        etc(i,"Temps", this.temps);
        while(eid(i).getElementsByClassName("Actions_dynamiques")[0].childNodes.length > 0){
            eid(i).getElementsByClassName("Actions_dynamiques")[0].childNodes[0].remove()
        }
        etc(i, "num", "N/A");
        etc(i, "baguettes", "N/A");
        etc(i, "Prix_Unitaire", "N/A");
        etc(i, "Prix_Total", "N/A")
        etc(i, "Actions_dynamiques", "En Attente...");
    }
}
function gri(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}
function grf(min, max){
    return Math.floor((Math.random() * (max - min) + min) * 100)/100
}
var commandes = []

function Gestion_Commandes(){
    for (let i = 0; i < 10; i++){
        if(commandes[i] == undefined){
            commandes[i] = new attente(i);
        } else {
            switch (commandes[i].constructor){
                case attente:
                    if (commandes[i].temps > 1){
                        --commandes[i].temps;
                        etc(i,"Temps", commandes[i].temps)
                    }
                    else {
                        commandes[i] = new commande(i);
                    }
                    break;
                case commande:
                    if (commandes[i].status != "nouvelle"){
                        if (Nombre_Baguettes > 0){
                            --Nombre_Baguettes;
                            ++commandes[i].bagf
                            etid("Nombre_Baguettes");
                            console.log(commandes[i].bagf + "/" + commandes[i].bag)
                            etc(i, "Actions_dynamiques", commandes[i].bagf + "/" + commandes[i].bag)
                        }
                        if(commandes[i].bagf >= commandes[i].bag ){
                            Or += Math.round(commandes[i].total * 100)/100;
                            Or_Gagné += Math.round(commandes[i].total * 100)/100;
                            etid("Or");
                            etid("Or_Gagné");
                            commandes[i] = new attente(i);
                            break;
                        }
                    }
                    if(commandes[i].temps > 0){
                        --commandes[i].temps;
                        etc(i, "Temps", commandes[i].temps);
                    }else{
                        commandes[i] = new attente(i);
                    }
                    break;
                case 'default':
                    console.log("erreur détectée");
            }
        }
    }
}
const commandes_interval = setInterval(Gestion_Commandes, 1000);

function ajoutercommande(i){
    commandes[i].status = "validée";
    commandes[i].temps = 90;
    while(eid(i).getElementsByClassName("Actions_dynamiques")[0].childNodes.length > 0){
        eid(i).getElementsByClassName("Actions_dynamiques")[0].childNodes[0].remove()
    }
    etc(i, "Actions_dynamiques", "0/" + commandes[i].bag)
}

function Boulangerie(){
    if(!Boulangerie_run){
        Boulangerie_run = setInterval(Boulangerie_operation, 1000);
        open.textContent = "Fermer la boulangerie";
    } else {
        clearInterval(Boulangerie_run);
        Boulangerie_run = null;
        open.textContent= "Ouvrir la boulangerie";
    }
}
function Boulangerie_operation(){
    let Od = 0.05 * Niveau * Nombre_Moulins;
    let NewOr = Or - Od
    let NewFarine = Nombre_Farine + Nombre_Moulins - (Niveau + 1);
    if (NewOr >= 0 && NewFarine >=0){
        Or = Math.round(NewOr * 100) / 100;
        Or_Dépensé += Od
        Or_Dépensé = Math.round(Or_Dépensé * 100) / 100
        Nombre_Farine = NewFarine;
        Farine_Produite += Nombre_Moulins;
        Nombre_Baguettes += Niveau;
        Baguettes_Produites += Niveau;
        etid("Or");
        etid("Or_Dépensé")
        etid("Nombre_Baguettes");
        etid("Baguettes_Produites");
        etid("Nombre_Farine");
        etid("Farine_Produite");
    }
    else {
        console.log("Vous êtes a court d'or ou de farine")
    }
}

function niveauplus(){
    if(Or > Prix_Niveau){
        Or -= Prix_Niveau;
        Or_Dépensé += Prix_Niveau
        ++Niveau;
        Prix_Niveau = Math.round(Prix_Niveau * 150) /100;
        etid("Or");
        etid("Niveau");
        etid("Prix_Niveau");
        etid("Or_Dépensé");
    }
}

function moulinplus(){
    if(Or > Prix_Moulin){
        Or -= Prix_Moulin;
        Or_Dépensé += Prix_Moulin;
        ++Nombre_Moulins;
        Prix_Moulin = Math.round(Prix_Moulin * 150) /100;
        etid("Or");
        etid("Nombre_Moulins");
        etid("Prix_Moulin");
        etid("Or_Dépensé");
    }
}
ec(Boulangerie);
ec(niveauplus);
ec(moulinplus);