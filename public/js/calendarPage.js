// calendarPage.js

document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('calendar-page').style.display = 'none';
    document.getElementById('start-menu').style.display = 'block';
});

document.getElementById('back-to-calendar').addEventListener('click', () => {
    document.getElementById('record-detail').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';
    document.getElementById('back-button').style.display = 'block';
});

function renderCalendar() {
    fetch('/api/records')
    .then(response => response.json())
    .then(data => {
        const records = data.records;
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        const months = {};
        records.forEach(record => {
            const date = new Date(record.date);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const day = date.getDate();
            
            if (!months[year]) months[year] = {};
            if (!months[year][month]) months[year][month] = [];
            
            months[year][month].push({ day, record });
        });

        Object.keys(months).forEach(year => {
            Object.keys(months[year]).forEach(month => {
                const monthDiv = document.createElement('div');
                monthDiv.classList.add('calendar-month');
                monthDiv.innerHTML = `<h3>${month} ${year}</h3>`;
                
                const grid = document.createElement('div');
                grid.classList.add('calendar-grid');
                
                months[year][month].forEach(({ day, record }) => {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('calendar-day');
                    dayDiv.innerText = day;

                    if (record) {
                        dayDiv.classList.add('recorded');
                        dayDiv.addEventListener('click', () => showRecord(record));
                    }
                    
                    grid.appendChild(dayDiv);
                });
                
                monthDiv.appendChild(grid);
                calendar.appendChild(monthDiv);
            });
        });
    })
    .catch(error => console.error('Error:', error));
}

function showRecord(record) {
    document.getElementById('calendar').style.display = 'none';
    document.getElementById('record-detail').style.display = 'block';
    document.getElementById('back-button').style.display = 'none';

    fetch('/api/find_out_emotion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userAnswer: record.userAnswer })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("find-out-emotion").innerText = "감정에 대한 AI의 의견 :" + data.reply;

        fetch('/api/find_out_reason', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userAnswer: record.userAnswer, emotions: data.reply })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("find-out-reason").innerText = "원인에 대한 AI의 의견 :" + data.reply;
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
    
    document.getElementById('record-text').innerText = `AI: ${record.aiQuestion}\nUser: ${record.userAnswer}`;
    document.getElementById('record-audio').src = record.audioUrl;
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});
