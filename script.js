// CONTADOR (FORMA SEGURA)
const contador = document.getElementById("contador");

// 💘 nova data - Dia dos Namorados
const dataSorteio = new Date(2026, 5, 12, 20, 0, 0).getTime();

setInterval(() => {
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
// COMPRA
// =========================
let ultimoNumero = 0;

// ABRIR MODAL
function iniciarCompra() {
  document.getElementById("modal").style.display = "flex";

  document.getElementById("quantidade").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("whatsappInput").value = "";
  document.getElementById("resumo").innerHTML = "";
}

// FECHAR MODAL
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// ATUALIZAR RESUMO
function atualizarResumo() {
  const valorUnitario = 5;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const resumo = document.getElementById("resumo");

  if (!quantidade || quantidade <= 0) {
    resumo.innerHTML = "";
    return;
  }

  const total = quantidade * valorUnitario;

  resumo.innerHTML = `
    <strong>Resumo:</strong><br>
    ${quantidade} número(s)<br>
    Total: <strong style="color:#E53935;">R$ ${total.toFixed(2)}</strong>
  `;
}

// CONFIRMAR COMPRA
function confirmarCompra() {
  const valorUnitario = 5;

  const quantidade = parseInt(document.getElementById("quantidade").value);
  const nome = document.getElementById("nome").value;
  const whatsapp = document.getElementById("whatsappInput").value;

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

  if (whatsappLimpo.length < 10 || whatsappLimpo.length > 11) {
    alert("WhatsApp inválido! Digite com DDD (ex: 41999999999)");
    return;
  }

  const total = quantidade * valorUnitario;

  fecharModal();

  alert(`💘 Preparando seu momento especial...\nPagamento de R$ ${total.toFixed(2)}`);

  setTimeout(() => {
    const numeros = [];

    for (let i = 0; i < quantidade; i++) {
      ultimoNumero++;
      numeros.push(ultimoNumero);
    }

    mostrarConfirmacao(nome, numeros, total);
  }, 1500);
}


// CONFIRMAÇÃO
function mostrarConfirmacao(nome, numeros, total) {
  const container = document.querySelector(".container");

  container.innerHTML = `
    <div class="card">
      <h2 style="color:#E53935;">💖 Compra Confirmada!</h2>
      
      <p>Obrigado, <strong>${nome}</strong>!<br>
      Você acabou de espalhar mais amor participando da nossa rifa 💘</p>

      <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>

      <p>Seus números da sorte:</p>

      <div style="
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        justify-content:center;
        margin:15px 0;
      ">
        ${numeros.map(n => `
          <span style="
            background:#FFC0CB;
            padding:10px;
            border-radius:8px;
            font-weight:600;
          ">
            ${n}
          </span>
        `).join('')}
      </div>

      <p style="margin-top:10px;">
        📸 <strong>Guarde este momento:</strong> tire um print e salve seus números.<br><br>

        🔐 Seus dados estão seguros e registrados para garantir um sorteio justo e transparente.
      </p>

      <p>Boa sorte e muito amor! 💕</p>
    </div>
  `;

  setTimeout(() => {
    location.reload();
  }, 10000);
}