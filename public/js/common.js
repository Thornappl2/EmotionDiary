const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ko-KR';

recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    document.getElementById('question-text').innerHTML += `<br><br><p>User: ${speechToText}</p>`;
    
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: speechToText })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('question-text').innerHTML += `<p>AI: ${data.reply}</p>`;
        askQuestion(data.reply);
        saveRecord(speechToText, data.reply);
    })
    .catch(error => console.error('Error:', error));
};

function saveRecord(userText, aiText) {
    fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userText, aiText })
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
