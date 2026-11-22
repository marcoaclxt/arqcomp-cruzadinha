'use strict';
// Modo independente: alternar abas não altera as respostas de nenhum jogo.
(() => {
  const $ = selector => document.querySelector(selector);
  const LIMIT = 6;
  let target, guesses = [], draft = '', ended = false, level = 'short', pendingLevel = null;
  const labels = {hit: 'posição correta', near: 'outra posição', miss: 'sem ocorrência restante'};
  const symbols = {hit: '✓', near: '↔', miss: '×'};
  const keyboard = new Map();
  function scoreGuess(answer, guess) {
    const result = Array(guess.length).fill('miss');
    const remaining = {};
    // Primeiro reserva as posições exatas; só depois distribui as repetições.
    [...answer].forEach((letter, i) => {
      if (guess[i] === letter) result[i] = 'hit';
      else remaining[letter] = (remaining[letter] || 0) + 1;
    });
    [...guess].forEach((letter, i) => {
      if (result[i] !== 'hit' && remaining[letter] > 0) { result[i] = 'near'; remaining[letter]--; }
    });
    return result;
  }
  function message(text) { $('#term-status').textContent = text; }
  function render() {
    const grid = $('#term-grid'); grid.replaceChildren();
    for (let row = 0; row < LIMIT; row++) {
      const line = document.createElement('div'); line.className = 'term-row';
      const current = row === guesses.length && !ended;
      if (current) line.classList.add('current');
      const attempt = guesses[row]; const text = attempt ? attempt.text : current ? draft : '';
      line.setAttribute('role', 'group'); line.setAttribute('aria-label', `Tentativa ${row + 1}`);
      for (let col = 0; col < target.answer.length; col++) {
        const tile = document.createElement('div'); tile.className = 'term-tile';
        tile.textContent = text[col] || '';
        if (current && col === Math.min(draft.length, target.answer.length - 1)) tile.classList.add('cursor');
        if (attempt) {
          const state = attempt.states[col]; tile.classList.add(state);
          const symbol = document.createElement('span'); symbol.textContent = symbols[state]; symbol.setAttribute('aria-hidden', 'true'); tile.append(symbol);
          tile.setAttribute('aria-label', `${text[col]}: ${labels[state]}`);
        } else tile.setAttribute('aria-label', `Letra ${col + 1}: ${text[col] || 'vazia'}`);
        line.append(tile);
      }
      grid.append(line);
    }
    const rank = {miss: 1, near: 2, hit: 3}; const best = {};
    guesses.forEach(g => [...g.text].forEach((letter, i) => {
      if (!best[letter] || rank[g.states[i]] > rank[best[letter]]) best[letter] = g.states[i];
    }));
    for (const [letter, button] of keyboard) {
      button.classList.remove('hit', 'near', 'miss');
      if (best[letter]) button.classList.add(best[letter]);
      button.setAttribute('aria-label', best[letter] ? `${letter}: ${labels[best[letter]]}` : letter === '⌫' ? 'Apagar' : letter);
      button.disabled = ended;
    }
    $('#term-counter').textContent = `${draft.length}/${target.answer.length} letras`;
    $('#term-input').value = draft; $('#term-input').disabled = ended; $('#term-submit').disabled = ended;
  }
  function newRound(nextLevel = level) {
    level = nextLevel; $('#term-level').value = level;
    const pool = PUZZLE.words.filter(w => level === 'short' ? w.answer.length <= 8 : w.answer.length > 8);
    const choices = pool.filter(w => w !== target);
    target = choices[Math.floor(Math.random() * choices.length)] || pool[0];
    guesses = []; draft = ''; ended = false;
    $('#term-size').textContent = `${target.answer.length} letras · 6 chances`;
    $('#term-input').maxLength = target.answer.length;
    $('#term-hint').hidden = true; $('#term-hint').textContent = target.clue;
    $('#term-hint-button').disabled = false; $('#term-hint-button').textContent = 'Revelar dica';
    message('Rodada pronta. Digite sua primeira tentativa!'); render();
  }
  function submit() {
    if (ended) return;
    if (draft.length !== target.answer.length) { message(`Complete as ${target.answer.length} letras antes de conferir.`); return; }
    const states = scoreGuess(target.answer, draft);
    guesses.push({text: draft, states});
    const won = draft === target.answer;
    ended = won || guesses.length === LIMIT;
    draft = '';
    if (ended) {
      message(won ? `✓ Você acertou ${target.answer} em ${guesses.length} tentativa${guesses.length === 1 ? '' : 's'}!` : `Fim da rodada! A resposta era ${target.answer}. Tente uma nova palavra.`);
      $('#term-hint').hidden = false;
    } else message(`Tentativa ${guesses.length} de 6 conferida. Observe as cores e tente novamente.`);
    render();
    if (!ended) $('#term-input').focus({preventScroll:true});
  }
  function typeKey(letter) {
    if (ended) return;
    if (letter === 'Enter') { submit(); return; }
    const input = $('#term-input');
    const start = input.selectionStart ?? draft.length;
    const end = input.selectionEnd ?? start;
    let cursor = start;
    if (letter === '⌫') {
      const from = start === end ? Math.max(0, start - 1) : start;
      draft = draft.slice(0, from) + draft.slice(end);
      cursor = from;
    } else if (draft.length - (end - start) < target.answer.length) {
      draft = draft.slice(0, start) + letter + draft.slice(end);
      cursor = start + letter.length;
    }
    render();
    input.focus({preventScroll: true});
    input.setSelectionRange(cursor, cursor);
  }
  ['QWERTYUIOP', 'ASDFGHJKL', ['Enter', ...'ZXCVBNM', '⌫']].forEach(row => {
    const line = document.createElement('div'); line.className = 'term-key-row';
    [...row].forEach(letter => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'term-key';
      if (letter.length > 1 || letter === '⌫') button.classList.add('wide');
      button.textContent = letter; button.addEventListener('click', () => typeKey(letter));
      keyboard.set(letter, button); line.append(button);
    });
    $('#term-keyboard').append(line);
  });
  $('#term-input').addEventListener('input', event => { draft = normalize(event.target.value).slice(0, target.answer.length); render(); });
  $('#term-form').addEventListener('submit', event => { event.preventDefault(); submit(); });
  $('#term-hint-button').addEventListener('click', () => { $('#term-hint').hidden = false; $('#term-hint-button').disabled = true; $('#term-hint-button').textContent = 'Dica revelada'; });
  function requestRound(nextLevel) {
    if (!ended && (guesses.length || draft.length)) {
      pendingLevel = nextLevel; $('#term-level').value = level; $('#term-new-dialog').showModal();
    } else newRound(nextLevel);
  }
  $('#term-new').addEventListener('click', () => requestRound(level));
  $('#term-level').addEventListener('change', event => requestRound(event.target.value));
  $('#term-new-cancel').addEventListener('click', () => { pendingLevel = null; $('#term-new-dialog').close(); });
  $('#term-new-confirm').addEventListener('click', () => { newRound(pendingLevel || level); pendingLevel = null; $('#term-new-dialog').close(); });
  for (const mode of ['cross', 'term', 'who']) {
    $(`#${mode}-tab`).addEventListener('click', () => {
      for (const other of ['cross', 'term', 'who']) {
        const active = other === mode;
        $(`#${other}-panel`).hidden = !active;
        $(`#${other}-tab`).classList.toggle('active', active);
        $(`#${other}-tab`).setAttribute('aria-pressed', String(active));
      }
    });
  }
  newRound();
})();
