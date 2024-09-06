// Load the Dataset and perform the order: 
document.addEventListener("DOMContentLoaded", function() {
    // Fetch the JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            // Store the base price
            const basePrice = data.products[0].price;
            document.getElementById('totalPrice').textContent = `Total Price: €${basePrice.toFixed(2)}`;

            // Populate the color select dropdown
            populateColors(data.colours);
            // Populate the symbol select dropdown
            populateSymbols(data.symbols);
        })
        .catch(error => console.error('Error fetching JSON:', error));

    let selectedColorName = 'None';
    let selectedSymbolName = 'None';
    let selectedColorPrice = 0;
    let selectedSymbolPrice = 0;

    // Function to populate the color select dropdown
    function populateColors(colours) {
        const colorSelect = document.getElementById('colorSelect');
        const defaultOption = document.createElement('option');
        defaultOption.value = 'default';
        defaultOption.textContent = 'Select a Color';
        colorSelect.appendChild(defaultOption);

        colours.forEach(colour => {
            const option = document.createElement('option');
            option.value = colour.id;
            option.innerHTML = colour.price_add > 0
                ? `${colour.name} <span style="color: green;">(+€${colour.price_add.toFixed(2)})</span>`
                : colour.name;
            colorSelect.appendChild(option);
        });

        colorSelect.addEventListener('change', function() {
            const selectedColorId = colorSelect.value;
            const selectedColor = colours.find(colour => colour.id == selectedColorId);
            selectedColorName = selectedColor ? selectedColor.name : 'None';
            selectedColorPrice = selectedColor ? selectedColor.price_add : 0;
            updateTotalPrice();
            updateImages(selectedColor?.name || 'default', 'color');
        });
    }

    // Function to populate the symbol select dropdown
    function populateSymbols(symbols) {
        const symbolSelect = document.getElementById('symbolSelect');
        const defaultOption = document.createElement('option');
        defaultOption.value = 'default';
        defaultOption.textContent = 'Select a Symbol';
        symbolSelect.appendChild(defaultOption);

        symbols.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol.id;
            option.textContent = symbol.name;
            symbolSelect.appendChild(option);
        });

        symbolSelect.addEventListener('change', function() {
            const selectedSymbolId = symbolSelect.value;
            const selectedSymbol = symbols.find(symbol => symbol.id == selectedSymbolId);
            selectedSymbolName = selectedSymbol ? selectedSymbol.name : 'None';
            selectedSymbolPrice = selectedSymbol ? selectedSymbol.price_add : 0;
            updateTotalPrice();
            updateImages(selectedSymbol?.name || 'default', 'symbol');
        });
    }

    // Function to update the base image and overlay image based on selected color and symbol
    function updateImages(value, type) {
        const productImage = document.getElementById('productImage');
        const symbolOverlay = document.getElementById('symbolOverlay');
        const baseImageSrc = './products/skateboard';  // Base path to image

        if (type === 'color') {
            if (value === 'Select a Color' || value === 'default') {
                productImage.src = `${baseImageSrc}.png`;  // Default image
            } else {
                productImage.src = `${baseImageSrc}-${value.toLowerCase()}.png`;
            }
        } else if (type === 'symbol') {
            if (value === 'Select a Symbol' || value === 'default') {
                symbolOverlay.src = '';  // Remove symbol overlay
                symbolOverlay.style.display = 'none';  // Hide the symbol overlay
            } else {
                symbolOverlay.src = `./symbols/symbol-${value}.png`;
                symbolOverlay.style.display = 'block';  // Show the symbol overlay
            }
        }
    }

    // Function to update the total price
    function updateTotalPrice() {
        const basePrice = 24.5; // Base price from JSON or dynamically set
        const totalPrice = basePrice + selectedColorPrice + selectedSymbolPrice;
        document.getElementById('totalPrice').textContent = `Total Price: €${totalPrice.toFixed(2)}`;
    }

    // Function to show the notification
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000); // Hide the notification after 3 seconds
    }

    // Handle order submission
    document.getElementById('submitOrder').addEventListener('click', function() {
        const basePrice = 24.5; // Base price from JSON or dynamically set
        const totalPrice = basePrice + selectedColorPrice + selectedSymbolPrice;

        const orderData = {
            name: 'skateboard',
            color: selectedColorName,
            symbol: selectedSymbolName,
            price: totalPrice.toFixed(2)
        };

        // Create a POST request to the specified URL
        fetch('https://skills.canvasaccept.com/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order submitted successfully:', data);
            showNotification('Thank you for your order!');
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            showNotification('There was an error placing your order. Please try again.');
        });
    });
});

// Notification order:
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
};
