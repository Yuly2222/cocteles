
document.getElementById('randomCocktailBtn').addEventListener('click', getRandomCocktail);
document.getElementById('selectCocktailBtn').addEventListener('click', selectCocktail);
document.getElementById('favouritesBtn').addEventListener('click', showFavourites);

// Función para mostrar y ocultar el loader
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Modificar la función getRandomCocktail para incluir el loader
function getRandomCocktail() {
    showLoader(); // Mostrar el loader antes de hacer la petición
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const cocktail = data.drinks[0];
            displayCocktail(cocktail);
        })
        .catch(error => alert('Error fetching cocktail!'))
        .finally(() => hideLoader()); // Ocultar el loader cuando termina la petición
}

// Modificar la función selectCocktail para incluir el loader
function selectCocktail() {
    const cocktailName = prompt('Enter the name of the cocktail:');
    if (cocktailName) {
        showLoader();
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks) {
                    const cocktail = data.drinks[0];
                    displayCocktail(cocktail);
                } else {
                    alert('Cocktail not found');
                }
            })
            .catch(error => alert('Error fetching cocktail!'))
            .finally(() => hideLoader());
    }
}

// Modificar la función showFavouriteDetails para incluir el loader
function showFavouriteDetails(id) {
    showLoader();
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const cocktail = data.drinks[0];
            displayCocktail(cocktail);
        })
        .catch(error => alert('Error fetching cocktail details!'))
        .finally(() => hideLoader());
}


function getRandomCocktail() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const cocktail = data.drinks[0];
            displayCocktail(cocktail);
        });
}

function selectCocktail() {
    const cocktailName = prompt('Enter the name of the cocktail:');
    if (cocktailName) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks) {
                    const cocktail = data.drinks[0];
                    displayCocktail(cocktail);
                } else {
                    alert('Cocktail not found');
                }
            });
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

function showFavouriteDetails(id) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const cocktail = data.drinks[0];
            displayCocktail(cocktail);
        });
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
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width: 100%; max-width: 300px;">
        <p><strong>ID:</strong> ${cocktail.idDrink}</p>
        <p><strong>Category:</strong> ${cocktail.strCategory}</p>
        <p><strong>Ingredients:</strong></p>
        <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
        <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
        <button onclick="addToFavourites('${cocktail.idDrink}', '${cocktail.strDrink}')">Add to Favourites</button>
    `;
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