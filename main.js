const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
require('dotenv').config();

function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('performSearch', async (event, inputValue) => {
    const headers = {'X-Riot-Token': process.env.API_KEY};
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

        event.sender.send('searchResult', summonerInfoByPUUID);
    } catch (error) {
        console.error('Error fetching player information:', error.message);
        event.sender.send('searchResult', { error: error.message });
    }
});
