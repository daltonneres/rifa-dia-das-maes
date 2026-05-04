import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================
// 🔐 AUTENTICAÇÃO
// ==========================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    atualizarSaudacao(user.email.split("@")[0]);
    carregarCompras();
  }
});

// ==========================
// 📊 VARIÁVEIS
// ==========================
const tabela = document.getElementById("tabela");

let compras = [];

let total = 0;
let pendentes = 0;
let totalPedidos = 0;
let numerosVendidos = 0;

let todosNumeros = [];
let numerosOrdenadosCronologico = [];

// ==========================
// 🔥 CARREGAR DO FIREBASE
// ==========================
async function carregarCompras() {
  const querySnapshot = await getDocs(collection(db, "compras"));

  compras = [];

  total = 0;
  pendentes = 0;
  totalPedidos = 0;
  numerosVendidos = 0;
  todosNumeros = [];
  numerosOrdenadosCronologico = [];

  tabela.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // ✅ Corrige números
    if (typeof data.numeros === "string") {
      data.numeros = data.numeros
        .split(",")
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));
    }

    if (!Array.isArray(data.numeros)) {
      data.numeros = [];
    }

    data.numeros = [...new Set(data.numeros)];

    compras.push(data);
  });

  totalPedidos = compras.length;

  compras.forEach(c => {
    total += c.total;

    if (c.status === "pendente") pendentes++;

    if (c.status === "pago") {
      numerosVendidos += c.quantidade;
      todosNumeros.push(...c.numeros);
    }

    tabela.innerHTML += `
      <tr>
        <td>${c.nome}</td>
        <td>${c.whatsapp}</td>
        <td>${c.numeros.join(", ")}</td>
        <td>${c.quantidade}</td>
        <td>R$ ${c.total}</td>
        <td class="${c.status === "pago" ? "pago" : "pendente"}">
          ${c.status}
        </td>
        <td>${c.data}</td>
        <td>${c.hora}</td>
      </tr>
    `;
  });

  // ordenar cronológico
  const comprasOrdenadas = [...compras].sort((a, b) => {
    return new Date(`${a.data} ${a.hora}`) - new Date(`${b.data} ${b.hora}`);
  });

  comprasOrdenadas.forEach(c => {
    if (c.status === "pago") {
      numerosOrdenadosCronologico.push(...c.numeros);
    }
  });

  // 🔒 REMOVE DUPLICADOS GLOBAL
  todosNumeros = [...new Set(todosNumeros)].sort((a, b) => a - b);

  // 🔥 pega ultimo número do sistema
  const configRef = doc(db, "config", "rifa");
  const configSnap = await getDoc(configRef);

  let ultimoNumero = 0;

  if (configSnap.exists()) {
    ultimoNumero = configSnap.data().ultimoNumero || 0;
  }

  // atualizar painel
  document.getElementById("total").innerText = `R$ ${total}`;
  document.getElementById("pendentes").innerText = pendentes;
  document.getElementById("pedidos").innerText = totalPedidos;
  document.getElementById("numerosVendidos").innerText = numerosVendidos;

  console.log("Último número global:", ultimoNumero);
}

// ==========================
// 🎲 SORTEIO (igual)
// ==========================
function sortear() {
  if (todosNumeros.length === 0) {
    alert("Nenhum número disponível!");
    return;
  }

  const overlay = document.getElementById("overlay");
  const numeroAnimado = document.getElementById("numeroAnimado");
  const resultadoFinal = document.getElementById("resultadoFinal");

  overlay.style.display = "flex";

  resultadoFinal.style.display = "none";
  document.getElementById("nomeFinal").innerText = "";
  document.getElementById("telefoneFinal").innerText = "";

  let contagem = 5;
  numeroAnimado.innerText = contagem;

  const contadorInterval = setInterval(() => {
    contagem--;

    if (contagem > 0) {
      numeroAnimado.innerText = contagem;
    } else {
      clearInterval(contadorInterval);
      iniciarAnimacaoSorteio();
    }
  }, 1000);
}

// ==========================
// 🎰 ANIMAÇÃO
// ==========================
function iniciarAnimacaoSorteio() {
  const numeroAnimado = document.getElementById("numeroAnimado");

  let numeroFinalSorteado;

  const animacao = setInterval(() => {
    const random =
      todosNumeros[Math.floor(Math.random() * todosNumeros.length)];

    numeroAnimado.innerText = random;
    numeroFinalSorteado = random;
  }, 80);

  setTimeout(() => {
    clearInterval(animacao);
    mostrarResultado(numeroFinalSorteado);
    soltarConfete();
  }, 2000);
}

// ==========================
// 🏆 RESULTADO
// ==========================
function mostrarResultado(numeroSorteado) {
  const numeroFinal = document.getElementById("numeroFinal");
  const nomeFinal = document.getElementById("nomeFinal");
  const telefoneFinal = document.getElementById("telefoneFinal");
  const resultadoFinal = document.getElementById("resultadoFinal");

  numeroFinal.innerText = numeroSorteado;

  let vencedor = compras.find(c =>
    c.status === "pago" &&
    Array.isArray(c.numeros) &&
    c.numeros.includes(numeroSorteado)
  );

  if (vencedor) {
    nomeFinal.innerText = `👤 ${vencedor.nome}`;
    telefoneFinal.innerText = `📞 ${vencedor.whatsapp}`;
  }

  resultadoFinal.style.display = "block";
}

// ==========================
// 🎉 CONFETE
// ==========================
function soltarConfete() {
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");

    el.style.position = "fixed";
    el.style.width = "6px";
    el.style.height = "6px";
    el.style.borderRadius = "50%";
    el.style.background = ["#FF2E8B", "#FFC0CB"][Math.floor(Math.random()*2)];

    el.style.top = "-10px";
    el.style.left = Math.random() * window.innerWidth + "px";

    document.body.appendChild(el);

    let speed = Math.random() * 5 + 5;

    const fall = setInterval(() => {
      el.style.top = (parseFloat(el.style.top) + speed) + "px";

      if (parseFloat(el.style.top) > window.innerHeight) {
        clearInterval(fall);
        el.remove();
      }
    }, 50);
  }
}

// ==========================
// 📄 PDF
// ==========================
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.text("Lista Oficial da Rifa", 10, y);
  y += 10;

  compras.forEach(c => {
    if (c.status === "pago" && Array.isArray(c.numeros)) {
      c.numeros.forEach(numero => {

        doc.text(`Número: ${numero}`, 10, y);
        y += 5;
        doc.text(`Nome: ${c.nome}`, 10, y);
        y += 5;
        doc.text(`Telefone: ${c.whatsapp}`, 10, y);
        y += 10;

        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });
    }
  });

  doc.save("rifa-oficial.pdf");
}

// ==========================
// 🚪 SAIR
// ==========================
function sair() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}

// ==========================
// 👋 SAUDAÇÃO
// ==========================
function atualizarSaudacao(nome) {
  const hora = new Date().getHours();
  let saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const nomeFormatado =
    nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

  document.getElementById("boasVindas").innerText =
    `Olá ${nomeFormatado}, ${saudacao} 👋`;
}

// ==========================
// 🌍 GLOBAL
// ==========================
window.sortear = sortear;
window.gerarPDF = gerarPDF;
window.sair = sair;

// ==========================
// 👀 ÚLTIMOS NÚMEROS
// ==========================
function abrirUltimos() {

  const popup =
    document.getElementById("popupNumeros");

  const lista =
    document.getElementById("ultimosNumeros");

  lista.innerHTML = "";

  // últimos 20 números pagos
  const ultimos =
    numerosOrdenadosCronologico
      .slice(-20)
      .reverse();

  if (ultimos.length === 0) {

    lista.innerHTML = `
      <p>Nenhum número vendido ainda.</p>
    `;

  } else {

    ultimos.forEach(numero => {

      lista.innerHTML += `
        <span class="numero">
          ${numero}
        </span>
      `;

    });
  }

  popup.style.display = "flex";
}


// ==========================
// ❌ FECHAR POPUP
// ==========================
function fecharPopup() {

  document.getElementById(
    "popupNumeros"
  ).style.display = "none";
}


// ==========================
// 🔙 VOLTAR DO SORTEIO
// ==========================
function voltarPainel() {

  document.getElementById(
    "overlay"
  ).style.display = "none";
}


// ==========================
// 🌍 GLOBAL
// ==========================
window.abrirUltimos = abrirUltimos;
window.fecharPopup = fecharPopup;
window.voltarPainel = voltarPainel;