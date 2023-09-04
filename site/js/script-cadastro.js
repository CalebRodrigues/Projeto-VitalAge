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

// Referência para o serviço de autenticação
var auth = firebase.auth();
var firestore = firebase.firestore();

// Função para realizar o cadastro
function cadastrar() {
    var usuario = document.querySelector('input[name="usuario"]').value;
    var email = document.querySelector('input[name="email"]').value;
    var senha = document.querySelector('input[name="senha"]').value;

    auth.createUserWithEmailAndPassword(email, senha)
        .then(function(userCredential) {
            // Cadastro realizado com sucesso
            var user = userCredential.user;
            console.log("Cadastro realizado com sucesso: " + user.uid);

            // Salvar informações adicionais do usuário no Firestore
            firestore.collection("usuarios").doc(user.uid).set({
                usuario: usuario,
                email: email
            }).then(function() {
                console.log("Informações adicionais do usuário salvas com sucesso!");
                // Redirecionar para a página após o cadastro
                window.location.href = "./home.html";
            }).catch(function(error) {
                console.log("Erro ao salvar informações adicionais do usuário: " + error);
            });
        })
        .catch(function(error) {
            // Ocorreu um erro no cadastro
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Erro no cadastro: " + errorMessage);
            alert("Erro no cadastro: " + errorMessage);
        });
}

// Adicionando o evento de clique ao botão de cadastro
var cadastrarButton = document.querySelector('.btn-login');
cadastrarButton.addEventListener('click', cadastrar);