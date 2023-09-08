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

            // Criar o botão "Ver Gráfico"
            var verGraficoButton = document.createElement("button");
            verGraficoButton.className = "view-button";
            verGraficoButton.textContent = "Ver mais";
            verGraficoButton.addEventListener("click", function() {
                // Aqui você pode redirecionar para a página de gráfico com os dados relevantes
                // por exemplo, você pode usar o timestamp ou o batimento selecionado
            });

            // Adicionar os elementos à lista
            heartRateInfo.appendChild(batimentoElement);
            listItem.appendChild(heartIcon);
            listItem.appendChild(heartRateInfo);
            listItem.appendChild(verGraficoButton);

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
    var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}