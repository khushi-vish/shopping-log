const darkModeButton = document.querySelector(".dark-mode-button");
const body = document.body;
const wrapper = document.querySelector(".wrapper");

// Load dark mode state from local storage
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark");
  wrapper.classList.add("dark");
  darkModeButton.textContent = "Light mode";
}

// Toggle dark mode and save state
darkModeButton.addEventListener("click", () => {
  body.classList.toggle("dark");
  wrapper.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
    darkModeButton.textContent = "Light mode";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkModeButton.textContent = "Dark mode";
  }
});

// -----------------------------------------------------------
// Object to keep track of boxes by date
let dateBoxMap = JSON.parse(localStorage.getItem("shoppingLog")) || {};

// Render saved shopping log
document.addEventListener("DOMContentLoaded", () => {
  for (const date in dateBoxMap) {
    renderBox(date, dateBoxMap[date].items, dateBoxMap[date].total);
  }
  updateTotalPrice();
});

// Event listener for the Add button
document.querySelector(".add").addEventListener("click", function () {
  let name = document.querySelector("#name").value;
  let price = document.querySelector("#price").value;
  let date = document.querySelector("#date").value;

  if (name && price && date) {
    price = parseFloat(price);

    if (!dateBoxMap[date]) {
      dateBoxMap[date] = { items: [], total: 0 };
    }

    dateBoxMap[date].items.push({ name, price });
    dateBoxMap[date].total += price;

    saveToLocalStorage();
    renderBox(date, dateBoxMap[date].items, dateBoxMap[date].total);

    document.querySelector("#name").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#date").value = "";
  } else {
    alert("Please fill in all fields");
  }
});

// Function to render a date box
function renderBox(date, items, total) {
  let existingBox = document.querySelector(`.box[data-date="${date}"]`);

  if (!existingBox) {
    const newBox = document.createElement("div");
    newBox.classList.add("box");
    newBox.setAttribute("data-date", date);

    const dateHeading = document.createElement("div");
    dateHeading.classList.add("date-heading");
    dateHeading.textContent = date;

    const ul = document.createElement("ul");

    newBox.appendChild(dateHeading);
    newBox.appendChild(ul);
    document.querySelector(".shopping-log").appendChild(newBox);

    existingBox = newBox;
  }

  const ul = existingBox.querySelector("ul");
  ul.innerHTML = "";
  items.forEach((item) => {
    ul.appendChild(createListItem(item.name, item.price, date));
  });

  updateTotalPrice();
}

// Function to create a list item
function createListItem(name, price, date) {
  const li = document.createElement("li");

  const nameDisplay = document.createElement("span");
  nameDisplay.classList.add("display", "name-display");
  nameDisplay.textContent = name;

  const priceDisplay = document.createElement("span");
  priceDisplay.classList.add("display", "price-display");
  priceDisplay.textContent = price;

  const editButton = document.createElement("button");
  editButton.classList.add("button", "edit-button");
  editButton.textContent = "edit";

  const removeButton = document.createElement("button");
  removeButton.classList.add("button", "remove-button");
  removeButton.textContent = "remove";

  editButton.addEventListener("click", function () {
    editItem(name, price, date, li, nameDisplay, priceDisplay);
  });

  removeButton.addEventListener("click", function () {
    removeItem(name, price, date, li);
  });

  li.appendChild(nameDisplay);
  li.appendChild(document.createTextNode(" = "));
  li.appendChild(priceDisplay);

  li.appendChild(editButton);
  li.appendChild(removeButton);

  return li;
}

// Function to edit an item
function editItem(oldName, oldPrice, date, li, nameDisplay, priceDisplay) {
  const newName = prompt("Enter new name:", oldName);
  const newPrice = parseFloat(prompt("Enter new price:", oldPrice));

  if (newName && !isNaN(newPrice)) {
    nameDisplay.textContent = newName;
    priceDisplay.textContent = newPrice + "₹";

    let item = dateBoxMap[date].items.find(
      (item) => item.name === oldName && item.price == oldPrice
    );
    if (item) {
      item.name = newName;
      item.price = newPrice;
    }

    dateBoxMap[date].total = dateBoxMap[date].items.reduce(
      (sum, item) => sum + item.price,
      0
    );
    saveToLocalStorage();
    updateTotalPrice();
  } else {
    alert("Invalid input. Please try again.");
  }
}

// Function to remove an item
function removeItem(name, price, date, li) {
  dateBoxMap[date].items = dateBoxMap[date].items.filter(
    (item) => !(item.name === name && item.price == price)
  );
  dateBoxMap[date].total -= price;

  if (dateBoxMap[date].items.length === 0) {
    delete dateBoxMap[date];
    document.querySelector(`.box[data-date="${date}"]`).remove();
  } else {
    saveToLocalStorage();
    updateTotalPrice();
  }

  li.remove();
}

// Function to update total price
function updateTotalPrice() {
  let totalPrice = Object.values(dateBoxMap).reduce(
    (sum, entry) => sum + entry.total,
    0
  );
  document.querySelector(".total-price").textContent = totalPrice.toFixed(2);
  saveToLocalStorage();
}

// Save data to local storage
function saveToLocalStorage() {
  localStorage.setItem("shoppingLog", JSON.stringify(dateBoxMap));
}

// ================================

document.querySelector(".reset").addEventListener("click", function () {
  document.querySelector(".shopping-log").innerHTML = "";
  dateBoxMap = {};
  localStorage.removeItem("shoppingLog");
  updateTotalPrice();
});
