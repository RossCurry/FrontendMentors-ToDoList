
(function init() {
  // create a list and list items
  const dummyList = [
    "Jog around the park 3x",
    "10 minutes meditation",
    "Read for 1 hour",
    "Pick up groceries",
    "Complete Todo App on Frontend Mentor",
  ]


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
      this.init(startList);
    }

    addItem(item){
      if (!item.id || !item.title || !item.created ) return;
      this.list.push(item);
      const listItem = document.createElement('ul');
      const doneButton = document.createElement('button');
      const title = document.createElement('div');
      // list item
      listItem.appendChild(doneButton)
      listItem.appendChild(title)
      listItem.classList.add('listItem');
      // title
      title.textContent = item.title + ': ' + item.status;
      title.classList.add('listTitle');
      //button
      doneButton.classList.add('listButton');
      doneButton.textContent = item.status;
      // append items
      this.listContainer.appendChild(listItem);

      // button
      doneButton.addEventListener('click', (e) => {
        // when clicked change status of item
        console.log('target', e.target)
        item.status = item.status === 'done' ? 'todo' : 'done';
        // update list
        const itemIndex = this.list.indexOf(item);
        const todoListCopy = [...this.list];
        todoListCopy[itemIndex] = item;
        this.list = todoListCopy;
        title.textContent = item.title + ': ' + item.status;
        console.log('list', this.list)
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
      this.form.textContent = "form";
      this.container.append(this.form);

      // The form
      this.form.setAttribute("id", "todoForm");

      // the form is: header / form input(btn&text) / List / List items / menu for filtering & actions
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
      // checkbox
      const toggleWrapper = document.createElement("label");
      const checkBox = document.createElement("input");
      const span = document.createElement("span");
      toggleWrapper.appendChild(checkBox);
      toggleWrapper.appendChild(span);
      checkBox.type = "checkbox";
      toggleWrapper.classList.add("toggleWrapper")
      
      // append elements
      header.append(title);
      header.append(toggleWrapper);
      this.form.append(header);
      return header;
    }
    
    drawFormInput(){
      // draw FormInput
      const inputContainer = document.createElement("div");
      const submitBtn = document.createElement("button");
      const textInput = document.createElement("input");
      inputContainer.classList.add("inputContainer")

      // button
      submitBtn.type = "submit";
      submitBtn.setAttribute("form", this.form.id);
      submitBtn.name = "addTodoItem";
      submitBtn.textContent = "add";

      // text input
      textInput.name = "todoInput";
      textInput.type = "text";
      textInput.placeholder = "Create a new todo...";
      // append elements
      inputContainer.appendChild(submitBtn);
      inputContainer.appendChild(textInput);
      this.form.appendChild(inputContainer);
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
          if (typeof item !== "string") return;
          const newItem = new ListItem(item, this.list)
          console.log("newItem", newItem);
          this.addItem(newItem)
        })
      }
    }
    
    drawMenu(){
      // draw Menu
      const menu = document.createElement("menu");
      const counter = document.createElement("div");
      const filter = document.createElement("div");
      const clearBtn = document.createElement("button");
      // menu classes
      counter.classList.add("counter");
      filter.classList.add("filter");
      clearBtn.classList.add("clearBtn");
      // counter
      const count = this.list.length;
      counter.textContent = `${count} item${count > 1 ? "s" : ""} left`;
      // filter
      // all
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
      filterActive.checked = true;
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
      filterCompleted.checked = true;
      filterCompleted.id = "filterCompleted";
      filterCompleted.value = "completed";
      filterCompletedLabel.setAttribute("for", filterCompleted.id)
      filterCompletedLabel.textContent = filterCompleted.value;
      filterCompletedLabel.appendChild(filterCompleted);
      filter.appendChild(filterCompletedLabel);
      // clear button
      clearBtn.type = "button";
      clearBtn.textContent = "Clear completed";

      // append items
      menu.appendChild(counter);
      menu.appendChild(filter);
      menu.appendChild(clearBtn);
      this.form.appendChild(menu)
    }

  }
  const todoList = new TodoList (dummyList);
  console.log(todoList.getAll())
  

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