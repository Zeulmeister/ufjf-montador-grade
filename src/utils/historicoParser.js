/**
 * Parser for UFJF Academic Transcript (Histórico Escolar SIGA/CDARA)
 * Extracts student info, passed course codes, grades, and IRA.
 */

export function parseHistoricoText(rawText) {
  if (!rawText || !rawText.trim()) {
    return {
      header: {},
      passedCodes: [],
      failedCodes: [],
      processedSubjects: {}
    };
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const fullText = lines.join('\n');

  // 1. Extract Student Info
  const header = {
    studentName: 'Estudante',
    matricula: 'N/A',
    ira: '0.0',
    totalPoints: '0.0',
    course: 'Engenharia Computacional'
  };

  const nameMatch = fullText.match(/NOME:\s*([^\n\r]+?)(?=\s*MATR[ÍI]CULA|\n|$)/i);
  if (nameMatch) header.studentName = nameMatch[1].trim();

  const matMatch = fullText.match(/MATR[ÍI]CULA:\s*([A-Za-z0-9]+)/i);
  if (matMatch) header.matricula = matMatch[1].trim();

  const iraMatch = fullText.match(/[\textsf{ÍI}]NDICE DE RENDIMENTO ACAD[ÊE]MICO:\s*([\d,.]+)/i) || fullText.match(/RENDIMENTO ACAD[ÊE]MICO:\s*([\d,.]+)/i);
  if (iraMatch) header.ira = iraMatch[1].trim();

  const pointsMatch = fullText.match(/TOTAL PONTOS:\s*([\d,.]+)/i);
  if (pointsMatch) header.totalPoints = pointsMatch[1].trim();

  // 2. Extract Course Entries
  // Matches entries like:
  // 2025 1 [DCC199] ALGORITMOS 81 Aprovado 90
  // 2026 1 [MAC036] REPRESENTAÇÃO GRÁFICA E MODELAGEM GEOMÉTRICA 94 Aprovado 30
  const recordPattern = /^(\d{4})\s+(\d+)\s+\[([A-Z0-9]+)\]\s+(.*?)\s+(\d{1,3})\s+(Aprovado|Rep Nota|Rep Freq|Dispensa|Trancamento|Conclu[íi]do)\s+(\d+)$/i;
  const dispensaPattern = /^(\d{4})\s+(\d+)\s+\[([A-Z0-9]+)\]\s+(.*?)\s+(Aprovado|Dispensa|Conclu[íi]do)\s+(\d+)$/i;

  const processedSubjects = {};
  let pendingNamePrefix = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("ANO") && line.includes("SEM") && line.includes("DISCIPLIN")) {
      pendingNamePrefix = "";
      continue;
    }

    const m = line.match(recordPattern);
    if (m) {
      const [, year, sem, code, name, gradeStr, result, hoursStr] = m;
      const cleanCode = code.toUpperCase();
      const isPassed = ['aprovado', 'dispensa', 'concluído', 'concluido'].includes(result.toLowerCase());
      const grade = parseFloat(gradeStr) || 0;

      const record = {
        code: cleanCode,
        name: (pendingNamePrefix + ' ' + name).trim(),
        grade,
        result: result,
        year,
        sem,
        isPassed
      };

      pendingNamePrefix = "";

      if (!processedSubjects[cleanCode] || (isPassed && !processedSubjects[cleanCode].isPassed) || (isPassed && grade > processedSubjects[cleanCode].grade)) {
        processedSubjects[cleanCode] = record;
      }
      continue;
    }

    const md = line.match(dispensaPattern);
    if (md) {
      const [, year, sem, code, name, result, hoursStr] = md;
      const cleanCode = code.toUpperCase();
      const record = {
        code: cleanCode,
        name: (pendingNamePrefix + ' ' + name).trim(),
        grade: 100,
        result: result,
        year,
        sem,
        isPassed: true
      };

      pendingNamePrefix = "";

      if (!processedSubjects[cleanCode] || !processedSubjects[cleanCode].isPassed) {
        processedSubjects[cleanCode] = record;
      }
      continue;
    }

    // Capture fallback code pattern if line is "[CODE] NAME" or "CODE NAME GRADE RESULT"
    const fallbackMatch = line.match(/\[([A-Z0-9]{3,8})\]\s+(.*?)\s+(Aprovado|Dispensa|Conclu[íi]do)/i);
    if (fallbackMatch) {
      const [, code, name, result] = fallbackMatch;
      const cleanCode = code.toUpperCase();
      processedSubjects[cleanCode] = {
        code: cleanCode,
        name: name.trim(),
        grade: 60,
        result,
        isPassed: true
      };
    }
  }

  const passedCodes = Object.keys(processedSubjects).filter(c => processedSubjects[c].isPassed);
  const failedCodes = Object.keys(processedSubjects).filter(c => !processedSubjects[c].isPassed);

  return {
    header,
    passedCodes,
    failedCodes,
    processedSubjects
  };
}
