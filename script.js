
(function init() {
  // create a list and list items
  const dummyList = [
    "Jog around the park 3x",
    "10 minutes meditation",
    "Read for 1 hour",
    "Pick up groceries",
    "Complete Todo App on Frontend Mentor",
  ]
  class TodoList {
    constructor (startList) {
      this.list = startList || [];
      this.init();
      this.container;
      this.form;
    }

    addItem(item){
      // if (!item.id || !item.title || !this.created ) return;
      this.list.push(item);
      const listItem = document.createElement('ul');
      const doneButton = document.createElement('button');
      const title = document.createElement('div');
      listItem.appendChild(doneButton)
      listItem.appendChild(title)
      title.textContent = item.title + ': ' + item.status;
      listItem.classList.add('listItem');
      title.classList.add('listTitle');
      doneButton.classList.add('listButton');
      const listContainer = document.getElementById('listContainer');
      listContainer.appendChild(listItem);

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

    init(){
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
      this.drawList();
      this.drawMenu();
    }

    drawHeader(){
      // draw header
      console.log('drawHeader ');
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
      console.log('FormInput -');
      const inputContainer = document.createElement("div");
      const submitBtn = document.createElement("button");
      const textInput = document.createElement("input");
      inputContainer.classList.add("inputContainer")

      // button
      submitBtn.type = "submit";
      submitBtn.setAttribute("form", this.form.id);
      submitBtn.name = "addTodoItem";

      // text input
      textInput.name = "todoInput";
      textInput.type = "text";
      textInput.placeholder = "Create a new todo...";
      console.log('formContainer -> ', inputContainer);
      console.log('textInput -> ', textInput);
      // append elements
      inputContainer.appendChild(submitBtn);
      inputContainer.appendChild(textInput);
      this.form.appendChild(inputContainer);
      return inputContainer;
    }
    
    drawList(){
      // draw List
      console.log('drawList ->');
    }
    
    drawMenu(){
      // draw Menu
      console.log('drawMenu ->');
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
  
  class ListItem {
    constructor(title){
      this.id = this.generateId();
      this.title = title;
      this.created = new Date();
      this.status = 'todo';
      
    }
    
    generateId(){
      const randomId = Math.floor(Math.random()*100000000);
      if (todoList.getAll().some(item => item.id === randomId)) {
        this.generateId();
      } else {
        return randomId;
      }
    }
  }

  

})()