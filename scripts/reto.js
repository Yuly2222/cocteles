
document.getElementById('randomCocktailBtn').addEventListener('click', getRandomCocktail);
document.getElementById('selectCocktailBtn').addEventListener('click', selectCocktail);
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
        await new Promise(resolve => setTimeout(resolve, 3000)); // Add a 3-second delay
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await response.json();
        const cocktail = data.drinks[0];
        displayCocktail(cocktail);
    } finally {
        hideLoadingBar();
    }
}       

async function selectCocktail() {
    const cocktailName = prompt('Enter the name of the cocktail:');

    if (!cocktailName) {
        alert('Please enter a cocktail name.');
        return;
    }

    showLoader();

    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`);

        if (!response.ok) {
            throw new Error('Failed to fetch cocktails. Please try again later.');
        }

        const data = await response.json();

        if (!data.drinks) {
            throw new Error('No cocktails found. Try another name.');
        }

        // Si hay varios cócteles, mostramos una lista en lugar de uno solo
        displayCocktailList(data.drinks);
    } catch (error) {
        alert(error.message);
    } finally {
        hideLoader();
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
        await new Promise(resolve => setTimeout(resolve, 3000)); // Add a 3-second delay
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

function displayCocktailList(cocktails) {
    const content = document.getElementById('content');
    content.innerHTML = `<h2>Select a Cocktail</h2>`;

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';

    cocktails.forEach(cocktail => {
        const listItem = document.createElement('li');
        listItem.style.cursor = 'pointer';
        listItem.style.padding = '10px';
        listItem.style.margin = '5px 0';
        listItem.style.borderRadius = '8px';
        listItem.style.backgroundColor = '#444';
        listItem.style.color = '#fff';
        listItem.style.textAlign = 'center';
        listItem.style.transition = 'background-color 0.3s';

        listItem.innerHTML = `${cocktail.strDrink}`;
        listItem.addEventListener('click', () => displayCocktail(cocktail));

        listItem.addEventListener('mouseover', () => {
            listItem.style.backgroundColor = '#ff6f61';
        });

        listItem.addEventListener('mouseout', () => {
            listItem.style.backgroundColor = '#444';
        });

        list.appendChild(listItem);
    });

    content.appendChild(list);
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