
const root = document.querySelector(':root')
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todo-list");
const taskStatus = document.getElementById("taskStatus");
const taskStatusOptions = Array.from(document.getElementById("taskStatus").querySelectorAll("option"));
const editModal = document.getElementById("editModal");
const editTaskInput = document.getElementById("editTaskInput");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const closeModal = document.getElementById("closeModal");
const logoutButton = document.getElementById("logoutButton");
const filterButtonArray = Array.from(document.getElementById("filter-buttons").querySelectorAll("button"));

const currentUserEmail = localStorage.getItem("currentUserEmail");
let currentView = "todas";


const rootStyle = getComputedStyle(root)
root.style.setProperty("--filter-button-w", filterButtonArray[1].offsetWidth + 4 + "px")
root.style.setProperty("--filter-button-h", filterButtonArray[1].offsetHeight + 4 + "px")

if (!currentUserEmail) {
  // Redireciona o usuário de volta para a página de login se não houver usuário logado
  window.location.href = "../index.html";
}

// Usa o email do usuário para criar uma chave única no localStorage
const userTasksKey = `${currentUserEmail}_userTasks`;

const savedTasks = JSON.parse(localStorage.getItem(userTasksKey)) || [];
const taskArray = [];

taskInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addToTaskArray(Date.now(), taskInput.value, taskStatus.value); // Permitindo adicionar tarefas através da tecla 'enter'
  }
});

addTaskBtn.addEventListener("click", () => {addToTaskArray(Date.now(), taskInput.value, taskStatus.value)} );

function validateTaskInput() {
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    taskInput.value = "";
    return true;
  }
}

// Funções CRUD do TaskArray

function updateTaskStatus(id, newStatus) {
  const taskToUpdate = taskArray.find(task => task.id == id);
  taskToUpdate.status = newStatus;
  renderFilteredTaskList()
  saveTasksToLocalStorage();
}

function updateTaskContent(id, newContent) {
  const taskToUpdate = taskArray.find(task => task.id == id);
  taskToUpdate.text = newContent;
  renderFilteredTaskList()
  saveTasksToLocalStorage();
}

function deleteFromTaskArray(id) {
  const taskToDeleteIndex = taskArray.findIndex(task => task.id == id);
  taskArray.splice(taskToDeleteIndex, 1)
  renderFilteredTaskList()
  saveTasksToLocalStorage();
}

function addToTaskArray(id, text, status) {
  text = text.trim();
  const task = {
    id: id,
    text: text,
    status: status,
  };
  if (validateTaskInput()) {
    taskArray.push(task);
    renderFilteredTaskList()
    saveTasksToLocalStorage();
  }
}

// Função para carregar tarefas do localStorage
function loadTasksFromLocalStorage() {
  savedTasks.forEach((task) => {
    taskToLoad = {
      id: task.id,
      text: task.text,
      status: task.status,
    };
    taskArray.push(taskToLoad);
    renderTaskList(taskArray)
  });
} 

function saveTasksToLocalStorage() {
  localStorage.setItem(userTasksKey, JSON.stringify(taskArray));
}

loadTasksFromLocalStorage();

function editTask(taskCard) {
  const label = taskCard.querySelector("label");
  const input = taskCard.querySelector("input");

  // Exibe o modal
  editModal.style.display = "block";

  // Pré-preenche o input com o texto atual da tarefa
  editTaskInput.value = label.innerText;

  saveTaskBtn.addEventListener("click", () => {
    editModal.style.display = "none";

    // Atualiza o texto da tarefa com o valor do input
    label.innerText = editTaskInput.value;

    updateTaskContent(input.id, editTaskInput.value);
  });

  closeModal.addEventListener("click", () => {
    // Fecha o modal (X)
    editModal.style.display = "none";
  });
}


// Gera o código HTML das tarefas que pertencem a View atual
function renderFilteredTaskList() {
  if (currentView == "todas") { renderTaskList(taskArray); return}

  const filteredTaskArray = taskArray.filter((taskCard) => {
    console.log(currentView)
    return taskCard.status == currentView
  })

  console.log(filteredTaskArray)

  renderTaskList(filteredTaskArray)
}

function renderTaskList(taskList) {
  todoList.innerHTML = ""
  if (taskList[0]) {
    taskList.forEach((task) => {
      renderTaskCard(task.id, task.text, task.status)
    })
  } else {
    switch(currentView) {
      case "todas":
        generateMessage("Não há nenhuma tarefa registrada")
        break;
      case "pendente":
        generateMessage("Não há nenhuma tarefa pendente")
        break;
      case "andamento":
        generateMessage("Não há nenhuma tarefa em andamento")
        break;
      case "concluida":
        generateMessage("Não há nenhuma tarefa concluída")
        break;
    }
  }
}

function generateMessage(message) {
  const messageElement = document.createElement("span")
  messageElement.className = "todo-list-message"
  messageElement.innerText = message
  todoList.appendChild(messageElement)
}

function renderTaskCard(id, taskText, status) {
  const taskCard = document.createElement("li");
  taskCard.classList.add("task-card");

  const statusIndicator = document.createElement("div");
  statusIndicator.classList.add("status-indicator");
  statusIndicator.setAttribute("status", status)

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if (!id) checkbox.id = `task${Date.now()}`
  else checkbox.id = id;

  const label = document.createElement("label");
  label.setAttribute("for", checkbox.id);
  label.innerText = taskText;

  if (status === "concluida") {
    label.style.textDecoration = "line-through";
    label.style.color = "#aaa";
  }

  label.addEventListener("click", () => {
    if (statusIndicator.getAttribute("status") === "concluida") {
      statusIndicator.setAttribute("status", "pendente");
      label.style.textDecoration = "none";
      label.style.color = "#000";
    } else if (statusIndicator.getAttribute("status") === "pendente") {
      statusIndicator.setAttribute("status", "andamento");
      label.style.textDecoration = "none";
      label.style.color = "#000";
    } else {
      statusIndicator.setAttribute("status", "concluida");
      label.style.textDecoration = "line-through";
      label.style.color = "#aaa";
    }

    updateTaskStatus(checkbox.id, statusIndicator.getAttribute("status"));
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

  deleteButton.addEventListener("click", () => deleteFromTaskArray(checkbox.id));

  taskCard.appendChild(statusIndicator);
  taskCard.appendChild(checkbox);
  taskCard.appendChild(label);
  taskCard.appendChild(editButton);
  taskCard.appendChild(deleteButton);
  todoList.appendChild(taskCard);
}

logoutButton.addEventListener("click", () => {
  // Limpa informações da sessão do usuário no localStorage
  localStorage.removeItem("currentUserEmail");

  // Redireciona para a página de login
  window.location.href = "../index.html";
});



filterButtonArray.forEach(filterButton => {
  filterButton.setAttribute("isSelected", "false")

  filterButton.addEventListener("click", () => {
    currentView = filterButton.id.substring(4)
    renderFilteredTaskList()
    
    filterButtonArray.forEach(buttonToUnselect => {buttonToUnselect.setAttribute("isSelected", "false")})
    taskStatusOptions.forEach(option => {option.setAttribute("disabled", "")})

    if (currentView == "todas") {
      taskStatus.value = "pendente"     
      taskStatusOptions.forEach(option => {option.removeAttribute("disabled")}) 
    } else {
      taskStatus.value = currentView
      taskStatus.querySelector(`option[value=${currentView}]`).removeAttribute("disabled")
    } 

    filterButton.setAttribute("isSelected", "true")
 
  })
});
filterButtonArray[0].setAttribute("isSelected", "true")