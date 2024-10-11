function openTab(evt, tabName) {
    // Скрываем все табы
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Убираем активный класс с кнопок
    const tablinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Показываем выбранный таб и добавляем активный класс
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Функция для шифрования текста
async function encryptText() {
    const text = document.getElementById('text-input').value;
    const mixing = document.getElementById('mixing-input').value;
    const key = document.getElementById('key-input').value;

    const response = await fetch('/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, mixing, key }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    document.getElementById('result').innerText = `Зашифрованный текст: ${data.result}`;
}

// Функция для расшифровки текста
async function decryptText() {
    const text = document.getElementById('decrypt-input').value;

    const response = await fetch('/decrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    document.getElementById('decrypt-result').innerText = `Расшифрованный текст: ${data.result}`;
}
