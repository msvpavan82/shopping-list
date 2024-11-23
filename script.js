const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  let newItem = itemInput.value;
  itemInput.value = '';

  // validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.innerText);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }

  if (checkIfItemExists(newItem)) {
    alert('Item already exists...');
    return;
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  checkUI();
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;

  return icon;
}

function addItemToStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  // Convert to JSON String and set to local storage
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

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.map((item) => item.toLowerCase());

  return itemsFromStorage.includes(item.toLowerCase());
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = `<i class='fa-solid fa-pen'></i> Update Item`;
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.innerText;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.innerText.trim());

    checkUI();
  }
}

function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  const itemIndex = itemsFromStorage.indexOf(item);
  itemsFromStorage.splice(itemIndex, 1);

  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.firstChild.remove();
  }

  // Clear from localStorage
  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.innerText.toLowerCase();
    if (!itemName.includes(text)) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

function checkUI() {
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
