// Get elements from the HTML
const quoteForm = document.getElementById('quoteForm');
const quoteInput = document.getElementById('quoteInput');
const authorInput = document.getElementById('authorInput');
const quotesList = document.getElementById('quotesList');

// Load quotes from localStorage (or initialize an empty array if not found)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to render all quotes on the page
function renderQuotes() {
    // Clear the current quotes list
    quotesList.innerHTML = '';

    // Loop through each quote and create elements
    quotes.forEach((quote, index) => {
        // Create a container for each quote item
        const quoteItem = document.createElement('div');
        quoteItem.classList.add('quote-item');

        // Display the quote text
        const quoteText = document.createElement('span');
        quoteText.classList.add('quote-text');
        quoteText.textContent = `"${quote.text}"`;

        // Display the author's name
        const quoteAuthor = document.createElement('span');
        quoteAuthor.classList.add('quote-author');
        quoteAuthor.textContent = `- ${quote.author}`;

        // Create the upvote button
        const voteButton = document.createElement('button');
        voteButton.classList.add('vote-btn');
        voteButton.textContent = `Upvote (${quote.votes})`;
        voteButton.onclick = () => upvoteQuote(index);

        // Append elements to the quote item container
        quoteItem.appendChild(quoteText);
        quoteItem.appendChild(quoteAuthor);
        quoteItem.appendChild(voteButton);

        // Add the quote item to the quotes list
        quotesList.appendChild(quoteItem);
    });
}

// Function to add a new quote
function addQuote(event) {
    event.preventDefault();

    // Get input values and trim whitespace
    const quoteText = quoteInput.value.trim();
    const author = authorInput.value.trim();

    // Check if both fields are filled out
    if (quoteText !== '' && author !== '') {
        // Add the new quote to the quotes array
        quotes.push({ text: quoteText, author: author, votes: 0 });

        // Clear input fields
        quoteInput.value = '';
        authorInput.value = '';

        // Save the updated quotes list and re-render
        saveQuotes();
        renderQuotes();
    }
}

// Function to handle upvoting a quote
function upvoteQuote(index) {
    // Increment the vote count for the selected quote
    quotes[index].votes += 1;

    // Save the updated quotes list and re-render
    saveQuotes();
    renderQuotes();
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Event listener for form submission
quoteForm.addEventListener('submit', addQuote);

// Initial render of the quotes when the page loads
renderQuotes();
