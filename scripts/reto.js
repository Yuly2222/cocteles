
document.getElementById('randomCocktailBtn').addEventListener('click', getRandomCocktail);
document.getElementById('selectCocktailBtn').addEventListener('click', selectCocktail);
document.getElementById('favouritesBtn').addEventListener('click', showFavourites);

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
            listItem.textContent = fav.name;
            list.appendChild(listItem);
        });
        content.appendChild(list);
    }
}

function displayCocktail(cocktail) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>${cocktail.strDrink}</h2>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width: 100%; max-width: 300px;">
        <p>${cocktail.strInstructions}</p>
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