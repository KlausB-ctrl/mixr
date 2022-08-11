// Retrieve the term to be searched from session storage
var searchTerm = sessionStorage.getItem("searchTerm");

// Begin fetching from API
const startSearch = (term) => {
    if(searchTerm === null) {return} // If nothing has been searched, display the default HTML

    // Check if user is looking for a random cocktail, or a specific search term
    var url = term === "random" ? 
        "https://www.thecocktaildb.com/api/json/v1/1/random.php" : 
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`;
    //    
    // Fetch data from relevant URL
    fetch(url)
    .then((response) => {
        return response.json();
    }).then((data) => {
        sessionStorage.setItem("data", data);
        console.log(data);
        showResults(data);
    })
    .catch((error) => {
        document.getElementById("subtitle").innerText=`No results for "${term}" found.`;
    });
    //
    // Find cocktails with search term as an ingredient
    ingredientSearch(term);
};

const ingredientSearch = (term) => {
    var ingredientURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${term}`;
    fetch(ingredientURL)
            .then((response) => {
                return response.json();
            }).then((data) => {
                sessionStorage.setItem("data", data);
                ingredientResults(data);
    })
    .catch((error) => {
        document.getElementById("ingredient-subtitle").innerText=`No ingredient results for "${term}" found.`
    });
}

// Function to show results to user
const showResults = (data) => {
    // Change title to show what user searched
    document.getElementById("title").innerHTML = `Search Results for <em>"${searchTerm}"</em>`;
    createResults(data);
};

const createResults = (drinkList) => {
    var results = document.getElementById("search-results");
    document.getElementById("drink-subtitle").style.visibility="visible";
    for(let i = 0; i < drinkList.drinks.length; i++) {
        let newResult = document.createElement("div");
        newResult.classList.add("result");

        // Create the unordered list of steps
        let stepArray = drinkList.drinks[i].strInstructions.match( /[^\.!\?]+[\.!\?]+/g );


        let stepString =  "";
           
        if(stepArray != null) {
            for(let j = 0; j < stepArray.length; j++) {
                if(j === 0) {stepArray[j] = " " + stepArray[j]};
                stepString+= "<li>" + stepArray[j] + "</li>";
            }
        }

        else {
            stepString = drinkList.drinks[i].strInstructions;
        }
        //
        
        // Create the unordered list of ingredients
        let ingredientArray = [
            drinkList.drinks[i].strIngredient1, drinkList.drinks[i].strIngredient2, drinkList.drinks[i].strIngredient3, 
            drinkList.drinks[i].strIngredient4, drinkList.drinks[i].strIngredient5, drinkList.drinks[i].strIngredient6, 
            drinkList.drinks[i].strIngredient7, drinkList.drinks[i].strIngredient8, drinkList.drinks[i].strIngredient9, 
            drinkList.drinks[i].strIngredient10, drinkList.drinks[i].strIngredient11, drinkList.drinks[i].strIngredient12, 
            drinkList.drinks[i].strIngredient13, drinkList.drinks[i].strIngredient14, drinkList.drinks[i].strIngredient15 
        ];

        let ingredientString = "";
        for(let j = 0; j < ingredientArray.length; j++) {
            if(ingredientArray[j] === null || ingredientArray[j] == "") {break};
            ingredientString+= "<li>" + ingredientArray[j] + "</li>";
        };
        // 

        // Add the complete result entry
        newResult.innerHTML = (`
            <img src="${drinkList.drinks[i].strDrinkThumb}">
            <h1>${drinkList.drinks[i].strDrink}</h1>
            <div class="steps">
            <h2>Steps</h2>
                <ul>
                    ${stepString}
                </ul>
            </div>
            <div class="ingredients">
            <h2>Ingredients</h2>
                <ul>
                    ${ingredientString}
                </ul>
            </div>
        `);
        results.appendChild(newResult);
        //

        // Add number of results
        document.getElementById("subtitle").innerHTML = (`
            ${drinkList.drinks.length} results found.
        `);
    };
}

const ingredientResults = (drinkList) => {
    var results = document.getElementById("ingredient-results");
    document.getElementById("ingredient-subtitle").innerText=`Drinks made with "${searchTerm}".`
    for(let i = 0; i < drinkList.drinks.length; i++) {
        let newResult = document.createElement("div");
        newResult.classList.add("mini-result");

        // Add the complete result entry
        newResult.innerHTML = (`
            <img src="${drinkList.drinks[i].strDrinkThumb}">
            <h5>${drinkList.drinks[i].strDrink}</h5>
        `);
        results.appendChild(newResult);
        //

        // Add number of results
        document.getElementById("ingredients-found").innerHTML = (`
            ${drinkList.drinks.length} results found.
        `);

    };
    makeResultsClickable();
}
document.getElementById("search-button").addEventListener("click", () => {
    searchTerm = sessionStorage.setItem("searchTerm", document.getElementById("search-bar").value);
});

document.getElementById("random-button").addEventListener("click", () => {
    searchTerm = sessionStorage.setItem("searchTerm", "random");
});

const makeResultsClickable = () => {
    let miniResults = document.getElementsByClassName("mini-result");
    for(let result of miniResults) {

        result.addEventListener("click", function (e) {
                sessionStorage.setItem("searchTerm", this.innerText);
                location.reload();
        });
    }
};

window.onLoad(startSearch(searchTerm));