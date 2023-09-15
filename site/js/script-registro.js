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
            img.src = "./img/coracao-registros.png"; // Substitua pelo caminho da imagem do coração
            img.alt = "Coração";
            heartIcon.appendChild(img);

            // Criar informações de batimento
            var heartRateInfo = document.createElement("div");
            heartRateInfo.className = "heart-rate-info";

            // Criar elemento para exibir apenas o número do batimento
            var batimentoElement = document.createElement("span");
            batimentoElement.className = "batimento";
            batimentoElement.textContent = batimento;

            // Criar elemento para exibir a data e hora
            var timeElement = document.createElement("p");
            timeElement.className = "time";
            timeElement.textContent = formatDate(timestamp);
           
            // Adicionar os elementos à lista
            heartRateInfo.appendChild(batimentoElement);
            heartRateInfo.appendChild(timeElement);
            listItem.appendChild(heartIcon);
            listItem.appendChild(heartRateInfo);

            var_list.appendChild(listItem);
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
    var date = new Date(timestamp);
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are 0-based, so we add 1
    var year = date.getFullYear();

    return `${day}/${month}/${year}`;
}