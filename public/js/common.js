const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ko-KR';

recognition.onstart = () => {
    document.getElementsByClassName("ai-character")[0].src = "images/character_write.gif";
};

recognition.onend = () => {
    document.getElementsByClassName("ai-character")[0].src = "images/character_base.png";
};

recognition.onresult = (event) => {
    answer(event.results[0][0].transcript);
};

document.getElementById("submit-text-input").addEventListener("click", function() {
    answer(document.getElementById("text-input").value);
    document.getElementById("text-input").value = "";
});

function answer(userInput) {
    aiQuestion = document.getElementById('question-text').innerText;

    document.getElementById('question-text').innerHTML += `<br><br><p>${userInput}</p>`;
    
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('question-text').innerHTML = data.reply;
        askQuestion(data.reply);
        setTimeout(function() {
            saveRecord(aiQuestion, userInput);
        }, 3000);
    })
    .catch(error => console.error('Error:', error));
}

function saveRecord(aiQuestion, userAnswer) {
    fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aiQuestion, userAnswer })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Record saved successfully.');
        }
    })
    .catch(error => console.error('Error:', error));
    // Logic to save the record here
}
