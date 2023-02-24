window.onload = function () {
    document.querySelector(".icocarro").addEventListener("click", () => {
        document.querySelector(".carro").classList.toggle("active");

    })
    var filtros = document.querySelectorAll(".tipos_foto");
    for (const fil of filtros) {
        fil.addEventListener("click", filtra);

    }
    document.querySelector(".wrapper").addEventListener("click", funciones);
    var productos = new Map();
    (async function data() {
        const datos = await fetch("js/catalogo.json");
        const catalogo = await datos.json();
        for (const item of catalogo) {
            productos.set(item.nombre, item);
        }
        return showView();
    })();
    function filtra() {
        var filter = new Map();

        for (const [k, v] of productos) {
            if (v.categoria == this.dataset.nom) {
                filter.set(k, v);

            }
        }
        document.querySelector("h1").textContent = this.dataset.nom.toUpperCase();
        showView(filter);

    }
    function showView(filtro) {
        document.querySelector(".wrapper").innerHTML = "";
        if (filtro == undefined) {
            filtro = productos;
        }
        for (const [k, item] of filtro) {

            let desc = "";
            let desc2 = "";
            let precioanterior = "";
            let imgreg = "";
            let romboreg = "";
            if (item.regalo != "") {
                reg = `De regalo ${item.regalo}`;
                imgreg = `<img class='regalo' src='Images/${item.regalo}.png'>`;
                romboreg = `<div class="paralelogramo">Regalo Incluido</div>`;
            }

            if (item.descuento != "") {
                desc = "descuento";
                desc2 = `- ${item.descuento}%`;
                precioanterior = "<p class='anterior'>P.V.P:<span class='anterior anterior-precio'>" + (parseFloat(item.precio.replace(",", ".")) / (1 - (item.descuento / 100))).toFixed(2).replace(".", ",") + "€</span></p>";

            }
            document.querySelector(".wrapper").innerHTML += `
        <div class="item">
            <div class="item_imagen">
            <img class="item_img" src="Images/Palas/${item.foto}">
                <div class="${desc}">${desc2}</div>
                ${imgreg}
            </div>
            <h2>${item.nombre.toUpperCase()}</h2>
            <span>${item.descripcion}</span>
            
            ${precioanterior}
            <p class="precio">${item.precio}€  </p>
            ${romboreg}
            <span>ULTIMAS <strong> ${item.unidades}</strong> uds.</span>
            <div class="mensaje">Añadido a la cesta</div>
            <button class="${item.nombre}">Comprar</button>
            
            </div>
        `;
        }
    }

    function compra(e) {
        let carro = document.querySelector(".carro_productos");
        let prodactu = productos.get(e.target.classList.value);
        if (prodactu.unidades <= 5) {
            e.target.previousElementSibling.previousElementSibling.firstElementChild.style.color = "red";
        }
        if (prodactu.unidades == 1) {

            e.target.previousElementSibling.previousElementSibling.innerHTML = `<img src="Images/agotado.png">`;
            e.target.parentElement.style.filter = "grayscale(80%)";
            e.target.parentElement.style.pointerEvents = "none";
            e.target.remove();
        } else {
            prodactu.unidades = productos.get(e.target.classList.value).unidades - 1;
            productos.set(e.target.classList.value, prodactu);
            e.target.previousElementSibling.previousElementSibling.firstElementChild.textContent = prodactu.unidades;
        }

        let x = false;
        for (const ch of carro.children) {
            if (ch.id == prodactu.nombre) {
                x = true;
            }

        }

        if (x) {


        } else {
            carro.innerHTML += `
        <div id="${prodactu.nombre}">
            <img src="Images/Palas/${prodactu.foto}">
            <span> Precio : ${prodactu.precio}</span>
            </div>
        `;
        }
    }

    function muestra(e) {
        if (e.target.tagName == "BUTTON") {
            if (e.target.previousElementSibling.className == "mostrar") {
                e.target.previousElementSibling.classList.remove("mostrar");

            }
            e.target.previousElementSibling.classList.add("mostrar");

            // Desvanecer el mensaje 
            setTimeout(() => {
                if (e.target.previousElementSibling != null) {
                    e.target.previousElementSibling.classList.remove("mostrar");
                }
            }, 1500);


        } else {
            let url = e.target.src;
            var tapa = document.getElementById("tapa");
            tapa.innerHTML = `<figure id="imgGrande"><figcaption>${e.target.parentElement.nextElementSibling.textContent}<i class="fa-solid fa-circle-xmark"></i></figcaption><img src=" ${url}" ></figure>`;

            tapa.style.display = "flex";
            setTimeout(() => {
                tapa.firstElementChild.style.opacity = 1;
            }, 100);
            document.querySelector(".fa-circle-xmark").addEventListener("click", cierra);
        }


    }

    function funciones(e) {
        if (e.target.tagName == "BUTTON") {
            muestra(e);
            compra(e);

        }
        if (e.target.className ==
            "item_img") {
            muestra(e);
        }
    }

    function cierra() {
        document.getElementById("tapa").style.display = "none";
    }


}
