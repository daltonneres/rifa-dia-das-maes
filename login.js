import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch((erro) => {
      alert("Erro ao fazer login: " + erro.message);
    });
}

window.login = login;