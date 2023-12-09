import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { renderTodos, renderPending } from "./use-cases";

const elementIDs = {
  TodoList: ".todo-list",
  newTodoInput: "#new-todo-input",
  clearCompletedButton: ".clear-completed",
  todoFilters: ".filtro",
  pendingCountLabel: "#pending-count",
};

/**
 *
 * @param {String} elementId
 */
export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    renderTodos(elementIDs.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    renderPending(elementIDs.pendingCountLabel);
  };

  // Cuando la funcion App() se llama
  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  //Referencias HTML
  const newDescriptionInput = document.querySelector(elementIDs.newTodoInput);
  const TodoListUL = document.querySelector(elementIDs.TodoList);
  const clearCompletedButton = document.querySelector(
    elementIDs.clearCompletedButton
  );
  const filtersLIs = document.querySelectorAll(elementIDs.todoFilters);

  // Listeners
  newDescriptionInput.addEventListener("keyup", (event) => {
    //Validaciones
    if (event.keyCode !== 13) return;
    if (event.target.value.trim().length === 0) return;

    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value = "";
  });

  TodoListUL.addEventListener("click", (event) => {
    const element = event.target.closest("[data-id]");
    todoStore.toggleTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  TodoListUL.addEventListener("click", (event) => {
    const isDestroyElement = event.target.className === "destroy";
    const element = event.target.closest("[data-id]");
    if (!element || !isDestroyElement) return;

    todoStore.deleteTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  clearCompletedButton.addEventListener("click", () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  filtersLIs.forEach((element) => {
    element.addEventListener("click", (element) => {
      filtersLIs.forEach((el) => el.classList.remove("selected"));
      element.target.classList.add("selected");

      switch (element.target.text) {
        case "Todos":
          todoStore.setFilter(Filters.All);
          break;
        case "Pendientes":
          todoStore.setFilter(Filters.Pending);
          break;
        case "Completados":
          todoStore.setFilter(Filters.Completed);
          break;
      }

      displayTodos();
    });
  });
};
