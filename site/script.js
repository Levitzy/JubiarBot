// script.js
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const restartBotButton = document.getElementById('restartBotButton');
    const body = document.body;

    restartBotButton.addEventListener('click', () => {
        axios.post('/api/restartBot')
            .then(response => {
                alert(response.data.message); // Show success message
                location.reload(); // Reload the page to fetch updated command list
            })
            .catch(error => {
                alert('Error restarting the bot: ' + error.message); // Show error message
            });
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('darkMode', null);
            darkModeToggle.textContent = '🌙';
        }
    });

    function updateInfo(id, value) {
        const element = document.getElementById(id);
        element.textContent = value;
        element.classList.add('loaded');
    }

    function showError(message) {
        const elements = ['botName', 'accessTokenStatus', 'totalCommands'];
        elements.forEach(id => {
            updateInfo(id, 'Error');
            document.getElementById(id).classList.add('error');
        });
        console.error(message);
    }

    function updateCommandList(commands) {
        const commandList = document.getElementById('commandList');
        commandList.innerHTML = '';
        commands.forEach(command => {
            const div = document.createElement('div');
            div.className = 'command-item';
            div.innerHTML = `<span>${command}</span>`;
            commandList.appendChild(div);
        });
    }
    // Fetch bot info for bot name, token status, and command list
    axios.get('/api/info')
        .then(response => {
            const data = response.data;
            updateInfo('botName', data.botName);
            updateInfo('accessTokenStatus', data.accessTokenStatus);
            updateInfo('totalCommands', data.totalCommands);

            if (data.accessTokenStatus === 'Good') {
                document.getElementById('accessTokenStatus').classList.add('valid');
            } else {
                document.getElementById('accessTokenStatus').classList.add('invalid');
            }

            if (data.commands && Array.isArray(data.commands)) {
                updateCommandList(data.commands);
            }
        })
        .catch(error => {
            showError('Error fetching bot information: ' + error.message);
        });
});
