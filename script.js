(function init() {
  // create a list and list items
  const dummyList = [
    'Jog around the park 3x',
    '10 minutes meditation',
    'Read for 1 hour',
    'Pick up groceries',
    'Complete Todo App on Frontend Mentor',
  ];

  class ListItem {
    constructor(title, currentList) {
      this.id = generateId(currentList);
      this.title = title;
      this.created = new Date();
      this.status = 'todo';
      this.finished;
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
      this.updateRemainingTodoCounter();
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
      const deleteButton = document.createElement('button');
      // list item
      listItem.id = itemInfo.id;
      listItem.classList.add('listItem');
      listItem.setAttribute("draggable", true)

      // title
      title.textContent = itemInfo.title;
      title.classList.add('listTitle');
      title.setAttribute("draggable", false)
      // done button
      if (itemInfo.status === 'todo') {
        doneButton.classList.add('listButton');
        title.classList.remove(".lineThrough")
      } else {
        doneButton.classList.add('listButtonDone');
        title.classList.add(".lineThrough")
      }
      // deletebutton
      deleteButton.classList.add("deleteButton")
      const x = document.createElement("div");
      x.classList.add("deleteButtonX");
      deleteButton.appendChild(x);
      // deleteButton.textContent = "+"
      // append items
      circleContainer.appendChild(doneButton);
      listItem.appendChild(circleContainer);
      listItem.appendChild(title);
      listItem.appendChild(deleteButton);

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
        this.updateRemainingTodoCounter();
        const filterSelection = this.menu.getElementsByTagName("input");
        for (let filterEl of filterSelection){
          if (filterEl.checked) this.filterList(filterEl.value);
        }
        // change button class
        if (doneButton.classList.contains('listButton')) {
          doneButton.classList.remove('listButton');
          doneButton.classList.add('listButtonDone');
          title.classList.add("lineThrough")
        } else {
          doneButton.classList.remove('listButtonDone');
          doneButton.classList.add('listButton');
          title.classList.remove("lineThrough")
        }
      });
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault()
        let listElement;
        if (e.target.parentElement.classList.contains("deleteButton")){
          listElement = e.target.parentElement.parentElement
        } else if (e.target.classList.contains("deleteButton")){
          listElement = e.target.parentElement
        }
        if(listElement.classList.contains("listItem")) {
          listElement.remove();
          this.list = this.list.filter(item => item.id !== +listElement.id)
          this.checkForNoMoreItems();
        }
      })
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
        e.target.classList.remove('drag');
        e.target.classList.remove('dragStart');
        e.target.classList.remove('dragEnd');
      }
      // DROP TARGETS
      // preventDegfault on dragEnter & dragOver
      function dragEnter(e) {
        e.preventDefault()
        if (e.target.classList.contains("listTitle")) {
          e.target.parentElement.classList.add("dragOver")
        } else {
          e.target.classList.add("dragOver")
        }
        // const isJson = e.dataTransfer.types.includes("application/json");
        // if (isJson) e.preventDefault(); // Drop is allowed - also for dragOver
        // console.log('dragenter', e.target.id);
      }
      function dragOver(e) {
        e.preventDefault();
        // const isJson = e.dataTransfer.types.includes("application/json");
        // if (isJson) e.preventDefault(); // Drop is allowed - also for dragEnter
        // console.log('dragOver', e.target.ˇe drag target in the HTML collection
      }
      function drop(e){
        e.target.classList.remove("dragOver");
        const targetElement = e.target;
        e.dataTransfer.dropEffect = "copy";
        e.dataTransfer.dropEffect = "move";
        const dataJson = e.dataTransfer.getData('application/json')
        const dataHTML = e.dataTransfer.getData('text/plain')
        dataJson && console.log('data -> ', JSON.parse(dataJson));
        const data = JSON.parse(dataJson);
        // DOM MANIPULATION
        const listAllElements = document.querySelector(".listContainer").querySelectorAll("li");
        const listArr = Array.from(listAllElements);
        const source = document.getElementById(`${data.id}`)
        let target;
        if (e.target.classList.contains("listTitle")){
          target = document.getElementById(`${e.target.parentElement.id}`)
        } else {
          target = document.getElementById(`${e.target.id}`)
        }
        const targetInx = listArr.indexOf(target);
        const sourceInx = listArr.indexOf(source);
        // Swapping
          // dragged from below
        if (sourceInx > targetInx){ 
          target.parentElement.insertBefore(source, target)
          // if dragged from above
        } else {
          const newTargetEl = listArr[targetInx+1];
          target.parentElement.insertBefore(source, newTargetEl)
        }
        e.preventDefault();
      }
      function dragLeave(e) {
        // console.log('dragLeave', e.target.id);
        if (e.target.classList.contains("listTitle")){

        } else {
          e.target.classList.remove("dragOver")

        }
      }
      return listItem;
    }

    getAll() {
      return this.list;
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

      this.setSysPref();

      // Draw other elements
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
      // submitBtn.textContent = 'add';
      submitBtn.classList.add('circleGrey');
      // circle

      // text input
      textInput.name = 'todoInput';
      textInput.type = 'text';
      textInput.placeholder = 'Create a new todo...';
      // append elements
      // inputContainer.appendChild(submitBtn);
      // circleContainer.appendChild(circle);
      circleContainer.appendChild(submitBtn);
      inputContainer.appendChild(circleContainer);
      inputContainer.appendChild(textInput);
      this.form.appendChild(inputContainer);
      const addNewListItem = () => {
        console.log(' addNewListItem-> ');
        if (inputValue) {
          this.addItem(new ListItem(inputValue, this.list));
          textInput.value = '';
        }
        const noItems = document.querySelector("#noItems");
        if (noItems) noItems.remove();
      }

      // eventListeners
      let inputValue;
      textInput.addEventListener('keyup', (e) => {
        inputValue = e.target.value;
      });
      submitBtn.addEventListener('click', (e) => {
        console.log('sub click -> ', inputValue);
        e.preventDefault();
        addNewListItem();
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
      // menu classes
      this.counter.classList.add('counter');
      filter.classList.add('filter');
      clearBtn.classList.add('clearBtn');

      // counter
      this.updateRemainingTodoCounter();

      // Filter Section
      const filterAllLabel = document.createElement('label');
      const filterAllBtn = document.createElement('input');
      const filterAllTextSpan = document.createElement('span');
      filterAllBtn.type = 'radio';
      filterAllBtn.name = 'filter';
      filterAllBtn.checked = true;
      filterAllBtn.id = 'filterAll';
      filterAllBtn.value = 'all';
      filterAllLabel.setAttribute('for', filterAllBtn.id);
      filterAllTextSpan.textContent = filterAllBtn.value;
      filterAllLabel.appendChild(filterAllBtn);
      filterAllLabel.appendChild(filterAllTextSpan);
      filter.appendChild(filterAllLabel);
      // active
      const filterActiveLabel = document.createElement('label');
      const filterActiveBtn = document.createElement('input');
      const filterActiveTextSpan = document.createElement('span');
      filterActiveBtn.type = 'radio';
      filterActiveBtn.name = 'filter';
      filterActiveBtn.id = 'filterActive';
      filterActiveBtn.value = 'active';
      filterActiveLabel.setAttribute('for', filterActiveBtn.id);
      filterActiveTextSpan.textContent = filterActiveBtn.value;
      filterActiveLabel.appendChild(filterActiveBtn);
      filterActiveLabel.appendChild(filterActiveTextSpan);
      filter.appendChild(filterActiveLabel);
      // completed
      const filterCompletedLabel = document.createElement('label');
      const filterCompletedBtn = document.createElement('input');
      filterCompletedBtn.type = 'radio';
      filterCompletedBtn.name = 'filter';
      filterCompletedBtn.id = 'filterCompleted';
      filterCompletedBtn.value = 'completed';
      filterCompletedLabel.setAttribute('for', filterCompletedBtn.id);
      const filterCompletedTextSpan = document.createElement('span');
      filterCompletedTextSpan.textContent = filterCompletedBtn.value;
      filterCompletedLabel.appendChild(filterCompletedBtn);
      filterCompletedLabel.appendChild(filterCompletedTextSpan);
      filter.appendChild(filterCompletedLabel);

      // clear button
      clearBtn.type = 'button';
      clearBtn.textContent = 'Clear completed';
      // eventlisteners
      filter.addEventListener('change', (e) => {
        let count = 0;
        this.filterList(e.target.value);
        const allRadioBtns = filter.querySelectorAll("input");
        allRadioBtns.forEach(radioBtn => {
          if (radioBtn.id === e.target.id) radioBtn.checked = true;
          else radioBtn.checked = false;
        })
      });
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("clearBtn")
        this.clearDoneElements();
        this.filterList("all");
        filterAllBtn.checked = true;
      });
      
      // Draw menu Mobile
      const mobileMenu = document.createElement("menu")
      mobileMenu.classList.add("mobileMenu")
      

      const mqList = window.matchMedia("(max-width: 450px)")
      if (mqList.matches){
        mobileMenu.style.display = "flex";
        this.menu.appendChild(this.counter);
        this.menu.appendChild(clearBtn);
        this.form.appendChild(this.menu);
        mobileMenu.appendChild(filter);
        this.form.appendChild(mobileMenu);
      } else {
        // append items
        mobileMenu.style.display = "none";
        this.menu.appendChild(this.counter);
        this.menu.appendChild(filter);
        this.menu.appendChild(clearBtn);
        this.form.appendChild(this.menu);
        this.form.appendChild(mobileMenu);
      }
      mqList.addEventListener("change", (e) => {
        // Mobile Menu
        if (e.matches){
          mobileMenu.style.display = "flex";
          this.menu.appendChild(this.counter);
          this.menu.appendChild(clearBtn);
          this.form.appendChild(this.menu);
          mobileMenu.appendChild(filter);
          this.form.appendChild(mobileMenu);
        } else {
          // Regular menu
          mobileMenu.style.display = "none";
          this.menu.appendChild(this.counter);
          this.menu.appendChild(filter);
          this.menu.appendChild(clearBtn);
          this.form.appendChild(this.menu);
        }
      })

    }

    updateRemainingTodoCounter() {
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
      this.list = this.list.filter((todo) => todo.status === 'todo');this.checkForNoMoreItems();
      this.updateRemainingTodoCounter();
    }
    
    checkForNoMoreItems(){
      if (!this.list.length){
        const listItem = document.createElement('li');
        listItem.classList.add("listItem")
        listItem.id = "noItems";
        listItem.textContent = "Everythings is done. Add some more"
        this.listContainer.appendChild(listItem)
      }
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
