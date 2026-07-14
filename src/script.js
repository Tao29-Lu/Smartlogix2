document.addEventListener("DOMContentLoaded", function () {
    console.log("SmartLogix frontend cargado correctamente");

    // Utilidades UI
    function obtenerBotonSubmit(form) {
        if (!form) return null;
        // Preferimos el botón submit del propio form.
        const btn = form.querySelector("button[type='submit'], input[type='submit']");
        return btn || null;
    }


    const API_BASE_URL = "http://localhost:8080/api";

    const API_CLIENTES = `${API_BASE_URL}/clientes`;
    const API_PEDIDOS = `${API_BASE_URL}/pedidos`;
    const API_PRODUCTOS = `${API_BASE_URL}/productos`;

    const loginBtn = document.getElementById("login-btn");
    const loginSection = document.getElementById("login-section");
    const loginSubmitBtn = document.getElementById("login-submit-btn");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const loginMessage = document.getElementById("login-message");

    const sessionSection = document.getElementById("session-section");
    const sessionUserMessage = document.getElementById("session-user-message");

    const productoCompra = document.getElementById("producto-compra");
    const productosMessage = document.getElementById("productos-message");
    const cantidadCompra = document.getElementById("cantidad-compra");
    const totalCompra = document.getElementById("total-compra");
    const comprarBtn = document.getElementById("comprar-btn");
    const compraMessage = document.getElementById("compra-message");

    const logoutBtn = document.getElementById("logout-btn");
    const logoutConfirmacionBtn = document.getElementById("logout-confirmacion-btn");

    const confirmacionCompraSection = document.getElementById("confirmacion-compra-section");
    const confirmacionMensaje = document.getElementById("confirmacion-mensaje");
    const confirmacionProducto = document.getElementById("confirmacion-producto");
    const confirmacionCantidad = document.getElementById("confirmacion-cantidad");
    const confirmacionTotal = document.getElementById("confirmacion-total");
    const confirmacionPedidoId = document.getElementById("confirmacion-pedido-id");
    const volverPanelBtn = document.getElementById("volver-panel-btn");

    // Formularios (Registro / Contacto)
    const registerForm = document.getElementById("register-form");
    const contactForm = document.getElementById("contact-form");


    console.log("Script principal cargado correctamente");
    console.log("API centralizada mediante BFF:", API_BASE_URL);

    function ocultarSeccionesCliente() {
        if (loginSection) {
            loginSection.style.display = "none";
        }

        if (sessionSection) {
            sessionSection.style.display = "none";
        }

        if (confirmacionCompraSection) {
            confirmacionCompraSection.style.display = "none";
        }
    }

    function obtenerPrecioProductoSeleccionado() {
        if (!productoCompra || !productoCompra.selectedOptions[0]) {
            return 0;
        }

        return Number(productoCompra.selectedOptions[0].dataset.precio || 0);
    }

    function obtenerNombreProductoSeleccionado() {
        if (!productoCompra || !productoCompra.selectedOptions[0]) {
            return "";
        }

        return productoCompra.selectedOptions[0].dataset.nombre || productoCompra.selectedOptions[0].textContent;
    }

    function obtenerStockProductoSeleccionado() {
        if (!productoCompra || !productoCompra.selectedOptions[0]) {
            return 0;
        }

        return Number(productoCompra.selectedOptions[0].dataset.stock || 0);
    }

    function actualizarTotalCompra() {
        if (!cantidadCompra || !totalCompra) {
            return;
        }

        const cantidad = Number(cantidadCompra.value);
        const precioUnitario = obtenerPrecioProductoSeleccionado();
        const stockDisponible = obtenerStockProductoSeleccionado();

        if (cantidad > stockDisponible && stockDisponible > 0) {
            if (compraMessage) {
                compraMessage.textContent = `No puedes comprar ${cantidad} unidades. Stock disponible: ${stockDisponible}.`;
            }

            totalCompra.value = 0;
            return;
        }

        if (compraMessage) {
            compraMessage.textContent = "";
        }

        if (cantidad > 0 && precioUnitario > 0) {
            totalCompra.value = cantidad * precioUnitario;
        } else {
            totalCompra.value = 0;
        }
    }

    const MOCK_PRODUCTOS = [
        { id: 101, nombre: "Cámara térmica Pro", precio: 129.99, stock: 18 },
        { id: 102, nombre: "Escáner Bluetooth Industrial", precio: 59.5, stock: 42 },
        { id: 103, nombre: "Impresora de etiquetas SmartPrint", precio: 89.0, stock: 25 }
    ];

    let modoDemoActivo = false;

    function cargarProductosMock() {
        if (!productoCompra) return;

        productoCompra.innerHTML = "";

        MOCK_PRODUCTOS.forEach((producto) => {
            const option = document.createElement("option");
            option.value = producto.id;
            option.dataset.nombre = producto.nombre;
            option.dataset.precio = producto.precio;
            option.dataset.stock = producto.stock;
            option.textContent = `${producto.nombre} - Stock: ${producto.stock} - $${producto.precio}`;
            productoCompra.appendChild(option);
        });

        // Selecciona el primero por defecto y recalcula total.
        if (MOCK_PRODUCTOS.length > 0) {
            productoCompra.value = String(MOCK_PRODUCTOS[0].id);
        }

        actualizarTotalCompra();
    }

    async function cargarProductosDisponibles() {
        if (!productoCompra) {
            return;
        }

        if (modoDemoActivo) {
            cargarProductosMock();
            return;
        }

        try {
            const respuesta = await fetch(API_PRODUCTOS);

            if (!respuesta.ok) {
                throw new Error("No se pudo obtener productos desde el BFF");
            }

            const productos = await respuesta.json();

            productoCompra.innerHTML = "";

            if (!productos || productos.length === 0) {
                productoCompra.innerHTML = `<option value="">No hay productos disponibles</option>`;

                if (productosMessage) {
                    productosMessage.textContent = "No se encontraron productos disponibles.";
                }

                actualizarTotalCompra();
                return;
            }

            productos.forEach(function (producto) {
                const option = document.createElement("option");

                option.value = producto.id;
                option.dataset.nombre = producto.nombre;
                option.dataset.precio = producto.precio;
                option.dataset.stock = producto.stock;

                option.textContent = `${producto.nombre} - Stock: ${producto.stock} - $${producto.precio}`;

                productoCompra.appendChild(option);
            });

            if (productosMessage) {
                productosMessage.textContent = "Productos cargados correctamente desde el BFF.";
            }

            actualizarTotalCompra();
        } catch (error) {
            console.error("Error al cargar productos desde el BFF:", error);

            // Fallback: si la BD/BFF está apagado, mostrar demo visual.
            cargarProductosMock();

            if (productosMessage) {
                productosMessage.textContent = "Modo demo: productos cargados con datos de prueba.";
            }
        }
    }

    function cerrarSesion() {
        localStorage.clear();

        ocultarSeccionesCliente();

        if (loginSection) {
            loginSection.style.display = "block";
            loginSection.scrollIntoView({ behavior: "smooth" });
        }

        if (loginBtn) {
            loginBtn.textContent = "Iniciar sesión";
            loginBtn.disabled = false;
        }

        if (loginMessage) {
            loginMessage.textContent = "Sesión cerrada.";
        }

        if (compraMessage) {
            compraMessage.textContent = "";
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            ocultarSeccionesCliente();

            if (loginSection) {
                loginSection.style.display = "block";
                loginSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // =============================
    // DEMO (mock data, sin backend)
    // =============================
    const demoBtn = document.getElementById("demo-btn");

    function mostrarPanelDemo() {
        modoDemoActivo = true;

        ocultarSeccionesCliente();

        if (sessionSection) {
            sessionSection.style.display = "block";
            sessionSection.scrollIntoView({ behavior: "smooth" });
        }

        if (confirmacionCompraSection) {
            confirmacionCompraSection.style.display = "none";
        }

        if (sessionUserMessage) {
            sessionUserMessage.textContent = "Sesión demo (datos de prueba).";
        }

        if (loginBtn) {
            loginBtn.textContent = "Iniciar sesión";
            loginBtn.disabled = false;
        }

        if (loginMessage) {
            loginMessage.textContent = "";
        }

        if (compraMessage) {
            compraMessage.textContent = "";
        }

        cargarProductosMock();
    }

    if (demoBtn) {
        demoBtn.addEventListener("click", function () {
            mostrarPanelDemo();
        });
    }

    // Botones/links tipo ancla con smooth scroll
    function manejarScrollSuave(anchorSelector, fallbackAlert) {
        const anchors = document.querySelectorAll(anchorSelector);
        anchors.forEach((a) => {
            a.addEventListener("click", function (e) {
                const href = a.getAttribute("href");
                if (!href || !href.startsWith("#")) return;

                const targetId = href.slice(1);
                const target = document.getElementById(targetId);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                } else {
                    if (fallbackAlert) alert(fallbackAlert);
                }
            });
        });
    }

    manejarScrollSuave('a[href="#modulos"]', 'Próximamente');
    manejarScrollSuave('a[href="#contacto"]', 'Próximamente');



    if (productoCompra) {
        productoCompra.addEventListener("change", actualizarTotalCompra);
    }

    if (cantidadCompra) {
        cantidadCompra.addEventListener("input", actualizarTotalCompra);
        cantidadCompra.addEventListener("change", actualizarTotalCompra);
    }

    // =============================
    // Registro REAL (POST JSON + mensajes)
    // =============================
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Captura inputs específicos del HTML
            const nombreEl = document.getElementById("nombre");
            const emailEl = document.getElementById("email");
            const passwordEl = document.getElementById("password");

            const nombre = nombreEl ? nombreEl.value.trim() : "";
            const email = emailEl ? emailEl.value.trim() : "";
            const password = passwordEl ? passwordEl.value.trim() : "";

            const btnSubmit = obtenerBotonSubmit(registerForm);
            const btnText = btnSubmit ? btnSubmit.querySelector(".btn-text") : null;
            const btnLoading = btnSubmit ? btnSubmit.querySelector(".btn-loading") : null;

            const textoOriginal = btnText ? btnText.textContent : "Crear cuenta gratis";

            const setMensaje = (msg) => {
                console.log(msg);
            };

            if (!nombre || !email || !password) {
                setMensaje("Error al registrar: completa nombre, correo y contraseña.");
                return;
            }

            try {
                // UI loading
                if (btnText) btnText.textContent = "Cargando...";
                if (btnLoading) btnLoading.classList.remove("hidden");
                if (btnSubmit) btnSubmit.disabled = true;

                const payload = { nombre, email, password };

                const API_REGISTER = "http://localhost:8080/api/clientes";

                const respuesta = await fetch(API_REGISTER, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!respuesta.ok) {
                    let detalle = "";
                    try {
                        detalle = await respuesta.text();
                    } catch (_) {}
                    throw new Error(detalle || `HTTP ${respuesta.status}`);
                }

                setMensaje("Registro exitoso");
                if (btnText) btnText.textContent = "Registro exitoso";
            } catch (error) {
                console.error("Error al registrar:", error);
                setMensaje(`Error al registrar: ${error?.message || "desconocido"}`);
                if (btnText) btnText.textContent = textoOriginal;
            } finally {
                if (btnSubmit) btnSubmit.disabled = false;
                if (btnLoading) btnLoading.classList.add("hidden");
            }
        });
    }

    // =============================
    // Contacto (preventDefault + loading + error)
    // =============================
    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const btnSubmit = obtenerBotonSubmit(contactForm);
            const btnLoading = btnSubmit ? btnSubmit.querySelector(".btn-loading") : null;
            const btnText = btnSubmit ? btnSubmit.querySelector(".btn-text") : null;

            // Texto original (fallback)
            const textoOriginal = btnText ? btnText.textContent : "Enviar mensaje";


            try {
                if (btnText) btnText.textContent = "Cargando...";
                if (btnLoading) btnLoading.classList.remove("hidden");
                if (btnSubmit) btnSubmit.disabled = true;

                const formData = new FormData(contactForm);
                const payload = Object.fromEntries(formData.entries());

                const API_CONTACT_PLACEHOLDER = `${API_BASE_URL}/contacto/enviar`;

                const respuesta = await fetch(API_CONTACT_PLACEHOLDER, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!respuesta.ok) {
                    throw new Error("Error enviando el mensaje de contacto");
                }

                console.log("Contacto enviado (placeholder).", await respuesta.json().catch(() => ({})));

                if (btnText) btnText.textContent = "Enviado";

            } catch (error) {
                console.error("Error en contacto:", error);

                if (btnText) btnText.textContent = textoOriginal;
                if (btnLoading) btnLoading.classList.add("hidden");

                console.log("No se pudo enviar tu mensaje. Intenta nuevamente más tarde.");
            } finally {
                if (btnSubmit) btnSubmit.disabled = false;
                if (btnLoading) btnLoading.classList.add("hidden");
            }
        });
    }

    if (loginSubmitBtn) {

        loginSubmitBtn.addEventListener("click", async function () {
            const email = loginEmail ? loginEmail.value.trim() : "";
            const password = loginPassword ? loginPassword.value.trim() : "";

            if (!email || !password) {
                if (loginMessage) {
                    loginMessage.textContent = "Ingresa correo y contraseña.";
                }
                return;
            }

            try {
                const respuesta = await fetch(`${API_CLIENTES}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                const data = await respuesta.json();

                if (respuesta.ok && data.autenticado) {
                    localStorage.setItem("clienteId", data.clienteId);
                    localStorage.setItem("clienteEmail", email);
                    localStorage.setItem("clienteNombre", data.nombre);
                    localStorage.setItem("tokenDemo", data.tokenDemo);

                    ocultarSeccionesCliente();

                    if (sessionSection) {
                        sessionSection.style.display = "block";
                        sessionSection.scrollIntoView({ behavior: "smooth" });
                    }

                    if (sessionUserMessage) {
                        sessionUserMessage.textContent = `Sesión iniciada como ${data.nombre} (${email})`;
                    }

                    if (loginBtn) {
                        loginBtn.textContent = `Hola, ${data.nombre}`;
                        loginBtn.disabled = true;
                    }

                    if (loginMessage) {
                        loginMessage.textContent = "";
                    }

                    await cargarProductosDisponibles();
                } else {
                    if (loginMessage) {
                        loginMessage.textContent = data.mensaje || "No se pudo iniciar sesión.";
                    }
                }
            } catch (error) {
                console.error("Error al iniciar sesión desde el BFF:", error);

                if (loginMessage) {
                    loginMessage.textContent = "Error al conectar con el BFF de clientes.";
                }
            }
        });
    }

    if (comprarBtn) {
        comprarBtn.addEventListener("click", async function () {
            const clienteId = localStorage.getItem("clienteId");
            const clienteEmail = localStorage.getItem("clienteEmail");
            const clienteNombre = localStorage.getItem("clienteNombre");

            if (!clienteId) {
                if (compraMessage) {
                    compraMessage.textContent = "Debes iniciar sesión antes de comprar.";
                }
                return;
            }

            const producto = obtenerNombreProductoSeleccionado();
            const cantidad = cantidadCompra ? Number(cantidadCompra.value) : 1;
            const total = totalCompra ? Number(totalCompra.value) : 0;
            const stockDisponible = obtenerStockProductoSeleccionado();

            if (!producto || cantidad <= 0 || total <= 0) {
                if (compraMessage) {
                    compraMessage.textContent = "Selecciona un producto y una cantidad válida.";
                }
                return;
            }

            if (cantidad > stockDisponible) {
                if (compraMessage) {
                    compraMessage.textContent = `No hay stock suficiente. Stock disponible: ${stockDisponible}.`;
                }
                return;
            }

            try {
                const respuesta = await fetch(API_PEDIDOS, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        clienteId: Number(clienteId),
                        clienteEmail: clienteEmail,
                        cliente: clienteNombre,
                        producto: producto,
                        cantidad: cantidad,
                        total: total,
                        estado: "PENDIENTE"
                    })
                });

                const pedido = await respuesta.json();

                if (respuesta.ok) {
                    ocultarSeccionesCliente();

                    if (confirmacionCompraSection) {
                        confirmacionCompraSection.style.display = "block";
                        confirmacionCompraSection.scrollIntoView({ behavior: "smooth" });
                    }

                    if (confirmacionMensaje) {
                        confirmacionMensaje.textContent = `Gracias por tu compra, ${clienteNombre}.`;
                    }

                    if (confirmacionProducto) {
                        confirmacionProducto.textContent = pedido.producto;
                    }

                    if (confirmacionCantidad) {
                        confirmacionCantidad.textContent = pedido.cantidad;
                    }

                    if (confirmacionTotal) {
                        confirmacionTotal.textContent = `$${pedido.total}`;
                    }

                    if (confirmacionPedidoId) {
                        confirmacionPedidoId.textContent = pedido.id;
                    }

                    if (compraMessage) {
                        compraMessage.textContent = "";
                    }

                    console.log("Pedido creado desde el BFF:", pedido);
                } else {
                    if (compraMessage) {
                        compraMessage.textContent = "No se pudo crear el pedido.";
                    }

                    console.error("Error al crear pedido desde el BFF:", pedido);
                }
            } catch (error) {
                console.error("Error al conectar con el BFF de pedidos:", error);

                if (compraMessage) {
                    compraMessage.textContent = "Error al conectar con el BFF de pedidos.";
                }
            }
        });
    }

    if (volverPanelBtn) {
        volverPanelBtn.addEventListener("click", async function () {
            ocultarSeccionesCliente();

            if (sessionSection) {
                sessionSection.style.display = "block";
                sessionSection.scrollIntoView({ behavior: "smooth" });
            }

            if (compraMessage) {
                compraMessage.textContent = "";
            }

            await cargarProductosDisponibles();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", cerrarSesion);
    }

    if (logoutConfirmacionBtn) {
        logoutConfirmacionBtn.addEventListener("click", cerrarSesion);
    }

    cargarProductosDisponibles();
});