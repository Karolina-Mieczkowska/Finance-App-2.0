const balanceAmount = document.querySelector('.balance__amount');
const movementValue = document.querySelectorAll('.movement__value');
const historyTabContainer = document.querySelector('.history__tab-container');
const historyContent = document.querySelector('.history__content');

const topNav = document.querySelector('.nav');
const navElements = document.querySelectorAll('.nav__element');
const mainInterface = document.querySelectorAll('.main__interface');

const btnTransfer = document.querySelector('.btn__transfer');
const selectSend = document.querySelector('.transfer__select--send');
const selectReceive = document.querySelector('.transfer__select--receive');
const amountInput = document.querySelector('.transfer__input--number');

const incomeLabel = document.querySelector('.summary__in');
const outcomeLabel = document.querySelector('.summary__out');

// ACCOUNTS

const currentAccount = {
    type: 'current',
    currency: 'GBP',
    locale: 'uk',
    movements: [1200, -450, -300, 1200, -450, -200, 1200, -450, -300, -500]
}

const savingAccount = {
    type: 'saving',
    currency: 'GBP',
    locale: 'uk',
    movements: [300, 200, 300]
}

const currencyAccount = {
    type: 'currency',
    currency: 'PLN',
    locale: 'pl',
    movements: [2000]
}

const accounts = [currentAccount, savingAccount, currencyAccount];

// FORMAT CURRENCY

function formatCurrency(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
}

let selectedAccount = accounts[0];

// CURRENCY CONVERTION

const convertCurrency = function(amount, currency) {

    const exchangeRate = 5.33;
    let convertedAmount;

    convertedAmount = currency !== 'PLN' ? amount / exchangeRate : amount * exchangeRate;
    return convertedAmount;
}

// DISPLAY BALANCE 

const displayBalance = function(account) {
    
    account.balance = account.movements.reduce(function(accumulator, current) {
        return accumulator + current;
    }, 0);

    const formattedBalance = formatCurrency(account.balance, account.locale, account.currency);

    balanceAmount.textContent = formattedBalance;
};

displayBalance(selectedAccount);

// DISPLAY MOVEMENTS

const displayMovements = function(account) {

    historyContent.innerHTML = '';

    account.movements.forEach(function(movement) {
        const type = movement > 0 ? 'deposit' : 'withdrawal';

        const formatedMovement = formatCurrency(movement, account.locale, account.currency)

        const html = `
            <div class="movement">
                <div class="movement__type">${type}</div>
                <div class="movement__value movement__type--${type}">${formatedMovement}</div>
            </div>
        `

        historyContent.insertAdjacentHTML('afterbegin', html);
    });
};

displayMovements(selectedAccount);

// DISPLAY SUMMARY

const displaySummary = function(account) {

    const income = account.movements.filter(function(movement) {
        return movement > 0;
    }).reduce(function(acc, curr) {
        return acc + curr;
    }, 0);

    incomeLabel.textContent = formatCurrency(income, account.locale, account.currency);

    const outcome = account.movements.filter(function(movement) {
        return movement < 0;
    }).reduce(function(acc, curr) {
        return acc + curr;
    }, 0);

    outcomeLabel.textContent = formatCurrency(Math.abs(outcome), account.locale, account.currency);
}

displaySummary(selectedAccount);

// TRANSFER MONEY 

const makeTransfer = function(sender, receiver, value) {

    if (value > 0 && sender.balance >= value && sender !== receiver) {

        sender.movements.push(-value);
        receiver.movements.push(value);

        if (sender.type == 'currency' || receiver.type == 'currency') {
            
            const receiverLength = receiver.movements.length - 1;
            let lastReceiverItem = receiver.movements[receiverLength];
            const convertedItem = convertCurrency(lastReceiverItem, receiver.currency);
            receiver.movements.pop();
            receiver.movements.push(convertedItem);
        } 
    } else {
        alert('Check if transfer amount is less than the account balance, and if it is greater than 0.');
    }
}

// SWITCH INTERFACE

document.querySelector(`.main__interface--history`).style.display = 'block';

const switchInterface = function(dataTab) {

    mainInterface.forEach(function(interface) {
        interface.style.display = 'none';
    })
    document.querySelector(`.main__interface--${dataTab}`).style.display = 'block';
}

// HISTORY TABS CHANGING

historyTabContainer.addEventListener('click', function(ev) {

    const account = ev.target.dataset.tab;
    const ind = ev.target.dataset.ind;

    selectedAccount = accounts[ind];

    document.querySelectorAll('.history__tab').forEach(function(tab) {
        tab.classList.remove('history__tab--active');
    });

    document.querySelector(`.history__tab--${account}`).classList.add('history__tab--active');
    document.querySelector('.balance__label').textContent = `${account} account`;    

    displayMovements(selectedAccount);
    displayBalance(selectedAccount);
    displaySummary(selectedAccount);
})

// NAV NAVIGATING

topNav.addEventListener('click', function(ev) {

    let clicked;

    if (ev.offsetX > (window.innerWidth / 2) && ev.target.classList.contains('nav__list')) {
        clicked = ev.target.firstElementChild.nextElementSibling;
    } else if (ev.target.classList.contains('material-icons')) {
        clicked = ev.target.parentElement;
    } else if (ev.target.classList.contains('nav__list')) {
        clicked = ev.target.firstElementChild;
    } else if (ev.target.classList.contains('nav__element')) {
        clicked = ev.target;
    };

    navElements.forEach(function(element) {
        element.classList.remove('nav__element--active');
    });

    clicked.classList.add('nav__element--active');

    switchInterface(clicked.dataset.tab);
});

// TRANSFER

btnTransfer.addEventListener('click', function(ev) {

    ev.preventDefault();

    const senderAccount = accounts.find(function(acc) {
        return acc.type === selectSend.value;
    })

    const receiverAccount = accounts.find(function(acc) {
        return acc.type === selectReceive.value;
    })

    const transferValue = Number(amountInput.value);

    makeTransfer(senderAccount, receiverAccount, transferValue);
    displayBalance(selectedAccount);
    displayMovements(selectedAccount);
    displaySummary(selectedAccount);

    amountInput.value = '';
})


