// This file contains the JavaScript logic for handling user interactions, such as showing/hiding the form, adding items to the comparison list, and managing the array that stores the product data.

let products = [];
let sortBy = 'efficiencyCost'; 
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
    products.sort((a, b) => sortBy === 'efficiencyCost' ? a.efficiencyCost - b.efficiencyCost : b.ratio - a.ratio);
    
    const info = document.createElement('div');
    info.innerHTML = `
        <p><b>Efic.Energ.:</b> Eficiência Energética (Litros/kWh), é a quantidade de litros que sua geladeira consegue manter esfriado gastando apenas 1kWh. <b>Quanto maior, melhor.</b></p>
        <p><b>Efic.Financ.:</b> Eficiência Financeira (R$/Efc. Energ.), é a quantidade em R$ que custa para pagar cada ponto de eficiência de sua geladeira <i>(Custo X Benefício)</i>. <b>Quanto menor, melhor.</b></p>
    `;

    productList.appendChild(info);

    const sortButtons = document.createElement('div');
    sortButtons.innerHTML = `
        <button id="sortEfficiencyCost" style="background-color: ${sortBy === 'efficiencyCost' ? '#003366' : 'white'}; color: ${sortBy === 'efficiencyCost' ? 'white' : '#95959c'};;">Ordenar por Efic.Financ.</button> <br>
        <button id="sortRatio" style="background-color: ${sortBy === 'ratio' ? '#003366' : 'white'}; color: ${sortBy === 'ratio' ? 'white' : '#95959c'};">Ordenar por Efic.Energ.</button>
    `;
    productList.appendChild(sortButtons);

    document.getElementById('sortEfficiencyCost').addEventListener('click', () => {
        sortBy = 'efficiencyCost';
        updateProductList();
    });

    document.getElementById('sortRatio').addEventListener('click', () => {
        sortBy = 'ratio';
        updateProductList();
    });
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'comparison-item';
        productDiv.innerHTML = `
            <div class="product-details">
                <h2>${index+1}# ${product.productName}</h2>  
                Preço: R$${product.price.toFixed(2)} <br>
                Litragem: ${product.liters}L <br>
                Consumo: ${product.consumption}kWh <br><br>
                <span class="ratio">Efic. Energ.: <b>${product.ratio.toFixed(2)} Litros/kWh</b></span> <br>
                <span class="ratio">Efic. Financ.: <b>${product.efficiencyCost.toFixed(2)} R$/Efc. Energ.</b></span>
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