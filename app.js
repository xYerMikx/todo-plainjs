class TodoList {
  constructor() {
    this.list = document.querySelector("#list");
    this.input = document.querySelector("#input");
    this.add = document.querySelector("#add");
    this.even = document.querySelector("#even");
    this.odd = document.querySelector("#odd");
    this.removeLast = document.querySelector("#removeLast");
    this.removeFirst = document.querySelector("#removeFirst");

    this.add.addEventListener("click", () => this.addTask());
    this.even.addEventListener("click", () => this.highlightEven());
    this.odd.addEventListener("click", () => this.highlightOdd());
    this.removeLast.addEventListener("click", () =>
      this.removeTask(this.list.lastElementChild)
    );
    this.removeFirst.addEventListener("click", () =>
      this.removeTask(this.list.firstElementChild)
    );

    this.loadTasks();
  }

  renderTask(taskText) {
    const li = document.createElement("li");
    li.style.animation = "fadeIn 0.5s";
    const span = document.createElement("span");
    span.textContent = taskText;
    li.appendChild(span);
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons");
    li.appendChild(buttonsContainer);
    const buttons = [
      new Button("Завершить", "complete-btn", () => this.completeTask(li)),
      new Button("Удалить", "remove-btn", () => this.removeTask(li)),
    ];
    buttons.forEach((button) => button.appendTo(buttonsContainer));
    return li;
  }

  addTask() {
    const task = this.input.value;
    if (task) {
      const li = this.renderTask(task);
      li.dataset.index = [...this.list.children].length;
      this.list.appendChild(li);
      this.input.value = "";
      this.saveTasks();
    }
  }

  completeTask(li) {
    li.classList.toggle("complete");
    if (li.classList.contains("complete")) {
      this.list.appendChild(li);
    } else {
      const index = parseInt(li.dataset.index);
      const tasks = [...this.list.children];
      if (index === 0) {
        this.list.insertBefore(li, tasks[0]);
      } else if (index === tasks.length - 1) {
        this.list.appendChild(li);
      } else {
        for (let i = 0; i < tasks.length; i++) {
          if (parseInt(tasks[i].dataset.index) === index + 1) {
            this.list.insertBefore(li, tasks[i]);
            break;
          }
        }
      }
    }
    this.saveTasks();
  }

  removeTask(li) {
    if (li) {
      li.style.animation = "fadeOut 0.5s";
      setTimeout(() => {
        li.remove();
        this.saveTasks();
      }, 500);
    }
  }

  highlightOdd() {
    const evenTasks = [...this.list.children].filter((_, i) => i % 2 === 0);
    evenTasks.forEach((task) => task.classList.toggle("odd"));
  }

  highlightEven() {
    const oddTasks = [...this.list.children].filter((_, i) => i % 2 === 1);
    oddTasks.forEach((task) => task.classList.toggle("even"));
  }

  saveTasks() {
    const tasks = [...this.list.children].map((task) => ({
      text: task.firstChild.textContent,
      complete: task.classList.contains("complete"),
      index: parseInt(task.dataset.index),
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.sort((a, b) => a.index - b.index);
    tasks.forEach((task) => {
      const li = this.renderTask(task.text);
      li.dataset.index = task.index;
      task.complete
        ? this.list.appendChild(li)
        : this.list.insertBefore(li, this.list.firstChild);
    });
  }
}

class Button {
  constructor(text, className, listener) {
    this.button = document.createElement("button");
    this.button.textContent = text;
    this.button.classList.add(className);
    this.button.addEventListener("click", listener);
  }

  appendTo(parent) {
    parent.appendChild(this.button);
  }
}

new TodoList();
