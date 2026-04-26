import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ==========================
// 🔐 AUTENTICAÇÃO
// ==========================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    atualizarSaudacao(user.email.split("@")[0]);
  }
});

// ==========================
// 📦 DADOS (SIMULAÇÃO)
// ==========================
const compras = [
  {
    nome: "João",
    whatsapp: "41999999999",
    numeros: [1,2,3],
    quantidade: 3,
    total: 15,
    status: "pago",
    data: "2026-04-25",
    hora: "10:30"
  },
  {
    nome: "Maria",
    whatsapp: "41988888888",
    numeros: [4,5],
    quantidade: 2,
    total: 10,
    status: "pendente",
    data: "2026-04-25",
    hora: "14:10"
  },
  {
    nome: "João",
    whatsapp: "41999999999",
    numeros: [6,7],
    quantidade: 2,
    total: 10,
    status: "pago",
    data: "2026-04-26",
    hora: "09:00"
  }
];

const tabela = document.getElementById("tabela");

let total = 0;
let pendentes = 0;
let totalPedidos = compras.length;
let numerosVendidos = 0;

let todosNumeros = [];
let numerosOrdenadosCronologico = [];

// ==========================
// 📊 PROCESSAMENTO
// ==========================
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

// 🔥 ordenar corretamente por data
const comprasOrdenadas = [...compras].sort((a, b) => {
  return new Date(`${a.data} ${a.hora}`) - new Date(`${b.data} ${b.hora}`);
});

comprasOrdenadas.forEach(c => {
  if (c.status === "pago") {
    numerosOrdenadosCronologico.push(...c.numeros);
  }
});

// organizar números únicos
todosNumeros = [...new Set(todosNumeros)].sort((a, b) => a - b);

// ==========================
// 📊 RESUMO
// ==========================
document.getElementById("total").innerText = `R$ ${total}`;
document.getElementById("pendentes").innerText = pendentes;
document.getElementById("pedidos").innerText = totalPedidos;
document.getElementById("numerosVendidos").innerText = numerosVendidos;


// ==========================
// 🎲 SORTEIO
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

  // limpar estado anterior
  resultadoFinal.style.display = "none";
  document.getElementById("nomeFinal").innerText = "";
  document.getElementById("telefoneFinal").innerText = "";

  let contagem = 8;
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
  const btnVoltar = document.getElementById("btnVoltar");

  numeroFinal.innerText = numeroSorteado;

  let vencedor = compras.find(c =>
    c.status === "pago" && c.numeros.includes(numeroSorteado)
  );

  if (vencedor) {
    nomeFinal.innerText = `👤 ${vencedor.nome}`;
    telefoneFinal.innerText = `📞 ${vencedor.whatsapp}`;
  }

  resultadoFinal.style.display = "block";

  btnVoltar.style.display = "none";
  setTimeout(() => {
    btnVoltar.style.display = "inline-block";
  }, 3000);
}

function voltarPainel() {
  document.getElementById("overlay").style.display = "none";
}


// ==========================
// 🎉 CONFETE MELHORADO
// ==========================
function soltarConfete() {
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");

    const size = Math.random() * 8 + 4;

    el.style.position = "fixed";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.borderRadius = "50%";
    el.style.background =
      ["#FFC0CB", "#FF2E8B", "#FFD700"][Math.floor(Math.random()*3)];

    el.style.top = "-10px";
    el.style.left = Math.random() * window.innerWidth + "px";
    el.style.zIndex = 9999;

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
// 👀 ÚLTIMOS 6
// ==========================
function abrirUltimos() {
  const popup = document.getElementById("popupNumeros");
  const container = document.getElementById("ultimosNumeros");

  const ultimos = numerosOrdenadosCronologico.slice(-6);

  container.innerHTML = ultimos.map(n => `
    <span class="numero">${n}</span>
  `).join('');

  popup.style.display = "flex";
}

function fecharPopup() {
  document.getElementById("popupNumeros").style.display = "none";
}


// ==========================
// 📄 PDF MELHORADO
// ==========================
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.setFontSize(14);
  doc.text("Lista Oficial da Rifa", 10, y);
  y += 10;

  compras.forEach(c => {
    if (c.status === "pago") {
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
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Erro ao sair:", error);
    });
}

// ==========================
// 👋 SAUDAÇÃO
// ==========================

function atualizarSaudacao(nome) {
  const hora = new Date().getHours();
  let saudacao = "";

  if (hora >= 5 && hora < 12) {
    saudacao = "Bom dia";
  } else if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  // 👇 primeira letra maiúscula + resto minúsculo
  const nomeFormatado =
    nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

  document.getElementById("boasVindas").innerText =
    `Olá ${nomeFormatado}, tenha um ${saudacao} 👋`;
}

// ==========================
// 🌍 EXPOR FUNÇÕES PARA O HTML
// ==========================
window.sortear = sortear;
window.abrirUltimos = abrirUltimos;
window.fecharPopup = fecharPopup;
window.gerarPDF = gerarPDF;
window.voltarPainel = voltarPainel;
window.sair = sair;