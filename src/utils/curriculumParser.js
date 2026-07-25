export function parseCurriculumText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const periodsMap = new Map(); // Key: periodName (e.g. "1º Período"), Value: Array of { code, name, period }

  let currentPeriod = "Disciplinas Gerais";

  // Regex to detect Period headers like "1º PERÍODO", "2º SEMESTRE", "PERÍODO 3", "OPTATIVAS", "ELETIVAS"
  const periodRegex = /^(?:(\d+)\s*º?\s*(?:PERÍODO|PERIODO|SEMESTRE)|(?:PERÍODO|PERIODO|SEMESTRE)\s*(\d+)|(OPTATIVAS|ELETIVAS|DISCIPLINAS OPTATIVAS))/i;

  // Regex for Course line: "MAT013 - CÁLCULO I" or "MAT013 CÁLCULO I" or "Disciplina MAT013 - MATEMÁTICA FINANCEIRA"
  const courseRegex = /^(?:Disciplina\s+)?([A-Z0-9]{3,10})\s*[-:]?\s*(.+)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line matches a Period Header
    const periodMatch = line.match(periodRegex);
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

    // Check if line matches a Course
    const courseMatch = line.match(courseRegex);
    if (courseMatch) {
      const code = courseMatch[1].toUpperCase();
      const name = courseMatch[2].trim();

      // Avoid matching false positives like "PÁGINA 1 - 2" or "TURMA A"
      if (code.startsWith('TURMA') || code.startsWith('PAGE') || code.startsWith('PAGINA') || name.toLowerCase().startsWith('vagas')) {
        continue;
      }

      if (!periodsMap.has(currentPeriod)) {
        periodsMap.set(currentPeriod, []);
      }

      const list = periodsMap.get(currentPeriod);
      if (!list.some(c => c.code === code)) {
        list.push({
          code,
          name,
          period: currentPeriod
        });
      }
    }
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
