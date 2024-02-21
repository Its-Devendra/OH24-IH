document.addEventListener('DOMContentLoaded', () => {
    const accessToken = new URLSearchParams(window.location.search).get('access_token');
    if (accessToken) {
        search(accessToken); // Call search function with access token if available
    }
});

async function search(accessToken) {
    const searchInput = document.getElementById('searchInput').value;

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        displaySearchResults(data.tracks.items);
    } catch (error) {
        console.error('Error searching for tracks:', error);
        alert('Failed to fetch search results. Please try again later.');
    }
}


async function createPlaylist() {
    const playlistInput = document.getElementById('playlistInput').value;

    if (!playlistInput) {
        alert('Please enter a playlist name.');
        return;
    }

    try {
        const accessToken = new URLSearchParams(window.location.search).get('access_token');
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: playlistInput,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create playlist');
        }

        alert(`Playlist "${playlistInput}" created successfully!`);
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist. Please try again later.');
    }
}

function displaySearchResults(tracks) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    tracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.innerHTML = `<p>${track.name} - ${track.artists[0].name}</p>`;
        searchResults.appendChild(trackItem);
    });
}

// Trigger the search function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    search();
});
