document.getElementById('randomCocktailBtn').addEventListener('click', getRandomCocktail);
document.getElementById('selectCocktailBtn').addEventListener('click', showCocktailSearch);
document.getElementById('favouritesBtn').addEventListener('click', showFavourites);

function showLoadingBar() {
    document.getElementById('loadingBar').style.display = 'block';
}

function hideLoadingBar() {
    document.getElementById('loadingBar').style.display = 'none';
}

async function getRandomCocktail() {
    showLoadingBar();
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 3-second delay
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const cocktail = data.drinks[0];
        displayCocktail(cocktail);
    } catch (error) {
        console.error('Failed to fetch random cocktail:', error);
        alert('Failed to fetch random cocktail. Please try again later.');
    } finally {
        hideLoadingBar();
    }
}

function showCocktailSearch() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <input type="text" id="cocktailSearchInput" placeholder="Enter the name of the cocktail">
        <ul id="suggestionsList"></ul>
    `;
    document.getElementById('cocktailSearchInput').addEventListener('input', fetchCocktailSuggestions);
}
async function fetchCocktailSuggestions(event) {
    const query = event.target.value;
    if (query.length > 2) {
        showLoadingBar();
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.drinks) {
                displaySuggestions(data.drinks);
            } else {
                alert('Cocktail not found');
                document.getElementById('suggestionsList').innerHTML = '';
            }
        } catch (error) {
            console.error('Failed to fetch cocktail:', error);
            alert('Failed to fetch cocktail. Please try again later.');
        } finally {
            hideLoadingBar();
        }
    } else {
        document.getElementById('suggestionsList').innerHTML = '';
    }
}

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    suggestions.forEach(cocktail => {
        const listItem = document.createElement('li');
        listItem.textContent = cocktail.strDrink;
        listItem.addEventListener('click', () => selectCocktail(cocktail));
        suggestionsList.appendChild(listItem);
    });
}

async function selectCocktail(cocktail) {
    showLoadingBar();
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`);
        const data = await response.json();
        displayCocktail(data.drinks[0]);
    } finally {
        hideLoadingBar();
    }
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
    showLoadingBar();
    try {
       
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const cocktail = data.drinks[0];
        displayCocktail(cocktail);
    } finally {
        hideLoadingBar();
    }
}

function removeFromFavourites(id) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites = favourites.filter(fav => fav.id !== id);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    showFavourites();
}

function displayCocktails(cocktails) {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Cocktails</h2>';
    cocktails.forEach(cocktail => {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            if (cocktail[`strIngredient${i}`]) {
                ingredients.push(`${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`] || ''}`);
            }
        }
        const cocktailDiv = document.createElement('div');
        cocktailDiv.innerHTML = `
            <h3>${cocktail.strDrink}</h3>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width: 100%; max-width: 300px; border-radius: 10px;">
            <p><strong>ID:</strong> ${cocktail.idDrink}</p>
            <p><strong>Category:</strong> ${cocktail.strCategory}</p>
            <p><strong>Ingredients:</strong></p>
            <div class="ingredients">
                ${ingredients.map(ingredient => `<div class="ingredient">${ingredient}</div>`).join('')}
            </div>
            <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
            <button onclick="addToFavourites('${cocktail.idDrink}', '${cocktail.strDrink}')">Add to Favourites</button>
        `;
        content.appendChild(cocktailDiv);
    });
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

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-2ea125c1a47d4b3bb6d0b13a2f56e5fa'
});