// 🔥 IMPORT FIREBASE (SEMPRE NO TOPO)
import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// =========================
// CONTADOR (FORMA SEGURA)
// =========================
const contador = document.getElementById("contador");

const dataSorteio = new Date(2026, 5, 12, 20, 0, 0).getTime();

setInterval(() => {
  if (!contador) return;

  const agora = new Date().getTime();
  const distancia = dataSorteio - agora;

  if (distancia < 0) {
    contador.innerHTML = "💘 O sorteio já aconteceu!";
    return;
  }

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((distancia / (1000 * 60)) % 60);
  const segundos = Math.floor((distancia / 1000) % 60);

  contador.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}, 1000);


// =========================
// 🔢 FIREBASE
// =========================
async function getUltimoNumero() {
  const ref = doc(db, "config", "rifa");
  const snap = await getDoc(ref);

  if (!snap.exists()) return 0;

  return snap.data().ultimoNumero || 0;
}

async function salvarUltimoNumero(numero) {
  const ref = doc(db, "config", "rifa");

  await setDoc(ref, {
    ultimoNumero: numero
  });
}


// =========================
// 🛒 MODAL
// =========================
function iniciarCompra() {
  const modal = document.getElementById("modal");

  modal.style.display = "flex";

  document.getElementById("quantidade").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("whatsappInput").value = "";
  document.getElementById("resumo").innerHTML = "";
}

function fecharModal() {
  const modal = document.getElementById("modal");

  modal.style.display = "none";

  document.getElementById("quantidade").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("whatsappInput").value = "";
  document.getElementById("resumo").innerHTML = "";
}


// =========================
// 📊 RESUMO
// =========================
function atualizarResumo() {
  const valorUnitario = 5;

  const quantidade = parseInt(
    document.getElementById("quantidade").value
  );

  const resumo = document.getElementById("resumo");

  if (!quantidade || quantidade <= 0) {
    resumo.innerHTML = "";
    return;
  }

  const total = quantidade * valorUnitario;

  resumo.innerHTML = `
    <strong>Resumo:</strong><br>
    ${quantidade} número(s)<br>
    Total: <strong style="color:#E53935;">
      R$ ${total.toFixed(2)}
    </strong>
  `;
}


// =========================
// ✅ CONFIRMAR COMPRA
// =========================
async function confirmarCompra() {

  const valorUnitario = 5;

  const quantidade = parseInt(
    document.getElementById("quantidade").value
  );

  const nome =
    document.getElementById("nome").value.trim();

  const whatsapp =
    document.getElementById("whatsappInput").value.trim();

  // validações
  if (!quantidade || quantidade <= 0) {
    alert("Quantidade inválida!");
    return;
  }

  if (!nome) {
    alert("Nome obrigatório!");
    return;
  }

  if (!whatsapp) {
    alert("WhatsApp obrigatório!");
    return;
  }

  const whatsappLimpo = whatsapp.replace(/\D/g, "");

  if (
    whatsappLimpo.length < 10 ||
    whatsappLimpo.length > 11
  ) {
    alert("WhatsApp inválido!");
    return;
  }

  const total = quantidade * valorUnitario;

  fecharModal();

  alert(
    `💘 Preparando pagamento de R$ ${total.toFixed(2)}`
  );

  try {

    let ultimoNumero = await getUltimoNumero();

    const numeros = [];

    for (let i = 0; i < quantidade; i++) {
      ultimoNumero++;
      numeros.push(ultimoNumero);
    }

    await salvarUltimoNumero(ultimoNumero);

    await addDoc(collection(db, "compras"), {
      nome,
      whatsapp: whatsappLimpo,
      numeros,
      quantidade,
      total,
      status: "pendente",
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString()
    });

    mostrarConfirmacao(nome, numeros, total);

  } catch (erro) {

    console.error("Erro ao salvar:", erro);

    alert(
      "Erro ao finalizar compra 😢"
    );
  }
}


// =========================
// 🎉 CONFIRMAÇÃO
// =========================

function mostrarConfirmacao(nome, numeros, total) {

  const container = document.querySelector(".container");

  // esconde footer
  const footer = document.querySelector("footer");
  if (footer) footer.style.display = "none";

  // esconde botão whatsapp
  const whatsappBtn = document.querySelector(".whatsapp");
  if (whatsappBtn) whatsappBtn.style.display = "none";

  // substitui conteúdo da tela
  container.innerHTML = `
    <div class="card" style="
      text-align:center;
      margin-top:20px;
    ">

      <h2 style="
        color:#E53935;
        margin-bottom:15px;
      ">
        💖 Compra Confirmada!
      </h2>

      <p>
        Obrigado,
        <strong>${nome}</strong>!
      </p>

      <p>
        Você acabou de espalhar mais amor participando da nossa rifa 💘
      </p>

      <p>
        <strong>Total:</strong>
        R$ ${total.toFixed(2)}
      </p>

      <p>
        Seus números da sorte:
      </p>

      <div style="
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        justify-content:center;
        margin:20px 0;
      ">

        ${numeros.map(n => `
          <span style="
            background:#FFC0CB;
            padding:10px 14px;
            border-radius:8px;
            font-weight:600;
          ">
            ${n}
          </span>
        `).join("")}

      </div>

      <p style="margin-top:15px;">
        📸 <strong>Guarde este momento:</strong><br>
        Tire um print e salve seus números.
      </p>

      <p>
        🔐 Seus dados estão seguros e registrados
        para garantir um sorteio justo e transparente.
      </p>

      <p style="margin-top:10px;">
        Boa sorte e muito amor! 💕
      </p>

      <button
        id="btnVoltar"
        style="
          margin-top:20px;
          background:#E53935;
          color:#fff;
          border:none;
          padding:12px 18px;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        "
      >
        🔙 Voltar ao início
      </button>

    </div>
  `;

  // botão voltar
  document
    .getElementById("btnVoltar")
    .addEventListener(
      "click",
      () => location.reload()
    );
}

// =========================
// 🔙 VOLTAR
// =========================
function voltarInicio() {

  const confirmacao =
    document.getElementById("telaConfirmacao");

  if (confirmacao) {
    confirmacao.remove();
  }

  // mostra conteúdo principal
  document.querySelector(".container")
    .style.display = "block";

  // mostra footer
  const footer = document.querySelector("footer");
  if (footer) footer.style.display = "block";

  // mostra botão whatsapp
  const whatsappBtn =
    document.querySelector(".whatsapp");

  if (whatsappBtn) {
    whatsappBtn.style.display = "flex";
  }
}

// =========================
// 🎯 EVENTOS
// =========================
document.addEventListener("DOMContentLoaded", () => {

  document
    .getElementById("btnAbrirModal")
    ?.addEventListener(
      "click",
      iniciarCompra
    );

  document
    .getElementById("btnComprar")
    ?.addEventListener(
      "click",
      confirmarCompra
    );

  document
    .getElementById("btnCancelar")
    ?.addEventListener(
      "click",
      fecharModal
    );

  document
    .getElementById("quantidade")
    ?.addEventListener(
      "input",
      atualizarResumo
    );
});