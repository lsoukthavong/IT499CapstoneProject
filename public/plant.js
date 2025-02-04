
// To display selected plant
const getPlantIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const plantId = params.get('plantId');
    console.log('Plant ID from URL:', plantId); // Debugging log
    return plantId;
};

//fetch plant
const fetchPlantDetails = async (plantId) => {
    console.log('Fetching details for plant ID:', plantId); // Debugging log
    try {
        const response = await fetch(`http://localhost:5501/plants/${plantId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch plant details");
        }
        const plant = await response.json();
        console.log('Fetched plant details:', plant); // Debugging log
        renderPlantDetails(plant);
    } catch (error) {
        console.error("Error fetching plant details:", error);
    }
};


//render plant details
const renderPlantDetails = (plant) => {
    const plantDetailsSection = document.getElementById('plant-details');
    plantDetailsSection.innerHTML = `
        <img src="${plant.image_url}" alt="${plant.name}">
        <h2>${plant.name}</h2>
        <p>${plant.description}</p>
        <p>Price: $${plant.price}</p>
        <p>In Stock: ${plant.quantity}</p>
        <button class="add-to-cart" data-id="${plant.plantId}">Add to Cart</button>
    `;

    // Add event listener to "Add to Cart" button
    document.querySelector('.add-to-cart').addEventListener('click', (event) => {
        console.log('Add to Cart button clicked'); // Debugging log
        addToCart(event);
    });
};

const addToCart = (event) => {
    const plantId = event.target.getAttribute('data-id');
    console.log(`Plant ID ${plantId} added to cart`);

    fetch("http://localhost:5501/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId: plantId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        console.log('Item added to cart:', data);
        showConfirmationMessage('Plant added to cart successfully!');
    })
    .catch(error => {
        console.error('Error adding item to cart:', error);
        showConfirmationMessage('Failed to add plant to cart.');
    });
};

const showConfirmationMessage = (message) => {
    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.textContent = message;
    confirmationMessage.style.display = 'block';
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 3000); // Hide the message after 3 seconds
};

const plantId = getPlantIdFromUrl();
if (plantId) {
    fetchPlantDetails(plantId);
}