const form = document.getElementById('contaForm');
const listaContas = document.getElementById('listaContas');
const noItemsMessage = document.getElementById('noItemsMessage');

function alternarEstadoPG(button) {
    const id = button.parentElement.getAttribute('data-id');
    let contas = JSON.parse(localStorage.getItem('contas')) || [];
    const conta = contas.find(conta => conta.id === id);

    if (button.classList.contains('pgOk-btn')) {
        button.classList.remove('pgOk-btn');
        button.classList.add('pg-btn');
        button.textContent = 'Não paga';
        conta.paga = false;
    } else {
        button.classList.remove('pg-btn');
        button.classList.add('pgOk-btn');
        button.textContent = 'Paga';
        conta.paga = true;
    }

    localStorage.setItem('contas', JSON.stringify(contas));
}

function resetarStatusContas() {
    let contas = JSON.parse(localStorage.getItem('contas')) || [];
    contas.forEach(conta => conta.paga = false);
    localStorage.setItem('contas', JSON.stringify(contas));
    carregarContas();
}

document.addEventListener('DOMContentLoaded', function() {
    const listaContas = document.getElementById('listaContas');
    listaContas.addEventListener('click', function(event) {
        const btn = event.target;
        if (btn && btn.classList.contains('pg-btn')) {
            alternarEstadoPG(btn);
        } 
    });

    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetarStatusContas);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    function verificarPrimeiraVisita() {
        const primeiraVisita = localStorage.getItem('primeiraVisita');
        if (!primeiraVisita) {
            setTimeout(() => {
                alert('Esse app salva tudo no seu navegador!');
                localStorage.setItem('primeiraVisita', 'true');
            }, 500);
        }
    }
    verificarPrimeiraVisita();
});

function carregarContas() {
    const contas = JSON.parse(localStorage.getItem('contas')) || [];
    listaContas.innerHTML = '';
    if (contas.length === 0) {
        noItemsMessage.style.display = 'block';
    } else {
        noItemsMessage.style.display = 'none';
        contas.forEach(conta => {
            adicionarContaNaTela(conta);
        });
    }
}

function adicionarContaNaTela(conta) {
    const li = document.createElement('li');
    li.setAttribute('data-id', conta.id);
    li.innerHTML = `
        <span><strong>${conta.descricao}</strong></span>
        <button class="${conta.paga ? 'pgOk-btn' : 'pg-btn'}">${conta.paga ? 'Paga' : 'Não paga'}</button>
        <button class="remove-btn" onclick="removerConta('${conta.id}')">Remover</button>
    `;
    listaContas.appendChild(li);
}

function adicionarConta(event) {
    event.preventDefault();
    const descricao = document.getElementById('nomeConta').value;

    const novaConta = {
        id: new Date().getTime().toString(),
        descricao: descricao,
        paga: false
    };

    const contas = JSON.parse(localStorage.getItem('contas')) || [];
    contas.push(novaConta);
    localStorage.setItem('contas', JSON.stringify(contas));

    adicionarContaNaTela(novaConta);

    document.getElementById('nomeConta').value = '';
    carregarContas();
}

function removerConta(id) {
    const contas = JSON.parse(localStorage.getItem('contas')) || [];
    const contasAtualizadas = contas.filter(conta => conta.id !== id);
    localStorage.setItem('contas', JSON.stringify(contasAtualizadas));
    carregarContas();
}

window.addEventListener('load', carregarContas);
form.addEventListener('submit', adicionarConta);
