

// Router
const global = {
    currentPage: window.location.pathname
}

// display values and some visuals
class GameStore {
    constructor() {
        this.walletCash = Storage.getWalletCash()
        this.displayValues()
        this.discounts = RandomDiscounts.randomDiscounts();
    }

    // this function display the prices on the page and if the game is in local storage it overwrite the defualt price for the price storaged
    displayValues() {

        // display wallet money
        const userCash = document.querySelector('.wallet-cash-info')
        userCash.innerHTML = this.walletCash

        // getting the p elements with price class
        const gameCurrentPrice = document.
        querySelectorAll('.price');

        // getting the games that are in the cart
        const gamesInStorage = Storage.getGamesObjects();

        // getting the price of the games on local storage
        const priceInstorage = gamesInStorage.map((games) => {
            return games.price
        });

        // this array store the price of the games selected
        let priceOnPageArray = []

        // looping through the p elements with a class of price
        gameCurrentPrice.forEach((price) => {

            // if nothing happens this is the price displayed on the page
            price.innerText = `$${60}`;

            // use setTimeout so i can check for the class of 'bought' in game container after the DOM is loaded
            setTimeout(() => {
                if(price.parentElement.parentElement.classList.contains('bought')){

                    // put bought games price in priceOnPageArray
                    priceOnPageArray.push(price) 
                }
            }, 0)
        })

        // because im using setTimeout on the above code to check for a class i need to use it here as well
        setTimeout(() => {

            // looping through the prices on the page
            priceOnPageArray.forEach((price, pIndex) => {
                // changing price on page to price in local storage
                price.innerText = priceInstorage[pIndex]

                // if the game was selected with a discount the color shoud be green
                if(price.innerText !== `$${60}`){
                    price.style.color = '#09471b';
                }
            })
        }, 200)
    }

    boughtVisualClues(container) {

        const gameContainer = container;
        gameContainer.classList.add('bought');

    }
}

// game object
class Game {
    constructor(name, image, containerClass, price){
        this.name = name
        this.image = image
        this.class = containerClass
        this.price = price
    }
}

// main events
class AppHomePaige {
    constructor(){
        this.inCartGames = Storage.getGamesObjects();
        this.selectGame = this.selectGame.bind(this);
        this.gameStoreEffects = new GameStore();
        this.buyBtnsConfig()
        this.displayStoragedItems ()
        this.reset()
    }

    // event listernes on btns
    buyBtnsConfig() {

        // selecting the buttons
        const addBtns = document.querySelectorAll('.put-in-cart-btn')

        // applying selectGame function to btns
        addBtns.forEach(btn => {
            btn.addEventListener('mousedown', this.selectGame)

            btn.addEventListener('mouseup', () => {
                btn.removeEventListener('mousedown', this.selectGame)
            })
        })
    }

    selectGame(e){
        
        // get game info
        const gameContainer = e.target.parentElement.parentElement;

        // effects added to the page
        this.gameStoreEffects.boughtVisualClues(gameContainer)

        const gameName = gameContainer.children[1].innerText;

        const gameImage = gameContainer.children[0].children[0];

        // object that stores image info in localstorage
        const imageObject = {
            src: gameImage.src,
            alt: gameImage.alt,
            width: gameImage.width,
            height: gameImage.height
        }

        const gamePrice = gameContainer.children[2].children[0].innerText;

        // get container class for object
        const containerClass = gameContainer.className.split(' ')[2];

        // put info into object
        const selectedGame = new Game(gameName, imageObject, containerClass, gamePrice)


        // put object into array
        this.inCartGames.push(selectedGame)

        // functions
        this.addToCart()
        Storage.setGameObjects(this.inCartGames)

    }

    // creating red ball on top of cart and the numbers inside of it
    addToCart() {
        const redBall = document.getElementById('selected-products')

        redBall.classList.add('cart-products-quantanty');

        redBall.innerText = this.inCartGames.length;

    }

    // this function ensures that the items that i bought keep showing after page reloads
    displayStoragedItems (){
        let pArray = []

        // looping through containers to get the p elements and put them inside an array
        const gamesContainer = document.querySelectorAll('.game-container')

        // pushing p elements into pArray
        for(const elements of gamesContainer){
            const pElements = elements.children[1]
            pArray.push(pElements)
        }

        // taking out the first element from pArray so i dont get errors
        pArray.splice(0, 1);

        // creating an array for stored game names
        let storagedGameNames = []

        // run this if there is items in localStorage
        if(this.inCartGames.length > 0) {

            // this function makes appear the redBall on top of cart
            this.addToCart();

            // put game names into storagedGameNames
            for(const game of this.inCartGames) {
                storagedGameNames.push(game.name)
            }

            // looping through pArray and storagedGameNames to get the elements that match each other
            for(const p of pArray) {

                for(const namesLocal of storagedGameNames) {

                    if(p.innerText === namesLocal) {
                        // select p parent
                        const theContainer = p.parentElement;
                        // adding class of bought for p parent
                        theContainer.classList.add('bought')
                    }
                }
            }
        }

        // this code adds a class of bought for the games that are in my account
        const userAcquiredGames = Storage.getGamesForAccount()

        const nameArray = userAcquiredGames.map(game => {
            return game.name
        })

        if(userAcquiredGames.length > 0){
            
            pArray.forEach((element) => {

                for(const name of nameArray){

                    if(element.innerHTML === name){

                        const container = element.parentElement;

                        container.classList.add('bought')
                    }
                }
            })
        }
        this.showPriceStoredAccountGames()
    }

    showPriceStoredAccountGames(){

        // get prices on page
        const getPrice = document.querySelectorAll('.price');

        // converting the getPrice into an array
        const priceArray = Array.from(getPrice);

        // get the games in the user account
        const gamesInAccount = Storage.getGamesForAccount()

        // storing the marked items
        let priceOnPage = []

        // check to see if there are games in user account
        if(gamesInAccount.length > 0){

            // making an array with the prices that are stored in user account
            const priceStored = gamesInAccount.map((gameObject) => {
                return gameObject.price;
            })

            // set time out so i can add the values to the page
            setTimeout(() => {
                priceOnPage.forEach((price, index) => {

                    price.innerText = priceStored[index]
                    price.style.color = 'black'

                    const takeOutDollarSign = priceStored[index].substring(1)

                    const onlyNumbers = Number(takeOutDollarSign)

                    if(onlyNumbers < 60){
                        price.style.color = '#09471b';
                    }
                })
            }, 600)
        }

        priceArray.forEach(p => {

        setTimeout(() => {

            if(p.parentElement.parentElement.classList.contains('bought')){
                priceOnPage.push(p)
            }
        }, 500)
        })

    }

    // reset all pages
    reset() {
        const resetBtn = document.querySelector('.reset-btn')

        const redBall = document.getElementById('selected-products')

        const walletInfoMain = document.querySelector('.wallet-cash-info')

        const getContainers = document.querySelectorAll('.game-container')
        const containers = [...getContainers].slice(1)

        resetBtn.addEventListener('click', () => {

            // checking for a class and then remove the class of these items, call random discounts after that
            setTimeout(() => {
                containers.forEach(tainer => {
                    if(tainer.classList.contains('bought')){
                        tainer.classList.remove('bought')
                        RandomDiscounts.randomDiscounts()
                    }
                })
            }, 200)

            if(redBall.classList.contains('cart-products-quantanty')){

                // reset array cart
                this.inCartGames = [];

                // reset ball inner text
                redBall.innerText = '';

                // remove the effect
                redBall.classList.remove('cart-products-quantanty')

                // get page buttons
                const addBtns = document.querySelectorAll('.put-in-cart-btn')

                // removing items from storage and reseting wallet cash to default
                Storage.removeItems()
                Storage.removeItemsAccount()
                Storage.setWalletCash()
                walletInfoMain.innerText = Storage.getWalletCash();

                addBtns.forEach(btn => {

                    // adding event listernes to btns again
                    btn.addEventListener('mousedown', this.selectGame)

                    // removing bought class from containers
                    btn.parentElement.parentElement.classList.remove('bought')

                })

            } else {

                // if there is not items in the cart, i still remove items from storage
                Storage.removeItemsAccount()
                Storage.setWalletCash()
                walletInfoMain.innerText = Storage.getWalletCash();

                return
            }
        })
    }
}

// create some random discounts on the page
class RandomDiscounts {

    static randomDiscounts(){

        const getPrice = document.querySelectorAll('.price');

        const priceArray = Array.from(getPrice);

        // Set() will ensure that i dont get duplicate numbers
        const setNumbers = new Set();

        // randCount generates how many random numbers i will get on a for loop
        const randCount = Math.floor(Math.random() * 6 + 1);

        // for loop randomize numbers from 1 to 10
        // before i was using while loop but it was breaking my entire page occasianally
        for(let i = 0; i < randCount; i++){
            setNumbers.add(Math.floor(Math.random() * 10 + 0))
        };

        // transforming setNumbers into an array
        const randNumbers = Array.from(setNumbers);



        // applying the discounts to the page
       priceArray.forEach((p, pIndex) => {

        randNumbers.forEach(number => {

            setTimeout(() => {
                // if the game is selected i don't apply the disocunts
                if(p.parentElement.parentElement.classList.contains('bought')){

                    return

                } else {
                    // if the index from the page prices is equal to random number index apply the discount
                    if(pIndex === number){
 
                        const randomPrice = `$${Math.floor(Math.random() * 41 + 10)}`;
                        p.style.color = '#09471b';
                        p.innerText = randomPrice;
            
                    }
                }
            }, 500)
        })
    })

  }
}


// CART PAGE

// display values add things to the page
class CartPage {
    constructor(){
        this.setCash = Storage.setWalletCash()
        this.walletCash = Storage.getWalletCash()
        this.displayWalletValue()
        this.displayTotalCharge()
        this.displayGamesCart()
        this.eventApp = new EventApp()
    }

    // wallet default value
    displayWalletValue(){
        const walletElement = document.querySelector('.cart-wallet-cash');
        walletElement.innerText = this.walletCash;
    };

    displayTotalCharge(){
        const totalElement = document.querySelector('.total-value').children[0]

        // get games from storage, put strings into an array, convert strings into numbers
        const games = Storage.getGamesObjects();
        const rawArrayPrice = games.map((game) => {
            return game.price;

        })
        const onlyPrices = rawArrayPrice.map((values) =>{
           const priceString = values.substring(1)
           const priceNumber = parseInt(priceString);
           return priceNumber;
        })

        // get the total value
        const totalValue = onlyPrices.reduce((accumulator, prices) => {
            return accumulator + prices
        }, 0)

        // display total value
        totalElement.innerText = `$${totalValue}`;

    };

    displayGamesCart(){
        const gamesContainer = document.querySelector('.game-parent-div');

        // get image object from games array, storing image info into gameInfo
        const gamesInStorage = Storage.getGamesObjects()
        const gameInfo = gamesInStorage.map((info) => {
            return {
                img: info.image,
                name: info.name
            }
        })

        // passing image info to dynamic created div
        gameInfo.forEach(object => {
            this.gameWrapper(gamesContainer, object.name, object.img);
        })
    }

    // dynamic created div for every stored object
    gameWrapper(gamesContainer, gameName, imageObject){

        const image = imageObject;
        const nameOfGame = gameName;

        const gameWrapper = document.createElement('div')
        gameWrapper.classList.add('purchased-game-wrapper')

        const gameFigure = document.createElement('figure')
        gameFigure.classList.add('purchase-figures')

        const img = document.createElement('img');
        img.setAttribute('src', image.src);
        img.alt = image.alt
        img.width = image.width
        img.height = image.height

        const name = document.createElement('p')
        name.classList.add('game-name')
        name.innerText = nameOfGame

        gamesContainer.appendChild(gameWrapper)
        gameWrapper.appendChild(gameFigure)
        gameWrapper.appendChild(name)
        gameFigure.appendChild(img)
    }

    
}

// Class that handle every event listener on cart page
class EventApp {
    constructor(){
        document.querySelector('.cancel-purchase-btn').addEventListener('click', this.cancelPurchase.bind(this))
        document.querySelector('.finish-purchase-btn').addEventListener('click', this.finishPurchase.bind(this))
    }

    cancelPurchase() {

        const gamesWrapperArray = document.querySelectorAll('.purchased-game-wrapper')

        const totalElement = document.querySelector('.total-value').children[0]

        gamesWrapperArray.forEach(wrapper => {
            wrapper.remove()
        })

        totalElement.innerText = `$${0}`

        localStorage.removeItem('games')
        
    }

    finishPurchase() {

        const boughtGamesArray = Storage.getGamesObjects()
        const itemsAccount = Storage.getGamesForAccount()

        const totalElement = document.querySelector('.total-value').children[0]
        const totalValueString = totalElement.innerText
        const totalValueNumber = totalValueString.substring(1)
        const totalPrice = parseInt(totalValueNumber)

        // this will add the items to new storage and prevent its overwrite if a new game is added to account
        boughtGamesArray.forEach(bGame => {
            // this forEach will prevent to add a new array every time i finish my purchase
            itemsAccount.push(bGame)
        })
        localStorage.setItem('accountGames', JSON.stringify(itemsAccount))

        // wallet cash
        const getWalletCash = Storage.getWalletCash()
        const getCashNumberString = getWalletCash.substring(1)
        const walletCash = parseInt(getCashNumberString)

        if(totalPrice > walletCash){
            alert("You can't afford this purchase")
            return;

        } else if(totalPrice === 0){
            alert("Your cart is empty.")
            return

        } else {

            const updatedCash = walletCash - totalPrice;
            Storage.setWalletCash(updatedCash)

            const wallet = document.querySelector('.cart-wallet-cash');
            wallet.innerHTML = Storage.getWalletCash();

        }

        // take out the divs on the page
        this.cancelPurchase();

    }
}


// MY ACCOUNT PAGE
class UserAccount {
    constructor(){
        this.displayStoredInfo()
        this.events = new AccountApp()
    }

    displayStoredInfo() {

        const storedGames = Storage.getGamesForAccount()

        storedGames.forEach(game => {

            this.acquiredGameContainer(game.image, game.name)
        })
    }

    acquiredGameContainer(imageObject, gameName) {

        const centerContents = document.querySelector('.account-page-center-contents')

        const gameContainer = document.createElement('div')
        gameContainer.classList.add('purchased-game')

        const imageContainer = document.createElement('figure')
        imageContainer.classList.add('game-image-container')

        const img = document.createElement('img')
        img.setAttribute('src', imageObject.src)
        img.alt = imageObject.alt
        img.width = imageObject.width
        img.height = imageObject.height

        const pElement = document.createElement('p')
        pElement.innerText = gameName
        pElement.classList.add('name')

        const btnsContainer = document.createElement('div')
        btnsContainer.classList.add('purchased-game-options')

        const refundBtn = document.createElement('button')
        refundBtn.classList.add('refund-btn')
        const refundText = document.createTextNode('Refund')

        const favoriteBtn = document.createElement('button')
        favoriteBtn.classList.add('mark-favorite-btn')

        const favoriteIcon = document.createElement('i')
        favoriteIcon.classList.add('ri-sparkling-fill')
        favoriteIcon.classList.add('favorite-icon')


        centerContents.appendChild(gameContainer)

        gameContainer.appendChild(imageContainer)

        imageContainer.appendChild(img)

        gameContainer.appendChild(pElement)

        gameContainer.appendChild(btnsContainer)

        btnsContainer.appendChild(refundBtn)

        refundBtn.appendChild(refundText)

        btnsContainer.appendChild(favoriteBtn)

        favoriteBtn.appendChild(favoriteIcon)
    }
}

class AccountApp {

    constructor(){
        this.swtich = new ToggleSwicth()
        this.markFavorite()
        this.refundFunction()
    }

    markFavorite () {

        const getBtns = document.querySelectorAll('.mark-favorite-btn')
        const favBtns = Array.from(getBtns)

        // creating a toggle class for each button so their toggle are indepedent from one another
        favBtns.forEach(btn => {
            const toggleButton = new ToggleSwicth(btn);
            btn.addEventListener('click', toggleButton.toggle);

        })
    }

    refundFunction() {
        // get page buttons, converting html collection
        const getBtns = document.querySelectorAll('.refund-btn')
        const refundBtns = Array.from(getBtns)

        // get game divs, converting html collection
        const getDivs = document.querySelectorAll('.purchased-game')
        const gameDivs = Array.from(getDivs)

        // get games in storage
        const accountGames = Storage.getGamesForAccount()

        // making array only with stored prices, to update the wallet later
        const gamePrice = accountGames.map((games) => {

            const price =  games.price
            const takeOutDollarSign = price.substring(1)
            const priceNumber = parseInt(takeOutDollarSign)

            return priceNumber
        })

        // run forEach on buttons to add event listeners to them, and get their index value
        refundBtns.forEach((btn, bIndex) => {
            btn.addEventListener('click', () => {

                // when i click this what is going to happen is...

                // set cash of refunded game back to wallet
                Storage.refundWalletUpdate(gamePrice[bIndex])

                // get number index for divs on page
                const gameIndex = gameDivs.indexOf(gameDivs[bIndex])

                // if div index is equal to button index i will run...
                if(gameIndex === bIndex) {

                // get the div that i clicked
                const gameD = gameDivs[bIndex]
                // removing div before call querySelectorAll because i want to get the p elements without the one that i clicked
                gameD.remove()

                // get p elements, without the one that i just removed, convert html colection
                const getPs = document.querySelectorAll('.name')
                const pElements = Array.from(getPs)

                // making sure i have an array of names instead of p elements
                const pageName = pElements.map((elements) => {
                    return elements.innerText
                })

                // if the games in storage have the same name as the games on the page i will make an array with only these names, the ones that are not equal will be thrown out
                const updatedGamesArray = accountGames.filter((game) => {

                    if(pageName.includes(game.name)){
                        return game
                    }
                })

                // setting the new created array to local storage
                Storage.setGamesForAccount(updatedGamesArray)

                }
            })
        })
    }
}

class ToggleSwicth {
    constructor(buttonElement ,initialState = false) {
        this.state = initialState
        // the target element when i click, it will only get the button or the icon
        this.buttonElement = buttonElement
        // Bind the toggle method to the class instance
        this.toggle = this.toggle.bind(this)
    }

    // every time i call this function on a different class i will toggle the state
    toggle(e) {
        this.state = !this.state;
        this.changeColors(e.target)
    }

    changeColors(target) {
        
        const buttonIcon = target;

        if(this.state) {

            if(buttonIcon.classList.contains('mark-favorite-btn')){
        
            const button = buttonIcon;
            
            const buttonParent = buttonIcon.parentElement;
            
            const gameContainer = buttonIcon.parentElement.parentElement;
            
            button.style.borderColor = '#053600'
            buttonParent.style.backgroundColor = '#ffbb00';
            gameContainer.style.borderColor = '#ffbb00';
            
            } else if (buttonIcon.classList.contains('favorite-icon')) {
            
            const button = buttonIcon.parentElement;
            
            const buttonParent = buttonIcon.parentElement.parentElement;
            
            const gameContainer = buttonIcon.parentElement.parentElement.parentElement;
            
            button.style.borderColor = '#053600';
            buttonParent.style.backgroundColor = '#ffbb00';
            gameContainer.style.borderColor = '#ffbb00';
            }
                } else {
        
                    if(buttonIcon.classList.contains('mark-favorite-btn')){
        
                    const button = buttonIcon;
        
                    const buttonParent = buttonIcon.parentElement;
            
                    const gameContainer = buttonIcon.parentElement.parentElement;
        
                    button.style.borderColor = '#15f554'
                    buttonParent.style.backgroundColor = '#123b6c'
                    gameContainer.style.borderColor = '#123b6c'
            
                    } else if (buttonIcon.classList.contains('favorite-icon')) {
        
                    const button = buttonIcon.parentElement;
        
                    const buttonParent = buttonIcon.parentElement.parentElement;
            
                    const gameContainer = buttonIcon.parentElement.parentElement.parentElement;
        
                    button.style.borderColor = '#15f554';
                    buttonParent.style.backgroundColor = '#123b6c';
                    gameContainer.style.borderColor = '#123b6c';
                        
            }
        }
    }
}

class Storage {

    // get games from localStorage
    static getGamesObjects() {
        let storagedGames;
        if(localStorage.getItem('games') === null) {
            storagedGames = []
        } else {
            try {
                storagedGames = JSON.parse(localStorage.getItem('games'))
            } catch(e) {
                console.error('Error parsing local storage date', e);
                storagedGames = [];
            }
        }
        return storagedGames;
    }

    // set games in cart to local storage
    static setGameObjects (games) {
        localStorage.setItem('games', JSON.stringify(games))
    }

    // remove games items
    static removeItems() {
        localStorage.removeItem('games')
    }

    // wallet info
    static getWalletCash() {
        let cashStored;
        cashStored = localStorage.getItem('walletCash');
        return cashStored
    }

    static setWalletCash(newWalletValue) {

        const updatedCash = newWalletValue;

        const defaultCash = 360

        if(localStorage.getItem('accountGames') === null) {
            localStorage.setItem('walletCash', `$${defaultCash}`)

        } else if(updatedCash > defaultCash){

            return

        } else if(updatedCash <= defaultCash) {

            localStorage.setItem('walletCash', `$${updatedCash}`)

        }
    }

    static refundWalletUpdate(refundData){

        const getCash = this.getWalletCash()

        const takeOutDollarSign = getCash.substring(1)

        const convertedCash = parseInt(takeOutDollarSign)

        const moneyBack = refundData

        const updatedValue = convertedCash + moneyBack

        localStorage.setItem('walletCash', `$${updatedValue}`)
    }


    // Games for my account page, this function set the games when i bought them, and it is updated when i refund them
    static setGamesForAccount(games) {
        localStorage.setItem('accountGames', JSON.stringify(games))
    }

    static getGamesForAccount() {

        let storagedGames;
        if(localStorage.getItem('accountGames') === null) {
            storagedGames = []
        } else {
            try {
                storagedGames = JSON.parse(localStorage.getItem('accountGames'))
            } catch(e) {
                console.error('Error parsing local storage date', e);
                storagedGames = [];
            }
        }
        return storagedGames;
    }

    static removeItemsAccount(){
        localStorage.removeItem('accountGames')
    }
    
}






function init() {
    switch(global.currentPage){
        case '/CSS-CODE/JavaScript/Java-Projects/Simple_E-commerce-Store/index.html':
            const event = new AppHomePaige();
            break;

        case '/CSS-CODE/JavaScript/Java-Projects/Simple_E-commerce-Store/CartPage.html':
            const cartPage = new CartPage();
            console.log('Cart-Page')
        break;

        case '/CSS-CODE/JavaScript/Java-Projects/Simple_E-commerce-Store/myAccountPage.html':
            const myAccount = new UserAccount();
            console.log('Account-Page')
            break;
    }
}

document.addEventListener('DOMContentLoaded', init)