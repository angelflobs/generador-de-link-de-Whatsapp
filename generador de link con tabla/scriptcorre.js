var countryCode, phoneNumber, selectedMessage;

function addRow() {
  var table = document.getElementById("productTable").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.rows.length);
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  cell1.innerHTML = '<input type="text" placeholder="Ingresa título">';
  cell2.innerHTML = '<input type="text" placeholder="Ingresa producto o servicio">';
}

function deleteRow() {
    var table = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    if (table.rows.length > 1) {
      table.deleteRow(table.rows.length - 1);
    }
  }

 
  
//   function startOver() {
//     var table = document.getElementById("productTable").getElementsByTagName('tbody')[0];
//     while (table.rows.length > 1) {
//       table.deleteRow(table.rows.length - 1);
//     }
//     document.getElementById("countryCode").value = "";
//     document.getElementById("phoneNumber").value = "";
//     document.getElementById("messageSelect").value = "";
//     document.getElementById("result").style.display = "none";
//   }

// 

function startOver() {
    var table = document.getElementById("productTable").getElementsByTagName('tbody')[0];
    while (table.rows.length > 1) {
      table.deleteRow(table.rows.length - 1);
    }
  
    // Limpiar valores en el formulario
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
      var inputs = rows[i].getElementsByTagName("input");
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].value = "";
      }
    }
  
    // Restaurar el mensaje predeterminado en messageSelect
    document.getElementById("messageSelect").value = "Selecciona mensaje";
  
    // Limpiar otros campos
    document.getElementById("countryCode").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("result").style.display = "none";
  }
  

function verifyAndGenerateLink() {
  // Obtener valores
  countryCode = document.getElementById("countryCode").value;
  phoneNumber = document.getElementById("phoneNumber").value;
  selectedMessage = document.getElementById("messageSelect").value;

  // Verificar que se ingrese el número móvil
  if (!countryCode || !phoneNumber) {
    console.error("Ingresa el número móvil.");
    return;
  }

  // Construir resultado
  var resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<h2>Resultado:</h2>";
  var table = "<table><thead><tr><th>Título</th><th>Texto</th><th>Enlace</th><th>Copiar</th></tr></thead><tbody>";

  // Iterar sobre filas de la tabla
  var productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
  for (var i = 0; i < productTable.rows.length; i++) {
    var title = productTable.rows[i].cells[0].getElementsByTagName('input')[0].value;
    var text = productTable.rows[i].cells[1].getElementsByTagName('input')[0].value;

    // Verificar que se ingrese algún dato en las filas
    if (!title && !text) {
      console.error("Por favor, ingresa algún dato en las filas.");
      return;
    }

    // Construir enlace de WhatsApp
    var whatsappLink = "https://wa.me/" + countryCode + phoneNumber + "?text=" + encodeURIComponent(selectedMessage + " " + text);

    // Agregar fila al resultado
    table += "<tr><td>" + title + "</td><td>" + text + "</td><td><span id='link" + i + "'>" + whatsappLink + "</span></td><td><button class='copy-btn' onclick='copyLink(" + i + ")'><i class='fas fa-link'></i></button></td></tr>";
  }

  table += "</tbody></table>";
  resultContainer.innerHTML += table;
  resultContainer.style.display = "block";
}

function copyLink(rowNumber) {
  var linkSpan = document.getElementById("link" + rowNumber);
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = linkSpan.innerText;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  alert("Enlace copiado al portapapeles");
}

// function downloadTxtFile() {
//   var resultTable = document.getElementById("result").getElementsByTagName('table')[0];
//   var rows = resultTable.rows;
//   var content = "Enlace de Whatsapp generado:\n\n";

//   for (var i = 0; i < rows.length; i++) {
//     content += "Título: " + rows[i].cells[0].innerText + "\n";
//     content += "Textoa enviar: " + rows[i].cells[1].innerText + "\n";
//     content += "Enlace: " + rows[i].cells[2].innerText + "\n\n";
//   }

//   var blob = new Blob([content], { type: "text/plain" });
//   var url = URL.createObjectURL(blob);
//   var a = document.createElement("a");
//   a.href = url;
//   a.download = "whatsapp_links.txt";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// }

// function downloadTxtFile() {
//     var resultTable = document.getElementById("result").getElementsByTagName('table')[0];
//     var rows = resultTable.rows;
//     var content = "Enlaces de Whatsapp generados:\n\n";
  
//     for (var i = 0; i < rows.length; i++) {
//       content += "Título: " + rows[i].cells[0].innerText + "\n";
//       content += "Textoa enviar: " + rows[i].cells[1].innerText + "\n";
//       content += "Enlace: " + rows[i].cells[2].innerText + "\n\n";
//     }
  
//     var blob = new Blob([content], { type: "text/plain" });
//     var url = URL.createObjectURL(blob);
//     var a = document.createElement("a");
//     a.href = url;
//     a.download = "whatsapp_links.txt";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   }

function downloadTxtFile() {
    var resultTable = document.getElementById("result").getElementsByTagName('table')[0];
    var rows = resultTable.rows;
    var content = "Enlace de Whatsapp generado:\n\n";
  
    // Comenzamos desde i = 1 para omitir la fila con los encabezados
    for (var i = 1; i < rows.length; i++) {
      content += "Título: " + rows[i].cells[0].innerText + "\n";
      content += "Texto a enviar: " + rows[i].cells[1].innerText + "\n";
      content += "Enlace: " + rows[i].cells[2].innerText + "\n\n";
    }
  
    var blob = new Blob([content], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "Links_de_Whatsapp.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  
