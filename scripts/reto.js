document.getElementById('randomCocktailBtn').addEventListener('click', getRandomCocktail);
document.getElementById('selectCocktailBtn').addEventListener('click', selectCocktail);
document.getElementById('favouritesBtn').addEventListener('click', showFavourites);
document.addEventListener("click", function(event) {
    if (event.target && event.target.id === "addToFavBtn") {
        const id = event.target.getAttribute("data-id");
        const name = event.target.getAttribute("data-name").replace(/&apos;/g, "'");
        addToFavourites(id, name);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("cocktailSearch");
    const resultsList = document.getElementById("searchResults");

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim();
        if (query.length < 3) {
            resultsList.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();

            resultsList.innerHTML = "";

            if (data.drinks) {
                data.drinks.forEach(drink => {
                    const li = document.createElement("li");
                    li.textContent = drink.strDrink;
                    li.addEventListener("click", () => displayCocktail(drink));
                    resultsList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Error fetching cocktail suggestions:", error);
        }
    });
});

let isLoading = false;

function showLoadingBar() {
    if (!isLoading) {
        const loadingBar = document.getElementById('loadingBar');
        loadingBar.style.display = 'block';
        isLoading = true;
    }
}

function hideLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.style.display = 'none';
    isLoading = false;
}

async function getRandomCocktail() {
    if (isLoading) return;
    showLoadingBar();
    try {
        // Simulate delay for fetch processing
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await response.json();
        const cocktail = data.drinks[0];
        displayCocktail(cocktail);
    } catch (error) {
        console.error('Error fetching random cocktail:', error);
        hideLoadingBar();
    }
}
async function selectCocktail() {
    // Hide the current displayed cocktail and show the search input
    document.getElementById('content').innerHTML = `
            <input type="text" id="cocktailSearch" placeholder="Search for a cocktail..." autocomplete="off">
            <ul id="searchResults"></ul>
    `;

    // Reattach event listener for live search
    const searchInput = document.getElementById("cocktailSearch");
    const resultsList = document.getElementById("searchResults");

    searchInput.addEventListener("input", async function () {
        const query = searchInput.value.trim();
        if (query.length < 3) {
            resultsList.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();

            resultsList.innerHTML = "";

            if (data.drinks) {
                data.drinks.forEach(drink => {
                    const li = document.createElement("li");
                    li.textContent = drink.strDrink;
                    li.addEventListener("click", () => displayCocktail(drink));
                    resultsList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Error fetching cocktail suggestions:", error);
        }
    });
}

function showFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Favourites</h2>';
    if (favourites.length === 0) {
        content.innerHTML += '<p>No favourites yet.</p>';
    } else {
        const list = document.createElement('ul');
        favourites.forEach(fav => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${fav.name}
                <button onclick="showFavouriteDetails('${fav.id}')">Show Details</button>
                <button onclick="removeFromFavourites('${fav.id}')">Remove</button>
            `;
            list.appendChild(listItem);
        });
        content.appendChild(list);
    }
}

async function showFavouriteDetails(id) {
    if (isLoading) return;
    showLoadingBar();
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const cocktail = data.drinks[0];
        displayCocktail(cocktail);
    } catch (error) {
        console.error('Error fetching cocktail details:', error);
        hideLoadingBar();
    }
}

function removeFromFavourites(id) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites = favourites.filter(fav => fav.id !== id);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    showFavourites();
}

function displayCocktail(cocktail) {
    const content = document.getElementById('content');
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        if (cocktail[`strIngredient${i}`]) {
            ingredients.push(`${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`] || ''}`);
        }
    }
    content.innerHTML = `
        <h2>${cocktail.strDrink}</h2>
        <img id="cocktailImage" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width: 100%; max-width: 300px;">
        <p><strong>ID:</strong> ${cocktail.idDrink}</p>
        <p><strong>Category:</strong> ${cocktail.strCategory}</p>
        <p><strong>Ingredients:</strong></p>
        <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
        <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
        <button id="addToFavBtn" data-id="${cocktail.idDrink}" data-name="${cocktail.strDrink.replace(/'/g, "&apos;")}">
            Add to Favourites
        </button>
    `;

    const img = document.getElementById('cocktailImage');
    if (img) {
        img.onload = () => hideLoadingBar();
        img.onerror = () => hideLoadingBar();
    } else {
        hideLoadingBar();
    }
}

function addToFavourites(id, name) {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    if (!favourites.some(fav => fav.id === id)) {
        favourites.push({ id, name });
        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert('Added to favourites');
    } else {
        alert('Already in favourites');
    }
}
