// Función para actualizar una página con la plantilla
function updatePage(pagePath) {
    return new Promise((resolve, reject) => {
        // Cargar la plantilla
        fetch('template.html')
            .then(response => response.text())
            .then(templateHtml => {
                // Cargar la página actual
                fetch(pagePath)
                    .then(response => response.text())
                    .then(pageHtml => {
                        const parser = new DOMParser();
                        const templateDoc = parser.parseFromString(templateHtml, 'text/html');
                        const pageDoc = parser.parseFromString(pageHtml, 'text/html');

                        // Extraer el contenido principal de la página actual
                        const mainContent = pageDoc.querySelector('.section.padding_layout_1');
                        if (mainContent) {
                            // Reemplazar el contenido principal en la plantilla
                            const templateMainContent = templateDoc.querySelector('.section.padding_layout_1');
                            if (templateMainContent) {
                                templateMainContent.innerHTML = mainContent.innerHTML;
                            }
                        }

                        // Asegurar que el carrito esté presente
                        const searchIcon = templateDoc.querySelector('.search_icon');
                        if (searchIcon) {
                            const cartIcon = searchIcon.querySelector('.cart-icon');
                            if (!cartIcon) {
                                const cartHtml = `
                                    <li class="cart-icon">
                                        <a href="it_cart.html">
                                            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                                            <span id="cart-counter" class="cart-counter">0</span>
                                        </a>
                                    </li>
                                `;
                                searchIcon.querySelector('ul').innerHTML += cartHtml;
                            }
                        }

                        // Asegurar que el script del carrito esté incluido
                        const scripts = templateDoc.querySelectorAll('script');
                        let hasCartScript = false;
                        scripts.forEach(script => {
                            if (script.src && script.src.includes('cart.js')) {
                                hasCartScript = true;
                            }
                        });

                        if (!hasCartScript) {
                            const cartScript = templateDoc.createElement('script');
                            cartScript.src = 'js/cart.js';
                            templateDoc.body.appendChild(cartScript);
                        }

                        // Traducir el contenido principal
                        const content = templateDoc.querySelector('.section.padding_layout_1');
                        if (content) {
                            // Traducir títulos
                            const titles = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
                            titles.forEach(title => {
                                title.textContent = translateText(title.textContent);
                            });

                            // Traducir párrafos
                            const paragraphs = content.querySelectorAll('p');
                            paragraphs.forEach(paragraph => {
                                paragraph.textContent = translateText(paragraph.textContent);
                            });

                            // Traducir enlaces
                            const links = content.querySelectorAll('a');
                            links.forEach(link => {
                                if (link.textContent.trim()) {
                                    link.textContent = translateText(link.textContent);
                                }
                            });

                            // Traducir botones
                            const buttons = content.querySelectorAll('button');
                            buttons.forEach(button => {
                                if (button.textContent.trim()) {
                                    button.textContent = translateText(button.textContent);
                                }
                            });

                            // Traducir inputs
                            const inputs = content.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
                            inputs.forEach(input => {
                                if (input.placeholder) {
                                    input.placeholder = translateText(input.placeholder);
                                }
                            });
                        }

                        // Guardar la página actualizada
                        const updatedHtml = templateDoc.documentElement.outerHTML;
                        const blob = new Blob([updatedHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = pagePath;
                        a.click();
                        URL.revokeObjectURL(url);
                        resolve();
                    })
                    .catch(error => reject(error));
            })
            .catch(error => reject(error));
    });
}

// Función para traducir texto
function translateText(text) {
    const translations = {
        // Títulos y encabezados
        'Home': 'Inicio',
        'About': 'Nosotros',
        'Services': 'Servicios',
        'Blog': 'Blog',
        'Pages': 'Páginas',
        'Shop': 'Tienda',
        'Contact': 'Contacto',
        'Search': 'Buscar',
        'Cart': 'Carrito',
        'Checkout': 'Finalizar Compra',
        'Products': 'Productos',
        'Product Details': 'Detalles del Producto',
        'Shopping Cart': 'Carrito de Compras',
        'Payment': 'Pago',
        'Contact Us': 'Contáctanos',
        'Get a Quote': 'Solicitar Cotización',
        'Make an Appointment': 'Solicitar Cita',
        'Our Services': 'Nuestros Servicios',
        'Service Details': 'Detalles del Servicio',
        'Our Team': 'Nuestro Equipo',
        'Team Member': 'Miembro del Equipo',
        'Our Blog': 'Nuestro Blog',
        'Blog Details': 'Detalles del Blog',
        'FAQ': 'Preguntas Frecuentes',
        'Pricing': 'Precios',
        'Career': 'Trabaja con Nosotros',
        'Privacy Policy': 'Política de Privacidad',
        'Terms & Conditions': 'Términos y Condiciones',
        '404 Error': 'Error 404',
        'Page Not Found': 'Página no Encontrada',
        
        // Textos comunes
        'Add to Cart': 'Añadir al Carrito',
        'Remove': 'Eliminar',
        'Quantity': 'Cantidad',
        'Price': 'Precio',
        'Total': 'Total',
        'Continue Shopping': 'Seguir Comprando',
        'Proceed to Checkout': 'Proceder al Pago',
        'Your cart is empty': 'Tu carrito está vacío',
        'View Cart': 'Ver Carrito',
        'Checkout': 'Finalizar Compra',
        'Order Summary': 'Resumen del Pedido',
        'Subtotal': 'Subtotal',
        'Shipping': 'Envío',
        'Tax': 'Impuesto',
        'Grand Total': 'Total General',
        'Place Order': 'Realizar Pedido',
        'Thank you for your order': 'Gracias por tu pedido',
        'Order Confirmation': 'Confirmación de Pedido',
        'Order Number': 'Número de Pedido',
        'Order Date': 'Fecha del Pedido',
        'Order Status': 'Estado del Pedido',
        'Payment Method': 'Método de Pago',
        'Shipping Address': 'Dirección de Envío',
        'Billing Address': 'Dirección de Facturación',
        'Contact Information': 'Información de Contacto',
        'Email': 'Correo Electrónico',
        'Phone': 'Teléfono',
        'Address': 'Dirección',
        'City': 'Ciudad',
        'State': 'Estado',
        'Zip Code': 'Código Postal',
        'Country': 'País',
        'First Name': 'Nombre',
        'Last Name': 'Apellido',
        'Company': 'Empresa',
        'Message': 'Mensaje',
        'Send': 'Enviar',
        'Submit': 'Enviar',
        'Reset': 'Restablecer',
        'Cancel': 'Cancelar',
        'Save': 'Guardar',
        'Update': 'Actualizar',
        'Delete': 'Eliminar',
        'Edit': 'Editar',
        'View': 'Ver',
        'Read More': 'Leer Más',
        'Learn More': 'Saber Más',
        'Download': 'Descargar',
        'Upload': 'Subir',
        'Print': 'Imprimir',
        'Share': 'Compartir',
        'Like': 'Me Gusta',
        'Comment': 'Comentar',
        'Reply': 'Responder',
        'Follow': 'Seguir',
        'Subscribe': 'Suscribirse',
        'Unsubscribe': 'Cancelar Suscripción',
        'Login': 'Iniciar Sesión',
        'Logout': 'Cerrar Sesión',
        'Register': 'Registrarse',
        'Forgot Password': 'Olvidé mi Contraseña',
        'Reset Password': 'Restablecer Contraseña',
        'Change Password': 'Cambiar Contraseña',
        'Profile': 'Perfil',
        'Settings': 'Configuración',
        'Account': 'Cuenta',
        'Dashboard': 'Panel de Control',
        'Notifications': 'Notificaciones',
        'Messages': 'Mensajes',
        'Inbox': 'Bandeja de Entrada',
        'Sent': 'Enviados',
        'Drafts': 'Borradores',
        'Trash': 'Papelera',
        'Spam': 'Correo no Deseado',
        'Archive': 'Archivo',
        'Favorites': 'Favoritos',
        'Bookmarks': 'Marcadores',
        'History': 'Historial',
        'Downloads': 'Descargas',
        'Uploads': 'Subidas',
        'Recent': 'Recientes',
        'Popular': 'Populares',
        'Featured': 'Destacados',
        'New': 'Nuevo',
        'Hot': 'Tendencia',
        'Sale': 'Oferta',
        'Discount': 'Descuento',
        'Free': 'Gratis',
        'Premium': 'Premium',
        'Pro': 'Pro',
        'Basic': 'Básico',
        'Standard': 'Estándar',
        'Advanced': 'Avanzado',
        'Enterprise': 'Empresarial',
        'Custom': 'Personalizado',
        'Monthly': 'Mensual',
        'Yearly': 'Anual',
        'Lifetime': 'De por Vida',
        'Trial': 'Prueba',
        'Demo': 'Demo',
        'Beta': 'Beta',
        'Alpha': 'Alpha',
        'Release': 'Lanzamiento',
        'Version': 'Versión',
        'Update': 'Actualización',
        'Patch': 'Parche',
        'Bug': 'Error',
        'Feature': 'Característica',
        'Improvement': 'Mejora',
        'Enhancement': 'Mejora',
        'Fix': 'Corrección',
        'Security': 'Seguridad',
        'Performance': 'Rendimiento',
        'Compatibility': 'Compatibilidad',
        'Accessibility': 'Accesibilidad',
        'Usability': 'Usabilidad',
        'Reliability': 'Fiabilidad',
        'Scalability': 'Escalabilidad',
        'Maintainability': 'Mantenibilidad',
        'Portability': 'Portabilidad',
        'Testability': 'Testabilidad',
        'Reusability': 'Reutilización',
        'Interoperability': 'Interoperabilidad',
        'Extensibility': 'Extensibilidad',
        'Modularity': 'Modularidad',
        'Flexibility': 'Flexibilidad',
        'Robustness': 'Robustez',
        'Efficiency': 'Eficiencia',
        'Effectiveness': 'Efectividad',
        'Productivity': 'Productividad',
        'Quality': 'Calidad',
        'Reliability': 'Fiabilidad',
        'Availability': 'Disponibilidad',
        'Maintainability': 'Mantenibilidad',
        'Serviceability': 'Serviciabilidad',
        'Durability': 'Durabilidad',
        'Sustainability': 'Sostenibilidad',
        'Compatibility': 'Compatibilidad',
        'Interoperability': 'Interoperabilidad',
        'Portability': 'Portabilidad',
        'Reusability': 'Reutilización',
        'Testability': 'Testabilidad',
        'Usability': 'Usabilidad',
        'Accessibility': 'Accesibilidad',
        'Security': 'Seguridad',
        'Privacy': 'Privacidad',
        'Confidentiality': 'Confidencialidad',
        'Integrity': 'Integridad',
        'Availability': 'Disponibilidad',
        'Authentication': 'Autenticación',
        'Authorization': 'Autorización',
        'Non-repudiation': 'No repudio',
        'Accountability': 'Responsabilidad',
        'Auditability': 'Auditabilidad',
        'Compliance': 'Cumplimiento',
        'Governance': 'Gobernanza',
        'Risk': 'Riesgo',
        'Threat': 'Amenaza',
        'Vulnerability': 'Vulnerabilidad',
        'Attack': 'Ataque',
        'Defense': 'Defensa',
        'Protection': 'Protección',
        'Detection': 'Detección',
        'Prevention': 'Prevención',
        'Response': 'Respuesta',
        'Recovery': 'Recuperación',
        'Incident': 'Incidente',
        'Event': 'Evento',
        'Alert': 'Alerta',
        'Warning': 'Advertencia',
        'Error': 'Error',
        'Exception': 'Excepción',
        'Failure': 'Fallo',
        'Crash': 'Bloqueo',
        'Hang': 'Colgado',
        'Freeze': 'Congelado',
        'Slow': 'Lento',
        'Lag': 'Retraso',
        'Delay': 'Demora',
        'Timeout': 'Tiempo de espera agotado',
        'Deadlock': 'Punto muerto',
        'Race condition': 'Condición de carrera',
        'Memory leak': 'Fuga de memoria',
        'Buffer overflow': 'Desbordamiento de búfer',
        'Stack overflow': 'Desbordamiento de pila',
        'Heap overflow': 'Desbordamiento de montón',
        'Integer overflow': 'Desbordamiento de entero',
        'Floating point exception': 'Excepción de punto flotante',
        'Division by zero': 'División por cero',
        'Null pointer': 'Puntero nulo',
        'Dangling pointer': 'Puntero colgante',
        'Wild pointer': 'Puntero salvaje',
        'Invalid pointer': 'Puntero inválido',
        'Segmentation fault': 'Fallo de segmentación',
        'Bus error': 'Error de bus',
        'General protection fault': 'Fallo de protección general',
        'Page fault': 'Fallo de página',
        'Stack smashing': 'Corrupción de pila',
        'Heap corruption': 'Corrupción de montón',
        'Memory corruption': 'Corrupción de memoria',
        'Data corruption': 'Corrupción de datos',
        'File corruption': 'Corrupción de archivo',
        'Database corruption': 'Corrupción de base de datos',
        'System crash': 'Bloqueo del sistema',
        'Kernel panic': 'Pánico del kernel',
        'Blue screen of death': 'Pantalla azul de la muerte',
        'Black screen': 'Pantalla negra',
        'White screen': 'Pantalla blanca',
        'Blank screen': 'Pantalla en blanco',
        'Frozen screen': 'Pantalla congelada',
        'Unresponsive': 'No responde',
        'Hanging': 'Colgado',
        'Freezing': 'Congelado',
        'Crashing': 'Bloqueado',
        'Restarting': 'Reiniciando',
        'Rebooting': 'Reiniciando',
        'Shutting down': 'Apagando',
        'Powering off': 'Apagando',
        'Powering on': 'Encendiendo',
        'Booting': 'Arrancando',
        'Loading': 'Cargando',
        'Initializing': 'Inicializando',
        'Starting': 'Iniciando',
        'Stopping': 'Deteniendo',
        'Pausing': 'Pausando',
        'Resuming': 'Reanudando',
        'Suspending': 'Suspender',
        'Resuming': 'Reanudar',
        'Sleeping': 'Durmiendo',
        'Waking up': 'Despertando',
        'Standby': 'En espera',
        'Hibernating': 'Hibernando',
        'Shutting down': 'Apagando',
        'Powering off': 'Apagando',
        'Powering on': 'Encendiendo',
        'Booting': 'Arrancando',
        'Loading': 'Cargando',
        'Initializing': 'Inicializando',
        'Starting': 'Iniciando',
        'Stopping': 'Deteniendo',
        'Pausing': 'Pausando',
        'Resuming': 'Reanudando',
        'Suspending': 'Suspender',
        'Resuming': 'Reanudar',
        'Sleeping': 'Durmiendo',
        'Waking up': 'Despertando',
        'Standby': 'En espera',
        'Hibernating': 'Hibernando'
    };

    return translations[text] || text;
}

// Lista de páginas a actualizar
const pages = [
    'it_home.html',
    'it_about.html',
    'it_service.html',
    'it_service_list.html',
    'it_service_detail.html',
    'it_blog.html',
    'it_blog_grid.html',
    'it_blog_detail.html',
    'it_career.html',
    'it_price.html',
    'it_faq.html',
    'it_privacy_policy.html',
    'it_error.html',
    'it_contact.html',
    'it_contact_2.html',
    'it_shop.html',
    'it_shop_detail.html',
    'it_cart.html',
    'it_checkout.html',
    'it_computer_repair.html',
    'it_data_recovery.html',
    'it_mobile_service.html',
    'it_network_solution.html',
    'it_techn_support.html',
    'it_term_condition.html',
    'it_news.html',
    'make_appointment.html'
];

// Actualizar todas las páginas
pages.forEach(page => updatePage(page)); 