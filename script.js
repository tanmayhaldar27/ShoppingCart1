
const productSearchBar = document.getElementById('search-input');
const categoryBtns = document.querySelectorAll('.btn.category-btn');
const productCheckbox = document.querySelectorAll('.filter-checkbox');
const filterBtn = document.getElementById('filter-btn');
const ratingSlider = document.getElementById('rating-slider');
const priceCheckbox = document.querySelectorAll('.price-checkbox');
const loginButton = document.getElementById('login-btn');
const signupButton = document.getElementById('signup-btn');
const homeSignupButtonDiv = document.getElementById('home-nav-btn');
const addToCartBtn = document.querySelectorAll('.btn.add-to-cart-btn');
const cartPageDiv = document.getElementById('cart-page');
const paymentBtn = document.getElementById('payment-btn');

const fName = document.getElementById('fname');
const lName = document.getElementById('lname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signupForm = document.getElementById('signupBtn');
const messageAlert = document.getElementById('message');
const loginForm = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logout');
const editProfileBtn = document.getElementById('save-info');
const profileLink = document.getElementById('profile-btn');
const updatePasswordBtn = document.getElementById('save-password');
const oldPassword = document.getElementById('old-password');
const newPassword = document.getElementById('new-password');
const updatePassword = document.getElementById('confirm-password');

let cartCardArray = [];
let cartArray = [];
let currentCategoryBtn = [];
let ratingValue = 1;
let productArray = [];

const repositoryName = "Shopping-Cart-1";

const api = "https://fakestoreapi.com/products";

function getRandomColor(){
    const colors = ['red','green','blue','black','white'];
    return colors[Math.floor((Math.random() * colors.length))];
}
function getRandomSize(){
    const sizes = ['S','L','M','XL'];
    return sizes[Math.floor((Math.random() * sizes.length))];
}

async function getProduct(){
    try {
        const product = await fetch(api);
        const data = await product.json();
        data.forEach((ele)=>{
            if(ele.category !== 'electronics' && ele.category !== 'jewelery'){
                ele = {
                    ...ele,
                    ...{color:getRandomColor()},
                    ...{size:getRandomSize()}
                }
            }
            productArray.push(ele);
            
        })
    }catch(Error){
        console.error("Failed to load data",Error);
    }
}



function checkItemFilter(data,filterChecklist,key){
    if(filterChecklist.length === 0){
        return data; 
    }
    return data.filter((product)=>{
        let rating = Math.floor(product.rating['rate']);
        if(product.category !== 'electronics' && product.category !== 'jewelery'){
            let size = product[key];
            if(filterChecklist.includes(`${size}`) || filterChecklist.includes(`${rating}`)){
                return product;    
            }
        }else{
            // console.log(rating);
            // electronics and jewelery don't have size and color that's why it will 
            // take rating as a filter
            if(filterChecklist.includes(`${rating}`)){
                return product;
            }
        }
    })
}
function checkByPriceRange(data,priceChecklist){
    if(priceChecklist.length === 0){
        return data;
    }
    return data.filter((product)=>{
        return priceChecklist.some((ele)=>isInPriceRange(ele,product.price))
    })
}
function filterByChecklists(data,filterChecklist,priceChecklist){
    /**
     * while data filter through size, color and price range bydefault they consider the rating
     * Note: while filtering also set the rating of the product
     */
    data = checkItemFilter(data,filterChecklist,"size");
    data = checkItemFilter(data,filterChecklist,"color");
    data = checkByPriceRange(data,priceChecklist);
    if(data.length === 0){
        showProducts(productArray);
    }
    showProducts(data);
}
function isInPriceRange(ele,price){
    if(ele >= 0 && ele <= 25 && price <= 25){
        return true;
    }else if(ele >= 25 && ele <= 50 && price >= 25 && price <= 50){
        return true;
    }else if(ele >= 50 && ele <= 100 && price >= 50 && price <= 100){
        return true;
    }else if(ele >= 100 && price >= 100){
        return true;
    }
    return false;
}

function searchProduct(data){
    let searchText = productSearchBar.value.trim().toLowerCase();
    // m e n s
    // Mens Casual Premium Slim Fit T-Shirts
    if(searchText === ''){
        showProducts(data);
    }
    else{
        data = data.filter((product)=>{
        const itemName = product.title.trim().toLowerCase();
            if (itemName.includes(searchText) && currentCategoryBtn[0].value === product.category) {
                return product;
            }
            if (itemName.includes(searchText) && currentCategoryBtn[0].value === '') {
                return product;
            } 
        })   
    }
    showProducts(data);
}
function filterByCategory(data,category){
    let searchText = category.trim().toLowerCase();
    if(searchText === ''){
        showProducts(data);
    }
    else{
        data = data.filter((product)=>{
        const itemName = product.category.trim().toLowerCase();
            return (itemName === searchText)
        })   
    }
    showProducts(data);
}
function setRating(productRatingDiv,rate){
    let starCount = 0;
    for(starCount; starCount < rate;  starCount++){
        const solidStar = document.createElement('span');
        solidStar.setAttribute('class','fa-solid fa-star');
        productRatingDiv.append(solidStar);
    }
    // console.log(starCount);
    if(starCount < 5){
        while(starCount !== 5){
            const regularStar = document.createElement('span');
            regularStar.setAttribute('class','fa-regular fa-star');
            productRatingDiv.append(regularStar);
            starCount++;
        }
    }
}

function addProductToShop(id, productContainer,title, description, image, size, color, price, category, rate, numberOfRatings){
    //product card
    const productCard = document.createElement("div");
    productCard.setAttribute("class", "product-card");

    const productImageDiv = document.createElement("div");
    productImageDiv.setAttribute("class", "product-image");
    const img = document.createElement("img");
    img.setAttribute("src", image);
    img.setAttribute("alt", "pic");
    productImageDiv.appendChild(img);

    const productInfo = document.createElement("div");
    productInfo.setAttribute("class", "product-info");

    // title and description of the product
    const heading = document.createElement("h3");
    heading.setAttribute("class", "product-title");
    heading.innerHTML = title;
    const p = document.createElement("p");
    p.setAttribute("class", "product-description");
    p.innerHTML = description;
    productInfo.append(heading, p);

    // rating div created
    const productRatingDiv = document.createElement("div");
    productRatingDiv.setAttribute("class", "product-rating");
    setRating(productRatingDiv, rate);
    const ratingCount = document.createElement("span");
    ratingCount.setAttribute("class", "rating-count");
    ratingCount.innerHTML = `(${numberOfRatings})`;
    productRatingDiv.append(ratingCount);

    // product feature
    const productDetails = document.createElement("div");
    const productColor = document.createElement("span");
    const productSize = document.createElement("span");

    if(category !== 'electronics' && category !== 'jewelery'){
        productColor.setAttribute("class", "product-color");
        productColor.innerHTML = `Color: ${color}`;
        productSize.setAttribute("class", "product-size");
        productSize.innerHTML = `Size: ${size}`;
    }
    // product price and button
    const productPrice = document.createElement("p");
    productPrice.setAttribute("class", "product-price");
    productPrice.innerHTML = `$${price}`;

    const cartBtn = document.createElement("button");
    // cartBtn.setAttribute("value", "Add to Cart")
    cartBtn.setAttribute("class", "btn add-to-cart-btn");
    cartBtn.setAttribute("id",`${id}`);
    cartBtn.innerText = "Add to Cart";

    productDetails.append(productColor, productSize);
    productInfo.append(productRatingDiv, productDetails, productPrice, cartBtn);
    productCard.append(productImageDiv, productInfo);
    productContainer.append(productCard);

    /**
     * add product to localStorage in user cart
     * 1. console log each product while triger a event listener
     * 2. get all details of the current user from localStorage
     * 3. verify the current user
     * 4. add product into cart
     */
    let user = getUserSession();
    let userList = getUsers();
    let userFromStorage = isUserPresent(userList,user);
    if(window.location.pathname !== '/cart.html' && user.length !== 0 && userFromStorage !== '') {
        let p = document.querySelectorAll('.btn.add-to-cart-btn');
        addToCart(p,userList,userFromStorage);
    }
    if(window.location.pathname === '/cart.html' && user.length !== 0 && userFromStorage !== ''){
        let p = document.querySelectorAll('.btn.add-to-cart-btn');
        cartBtn.innerText = 'Remove From Cart';
        removeFromCart(p,userList,userFromStorage);
    }
    
}
function addToCart(cartBtn,userList,userFromStorage){
    cartBtn.forEach((btn)=>{
        btn.addEventListener('click',(event)=>{
            let currentId = parseInt(event.target.id)
            let currentUserCart = userFromStorage['cart'];
            if(!productAlreadyInCart(currentUserCart,currentId)){
                btn.innerText = 'Added✔️';
                btn.disabled = true;
                currentUserCart.push(getCurrentProduct(currentId));
                saveUser(userList);
            }else{
                alert("Item already in cart");
                return;
            }
        })
    })
    
}

function getTotalPrice(cartItem){
    let totalPrice = 0;
    cartItem.forEach((item)=>{
        totalPrice += parseInt(item['price']);
    })
    return totalPrice;
}

function removeFromCart(cartBtn,userList,userFromStorage){
    let currentUserCart = userFromStorage['cart']; // this need to be a functio
    cartBtn.forEach((btn)=>{
        btn.addEventListener('click',(event)=>{
            event.preventDefault();
            for(let i = 0; i < currentUserCart.length; i++){
                if(currentUserCart[i].id === parseInt(event.target.id)){
                    currentUserCart.splice(i, 1);
                }
            }
            saveUser(userList);
            window.location.href = '';
        })
    })
}



function productAlreadyInCart(currentUserCart,id){
    for(let i = 0; i < currentUserCart.length; i++){
        if(currentUserCart[i].id === id){
            return true;
        }
    }
    return false;
}
function getCurrentProduct(id){
    let currentProduct = '';
    productArray.forEach((product)=>{
        if(product.id === parseInt(id)){
            currentProduct = product;
        }
    })
    return currentProduct;
}

function showProducts(data){
    const productContainer = document.getElementById('filtered-products');
    productContainer.innerHTML = '';
    data.forEach((product)=>{
        if(product.id === '' || product.title === '' || product.description === '' ||
            product.image === '' || product.price === '' || product.category === ''){
            alert('All field should be Mandatory')
        }
        const id = product.id;
        const title = product.title;
        const description = product.description;
        const image = product.image;
        const size = product.size;
        const color = product.color;
        const price = product.price;
        const category = product.category;
        const rate = Math.floor(product.rating['rate']);
        const numberOfRatings = product.rating['count'];
        
        addProductToShop(id, productContainer, title, description, image, size, color, price, category, rate,numberOfRatings)
        
        
    })
}
function generate16ByteToken() {
    // generate random numbers of length 16
    const array = new Uint8Array(16);
    // The Crypto.getRandomValues() method lets us get cryptographically strong random values.
    window.crypto.getRandomValues(array);
    // toString(16) make our string to hexadecimal form
    const token = Array.from(array, byte => byte.toString(16).padStart(2,'0')).join('');
    return token;
}
function getUsers(){
    return JSON.parse(localStorage.getItem('users')) || [];
}
function saveUser(user){
    localStorage.setItem('users',JSON.stringify(user));
}
function saveUserSession(user){
    sessionStorage.setItem('user',JSON.stringify(user));
}
function getUserSession(){
    return JSON.parse(sessionStorage.getItem('user')) || [];
}
function logout(){
    sessionStorage.removeItem('user');
    window.location.href = `/${repositoryName}/index.html`;
}
function showMessage(message){
    messageAlert.style.display = 'block';
    messageAlert.innerText = message;
}
function isUserPresent(userList,currentUser){
    let presentUser = '';
    userList.forEach((user)=>{
        if(user['accessToken'] === currentUser['accessToken'] && user['email'] === currentUser['email']){
            presentUser = user;
        }
    })
    return presentUser;
}
function createProfileNavMenu(currentUser){
    const cartBtn = document.createElement('span');            
    const profileBtn = document.createElement('span');
    const cartIcon = document.createElement('span');
    cartBtn.setAttribute('id','my-cart');
    cartIcon.setAttribute('class','cart-icon');
    cartIcon.setAttribute('id','cart-icon-btn');
    cartIcon.classList.add('fa-solid','fa-cart-shopping');
    cartBtn.innerHTML = 'My Cart';
    cartBtn.append(cartIcon);
    profileBtn.setAttribute('id','profile-btn');
    profileBtn.innerHTML = `${currentUser['fName']} ${currentUser['lName']}`;
    homeSignupButtonDiv.append(cartBtn,profileBtn);

    // add event listner to profile
    profileBtn.addEventListener('click',(event)=>{
        setTimeout(()=>{
            window.location.href = `/${repositoryName}/profile.html`;
        },1000)
    })
    // add event listner to cart
    cartBtn.addEventListener('click',(event)=>{
        setTimeout(()=>{
            window.location.href = `/${repositoryName}/cart.html`;
        })
    })
}
window.onload = function(){
    // user restrictions pagefor cart and profile
    if(window.location.pathname === `/${repositoryName}/cart.html` && !sessionStorage.getItem('user')){
        window.location.href = `/${repositoryName}/index.html`;
    }
    if(window.location.pathname === `/${repositoryName}/profile.html` && !sessionStorage.getItem('user')){
        window.location.href = `/${repositoryName}/index.html`;
    }
    // user restrictions pagefor signup and login while user already loggedin
    if(window.location.pathname === `/${repositoryName}/signup.html` && sessionStorage.getItem('user')){
        window.location.href = `/${repositoryName}/index.html`;
    }
    if(window.location.pathname === `/${repositoryName}/login.html` && sessionStorage.getItem('user')){
        window.location.href = `/${repositoryName}/index.html`;
    }
    // current path is index page
    if(window.location.pathname === `/${repositoryName}/index.html`){
        
        // search product by searching
        productSearchBar.addEventListener('input',(event)=>{
            searchProduct(productArray)
        })
        // fiind product by category
        currentCategoryBtn.push(categoryBtns[0]);
        categoryBtns.forEach((category)=>{
            category.addEventListener('click',(event)=>{
                let currentCategory = event.target;
                console.log(currentCategory);
                if(currentCategoryBtn.length === 2){
                    currentCategory.classList.add('active');
                }else{
                    currentCategory.classList.add('active');
                    currentCategoryBtn[0].classList.remove('active');
                    currentCategoryBtn.pop();
                }
                currentCategoryBtn.push(currentCategory);
                filterByCategory(productArray, currentCategory.value);
            })    
        })
        /**
         * filter product through Color, size, rating and price
         * selectedArray.includes(product.color,product.size,product.rating,)
         */
        ratingSlider.addEventListener('change',()=>{
            ratingValue = ratingSlider.value;
        })        
        filterBtn.addEventListener('click',(event)=>{
            console.log(event.target);
            let filterChecklist = [];
            let priceChecklist = [];
        
            if(productCheckbox.length === 0){
                showProducts(productArray);
                return;
            }
            productCheckbox.forEach((input)=>{
                if(input.checked){
                    filterChecklist.push(input.value);
                }
            })
            priceCheckbox.forEach((input)=>{
                if(input.checked){
                    priceChecklist.push(parseInt(input.value));
                }
            })
            filterChecklist.push(ratingValue);
            filterByChecklists(productArray,filterChecklist,priceChecklist);
            // console.log(filterChecklist);
            // console.log(priceChecklist);
        })
        loginButton.addEventListener('click',(event)=>{
            console.log(event.target);
            // redirect to login page
            window.location.href = `/${repositoryName}/login.html`;
        })
        signupButton.addEventListener('click',(event)=>{
            console.log(event.target);
            // redirect to signup page
            window.location.href = `/${repositoryName}/signup.html`
        })

        let currentUser = getUserSession();
        if(currentUser['accessToken']){
            // user in the current session
            signupButton.style.display = 'none';
            loginButton.style.display = 'none';
            createProfileNavMenu(currentUser);
        }
        getProduct().then(()=>{
            showProducts(productArray);
        })
        
    }

    if(window.location.pathname === `/${repositoryName}/profile.html` && sessionStorage.getItem('user')){
        let currentUser = getUserSession();
        fName.value = currentUser['fName'];
        lName.value = currentUser['lName'];
        document.getElementById('profile-owner').innerText = `Welcomeback👏 ${currentUser['fName']} ${currentUser['lName']}`
        // logout user
        logoutBtn.addEventListener('click',()=>{
            logout();
        })
        // update user
        editProfileBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            let userList = getUsers();
            let user = isUserPresent(userList,currentUser);
            if(user !== ''){
                if(fName.value.trim() !== '' && lName.value.trim() !== ''){
                    user['fName'] = fName.value;
                    user['lName'] = lName.value;
                    // update also session data
                    saveUserSession(user);
                    alert("Name update successfull redirecting to home page");
                    setTimeout(()=>{
                        window.location.href = `/${repositoryName}/index.html`;
                    },2000)
                }
            }
            // save all users in localstorage
            saveUser(userList);
        })
        // update password
        updatePasswordBtn.addEventListener('click',(event)=>{
            event.preventDefault();
            let userList = getUsers();
            let user = isUserPresent(userList,currentUser);
            if(user !== ''){
                if(oldPassword.value === currentUser['password']){
                    if(newPassword.value !== updatePassword.value){
                        newPassword.value = '';
                        updatePassword.value = '';
                        alert('password miss match');
                    }
                    else{
                        user['password'] = newPassword.value;
                        alert("Password update successfull, u will be logged out.");
                        setTimeout(()=>{
                            logout();
                        },2000)
                    }                        
                }else{
                    newPassword.value = '';
                    updatePassword.value = '';
                    oldPassword.value = ''; 
                    alert("Your password does't meet with your old password")
                }
            }
            // save all users in localstorage
            saveUser(userList);
        })
    }
    // add product card to my cart page
    if(window.location.pathname === `/${repositoryName}/cart.html` && sessionStorage.getItem('user')){
        
        let currentUser = getUserSession();
        if(currentUser['accessToken']){
            // user in the current session
            createProfileNavMenu(currentUser);
        } 
        const usersList = JSON.parse(localStorage.getItem('users'));
        let user = isUserPresent(getUsers(),currentUser);
        let totalPrice = 0;
        if(currentUser['accessToken'] === user['accessToken']){
            console.log(user['cart']);
            totalPrice = getTotalPrice(user['cart']);
            showProducts(user['cart']);
        }  
        document.getElementById('pay-btn').innerText = `$${totalPrice} Check Out`;
        if(document.getElementById('filtered-products').innerText === ''){
            paymentBtn.style.display = 'none';  
        }     
    }
    if(window.location.pathname === `/${repositoryName}/signup.html`){

        signupForm.addEventListener('click',function(event){
            console.log(event.target);
            event.preventDefault();
            if(fName.value.trim() === '' || 
                lName.value.trim() === ''||
                email.value.trim() === '' || 
                password.value.trim() === '' || 
                confirmPassword.value.trim() === ''){
                showMessage('Error: All fields are mandatory!');
                return;
            }    
            // password matching
            if(password.value.trim() !== confirmPassword.value.trim()){
                showMessage('Error: password not matching.');
                password.value = '';
                confirmPassword.value = '';
                return;
            }
            const existingUsers = getUsers();            
            let accessToken = generate16ByteToken();
            const user = {
                fName: fName.value.trim(),
                lName: lName.value.trim(),
                email: email.value.trim(),
                accessToken: accessToken,
                password: password.value,
                cart:[]
            }
            if(localStorage.getItem('users')){
                const existingUser = existingUsers.find((u) => u.email === email.value.trim());
                // if user already resgister
                if (!existingUser) {
                    existingUsers.push(user); 
                    saveUser(existingUsers);
                    // redirect to login page
                }else{
                    showMessage("Email already exists. Please use a different email.");
                    return;
                }
            }else{
                // save user localstorage
                existingUsers.push(user); 
                saveUser(existingUsers);
            }
            setTimeout(function(){
                window.location.href = `/${repositoryName}/login.html`;
            },1000);
        })
    }
    if(window.location.pathname === `/${repositoryName}/login.html`){

        loginForm.addEventListener('click', (event) =>{
            event.preventDefault();
            let userList = getUsers();
            let loginEmail = email.value;
            let loginPassword = password.value;
            // let currentSession = getUserSession();
            let currentUser = userList.find(
              (user) =>
                user.email === loginEmail.trim() && user.password === loginPassword.trim()
            );
            // save current user session
            // currentSession.push(currentUser);
            // console.log(currentUser);
            if(currentUser !== undefined){  
                saveUserSession(currentUser);  
                // redirect to index page 
                setTimeout(() => {
                    window.location.href = `/${repositoryName}/index.html`;
                },1000)
            }else{
                showMessage("You entered wrong inforamation");
            }
            
        })
    }
}




