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
        const form = document.getElementById("form-bpm");

        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const bpmInput = document.getElementById("bpm");
            const bpmValue = parseFloat(bpmInput.value);

            if (!isNaN(bpmValue)) {
                // Adicione o registro no banco de dados com o timestamp atual
                const timestamp = firebase.database.ServerValue.TIMESTAMP;

                const novoRegistro = {
                    bpm: bpmValue,
                    timestamp: timestamp
                };

                const novoRegistroRef = firebase.database().ref('users/' + uid + '/heartbeats').push();
                novoRegistroRef.set(novoRegistro)
                    .then(function() {
                        console.log('Registro adicionado com sucesso!');
                        // Redirecione o usuário de volta à página de registros ou aonde preferir.
                        window.location.href = './registro.html';
                    })
                    .catch(function(error) {
                        console.error('Erro ao adicionar o registro:', error);
                    });
            } else {
                console.error('Valor de BPM inválido');
            }
        });
    } else {
        // O usuário não está autenticado, redirecione-o para a página de login
        console.log('Usuário não autenticado. Redirecionando para a página de login...');
        window.location.href = '../index.html';
    }
});
