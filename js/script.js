const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");

switchToRegister.addEventListener("click", function (e) {
  e.preventDefault();
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

switchToLogin.addEventListener("click", function (e) {
  e.preventDefault();
  loginForm.style.display = "block";
  registerForm.style.display = "none";
});

// Lógica para o registro
const registerButton = registerForm.querySelector("#registerBtn");
registerButton.addEventListener("click", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const novoEmail = document.getElementById("newEmail").value;
  const novaSenha = document.getElementById("newPassword").value;

  // Verifica se o email já existe no localStorage
  if (localStorage.getItem(novoEmail)) {
    alert("Este email já está em uso.");
  } else {
    // Cria um objeto com os dados do usuário
    const userData = {
      nome: nome,
      email: novoEmail,
      senha: novaSenha,
    };

    // Armazena os dados no localStorage
    localStorage.setItem(novoEmail, JSON.stringify(userData));

    // Redireciona o usuário para a página do Todo List
    window.location.href = "index.html";
  }
});

// Lógica para o login
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailLogin = document.getElementById("email").value;
  const senhaLogin = document.getElementById("password").value;

  // Verifica se as credenciais correspondem aos dados armazenados no localStorage
  const userData = JSON.parse(localStorage.getItem(emailLogin));

  if (userData && userData.senha === senhaLogin) {
    // Redireciona o usuário para a página do Todo List
    localStorage.setItem("currentUserEmail", emailLogin); 
    window.location.href = "./html/todolist.html";
  } else {
    alert("Credenciais inválidas. Tente novamente.");
  }
});
