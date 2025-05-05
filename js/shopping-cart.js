// Clase ShoppingCart para manejar el carrito de compras
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.updateCartCount();
    this.updateCartDisplay();
  }

  // Añadir un producto al carrito
  addToCart(id, name, price, image) {
    const existingItem = this.items.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
    this.showNotification('Producto añadido al carrito');
  }

  // Eliminar un producto del carrito
  removeFromCart(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
    this.showNotification('Producto eliminado del carrito');
  }

  // Actualizar la cantidad de un producto
  updateQuantity(id, quantity) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.removeFromCart(id);
      } else {
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
      }
    }
  }

  // Vaciar el carrito
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
    this.updateCartDisplay();
    this.showNotification('Carrito vaciado');
  }

  // Calcular el subtotal
  calculateSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calcular el IVA (19%)
  calculateTax() {
    return this.calculateSubtotal() * 0.19;
  }

  // Calcular el total
  calculateTotal() {
    return this.calculateSubtotal() + this.calculateTax();
  }

  // Guardar el carrito en localStorage
  saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  // Actualizar el contador del carrito
  updateCartCount() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'block' : 'none';
    }
  }

  // Actualizar la visualización del carrito
  updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const checkoutItems = document.getElementById('checkout-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');
    const checkoutSubtotal = document.getElementById('subtotal');
    const checkoutTax = document.getElementById('tax');
    const checkoutTotal = document.getElementById('total');

    if (cartItems) {
      cartItems.innerHTML = this.items.map(item => `
        <tr>
          <td>
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" class="cart-item-image">
              <div class="cart-item-details">
                <h4>${item.name}</h4>
              </div>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <input type="number" min="1" value="${item.quantity}" 
                   onchange="shoppingCart.updateQuantity('${item.id}', this.value)">
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <button onclick="shoppingCart.removeFromCart('${item.id}')" class="btn btn-danger btn-sm">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    if (checkoutItems) {
      checkoutItems.innerHTML = this.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td class="text-center">$${item.price.toFixed(2)}</td>
          <td class="text-center">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');
    }

    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    const total = this.calculateTotal();

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutTax) checkoutTax.textContent = `$${tax.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Mostrar notificación
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Procesar el pago
  processPayment() {
    if (this.items.length === 0) {
      this.showNotification('El carrito está vacío');
      return;
    }

    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryMonth = document.getElementById('expiry-month').value;
    const expiryYear = document.getElementById('expiry-year').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      this.showNotification('Por favor complete todos los campos');
      return;
    }

    // Simular procesamiento de pago
    this.showNotification('Procesando pago...');
    setTimeout(() => {
      this.clearCart();
      this.showNotification('¡Pago exitoso! Gracias por su compra.');
      window.location.href = 'it_shop.html';
    }, 2000);
  }
}

// Inicializar el carrito
const shoppingCart = new ShoppingCart();

// Funciones de filtrado y búsqueda
function filterProducts(category) {
  const products = document.querySelectorAll('.product_box');
  products.forEach(product => {
    const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
    if (category === 'all' || productCategory === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function searchProducts(query) {
  const products = document.querySelectorAll('.product_box');
  products.forEach(product => {
    const productName = product.querySelector('.product-title').textContent.toLowerCase();
    if (productName.includes(query.toLowerCase())) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function sortProducts(option) {
  const productGrid = document.getElementById('product-grid');
  const products = Array.from(productGrid.querySelectorAll('.product_box'));

  products.sort((a, b) => {
    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
    const nameA = a.querySelector('.product-title').textContent;
    const nameB = b.querySelector('.product-title').textContent;

    switch (option) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'name-desc':
        return nameB.localeCompare(nameA);
      default:
        return 0;
    }
  });

  products.forEach(product => productGrid.appendChild(product));
} 