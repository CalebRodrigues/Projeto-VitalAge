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
            listItem.textContent = "Batimento: " + batimento + ", Data: " + formatDate(timestamp);
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
    var date = new Date(timestamp * 1000);
    var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    return date.toLocaleDateString('pt-BR', options);
}