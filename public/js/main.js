// document.getElementById('start-button').addEventListener('click', () => {
//     document.getElementById('start-menu').style.display = 'none';
//     document.getElementById('question-page').style.display = 'block';
//     askQuestion();
// });

// document.getElementById('view-records-button').addEventListener('click', () => {
//     document.getElementById('start-menu').style.display = 'none';
//     document.getElementById('calendar-page').style.display = 'block';
//     renderCalendar();
// });

// document.getElementById('back-button').addEventListener('click', () => {
//     document.getElementById('calendar-page').style.display = 'none';
//     document.getElementById('start-menu').style.display = 'block';
// });

// document.getElementById('mic-button').addEventListener('click', () => {
//     recognition.start();
// });

// document.getElementById('back-to-calendar').addEventListener('click', () => {
//     document.getElementById('record-detail').style.display = 'none';
//     document.getElementById('calendar').style.display = 'block';
// });

// const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
// recognition.lang = 'ko-KR';

// recognition.onresult = (event) => {
//     const speechToText = event.results[0][0].transcript;
//     document.getElementById('question-text').innerHTML += `<p>User: ${speechToText}</p>`;
    
//     fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ message: speechToText })
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('question-text').innerHTML += `<p>AI: ${data.reply}</p>`;
//         askQuestion(data.reply);
//         saveRecord(speechToText, data.reply);
//     })
//     .catch(error => console.error('Error:', error));
// };

// function askQuestion(questionText = "안녕하세요, AI 저서전 코디네이터 '보미'라고 합니다.") {
//     fetch('/api/tts', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ text: questionText })
//     })
//     .then(response => response.json())
//     .then(data => {
//         const audio = new Audio(data.audioUrl);
//         audio.play();
//         document.getElementById('question-text').innerText = questionText;
//     })
//     .catch(error => console.error('Error:', error));
// }

// function saveRecord(userText, aiText) {
//     fetch('/api/records', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userText, aiText })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             console.log('Record saved successfully.');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }

// function renderCalendar() {
//     fetch('/api/records')
//     .then(response => response.json())
//     .then(data => {
//         const records = data.records;
//         const calendar = document.getElementById('calendar');
//         calendar.innerHTML = '';

//         const months = {};
//         records.forEach(record => {
//             const date = new Date(record.date);
//             const month = date.toLocaleString('default', { month: 'long' });
//             const year = date.getFullYear();
//             const day = date.getDate();
            
//             if (!months[year]) months[year] = {};
//             if (!months[year][month]) months[year][month] = [];
            
//             months[year][month].push({ day, record });
//         });

//         Object.keys(months).forEach(year => {
//             Object.keys(months[year]).forEach(month => {
//                 const monthDiv = document.createElement('div');
//                 monthDiv.classList.add('calendar-month');
//                 monthDiv.innerHTML = `<h3>${month} ${year}</h3>`;
                
//                 const grid = document.createElement('div');
//                 grid.classList.add('calendar-grid');
                
//                 months[year][month].forEach(({ day, record }) => {
//                     const dayDiv = document.createElement('div');
//                     dayDiv.classList.add('calendar-day');
//                     dayDiv.innerText = day;
                    
//                     if (record) {
//                         dayDiv.classList.add('recorded');
//                         dayDiv.addEventListener('click', () => showRecord(record));
//                     }
                    
//                     grid.appendChild(dayDiv);
//                 });
                
//                 monthDiv.appendChild(grid);
//                 calendar.appendChild(monthDiv);
//             });
//         });
//     })
//     .catch(error => console.error('Error:', error));
// }

// function showRecord(record) {
//     document.getElementById('calendar').style.display = 'none';
//     document.getElementById('record-detail').style.display = 'block';
    
//     document.getElementById('record-text').innerText = `User: ${record.userText}\nAI: ${record.aiText}`;
//     document.getElementById('record-audio').src = record.audioUrl;
// }
