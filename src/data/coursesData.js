// Pre-defined Offered Courses for UFJF Engenharia Computacional (2026/3)
// Includes complete schedules, teachers, and official prerequisites (Currículo 12023)

export const PREREQUISITES_MAP = {
  'DCC200': ['DCC199'],
  'EST028': ['MAT154'],
  'FIS077': ['FIS122'],
  'MAT156': ['MAT154', 'MAT155'],
  'QUI168': ['QUI126'],
  'DCC013': ['DCC200'],
  'DCC025': ['DCC200'],
  'EST029': ['MAT156'],
  'FIS074': ['FIS073', 'MAT156'],
  'MAC036': ['MAT155'],
  'MAT157': ['MAT156'],
  'DCC008': ['DCC199', 'MAT156'],
  'DCC012': ['DCC013'],
  'FIS075': ['FIS074', 'MAT157'],
  'MAC015': ['FIS073', 'MAT157'],
  'MAT029': ['MAT156'],
  'MAT158': ['MAT155'],
  'DCC059': ['DCC013'],
  'FIS081': ['FIS074'],
  'MAC019': ['MAC015', 'DCC008'],
  'MAC024': ['DCC008'],
  'MAC026': ['DCC008', 'MAT029'],
  'DCC070': ['DCC122'],
  'DCC117': ['DCC025'],
  'MAC005': ['MAC019'],
  'MAC008': ['MAC015'],
  'DCC001': ['DCC013'],
  'DCC060': ['DCC117'],
  'DCC062': ['DCC070'],
  'MAC037': ['MAC036'],
  'DCC042': ['DCC070'],
  'DCC163': ['MAT158'],
  'MAC034': ['MAC008', 'MAC026'],
  'MAC035': ['DCC008'],
  'DCC125': ['DCC062'],
  'DCC198': ['MAC035'],
  'ESA002': ['QUI125'],
  'MAC018': ['DCC059', 'MAC019', 'DCC122'],
  'MAC039': ['MAC038']
};

export const initialCourses = [
  {
    code: "DCC199",
    name: "ALGORITMOS",
    prereqs: [],
    turmas: [
      {
        id: "DCC199-A",
        name: "A",
        docentes: ["MARCELO CANIATO RENHE", "LUCIANA BRUGIOLO GONCALVES"],
        slots: [
          { day: "seg", start: "08:00", end: "10:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "08:00", end: "10:00", location: "Sala SECRETARIA" }
        ]
      },
      {
        id: "DCC199-C",
        name: "C",
        docentes: ["EDMAR WELINGTON OLIVEIRA"],
        slots: [
          { day: "seg", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DC5199",
    name: "ALGORITMOS - PRÁTICA",
    prereqs: [],
    turmas: [
      {
        id: "DC5199-A",
        name: "A",
        docentes: ["EDMAR WELINGTON OLIVEIRA"],
        slots: [
          { day: "ter", start: "10:00", end: "12:00", location: "Sala L 107 DCC" }
        ]
      },
      {
        id: "DC5199-B",
        name: "B",
        docentes: ["EDMAR WELINGTON OLIVEIRA"],
        slots: [
          { day: "ter", start: "14:00", end: "16:00", location: "Sala L 107 DCC" }
        ]
      }
    ]
  },
  {
    code: "MAT154",
    name: "CÁLCULO I",
    prereqs: [],
    turmas: [
      {
        id: "MAT154-B",
        name: "B",
        docentes: ["ALEXEI DERIGLAZOV"],
        slots: [
          { day: "qua", start: "08:00", end: "10:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "08:00", end: "10:00", location: "Sala SECRETARIA" }
        ]
      },
      {
        id: "MAT154-D",
        name: "D",
        docentes: ["TATIANA APARECIDA GOUVEIA"],
        slots: [
          { day: "qua", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAT155",
    name: "GEOMETRIA ANALÍTICA E SISTEMAS LINEARES",
    prereqs: [],
    turmas: [
      {
        id: "MAT155-A",
        name: "A",
        docentes: ["CRISTIANE DE ANDRADE MENDES"],
        slots: [
          { day: "qua", start: "10:00", end: "12:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "10:00", end: "12:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "FIS122",
    name: "LABORATÓRIO DE INTRODUÇÃO ÀS CIÊNCIAS FÍSICAS",
    prereqs: [],
    turmas: [
      {
        id: "FIS122-A",
        name: "A",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "ter", start: "19:00", end: "21:00", location: "Sala L 103 FÍS" }
        ]
      }
    ]
  },
  {
    code: "QUI125",
    name: "QUÍMICA FUNDAMENTAL",
    prereqs: [],
    turmas: [
      {
        id: "QUI125-A",
        name: "A",
        docentes: ["DOCENTE DEPARTAMENTO QUÍMICA"],
        slots: [
          { day: "ter", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "QUI126",
    name: "LABORATÓRIO DE QUÍMICA",
    prereqs: [],
    turmas: [
      {
        id: "QUI126-A",
        name: "A",
        docentes: ["DOCENTE DEPARTAMENTO QUÍMICA"],
        slots: [
          { day: "seg", start: "10:00", end: "12:00", location: "LAB QUÍMICA" }
        ]
      }
    ]
  },
  {
    code: "ICE001",
    name: "INTRODUÇÃO ÀS CIÊNCIAS EXATAS",
    prereqs: [],
    turmas: [
      {
        id: "ICE001-A",
        name: "A",
        docentes: ["COORDENAÇÃO ICE"],
        slots: [
          { day: "sex", start: "16:00", end: "18:00", location: "ANFITEATRO ICE" }
        ]
      }
    ]
  },
  {
    code: "DCC200",
    name: "ALGORITMOS II",
    prereqs: ["DCC199"],
    turmas: [
      {
        id: "DCC200-A",
        name: "A",
        docentes: ["MARCELO CANIATO RENHE"],
        slots: [
          { day: "qua", start: "16:00", end: "18:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "16:00", end: "18:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DC5200",
    name: "ALGORITMOS II - PRÁTICA",
    prereqs: ["DCC199"],
    turmas: [
      {
        id: "DC5200-A",
        name: "A",
        docentes: ["SAULO MORAES VILLELA"],
        slots: [
          { day: "seg", start: "14:00", end: "16:00", location: "Sala L 107 DCC" }
        ]
      }
    ]
  },
  {
    code: "EST028",
    name: "INTRODUÇÃO À ESTATÍSTICA",
    prereqs: ["MAT154"],
    turmas: [
      {
        id: "EST028-A",
        name: "A",
        docentes: ["DEP ESTATÍSTICA"],
        slots: [
          { day: "ter", start: "08:00", end: "10:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "08:00", end: "10:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "FIS073",
    name: "FÍSICA I",
    prereqs: [],
    turmas: [
      {
        id: "FIS073-D",
        name: "D",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "ter", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "FIS077",
    name: "LABORATÓRIO DE FÍSICA I",
    prereqs: ["FIS122"],
    turmas: [
      {
        id: "FIS077-B",
        name: "B",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "seg", start: "10:00", end: "12:00", location: "Sala L 103 FÍS" }
        ]
      },
      {
        id: "FIS077-C",
        name: "C",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "seg", start: "14:00", end: "16:00", location: "Sala L 103 FÍS" }
        ]
      }
    ]
  },
  {
    code: "MAC011",
    name: "INTRODUÇÃO À ENGENHARIA COMPUTACIONAL",
    prereqs: [],
    turmas: [
      {
        id: "MAC011-A",
        name: "A",
        docentes: ["RUY FREITAS REIS", "ALEXANDRE ABRAHAO CURY"],
        slots: [
          { day: "seg", start: "16:00", end: "18:00", location: "Sala Lab. 2 - Eng. Comp" }
        ]
      }
    ]
  },
  {
    code: "MAT156",
    name: "CÁLCULO II",
    prereqs: ["MAT154", "MAT155"],
    turmas: [
      {
        id: "MAT156-C",
        name: "C",
        docentes: ["WILLIAN VERSOLATI FRANÇA"],
        slots: [
          { day: "qua", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC013",
    name: "ESTRUTURA DE DADOS",
    prereqs: ["DCC200"],
    turmas: [
      {
        id: "DCC013-A",
        name: "A",
        docentes: ["JOSE JERONIMO CAMATA"],
        slots: [
          { day: "ter", start: "19:00", end: "21:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "19:00", end: "21:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC025",
    name: "ORIENTAÇÃO A OBJETOS",
    prereqs: ["DCC200"],
    turmas: [
      {
        id: "DCC025-B",
        name: "B",
        docentes: ["GLEIPH GHIOTTO LIMA DE MENEZES"],
        slots: [
          { day: "qua", start: "21:00", end: "23:00", location: "Sala L 107 DCC" },
          { day: "sex", start: "19:00", end: "21:00", location: "Sala L 107 DCC" }
        ]
      }
    ]
  },
  {
    code: "FIS074",
    name: "FÍSICA II",
    prereqs: ["FIS073", "MAT156"],
    turmas: [
      {
        id: "FIS074-A",
        name: "A",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "ter", start: "19:00", end: "21:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "19:00", end: "21:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAC036",
    name: "REPRESENTAÇÃO GRÁFICA E MODELAGEM GEOMÉTRICA",
    prereqs: ["MAT155"],
    turmas: [
      {
        id: "MAC036-A",
        name: "A",
        docentes: ["DOCENTE DEP MAC"],
        slots: [
          { day: "sex", start: "14:00", end: "16:00", location: "LAB MAC" }
        ]
      }
    ]
  },
  {
    code: "MAT157",
    name: "CÁLCULO III",
    prereqs: ["MAT156"],
    turmas: [
      {
        id: "MAT157-B",
        name: "B",
        docentes: ["FABIO RODRIGUES PEREIRA"],
        slots: [
          { day: "qua", start: "08:00", end: "10:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "08:00", end: "10:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC008",
    name: "CÁLCULO NUMÉRICO",
    prereqs: ["DCC199", "MAT156"],
    turmas: [
      {
        id: "DCC008-C",
        name: "C",
        docentes: ["IURY HIGOR AGUIAR DA IGREJA"],
        slots: [
          { day: "seg", start: "10:00", end: "12:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "10:00", end: "12:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC012",
    name: "ESTRUTURA DE DADOS II",
    prereqs: ["DCC013"],
    turmas: [
      {
        id: "DCC012-A",
        name: "A",
        docentes: ["BARBARA DE MELO QUINTELA"],
        slots: [
          { day: "ter", start: "16:00", end: "18:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "FIS075",
    name: "FÍSICA III",
    prereqs: ["FIS074", "MAT157"],
    turmas: [
      {
        id: "FIS075-B",
        name: "B",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "ter", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAC015",
    name: "RESISTÊNCIA DOS MATERIAIS",
    prereqs: ["FIS073", "MAT157"],
    turmas: [
      {
        id: "MAC015-X",
        name: "X",
        docentes: ["GUSTAVO HENRIQUE NALON", "ALEXANDRE ABRAHAO CURY"],
        slots: [
          { day: "seg", start: "17:00", end: "19:00", location: "Sala SALA 5205" },
          { day: "qua", start: "17:00", end: "19:00", location: "Sala SALA 5205" }
        ]
      }
    ]
  },
  {
    code: "MAT029",
    name: "EQUAÇÕES DIFERENCIAIS I",
    prereqs: ["MAT156"],
    turmas: [
      {
        id: "MAT029-E",
        name: "E",
        docentes: ["GRIGORI CHAPIRO"],
        slots: [
          { day: "qua", start: "21:00", end: "23:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "19:00", end: "21:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAT158",
    name: "ÁLGEBRA LINEAR",
    prereqs: ["MAT155"],
    turmas: [
      {
        id: "MAT158-A",
        name: "A",
        docentes: ["FLAVIANA ANDREA RIBEIRO"],
        slots: [
          { day: "qua", start: "10:00", end: "12:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "10:00", end: "12:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC059",
    name: "TEORIA DOS GRAFOS",
    prereqs: ["DCC013"],
    turmas: [
      {
        id: "DCC059-A",
        name: "A",
        docentes: ["LORENZA LEAO OLIVEIRA MORENO"],
        slots: [
          { day: "ter", start: "21:00", end: "23:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "21:00", end: "23:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC122",
    name: "CIRCUITOS DIGITAIS",
    prereqs: [],
    turmas: [
      {
        id: "DCC122-A",
        name: "A",
        docentes: ["LUCIANO JEREZ CHAVES"],
        slots: [
          { day: "seg", start: "19:00", end: "21:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "19:00", end: "21:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "FIS081",
    name: "FENÔMENOS DE TRANSPORTE",
    prereqs: ["FIS074"],
    turmas: [
      {
        id: "FIS081-A",
        name: "A",
        docentes: ["VIRGILIO DE CARVALHO DOS ANJOS"],
        slots: [
          { day: "seg", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qua", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAC019",
    name: "FUNDAMENTOS DE MECÂNICA DAS ESTRUTURAS",
    prereqs: ["MAC015", "DCC008"],
    turmas: [
      {
        id: "MAC019-A",
        name: "A",
        docentes: ["TATIANA DANELON DE ASSIS"],
        slots: [
          { day: "ter", start: "10:00", end: "12:00", location: "LAB. 1 - ENG. COMP." },
          { day: "qui", start: "10:00", end: "12:00", location: "LAB. 1 - ENG. COMP." }
        ]
      }
    ]
  },
  {
    code: "MAC024",
    name: "INTRODUÇÃO À MODELAGEM COMPUTACIONAL",
    prereqs: ["DCC008"],
    turmas: [
      {
        id: "MAC024-A",
        name: "A",
        docentes: ["LEONARDO GOLIATT DA FONSECA"],
        slots: [
          { day: "ter", start: "08:00", end: "10:00", location: "LAB. 1 - ENG. COMP." },
          { day: "qui", start: "08:00", end: "10:00", location: "LAB. 1 - ENG. COMP." }
        ]
      }
    ]
  },
  {
    code: "DCC070",
    name: "ORGANIZAÇÃO DE COMPUTADORES",
    prereqs: ["DCC122"],
    turmas: [
      {
        id: "DCC070-A",
        name: "A",
        docentes: ["MARCELO LOBOSCO"],
        slots: [
          { day: "seg", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qua", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC117",
    name: "MODELAGEM DE SISTEMAS",
    prereqs: ["DCC025"],
    turmas: [
      {
        id: "DCC117-A",
        name: "A",
        docentes: ["FABRICIO MARTINS MENDONCA"],
        slots: [
          { day: "ter", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAC005",
    name: "MECÂNICA DOS SÓLIDOS I",
    prereqs: ["MAC019"],
    turmas: [
      {
        id: "MAC005-A",
        name: "A",
        docentes: ["LAHIS SOUZA DE ASSIS"],
        slots: [
          { day: "qua", start: "08:00", end: "10:00", location: "Sala Lab. 2 - Eng. Comp" },
          { day: "sex", start: "08:00", end: "10:00", location: "Sala SALA 5315" }
        ]
      }
    ]
  },
  {
    code: "MAC008",
    name: "INTRODUÇÃO AO MÉTODO DOS ELEMENTOS FINITOS",
    prereqs: ["MAC015"],
    turmas: [
      {
        id: "MAC008-A",
        name: "A",
        docentes: ["FLAVIA DE SOUZA BASTOS", "MICHELE CRISTINA RESENDE FARAGE"],
        slots: [
          { day: "qua", start: "10:00", end: "12:00", location: "Sala SALA 5305" },
          { day: "sex", start: "10:00", end: "12:00", location: "Sala SALA 5315" }
        ]
      }
    ]
  },
  {
    code: "DCC001",
    name: "ANÁLISE E PROJETO DE ALGORITMOS",
    prereqs: ["DCC013"],
    turmas: [
      {
        id: "DCC001-A",
        name: "A",
        docentes: ["EDMAR WELINGTON OLIVEIRA"],
        slots: [
          { day: "ter", start: "19:00", end: "21:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "21:00", end: "23:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC060",
    name: "BANCO DE DADOS",
    prereqs: ["DCC117"],
    turmas: [
      {
        id: "DCC060-A",
        name: "A",
        docentes: ["VICTOR STROELE DE ANDRADE MENEZES"],
        slots: [
          { day: "seg", start: "19:00", end: "21:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "19:00", end: "21:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC062",
    name: "SISTEMAS OPERACIONAIS",
    prereqs: ["DCC070"],
    turmas: [
      {
        id: "DCC062-A",
        name: "A",
        docentes: ["MARCELO FERREIRA MORENO"],
        slots: [
          { day: "qua", start: "21:00", end: "23:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "19:00", end: "21:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC042",
    name: "REDES DE COMPUTADORES",
    prereqs: ["DCC070"],
    turmas: [
      {
        id: "DCC042-A",
        name: "A",
        docentes: ["ALEX BORGES VIEIRA"],
        slots: [
          { day: "ter", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "qui", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "DCC163",
    name: "PESQUISA OPERACIONAL",
    prereqs: ["MAT158"],
    turmas: [
      {
        id: "DCC163-A",
        name: "A",
        docentes: ["LORENZA LEAO OLIVEIRA MORENO"],
        slots: [
          { day: "qua", start: "14:00", end: "16:00", location: "Sala SECRETARIA" },
          { day: "sex", start: "14:00", end: "16:00", location: "Sala SECRETARIA" }
        ]
      }
    ]
  },
  {
    code: "MAC034",
    name: "MÉTODOS COMPUTACIONAIS APLICADOS EM ENGENHARIA",
    prereqs: ["MAC008", "MAC026"],
    turmas: [
      {
        id: "MAC034-A",
        name: "A",
        docentes: ["LEONARDO GOLIATT DA FONSECA", "LAHIS SOUZA DE ASSIS"],
        slots: [
          { day: "ter", start: "16:00", end: "18:00", location: "Sala Lab. 2 - Eng. Comp" }
        ]
      }
    ]
  },
  {
    code: "MAC035",
    name: "TRABALHO MULTIDISCIPLINAR",
    prereqs: ["DCC008"],
    turmas: [
      {
        id: "MAC035-A",
        name: "A",
        docentes: ["RODRIGO WEBER DOS SANTOS", "FLAVIA DE SOUZA BASTOS"],
        slots: [
          { day: "ter", start: "08:00", end: "10:00", location: "Sala Lab. Trab. Mult. - Eng. Comp" }
        ]
      }
    ]
  },
  {
    code: "MAC534",
    name: "MÉTODOS COMPUTACIONAIS APLICADOS EM ENGENHARIA - PRÁTICA",
    prereqs: [],
    turmas: [
      {
        id: "MAC534-A",
        name: "A",
        docentes: ["LEONARDO GOLIATT DA FONSECA", "LAHIS SOUZA DE ASSIS"],
        slots: [
          { day: "qui", start: "16:00", end: "18:00", location: "Sala Lab. 2 - Eng. Comp" }
        ]
      }
    ]
  },
  {
    code: "DCC198",
    name: "TRABALHO MULTIDISCIPLINAR APLICADO",
    prereqs: ["MAC035"],
    turmas: [
      {
        id: "DCC198-A",
        name: "A",
        docentes: ["RODRIGO WEBER DOS SANTOS"],
        slots: [
          { day: "ter", start: "10:00", end: "12:00", location: "Sala LAB ENG COMP 2" }
        ]
      }
    ]
  }
];

export const DAYS_OF_WEEK = [
  { id: "seg", label: "Segunda", full: "Segunda-feira" },
  { id: "ter", label: "Terça", full: "Terça-feira" },
  { id: "qua", label: "Quarta", full: "Quarta-feira" },
  { id: "qui", label: "Quinta", full: "Quinta-feira" },
  { id: "sex", label: "Sexta", full: "Sexta-feira" },
  { id: "sab", label: "Sábado", full: "Sábado" }
];

export const TIME_SLOTS = [
  { start: "08:00", end: "09:00", label: "08:00 - 09:00", period: "Manhã" },
  { start: "09:00", end: "10:00", label: "09:00 - 10:00", period: "Manhã" },
  { start: "10:00", end: "11:00", label: "10:00 - 11:00", period: "Manhã" },
  { start: "11:00", end: "12:00", label: "11:00 - 12:00", period: "Manhã" },
  { start: "12:00", end: "13:00", label: "12:00 - 13:00", period: "Almoço" },
  { start: "13:00", end: "14:00", label: "13:00 - 14:00", period: "Tarde" },
  { start: "14:00", end: "15:00", label: "14:00 - 15:00", period: "Tarde" },
  { start: "15:00", end: "16:00", label: "15:00 - 16:00", period: "Tarde" },
  { start: "16:00", end: "17:00", label: "16:00 - 17:00", period: "Tarde" },
  { start: "17:00", end: "18:00", label: "17:00 - 18:00", period: "Tarde" },
  { start: "18:00", end: "19:00", label: "18:00 - 19:00", period: "Jantar" },
  { start: "19:00", end: "20:00", label: "19:00 - 20:00", period: "Noite" },
  { start: "20:00", end: "21:00", label: "20:00 - 21:00", period: "Noite" },
  { start: "21:00", end: "22:00", label: "21:00 - 22:00", period: "Noite" },
  { start: "22:00", end: "23:00", label: "22:00 - 23:00", period: "Noite" }
];

export const COURSE_COLORS = [
  { bg: "bg-blue-600", text: "text-white", border: "border-blue-700", hex: "#2563eb", lightBg: "#dbeafe", darkBorder: "#1d4ed8" },
  { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-700", hex: "#059669", lightBg: "#d1fae5", darkBorder: "#047857" },
  { bg: "bg-purple-600", text: "text-white", border: "border-purple-700", hex: "#7c3aed", lightBg: "#ede9fe", darkBorder: "#6d28d9" },
  { bg: "bg-amber-600", text: "text-white", border: "border-amber-700", hex: "#d97706", lightBg: "#fef3c7", darkBorder: "#b45309" },
  { bg: "bg-rose-600", text: "text-white", border: "border-rose-700", hex: "#e11d48", lightBg: "#ffe4e6", darkBorder: "#be123c" },
  { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-700", hex: "#4f46e5", lightBg: "#e0e7ff", darkBorder: "#4338ca" },
  { bg: "bg-cyan-600", text: "text-white", border: "border-cyan-700", hex: "#0891b2", lightBg: "#cffaff", darkBorder: "#0e7490" },
  { bg: "bg-fuchsia-600", text: "text-white", border: "border-fuchsia-700", hex: "#c026d3", lightBg: "#fae8ff", darkBorder: "#a21caf" },
  { bg: "bg-teal-600", text: "text-white", border: "border-teal-700", hex: "#0d9488", lightBg: "#ccfbf1", darkBorder: "#0f766e" },
  { bg: "bg-orange-600", text: "text-white", border: "border-orange-700", hex: "#ea580c", lightBg: "#ffedd5", darkBorder: "#c2410c" }
];
