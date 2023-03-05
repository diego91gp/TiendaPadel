window.onload = function () {


    document.querySelector(".cesta").addEventListener("click", () => {
        document.querySelector(".carro").classList.toggle("active");

    })
    var filtros = document.querySelectorAll(".tipos_foto");
    for (const fil of filtros) {
        fil.addEventListener("click", filtra);

    }
    document.querySelector(".cabecera").addEventListener("click", () => {
        location.reload();
    });
    document.querySelector(".wrapper").addEventListener("click", funciones);
    document.querySelector(".fa-magnifying-glass").addEventListener("click", filtra);
    document.querySelector(".buscador").addEventListener("keydown", filtra);
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
    function filtra(e) {
        var filter = new Map();

        //Si pulsaste enter o la lupa filtra por lo que hayas escrito
        if (e.keyCode == 13 || this.tagName == "I") {
            for (const [k, v] of productos) {
                //transformamos cada objeto a texto y si incluye lo que hayamos escrito filtra
                let texto = Object.values(v).join("");
                if (texto.toUpperCase().includes(document.querySelector("#buscador").value.toUpperCase())) {
                    filter.set(k, v);
                }
            }
            if (filter.size == 0) {
                document.querySelector("h1").textContent = "No se han encontrado resultados"
                document.querySelector(".wrapper").innerHTML = "";
                return false;
            }
            document.querySelector("h1").textContent = "Resultados de " + document.querySelector("#buscador").value.toUpperCase();
            document.querySelector("#buscador").value = "";
            showView(filter);
        }
        //Si no pulsaste nada  ni la lupa
        if (e.keyCode == undefined && this.tagName != "I") {
            for (const [k, v] of productos) {
                if (v.categoria == this.dataset.nom) {
                    filter.set(k, v);
                }
            }
            document.querySelector("h1").textContent = this.dataset.nom.toUpperCase();
            // if (sessionStorage.getItem("productos")) {
            //     for (const p of JSON.parse(sessionStorage.getItem("productos"))) {
            //         mapacarro.set(p[0], p[1]);
            //     }
            //   pintaCarro();


            showView(filter);
        }




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

        if (e.target) {
            e = e.target.className;
        }

        let prodactu = productos.get(e);
        let referencia = document.getElementsByClassName(e)[0];

        if (prodactu.unidades <= 5 && referencia != undefined) {
            referencia.previousElementSibling.previousElementSibling.firstElementChild.style.color = "red";
        }
        //si las unidades son 1 desactiva el boton porque compro la ultima
        if (prodactu.unidades == 1) {
            prodactu.unidades = productos.get(e).unidades - 1;
            productos.set(e, prodactu);

            //Si estoy en la vista que tenga el producto actualiza datos
            if (referencia != undefined) {
                referencia.previousElementSibling.previousElementSibling.innerHTML = ""; //`<img src="Images/agotado.png">`;
                referencia.parentElement.classList.toggle("grises");
                referencia.disabled = true;
                referencia.textContent = "Producto Agotado";

            }

        } else {
            prodactu.unidades = productos.get(e).unidades - 1;
            productos.set(e, prodactu);
            if (referencia != undefined) {
                referencia.previousElementSibling.previousElementSibling.firstElementChild.textContent = prodactu.unidades;
            }

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
        if (document.querySelector(".carro").classList.contains("active")) {
            document.querySelector(".carro").classList.remove("active");
        }

        //clickl quitar carro
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
            compruebaCupon();
        }

        if (e.target.tagName == "BUTTON") {
            botonesCarro(e);
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
        <div><input id="inputcupon" type="text" placeholder="Código Descuento " ><span id="novalido">OUT8: 8% descuento</span></div>
        
        <div id="totalcompra">Total: 
        ${total.toFixed(2).replace(".", ",")}   €</div>
        <a id="factura" rel="opener" href="factura.html" target="_blank">GENERAR FACTURA <i class="fa-solid fa-file-invoice"></i></a>
        `
        //rel="opener" hace que no se pierda el sesion storage al cambiar de ventan con el parametro blank
        sessionStorage.setItem("productos", JSON.stringify(Array.from(mapacarro)));
        ;
        if (mapacarro.get("cupon") != 1) {

            document.querySelector("#inputcupon").remove();

            document.getElementById("novalido").style.display = "block";
            total = total * mapacarro.get("cupon");
            document.getElementById("totalcompra").textContent = `Total : ${total.toFixed(2).replace(".", ",")}   €`;
        }
    }


    function compruebaCupon() {
        if (document.querySelector("#inputcupon").value == "OUT8") {

            mapacarro.set("cupon", 0.92);
            pintaCarro();

        } else {

            document.querySelector("#inputcupon").value = "";
            document.querySelector("#inputcupon").placeholder = "Cupón No Valido";


        }
    }

    function botonesCarro(e) {
        let clave = e.target.parentElement.parentElement.parentElement.id;

        if (e.target.textContent == "+") {
            compra(clave);
        } else {
            let actu = productos.get(clave);
            actu.unidades = actu.unidades + 1;
            productos.set(clave, actu);
            mapacarro.set(productos.get(clave), mapacarro.get(productos.get(clave)) - 1);

            //Si se actualizan las unidades a 1 se vuelve a pintar el boton de compra, pero si estoy en una vista que no tenga ese articulo no hace nada, al volver a cargar su vista se actualizara solo
            if (productos.get(clave).unidades == 1 && document.getElementsByClassName(clave).length != 0) {

                document.getElementsByClassName(clave)[0].previousElementSibling.previousElementSibling.innerHTML = `ULTIMAS <strong> ${productos.get(clave).unidades}</strong> uds.`;
                document.getElementsByClassName(clave)[0].parentElement.classList.toggle("grises");
                document.getElementsByClassName(clave)[0].textContent = "Añadir a la cesta";
                document.getElementsByClassName(clave)[0].disabled = false;

            }

            if (document.getElementsByClassName(clave).length != 0) {
                document.getElementsByClassName(clave)[0].previousElementSibling.previousElementSibling.firstElementChild.textContent = actu.unidades;
            }


            if (mapacarro.get(productos.get(clave)) == 0) {
                mapacarro.delete(productos.get(clave));
            }
            pintaCarro();
        }
    }
}











