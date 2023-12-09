import { Todo } from "../todos/models/todo.model";

export const Filters = {
  All: "all",
  Completed: "Completed",
  Pending: "Pending",
};

//* mas adelante se puede hacer este objeto reactivo con rxjs y que cada vez que el objeto cambie emitaun valor con funciones generadoras
const state = {
  todos: [
    // new Todo("Aprender React"),
    // new Todo("Aprender JS"),
    // new Todo("Aprender CSS"),
    // new Todo("Aprender Astro JS"),
  ],
  filter: Filters.All,
};

const initStore = () => {
  loadStore();
  console.log("InitStore 🥑");
};

const loadStore = () => {
  if (!localStorage.getItem("state")) return;

  const { todos = [], filter = Filters.All } = JSON.parse(
    localStorage.getItem("state")
  );

  state.todos = todos;
  state.filter = filter;
};

const saveStateToLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};

const getTodos = (filter = Filters.All) => {
  switch (filter) {
    case Filters.All:
      return [...state.todos];

    case Filters.Completed:
      return state.todos.filter((todo) => todo.done);

    case Filters.Pending:
      return state.todos.filter((todo) => !todo.done);

    default:
      throw new Error(`Option ${filter} is not valid`);
  }
};

/**
 *
 * @param {String} description
 */
const addTodo = (description) => {
  if (!description) {
    throw new Error("Description is required");
  }

  state.todos.push(new Todo(description));

  saveStateToLocalStorage();
};

/**
 *
 * @param {String} todoId
 */
const toggleTodo = (todoId) => {
  state.todos = state.todos.map((todo) => {
    if (todo.id === todoId) {
      todo.done = !todo.done;
    }
    return todo;
  });

  saveStateToLocalStorage();
};

const deleteTodo = (todoId) => {
  state.todos = state.todos.filter((todo) => todo.id !== todoId);

  saveStateToLocalStorage();
};

const deleteCompleted = () => {
  state.todos = state.todos.filter((todo) => !todo.done);

  saveStateToLocalStorage();
};

/**
 *
 * @param {Filters} newFilter
 */
const setFilter = (newFilter = Filters.All) => {
  state.filter = newFilter;
  saveStateToLocalStorage();
};

const getCurrentFilter = () => {
  return state.filter;
};

export default {
  addTodo,
  deleteCompleted,
  deleteTodo,
  getCurrentFilter,
  getTodos,
  getTodos,
  initStore,
  loadStore,
  setFilter,
  toggleTodo,
};