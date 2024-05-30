document.getElementById('mic-button').addEventListener('click', () => {
    recognition.start();
});

document.getElementById('home-button').addEventListener('click', () => {
    document.getElementById('question-page').style.display = 'none';
    document.getElementById('start-menu').style.display = 'block';
});

function askQuestion(questionText = "안녕하세요, 감정 일기장 코디네이터 '보미'라고 합니다.") {
    fetch('/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: questionText })
    })
    .then(response => response.json())
    .then(data => {
        const audio = new Audio(data.audioUrl);
        audio.play();
        document.getElementById('question-text').innerText = questionText;
    })
    .catch(error => console.error('Error:', error));
}
