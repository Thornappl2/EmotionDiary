document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('question-page').style.display = 'block';
    askQuestion(document.getElementById('question-text').innerText);
});

document.getElementById('view-records-button').addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('calendar-page').style.display = 'block';
    renderCalendar();
});
