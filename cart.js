let cart = [];

function addToCart(product) {
    // Verifica se o produto já está no carrinho
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartTable();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartTable();
}

function updateCartTable() {
    const tableBody = document.querySelector("#cart-table tbody");
    const totalPriceEl = document.querySelector("#total-price");
    const emptyCartMessage = document.querySelector("#empty-cart-message");

    // Limpa o conteúdo da tabela
    tableBody.innerHTML = "";

    if (cart.length === 0) {
        // Mostra a mensagem se o carrinho estiver vazio
        emptyCartMessage.style.display = "block";
    } else {
        // Oculta a mensagem se houver itens no carrinho
        emptyCartMessage.style.display = "none";
    }

    let totalPrice = 0;

    cart.forEach(product => {
        const total = product.price * product.quantity;
        totalPrice += total;

        const row = `
            <tr>
                <td>${product.name}</td>
                <td>
                    <input type="number" value="${product.quantity}" min="1" 
                           onchange="updateQuantity(${product.id}, this.value)">
                </td>
                <td>R$ ${product.price.toFixed(2)}</td>
                <td>R$ ${total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${product.id})">Remover</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });

    totalPriceEl.textContent = totalPrice.toFixed(2);
}

function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
    }
    updateCartTable();
}

// Evento de clique no botão "Adicionar ao Carrinho"
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const product = {
            id: parseInt(button.dataset.id),
            name: button.dataset.name,
            price: parseFloat(button.dataset.price),
        };
        addToCart(product);
    });
});
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartTable();
    }
}

// Carrega o carrinho ao abrir a página
loadCart();

//Implementa lógica para o checkout
function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function setupCheckout() {
    const totalValue = calculateCartTotal();
    document.getElementById("total-value").textContent = totalValue.toFixed(2);

    document.querySelectorAll(".method").forEach(method => {
        method.addEventListener("click", function () {
            document.querySelectorAll(".method").forEach(m => m.classList.remove("blue-border"));
            this.classList.add("blue-border");
        });
    });

    document.querySelector(".next-btn").addEventListener("click", function () {
        const cardInputs = document.querySelectorAll(".input-fields input");
        let isValid = true;

        cardInputs.forEach(input => {
            if (!input.value) {
                input.classList.add("warning");
                isValid = false;
            } else {
                input.classList.remove("warning");
            }
        });

        if (isValid) {
            console.log("Finalizando compra com os dados:", cart);
            // Envio de dados ao backend aqui
        }
    });
}

//Calcula taxa de entrega, caso selecionada
document.querySelectorAll("input[name='delivery-method']").forEach(radio => {
    radio.addEventListener("change", function () {
        const deliveryFee = this.value === "entrega" ? 10.00 : 0.00; // Exemplo de taxa fixa
        document.querySelector("#delivery-fee").textContent = deliveryFee.toFixed(2);
        updateTotal(deliveryFee);
    });
});

document.addEventListener("DOMContentLoaded", setupCheckout);