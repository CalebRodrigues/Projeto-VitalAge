var firebaseConfig = {
  apiKey: "AIzaSyBb7OoZjFjfJlbOQvtpPH7hGDpxY5giDNI",
  authDomain: "vitalage-site.firebaseapp.com",
  projectId: "vitalage-site",
  storageBucket: "vitalage-site.appspot.com",
  messagingSenderId: "9825977049",
  appId: "1:9825977049:web:14cc2655ba499336acb4c8"
};

// Inicializando o app do Firebase
firebase.initializeApp(firebaseConfig);

// Verificando o estado de autenticação do usuário
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
  var uid = user.uid;
  var var_list = document.getElementById("heart-rate-list");
  var batimentosRef = firebase.database().ref('users/' + uid + '/heartbeats');

  batimentosRef.on('child_added', function(snapshot) {
    var batimentoData = snapshot.val();
    var batimento = batimentoData.bpm;
    var timestamp = batimentoData.timestamp;
  
    var listItem = document.createElement("li");
  
    // Criar a imagem de coração
    var heartIcon = document.createElement("div");
    heartIcon.className = "heart-icon";
    var img = document.createElement("img");
    img.src = "./img/coracao-registros.png";
    img.alt = "Coração";
    heartIcon.appendChild(img);
  
    // Criar elemento para exibir o BPM
    var bpmElement = document.createElement("span");
    bpmElement.className = "bpm";
    bpmElement.textContent = batimento;
  
    // Criar ícone de relógio
    var clockIcon = document.createElement("div");
    clockIcon.className = "clock-icon";
    var clockImg = document.createElement("img");
    clockImg.src = "./img/relogio.png"; // Substitua pelo caminho do ícone de relógio
    clockImg.alt = "Relógio";
    clockIcon.appendChild(clockImg);
  
    // Exibir o horário do timestamp
    var timeElement = document.createElement("span");
    timeElement.className = "time";
    timeElement.textContent = formatDate(timestamp).split(" - ")[1]; // Para exibir apenas o horário
  
    // Criar ícone de calendário
    var calendarIcon = document.createElement("div");
    calendarIcon.className = "calendar-icon";
    var calendarImg = document.createElement("img");
    calendarImg.src = "./img/calendario.png"; // Substitua pelo caminho do ícone de calendário
    calendarImg.alt = "Calendário";
    calendarIcon.appendChild(calendarImg);
  
    // Exibir a data do timestamp
    var dateElement = document.createElement("span");
    dateElement.className = "date";
    dateElement.textContent = formatDate(timestamp).split(" - ")[0]; // Para exibir apenas a data
  
    // Criar ícone de lixeira
  var deleteIcon = document.createElement("div");
  deleteIcon.className = "delete-icon";
  var trashImg = document.createElement("img");
  trashImg.src = "./img/lixo.png";
  trashImg.alt = "Apagar";
  deleteIcon.appendChild(trashImg);

  // Adicionar um evento de clique ao ícone de lixeira
  deleteIcon.addEventListener("click", function() {
    // Obtém a chave do registro a ser excluído
    var recordKey = snapshot.key;

    // Referência ao registro no banco de dados
    var recordRef = batimentosRef.child(recordKey);

    // Remove o registro do banco de dados
    recordRef.remove()
      .then(function() {
        // Remove o item da lista na interface do usuário
        listItem.remove();
      })
      .catch(function(error) {
        console.error("Erro ao excluir o registro:", error);
      });
  });
  
    // Adicionar os elementos à lista
    listItem.appendChild(heartIcon);
    listItem.appendChild(bpmElement);
    listItem.appendChild(calendarIcon);
    listItem.appendChild(dateElement);
    listItem.appendChild(clockIcon);
    listItem.appendChild(timeElement);
    listItem.appendChild(deleteIcon);
  
    var heartRateList = document.getElementById("heart-rate-list");
    heartRateList.appendChild(listItem);
  });
  

  var firestore = firebase.firestore();
  var usuarioRef = firestore.collection('usuarios').doc(uid);

  usuarioRef.get().then(function(doc) {
    if (doc.exists) {
      var usuario = doc.data().usuario;
      document.getElementById('user-name').textContent = usuario;
    } else {
      console.log("O documento não foi encontrado!");
    }
  }).catch(function(error) {
    console.log("Erro ao acessar o documento:", error);
  });

  document.getElementById('logout-button').addEventListener('click', function() {
    firebase.auth().signOut()
      .then(function() {
        console.log('Logout realizado com sucesso!');
        window.location.href = '../index.html';
      })
      .catch(function(error) {
        console.error('Erro ao realizar logout:', error);
      });
  });
} else {
  console.log('Usuário não autenticado. Redirecionando para a página de login...');
  window.location.href = '../index.html';
}
});

function formatDate(timestamp) {
const date = new Date(timestamp);
const day = date.getDate().toString().padStart(2, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const year = date.getFullYear();
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const seconds = date.getSeconds().toString().padStart(2, '0');

return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

const adicionarBPMButton = document.getElementById("adicionarBPMButton");
adicionarBPMButton.addEventListener("click", function() {
  window.location.href = "./adicionarBPM.html";
});