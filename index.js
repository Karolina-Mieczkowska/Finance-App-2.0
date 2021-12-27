const balanceAmount = document.querySelector('.balance__amount');
const movementValue = document.querySelectorAll('.movement__value');
const historyTabContainer = document.querySelector('.history__tab-container');
const historyContent = document.querySelector('.history__content');

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
    movements: [500]
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

const convertCurrency = function(amount) {

    const exchangeRate = 5.33;
    const convertedAmount = amount * exchangeRate;
    return convertedAmount;
}

// DISPLAY BALANCE 

const displayBalance = function(account) {
    
    let balance = account.movements.reduce(function(accumulator, current) {
        return accumulator + current;
    }, 0);

    if (account.type === 'currency') {
        
        balance = convertCurrency(balance);
    }

    const formattedBalance = formatCurrency(balance, account.locale, account.currency);

    balanceAmount.textContent = formattedBalance;
};

displayBalance(selectedAccount);

// DISPLAY MOVEMENTS

const displayMovements = function(account) {

    historyContent.innerHTML = '';

    account.movements.forEach(function(movement) {
        const type = movement > 0 ? 'deposit' : 'withdrawal';

        if (account.type === 'currency') {
            
            movement = convertCurrency(movement);
        }

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
})




