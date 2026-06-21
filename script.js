document.addEventListener("DOMContentLoaded", function () {
    console.log("SmartLogix frontend cargado correctamente");

    const API_CLIENTES = "http://localhost:8084/clientes";
    const API_PEDIDOS = "http://localhost:8083/pedidos";
    const API_PRODUCTOS = "http://localhost:8082/productos";

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

    console.log("Script principal cargado correctamente");

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

    async function cargarProductosDisponibles() {
        if (!productoCompra) {
            return;
        }

        try {
            const respuesta = await fetch(API_PRODUCTOS);
            const productos = await respuesta.json();

            productoCompra.innerHTML = "";

            if (!respuesta.ok || productos.length === 0) {
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
                productosMessage.textContent = "Productos cargados correctamente.";
            }

            actualizarTotalCompra();
        } catch (error) {
            console.error("Error al cargar productos:", error);

            productoCompra.innerHTML = `<option value="">Error al cargar productos</option>`;

            if (productosMessage) {
                productosMessage.textContent = "Error al conectar con inventario-service.";
            }

            actualizarTotalCompra();
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

    if (productoCompra) {
        productoCompra.addEventListener("change", actualizarTotalCompra);
    }

    if (cantidadCompra) {
        cantidadCompra.addEventListener("input", actualizarTotalCompra);
        cantidadCompra.addEventListener("change", actualizarTotalCompra);
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
                console.error("Error al iniciar sesión:", error);

                if (loginMessage) {
                    loginMessage.textContent = "Error al conectar con cliente-service.";
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

                    console.log("Pedido creado:", pedido);
                } else {
                    if (compraMessage) {
                        compraMessage.textContent = "No se pudo crear el pedido.";
                    }

                    console.error("Error al crear pedido:", pedido);
                }
            } catch (error) {
                console.error("Error al conectar con pedidos-service:", error);

                if (compraMessage) {
                    compraMessage.textContent = "Error al conectar con pedidos-service.";
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