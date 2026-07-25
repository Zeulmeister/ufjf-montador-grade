// Pre-built UFJF Curriculums for instant 1-click loading
export const PRESET_CURRICULUMS = [
  {
    courseName: "Engenharia Computacional (UFJF - 2023)",
    periods: [
      {
        periodName: "1º Período",
        courses: [
          { code: "MAT154", name: "CÁLCULO I" },
          { code: "MAT155", name: "GEOMETRIA ANALÍTICA E SISTEMAS LINEARES" },
          { code: "DCC199", name: "ALGORITMOS" },
          { code: "DC5199", name: "ALGORITMOS - PRÁTICA" },
          { code: "FIS122", name: "LABORATÓRIO DE INTRODUÇÃO ÀS CIÊNCIAS FÍSICAS" },
          { code: "QUI125", name: "QUÍMICA FUNDAMENTAL" },
          { code: "QUI126", name: "LABORATÓRIO DE QUÍMICA" },
          { code: "ICE001", name: "INTRODUÇÃO ÀS CIÊNCIAS EXATAS" }
        ]
      },
      {
        periodName: "2º Período",
        courses: [
          { code: "MAT156", name: "CÁLCULO II" },
          { code: "EST028", name: "INTRODUÇÃO À ESTATÍSTICA" },
          { code: "DCC200", name: "ALGORITMOS II" },
          { code: "DC5200", name: "ALGORITMOS II - PRÁTICA" },
          { code: "FIS073", name: "FÍSICA I" },
          { code: "FIS077", name: "LABORATÓRIO DE FÍSICA I" },
          { code: "QUI168", name: "LABORATÓRIO DE TRANSFORMAÇÕES QUÍMICAS" },
          { code: "MAC011", name: "INTRODUÇÃO À ENGENHARIA COMPUTACIONAL" }
        ]
      },
      {
        periodName: "3º Período",
        courses: [
          { code: "EST029", name: "CÁLCULO DE PROBABILIDADE I" },
          { code: "DCC025", name: "ORIENTAÇÃO A OBJETOS" },
          { code: "FIS074", name: "FÍSICA II" },
          { code: "MAC036", name: "REPRESENTAÇÃO GRÁFICA E MODELAGEM GEOMÉTRICA" },
          { code: "MAT157", name: "CÁLCULO III" },
          { code: "DCC013", name: "ESTRUTURA DE DADOS" }
        ]
      },
      {
        periodName: "4º Período",
        courses: [
          { code: "DCC012", name: "ESTRUTURA DE DADOS II" },
          { code: "DCC008", name: "CÁLCULO NUMÉRICO" },
          { code: "MAT029", name: "EQUAÇÕES DIFERENCIAIS I" },
          { code: "MAT158", name: "ÁLGEBRA LINEAR" },
          { code: "MAC015", name: "RESISTÊNCIA DOS MATERIAIS" },
          { code: "FIS075", name: "FÍSICA III" }
        ]
      },
      {
        periodName: "5º Período",
        courses: [
          { code: "DCC059", name: "TEORIA DOS GRAFOS" },
          { code: "DCC122", name: "CIRCUITOS DIGITAIS" },
          { code: "FIS081", name: "FENÔMENOS DE TRANSPORTE" },
          { code: "MAC019", name: "FUNDAMENTOS DE MECÂNICA DAS ESTRUTURAS" },
          { code: "MAC024", name: "INTRODUÇÃO À MODELAGEM COMPUTACIONAL" },
          { code: "MAC026", name: "INTRODUÇÃO AOS MÉTODOS DISCRETOS" }
        ]
      },
      {
        periodName: "6º Período",
        courses: [
          { code: "DCC070", name: "ORGANIZAÇÃO DE COMPUTADORES" },
          { code: "DCC117", name: "MODELAGEM DE SISTEMAS" },
          { code: "MAC008", name: "INTRODUÇÃO AO MÉTODO DOS ELEMENTOS FINITOS" },
          { code: "MAC005", name: "MECÂNICA DOS SÓLIDOS I" }
        ]
      },
      {
        periodName: "7º Período",
        courses: [
          { code: "DCC001", name: "ANÁLISE E PROJETO DE ALGORITMOS" },
          { code: "DCC060", name: "BANCO DE DADOS" },
          { code: "DCC062", name: "SISTEMAS OPERACIONAIS" },
          { code: "MAC037", name: "TÓPICOS AVANÇADOS EM MODELAGEM GEOMÉTRICA COMPUTACIONAL" }
        ]
      },
      {
        periodName: "8º Período",
        courses: [
          { code: "DCC042", name: "REDES DE COMPUTADORES" },
          { code: "MAC035", name: "TRABALHO MULTIDISCIPLINAR" },
          { code: "MAC034", name: "MÉTODOS COMPUTACIONAIS APLICADOS EM ENGENHARIA" },
          { code: "MAC534", name: "MÉTODOS COMPUTACIONAIS APLICADOS EM ENGENHARIA - PRÁTICA" },
          { code: "DCC163", name: "PESQUISA OPERACIONAL" }
        ]
      },
      {
        periodName: "9º Período",
        courses: [
          { code: "DCC125", name: "PROGRAMAÇÃO PARALELA" },
          { code: "DCC198", name: "TRABALHO MULTIDISCIPLINAR APLICADO" },
          { code: "ESA002", name: "ECOLOGIA E PRESERVAÇÃO DO AMBIENTE" },
          { code: "MAC018", name: "ESTÁGIO EM ENGENHARIA COMPUTACIONAL" },
          { code: "MAC038", name: "TRABALHO FINAL DE CURSO I" }
        ]
      },
      {
        periodName: "10º Período",
        courses: [
          { code: "MAC039", name: "TRABALHO FINAL DE CURSO II" }
        ]
      }
    ]
  }
];

export function parseCurriculumText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const periodsMap = new Map();

  let currentPeriod = "Disciplinas Gerais";

  // Regex to detect Period headers like "1º PERÍODO", "2º SEMESTRE", "PERÍODO 3", "1º Período 360 H"
  const periodHeaderRegex = /^(?:(\d+)\s*º?\s*(?:PERÍODO|PERIODO|SEMESTRE)|(?:PERÍODO|PERIODO|SEMESTRE)\s*(\d+)|(OPTATIVAS|ELETIVAS|DISCIPLINAS OPTATIVAS))/i;

  // Regex for course codes matching UFJF format (e.g. MAT154, DCC199, FIS073, DC5199, MAC036)
  const codeRegex = /\b([A-Z]{2,4}\d{2,4}[A-Z]?)\b/g;

  // Check if text has grid lines (e.g. "MAT154 MAT155 DCC199 DC5199 FIS122 QUI125 QUI126 ICE001")
  const codeRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Check for Period Header
    const periodMatch = line.match(periodHeaderRegex);
    if (periodMatch) {
      if (periodMatch[1]) {
        currentPeriod = `${periodMatch[1]}º Período`;
      } else if (periodMatch[2]) {
        currentPeriod = `${periodMatch[2]}º Período`;
      } else if (periodMatch[3]) {
        currentPeriod = "Optativas / Eletivas";
      }
      if (!periodsMap.has(currentPeriod)) {
        periodsMap.set(currentPeriod, []);
      }
      continue;
    }

    // 2. Check for Course line format: "MAT154 - CÁLCULO I" or "MAT154 CÁLCULO I"
    const courseMatch = line.match(/^(?:Disciplina\s+)?([A-Z0-9]{3,10})\s*[-:]?\s*(.+)$/i);
    if (courseMatch) {
      const code = courseMatch[1].toUpperCase();
      const name = courseMatch[2].trim();

      if (!code.startsWith('TURMA') && !code.startsWith('PAGE') && !code.startsWith('PAGINA') && !name.toLowerCase().startsWith('vagas')) {
        if (!periodsMap.has(currentPeriod)) {
          periodsMap.set(currentPeriod, []);
        }

        const list = periodsMap.get(currentPeriod);
        if (!list.some(c => c.code === code)) {
          list.push({ code, name, period: currentPeriod });
        }
        continue;
      }
    }

    // 3. Check for row containing multiple course codes (PDF OCR Grid layout)
    const matches = [...line.matchAll(codeRegex)];
    if (matches.length >= 3) {
      codeRows.push(matches.map(m => m[1].toUpperCase()));
    }
  }

  // If grid rows were detected from OCR table: assign row 1 -> 1º Período, row 2 -> 2º Período...
  if (codeRows.length >= 3 && Array.from(periodsMap.values()).every(arr => arr.length === 0)) {
    codeRows.forEach((rowCodes, idx) => {
      const periodName = `${idx + 1}º Período`;
      const courseItems = rowCodes.map(code => ({
        code,
        name: code, // Will be updated if names are matched
        period: periodName
      }));
      periodsMap.set(periodName, courseItems);
    });

    // Try to pair names from rawText
    lines.forEach(l => {
      codeRows.flat().forEach(code => {
        if (l.includes(code)) {
          const parts = l.split(code);
          if (parts[1] && parts[1].trim().length > 3) {
            const possibleName = parts[1].trim().replace(/^[-:\s]+/, '');
            periodsMap.forEach(items => {
              const item = items.find(c => c.code === code);
              if (item && item.name === code) {
                item.name = possibleName;
              }
            });
          }
        }
      });
    });
  }

  // Convert map to structured array sorted logically
  const result = Array.from(periodsMap.entries()).map(([periodName, courses]) => ({
    periodName,
    courses
  }));

  // Sort periods numerically 1º, 2º, 3º... followed by Optativas
  result.sort((a, b) => {
    const numA = parseInt(a.periodName, 10) || 999;
    const numB = parseInt(b.periodName, 10) || 999;
    return numA - numB;
  });

  return result;
}
