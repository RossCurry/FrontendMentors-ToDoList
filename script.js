
(function init() {
  // create a list and list items
  class TodoList {
    constructor () {
      this.list = [];
      this.init();
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
      const listContainer = document.getElementById('listContainer');
      
    }


  }
  const todoList = new TodoList ();
  
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

  
  const form = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput')
  let formTitle = '';

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!formTitle) return;
    const newItem = new ListItem(formTitle);
    todoList.addItem(newItem)
    formTitle = '';
    todoInput.value = formTitle;
    // console.log('newItem', newItem)
    // console.log('todoList', todoList.getAll())
  })
  todoInput.addEventListener('change', (e) => {
    formTitle = e.target.value;
  })

})()