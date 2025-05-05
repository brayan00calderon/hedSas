// Clase para manejar el carrito de compras
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    // Inicializar el carrito
    init() {
        this.updateCartCounter();
        this.displayCartItems();
        this.setupEventListeners();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Evento para actualizar cantidades
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = e.target.dataset.productId;
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(productId, newQuantity);
            }
        });

        // Evento para eliminar productos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const productId = e.target.dataset.productId;
                this.removeFromCart(productId);
            }
        });
    }

    // Añadir producto al carrito
    addToCart(productId, productName, price, image = '') {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: price,
                quantity: 1,
                image: image
            });
        }

        this.saveCart();
        this.updateCartCounter();
        this.showNotification('Producto añadido al carrito');
    }

    // Eliminar producto del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCounter();
        this.displayCartItems();
        this.showNotification('Producto eliminado del carrito');
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.displayCartItems();
        }
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Actualizar contador del carrito
    updateCartCounter() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        const counter = document.getElementById('cart-counter');
        if (counter) {
            counter.textContent = totalItems;
        }
    }

    // Mostrar items del carrito
    displayCartItems() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        let total = 0;
        cartItems.innerHTML = '';

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItems.innerHTML += `
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="${item.image || 'images/it_service/default.jpg'}" alt="${item.name}" width="50">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>
                        <input type="number" class="quantity-input" 
                               data-product-id="${item.id}" 
                               value="${item.quantity}" 
                               min="1">
                    </td>
                    <td class="text-center">$${item.price.toLocaleString()}</td>
                    <td class="text-center">$${itemTotal.toLocaleString()}</td>
                    <td>
                        <button class="remove-item" data-product-id="${item.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = `$${total.toLocaleString()}`;
        }
    }

    // Mostrar notificación
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Validar formulario de pago
    validateCheckoutForm() {
        const form = document.getElementById('checkout-form');
        if (!form) return false;

        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    // Procesar pago
    processPayment() {
        if (!this.validateCheckoutForm()) {
            this.showNotification('Por favor complete todos los campos requeridos');
            return false;
        }

        // Aquí iría la lógica de procesamiento de pago
        // Por ahora solo simulamos el proceso
        this.showNotification('Procesando pago...');
        
        setTimeout(() => {
            this.clearCart();
            this.showNotification('Pago completado exitosamente');
            window.location.href = 'it_shop.html';
        }, 2000);

        return true;
    }

    // Limpiar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCounter();
        this.displayCartItems();
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
}); 