window.onload = function () {
    document.querySelector(".cesta").addEventListener("click", () => {
        document.querySelector(".carro").classList.toggle("active");

    })
    var filtros = document.querySelectorAll(".tipos_foto");
    for (const fil of filtros) {
        fil.addEventListener("click", filtra);

    }
    document.querySelector(".wrapper").addEventListener("click", funciones);
    document.querySelector(".carro").addEventListener("click", funcionesCarro);
    document.querySelector(".carro").addEventListener("keydown", funcionesCarro);
    var productos = new Map();
    var mapacarro = new Map();
    mapacarro.set("cupon", 1);
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
            <div class="mensaje"><i class="fa-solid fa-basket-shopping"></i></div>
            <button class="${item.nombre}">Añadir a la cesta</button>
            
            </div>
        `;
            if (item.unidades == 0) {
                document.getElementsByClassName(item.nombre)[0].previousElementSibling.previousElementSibling.innerHTML = "";
                document.getElementsByClassName(item.nombre)[0].parentElement.classList.toggle("grises");
                document.getElementsByClassName(item.nombre)[0].textContent = "Producto Agotado";
                document.getElementsByClassName(item.nombre)[0].disabled = true;
            }
        }
    }

    function compra(e) {

        let prodactu = "";
        let referencia = "";
        if (productos.has(e)) {
            prodactu = productos.get(e);
            referencia = document.getElementsByClassName(e)[0];
        } else {
            referencia = e.target;
            prodactu = productos.get(referencia.classList.value);
        }
        if (prodactu.unidades <= 5) {
            referencia.previousElementSibling.previousElementSibling.firstElementChild.style.color = "red";
        }
        if (prodactu.unidades == 1) {
            prodactu.unidades = productos.get(referencia.classList.value).unidades - 1;
            productos.set(referencia.classList.value, prodactu);
            referencia.previousElementSibling.previousElementSibling.innerHTML = ""; //`<img src="Images/agotado.png">`;
            referencia.parentElement.classList.toggle("grises");
            referencia.disabled = true;
            referencia.textContent = "Producto Agotado";



        } else {
            prodactu.unidades = productos.get(referencia.classList.value).unidades - 1;
            productos.set(referencia.classList.value, prodactu);
            referencia.previousElementSibling.previousElementSibling.firstElementChild.textContent = prodactu.unidades;
        }

        if (!mapacarro.has(prodactu)) {
            mapacarro.set(prodactu, 1);
        }
        else {
            mapacarro.set(prodactu, mapacarro.get(prodactu) + 1);

        }
        pintaCarro();


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

    function funcionesCarro(e) {
        if (e.keyCode == 13) {
            if (document.querySelector("input").value == "SUPERPADEL123") {

                mapacarro.set("cupon", 0.92);
                pintaCarro();

            } else {

                document.querySelector("input").value = "";
                document.querySelector("input").placeholder = "Cupón No Valido";


            }
        }

        if (e.target.tagName == "BUTTON") {
            let clave = e.target.parentElement.parentElement.parentElement.id;

            if (e.target.textContent == "+") {
                compra(clave);
            } else {
                let actu = productos.get(clave);
                actu.unidades = actu.unidades + 1;
                productos.set(clave, actu);
                mapacarro.set(productos.get(clave), mapacarro.get(productos.get(clave)) - 1);

                if (productos.get(clave).unidades == 1) {
                    document.getElementsByClassName(clave)[0].previousElementSibling.previousElementSibling.innerHTML = `ULTIMAS <strong> ${productos.get(clave).unidades}</strong> uds.`;
                    document.getElementsByClassName(clave)[0].parentElement.classList.toggle("grises");
                    document.getElementsByClassName(clave)[0].textContent = "Añadir a la cesta";
                    document.getElementsByClassName(clave)[0].disabled = false;
                } else {
                    document.getElementsByClassName(clave)[0].previousElementSibling.previousElementSibling.firstElementChild.textContent = actu.unidades;
                }
                if (mapacarro.get(productos.get(clave)) == 0) {
                    mapacarro.delete(productos.get(clave));
                }
                pintaCarro();
            }
        }
    }
    function pintaCarro() {
        let carro = document.querySelector(".carro_productos");
        let carrototal = document.querySelector(".carro_calculo");
        document.querySelector("#cantidad").textContent = mapacarro.size - 1;
        if (mapacarro.size == 1) {
            carro.innerHTML = "";
            carrototal.innerText = "Carrito Vacío";
            return false;
        }

        let total = 0;
        carro.innerHTML = "";
        for (const [k, v] of mapacarro) {
            if (k != "cupon") {
                let sumaprecio = (parseFloat(k.precio.replace(",", ".")) * v).toFixed(2);
                let coniva = (parseFloat(sumaprecio) + (sumaprecio * k.iva / 100)).toFixed(2);
                let div = document.createElement("div");
                div.id = k.nombre;
                div.innerHTML = `<div> <img class="${k.categoria}" src="Images/Palas/${k.foto}"></div>`;
                let div3 = document.createElement("div");
                div3.innerHTML = `<h2>${k.nombre}</h2>`;
                let span1 = document.createElement("span");
                if (productos.get(k.nombre).unidades == 0) {
                    span1.innerHTML = `<button>-</button>${v}<button disabled="true" title="Fuera de Stock">+</button>`;

                } else {
                    span1.innerHTML = `<button>-</button>${v}<button>+</button>`;
                }
                div3.appendChild(span1);
                div3.innerHTML += `<span> P.V.P : ${sumaprecio.replace(".", ",")} €</span>
                    <span>IVA:${k.iva}% </span>
                    <span>${coniva.replace(".", ",")} €</span>`;
                div.appendChild(div3);
                carro.appendChild(div);
                total = total + parseFloat(coniva);
            }

        }
        carrototal.innerHTML = ` 
        <div >SubTotal: 
        ${total.toFixed(2).replace(".", ",")}   €</div>
        <div><input type="text" placeholder="Código Descuento " ><span id="novalido">SUPERPADEL1234: 8% descuento</span></div>
        
        <div id="totalcompra">Total: 
        ${total.toFixed(2).replace(".", ",")}   €</div>
        <a href="">Generar Factura</a>
        `;
        if (mapacarro.get("cupon") != 1) {

            document.querySelector("input").remove();

            document.getElementById("novalido").style.display = "block";
            total = total * mapacarro.get("cupon");
            document.getElementById("totalcompra").textContent = `Total : ${total.toFixed(2).replace(".", ",")}   €`;
        }
    }
}







