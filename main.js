// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Ferramenta de pesquisa de produtos
document.querySelector(".form").addEventListener("submit", function (e) {
  e.preventDefault(); // Impede o envio do formulário

  const query = e.target.querySelector("input[name='q']").value.toLowerCase(); // Texto digitado
  const products = document.querySelectorAll(".product-card"); // Todos os produtos
  let found = false; // Controle para verificar se encontrou algo

  products.forEach(product => {
      const button = product.querySelector("button.add-to-cart"); // Botão do carrinho
      const name = button.dataset.name.toLowerCase(); // Nome do produto
      const category = product.dataset.category.toLowerCase(); // Categoria do produto

      // Mostra ou oculta o produto com base na busca
      if (name.includes(query) || category.includes(query)) {
          product.style.display = "block";
          found = true; // Produto encontrado
      } else {
          product.style.display = "none";
      }
  });

  // Se nenhum produto foi encontrado, exibe a mensagem
  const message = document.querySelector("#search-message");
  if (!found) {
      if (!message) {
          const notFoundMessage = document.createElement("p");
          notFoundMessage.id = "search-message";
          notFoundMessage.textContent = "Produto não encontrado.";
          notFoundMessage.style.color = "red";
          document.querySelector("#products-section").appendChild(notFoundMessage);
      }
  } else {
      // Remove a mensagem de "Produto não encontrado", caso exista
      if (message) {
          message.remove();
      }
  }
});

//Agendamento de Retiradas e Entregas
document.addEventListener("DOMContentLoaded", function () {
  // Configura o calendário para a data
  flatpickr("#date", {
      enableTime: false,
      dateFormat: "d/m/Y",
      minDate: "today", // Impede selecionar datas anteriores
  });

  // Configura o seletor de horário
  flatpickr("#time", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i", // Formato de hora (24h)
      time_24hr: true,   // Define formato de 24 horas
      minTime: "08:00",  // Horário inicial
      maxTime: "20:00",  // Horário final
  });

  // Manipula o envio do formulário
  document.querySelector("#schedule-form").addEventListener("submit", function (e) {
      e.preventDefault();
      
      const method = document.querySelector("#delivery-method").value;
      const date = document.querySelector("#date").value;
      const time = document.querySelector("#time").value;

      if (date && time) {
          alert(`Agendamento realizado com sucesso! 
          Forma de Recebimento: ${method} 
          Data: ${date} 
          Horário: ${time}`);
      } else {
          alert("Por favor, preencha todos os campos.");
      }
  });
});
