const { ipcRenderer } = require('electron');
const axios = require('axios');
require('dotenv').config();

window.onload = () => {
    const searchInput = document.getElementById('search-input');
    const summonerIcon = document.getElementById('summoner-icon');
    const summonerLevel = document.getElementById('summoner-level');
    const summonerName = document.getElementById('summoner-name');

    // 엔터로 검색
    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            const input = searchInput.value;
            ipcRenderer.send('performSearch', input);
        }
    });
    
    // 소환사 정보 받아오기 (검색 결과)
    ipcRenderer.on('searchResult', async (event, result) => {
        if (result.error) {
            console.error('Error fetching player information:', result.error);
            summonerInfoDisplay.textContent = '검색 결과가 존재하지 않습니다.';
            return;
        }

        console.log(result);

        // 소환사 아이콘, 닉네임, 레벨 표시
        summonerIcon.src = `http://ddragon.leagueoflegends.com/cdn/13.23.1/img/profileicon/${result.profileIconId}.png`;
        summonerName.innerText = result.name;
        summonerLevel.innerText = result.summonerLevel;
        
        // 실시간 게임 불러오기
        const headers = {'X-Riot-Token': process.env.API_KEY};
        const response = await axios.get(`https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${result.id}`, {
            headers: headers
        });

        const activeGame = response.data;

        console.log(activeGame);
        
        /* ipcRenderer.on('success', (event, arg) => {
            console.log("aaaa");
            console.log(arg);

            championTopName.innerText = arg;
        })

        ipcRenderer.send('success', '탑 이름은' + result.name + '입니다.');
        */
    });
};
