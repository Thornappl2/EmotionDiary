document.getElementById('mic-button').addEventListener('click', () => {
    recognition.start();
});

document.getElementById('home-button').addEventListener('click', () => {
    document.getElementById('question-page').style.display = 'none';
    document.getElementById('start-menu').style.display = 'block';
});

function askQuestion(questionText) {
    fetch('/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: questionText })
    })
    .then(response => response.json())
    .then(data => {
        const audio = new Audio(data.audioUrl);
        audio.addEventListener("play", function() {
            document.getElementsByClassName("ai-character")[0].src = "images/character_talk.gif";
        });
        audio.addEventListener("ended", function() {
            document.getElementsByClassName("ai-character")[0].src = "images/character_base.png";
        });
        audio.volume = 0.05;
        audio.play();
        document.getElementById('question-text').innerText = questionText;
    })
    .catch(error => console.error('Error:', error));
}
