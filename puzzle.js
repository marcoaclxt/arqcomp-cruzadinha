// Tabuleiro fixo: coordenadas começam em zero. H = horizontal, V = vertical.
const PUZZLE = {
  "rows": 13,
  "cols": 16,
  "words": [
    {
      "answer": "MICROCONTROLADOR",
      "row": 0,
      "col": 0,
      "direction": "H",
      "clue": "Chip que integra processador, memória e periféricos para controlar sistemas embarcados.",
      "number": 1
    },
    {
      "answer": "REGISTRADORES",
      "row": 0,
      "col": 3,
      "direction": "V",
      "clue": "Pequenos espaços internos do processador que guardam operandos e resultados imediatos.",
      "number": 2
    },
    {
      "answer": "CACHE",
      "row": 0,
      "col": 5,
      "direction": "V",
      "clue": "Camada rápida que mantém cópias de dados frequentes para reduzir o tempo de acesso.",
      "number": 3
    },
    {
      "answer": "ADDRESSBUS",
      "row": 0,
      "col": 12,
      "direction": "V",
      "clue": "Vias que indicam a posição de memória ou dispositivo selecionada pelo processador.",
      "number": 4
    },
    {
      "answer": "ROM",
      "row": 0,
      "col": 15,
      "direction": "V",
      "clue": "Armazena instruções permanentes, destinadas principalmente à leitura, e mantém dados sem energia.",
      "number": 5
    },
    {
      "answer": "DUALCORE",
      "row": 2,
      "col": 1,
      "direction": "V",
      "clue": "Processador com dois núcleos físicos de execução.",
      "number": 6
    },
    {
      "answer": "CPU",
      "row": 2,
      "col": 5,
      "direction": "H",
      "clue": "Componente que executa instruções de programas e reúne os circuitos de processamento.",
      "number": 7
    },
    {
      "answer": "EEPROM",
      "row": 3,
      "col": 9,
      "direction": "H",
      "clue": "Componente não volátil que permite apagar e regravar eletricamente bytes individuais.",
      "number": 8
    },
    {
      "answer": "RAM",
      "row": 4,
      "col": 7,
      "direction": "V",
      "clue": "Guarda temporariamente programas em execução e perde seu conteúdo sem energia.",
      "number": 9
    },
    {
      "answer": "FLASH",
      "row": 5,
      "col": 9,
      "direction": "H",
      "clue": "Tecnologia não volátil, apagada em blocos, utilizada em pendrives e cartões.",
      "number": 10
    },
    {
      "answer": "UC",
      "row": 6,
      "col": 0,
      "direction": "H",
      "clue": "Parte do processador que decodifica instruções e coordena sua execução.",
      "number": 11
    },
    {
      "answer": "DMA",
      "row": 6,
      "col": 6,
      "direction": "H",
      "clue": "Permite transferências entre periféricos e memória sem intervenção contínua do processador.",
      "number": 12
    },
    {
      "answer": "DATABUS",
      "row": 6,
      "col": 6,
      "direction": "V",
      "clue": "Vias que transportam os valores transferidos entre processador, memória e periféricos.",
      "number": 12
    },
    {
      "answer": "ULA",
      "row": 7,
      "col": 10,
      "direction": "V",
      "clue": "Circuito do processador que realiza cálculos e operações lógicas.",
      "number": 13
    },
    {
      "answer": "MEMORIADEMASSA",
      "row": 9,
      "col": 0,
      "direction": "H",
      "clue": "Armazenamento persistente de grande capacidade, como discos rígidos e unidades SSD.",
      "number": 14
    },
    {
      "answer": "QUADCORE",
      "row": 11,
      "col": 5,
      "direction": "H",
      "clue": "Processador com quatro núcleos físicos de execução.",
      "number": 15
    }
  ]
};
