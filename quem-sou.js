'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  // As duas primeiras pistas avançam do contexto para a função.
  // A última reutiliza a definição da atividade presente na cruzadinha.
  const hints = {
    CPU: ['Sou responsável por executar os programas do computador.', 'Reúno circuitos de controle, cálculo e pequenos espaços de armazenamento interno.'],
    ULA: ['Trabalho dentro do processador, transformando operandos em resultados.', 'Somar e realizar operações como AND e OR estão entre minhas tarefas.'],
    UC: ['Dentro do processador, coordeno o trabalho de outros circuitos.', 'Decodifico instruções e emito sinais para executar as etapas necessárias.'],
    REGISTRADORES: ['Estou dentro do processador e ofereço armazenamento de capacidade muito pequena.', 'Guardo valores de uso imediato, como operandos e endereços durante a execução.'],
    RAM: ['Meu conteúdo depende da alimentação elétrica.', 'Sou a memória principal de trabalho dos programas em execução.'],
    ROM: ['Mantenho informações mesmo quando o equipamento está desligado.', 'Minha finalidade principal é a leitura de conteúdo previamente gravado.'],
    EEPROM: ['Preservo informações sem energia e posso ser reprogramada eletricamente.', 'Permito alterar bytes individualmente, sem apagar um grande bloco inteiro.'],
    FLASH: ['Guardo informações mesmo sem alimentação elétrica.', 'Meu apagamento ocorre em blocos; sou comum em unidades SSD.'],
    CACHE: ['Ajudo a reduzir o tempo que o processador espera por dados.', 'Mantenho cópias de informações para aproveitar acessos frequentes ou próximos.'],
    MEMORIADEMASSA: ['Guardo arquivos e programas para uso futuro, mesmo com o computador desligado.', 'Minha categoria inclui tanto discos magnéticos quanto unidades SSD.'],
    DMA: ['Ajudo a movimentar dados com menos trabalho repetitivo para o processador.', 'Um controlador pode transferir um bloco entre um periférico e a memória.'],
    ADDRESSBUS: ['Faço parte da comunicação entre os componentes do computador.', 'Indico qual posição será acessada, em vez de transportar o conteúdo dessa posição.'],
    DATABUS: ['Faço parte das vias de comunicação do computador.', 'Transporto o conteúdo de uma transferência, em vez de selecionar o endereço.'],
    MICROCONTROLADOR: ['Costumo controlar tarefas específicas em equipamentos embarcados.', 'Reúno processamento, memória e periféricos em um único circuito integrado.'],
    DUALCORE: ['Minha classificação descreve quantos núcleos físicos há no processador.', 'Tenho uma dupla de núcleos; isso não garante o dobro de desempenho em todo programa.'],
    QUADCORE: ['Minha classificação se refere à quantidade de núcleos físicos do processador.', 'Tenho o dobro de núcleos de um modelo com dois, mas o ganho depende do programa.']
  };
  const display = answer => ({MEMORIADEMASSA:'Memória de massa', ADDRESSBUS:'Address bus', DATABUS:'Data bus', DUALCORE:'Dual core', QUADCORE:'Quad core', MICROCONTROLADOR:'Microcontrolador', REGISTRADORES:'Registradores', CACHE:'Cache', FLASH:'Flash'})[answer] || answer;
  const points = [100, 70, 40];
  let rounds = [], index = 0, revealed = 1, score = 0, answered = false, results = [], options = [];
  function shuffle(values) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  }
  function renderHints() {
    const word = rounds[index];
    $('#who-clues').replaceChildren();
    [...hints[word.answer], word.clue].slice(0, revealed).forEach((text, i) => {
      const li = document.createElement('li');
      const label = document.createElement('span'); label.textContent = `PISTA ${i + 1}`;
      const paragraph = document.createElement('p'); paragraph.textContent = text;
      li.append(label, paragraph); $('#who-clues').append(li);
    });
    $('#who-value').textContent = `${points[revealed - 1]} pontos`;
    $('#who-hint').disabled = answered || revealed === 3;
    $('#who-hint').textContent = revealed === 3 ? 'Todas as pistas reveladas' : `Revelar próxima pista · vale ${points[revealed]} pontos`;
  }
  function showRound() {
    answered = false; revealed = 1;
    $('#who-round').textContent = `Rodada ${index + 1} de 8`;
    $('#who-feedback').textContent = ''; $('#who-feedback').className = 'who-feedback';
    $('#who-next').hidden = true; $('#who-skip').disabled = false;
    options = shuffle([rounds[index], ...shuffle(PUZZLE.words.filter(w => w !== rounds[index])).slice(0, 3)]);
    $('#who-options').replaceChildren();
    options.forEach((word, i) => {
      const button = document.createElement('button'); button.className = 'who-option';
      const letter = document.createElement('span'); letter.textContent = String.fromCharCode(65 + i);
      const name = document.createElement('span'); name.textContent = display(word.answer);
      button.append(letter, name); button.addEventListener('click', () => answer(word.answer));
      $('#who-options').append(button);
    });
    renderHints();
  }
  function answer(choice) {
    if (answered) return;
    answered = true;
    const word = rounds[index]; const correct = choice === word.answer;
    const earned = correct ? points[revealed - 1] : 0;
    score += earned;
    results.push({answer: word.answer, choice, earned, revealed, correct});
    $('#who-score').textContent = `${score} / 800`;
    $('#who-value').textContent = `+${earned} pontos`;
    $('#who-progress').value = results.length;
    [...$('#who-options').children].forEach((button, i) => {
      button.disabled = true;
      if (options[i].answer === word.answer) { button.classList.add('right'); button.lastElementChild.textContent += ' · ✓ Resposta certa'; }
      else if (options[i].answer === choice) { button.classList.add('wrong'); button.lastElementChild.textContent += ' · × Sua resposta'; }
    });
    $('#who-hint').disabled = true; $('#who-skip').disabled = true;
    $('#who-feedback').classList.add(correct ? 'right' : 'wrong');
    $('#who-feedback').textContent = `${correct ? `✓ Acertou! +${earned} pontos.` : choice === null ? 'Rodada pulada. +0 pontos.' : '× Não foi dessa vez. +0 pontos.'} ${display(word.answer)}: ${word.clue}`;
    $('#who-next').hidden = false;
    $('#who-next').textContent = index === rounds.length - 1 ? 'Ver resultado →' : 'Próxima rodada →';
    $('#who-next').focus({preventScroll: true});
  }
  function finish() {
    $('#who-play').hidden = true; $('#who-next').hidden = true; $('#who-skip').hidden = true;
    $('#who-results').hidden = false; $('#who-results').replaceChildren();
    $('#who-results').setAttribute('tabindex', '-1');
    $('#who-results').setAttribute('aria-label', 'Resultado da partida');
    $('#who-round').textContent = 'Partida concluída'; $('#who-value').textContent = 'Concluído';
    const hits = results.filter(r => r.correct).length;
    $('#who-feedback').className = 'who-feedback right';
    $('#who-feedback').textContent = `Partida concluída! ${hits} de 8 conceitos corretos e ${score} de 800 pontos. Confira seu resumo abaixo.`;
    results.forEach(result => {
      const item = document.createElement('p'); item.className = 'who-result';
      const name = document.createElement('span'); name.textContent = `${result.correct ? '✓' : '○'} ${display(result.answer)}`;
      const value = document.createElement('strong'); value.textContent = `${result.earned} pts`;
      item.append(name, value); $('#who-results').append(item);
    });
    $('#who-results').focus({preventScroll: true});
  }
  function start() {
    rounds = shuffle(PUZZLE.words).slice(0, 8); index = 0; score = 0; results = [];
    $('#who-score').textContent = '0 / 800'; $('#who-progress').value = 0;
    $('#who-play').hidden = false; $('#who-skip').hidden = false; $('#who-results').hidden = true;
    showRound();
  }
  $('#who-hint').addEventListener('click', () => { if (!answered && revealed < 3) { revealed++; renderHints(); } });
  $('#who-skip').addEventListener('click', () => answer(null));
  $('#who-next').addEventListener('click', () => {
    if (!answered) return;
    if (index === rounds.length - 1) finish();
    else {
      index++; showRound();
      $('#who-options').firstElementChild.focus({preventScroll: true});
    }
  });
  $('#who-restart').addEventListener('click', () => $('#who-reset-dialog').showModal());
  $('#who-reset-cancel').addEventListener('click', () => $('#who-reset-dialog').close());
  $('#who-reset-confirm').addEventListener('click', () => { start(); $('#who-reset-dialog').close(); });
  start();
})();
