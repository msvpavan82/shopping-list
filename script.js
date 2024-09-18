const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
let setItemToEdit = false;

function displayItemsFromStorage() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => {
    addItemToDOM(document.createTextNode(item));
  });
}

function onSubmitItem(e) {
  e.preventDefault();

  // Validate Items
  if (itemInput.value === '') {
    alert('Please add some place...');
    return;
  }

  const newItem = document.createTextNode(itemInput.value);

  if (setItemToEdit) {
    const items = itemList.querySelectorAll('li');

    items.forEach((item) => {
      if (item.classList.contains('edit-mode')) {
        item.remove();
        removeItemFromStorage(item.textContent.trim());
      }
    });
    setItemToEdit = false;
  } else {
    if (checkIfItemExists(newItem.textContent.toLowerCase().trim())) {
      alert('This is already in the bucket list...');
      itemInput.value = '';
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToLocalStorage(newItem.textContent);

  itemInput.value = '';

  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(item);
  const button = createNewButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
  itemInput.value = '';
}

function addItemToLocalStorage(itemValue) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(itemValue);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function createNewButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createNewIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createNewIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  let item;
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      item = e.target.parentElement.parentElement;
      e.target.parentElement.parentElement.remove();
      removeItemFromStorage(item.textContent.trim());
    }
  } else {
    editItem(e.target);
  }
  checkUI();
}

function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.splice(itemsFromStorage.indexOf(item), 1);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function editItem(item) {
  setItemToEdit = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  itemInput.value = item.textContent;
}

function filterItems(e) {
  const input = e.target.value.toLowerCase();
  const items = document.querySelectorAll('li');
  items.forEach((item) => {
    item.style.display = item.textContent.trim().toLowerCase().includes(input)
      ? 'flex'
      : 'none';
  });
}

function removeAllItems() {
  while (itemList.firstChild) {
    itemList.firstChild.remove();
  }
  removeAllFromLocalStoarge();
  checkUI();
}

function removeAllFromLocalStoarge() {
  localStorage.removeItem('items');
}

function checkIfItemExists(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.map((item) => item.toLowerCase());
  return itemsFromStorage.includes(item);
}

function checkUI() {
  const items = document.querySelectorAll('li');
  if (items.length === 0) {
    itemFilter.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    itemFilter.style.display = 'block';
    clearBtn.style.display = 'block';
  }
}

// IIFE
(function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onSubmitItem);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', removeAllItems);
  itemFilter.addEventListener('input', filterItems);

  displayItemsFromStorage();
  checkUI();
})();
