//Fetch plant data from server, render the plants on the page, and handle adding plants to a shopping cart.

document.addEventListener("DOMContentLoaded", () => {
    fetchPlants();
});

// Fetch Plants from the Server
const fetchPlants = async () => {
    try {
        const response = await fetch("http://localhost:5501/plants");
        if (!response.ok) {
            throw new Error("Failed to fetch Plants");
        }
        const plants = await response.json();
        console.log(plants); // Log the fetched data
        renderPlants(plants);
    } catch (error) {
        console.error("Error fetching plants:", error);
        document.getElementById("error-message").style.display = "block";
    }
};

//fetchPlants();

// Render Plants to the Page
const renderPlants = (plants) => {
    const plantsSection = document.getElementById('plants');
    plantsSection.innerHTML = '';
    plants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.className = 'plant-card';
        plantCard.innerHTML = `
            <img src="${plant.image_url}" alt="${plant.name}">
            <h2>${plant.name}</h2>
            <p>${plant.description}</p>
            <p>Price: $${plant.price}</p>
            <p>Quantity: ${plant.quantity}</p>
            ${plant.quantity > 0 ? '<button class="add-to-cart">Add to Cart</button>' : '<p>Out of Stock</p>'}
        `;
        plantCard.addEventListener('click', () => {
            console.log(`Clicked on ${plant.name}`);
            // Additional logic for clicking on the plant card can be added here
        });
        if (plant.quantity > 0) {
            const addToCartButton = plantCard.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the card click event
                addToCart(plant);
            });
        }
        plantsSection.appendChild(plantCard);
    });
};

// Add event listeners to "Add to Cart" buttons
    document.querySelectorAll(".plant-card button").forEach(button => {
        button.addEventListener("click", (e) => {
            const plantId = e.target.getAttribute("data-id");
            addToCart(plantId);
        });
    });

// Show Message Box
function showMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.textContent = message;
    document.body.appendChild(messageBox);

    // Remove the message box after 3 seconds
    setTimeout(() => {
        document.body.removeChild(messageBox);
    }, 3000);
}


// Add to Cart Functionality
function addToCart(plantId) {
    fetch("http://localhost:5501/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId, quantity: 1 })
    })
        .then(response => response.json())
        .then(data => {
            alert("Added to cart!");
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
        });
}