/* =========================================================
   La fe en Dios — comportamiento del sitio
   1. Menú móvil
   2. Versículo del día (index.html)
   3. Copiar versículo
   4. Filtros de reflexiones (reflexion.html)
   5. Formulario de contacto (contacto.html)
   Todo funciona sin frameworks: HTML, CSS y JavaScript.
   ========================================================= */

(function () {
  "use strict";

  /* ===== 1. Menú móvil ===== */
  var botonMenu = document.querySelector("[data-menu-boton]");
  var menu = document.getElementById("menu");

  function cerrarMenu() {
    if (!menu || !botonMenu) return;
    menu.classList.remove("esta-abierto");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      var abierto = menu.classList.toggle("esta-abierto");
      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    menu.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) cerrarMenu();
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") cerrarMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) cerrarMenu();
    });
  }

  /* ===== 2. Versículo del día ===== */
  var versiculos = [
    { texto: "Todo lo puedo en Cristo que me fortalece.", cita: "Filipenses 4:13" },
    { texto: "Jehová es mi pastor; nada me faltará.", cita: "Salmo 23:1" },
    { texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.", cita: "Juan 3:16" },
    { texto: "Echa sobre Jehová tu carga, y él te sustentará.", cita: "Salmo 55:22" },
    { texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.", cita: "Isaías 41:10" },
    { texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", cita: "Mateo 11:28" },
    { texto: "La misericordia de Jehová es desde la eternidad y hasta la eternidad.", cita: "Salmo 103:17" },
    { texto: "Esfuérzate y sé valiente; no temas ni desmayes.", cita: "Josué 1:9" },
    { texto: "Perfecto amor echa fuera el temor.", cita: "1 Juan 4:18" },
    { texto: "Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.", cita: "Salmo 37:4" },
    { texto: "Jehová está cerca de los quebrantados de corazón.", cita: "Salmo 34:18" },
    { texto: "El amor es sufrido, es benigno; el amor no tiene envidia.", cita: "1 Corintios 13:4" },
    { texto: "Alégrate, porque tu recompensa es grande en los cielos.", cita: "Mateo 5:12" },
    { texto: "Por la misericordia de Jehová no hemos sido consumidos; nuevas son cada mañana.", cita: "Lamentaciones 3:22" }
  ];

  var textoVersiculo = document.getElementById("versiculo-texto");
  var citaVersiculo = document.getElementById("versiculo-cita");
  var fechaVersiculo = document.getElementById("versiculo-fecha");
  var versiculoActual = null;

  if (textoVersiculo && citaVersiculo) {
    var ahora = new Date();
    var inicioDelAnio = Date.UTC(ahora.getFullYear(), 0, 0);
    var hoy = Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    var diaDelAnio = Math.floor((hoy - inicioDelAnio) / 86400000);

    versiculoActual = versiculos[diaDelAnio % versiculos.length];
    textoVersiculo.textContent = "«" + versiculoActual.texto + "»";
    citaVersiculo.textContent = versiculoActual.cita;

    if (fechaVersiculo) {
      var fecha = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(ahora);
      fechaVersiculo.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    }
  }

  /* ===== 3. Copiar versículo ===== */
  var botonCopiar = document.querySelector("[data-copiar]");

  if (botonCopiar && (versiculoActual || textoVersiculo)) {
    botonCopiar.addEventListener("click", function () {
      var texto = versiculoActual
        ? "«" + versiculoActual.texto + "» — " + versiculoActual.cita
        : textoVersiculo.textContent + " — " + (citaVersiculo ? citaVersiculo.textContent : "");
      var etiqueta = botonCopiar.querySelector("span");

      function confirmar() {
        if (!etiqueta) return;
        etiqueta.textContent = "Copiado";
        window.setTimeout(function () {
          etiqueta.textContent = "Copiar";
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(confirmar, function () {
          if (etiqueta) etiqueta.textContent = "No se pudo copiar";
        });
      } else if (etiqueta) {
        etiqueta.textContent = "No se pudo copiar";
      }
    });
  }

  /* ===== 4. Filtros de reflexiones ===== */
  var grupoFiltros = document.querySelector("[data-filtros]");

  if (grupoFiltros) {
    var botones = Array.prototype.slice.call(
      grupoFiltros.querySelectorAll("button[data-filtro]")
    );
    var lista = document.querySelector("[data-lista]");
    var contador = document.getElementById("contador");
    var reflexiones = lista
      ? Array.prototype.slice.call(lista.querySelectorAll("[data-tema]"))
      : [];

    botones.forEach(function (boton) {
      boton.addEventListener("click", function () {
        botones.forEach(function (otro) {
          otro.setAttribute("aria-pressed", String(otro === boton));
        });

        var filtro = boton.dataset.filtro;
        var visibles = 0;

        reflexiones.forEach(function (reflexion) {
          var mostrar = filtro === "Todos" || reflexion.dataset.tema === filtro;
          reflexion.hidden = !mostrar;
          if (mostrar) visibles += 1;
        });

        if (contador) {
          var texto = visibles + (visibles === 1 ? " reflexión" : " reflexiones");
          if (filtro !== "Todos") texto += " sobre " + filtro.toLowerCase();
          contador.textContent = texto;
        }
      });
    });
  }

  /* Abre la reflexión a la que apunta el enlace (reflexion.html#slug) */
  function abrirDesdeElEnlace() {
    if (!window.location.hash || window.location.hash.length < 2) return;
    var destino;
    try {
      destino = document.querySelector(window.location.hash);
    } catch (error) {
      return;
    }
    if (destino && destino.tagName === "DETAILS") {
      destino.open = true;
      destino.scrollIntoView({ block: "start" });
    }
  }

  abrirDesdeElEnlace();
  window.addEventListener("hashchange", abrirDesdeElEnlace);

  /* ===== 5. Formulario de contacto ===== */
  var formulario = document.getElementById("formulario");

  if (formulario) {
    /* Clave pública del proyecto: solo permite INSERT en la tabla de mensajes. */
    var API = "https://spb-t4nrc3n6918r9wuv.supabase.opentrust.net/rest/v1/mensajes_contacto";
    var CLAVE = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi10NG5yYzNuNjkxOHI5d3V2IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3OTI2ODM2MDksImV4cCI6MjEwODI1OTYwOX0.NgijE3fgYxfI01zNE_JXLLZiAOtE23nYYGdpJJjqqaI";

    var campos = {
      nombre: document.getElementById("nombre"),
      correo: document.getElementById("correo"),
      mensaje: document.getElementById("mensaje"),
      privacidad: document.getElementById("privacidad")
    };

    var botonEnviar = document.getElementById("enviar");
    var avisoError = document.getElementById("aviso-error");
    var exito = document.getElementById("exito");
    var otroMensaje = document.getElementById("otro-mensaje");

    function mostrarError(campo, texto) {
      var caja = document.getElementById(campo.id + "-error");
      campo.setAttribute("aria-invalid", texto ? "true" : "false");
      if (!caja) return;
      caja.textContent = texto || "";
      caja.classList.toggle("oculto", !texto);
      if (texto) {
        campo.setAttribute("aria-describedby", caja.id);
      } else {
        campo.removeAttribute("aria-describedby");
      }
    }

    function validar() {
      var errores = [];

      if (campos.nombre.value.trim().length < 2) {
        mostrarError(campos.nombre, "Escribe tu nombre (al menos 2 caracteres).");
        errores.push(campos.nombre);
      } else {
        mostrarError(campos.nombre, "");
      }

      var correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.correo.value.trim());
      if (!correoValido) {
        mostrarError(campos.correo, "Revisa el correo: parece incompleto.");
        errores.push(campos.correo);
      } else {
        mostrarError(campos.correo, "");
      }

      var largo = campos.mensaje.value.trim().length;
      if (largo < 10) {
        mostrarError(campos.mensaje, "Cuéntanos un poco más (mínimo 10 caracteres).");
        errores.push(campos.mensaje);
      } else {
        mostrarError(campos.mensaje, "");
      }

      var cajaPrivacidad = document.getElementById("privacidad-error");
      if (!campos.privacidad.checked) {
        if (cajaPrivacidad) {
          cajaPrivacidad.textContent = "Necesitamos tu permiso para guardar el mensaje.";
          cajaPrivacidad.classList.remove("oculto");
        }
        errores.push(campos.privacidad);
      } else if (cajaPrivacidad) {
        cajaPrivacidad.textContent = "";
        cajaPrivacidad.classList.add("oculto");
      }

      return errores;
    }

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      var errores = validar();
      if (errores.length > 0) {
        errores[0].focus();
        return;
      }

      if (avisoError) avisoError.classList.add("oculto");
      botonEnviar.disabled = true;
      botonEnviar.textContent = "Enviando…";

      fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: CLAVE,
          Authorization: "Bearer " + CLAVE,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          nombre: campos.nombre.value.trim(),
          correo: campos.correo.value.trim(),
          mensaje: campos.mensaje.value.trim(),
          acepta_privacidad: true
        })
      })
        .then(function (respuesta) {
          if (!respuesta.ok) throw new Error("No se pudo enviar");
          formulario.classList.add("oculto");
          if (exito) {
            exito.classList.remove("oculto");
            exito.focus();
          }
        })
        .catch(function () {
          if (avisoError) {
            avisoError.textContent =
              "No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo.";
            avisoError.classList.remove("oculto");
          }
        })
        .finally(function () {
          botonEnviar.disabled = false;
          botonEnviar.textContent = "Enviar mensaje";
        });
    });

    if (otroMensaje) {
      otroMensaje.addEventListener("click", function () {
        formulario.reset();
        formulario.classList.remove("oculto");
        if (exito) exito.classList.add("oculto");
        campos.nombre.focus();
      });
    }
  }
})();
