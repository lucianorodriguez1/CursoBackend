document.getElementById('verification-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const verificationCode = document.getElementById('verification-code').value;
    const messageElement = document.getElementById('message');

    try {
        const response = await fetch('/api/sessions/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: verificationCode,
            }),
        });

        const data = await response.json();
        
        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            setTimeout(() => {
                window.location.href = "/";
            }, 3000); // 3000 milisegundos = 3 segundos
        } else {
            messageElement.textContent = data.message;
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'Ocurrió un error al verificar el código.';
        messageElement.style.color = 'red';
    }
});