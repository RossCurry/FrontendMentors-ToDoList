
(function init() {
  // create a list and list items
  const dummyList = [
    "Jog around the park 3x",
    "10 minutes meditation",
    "Read for 1 hour",
    "Pick up groceries",
    "Complete Todo App on Frontend Mentor",
  ]
  let darkMode = false;


  class ListItem {
    constructor(title, currentList){
      this.id = generateId(currentList);
      this.title = title;
      this.created = new Date();
      this.status = 'todo';
    }
  }

  class TodoList {
    constructor (startList) {
      this.list = [];
      this.container;
      this.form;
      this.listContainer;
      this.count;
      this.init(startList);
    }

    addItem(item){
      if (!item.id || !item.title || !item.created) return;
      if (this.list.every(prevItem => {
        return prevItem.id !== item.id;
      })) this.list.push(item);
      this.updateRemainingTodos();
      const listItem = document.createElement('ul');
      const doneButton = document.createElement('button');
      const title = document.createElement('div');
      const circleContainer = document.createElement("div");
      circleContainer.classList.add("circleContainer");
      // list item
      listItem.classList.add('listItem');
      // title
      title.textContent = item.title + ': ' + item.status;
      title.classList.add('listTitle');
      //button
      if (item.status === "todo"){
        doneButton.classList.add('listButton');
        title.setAttribute("style", "text-decoration-line:none");
      } else {
        doneButton.classList.add('listButtonDone');
        title.setAttribute("style", "text-decoration-line:line-through");
      }
      // append items
      circleContainer.appendChild(doneButton);
      listItem.appendChild(circleContainer)
      listItem.appendChild(title)
      
      this.listContainer.appendChild(listItem);

      // button
      doneButton.addEventListener('click', (e) => {
        // when clicked change status of item
        e.preventDefault();
        item.status = item.status === 'done' ? 'todo' : 'done';
        // update list
        const itemIndex = this.list.indexOf(item);
        const todoListCopy = [...this.list];
        todoListCopy[itemIndex] = item;
        this.list = todoListCopy;
        title.textContent = item.title + ': ' + item.status;
        this.updateRemainingTodos();
        // change button class
        if (doneButton.classList.contains("listButton")) {
          doneButton.classList.remove("listButton")
          doneButton.classList.add("listButtonDone")
          title.setAttribute("style", "text-decoration-line:line-through");
        } else {
          doneButton.classList.remove("listButtonDone")
          doneButton.classList.add("listButton")
          title.setAttribute("style", "text-decoration-line:none");
        }
      })
    }

    getAll() {
      return this.list;
    }

    deleteItem(deleteItem){
      this.list = this.list.filter( listItem => listItem.id !== deleteItem.id)
    }

    size(){
      return this.list.length;
    }

    init(startList){
      // DOM Manipulation
      // find todoContainer
      this.container = document.getElementById("todo__container");
      // add form & append
      this.form = document.createElement("form");
      this.container.textContent = "container";
      this.container.append(this.form);

      // The form
      this.form.setAttribute("id", "todoForm");
      
      // Draw other elements
      this.drawHeader();
      this.drawFormInput();
      this.drawList(startList);
      this.drawMenu();
    }

    drawHeader(){
      // draw header
      const header = document.createElement("header");
      const title = document.createElement("h1");
      
      // title
      title.textContent = "TODO"
      
      // checkbox & label
      const toggleLabel = document.createElement("label");
      toggleLabel.classList.add("toggleWrapper");
      toggleLabel.style.width = "26px";
      toggleLabel.setAttribute("for", "DarkModeToggle")
      const checkBox = document.createElement("input");
      checkBox.id = "DarkModeToggle";
      checkBox.type = "checkbox";
      checkBox.value = "night";
      checkBox.addEventListener("change", (e) => {
        console.log(e.target.value);
        if (checkBox.checked) {
          moonImg.style.opacity = 0;
          sunImg.style.opacity = 1;
        } else {
          moonImg.style.opacity = 1;
          sunImg.style.opacity = 0;
        }
        darkMode = !darkMode;
        console.log("darkMode", darkMode)
      })
      
      // SVG
      const moonImg = document.createElement("img");
      moonImg.classList.add("moonImg");
      moonImg.setAttribute("src", "assets/images/icon-moon.svg");
      const sunImg = document.createElement("img");
      sunImg.style.opacity = 0;
      sunImg.classList.add("sunImg");
      sunImg.setAttribute("src", "assets/images/icon-sun.svg");
      const span = document.createElement("span");
      
      // append elements
      span.appendChild(moonImg);
      span.appendChild(sunImg);
      toggleLabel.appendChild(checkBox);
      toggleLabel.appendChild(span);
      header.append(title);
      header.append(toggleLabel);
      this.form.append(header);
      return header;
    }
    
    drawFormInput(){
      // draw FormInput
      const inputContainer = document.createElement("div");
      const submitBtn = document.createElement("button");
      const textInput = document.createElement("input");
      const circleContainer = document.createElement("div");
      const circle = document.createElement("div");
      circleContainer.classList.add("circleContainer");
      circle.classList.add("circleGrey");
      inputContainer.classList.add("inputContainer")

      // button
      submitBtn.type = "submit";
      submitBtn.setAttribute("form", this.form.id);
      submitBtn.name = "addTodoItem";
      submitBtn.textContent = "add";
      // circle


      // text input
      textInput.name = "todoInput";
      textInput.type = "text";
      textInput.placeholder = "Create a new todo...";
      // append elements
      inputContainer.appendChild(submitBtn);
      circleContainer.appendChild(circle);
      inputContainer.appendChild(circleContainer);
      inputContainer.appendChild(textInput);
      this.form.appendChild(inputContainer);

      // eventListeners
      let inputValue;
      textInput.addEventListener("keyup", (e) => {
        inputValue = e.target.value;
      })
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault()
        if (inputValue) {
          this.addItem(new ListItem(inputValue, this.list))
          textInput.value = "";
        }
      })
      return inputContainer;
    }
    
    drawList(startList){
      // list container
      this.listContainer = document.createElement("li");
      this.listContainer.classList.add("listContainer");
      // append elements
      this.form.appendChild(this.listContainer);
      // draw List
      // populate list from constructor
      if (Array.isArray(startList)) {
        startList.forEach(item => {
          if (typeof item === "string") {
            const newItem = new ListItem(item, this.list)
            this.addItem(newItem)
          } else if (item.id) {
            this.addItem(item);
          }
        })
      }
    }
    
    drawMenu(){
      // draw Menu
      const menu = document.createElement("menu");
      this.counter = document.createElement("div");
      const filter = document.createElement("div");
      const clearBtn = document.createElement("button");
      
      // menu classes
      this.counter.classList.add("counter");
      filter.classList.add("filter");
      clearBtn.classList.add("clearBtn");
      
      // counter
      this.updateRemainingTodos();
      
      // Filter Section
      const filterAllLabel = document.createElement("label");
      const filterAll = document.createElement("input");
      filterAll.type = "radio";
      filterAll.name = "filter";
      filterAll.checked = true;
      filterAll.id = "filterAll"
      filterAll.value = "all"
      filterAllLabel.setAttribute("for", filterAll.id)
      filterAllLabel.textContent = filterAll.value;
      filterAllLabel.appendChild(filterAll);
      filter.appendChild(filterAllLabel);
      // active
      const filterActiveLabel = document.createElement("label");
      const filterActive = document.createElement("input");
      filterActive.type = "radio";
      filterActive.name = "filter";
      filterActive.id = "filterActive"
      filterActive.value = "active"
      filterActiveLabel.setAttribute("for", filterActive.id)
      filterActiveLabel.textContent = filterActive.value;
      filterActiveLabel.appendChild(filterActive);
      filter.appendChild(filterActiveLabel);
      // completed
      const filterCompletedLabel = document.createElement("label");
      const filterCompleted = document.createElement("input");
      filterCompleted.type = "radio";
      filterCompleted.name = "filter";
      filterCompleted.id = "filterCompleted";
      filterCompleted.value = "completed";
      filterCompletedLabel.setAttribute("for", filterCompleted.id)
      filterCompletedLabel.textContent = filterCompleted.value;
      filterCompletedLabel.appendChild(filterCompleted);
      filter.appendChild(filterCompletedLabel);
      
      // clear button
      clearBtn.type = "button";
      clearBtn.textContent = "Clear completed";
      // eventlisteners
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearDoneElements();
      })
      // const radioButtons = filter.getElementsByTagName("input");
      // for(let radioBtn of radioButtons){
      //   radioBtn.addEventListener("change", (e)=>{
      //     e.stopPropagation();
      //     const selection = e.target.value;
      //     const checked = e.target.checked;
      //     console.log("selection", selection, checked)
      //     if (checked) {
      //       this.filterList(selection);
      //     }
      //   })
      // }
      filter.addEventListener("change", (e) => {
        console.log("filter event", e.target);
        this.filterList(e.target.value);
      })

      // append items
      menu.appendChild(this.counter);
      menu.appendChild(filter);
      menu.appendChild(clearBtn);
      this.form.appendChild(menu)
    }

    updateRemainingTodos(){
      const remainingTodos = this.list.filter(todo => todo.status === "todo").length;
      if(this.counter) {
        this.counter.textContent =`${remainingTodos} item${remainingTodos > 1 ? "s" : ""} left`;
      }
    }

    clearDoneElements(){
      if (this.list.every(el => el.status === "todo")) return;
      this.listContainer.innerHTML = "";
      const listOfTodos = this.list.filter(todo => todo.status === "todo");
      this.list = listOfTodos;
      listOfTodos.forEach(item => this.addItem(item));
      this.updateRemainingTodos();
    }
    filterList(filterSelection){
      console.log("filterList", filterSelection)
      switch (filterSelection) {
        case "all":
          console.log("Do all")
          this.listContainer.innerHTML = "";
          this.list.forEach(item => this.addItem(item));
          return;
        case "active":
          console.log("Do active")
          this.listContainer.innerHTML = "";
          this.list.forEach(item => {
            if (item.status === "todo") this.addItem(item);
          })
          return; 
        case "completed":
          console.log("Do completed")
          this.listContainer.innerHTML = "";
          this.list.forEach(item => {
            if (item.status === "done") this.addItem(item);
          })
          return;
      }
    }
  }
  // create Todo List
  const todoList = new TodoList (dummyList);
  

  // Helper function
  function generateId(list){
    const randomId = Math.floor(Math.random()*100000000);
    if (list && list.length > 0) {
      if (list.some(item => item.id === randomId)) {
        generateId();
      } else {
        return randomId;
      }
    } else {
      return randomId;
    }
  }


})()