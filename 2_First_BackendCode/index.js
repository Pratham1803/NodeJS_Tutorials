const express = require('express'); // object of express module
require('dotenv').config(); // object of
const app = express();
const port = process.env.PORT || 3000;

const data = {
    "login": "Pratham1803",
    "id": 114798779,
    "node_id": "U_kgDOBtewuw",
    "avatar_url": "https://avatars.githubusercontent.com/u/114798779?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Pratham1803",
    "html_url": "https://github.com/Pratham1803",
    "followers_url": "https://api.github.com/users/Pratham1803/followers",
    "following_url": "https://api.github.com/users/Pratham1803/following{/other_user}",
    "gists_url": "https://api.github.com/users/Pratham1803/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Pratham1803/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Pratham1803/subscriptions",
    "organizations_url": "https://api.github.com/users/Pratham1803/orgs",
    "repos_url": "https://api.github.com/users/Pratham1803/repos",
    "events_url": "https://api.github.com/users/Pratham1803/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Pratham1803/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Pratham Rathod",
    "company": null,
    "blog": "",
    "location": "Khambhat",
    "email": null,
    "hireable": null,
    "bio": "I am passionate in developing Applications and  Android App development using Firebase and having knowledge of .NET.",
    "twitter_username": null,
    "public_repos": 21,
    "public_gists": 0,
    "followers": 0,
    "following": 1,
    "created_at": "2022-10-01T06:53:46Z",
    "updated_at": "2024-12-16T23:20:12Z"
}

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/youtube', (req, res) => {
    res.send("<h1>Here is The YouTube</h1>")
})

app.get('/google', (req, res) => {
    res.send('<a href="https://www.google.com/">Google</a>')
})

app.get('/github', (req, res) => {
    res.json(data);
})

app.listen(port, () => {
    console.log(`Example app listning on Port = ${port}`);
})