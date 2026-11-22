# Entre Bits — Cruzadinha de Arquitetura Computacional

Jogo individual com as 16 palavras da atividade, feito em HTML, CSS e JavaScript puros. Visual inspirado nas cores do documento da SPTech; não é um site institucional.

## Testar no computador
1. Extraia todo o ZIP.
2. Abra `index.html` no navegador (Chrome, Edge ou Firefox atualizado).
3. Mantenha os arquivos na mesma pasta. Não é necessário instalar pacotes, iniciar servidor ou ter internet.

## Como jogar
Clique em uma pista ou casa e digite. Cada casa recebe uma letra; os cruzamentos compartilham a mesma casa. As setas navegam, Backspace apaga, Enter alterna a direção no cruzamento. Também é possível colar uma palavra a partir da casa selecionada.

Conferir mostra o resultado de cada palavra nas pistas: correta, incorreta ou incompleta. O contador registra palavras inteiramente corretas. Depois da primeira conferência, edições atualizam o resultado. As cores de cada casa consideram todas as palavras que passam por ela:

- **Verde:** todas estão corretas.
- **Vermelho:** todas estão erradas (completas, mas incorretas).
- **Neutro:** qualquer outro caso, incluindo palavras incompletas ou resultados mistos.

Confira os símbolos nas pistas para o resultado individual. Os destaques de navegação são preservados: casas neutras selecionadas ficam azuis; casas verdes ou vermelhas selecionadas mantêm o marcador azul inferior. A casa em foco fica amarela com contorno rosa, com prioridade sobre a cor da avaliação. Ao sair do foco, volta a exibir a cor correspondente ao resultado e à seleção.

Reiniciar pede confirmação e limpa todas as respostas. O progresso não é salvo ao fechar ou recarregar a página. No celular, deslize o tabuleiro horizontalmente quando necessário.

## Estrutura
- `index.html`: interface e instruções.
- `style.css`: cores, tabuleiro e layout responsivo.
- `puzzle.js`: palavras, pistas, coordenadas e dimensões do tabuleiro fixo.
- `script.js`: construção da interface, teclado, conferência e reinício.

As respostas estão no código-fonte por se tratar de um exercício estático, sem servidor.

## Publicação e entrega
**Link do site publicado: pendente de publicação.** Substitua esta linha pela URL real após publicar.

Crie um repositório público chamado `arqcomp-cruzadinha`. Envie os arquivos desta pasta diretamente para a raiz do repositório, mantendo `index.html` na raiz. No GitHub, em Settings → Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)` e salve. Teste a URL gerada em janela anônima. No Moodle, entregue somente o link do site.

O enunciado exige pelo menos 6 commits reais, em pelo menos 2 dias diferentes. Este ZIP não contém histórico Git nem comprova esse requisito. Registre as etapas reais das suas revisões, personalizações e correções ao longo do desenvolvimento, sem falsificar datas. Use mensagens no padrão `feat: descrição`, `fix: descrição`, `style: descrição` e `docs: descrição`. Não publique RA, e-mail ou telefone.

## Palavras e pistas
As pistas abaixo foram elaboradas para este jogo. Revise com o e-book da disciplina antes da entrega, pois esse material não acompanhou o enunciado.

| Nº | Direção | Resposta | Pista |
| --- | --- | --- | --- |
| 1 | Horizontal | MICROCONTROLADOR | Chip que integra processador, memória e periféricos para controlar sistemas embarcados. |
| 2 | Vertical | REGISTRADORES | Pequenos espaços internos do processador que guardam operandos e resultados imediatos. |
| 3 | Vertical | CACHE | Camada rápida que mantém cópias de dados frequentes para reduzir o tempo de acesso. |
| 4 | Vertical | ADDRESSBUS | Vias que indicam a posição de memória ou dispositivo selecionada pelo processador. |
| 5 | Vertical | ROM | Armazena instruções permanentes, destinadas principalmente à leitura, e mantém dados sem energia. |
| 6 | Vertical | DUALCORE | Processador com dois núcleos físicos de execução. |
| 7 | Horizontal | CPU | Componente que executa instruções de programas e reúne os circuitos de processamento. |
| 8 | Horizontal | EEPROM | Componente não volátil que permite apagar e regravar eletricamente bytes individuais. |
| 9 | Vertical | RAM | Guarda temporariamente programas em execução e perde seu conteúdo sem energia. |
| 10 | Horizontal | FLASH | Tecnologia não volátil, apagada em blocos, utilizada em pendrives e cartões. |
| 11 | Horizontal | UC | Parte do processador que decodifica instruções e coordena sua execução. |
| 12 | Horizontal | DMA | Permite transferências entre periféricos e memória sem intervenção contínua do processador. |
| 12 | Vertical | DATABUS | Vias que transportam os valores transferidos entre processador, memória e periféricos. |
| 13 | Vertical | ULA | Circuito do processador que realiza cálculos e operações lógicas. |
| 14 | Horizontal | MEMORIADEMASSA | Armazenamento persistente de grande capacidade, como discos rígidos e unidades SSD. |
| 15 | Horizontal | QUADCORE | Processador com quatro núcleos físicos de execução. |


## Atualização — Cruzadinha + Termo Tech
A cruzadinha mantém as palavras, pistas e funcionalidades. O tabuleiro agora usa fundo escuro nos espaços vazios, casas claras com bordas reforçadas, palavra selecionada azul e casa em foco amarela com contorno rosa. Em telas estreitas, deslize o tabuleiro horizontalmente para preservar o tamanho das letras.

A aba **Termo Tech** sorteia um conceito da lista e permite seis tentativas. Escolha **Compacto** (2–8 letras) ou **Estendido** (10–16 letras). Siglas contam como palavras; termos compostos são escritos sem espaços. Digite no campo ou use o teclado virtual, depois clique em Conferir. Qualquer combinação de letras com o tamanho correto é aceita como tentativa, sem consulta a dicionário.

- Verde / ✓: letra na posição correta.
- Amarelo / ↔: letra em outra posição.
- Cinza / ×: letra ausente ou ocorrência excedente.

Letras repetidas são avaliadas pela quantidade presente na resposta. O teclado preserva o melhor resultado conhecido de cada letra. A dica conceitual pode ser revelada a qualquer momento. No fim da rodada, a resposta e a definição são exibidas. Nova palavra e mudança de nível pedem confirmação quando há uma rodada em andamento. Trocar de aba preserva os dois jogos; recarregar a página reinicia ambos.

O arquivo `termo.js` contém a lógica deste novo modo. Nenhuma dependência externa foi adicionada.

## Quem sou eu? — terceiro jogo
Na aba **Quem sou eu?**, descubra oito conceitos sorteados entre os 16 da atividade, sem repetição na partida. Cada rodada apresenta quatro alternativas e uma pista inicial. Você pode revelar até três pistas antes de escolher uma resposta.

- Acertar com uma pista: **100 pontos**.
- Acertar com duas pistas: **70 pontos**.
- Acertar com três pistas: **40 pontos**.
- Errar ou selecionar “Não sei”: **zero pontos**.

Há somente uma resposta por rodada. Após responder, o jogo identifica a alternativa correta e explica o conceito. Avance quando terminar de ler. Ao fim das oito rodadas, veja os acertos e a pontuação por conceito, com máximo de **800 pontos**.

Não há cronômetro. “Nova partida” pede confirmação antes de apagar apenas o progresso deste jogo. Alternar as três abas preserva o estado dos jogos enquanto a página estiver aberta; recarregar a página reinicia todos. As pistas deste modo são progressivas e não alteram as pistas da cruzadinha.

O novo arquivo `quem-sou.js` contém as pistas, sorteio, pontuação e lógica do terceiro jogo. A página continua funcionando localmente, sem instalação e sem internet.

## Correção — edição pelo teclado virtual do Termo Tech

O teclado virtual agora respeita a posição do cursor no campo da tentativa. Ao selecionar letras, a próxima tecla substitui esse trecho; Apagar remove a seleção ou a letra imediatamente anterior ao cursor. No início do texto, Apagar não remove a última letra. Com o campo cheio, é possível substituir uma seleção sem perder as demais letras. O cursor permanece junto à edição para continuar digitando.

## Correção — foco no jogo Quem sou eu?

Após escolher uma alternativa ou pular a rodada, o foco vai para “Próxima rodada” (ou “Ver resultado” na última rodada). Ao avançar, a primeira alternativa recebe o foco. Ao concluir, o resumo recebe o foco e é identificado como “Resultado da partida”. Assim, a navegação por teclado não fica presa em controles desabilitados ou ocultos. A abertura inicial da página não força o foco para este jogo.

## Correção — indicador de edição do Termo Tech

O contorno da casa ativa acompanha o cursor no campo da tentativa, inclusive ao clicar, usar as setas ou selecionar um trecho. Uma seleção destaca a casa correspondente ao início do trecho selecionado. O teclado virtual também atualiza o indicador após inserir ou apagar uma letra. Quando o cursor está depois da última casa de uma tentativa completa, a última casa permanece destacada; ao encerrar a rodada, o indicador desaparece.
