let rowData = document.getElementById("rowData");
let emptySearch = document.getElementById("emptySearch"); 



/////////////////////////////////////start nav////////////////////

function toggleNav() {
    let boxWidth = $(".nav .navCont").outerWidth();
    if ($(".nav").css("left") == "0px") {
        $(".nav").animate({ left: -boxWidth }, 500);
        $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");
        $(".navLinks li").animate({ top: 300 }, 500);
    } else {
        $(".nav").animate({ left: 0 }, 500);
        $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");
        $(".navLinks li").each((i, el) => $(el).animate({ top: 0 }, (i + 5) * 100));
    }
}
$(".nav i.open-close-icon").click(toggleNav);

/////////////////////////////////////end nav////////////////////

/////////////////////////////////////start meals////////////////////

function displayMeals(arr) {
    let limitedMeals = arr.slice(0, 20);
    let Box = limitedMeals.map(meal => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="Meals">
                <div class="mealLayer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>
    `).join('');
    $('#rowData').html(Box);
}

async function getMealDetails(mealID) {
    $('#rowData').empty();
    $(".loading").fadeIn(500);
    $('#emptySearch').empty();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();
    displayMealDetails(response.meals[0]);
    $(".loading").fadeOut(500);
}

 function displayMealDetails(meal) {
                $('#emptySearch').empty();
                let ingredientsList = '';
                for (let i = 1; i <= 20; i++) {
                    if (meal[`strIngredient${i}`]) {
                        ingredientsList += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
                    }
                }
                let tagsArray = meal.strTags?.split(",") || [];
                let tagsList = tagsArray.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join('');
                
                let mealDetailBox = `
                    <div class="col-md-4">
                        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
                        <h2>${meal.strMeal}</h2>
                    </div>
                    <div class="col-md-8">
                        <h2>Instructions</h2>
                        <p>${meal.strInstructions}</p>
                        <h3><span class="fw-bolder">Area:</span> ${meal.strArea}</h3>
                        <h3><span class="fw-bolder">Category:</span> ${meal.strCategory}</h3>
                        <h3>Recipes:</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredientsList}</ul>
                        <h3>Tags:</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsList}</ul>
                        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>
                `;

                $('#rowData').html(mealDetailBox);
            }

/////////////////////////////////////end meals////////////////////

/////////////////////////////////////start search////////////////////


$("#searchLink").click(function () {
    emptySearch.innerHTML = `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`;
    $("#rowData").html("");
    toggleNav();
});

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow", "visible")
    })
});

async function searchByName(name) {
    rowData.innerHTML = "";
    $(".loading").fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    response = await response.json();
    if (response.meals === null) {
        $(".loading").fadeOut(500);
        rowData.innerHTML = `<h2 class="text-center text-danger">No Meals Found</h2>`;
    } else {
        displayMeals(response.meals);
        $(".loading").fadeOut(500);
    }
}
async function searchByFLetter(letter) {
    rowData.innerHTML = "";
    $(".loading").fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    response = await response.json();
    if (response.meals === null) {
        $(".loading").fadeOut(500);
        rowData.innerHTML = `<h2 class="text-center text-danger">No Meals Found</h2>`;
    } else {
        displayMeals(response.meals);
        $(".loading").fadeOut(500);
    }
}

/////////////////////////////////////end search////////////////////

/////////////////////////////////////start categories////////////////////

document.getElementById("categoriesLink").addEventListener("click", async () => {
    document.getElementById("rowData").innerHTML = "";
    $(".loading").fadeIn(500);
    $("#emptySearch").empty();   
    toggleNav()
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let data = await response.json();
    displayCategories(data.categories);
    $(".loading").fadeOut(500);
});

 function displayCategories(arr) {
    let Box = "";
    arr.forEach(item => {
        Box += `
            <div class="col-md-3">
                <div onclick="getCategoryMeals('${item.strCategory}')" class="meal position-relative overflow-hidden rounded-2 pointer">
                    <img class="w-100" src="${item.strCategoryThumb}" alt="${item.strCategory}">
                    <div class="mealLayer position-absolute text-center text-black p-2">
                        <h3>${item.strCategory}</h3>
                        <p>${item.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            </div>`;
    });
    document.getElementById("rowData").innerHTML = Box;
}

async function getCategoryMeals(category) {
    document.getElementById("rowData").innerHTML = "";
    $(".loading").fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    displayMeals(data.meals.slice(0, 20));
    $(".loading").fadeOut(500);
}

/////////////////////////////////////end category////////////////////

/////////////////////////////////////start area////////////////////

document.getElementById("areaLink").addEventListener("click",async () => {
    rowData.innerHTML = ""
    $(".loading").fadeIn(500)
    $("#emptySearch").empty();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    response = await response.json()
    displayArea(response.meals)
    $(".loading").fadeOut(500)
    toggleNav();
});

function displayArea(arr) {
    let Box = "";
    for (let i = 0; i < arr.length; i++) {
        Box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }
    rowData.innerHTML = Box
}

async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".loading").fadeIn(500)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".loading").fadeOut(500)
}

/////////////////////////////////////end area////////////////////

/////////////////////////////////////start ingredients////////////////////

$("#ingredientsLink").on("click", async function () {
    $("#rowData").empty();
    $(".loading").fadeIn(500);
    $("#emptySearch").empty();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
    displayIngredients(response.meals.slice(0, 20));
    $(".loading").fadeOut(500);
    toggleNav();
});

function displayIngredients(arr) {
    let Box = "";
    for (let i = 0; i < arr.length; i++) {
        Box += `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${arr[i].strIngredient}</h3>
                <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
        `;
    }
    $("#rowData").html(Box);
}

async function getIngredientsMeals(ingredients) {
    $("#rowData").empty();
    $(".loading").fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
    $(".loading").fadeOut(500);
}

/////////////////////////////////////end ingredients////////////////////

/////////////////////////////////////start contact////////////////////

$(document).ready(function() {
    $('#contactsLink').on('click', function() {
        $("#emptySearch").empty();
                const rowData = $('#rowData');
        rowData.html(`
            <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
                <div class="container w-75 text-center">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <input id="nameInput" onfocus="clearAlert('name')" onkeyup="validateInput('name')" type="text" class="form-control" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger mt-2 d-none"></div>
                        </div>
                        <div class="col-md-6">
                            <input id="emailInput" onfocus="clearAlert('email')" onkeyup="validateInput('email')" type="email" class="form-control" placeholder="Enter Your Email">
                            <div id="emailAlert" class="alert alert-danger mt-2 d-none"></div>
                        </div>
                        <div class="col-md-6">
                            <input id="phoneInput" onfocus="clearAlert('phone')" onkeyup="validateInput('phone')" type="text" class="form-control" placeholder="Enter Your Phone">
                            <div id="phoneAlert" class="alert alert-danger mt-2 d-none"></div>
                        </div>
                        <div class="col-md-6">
                            <input id="ageInput" onfocus="clearAlert('age')" onkeyup="validateInput('age')" type="number" class="form-control" placeholder="Enter Your Age">
                            <div id="ageAlert" class="alert alert-danger mt-2 d-none"></div>
                        </div>
                        <div class="col-md-6">
                            <input id="passwordInput" onfocus="clearAlert('password')" onkeyup="validateInput('password')" type="password" class="form-control" placeholder="Enter Your Password">
                            <div id="passwordAlert" class="alert alert-danger mt-2 d-none"></div>
                        </div>
                        <div class="col-md-6">
                            <input id="repasswordInput" onfocus="clearAlert('repassword')" onkeyup="validateInput('repassword')" type="password" class="form-control" placeholder="Repassword">
                            <div id="repasswordAlert" class="alert alert-danger mt-2 d-none"></div>
                        </div>
                    </div>
                    <button id="submitBtn" disabled class="px-2 mt-3"><span>Submit</span></button>
                </div>
            </div>`);
        submitBtn = $('#submitBtn');
        toggleNav()
    });
});

function validateInput(field) {
    const validations = {
        name: { regex: /^[a-zA-Z ]+$/, message: "Special characters and numbers not allowed" },
        email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email not valid *example@yyy.zzz*" },
        phone: { regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, message: "Enter valid Phone Number" },
        age: { regex: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/, message: "Enter valid age" },
        password: { regex: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/, message: "Enter valid password *Minimum eight characters, at least one letter and one number*" },
        repassword: { 
            validate: () => $('#repasswordInput').val() === $('#passwordInput').val(), 
            message: "Passwords do not match" 
        }
    };

    const currentInput = $(`#${field}Input`);
    const alertDiv = $(`#${field}Alert`);
    let message = "";

    if (validations[field].validate) {
        message = validations[field].validate() ? "" : validations[field].message;
    } else {
        message = validations[field].regex.test(currentInput.val()) ? "" : validations[field].message;
    }

    if (message) {
        alertDiv.text(message).removeClass('d-none');
    } else {
        alertDiv.addClass('d-none');
    }

    let allValid = true;
    for (const key in validations) {
        if (key === 'repassword' && !validations[key].validate()) {
            allValid = false;
            break;
        } else if (!validations[key].regex.test($(`#${key}Input`).val())) {
            allValid = false;
            break;
        }
    }
    
    $('#submitBtn').prop('disabled', !allValid);
}

function clearAlert(field) {
    $(`#${field}Alert`).addClass('d-none');
}

/////////////////////////////////////end contact////////////////////
