document.addEventListener('DOMContentLoaded', () => {
    const productSection = document.getElementById('products');
    const cartItems = document.getElementById('cart-items');
    const clearCartBtn = document.getElementById('clear-cart');
    const orderForm = document.getElementById('order-form');
    const orderConfirmation = document.getElementById('order-confirmation');
    const regForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app');
    // initially hide the app container
    appContainer.style.display = 'none';

    loadCart();

    async function fetchProducts() {
        try {
            const response = await fetch('product.json');
            if (!response.ok) throw new Error('Network response was not okay');
            const products = await response.json();
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="50%">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>`;
                productSection.appendChild(productDiv);
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener('click', addToCart);
            });
        } catch (error) {
            console.error('Error Fetching products:', error);
        }
    }

    async function addToCart(event) {
        const productId = event.target.dataset.id;
        try {
            const response = await fetch('product.json');
            if (!response.ok) throw new Error('Network error was not okay');
            const products = await response.json();
            const product = products.find(p => p.id == productId);
            const existingItem = Array.from(cartItems.children).find(item => item.querySelector('.product-name').textContent === product.name);

            if (!existingItem) {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.dataset.productId = product.id; // Store the product ID on the div
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" width="50">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="price">$${product.price}</p>
                    <p class="quantity">1</p>
                    <button class="increase">+</button>
                    <button class="decrease">-</button>
                    <button class="remove">Remove</button>`;

                const decreaseBtn = div.querySelector('.decrease');
                const increaseBtn = div.querySelector('.increase');
                const removeBtn = div.querySelector('.remove');
                const quantityElem = div.querySelector('.quantity');
                const priceElem = div.querySelector('.price');

                // Handle quantity increase
                increaseBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantityElem.textContent);
                    quantity++;
                    quantityElem.textContent = quantity;
                    priceElem.textContent = `$${(product.price * quantity).toFixed(2)}`;
                    saveCart();
                });

                // Handle quantity decrease
                decreaseBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantityElem.textContent);
                    if (quantity > 1) {
                        quantity--;
                        quantityElem.textContent = quantity;
                        priceElem.textContent = `$${(product.price * quantity).toFixed(2)}`;
                        saveCart();
                    }
                });

                // Handle item removal
                removeBtn.addEventListener('click', () => {
                    div.remove();
                    saveCart();
                });

                cartItems.appendChild(div);
                saveCart();
            } else {
                alert('Product already in cart');
            }
        } catch (error) {
            console.error(error);
        }
    }

    function saveCart() {
        const cartData = [];
        cartItems.querySelectorAll('.cart-item').forEach(item => {
            const productId = item.dataset.productId;
            const productName = item.querySelector('.product-name').textContent;
            const productPrice = item.querySelector('.price').textContent.replace('$', '');
            const productQuantity = item.querySelector('.quantity').textContent;
            const productImage = item.querySelector('img').src;

            cartData.push({
                id: productId,
                name: productName,
                price: parseInt(productPrice),
                quantity: parseInt(productQuantity),
                image: productImage
            });
        });
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    function loadCart() {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        cartData.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.dataset.productId = item.id;
            div.innerHTML = `<img src="${item.image}" alt="${item.name}" width="50">
                <h3 class="product-name">${item.name}</h3>
                <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
                <p class="quantity">${item.quantity}</p>
                <button class="increase">+</button>
                <button class="decrease">-</button>
                <button class="remove">Remove</button>`;

            const decreaseBtn = div.querySelector('.decrease');
            const increaseBtn = div.querySelector('.increase');
            const removeBtn = div.querySelector('.remove');
            const quantityElem = div.querySelector('.quantity');
            const priceElem = div.querySelector('.price');

            // Handle quantity increase
            increaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityElem.textContent);
                quantity++;
                quantityElem.textContent = quantity;
                priceElem.textContent = `$${(item.price * quantity).toFixed(2)}`;
                saveCart();
            });

            // Handle quantity decrease
            decreaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityElem.textContent);
                if (quantity > 1) {
                    quantity--;
                    quantityElem.textContent = quantity;
                    priceElem.textContent = `$${(item.price * quantity).toFixed(2)}`;
                    saveCart();
                }
            });

            // Handle item removal
            removeBtn.addEventListener('click', () => {
                div.remove();
                saveCart();
            });

            cartItems.appendChild(div);
        });
    }

    clearCartBtn.addEventListener('click', () => {
        cartItems.innerHTML = '';
        saveCart();
    });

    // Order form handling (remains the same as your original code)
    const order = document.getElementById('order');
    order.addEventListener('click', function () {
        if (cartItems.innerHTML === "") {
            orderForm.style.display = 'none';
            alert(`There's nothing in the cart`);
        } else {
            orderForm.style.display = "flex";
        }
    });

    orderForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('customer-name').value;
        const address = document.getElementById('customer-address').value;
        const quantity = document.getElementById('customer-quantity').value;
        const customer_message = document.getElementById('customer-message').value;

        if (!name || !address || !quantity || !customer_message) {
            alert('Please fill in all fields');
            return;
        }else{
            document.getElementById('cancle-order').onclick = ()=>{
                document.getElementById('order-form').style.display ='none'
            }
        }

        orderConfirmation.textContent = `Thank you for your order, ${name}! Your Order will be delivered to ${address}.`;
        orderForm.style.display = 'none';
        orderConfirmation.style.display = 'block';
        setTimeout(() => {
            orderConfirmation.style.display = 'none';
        }, 5000);
        clearCartBtn.click();
        clearCartBtn.click();
    });
     
    //registration
    regForm.addEventListener('submit',event=>{
        event.preventDefault()
        const username = document.getElementById('reg-username').value
        const password = document.getElementById('reg-password').value;
        if(!username ||!password){
            alert('Please fill in all fields')
            return;
        }
        localStorage.setItem('user',JSON.stringify({username, password}));
        alert('Registration successfull! Please login.');
        regForm.style.display = 'none';
        loginForm.style.display = 'block'
    });
    loginForm.addEventListener('submit',event=>{
        event.preventDefault()
        const username = document.getElementById('login-username').value
        const password = document.getElementById('login-password').value
        const savedUser = JSON.parse(localStorage.getItem('user'))
        if(savedUser && savedUser.username === username && savedUser.password === password){
            alert('Login successful')
            authContainer.style.display = 'none'
            appContainer.style.display = 'block'
        }else{
            alert('Invalid credentials. Please try again.')
        }
    });
    const savedUser = JSON.parse(localStorage.getItem('user'))
   /* if(savedUser){
        authContainer.style.display = 'none'
        appContainer.style.display = 'block'
    }*/
    //open and close pages with clicks section.

   document.querySelector(".cart-open").addEventListener('click', ()=>{
       const open = document.getElementById('cart') 
        open.style.display= 'flex'
    })
    document.getElementById('close-cart').addEventListener('click',()=>{
        const open = document.getElementById('cart') 
        open.style.display= 'none'
    });
    document.querySelector('.menu-nav').addEventListener('click',()=>{
        const displayNav = document.querySelector('.menu-navbar')
        displayNav.style.display = 'flex'
    });
    document.querySelector('.close-nav-menu').onclick = ()=>{
        const displayNav = document.querySelector('.menu-navbar')
        displayNav.style.display = 'none'
    };
    
    fetchProducts();
});

