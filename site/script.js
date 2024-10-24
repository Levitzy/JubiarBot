document.addEventListener('DOMContentLoaded', () => {
    axios.get('/api/info')
        .then(response => {
            const data = response.data;
            document.getElementById('botName').textContent = data.botName;
            document.getElementById('accessTokenStatus').textContent = data.accessTokenStatus;
            document.getElementById('totalCommands').textContent = data.totalCommands;
        })
        .catch(error => {
            console.error('Error fetching bot information:', error);
            document.getElementById('botName').textContent = 'Error';
            document.getElementById('accessTokenStatus').textContent = 'Error';
            document.getElementById('totalCommands').textContent = 'Error';
        });
});
