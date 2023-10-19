const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.querySelector(".todo-list");
const taskStatus = document.getElementById("taskStatus");
const editModal = document.getElementById("editModal");
const editTaskInput = document.getElementById("editTaskInput");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const closeModal = document.getElementById("closeModal");
const logoutButton = document.getElementById("logoutButton");

const currentUserEmail = localStorage.getItem("currentUserEmail");

if (!currentUserEmail) {
  // Redireciona o usuário de volta para a página de login se não houver usuário logado
  window.location.href = "index.html";
}

// Usa o email do usuário para criar uma chave única no localStorage
const userTasksKey = `${currentUserEmail}_userTasks`;

taskInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask(); // Permitindo adicionar tarefas através da tecla 'enter'
  }
});

addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  const status = taskStatus.value; // Obtem o status da tarefa

  if (taskText !== "") {
    createTaskCard(taskText, status);
    taskInput.value = "";

    saveTasksToLocalStorage();
  }
}

// Salva as tarefas no localStorage
function saveTasksToLocalStorage() {
  const taskCards = todoList.querySelectorAll(".task-card");
  const tasks = [];

  taskCards.forEach((taskCard) => {
    const label = taskCard.querySelector("label");
    const statusIndicator = taskCard.querySelector(".status-indicator");
    const status = statusIndicator.classList[1]; // Obtém a classe do status

    const task = {
      text: label.innerText,
      status: status,
    };

    tasks.push(task);
  });

  localStorage.setItem(userTasksKey, JSON.stringify(tasks));
}

// Função para carregar tarefas do localStorage
function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem(userTasksKey)) || [];

  // Limpa a lista de tarefas atual
  todoList.innerHTML = "";

  savedTasks.forEach((task) => {
    createTaskCard(task.text, task.status);
  });
}

loadTasksFromLocalStorage();

function editTask(taskCard) {
  const label = taskCard.querySelector("label");

  // Exibe o modal
  editModal.style.display = "block";

  // Pré-preenche o input com o texto atual da tarefa
  editTaskInput.value = label.innerText;

  saveTaskBtn.addEventListener("click", () => {
    editModal.style.display = "none";

    // Atualiza o texto da tarefa com o valor do input
    label.innerText = editTaskInput.value;

    saveTasksToLocalStorage();
  });

  closeModal.addEventListener("click", () => {
    // Fecha o modal (X)
    editModal.style.display = "none";
  });
}

function deleteTask(taskCard) {
  taskCard.remove();
  saveTasksToLocalStorage(); // Atualiza o localStorage após excluir a tarefa
}

function createTaskCard(taskText, status) {
  const taskCard = document.createElement("li");
  taskCard.classList.add("task-card");

  const statusIndicator = document.createElement("div");
  statusIndicator.classList.add("status-indicator", status);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `task${Date.now()}`;

  const label = document.createElement("label");
  label.setAttribute("for", checkbox.id);
  label.innerText = taskText;

  if (status === "concluida") {
    label.style.textDecoration = "line-through";
    label.style.color = "#aaa";
  }

  label.addEventListener("click", () => {
    if (status === "concluida") {
      statusIndicator.classList.remove("concluida");
      statusIndicator.classList.add("pendente");
      label.style.textDecoration = "none";
      label.style.color = "#000";
      status = "pendente";
    } else if (status === "pendente") {
      statusIndicator.classList.remove("pendente");
      statusIndicator.classList.add("andamento");
      label.style.textDecoration = "none";
      label.style.color = "#000";
      status = "andamento";
    } else {
      statusIndicator.classList.remove("andamento", "pendente");
      statusIndicator.classList.add("concluida");
      label.style.textDecoration = "line-through";
      label.style.color = "#aaa";
      status = "concluida";
    }

    saveTasksToLocalStorage();
  });

  const editButton = document.createElement("button");
  editButton.classList.add("editBtn");

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square");

  editButton.appendChild(editIcon);

  editButton.addEventListener("click", () => editTask(taskCard));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteBtn");

  // SVG
  const customTrashIcon = document.createElement("i");
  customTrashIcon.classList.add("fa-solid", "fa-trash");

  deleteButton.appendChild(customTrashIcon);

  deleteButton.addEventListener("click", () => deleteTask(taskCard));

  taskCard.appendChild(statusIndicator);
  taskCard.appendChild(checkbox);
  taskCard.appendChild(label);
  taskCard.appendChild(editButton);
  taskCard.appendChild(deleteButton);
  todoList.appendChild(taskCard);
}

logoutButton.addEventListener("click", () => {
  // Limpa informações do usuário no localStorage
  localStorage.removeItem("currentUsername");

  // Redireciona para a página de login
  window.location.href = "index.html";
});
