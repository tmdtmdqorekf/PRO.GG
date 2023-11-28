const { ipcRenderer } = require('electron');

require('dotenv').config();

window.onload = () => {
    const searchInput = document.getElementById('search-input');
    const summonerInfoDisplay = document.getElementById('summoner-info');

    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            const inputValue = searchInput.value;
            ipcRenderer.send('performSearch', inputValue);
        }
    });
    
    ipcRenderer.on('searchResult', (event, result) => {
        if (result.error) {
            console.error('Error fetching player information:', result.error);
            summonerInfoDisplay.textContent = '플레이어 정보를 가져오지 못했습니다.';
            return;
        }

        // Update the innerHTML directly without the html and body tags
        summonerInfoDisplay.innerHTML = `
            <div>
                <h2>${result.summonerLevel}</h2>
                <img src="http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/${result.profileIconId}.png" alt="Profile Icon">
                <h1>${result.name}</h1>
            </div>
        `;
    });
};
