// This file contains the JavaScript logic for handling user interactions, such as showing/hiding the form, adding items to the comparison list, and managing the array that stores the product data.

let products = [];
const productList = document.getElementById('comparisonList');
const addButton = document.getElementById('addButton');
const formContainer = document.getElementById('formContainer');
const form = document.getElementById('productForm');
const cancelButton = document.getElementById('cancelButton');

formContainer.style.display = 'none';

addButton.addEventListener('click', () => {
    formContainer.style.display = 'flex';
    addButton.style.display = 'none';
});

cancelButton.addEventListener('click', () => {
    formContainer.style.display = 'none';
    addButton.style.display = 'block';
    form.reset();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const productName = form.elements['productName'].value;
    const price = parseFloat(form.elements['productPrice'].value);
    const liters = parseFloat(form.elements['productVolume'].value);
    const consumption = parseFloat(form.elements['productConsumption'].value);
    
    if (productName && !isNaN(price) && !isNaN(liters) && !isNaN(consumption)) {
        const ratio = liters / consumption;
        const efficiencyCost = price / ratio;
        const product = { productName, price, liters, consumption, ratio, efficiencyCost };
        products.push(product);
        updateProductList();
        form.reset();
        formContainer.style.display = 'none';
        addButton.style.display = 'block';
    }
});

function updateProductList() {
    productList.innerHTML = '';
    products.sort((a, b) => b.ratio - a.ratio);
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'comparison-item';
        productDiv.innerHTML = `
            <div class="product-details">
                <h2>${index+1}# ${product.productName}</h2>  
                Preço: R$${product.price.toFixed(2)} <br>
                Litragem: ${product.liters}L <br>
                Consumo: ${product.consumption}kWh <br><br>
                <span class="ratio">Efic. Energ.: <b>${product.ratio.toFixed(2)} Litros/kWh</b></span>
                <span class="ratio">Efic. Financ.: <b>${product.ratio.toFixed(2)} R$/Efc. Energ.</b></span>
            </div>
            <div class="product-actions">
                <button onclick="editProduct(${index})">Editar</button>
                <button onclick="deleteProduct(${index})">Excluir</button>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

function deleteProduct(index) {
    products.splice(index, 1);
    updateProductList();
}

function editProduct(index) {
    const product = products[index];
    form.elements['productName'].value = product.productName;
    form.elements['productPrice'].value = product.price;
    form.elements['productVolume'].value = product.liters;
    form.elements['productConsumption'].value = product.consumption;
    formContainer.style.display = 'flex';
    addButton.style.display = 'none';
    products.splice(index, 1);
    updateProductList();
}