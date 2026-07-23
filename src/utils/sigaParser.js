export function parseSigaText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const coursesMap = new Map();

  let currentCourse = null;
  let currentTurma = null;
  let expectingDocentesPDF = false;
  let expectingDocentesWeb = false;
  let expectingHorarioPDF = false;

  const dayMap = {
    'segunda-feira': 'seg',
    'terça-feira': 'ter',
    'quarta-feira': 'qua',
    'quinta-feira': 'qui',
    'sexta-feira': 'sex',
    'sábado': 'sab'
  };

  // PDF Format: "Disciplina MAT013 - MATEMÁTICA FINANCEIRA" or "Disciplina 2MA13 - GEOMETRIA"
  const pdfCourseRegex = /^(?:Disciplina\s+)?([A-Z0-9]{3,10})\s*-\s*(.+)$/i;

  // Turma line: "Turma: A" or "Turma: A Total Vagas: 76"
  const turmaRegex = /^Turma:\s*([A-Z0-9]+)/i;

  // Docentes PDF line: "Docentes: ANDRE ARBEX HALLACK"
  const pdfDocenteRegex = /^Docentes?:\s*(.+)$/i;

  // Slot line: "terça-feira de 16:00 às 18:00 - Sala SECRETARIA"
  const slotRegex = /(segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado)\s+de\s+(\d{2}:\d{2})\s+às\s+(\d{2}:\d{2})(?:\s*-\s*(.+))?/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ignore page headers / footers like "Página : 1 de 36", "Relação de Turmas...", "qui., 23 jul. 2026"
    if (
      line.startsWith('Relação de Turmas') ||
      line.startsWith('DEP ') ||
      line.startsWith('Página :') ||
      line.includes('Semestre de') ||
      line.includes('qui.,') || line.includes('seg.,') || line.includes('ter.,') || line.includes('qua.,') || line.includes('sex.,') || line.includes('sáb.,')
    ) {
      continue;
    }

    // 1. Check Course Header
    if (line.toLowerCase().startsWith('disciplina ')) {
      const match = line.match(/^Disciplina\s+([A-Z0-9]{3,10})\s*-\s*(.+)$/i);
      if (match) {
        const code = match[1].toUpperCase();
        const name = match[2].trim();

        if (!coursesMap.has(code)) {
          coursesMap.set(code, {
            code,
            name,
            turmas: []
          });
        }
        currentCourse = coursesMap.get(code);
        currentTurma = null;
        expectingHorarioPDF = false;
        expectingDocentesWeb = false;
        continue;
      }
    } else {
      // Try Web Course Header format (e.g., "MAT013 - MATEMÁTICA FINANCEIRA")
      const webMatch = line.match(/^([A-Z]{3,8}\d{2,4}[A-Z]?)\s*-\s*(.+)$/i);
      if (webMatch && !line.toLowerCase().startsWith('turma') && !line.toLowerCase().startsWith('reservas')) {
        const code = webMatch[1].toUpperCase();
        const name = webMatch[2].trim();

        if (!coursesMap.has(code)) {
          coursesMap.set(code, {
            code,
            name,
            turmas: []
          });
        }
        currentCourse = coursesMap.get(code);
        currentTurma = null;
        expectingHorarioPDF = false;
        expectingDocentesWeb = false;
        continue;
      }
    }

    // 2. Check Turma Header ("Turma: A" or "Turma: A Total Vagas: 76")
    const turmaMatch = line.match(turmaRegex);
    if (turmaMatch && currentCourse) {
      const turmaLabel = turmaMatch[1].toUpperCase();
      currentTurma = {
        id: `${currentCourse.code}-${turmaLabel}-${Math.random().toString(36).substr(2, 5)}`,
        turma: turmaLabel,
        docentes: [],
        slots: []
      };
      currentCourse.turmas.push(currentTurma);
      expectingHorarioPDF = false;
      expectingDocentesWeb = false;
      continue;
    }

    // 3. Check Docentes line in PDF format ("Docentes: GLAUKER MENEZES DE AMORIM")
    const pdfDocMatch = line.match(pdfDocenteRegex);
    if (pdfDocMatch && currentTurma) {
      const docName = pdfDocMatch[1].trim();
      if (docName && !currentTurma.docentes.includes(docName)) {
        currentTurma.docentes.push(docName);
      }
      continue;
    }

    // 4. Check Docente indicator in Web format ("Docente" / "Docentes")
    if (line.toLowerCase() === 'docente' || line.toLowerCase() === 'docentes') {
      expectingDocentesWeb = true;
      continue;
    }

    if (expectingDocentesWeb && currentTurma) {
      if (line.startsWith('Horário') || line.startsWith('Distribuição') || line.startsWith('Turma:') || line.startsWith('Disciplina')) {
        expectingDocentesWeb = false;
      } else {
        if (!currentTurma.docentes.includes(line)) {
          currentTurma.docentes.push(line);
        }
        continue;
      }
    }

    // 5. Check Horário header indicator
    if (line.toLowerCase().startsWith('horário:')) {
      expectingHorarioPDF = true;
      // Check if time slot is on the same line as "Horário: terça-feira..."
      const inlineSlot = line.replace(/^Horário:\s*/i, '');
      if (inlineSlot) {
        const slotMatch = inlineSlot.match(slotRegex);
        if (slotMatch && currentTurma) {
          const dayPt = slotMatch[1].toLowerCase();
          const start = slotMatch[2];
          const end = slotMatch[3];
          const room = slotMatch[4] ? slotMatch[4].trim() : '';

          currentTurma.slots.push({
            day: dayMap[dayPt] || 'seg',
            start,
            end,
            room
          });
        }
      }
      continue;
    }

    // 6. Check Slot line standalone
    const slotMatch = line.match(slotRegex);
    if (slotMatch && currentTurma) {
      const dayPt = slotMatch[1].toLowerCase();
      const start = slotMatch[2];
      const end = slotMatch[3];
      const room = slotMatch[4] ? slotMatch[4].trim() : '';

      currentTurma.slots.push({
        day: dayMap[dayPt] || 'seg',
        start,
        end,
        room
      });
    }
  }

  return Array.from(coursesMap.values());
}
