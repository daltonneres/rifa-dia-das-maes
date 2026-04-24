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


// COMPRA
let ultimoNumero = 0;

function iniciarCompra() {
  const valorUnitario = 5;

  const quantidade = parseInt(prompt("Quantos números você deseja comprar?"));
  
  if (!quantidade || quantidade <= 0) {
    alert("Quantidade inválida!");
    return;
  }

  const total = quantidade * valorUnitario;

  // RESUMO ANTES DE CONTINUAR
  const confirmar = confirm(
    `Resumo da compra:\n\n` +
    `Quantidade: ${quantidade}\n` +
    `Valor por número: R$ ${valorUnitario.toFixed(2)}\n` +
    `Total: R$ ${total.toFixed(2)}\n\n` +
    `Deseja continuar?`
  );

  if (!confirmar) return;

  const nome = prompt("Digite seu nome:");
  if (!nome) {
    alert("Nome obrigatório!");
    return;
  }

  const whatsapp = prompt("Digite seu WhatsApp:");
  if (!whatsapp) {
    alert("WhatsApp obrigatório!");
    return;
  }

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


// CONFIRMAÇÃO (SEM QUEBRAR A PÁGINA)
function mostrarConfirmacao(nome, numeros, total) {
  const container = document.querySelector(".container");

  container.innerHTML = `
    <div class="card">
      <h2 style="color:#FF2E8B;">✅ Pagamento Aprovado!</h2>
      <p>Obrigado, <strong>${nome}</strong>! Agradecemos pela sua <strong>compra!</strong></p>

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