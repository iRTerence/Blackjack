// Set my constant values 
//set cardFace/suits elements based on the CSS cards provided by Alex
const suits = ['s', 'h', 'c', 'd']
const cardFace = ['2', '3', '4', '5', '6','7','8','9','10','J','Q','K','A']

//Variables
// creating a card array which will be added by looping through the suits and cardFace array
let cards = [] 

// Creating the player
let player = {
    personalMoney: 100,
    playerCards: [],
    playerTotal: 0
}

//Empty array for dealer as the cards will be added in randomly
let dealerCards = [];
let dealerTotal = 0

//bet amount
betAmount = 0

//defining win/gameplay state 
let winner = 0
let progress = 0 

//Dom Selections
let $betAmount = $('#betAmount')
let $playerMoney = $('#playerMoney')
let $b5 = $('.five').on('click', bet)
let $b10 = $('.ten').on('click', bet)
let $b25 = $('.twentyfive').on('click', bet)
let $b50 = $('.fifty').on('click', bet)
let $hit = $('.hit').on('click', hit)
let $stand = $('.stand').on('click', stand)
let $newround = $('.newround').on('click', start)
let $reset = $('.reset')
let $updateMessage = $('.updateMessage')
let $myForm = $('#myForm').on('submit', deposit)
let $playersHand = $('.playershand')

//Audio sounds
//shuffle Sounds
let shuffleSounds = new Audio()
shuffleSounds.src = "audio/shuffle.wav"

//dealing cards
let dealCards = new Audio()
dealCards.src = "audio/dealing.wav"

//adding chips
let chipSound = new Audio()
chipSound.src = "audio/chips.wav"

//Winning sound
let gameWin = new Audio()
gameWin.src = "audio/win.wav"

//Losing sound
let gameLoss = new Audio()
gameLoss.src = "audio/lose.wav"

//deposit sound
let moneySound = new Audio()
moneySound.src = "audio/deposit.wav"

//functions
//Creating the cards by adding the two arrays 
function shuffleCards() {suits.forEach(function(sValue) {
    cardFace.forEach(function(cValue) {
        let cardObject = {
            card: sValue+cValue,
            value: cValue
        }
       cards.push(cardObject)
    })
    //forEach to replace all the Q, K ,A , J values to 10 or 1
    cards.forEach(function(a){
        if(a.value == 'J' || a.value == 'Q' || a.value == 'K') {
            a.value = 10
        }
        if(a.value == 'A') {
            a.value = 1
        }

        })
    })
}

//Initial state of the game
function start() {
    if(progress !== 0) return;
    $playersHand.text('')
    $updateMessage.text('')
    winner = 0
    dealerTotal = 0
    cards.splice(0, cards.length)
    if(betAmount == 0) {
        $updateMessage.text(`A new round can not be started if bet amount is 0`)
        return;
    }
    progress = 1
    shuffleCards()
    shuffleDeck(cards)
    $('.deleteCards').remove()
    win = null
    dealerCards = cards.splice(getRandomInt(), 1)
    player.playerCards = cards.splice(1,2)
    setTimeout(function(){ 
        dealCards.play(); 
        $('#pc').append(`<div class = "card large deleteCards fade-in ${player.playerCards[0].card}"></div>`)
    }, 750);
    setTimeout(function(){ 
        $('#pc').append(`<div class = "card large deleteCards fade-in ${player.playerCards[1].card}"></div>`)
    }, 1250);
    setTimeout(function(){ 
        $('#dc').append(`<div class = "card large deleteCards fade-in ${dealerCards[0].card}"></div>`)
    }, 1000);
    setTimeout(function(){ 
        $('#dc').append(`<div class = "card large deleteCards fade-in back-red firstcard"></div>`)
    }, 1500);
    player.playerTotal = addCards()
    dealCards.play()
    pAce(pNumAces())
    dAce(dNumAces())
    checkBlackJack()
    setTimeout(function(){ 
        $playersHand.text(`(${player.playerTotal})`)
    }, 2000);

}

//Shuffle deck function, I was going to sort by using Math.random() - 0.5 but read it was not reliable to randomize
//took the fisher-yates shuffle array from https://javascript.info/task/shuffle
function shuffleDeck(array) { 
    shuffleSounds.play()
    for (var i = array.length - 1; i > 0; i--) {  
     
        var j = Math.floor(Math.random() * (i + 1)); 
                     
        var temp = array[i]; 
        array[i] = array[j]; 
        array[j] = temp; 
    } 
         
    return array; 
 } 

//Submit button to add more money
function deposit(event) {
    event.preventDefault()
    let depositAmount = parseInt($('#addmoney').val())
    console.log(depositAmount);
    player.personalMoney += player.personalMoney = depositAmount
    $playerMoney.text(player.personalMoney)
    moneySound.play()

}

//check blackjack function
function checkBlackJack() {
    if(player.playerTotal == 21) {
        $('.firstcard').remove()
        blackJackWin.play()
        stand()
    }
}

//Get a random number between 0 and the length of the cards array
function getRandomInt() {
    return Math.floor(Math.random() * cards.length);
    
}

//function for the hit button
function hit() {
    if(winner !== 0) return;
    let popped = cards.splice(getRandomInt(), 1)
    dealCards.play()
    $('#pc').append(`<div class = "card large fade-in ${popped[0].card} deleteCards"></div>`)
    player.playerCards.push(popped[0]);
    player.playerTotal = addCards()
    $playersHand.text(`(${player.playerTotal})`)
    pAce(pNumAces())
    winner = checkBust()

}

//how to deal with dealer aces
function dAce(x) {
    for(i=0; i<x; i++){
        if(dealerTotal + 10 <= 21) {
            dealerTotal = dealerTotal + 10;
        }

    }

}

//how to deal with player aces
function pAce(x) {
    for(i=0; i<x; i++){
        if(player.playerTotal + 10 <= 21) {
            player.playerTotal = player.playerTotal + 10;
        }

    }
}

//Checking dealer number of aces 
function dNumAces() {
        let dealerAces = 0
        for(i = 0; i<dealerCards.length; i++) {
        if(dealerCards[i].card == "cA" || dealerCards[i].card == "hA" || dealerCards[i].card == "sA" || dealerCards[i].card == "dA") {
            dealerAces += 1
        }
    } 
    return dealerAces;
}

//check player Aces
function pNumAces() {
    let playerAces = 0
    for(i = 0; i<player.playerCards.length; i++) {
    if(player.playerCards[i].card == "cA" || player.playerCards[i].card  == "hA" || player.playerCards[i].card == "sA" || player.playerCards[i].card  == "dA") {
        playerAces += 1
    }
} 
return playerAces;
}

//adds the total of the players cards
function addCards (){
    let totalSum = 0
    for (i=0; i < player.playerCards.length; i++) {
       totalSum = totalSum + parseInt(player.playerCards[i].value)

    } return totalSum;

}

//adds the total of the dealers cards
function addDealerCards (){
    let dealerSum = 0
    for (i=0; i < dealerCards.length; i++) {
       dealerSum = dealerSum + parseInt(dealerCards[i].value)

    } return dealerSum;

}    
  
//stand function where dealer receives cards 
function stand() {
    if(winner !== 0) return;
    $('.firstcard').remove()
    pushCards()
    progress = 0
}      

//This function is used to push the cards in the dealers array. There is a settimeout function so the cards can fade in one by one 
function pushCards() {
    setTimeout(function() {
        let popped = cards.splice(getRandomInt(), 1)
        $('#dc').append(`<div class = "card large fade-in ${popped[0].card} deleteCards"></div>`)
        dealerCards.push(popped[0]);
        dealerTotal = addDealerCards()
        dAce(dNumAces()) 
        dealCards.play()
        if (dealerTotal < 17) {
            pushCards()
        }
        winner = checkWinner()
    }, 750)
}

//check if player busted
function checkBust(){
    if(player.playerTotal > 21) {
        $updateMessage.text(`You have ${player.playerTotal}.  BUST!`).css("color", "red")
        gameLoss.play()
        betAmount = 0
        $betAmount.text(0)
        progress = 0
        
        return -1
    }
    else {
        return 0
    }

}

//checkWinner after player clicks stand
function checkWinner(){
    if(dealerTotal > 21) {
        setTimeout(function(){ 
            $updateMessage.text(`Dealer has ${dealerTotal}, dealer busts!`).css("color", "blue")
        }, 1000)
        gameWin.play()
        $betAmount.text('0')
        player.personalMoney = player.personalMoney + betAmount*2
        $playerMoney.text(player.personalMoney)
        betAmount = 0
        $betAmount.text(0)
        return 1
    }

   else if(dealerTotal > player.playerTotal) {
        setTimeout(function(){ 
            $updateMessage.text(`Dealer has ${dealerTotal} and you have ${player.playerTotal}. Dealer Wins!`).css("color", "red")
        }, 1000)
        gameLoss.play()
        $betAmount.text('0')
        betAmount = 0
        $betAmount.text(0)
        return -1
    }

   else if(dealerTotal >= 17 && player.playerTotal > dealerTotal) {
        setTimeout(function(){ 
            $updateMessage.text(`Dealer has ${dealerTotal} and you have ${player.playerTotal}. You Win!`).css("color", "blue")
        }, 1000)
        gameWin.play()
        $betAmount.text('0')
        player.personalMoney = player.personalMoney + betAmount*2
        $playerMoney.text(player.personalMoney)
        betAmount = 0
        $betAmount.text(0)

        return 1
        
    }

   else if(player.playerTotal == dealerTotal) {
        setTimeout(function(){ 
            $updateMessage.text(`Dealer has ${dealerTotal} and you have ${player.playerTotal}. Push! Bets have been returned`)
        }, 1000)
        gameLoss.play()
        $betAmount.text('0')
        player.personalMoney = player.personalMoney + betAmount
        $playerMoney.text(player.personalMoney)
        betAmount = 0
        $betAmount.text(0)
        return 2
    }
    else return 

}

//Betting function 
function bet(e) {
    if(progress !== 0) return;
    let betbutton = parseInt(e.target.innerText)
    player.personalMoney = player.personalMoney - betbutton
    if(player.personalMoney < 0) {
        player.personalMoney = player.personalMoney + betbutton;
        $updateMessage.text(`You only have ${player.personalMoney}, not enough to bet!`).css("color", "red")
        return;
    }
    chipSound.play()
    betAmount = betAmount + betbutton
    $betAmount.text(betAmount)
    $playerMoney.text(player.personalMoney)
}
