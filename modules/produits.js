import { API, TOKEN } from '../data/api.js';
import Panier from './panier.js';
export default (() => {
    let listeElement;

    return {
        async start() {
            listeElement = document.querySelector('#liste-produits');
            const listeProduits = await this.getProducts();
            this.construireListe(listeProduits);
        },
        async getProducts() {

            const res = await fetch(`${API}products?&token=${TOKEN}`,
                {
                    header: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );

            const json = await res.json();


            return json;
        },
        construireListe(listeProduits) {
            //console.log('Construire la liste des produits : ', listeProduits)
            let listOfProducts = '';
            listeProduits.forEach(x =>
                listOfProducts += `<div class="product" data-id="${x.id}">
                <div class="photo">
                    <img src='${x.photo}' />
                </div>
                <h2>${x.nom}</h2>
                <p>${x.description}</p>
                <div class="row">
                    <button class="add-product">Add</button>
                    <span>${x.prix}€</span>
                </div>
            </div>
            ` );
            document.getElementById("liste-produits").innerHTML = listOfProducts;

            const buttons = listeElement.getElementsByClassName("add-product");

            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                button.addEventListener("click", async () =>{
                    await Panier.addToCart(button.closest(".product").dataset.id);
                });
            }


        }
    }
})();