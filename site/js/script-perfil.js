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

  // Referência para o serviço Firestore
  var firestore = firebase.firestore(); // Adicionando a referência para o Firestore

  // Verificar o estado de autenticação do usuário
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // O usuário está autenticado
      // Obter o UID do usuário autenticado
      var uid = user.uid;
      // Acessando o documento específico no Firestore
      var usuarioRef = firestore.collection('usuarios').doc(uid);

      // Obtendo os dados do documento
      usuarioRef.get().then(function(doc) {
        if (doc.exists) {
          // O documento foi encontrado, agora você pode acessar o campo "usuario"
          var usuario = doc.data().usuario;
          // Atualizar o elemento HTML para mostrar o nome do usuário
          document.getElementById('user-name').textContent = usuario;
        } else {
          console.log("O documento não foi encontrado!");
        }
      }).catch(function(error) {
        console.log("Erro ao acessar o documento:", error);
      });

      // Adicionar evento de clique ao botão de logout
      document.getElementById('logout-button').addEventListener('click', function() {
        // Realizar logout (deslogar)
        firebase.auth().signOut()
          .then(function() {
            // Logout bem-sucedido
            console.log('Logout realizado com sucesso!');
            // Redirecionar de volta para a página de login (ou outra página de sua escolha)
            window.location.href = './login.html';
          })
          .catch(function(error) {
            // Tratar erros em caso de falha no logout
            console.error('Erro ao realizar logout:', error);
          });
      });

      // Adicionar evento de clique ao botão "Salvar"
      document.querySelector('.btn-perfil').addEventListener('click', function() {
        // Obter os valores digitados pelo usuário
        var peso = document.querySelector('input[name="peso"]').value;
        var altura = document.querySelector('input[name="altura"]').value;
        var idade = document.querySelector('input[name="idade"]').value;
        var sexo = document.querySelector('input[name="gender"]:checked').value;

        // Verificar se o usuário selecionou o sexo
        if (!sexo) {
          alert('Por favor, selecione o sexo.');
          return;
        }

        // Verificar se os campos peso, altura e idade não estão vazios
        if (peso.trim() === '' || altura.trim() === '' || idade.trim() === '') {
          alert('Por favor, preencha todos os campos.');
          return;
        }

        // Acessando o documento específico no Firestore
        var usuarioRef = firestore.collection('usuarios').doc(uid);

        // Salvando os dados no Firestore
        usuarioRef.set({
          peso: peso,
          altura: altura,
          idade: idade,
          sexo: sexo
        }, { merge: true }).then(function() {
          alert('Dados salvos com sucesso!');
        }).catch(function(error) {
          console.error('Erro ao salvar dados:', error);
        });
      });

    } else {
      // O usuário não está autenticado.
      // Redirecionar para landing page.
      console.log('Usuário não autenticado. Redirecionando para a página de login...');
      window.location.href = '../index.html';
    }
  });

  function restrictToNumbers(input) {
    input.value = input.value.replace(/[^\d]/g, ''); // Remover também o ponto da regex
  }