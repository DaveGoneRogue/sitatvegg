// Elements
const quoteForm = document.getElementById('quoteForm');
const quoteInput = document.getElementById('quoteInput');
const authorInput = document.getElementById('authorInput');
const quotesList = document.getElementById('quotesList');

// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

// Function to set a cookie
function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Function to check if a quote has already been upvoted by the user
function hasUpvoted(index) {
    const upvotedQuotes = getCookie('upvotedQuotes');
    return upvotedQuotes.split(',').includes(index.toString());
}

// Function to mark a quote as upvoted in the cookie
function markAsUpvoted(index) {
    let upvotedQuotes = getCookie('upvotedQuotes');
    upvotedQuotes = upvotedQuotes ? upvotedQuotes.split(',') : [];
    upvotedQuotes.push(index.toString());
    setCookie('upvotedQuotes', upvotedQuotes.join(','));
}

// Fetch quotes from the server
async function fetchQuotes() {
    const response = await fetch('/quotes');
    const quotes = await response.json();
    renderQuotes(quotes);
}

// Render quotes with upvote buttons
function renderQuotes(quotes) {
    quotesList.innerHTML = '';
    quotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.classList.add('quote-item');

        const quoteText = document.createElement('span');
        quoteText.textContent = `"${quote.text}" - ${quote.author}`;

        const voteButton = document.createElement('button');
        voteButton.classList.add('vote-btn');
        voteButton.textContent = `Upvotes: ${quote.votes}`;
        voteButton.disabled = hasUpvoted(index);
        voteButton.onclick = () => upvoteQuote(index);

        quoteItem.appendChild(quoteText);
        quoteItem.appendChild(voteButton);
        quotesList.appendChild(quoteItem);
    });
}

// Add a new quote
async function addQuote(event) {
    event.preventDefault();
    const text = quoteInput.value.trim();
    const author = authorInput.value.trim();

    if (text && author) {
        const newQuote = { text, author, votes: 0 };

        await fetch('/add-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuote),
        });

        quoteInput.value = '';
        authorInput.value = '';
        fetchQuotes();
    }
}

// Upvote a quote
async function upvoteQuote(index) {
    if (hasUpvoted(index)) {
        alert('You have already upvoted this quote.');
        return;
    }

    await fetch('/upvote-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index }),
    });

    markAsUpvoted(index);
    fetchQuotes(); // Refresh the quotes list
}

// Event listener for form submission
quoteForm.addEventListener('submit', addQuote);

// Initial fetch of quotes
fetchQuotes();
