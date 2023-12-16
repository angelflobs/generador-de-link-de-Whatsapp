var messages = [];

function addMessage() {
    var phoneNumberInput = document.getElementById("phoneNumber");
    var titleInput = document.getElementById("title");
    var titleValue = titleInput.value.trim();
    var messageInput = document.getElementById("message");
    var messageValue = messageInput.value.trim();

    if (messageValue !== "" && titleValue !== "") {
        messages.push({ title: titleValue, message: messageValue });
        titleInput.value = "";
        messageInput.value = "";
        updateMessagesContainer();
    }
}

function updateMessagesContainer() {
    var messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = "";

    messages.forEach(function (message, index) {
        var messageDiv = document.createElement("div");
        messageDiv.className = "message-container";
        messageDiv.innerHTML = `<p><strong>${message.title}</strong></p><p>${message.message}</p>`;

        var linkButton = document.createElement("button");
        linkButton.className = "link-button";
        linkButton.innerHTML = "🔗";
        linkButton.onclick = function () {
            copyToClipboard(`https://wa.me/${encodeURIComponent(document.getElementById("phoneNumber").value)}?text=${encodeURIComponent(message.message)}`);
        };

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = function () {
            messages.splice(index, 1);
            updateMessagesContainer();
        };

        messageDiv.appendChild(linkButton);
        messageDiv.appendChild(deleteButton);
        messagesContainer.appendChild(messageDiv);
    });
}

function generateLinks() {
    var phoneNumber = encodeURIComponent(document.getElementById("phoneNumber").value);
    var generatedLinksContainer = document.getElementById("generatedLinks");
    generatedLinksContainer.innerHTML = "";

    messages.forEach(function (message, index) {
        var messageLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message.message)}`;
        var linkDiv = document.createElement("div");
        linkDiv.innerHTML = `<p><strong>${message.title}</strong></p><p>${messageLink}</p>`;
        generatedLinksContainer.appendChild(linkDiv);
    });

    document.getElementById("result").style.display = "block";
}

function downloadTxt() {
    var txtContent = "";
    messages.forEach(function (message, index) {
        var phoneNumber = encodeURIComponent(document.getElementById("phoneNumber").value);
        var messageLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message.message)}`;
        txtContent += `${message.title}\n${messageLink}\n\n`;
    });

    var blob = new Blob([txtContent], { type: "text/plain" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "mensajes_y_enlaces.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function validateNumberInput(input) {
    // Permitir solo números y mostrar un mensaje si se ingresan otros caracteres
    input.value = input.value.replace(/[^\d]/g, "");
    if (input.value === "") {
        input.setCustomValidity("Ingrese solo números.");
    } else {
        input.setCustomValidity("");
    }
}

function resetData() {
    // Limpiar los datos generados, incluyendo los mensajes
    document.getElementById("phoneNumber").value = "";
    document.getElementById("title").value = "";
    document.getElementById("message").value = "";
    document.getElementById("result").style.display = "none";
    messages = [];  // Limpiar mensajes al restablecer datos
    updateMessagesContainer();
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    document.body.removeChild(textArea);
}
