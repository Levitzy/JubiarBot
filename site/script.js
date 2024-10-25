document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

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

    axios.get('/api/info')
        .then(response => {
            const data = response.data;
            updateInfo('botName', data.botName);
            updateInfo('accessTokenStatus', data.accessTokenStatus);
            updateInfo('totalCommands', data.totalCommands);

            if (data.accessTokenStatus === 'Valid') {
                document.getElementById('accessTokenStatus').classList.add('valid');
            } else {
                document.getElementById('accessTokenStatus').classList.add('invalid');
            }
        })
        .catch(error => {
            showError('Error fetching bot information: ' + error.message);
        });
});