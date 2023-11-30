const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
require('dotenv').config();

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('performSearch', async (event, input) => {
        const headers = {'X-Riot-Token': process.env.API_KEY};
        const riotID = input.match(/([^#]+)#([A-Z0-9]+)/);

        const gameName = riotID[1];
        const tagLine = riotID[2];

        // 소환사 닉네임으로 정보 가져오기
        const response = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
            headers: headers,
        });

        const summonerInfoByID = response.data;

        const encryptedPUUID = summonerInfoByID.puuid;

        // 소환사 puuid로 소환사 정보 가져오기
        const response2 = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}`, {
            headers: headers
        });

        const result = response2.data;
        
        // 소환사 정보 전송
        event.reply('searchResult', result);
    });

    ipcMain.on('success', (event, arg) => {
        console.log('new user: ', arg);
        event.reply('success', arg);
    });
});
