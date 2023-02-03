import { API, TOKEN } from '../data/api.js';

export default (() => {
    let cartContentElement = document.getElementById("panier-content");
    let cartElement = document.getElementById("panier");

    return {
        async start() {
            const products = await this.getProducts();
            this.buildView(products);
        },

        async addToCart(productId) {
            const res = await fetch(`${API}cart/${productId}?&token=${TOKEN}`,
                {
                    method: "POST",
                    header: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );

            const json = await res.json();

            this.buildView(json);
        },

        async removeProduct(productId){
            const res = await fetch(`${API}cart/${productId}?&token=${TOKEN}`,
            {
                method: "DELETE",
                header:{
                    'Access-Control-Allow-Origin': '*'
                }
            }
            );
            const json = await res.json();

            this.buildView(json);
        },

        async emptyCart() {
            const res = await fetch(`${API_ENDPOINT}cart?&token=${TOKEN}`,
                {
                    method: "DELETE",
                    header: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
        },

        async getProducts() {
            const res = await fetch(`${API_ENDPOINT}cart?&token=${TOKEN}`,
                {
                    method: "GET",
                    header: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );

            const json = await res.json();

            return json;
        },


        buildView(products) {
            let html = "<ul>";
            let total = 0;

            products.forEach(x => {
                let price = +x.qte * +x.prix;

                html += `
                    <li class="cart-product" data-id="${x.id}">
                        <span>${x.nom} x${x.qte} - ${price.toFixed(2)}€</span>
                        <button class="remove-product">Remove</button>
                    </li>
                `;

                total += price;
            })

            html += `</ul><span id="total">Total: ${total.toFixed(2)}€</span>`;

            cartContentElement.innerHTML = html;

            const buttons = cartContentElement.getElementsByClassName("remove-product");

            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];

                button.addEventListener("click", async () => {
                    await this.removeProduct(button.closest(".cart-product").dataset.id);
                });
            }
        }
    }
})();