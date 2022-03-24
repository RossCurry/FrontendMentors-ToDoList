(function init() {
  // create a list and list items
  const dummyList = [
    'Jog around the park 3x',
    '10 minutes meditation',
    'Read for 1 hour',
    'Pick up groceries',
    'Complete Todo App on Frontend Mentor',
  ];
  // const body = document.getElementsByTagName("body")[0];
  // body.classList.add("lightMode");

  class ListItem {
    constructor(title, currentList) {
      this.id = generateId(currentList);
      this.title = title;
      this.created = new Date();
      this.status = 'todo';
      this.finished;
      this.indexInList = currentList.length;
    }
  }

  class TodoList {
    constructor(startList) {
      this.list = [];
      this.container;
      this.form;
      this.listContainer;
      this.menu;
      this.toggleLabel;
      this.count;
      this.darkMode = this.isDarkModePref();
      this.draggedItem;
      this.init(startList);
    }

    addItem(item) {
      if (!item.id || !item.title || !item.created) return;
      if (
        this.list.every((prevItem) => {
          return prevItem.id !== item.id;
        })
      ) {
        this.list.push(item);
      }
      this.updateRemainingTodos();
      const listItem = this.createListElement(item);
      this.listContainer.appendChild(listItem);
    }

    createListElement(itemInfo){
      // DOM
      const listItem = document.createElement('li');
      const doneButton = document.createElement('button');
      const title = document.createElement('div');
      const circleContainer = document.createElement('div');
      circleContainer.classList.add('circleContainer');
      // list item
      listItem.id = itemInfo.id;
      listItem.classList.add('listItem');
      listItem.setAttribute("draggable", true)

      // title
      title.textContent = itemInfo.title;
      title.classList.add('listTitle');
      //button
      if (itemInfo.status === 'todo') {
        doneButton.classList.add('listButton');
        title.setAttribute('style', 'text-decoration-line:none');
      } else {
        doneButton.classList.add('listButtonDone');
        title.setAttribute('style', 'text-decoration-line:line-through');
      }
      // append items
      circleContainer.appendChild(doneButton);
      listItem.appendChild(circleContainer);
      listItem.appendChild(title);

      // this.listContainer.appendChild(listItem);

      // EventListeners
      doneButton.addEventListener('click', (e) => {
        // when clicked change status of item
        e.preventDefault();
        itemInfo.status = itemInfo.status === 'done' ? 'todo' : 'done';
        if (itemInfo.status === "done"){
          itemInfo.finished = new Date();
        } else {
          itemInfo.finished = undefined;
        }
        // update list
        const itemIndex = this.list.indexOf(itemInfo);
        const todoListCopy = [...this.list];
        todoListCopy[itemIndex] = itemInfo;
        this.list = todoListCopy;
        title.textContent = itemInfo.title;
        this.updateRemainingTodos();
        const filterSelection = this.menu.getElementsByTagName("input");
        for (let filterEl of filterSelection){
          if (filterEl.checked) this.filterList(filterEl.value);
        }
        // change button class
        if (doneButton.classList.contains('listButton')) {
          doneButton.classList.remove('listButton');
          doneButton.classList.add('listButtonDone');
          title.setAttribute('style', 'text-decoration-line:line-through');
        } else {
          doneButton.classList.remove('listButtonDone');
          doneButton.classList.add('listButton');
          title.setAttribute('style', 'text-decoration-line:none');
        }
      });
      // start to drag
      listItem.addEventListener("dragstart", dragStart)
      // While you drag
      listItem.addEventListener("drag", drag)
      // Let go of the drag
      listItem.addEventListener("dragend", dragEnd)

      // Target objects react to elements being dragged
      listItem.addEventListener("dragenter", dragEnter)
      listItem.addEventListener("dragover", dragOver)
      listItem.addEventListener("dragleave", dragLeave)
      listItem.addEventListener("drop", drop)

      // listItem.addEventListener("dragstart", dragStart)
      function dragStart(e) {
        // drag data, (dataTransfer)
        // feedback image,
        // drag effects,
        // event.dataTransfer.setDragImage(image, xOffset, yOffset); // img or canvas
        const innerHTML = e.target.innerHTML;
        const itemObj = JSON.stringify(itemInfo)
        e.dataTransfer.setData('text/plain', innerHTML);
        e.dataTransfer.setData('application/json', itemObj);
        e.dataTransfer.effectAllowed = "all";
        e.target.classList.add('dragStart');
      }
      function drag(e) {
        e.target.classList.add('drag');
        this.draggedItem = e.target;
      }
      function dragEnd(e) {
        console.log("dragEnd", e.target.id);
        // console.log('itemStored -> ', e.dataTransfer.getData('text/plain'));
        // const data = e.dataTransfer.getData('text/plain')
        // const item = JSON.parse(data);
        // console.log('data -> ', data);
        e.target.classList.remove('drag');
        e.target.classList.remove('dragStart');
        e.target.classList.remove('dragEnd');
      }
      // DROP TARGETS
      // preventDegfault on dragEnter & dragOver
      function dragEnter(e) {
        const isJson = e.dataTransfer.types.includes("application/json");
        if (isJson) e.preventDefault(); // Drop is allowed - also for dragOver
        console.log('dragenter', e.target.id);
      }
      function dragOver(e) {
        const isJson = e.dataTransfer.types.includes("application/json");
        if (isJson) e.preventDefault(); // Drop is allowed - also for dragEnter
        // console.log('dragOver', e.target.id);
        // swap this dragOver target with the drag target in the HTML collection
        
      }
      function drop(e) {
        console.log('drop', e.target.id);
        const targetElement = e.target;
        e.dataTransfer.dropEffect = "copy";
        e.dataTransfer.dropEffect = "move";
        const dataJson = e.dataTransfer.getData('application/json')
        const dataHTML = e.dataTransfer.getData('text/plain')
        dataJson && console.log('data -> ', JSON.parse(dataJson));
        dataHTML && console.log('data -> ', dataHTML);
        const data = JSON.parse(dataJson);
        // DOM MANIPULATION
        const replaceElement = document.createElement("li");
        replaceElement.innerHTML = dataHTML;
        replaceElement.id = data.id;
        replaceElement.classList.add("listItem");
        replaceElement.setAttribute("draggable", true);
        console.log('replaceElement -> ', replaceElement);
        // const item = JSON.parse(dataJson);
        const list = document.querySelector(".listContainer");
        // DOM INSERTION
        console.log('this.listContainer -> ', list);
        // list.replaceChild(replaceElement, targetElement)
        list.insertBefore(replaceElement, targetElement)
        
      }
      function dragLeave(e) {
        console.log('dragLeave', e.target.id);
      }
      return listItem;
    }

    getAll() {
      return this.list;
    }

    deleteItem(deleteItem) {
      this.list = this.list.filter((listItem) => listItem.id !== deleteItem.id);
    }

    size() {
      return this.list.length;
    }

    init(startList) {
      // DOM Manipulation
      // find todoContainer
      this.container = document.getElementById('todo__container');
      // add form & append
      this.form = document.createElement('form');
      this.container.append(this.form);

      // The form
      this.form.setAttribute('id', 'todoForm');

      // Draw other elements
      // this.isDarkModePref();
      this.setSysPref();
      this.drawHeader();
      this.drawFormInput();
      this.drawList(startList);
      this.drawMenu();
      this.toggleDarkMode();
    }

    /**
     *
     * @param {darkMode "dark" | "light"} theme
     * @sets darkMode in localstorage
     * Checks for user preference
     * if there´s none, it uses the sys preference
     * and sets that in storage.
     */
    setSysPref(theme) {
      // Is there an argument?
      // No Argument
      if (!theme) {
        // No Argument
        // Check storage
        let curTheme = localStorage.getItem('lightDarkTheme');
        // No storage, use sys pref and set storage
        if (!curTheme) {
          const isSysPrefDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          localStorage.setItem(
            'lightDarkTheme',
            isSysPrefDark ? 'dark' : 'light'
          );
        } 
        // Yes Argument
      } else {
        localStorage.setItem('lightDarkTheme', theme);
      }
    }

    isDarkModePref() {
      const theme = localStorage.getItem('lightDarkTheme');
      if (theme === 'dark') return true;
      return false;
    }

    toggleDarkMode(){
      const todoItems = this.listContainer.querySelectorAll(".listItem");
      if (this.isDarkModePref()){
        document.body.classList.add('darkMode');
        this.container.classList.add('darkMode');
        this.listContainer.classList.add('darkMode');
        this.menu.classList.add('darkMode');
        todoItems.forEach(item => item.classList.add('darkMode'))
      } else {
        document.body.classList.remove('darkMode');
        this.container.classList.remove('darkMode');
        this.listContainer.classList.remove('darkMode');
        this.menu.classList.remove('darkMode');
        todoItems.forEach(item => item.classList.remove('darkMode'))
      }
    }

    drawHeader() {
      // draw header
      const header = document.createElement('header');
      const title = document.createElement('h1');

      // title
      title.textContent = 'TODO';

      // checkbox & label
      this.toggleLabel = document.createElement('label');
      this.toggleLabel.classList.add('toggleWrapper');
      this.toggleLabel.style.width = '26px';
      this.toggleLabel.setAttribute('for', 'DarkModeToggle');
      const checkBox = document.createElement('input');
      checkBox.id = 'DarkModeToggle';
      checkBox.type = 'checkbox';
      checkBox.value = 'night';
      checkBox.addEventListener('change', (e) => {
        // Flip DarkMode
        this.darkMode = !this.darkMode;
        if (this.darkMode) {
          this.setSysPref('dark');
          moonImg.style.opacity = 0;
          sunImg.style.opacity = 1;
        } else {
          // this.darkMode = !this.darkMode;
          this.setSysPref('light');
          moonImg.style.opacity = 1;
          sunImg.style.opacity = 0;
        }
        // DarkMode
        // this.darkMode = !this.darkMode;
        this.toggleDarkMode();
      });

      // SVG
      const moonImg = document.createElement('img');
      moonImg.classList.add('moonImg');
      moonImg.setAttribute('src', 'assets/images/icon-moon.svg');
      const sunImg = document.createElement('img');
      sunImg.classList.add('sunImg');
      sunImg.setAttribute('src', 'assets/images/icon-sun.svg');
      const span = document.createElement('span');
      
      // Opactiy according to darkMode
      this.darkMode = this.isDarkModePref();
      moonImg.style.opacity = this.darkMode ? 0 : 1;
      sunImg.style.opacity = this.darkMode ? 1 : 0;

      // append elements
      span.appendChild(moonImg);
      span.appendChild(sunImg);
      this.toggleLabel.appendChild(checkBox);
      this.toggleLabel.appendChild(span);
      header.append(title);
      header.append(this.toggleLabel);
      this.form.append(header);
      return header;
    }

    drawFormInput() {
      // draw FormInput
      const inputContainer = document.createElement('div');
      const submitBtn = document.createElement('button');
      const textInput = document.createElement('input');
      const circleContainer = document.createElement('div');
      const circle = document.createElement('div');
      circleContainer.classList.add('circleContainer');
      circle.classList.add('circleGrey');
      inputContainer.classList.add('inputContainer');

      // button
      submitBtn.type = 'submit';
      submitBtn.setAttribute('form', this.form.id);
      submitBtn.name = 'addTodoItem';
      submitBtn.textContent = 'add';
      // circle

      // text input
      textInput.name = 'todoInput';
      textInput.type = 'text';
      textInput.placeholder = 'Create a new todo...';
      // append elements
      inputContainer.appendChild(submitBtn);
      circleContainer.appendChild(circle);
      inputContainer.appendChild(circleContainer);
      inputContainer.appendChild(textInput);
      this.form.appendChild(inputContainer);

      // eventListeners
      let inputValue;
      textInput.addEventListener('keyup', (e) => {
        inputValue = e.target.value;
      });
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (inputValue) {
          this.addItem(new ListItem(inputValue, this.list));
          textInput.value = '';
        }
      });
      return inputContainer;
    }

    drawList(startList) {
      // list container
      this.listContainer = document.createElement('ul');
      this.listContainer.classList.add('listContainer');
      // append elements
      this.form.appendChild(this.listContainer);
      // draw List
      // populate list from constructor
      if (Array.isArray(startList)) {
        startList.forEach((item) => {
          if (typeof item === 'string') {
            const newItem = new ListItem(item, this.list);
            this.addItem(newItem);
          } else if (item.id) {
            this.addItem(item);
          }
        });
      }
    }

    drawMenu() {
      // draw Menu
      this.menu = document.createElement('menu');
      this.counter = document.createElement('div');
      const filter = document.createElement('div');
      const clearBtn = document.createElement('button');
      const selectBlue = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--selectedTextBlue');
      // menu classes
      this.counter.classList.add('counter');
      filter.classList.add('filter');
      clearBtn.classList.add('clearBtn');

      // counter
      this.updateRemainingTodos();

      // Filter Section
      const filterAllLabel = document.createElement('label');
      const filterAll = document.createElement('input');
      filterAll.type = 'radio';
      filterAll.name = 'filter';
      filterAll.checked = true;
      filterAll.id = 'filterAll';
      filterAll.value = 'all';
      filterAllLabel.setAttribute('for', filterAll.id);
      filterAllLabel.textContent = filterAll.value;
      filterAllLabel.style.color = selectBlue;
      filterAllLabel.appendChild(filterAll);
      filter.appendChild(filterAllLabel);
      // active
      const filterActiveLabel = document.createElement('label');
      const filterActive = document.createElement('input');
      filterActive.type = 'radio';
      filterActive.name = 'filter';
      filterActive.id = 'filterActive';
      filterActive.value = 'active';
      filterActiveLabel.setAttribute('for', filterActive.id);
      filterActiveLabel.textContent = filterActive.value;
      filterActiveLabel.appendChild(filterActive);
      filter.appendChild(filterActiveLabel);
      // completed
      const filterCompletedLabel = document.createElement('label');
      const filterCompleted = document.createElement('input');
      filterCompleted.type = 'radio';
      filterCompleted.name = 'filter';
      filterCompleted.id = 'filterCompleted';
      filterCompleted.value = 'completed';
      filterCompletedLabel.setAttribute('for', filterCompleted.id);
      filterCompletedLabel.textContent = filterCompleted.value;
      filterCompletedLabel.appendChild(filterCompleted);
      filter.appendChild(filterCompletedLabel);

      // clear button
      clearBtn.type = 'button';
      clearBtn.textContent = 'Clear completed';
      // eventlisteners
      filter.addEventListener('change', (e) => {
        this.filterList(e.target.value);
        const labels = filter.getElementsByTagName('label');
        for (let label of labels) {
          if (label.getAttribute('for') === e.target.id) {
            // TODO set proper colors
            label.style.color = selectBlue;
          } else {
            label.style.color = 'grey';
          }
        }
      });
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("clearBtn")
        this.clearDoneElements();
        // this.filterList("all");
        filterAll.checked = true;
        filterAllLabel.style.color = selectBlue;
        filterActiveLabel.style.color = 'grey';
        filterCompletedLabel.style.color = 'grey';
      });
      

      // append items
      this.menu.appendChild(this.counter);
      this.menu.appendChild(filter);
      this.menu.appendChild(clearBtn);
      this.form.appendChild(this.menu);
    }

    updateRemainingTodos() {
      const remainingTodos = this.list.filter((todo) => todo.status === 'todo')
        .length;
      if (this.counter) {
        this.counter.textContent = `${remainingTodos} item${
          remainingTodos === 1 ? '' : 's'
        } left`;
      }
    }

    clearDoneElements() {
      if (this.list.every((el) => el.status === 'todo')) return;
      const completedTodosIds = this.list.filter((todo) => todo.status === 'done').map(todo => todo.id);
      completedTodosIds.forEach( id => {
        const element = document.getElementById(`${id}`);
        element.remove();
      })
      this.list = this.list.filter((todo) => todo.status === 'todo');
      this.updateRemainingTodos();
    }
    
    filterList(filterSelection) {
      const allIds = this.list.map(item => item.id);
      const activeIdList = this.list.filter(item => item.status === "todo").map(item => item.id);
      const completedIdList = this.list.filter(item => item.status === "done").map(item => item.id);
      switch (filterSelection) {
        case 'all':
          allIds.forEach(id => {
            const element = document.getElementById(`${id}`);
            element.style.display = "flex"
          })
          return;
        case 'active':
          activeIdList.forEach(id => {
            const element = document.getElementById(`${id}`);
            element.style.display = "flex"
          })
          completedIdList.forEach(id => {
            const element = document.getElementById(`${id}`);
            element.style.display = "none"
          })
          return;
        case 'completed':
          activeIdList.forEach(id => {
            const element = document.getElementById(`${id}`);
            element.style.display = "none"
          })
          completedIdList.forEach(id => {
            const element = document.getElementById(`${id}`);
            element.style.display = "flex"
          })
          return;
      }
    }
  }
  // create Todo List
  const todoList = new TodoList(dummyList);

  // Helper function
  function generateId(list) {
    const randomId = Math.floor(Math.random() * 100000000);
    if (list && list.length > 0) {
      if (list.some((item) => item.id === randomId)) {
        generateId();
      } else {
        return randomId;
      }
    } else {
      return randomId;
    }
  }
})();
