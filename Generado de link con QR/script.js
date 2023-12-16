// var messages = [];
// var pdf = new jsPDF();

var messages = [];
var pdf = null;

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

        var titleParagraph = document.createElement("p");
        titleParagraph.innerHTML = `<strong>${message.title}</strong>`;
        messageDiv.appendChild(titleParagraph);

        var messageParagraph = document.createElement("p");
        messageParagraph.textContent = message.message;
        messageDiv.appendChild(messageParagraph);

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

    // Actualizar QR junto al resultado
    generateQRCode(messages, document.getElementById("qrcode-container"));
}

function generateQRCode(messages, qrContainer) {
    // Limpiar contenedor
    qrContainer.innerHTML = "";

    messages.forEach(function (message) {
        var messageLink = `https://wa.me/${encodeURIComponent(document.getElementById("phoneNumber").value)}?text=${encodeURIComponent(message.message)}`;
        var qrDiv = document.createElement("div");
        var qrCanvas = document.createElement("canvas");

        qrDiv.innerHTML = `<p><strong>${message.title}</strong></p>`;
        qrDiv.appendChild(qrCanvas);
        qrContainer.appendChild(qrDiv);

        // Generar QR Code y agregarlo al contenedor
        new QRCode(qrCanvas, {
            text: messageLink,
            width: 128,
            height: 128
        });
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

    downloadFile(txtContent, "mensajes_y_enlaces.txt", "text/plain");
}

function downloadPdf() {
    var pdfContent = "";
    messages.forEach(function (message, index) {
        var phoneNumber = encodeURIComponent(document.getElementById("phoneNumber").value);
        var messageLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message.message)}`;
        pdfContent += `${message.title}\n${messageLink}\n\n`;
    });

    if (typeof jsPDF !== 'undefined') {
        var pdfOptions = {
            margin: 10,
            filename: "mensajes_y_enlaces.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        // Añadir QR y crear PDF con html2pdf
        var qrContainer = document.getElementById("qrcode-container");
        generateQRCode(messages, qrContainer);
        pdf = html2pdf().from(qrContainer).outputPdf();

        downloadFile(pdf, pdfOptions.filename, "application/pdf");
    } else {
        console.error('La biblioteca jsPDF no está definida. Asegúrate de que se haya cargado correctamente.');
    }
}

function downloadFile(content, fileName, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    document.body.removeChild(textArea);
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
