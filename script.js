const darkModeButton = document.querySelector(".dark-mode-button");
const body = document.body;
const wrapper = document.querySelector(".wrapper");



darkModeButton.addEventListener("click", ()=>{
    body.classList.toggle('dark');
    wrapper.classList.toggle('dark');


    if(body.classList.contains('dark')){
        darkModeButton.textContent = 'Light mode';
    }else{
        darkModeButton.textContent = 'dark mode';
    }
});

// -----------------------------------------------------------
// Object to keep track of boxes by date
let dateBoxMap = {};

// Event listener for the Add button
document.querySelector('.add').addEventListener('click', function () {
    let name = document.querySelector('#name').value;
    let price = document.querySelector('#price').value;
    let date = document.querySelector('#date').value;

    if (name && price && date) {
        price = parseFloat(price); // Ensure price is treated as a number

        // Check if the box for this date already exists
        if (!dateBoxMap[date]) {
            // Create a new box for this date if it doesn't exist
            const newBox = document.createElement('div');
            newBox.classList.add('box');

            const dateHeading = document.createElement('div');
            dateHeading.classList.add('date-heading');
            dateHeading.textContent = date;

            const ul = document.createElement('ul');
            const li = createListItem(name, price); // Create a new list item

            ul.appendChild(li);

            newBox.appendChild(dateHeading);
            newBox.appendChild(ul);

            // Append the new box to the shopping log
            document.querySelector('.shopping-log').appendChild(newBox);

            // Store this date's box in the dateBoxMap and initialize total for this date
            dateBoxMap[date] = {
                box: newBox,
                total: price,
            };
        } else {
            // If the box for this date already exists, append to the existing list
            const existingBox = dateBoxMap[date].box;
            const ul = existingBox.querySelector('ul');
            const li = createListItem(name, price);

            ul.appendChild(li);

            // Update the total for this date
            dateBoxMap[date].total += price;
        }

        // Update the total price displayed in the price-section
        updateTotalPrice();

        // Reset input fields
        document.querySelector('#name').value = '';
        document.querySelector('#price').value = '';
        document.querySelector('#date').value = '';
    } else {
        alert('Please fill in all fields');
    }
});

// Function to create a list item with edit and remove buttons
function createListItem(name, price) {
    const li = document.createElement('li');

    const nameDisplay = document.createElement('span');
    nameDisplay.classList.add('display', 'name-display');
    nameDisplay.textContent = name;

    const priceDisplay = document.createElement('span');
    priceDisplay.classList.add('display', 'price-display');
    priceDisplay.textContent = price;

    const editButton = document.createElement('button');
    editButton.classList.add('button', 'edit-button');
    editButton.textContent = 'edit';

    const removeButton = document.createElement('button');
    removeButton.classList.add('button', 'remove-button');
    removeButton.textContent = 'remove';

    // Add event listeners for edit and remove
    editButton.addEventListener('click', function () {
        editItem(li, nameDisplay, priceDisplay);
    });
    removeButton.addEventListener('click', function () {
        removeItem(li, price);
    });

    li.appendChild(nameDisplay);
    li.appendChild(document.createTextNode(' = '));
    li.appendChild(priceDisplay);
    li.appendChild(editButton);
    li.appendChild(removeButton);

    return li;
}

// Function to handle item editing
function editItem(li, nameDisplay, priceDisplay) {
    const newName = prompt('Enter new name:', nameDisplay.textContent);
    const newPrice = parseFloat(prompt('Enter new price:', priceDisplay.textContent));

    if (newName && !isNaN(newPrice)) {
        const oldPrice = parseFloat(priceDisplay.textContent);
        const date = li.closest('.box').querySelector('.date-heading').textContent;

        nameDisplay.textContent = newName;
        priceDisplay.textContent = newPrice;

        // Update the total for this date
        dateBoxMap[date].total = dateBoxMap[date].total - oldPrice + newPrice;

        // Update the total price displayed in the price-section
        updateTotalPrice();
    } else {
        alert('Invalid input. Please try again.');
    }
}

// Function to handle item removal
function removeItem(li, price) {
    const date = li.closest('.box').querySelector('.date-heading').textContent;

    li.remove(); // Remove the item from the list

    // Update the total for this date
    dateBoxMap[date].total -= price;

    // Update the total price displayed in the price-section
    updateTotalPrice();
}

// Function to update the total price displayed
function updateTotalPrice() {
    let totalPrice = 0;

    // Calculate the sum of all date totals
    for (const date in dateBoxMap) {
        totalPrice += dateBoxMap[date].total;
    }

    // Update the total price in the price-section
    document.querySelector('.total-price').textContent = totalPrice.toFixed(2); // Format to 2 decimal places
}
