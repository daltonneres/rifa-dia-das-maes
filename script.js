// CONTADOR (FORMA SEGURA)
const contador = document.getElementById("contador");
const dataSorteio = new Date(2026, 4, 10, 10, 0, 0).getTime();

setInterval(() => {
  const agora = new Date().getTime();
  const distancia = dataSorteio - agora;

  if (distancia < 0) {
    contador.innerHTML = "⏰ Sorteio encerrado!";
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

  // limpar campos
  document.getElementById("quantidade").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("whatsappInput").value = "";
  document.getElementById("resumo").innerHTML = "";
}

// FECHAR MODAL
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// ATUALIZAR RESUMO EM TEMPO REAL
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
    Total: <strong style="color:#FF2E8B;">R$ ${total.toFixed(2)}</strong>
  `;
}

// CONFIRMAR COMPRA
function confirmarCompra() {
  const valorUnitario = 5;

  const quantidade = parseInt(document.getElementById("quantidade").value);
  const nome = document.getElementById("nome").value;
  const whatsapp = document.getElementById("whatsappInput").value;

  // valida quantidade
  if (!quantidade || quantidade <= 0) {
    alert("Quantidade inválida!");
    return;
  }

  // valida nome
  if (!nome) {
    alert("Nome obrigatório!");
    return;
  }

  // valida whatsapp vazio
  if (!whatsapp) {
    alert("WhatsApp obrigatório!");
    return;
  }

  // limpa número (remove tudo que não for número)
  const whatsappLimpo = whatsapp.replace(/\D/g, "");

  // valida tamanho
  if (whatsappLimpo.length < 10 || whatsappLimpo.length > 11) {
    alert("WhatsApp inválido! Digite com DDD (ex: 41999999999)");
    return;
  }

  const total = quantidade * valorUnitario;

  fecharModal();

  alert(`Processando pagamento de R$ ${total.toFixed(2)}...`);

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
      <h2 style="color:#FF2E8B;">✅ Pagamento Aprovado!</h2>
      
      <p>Obrigado, <strong>${nome}</strong>!<br>
      Agradecemos pela sua <strong>compra!</strong></p>

      <p><strong>Total pago:</strong> R$ ${total.toFixed(2)}</p>

      <p>Seus números:</p>

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

      <p>Boa sorte! 🍀</p>
    </div>
  `;
}