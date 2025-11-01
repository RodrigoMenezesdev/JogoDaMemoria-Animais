const cartas = document.querySelectorAll('.carta-memoria');
const tabuleiro = document.querySelector('.tabuleiro-memoria');

let temCartaVirada = false;
let bloqueioTabuleiro = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0; // Contador para checar vitória (8 pares)

// 1. Função que "vira" a carta
function viraCarta() {
    if (bloqueioTabuleiro) return;
    if (this === primeiraCarta) return;

    this.classList.add('flip');

    if (!temCartaVirada) {
        // Primeiro clique
        temCartaVirada = true;
        primeiraCarta = this;
        return;
    }

    // Segundo clique
    segundaCarta = this;
    checaPorPar();
}

// 2. Checa se as duas cartas viradas formam um par
function checaPorPar() {
    const saoIguais = primeiraCarta.dataset.animal === segundaCarta.dataset.animal;

    if (saoIguais) {
        paresEncontrados++; // Incrementa o contador de pares
        desativaCartas();
        checaVitoria();
    } else {
        desviraCartas();
    }
}

// 3. Desativa o clique nas cartas que formaram um par
function desativaCartas() {
    primeiraCarta.removeEventListener('click', viraCarta);
    segundaCarta.removeEventListener('click', viraCarta);

    resetaTabuleiro();
}

// 4. Desvira as cartas que não formaram um par
function desviraCartas() {
    bloqueioTabuleiro = true; 

    setTimeout(() => {
        primeiraCarta.classList.remove('flip');
        segundaCarta.classList.remove('flip');

        resetaTabuleiro();
    }, 1500); 
}

// 5. Reseta as variáveis de controle
function resetaTabuleiro() {
    [temCartaVirada, bloqueioTabuleiro] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

// 6. Checa se o jogador venceu o jogo (8 pares)
function checaVitoria() {
    if (paresEncontrados === 8) { // 8 é o total de pares
        bloqueioTabuleiro = true;
        setTimeout(() => {
            alert(`🎉 Parabéns! Você encontrou todos os ${paresEncontrados} pares!`);
            // Dá a opção de reiniciar automaticamente
            embaralha();
        }, 500);
    }
}

// 7. Função de Embaralhar e Reiniciar (chamada no início e pelo botão)
function embaralha() {
    // 1. Zera o contador e reseta as variáveis
    paresEncontrados = 0;
    resetaTabuleiro(); 

    // 2. Remove o estado 'flip' e re-adiciona o clique
    cartas.forEach(carta => carta.classList.remove('flip')); 
    cartas.forEach(carta => carta.addEventListener('click', viraCarta)); 

    // 3. Embaralha visualmente
    cartas.forEach(carta => {
        let posicaoAleatoria = Math.floor(Math.random() * 16); 
        carta.style.order = posicaoAleatoria;
    });
}


// --- LIGAÇÃO DE EVENTOS E BOTÕES ---

// Adiciona o evento de clique a todas as cartas ao iniciar
cartas.forEach(carta => carta.addEventListener('click', viraCarta));

// Chama a função de embaralhar para iniciar o jogo
embaralha(); 

// 1. Botão de Reiniciar
const botaoReiniciar = document.getElementById('btn-reiniciar');
botaoReiniciar.addEventListener('click', embaralha); 


// 2. Botão de Sair
const botaoSair = document.getElementById('btn-sair');
botaoSair.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair do jogo?')) {
        tabuleiro.innerHTML = '<h2>Obrigado por jogar!</h2>';
        
        // Remove os botões de controle para limpar a tela
        document.querySelector('.controles').style.display = 'none';
        
        // Desativa a funcionalidade de clique em qualquer carta restante
        cartas.forEach(carta => carta.removeEventListener('click', viraCarta));
        
        // Remove o título para ter uma tela limpa
        document.querySelector('h1').style.display = 'none';
    }
});
