const balanceAmount = document.querySelector('.balance__amount');
const movementValue = document.querySelectorAll('.movement__value');
const historyTabContainer = document.querySelector('.history__tab-container')

const balance = 500;
const movement = 300;

const formatCurrency = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(value);
}

const formattedBalance = new Intl.NumberFormat('uk', {
    style: 'currency',
    currency: 'GBP'
}).format(balance);

balanceAmount.textContent = formattedBalance;

Array.from(movementValue).map(function(mov) {
    const formatedMov = formatCurrency(movement, 'uk', 'GBP');
    return mov.textContent = formatedMov;
})

// HISTORY TABS CHANGING

historyTabContainer.addEventListener('click', function(ev) {

    const account = ev.target.dataset.tab;

    document.querySelectorAll('.history__content').forEach(function(content) {
        content.classList.remove('history__content--active');
    });

    document.querySelectorAll('.history__tab').forEach(function(tab) {
        tab.classList.remove('history__tab--active');
    });

    document.querySelector(`.history__content--${account}`).classList.add('history__content--active');
    document.querySelector(`.history__tab--${account}`).classList.add('history__tab--active');
    document.querySelector('.balance__label').textContent = `${account} account`;

    document.querySelector('.movement__value').textContent = `${balance}`;
})


