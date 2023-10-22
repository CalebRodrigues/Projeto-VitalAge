// Configuração do Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBb7OoZjFjfJlbOQvtpPH7hGDpxY5giDNI",
    authDomain: "vitalage-site.firebaseapp.com",
    projectId: "vitalage-site",
    storageBucket: "vitalage-site.appspot.com",
    messagingSenderId: "9825977049",
    appId: "1:9825977049:web:14cc2655ba499336acb4c8"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao Firestore do Firebase
var firestore = firebase.firestore();

var mediaBatimentos = 0;

// Função executada quando o estado de autenticação do usuário muda
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var uid = user.uid;

        // Array para armazenar os batimentos cardíacos
        var batimentosArray = [];

        // Referência ao banco de dados do Firebase para os batimentos cardíacos
        var batimentosRefRegistros = firebase.database().ref('users/' + uid + '/heartbeats');

        // Função executada quando os dados de batimentos são atualizados
        batimentosRefRegistros.on('value', function(snapshot) {
            var data = [];
            var labels = [];

            // Itera sobre os dados de batimentos
            snapshot.forEach(function(childSnapshot) {
                var batimentoData = childSnapshot.val();
                data.push(batimentoData.bpm);
                labels.push(formatDate(batimentoData.timestamp));

                // Adiciona cada batimento ao array
                batimentosArray.push(batimentoData.bpm);
            });

            // Configura e renderiza o gráfico
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Batimentos',
                        data: data,
                        fill: true,
                        borderColor: '#0d46af',
                        tension: 0.1
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: 'whitesmoke' // Define a cor das legendas do gráfico
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: 'whitesmoke' // Define a cor das marcas do eixo x (tempo)
                            },
                            grid: {
                                display: false // Remove as linhas de grade do eixo y
                            }
                        },
                        y: {
                            ticks: {
                                color: 'whitesmoke' // Define a cor das marcas do eixo y (batimentos)
                            }
                        }
                    }
                }
            });

            // Calcula a média dos batimentos cardíacos e exibe o resultado
            for (let i = 0; i < batimentosArray.length; i++) {
                mediaBatimentos += batimentosArray[i];
            }
            mediaBatimentos = mediaBatimentos / batimentosArray.length;
            document.getElementById('paragrafo-batimentos').innerHTML = mediaBatimentos.toFixed(0);
            definirCorBatimentos(mediaBatimentos);
        });

        // Referência ao documento de usuário no Firestore
        var usuarioRef = firestore.collection('usuarios').doc(uid);

        // Obtém os dados do usuário e exibe na página
        usuarioRef.get().then(function(doc) {
            if (doc.exists) {
                var usuario = doc.data().usuario;
                var altura = parseFloat(doc.data().altura);
                var peso = parseFloat(doc.data().peso);
                var idade = parseInt(doc.data().idade);
                document.getElementById('user-name').textContent = usuario;
                
                // Calcula o Índice de Massa Corporal (IMC)
                var imc = peso / ((altura / 100) * (altura / 100));

                document.getElementById('paragrafo-imc').innerHTML = imc.toFixed(0);
                definirCorImc(imc);

            } else {
                console.log("O documento não foi encontrado!");
            }
        }).catch(function(error) {
            console.log("Erro ao acessar o documento:", error);
        });

        // Adiciona um evento de clique ao botão de logout
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // O mês é base 0, então adicionamos 1

    return `${day}/${month}`;
}


// Função para definir a cor com base na média dos batimentos cardíacos
function definirCorBatimentos(media) {
    var paragrafoBatimentos = document.getElementById('paragrafo-batimentos');
    var corPadrao = 'whitesmoke'; // Cor padrão
    
    if (media < 65 || media > 85) {
        paragrafoBatimentos.style.color = 'red'; // Fora do padrão (vermelho)
    } else {
        paragrafoBatimentos.style.color = 'green'; // No valor ideal (verde)
    }
}

// Função para definir a cor com base no resultado do IMC
function definirCorImc(imc) {
    var paragrafoImc = document.getElementById('paragrafo-imc');
    var corPadrao = 'whitesmoke'; // Cor padrão

    if (imc < 17) {
        paragrafoImc.style.color = 'red'; // Muito abaixo do peso (vermelho)
    } else if (imc >= 17 && imc < 18.5) {
        paragrafoImc.style.color = 'orange'; // Abaixo do peso (laranja)
    } else if (imc >= 18.5 && imc < 25) {
        paragrafoImc.style.color = 'green'; // Peso normal (verde)
    } else if (imc >= 25 && imc < 30) {
        paragrafoImc.style.color = 'orange'; // Acima do peso (laranja)
    } else if (imc >= 30 && imc < 35) {
        paragrafoImc.style.color = 'red'; // Obesidade I (vermelho)
    } else if (imc >= 35 && imc < 40) {
        paragrafoImc.style.color = 'red'; // Obesidade II (severa) (vermelho)
    } else {
        paragrafoImc.style.color = 'red'; // Obesidade III (mórbida) (vermelho)
    }
}

