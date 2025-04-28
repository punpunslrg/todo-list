document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById
  ('task-input');
  const addTaskBtn = document.getElementById
  ('add-task-btn');
  const taskList = document.getElementById
  ('task-list');
  const emptyImage = document.getElementById
  ('empty-image');
  const todoContainer = document.getElementById
  ('todo-container');

  const toggleEmptyState = () => {
    if (taskList.children.length === 0) {
      emptyImage.classList.remove('hidden');
      todoContainer.classList.remove('h-auto');
      todoContainer.classList.add('h-[300px]');
    } else {
      emptyImage.classList.add('hidden');
      todoContainer.classList.remove('h-[300px]');
      todoContainer.classList.add('h-auto');
    }
  };

  toggleEmptyState();

  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
      text: li.querySelector('span').textContent,
      completed: li.querySelector('#checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
    toggleEmptyState();
  }
  
  const addTask = (text, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement('li');
    li.className = "flex items-center justify-center bg-white/60 backdrop-blur-none my-1 p-2 mb-2 rounded-3xl relative w-full"
    
    li.innerHTML = `
    <input type="checkbox" id="checkbox" class="appearance-none rounded-full size-5 bg-white border-2 border-gray-400 mr-2 checked:bg-green-400 checked:border-green-400 aspect-square"
    ${completed ? 'checked' : ''}>
    <span class="w-full">${taskText}</span>
    <div class="flex justify-center items-center">
      <button id="edit-btn" class="border size-6 text-sm p-4 flex justify-center items-center rounded-full bg-yellow-300 ml-1 cursor-pointer hover:bg-yellow-400"><i class="fa-solid fa-pen"></i></button>
      <button id="delete-btn" class="border size-6 text-sm p-4 flex justify-center items-center rounded-full bg-red-300 ml-1 cursor-pointer hover:bg-red-400"><i class="fa-solid fa-trash"></i></button>
    </div>
    `

    const checkbox = li.querySelector
    ('#checkbox')
    const editBtn = li.querySelector
    ('#edit-btn');

    if (completed) {
      li.classList.add('completed');
      editBtn.disabled = true;
      editBtn.classList.add('opacity-50', 'pointer-events-none')
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked;
      li.classList.toggle('completed', isChecked);

      editBtn.disabled = isChecked;

      if (isChecked) {
        editBtn.classList.add('opacity-50', 'pointer-events-none');
      } else {
        editBtn.classList.remove('opacity-50', 'pointer-events-none');
      }

      saveTaskToLocalStorage();
    })

    editBtn.addEventListener('click', () => {
      if(!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        toggleEmptyState();
        saveTaskToLocalStorage();
      }
    });

    li.querySelector('#delete-btn').
    addEventListener('click', () => {
      li.remove();
      toggleEmptyState();
      saveTaskToLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyState();
    saveTaskToLocalStorage();
  };

  addTaskBtn.addEventListener('click', () => addTask());
  taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  loadTasksFromLocalStorage();
})

