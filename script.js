// Get elements
const quoteForm = document.getElementById('quoteForm');
const quoteInput = document.getElementById('quoteInput');
const quotesList = document.getElementById('quotesList');

// Load quotes from localStorage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to render quotes
function renderQuotes() {
    quotesList.innerHTML = '';
    quotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.classList.add('quote-item');

        const quoteText = document.createElement('span');
        quoteText.classList.add('quote-text');
        quoteText.textContent = `"${quote.text}"`;

        const voteButton = document.createElement('button');
        voteButton.classList.add('vote-btn');
        voteButton.textContent = `Upvote (${quote.votes})`;
        voteButton.onclick = () => upvoteQuote(index);

        quoteItem.appendChild(quoteText);
        quoteItem.appendChild(voteButton);
        quotesList.appendChild(quoteItem);
    });
}

// Function to add a new quote
function addQuote(event) {
    event.preventDefault();
    const quoteText = quoteInput.value.trim();
    if (quoteText !== '') {
        quotes.push({ text: quoteText, votes: 0 });
        quoteInput.value = '';
        saveQuotes();
        renderQuotes();
    }
}

// Function to upvote a quote
function upvoteQuote(index) {
    quotes[index].votes += 1;
    saveQuotes();
    renderQuotes();
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Event listener for form submission
quoteForm.addEventListener('submit', addQuote);

// Initial render
renderQuotes();
