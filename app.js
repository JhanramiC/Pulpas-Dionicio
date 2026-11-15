const TELEFONO = "5217229130428";
const sabores = [
  { id: 1, nom: "Maracuyá", img: "maracuya", desc: "Pulpa natural con sabor intenso y aroma tropical." },
  { id: 2, nom: "Guanabana", img: "guanabana", desc: "Pulpa cremosa, suave y con un sabor muy característico." },
  { id: 3, nom: "Mango", img: "mango", desc: "Pulpa fresca y dorada, con excelente dulzor natural." },
  { id: 4, nom: "Mamey", img: "mamey", desc: "Pulpa de textura cremosa y sabor dulce y profundo." },
  { id: 5, nom: "Tamarindo", img: "tamarindo", desc: "Pulpa ácida y aromática, ideal para bebidas y cócteles." },
  { id: 6, nom: "Fresa", img: "fresa", desc: "Pulpa roja intensa con sabor dulce y natural." },
  { id: 7, nom: "Frutos del bosque", img: "frutos-bosque", desc: "Mezcla premium con un sabor frutal y equilibrado." },
  { id: 8, nom: "Frutos rojos", img: "fresa", desc: "Pulpa con sabor vibrante y muy apetecible." }
];

let carrito = {};

document.getElementById("catalogo").innerHTML = sabores.map((s) => `
  <div class="card">
    <div>
      <div class="img-box">
        <img src="img/${s.img}.jpeg" onerror="this.src='img/${s.img}.jpg'" />
        <span class="tag">1 kg neto</span>
      </div>
      <div class="card-body">
        <h3>${s.nom}</h3>
        <p>${s.desc}</p>
      </div>
    </div>
    <div class="card-footer">
      <div>
        <span class="precio">$180 MXN</span>
        <span class="mayoreo">$150 mayoreo (6+)</span>
      </div>
      <div class="controles">
        <button type="button" class="btn btn-menos" onclick="sumar('${s.nom}', -1, 'c${s.id}')">-</button>
        <span class="cant" id="c${s.id}">0</span>
        <button type="button" class="btn btn-mas" onclick="sumar('${s.nom}', 1, 'c${s.id}')">+</button>
      </div>
    </div>
  </div>
`).join("");

function sumar(nom, d, idSpan) {
  carrito[nom] = (carrito[nom] || 0) + d;
  if (carrito[nom] <= 0) delete carrito[nom];
  document.getElementById(idSpan).textContent = carrito[nom] || 0;
  actualizar();
}

function actualizar() {
  const piezas = Object.values(carrito).reduce((a, b) => a + b, 0);
  const mayoreo = piezas >= 6;
  const unit = mayoreo ? 150 : 180;
  const total = piezas * unit;
  let html = "";

  for (const p in carrito) {
    html += `<div class="item-row"><span>${carrito[p]}x ${p} (1 kg)</span><strong>$${carrito[p] * unit} MXN</strong></div>`;
  }

  const aviso = document.getElementById("aviso");

  if (piezas === 0) {
    aviso.className = "aviso";
    aviso.innerText = "Agrega 6 kilos o más para activar precio de mayoreo ($150 MXN/kg).";
  } else if (mayoreo) {
    aviso.className = "aviso aviso-ok";
    aviso.innerText = "Precio de mayoreo activado ($150 MXN por kilo)";
  } else {
    aviso.className = "aviso";
    aviso.innerText = "Tarifa menudeo ($180/kg). Agrega " + (6 - piezas) + " kilo(s) más para bajar a $150/kg.";
  }

  document.getElementById("resumen").innerHTML = html || '<p style="color:#6b7280;">Selecciona al menos 1 kilo arriba para ver el desglose.</p>';
  document.getElementById("total").innerText = "$" + total + " MXN";
  document.getElementById("b-total").innerText = "$" + total + " MXN";
  document.getElementById("b-items").innerText = piezas + " piezas ($" + unit + " c/u)";
}

function enviarWA() {
  const nom = document.getElementById("nombre").value.trim();
  const ent = document.getElementById("entrega").value;
  const dir = document.getElementById("direccion").value.trim();
  const not = document.getElementById("notas").value.trim();
  const piezas = Object.values(carrito).reduce((a, b) => a + b, 0);

  if (piezas === 0) return alert("Agrega al menos un kilo de pulpa a tu pedido.");
  if (!nom) return alert("Por favor escribe tu nombre.");
  if (ent === "A domicilio" && !dir) return alert("Por favor escribe tu dirección.");

  const mayoreo = piezas >= 6;
  const unit = mayoreo ? 150 : 180;
  const total = piezas * unit;

  let msg = "Hola, quiero hacer este pedido en Pulpas Dionicio:\n\n";
  for (const p in carrito) {
    msg += "- " + carrito[p] + "x " + p + " (1 kg) - $" + (carrito[p] * unit) + "\n";
  }

  msg += "\n*Total piezas:* " + piezas + " kg\n";
  msg += "*Tarifa:* " + (mayoreo ? "Mayoreo ($150/kg)" : "Menudeo ($180/kg)") + "\n";
  msg += "*Total a pagar:* $" + total + " MXN\n";
  msg += "*Nombre:* " + nom + "\n";
  msg += "*Entrega:* " + ent + "\n";

  if (ent === "A domicilio") msg += "*Dirección:* " + dir + "\n";
  if (not) msg += "*Notas:* " + not + "\n";

  window.open("https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(msg), "_blank");
}

actualizar();
