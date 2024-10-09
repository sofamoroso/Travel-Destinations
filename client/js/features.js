document.addEventListener('DOMContentLoaded', () => {
    const topCountriesBtn = document.getElementById('top-countries-btn');
    const topUsersBtn = document.getElementById('top-users-btn');

    topCountriesBtn.addEventListener('click', () => {
        toggleButtonContent(topCountriesBtn, loadTopCountries);
    });

    topUsersBtn.addEventListener('click', () => {
        toggleButtonContent(topUsersBtn, loadTopUsers);
    });

    function toggleButtonContent(button, loadContent) {
        const expandableContent = button.querySelector('.expandable-content');
        
        if (button.classList.contains('expanded')) {
            button.classList.remove('expanded');
            expandableContent.innerHTML = '';
        } else {
            button.classList.add('expanded');
            loadContent(expandableContent);
        }
    }

    async function loadTopCountries(container) {
        try {
            const response = await fetch('/api/top-countries');
            const data = await response.json();
            console.log(data);
            
            let content = ``;
            data.forEach(item => {
                content += `${item._id}: ${item.count} <br>`;
            });
            container.innerHTML = content;
        } catch (error) {
            container.innerHTML = `<p>Error loading data: ${error.message}</p>`;
        }
    }

    async function loadTopUsers(container) {
        try {
            const response = await fetch('/api/top-users');
            const data = await response.json();
            console.log(data);
            
            let content = ``;
            data.forEach(item => {
                content += `${item.username}: ${item.count} <br>`;
            });
            container.innerHTML = content;
        } catch (error) {
            container.innerHTML = `<p>Error loading data: ${error.message}</p>`;
        }
    }
});