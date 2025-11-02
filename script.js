// Constantes e Referências do DOM
const tabuleiro = document.querySelector('.tabuleiro-memoria');
const botaoReiniciar = document.getElementById('btn-reiniciar');
const botaoSair = document.getElementById('btn-sair');
const cronometroDisplay = document.getElementById('cronometro'); 
const contadorMovimentosDisplay = document.getElementById('contador-movimentos'); 
const recordeTempoDisplay = document.getElementById('recorde-tempo'); 

// Variáveis de Controle
let temCartaVirada = false;
let bloqueioTabuleiro = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0; 
let movimentos = 0; // Contador de movimentos
const totalPares = 8; 
let nivelAtual = 1; // Nível atual

// VARIÁVEIS DO CRONÔMETRO
const TEMPO_TOTAL = 90; // 1 minuto e 30 segundos
let timeLeft = TEMPO_TOTAL;
let timerInterval;

// --- DADOS DOS NÍVEIS (Nível 1, 2 e 3) ---

const NIVEIS_MAP = {
    1: { 
        titulo: "Animais", 
        dados: [
            { nome: 'cachorro', imagem: 'imagens/cachorro.png' },
            { nome: 'gato', imagem: 'imagens/gato.png' },
            { nome: 'leao', imagem: 'imagens/leao.png' },
            { nome: 'pato', imagem: 'imagens/pato.png' },
            { nome: 'elefante', imagem: 'imagens/elefante.png' },
            { nome: 'macaco', imagem: 'imagens/macaco.png' },
            { nome: 'coelho', imagem: 'imagens/coelho.png' },
            { nome: 'coruja', imagem: 'imagens/coruja.png' },
        ]
    },
    2: { 
        titulo: "Times", 
        dados: [
            { nome: 'time1', imagem: 'imagens/time1.png' },
            { nome: 'time2', imagem: 'imagens/time2.png' },
            { nome: 'time3', imagem: 'imagens/time3.png' },
            { nome: 'time4', imagem: 'imagens/time4.png' },
            { nome: 'time5', imagem: 'imagens/time5.png' },
            { nome: 'time6', imagem: 'imagens/time6.png' },
            { nome: 'time7', imagem: 'imagens/time7.png' },
            { nome: 'time8', imagem: 'imagens/time8.png' },
        ]
    },
    3: { 
        titulo: "Bandeiras", 
        dados: [
            { nome: 'bandeira1', imagem: 'imagens/bandeira1.png' }, 
            { nome: 'bandeira2', imagem: 'imagens/bandeira2.png' }, 
            { nome: 'bandeira3', imagem: 'imagens/bandeira3.png' }, 
            { nome: 'bandeira4', imagem: 'imagens/bandeira4.png' }, 
            { nome: 'bandeira5', imagem: 'imagens/bandeira5.png' }, 
            { nome: 'bandeira6', imagem: 'imagens/bandeira6.png' }, 
            { nome: 'bandeira7', imagem: 'imagens/bandeira7.png' }, 
            { nome: 'bandeira8', imagem: 'imagens/bandeira8.png' }, 
        ]
    },
};

// --- FUNÇÕES AUXILIARES DE DISPLAY E TEMPO ---

function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function carregarRecorde() {
    // Carrega o recorde salvo no localStorage específico para o nível atual
    const recorde = localStorage.getItem(`recorde_nivel_${nivelAtual}`);
    const tempoDisplay = recorde ? formatarTempo(recorde) : '--:--';
    recordeTempoDisplay.textContent = `Recorde (Nível ${nivelAtual}): ${tempoDisplay}`;
}

function salvarRecorde(tempoGasto) {
    const recordeAtual = localStorage.getItem(`recorde_nivel_${nivelAtual}`);
    
    // Converte para número ou usa Infinity se não houver recorde (para garantir que o primeiro sempre salve)
    const recordeNum = recordeAtual ? parseInt(recordeAtual) : Infinity;

    // Se o tempo atual for menor que o recorde anterior, salva o novo recorde
    if (tempoGasto < recordeNum) {
        localStorage.setItem(`recorde_nivel_${nivelAtual}`, tempoGasto);
        // Recarrega o display do recorde imediatamente
        carregarRecorde(); 
        alert(`⭐ NOVO RECORDE para o Nível ${nivelAtual}! Tempo: ${formatarTempo(tempoGasto)}`);
    }
}

// --- FUNÇÕES DE LÓGICA DO JOGO ---

function viraCarta() {
    if (bloqueioTabuleiro) return;
    if (this === primeiraCarta) return;

    this.classList.add('flip');

    if (!temCartaVirada) {
        temCartaVirada = true;
        primeiraCarta = this;
        return;
    }

    // Aumenta o contador de movimentos APENAS no segundo clique
    movimentos++; 
    contadorMovimentosDisplay.textContent = `Movimentos: ${movimentos}`;

    segundaCarta = this;
    checaPorPar();
}

function resetaTabuleiro() {
    [temCartaVirada, bloqueioTabuleiro] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

function checaPorPar() {
    const saoIguais = primeiraCarta.dataset.animal === segundaCarta.dataset.animal;

    if (saoIguais) {
        paresEncontrados++;
        desativaCartas();
        checaVitoria();
    } else {
        desviraCartas();
    }
}

function desativaCartas() {
    primeiraCarta.removeEventListener('click', viraCarta);
    segundaCarta.removeEventListener('click', viraCarta);
    resetaTabuleiro();
}

function desviraCartas() {
    bloqueioTabuleiro = true; 

    setTimeout(() => {
        primeiraCarta.classList.remove('flip');
        segundaCarta.classList.remove('flip');
        resetaTabuleiro();
    }, 1500); 
}

// *** FUNÇÃO DE CHECAGEM DE VITÓRIA COM MUDANÇA DE NÍVEL ***
function checaVitoria() {
    if (paresEncontrados === totalPares) {
        clearInterval(timerInterval); 
        bloqueioTabuleiro = true;
        
        const tempoGasto = TEMPO_TOTAL - timeLeft;

        // 1. Salva/Atualiza o Recorde
        salvarRecorde(tempoGasto);
        
        // 2. Anuncia a vitória e o placar
        alert(`🎉 Parabéns! Nível ${nivelAtual} concluído em ${formatarTempo(tempoGasto)} e ${movimentos} movimentos!`);
        
        // 3. Lógica para o próximo nível
        setTimeout(() => {
            if (nivelAtual < Object.keys(NIVEIS_MAP).length) {
                nivelAtual++; 
                iniciarNovoNivel(NIVEIS_MAP[nivelAtual].dados, NIVEIS_MAP[nivelAtual].titulo); 
            } else {
                alert('🏆 Fim de todos os desafios! Você completou o Jogo da Memória! Reiniciando no Nível 1.');
                // Após completar todos, reinicia no Nível 1
                nivelAtual = 1;
                iniciarNovoNivel(NIVEIS_MAP[nivelAtual].dados, NIVEIS_MAP[nivelAtual].titulo);
            }
        }, 500);
    }
}

// --- FUNÇÕES DE CRONÔMETRO ---

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = TEMPO_TOTAL; 
    updateTimerDisplay(); 

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGameByTimeout();
        }
    }, 1000); 
}

function updateTimerDisplay() {
    cronometroDisplay.textContent = `Tempo: ${formatarTempo(timeLeft)}`;
    
    if (timeLeft <= 10 && timeLeft > 0) {
        cronometroDisplay.style.color = 'red';
    } else {
        cronometroDisplay.style.color = '#333'; 
    }
}

function endGameByTimeout() {
    bloqueioTabuleiro = true; 
    const cartasAtuais = tabuleiro.querySelectorAll('.carta-memoria');
    cartasAtuais.forEach(carta => carta.removeEventListener('click', viraCarta)); 
    alert('⏱️ Fim de Jogo! O tempo acabou. Clique em "Reiniciar Jogo" para tentar novamente.');
}


// --- FUNÇÃO PRINCIPAL: MONTA O TABULEIRO E INICIA O JOGO ---
function iniciarNovoNivel(dados, titulo) {
    tabuleiro.innerHTML = '';
    
    let cartasNivel = [...dados, ...dados]
        .map(card => ({ ...card, sort: Math.random() })) 
        .sort((a, b) => a.sort - b.sort);
        
    cartasNivel.forEach(item => {
        const cartaHTML = `
            <div class="carta-memoria" data-animal="${item.nome}">
                <img class="frente-carta" src="${item.imagem}" alt="${item.nome}">
                <img class="verso-carta" src="imagens/verso.png" alt="Verso da Carta">
            </div>
        `;
        tabuleiro.innerHTML += cartaHTML;
    });

    const novasCartas = tabuleiro.querySelectorAll('.carta-memoria');
    novasCartas.forEach(carta => carta.addEventListener('click', viraCarta));
    
    // Reseta Controles
    paresEncontrados = 0;
    movimentos = 0; 
    contadorMovimentosDisplay.textContent = `Movimentos: 0`;
    resetaTabuleiro(); 
    startTimer();
    
    // Atualiza Displays
    document.querySelector('h1').textContent = `Jogo da Memória: Nível ${nivelAtual} - ${titulo}`;
    carregarRecorde(); // Carrega o recorde do nível atual
}

// --- LIGAÇÃO DE EVENTOS E INICIALIZAÇÃO ---

function reiniciarJogo() {
    if (confirm("Você tem certeza que deseja reiniciar o jogo?")) {
        const dadosParaReiniciar = NIVEIS_MAP[nivelAtual].dados;
        const tituloParaReiniciar = NIVEIS_MAP[nivelAtual].titulo;
        iniciarNovoNivel(dadosParaReiniciar, tituloParaReiniciar);
    }
}

// Inicia o Nível 1 (Animais) ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    iniciarNovoNivel(NIVEIS_MAP[nivelAtual].dados, NIVEIS_MAP[nivelAtual].titulo);
});

// 1. Botão de Reiniciar
botaoReiniciar.addEventListener('click', reiniciarJogo); 


// 2. Botão de Sair
botaoSair.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair do jogo?')) {
        clearInterval(timerInterval);
        
        tabuleiro.innerHTML = '<h2>Obrigado por jogar!</h2>';
        const controles = document.querySelector('.controles');
        if (controles) controles.style.display = 'none';
        
        // Esconde todos os elementos de placar/tempo
        const h1 = document.querySelector('h1');
        if (h1) h1.style.display = 'none';
        if (cronometroDisplay) cronometroDisplay.style.display = 'none';
        if (document.querySelector('.placar')) document.querySelector('.placar').style.display = 'none';
    }
});
