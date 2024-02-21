const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');
const path = require('path');

const app = express();
const PORT = 3000;

const publicDirectoryPath = path.join(__dirname, '..', 'public'); // Adjust the path to point to the 'public' directory

const CLIENT_ID = 'ac5e86a4a0b44e7dbcba7a7c3560e511';
const CLIENT_SECRET = '73e4b3d3c5414533ab89f5bbc2975161';
const REDIRECT_URI = 'http://localhost:3000/callback';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

app.use(express.static(publicDirectoryPath)); // Serve static files from the 'public' directory

app.get('/login', (req, res) => {
    const scopes = 'user-read-private user-read-email'; // Specify your desired scopes
    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scopes,
        redirect_uri: REDIRECT_URI,
        access_token: req.query.access_token, // Pass access token as a query parameter
    });
    res.redirect(`${SPOTIFY_AUTH_URL}?${queryParams}`);
});


app.get('/app.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, '..', 'src', 'app.js'));
});


app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Error: Missing authorization code');
    }

    const tokenParams = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
    };

    try {
        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: querystring.stringify(tokenParams),
        });

        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch access token: ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        res.redirect('/'); // Redirect to the main page after successful login
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error);
        res.status(500).send('Error exchanging authorization code for access token');
    }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
