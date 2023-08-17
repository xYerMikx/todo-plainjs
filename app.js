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
    this.removeLast.addEventListener("click", () => this.removeLastTask());
    this.removeFirst.addEventListener("click", () => this.removeFirstTask());

    this.loadTasks();
  }

  addTask() {
    const task = this.input.value;
    if (task) {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = task;
      li.appendChild(span);
      const completeButton = document.createElement("button");
      completeButton.textContent = "Complete";
      completeButton.addEventListener("click", () => this.completeTask(li));
      li.appendChild(completeButton);
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => this.removeTask(li));
      li.appendChild(removeButton);
      li.dataset.index = Array.from(this.list.children).length;
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
      const tasks = Array.from(this.list.children);
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
    li.remove();
    this.saveTasks();
  }

  removeLastTask() {
    const lastChild = this.list.lastElementChild;
    if (lastChild) {
      lastChild.remove();
      this.saveTasks();
    }
  }

  removeFirstTask() {
    const firstChild = this.list.firstElementChild;
    if (firstChild) {
      firstChild.remove();
      this.saveTasks();
    }
  }

  highlightEven() {
    const evenTasks = Array.from(this.list.children).filter(
      (_, i) => i % 2 === 0
    );
    evenTasks.forEach((task) => task.classList.toggle("even"));
  }

  highlightOdd() {
    const oddTasks = Array.from(this.list.children).filter(
      (_, i) => i % 2 === 1
    );
    oddTasks.forEach((task) => task.classList.toggle("odd"));
  }

  saveTasks() {
    const tasks = Array.from(this.list.children).map((task) => ({
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
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = task.text;
      li.appendChild(span);
      if (task.complete) li.classList.add("complete");
      const buttons = document.createElement("div");
      buttons.classList.add("buttons");
      li.appendChild(buttons)
      const completeButton = document.createElement("button");
      completeButton.textContent = "Complete";
      completeButton.classList.add("complete-btn")
      completeButton.addEventListener("click", () => this.completeTask(li));
      buttons.appendChild(completeButton);
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("remove-btn")
      removeButton.addEventListener("click", () => this.removeTask(li));
      buttons.appendChild(removeButton);
      li.dataset.index = task.index;
      if (task.complete) {
        this.list.appendChild(li);
      } else {
        this.list.insertBefore(li, this.list.firstChild);
      }
    });
  }
}

new TodoList();
