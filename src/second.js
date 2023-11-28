function goBack() {
    // Main 프로세스에 'menu-click' 이벤트를 전송하여 메뉴 1 화면으로 이동
    require('electron').ipcRenderer.send('menu-click', 1);
}