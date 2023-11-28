const { ipcRenderer } = require('electron');
const axios = require('axios');

require('dotenv').config();

window.onload = () => {
    const searchInput = document.getElementById('search-input');
    const indexDisplay = document.getElementById('summoner-info');

    const headers = {'X-Riot-Token': process.env.API_KEY}

    const performSearch = async () => {
        const inputValue = searchInput.value;
        const riotID = inputValue.match(/([^#]+)#([A-Z0-9]+)/);

        const gameName = riotID[1];
        const tagLine = riotID[2];

        try {
            const response = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
                headers: headers,
            });
    
            const summonerInfoByID = response.data;
            const encryptedPUUID = summonerInfoByID.puuid;

            const response2 = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}`, {
                headers: headers
            });
            
            const summonerInfoByPUUID = response2.data;

            indexDisplay.innerHTML = `
            <html>
            <head>
                <link rel="stylesheet" href="index.css">
            </head>
            <body>
                <div>
                    <h1>${summonerInfoByPUUID.name}</h1>
                    <h2>${summonerInfoByPUUID.summonerLevel}</h2>
                    <h3>${summonerInfoByPUUID.profileIconId}</h3>
                </div>
            </body>
            </html>
        `;
        } catch (error) {
            console.error('Error fetching player information:', error.message);
            indexDisplay.textContent = '플레이어 정보를 가져오지 못했습니다.';
        } 
    };

    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            performSearch();
        }
    });
};