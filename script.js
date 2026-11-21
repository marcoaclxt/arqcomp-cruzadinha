'use strict';
// As casas dos cruzamentos são compartilhadas pelas duas palavras.
const board = document.querySelector('#board');
const cells = new Map();
const clueButtons = new Map();
let activeWord = null;
let checked = false;
const key = (r, c) => `${r},${c}`;
const positions = word => Array.from(word.answer, (_, i) => key(word.row + (word.direction === 'V' ? i : 0), word.col + (word.direction === 'H' ? i : 0)));
const wordCells = new Map(PUZZLE.words.map(word => [word, positions(word)]));
const memberships = new Map();
for (const word of PUZZLE.words) {
  for (const pos of wordCells.get(word)) {
    if (!memberships.has(pos)) memberships.set(pos, []);
    memberships.get(pos).push(word);
  }
}
board.style.gridTemplateColumns = `repeat(${PUZZLE.cols}, 1fr)`;
for (let r = 0; r < PUZZLE.rows; r++) {
  for (let c = 0; c < PUZZLE.cols; c++) {
    const pos = key(r, c);
    const wrapper = document.createElement('div');
    if (!memberships.has(pos)) {
      wrapper.className = 'block';
      wrapper.setAttribute('aria-hidden', 'true');
    } else {
      wrapper.className = 'cell';
      const starts = PUZZLE.words.filter(w => w.row === r && w.col === c);
      if (starts.length) {
        const number = document.createElement('span');
        number.className = 'number'; number.textContent = starts[0].number; wrapper.append(number);
      }
      const input = document.createElement('input');
      input.type = 'text'; input.maxLength = 1; input.autocomplete = 'off'; input.spellcheck = false;
      input.setAttribute('autocapitalize', 'characters');
      input.setAttribute('aria-label', `Linha ${r + 1}, coluna ${c + 1}. ${memberships.get(pos).map(w => `Palavra ${w.number} ${w.direction === 'H' ? 'horizontal' : 'vertical'}`).join('. ')}`);
      input.dataset.position = pos;
      input.addEventListener('focus', () => {
        if (!activeWord || !wordCells.get(activeWord).includes(pos)) selectWord(memberships.get(pos)[0]);
      });
      input.addEventListener('click', () => {
        const options = memberships.get(pos);
        if (input.dataset.clicked === 'yes' && options.length > 1) selectWord(options.find(w => w !== activeWord));
        for (const cell of cells.values()) delete cell.dataset.clicked;
        input.dataset.clicked = 'yes';
        input.select();
      });
      input.addEventListener('blur', () => { delete input.dataset.clicked; });
      input.addEventListener('input', () => {
        input.value = normalize(input.value).slice(-1);
        invalidate();
        if (input.value) moveWithin(pos, 1);
      });
      input.addEventListener('paste', event => {
        event.preventDefault();
        const text = normalize(event.clipboardData.getData('text'));
        if (!text) return;
        const path = wordCells.get(activeWord); const start = path.indexOf(pos);
        const letters = text.slice(0, path.length - start);
        [...letters].forEach((letter, i) => { cells.get(path[start + i]).value = letter; });
        invalidate(); focusCell(path[Math.min(start + letters.length, path.length - 1)]);
      });
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const other = memberships.get(pos).find(w => w !== activeWord);
          if (other) selectWord(other);
        } else if (event.key === 'Backspace') {
          event.preventDefault();
          if (input.value) input.value = '';
          else { const previous = moveWithin(pos, -1); if (previous) previous.value = ''; }
          invalidate();
        } else if (event.key.startsWith('Arrow')) {
          event.preventDefault();
          const horizontal = ['ArrowLeft', 'ArrowRight'].includes(event.key);
          const word = memberships.get(pos).find(w => w.direction === (horizontal ? 'H' : 'V'));
          if (word) selectWord(word);
          const dr = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
          const dc = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          focusCell(key(r + dr, c + dc));
        }
      });
      wrapper.append(input); cells.set(pos, input);
    }
    board.append(wrapper);
  }
}
for (const word of PUZZLE.words) {
  const li = document.createElement('li');
  const button = document.createElement('button'); button.className = 'clue-button';
  button.innerHTML = `<span class="clue-number">${word.number}</span><span class="clue-text">${word.clue} <span class="clue-length">(${word.answer.length} letras)</span><span class="clue-status"></span></span>`;
  button.addEventListener('click', () => { selectWord(word); focusCell(wordCells.get(word).find(p => !cells.get(p).value) || wordCells.get(word)[0]); });
  li.append(button); document.querySelector(word.direction === 'H' ? '#horizontal' : '#vertical').append(li);
  clueButtons.set(word, button);
}
function normalize(text) { return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, ''); }
function selectWord(word) {
  activeWord = word;
  const path = wordCells.get(word);
  for (const [pos, input] of cells) input.parentElement.classList.toggle('selected', path.includes(pos));
  for (const [w, button] of clueButtons) { button.classList.toggle('active', w === word); button.setAttribute('aria-pressed', String(w === word)); }
  document.querySelector('#active-clue').textContent = `${word.number} ${word.direction === 'H' ? '→' : '↓'}  ${word.clue} (${word.answer.length} letras)`;
}
function focusCell(pos) { const input = cells.get(pos); if (input) { input.focus({preventScroll: true}); input.select(); input.scrollIntoView({block: 'nearest', inline: 'nearest'}); } return input; }
function moveWithin(pos, step) { const path = wordCells.get(activeWord); return focusCell(path[path.indexOf(pos) + step]); }
function invalidate() {
  if (checked) evaluate(false);
}
// A avaliação é por palavra. Nos cruzamentos, a casa fica verde apenas se
// todas as palavras que passam por ela estiverem corretas; a pista detalha cada resultado.
function evaluate(announce = true) {
  checked = true;
  const states = new Map(); let correct = 0; let incomplete = 0;
  for (const word of PUZZLE.words) {
    const values = wordCells.get(word).map(pos => cells.get(pos).value);
    const state = values.some(v => !v) ? 'incomplete' : values.join('') === word.answer ? 'correct' : 'wrong';
    states.set(word, state);
    if (state === 'correct') correct++;
    if (state === 'incomplete') incomplete++;
    const button = clueButtons.get(word);
    button.classList.remove('correct', 'wrong', 'incomplete'); button.classList.add(state);
    button.querySelector('.clue-status').textContent = {correct:'✓ Correta', wrong:'× Revise esta palavra', incomplete:'○ Incompleta'}[state];
  }
  for (const [pos, input] of cells) {
    const statuses = memberships.get(pos).map(w => states.get(w));
    input.parentElement.classList.toggle('correct', statuses.every(s => s === 'correct'));
    input.parentElement.classList.toggle('wrong', statuses.includes('wrong'));
  }
  document.querySelector('#score').textContent = correct;
  document.querySelector('#progress').value = correct;
  document.querySelector('#progress').textContent = `${correct} de 16`;
  const feedback = document.querySelector('#feedback');
  feedback.classList.toggle('win', correct === 16);
  if (announce || correct === 16) feedback.textContent = correct === 16 ? '✓ Todas as conexões feitas! Você acertou as 16 palavras. Muito bem!' : `${correct} de 16 palavras corretas · ${16 - correct - incomplete} para revisar · ${incomplete} incompletas.`;
  else feedback.textContent = 'Respostas alteradas: o contador foi atualizado. Continue fazendo conexões!';
}
document.querySelector('#check').addEventListener('click', () => evaluate());
const resetDialog = document.querySelector('#reset-dialog');
document.querySelector('#reset').addEventListener('click', () => resetDialog.showModal());
document.querySelector('#reset-cancel').addEventListener('click', () => resetDialog.close());
document.querySelector('#reset-confirm').addEventListener('click', () => {
  checked = false;
  for (const input of cells.values()) { input.value = ''; input.parentElement.classList.remove('correct', 'wrong'); }
  for (const button of clueButtons.values()) { button.classList.remove('correct', 'wrong', 'incomplete'); button.querySelector('.clue-status').textContent = ''; }
  document.querySelector('#score').textContent = '0'; document.querySelector('#progress').value = 0; document.querySelector('#progress').textContent = '0 de 16';
  document.querySelector('#feedback').classList.remove('win'); document.querySelector('#feedback').textContent = 'Tabuleiro limpo. Vamos fazer novas conexões?';
  resetDialog.close(); selectWord(PUZZLE.words[0]); focusCell(wordCells.get(activeWord)[0]);
});
const helpDialog = document.querySelector('#help-dialog');
document.querySelector('#help-open').addEventListener('click', () => helpDialog.showModal());
for (const id of ['help-close', 'help-start']) document.getElementById(id).addEventListener('click', () => helpDialog.close());
selectWord(PUZZLE.words[0]);
