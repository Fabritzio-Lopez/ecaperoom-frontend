/**
 * 7 Estaciones y Acertijos del Escape Room ODS 8
 * Incluye preguntas de selección múltiple (A, B, C, D) y de Verdadero/Falso con dos botones tácticos.
 */
export const QUESTIONS = [
  {
    id: 1,
    title: 'Bóveda 01 • Propósito Fundamental',
    question: '¿Qué busca principalmente el ODS 8?',
    type: 'multiple',
    options: [
      { key: 'A', text: 'Aumentar el consumo de productos importados.' },
      { key: 'B', text: 'Promover el crecimiento económico inclusivo y sostenible, el empleo pleno y el trabajo decente.' },
      { key: 'C', text: 'Eliminar todas las actividades comerciales.' },
      { key: 'D', text: 'Reducir la educación universitaria.' },
    ],
    hint: 'El ODS 8 busca equilibrar el crecimiento productivo con la dignidad y estabilidad de los trabajadores.',
  },
  {
    id: 2,
    title: 'Bóveda 02 • Definición Esencial',
    question: '¿Qué se entiende por trabajo decente?',
    type: 'multiple',
    options: [
      { key: 'A', text: 'Cualquier actividad que genere dinero.' },
      { key: 'B', text: 'Un empleo sin horarios establecidos.' },
      { key: 'C', text: 'Un trabajo productivo con derechos, ingresos justos y condiciones adecuadas.' },
      { key: 'D', text: 'Un trabajo sin contrato ni beneficios.' },
    ],
    hint: 'No todo trabajo que genere ingresos es digno; se requieren derechos, seguridad y un salario justo.',
  },
  {
    id: 3,
    title: 'Bóveda 03 • Pilares del Empleo Digno',
    question: '¿Cuál de los siguientes elementos forma parte del trabajo decente?',
    type: 'multiple',
    options: [
      { key: 'A', text: 'Explotación laboral.' },
      { key: 'B', text: 'Igualdad de oportunidades y derechos laborales.' },
      { key: 'C', text: 'Discriminación salarial.' },
      { key: 'D', text: 'Ausencia de seguridad laboral.' },
    ],
    hint: 'El trabajo decente erradica la discriminación y garantiza que todos tengan las mismas oportunidades.',
  },
  {
    id: 4,
    title: 'Bóveda 04 • Metas Globales 2030',
    question: 'La meta 8.5 busca lograr empleo pleno y productivo y trabajo decente para todas las personas.',
    type: 'boolean',
    hint: 'Analiza si la meta 8.5 de la ONU incluye a todas las personas, jóvenes y personas con discapacidad.',
  },
  {
    id: 5,
    title: 'Bóveda 05 • Impacto Económico Juvenil',
    question: 'El desempleo juvenil no tiene consecuencias para el desarrollo económico de un país.',
    type: 'boolean',
    hint: 'Piensa en el impacto del desempleo en la innovación, la recaudación fiscal y el bienestar social.',
  },
  {
    id: 6,
    title: 'Bóveda 06 • Proyecto de Innovación',
    question: '¿Cuál es el nombre del proyecto del grupo?',
    type: 'multiple',
    options: [
      { key: 'A', text: '"Jóvenes unidos no serán vencidos"' },
      { key: 'B', text: '"Jóvenes creadores: Desarrollo y avance"' },
      { key: 'C', text: '"Jóvenes Creadores: Del Negocio Informal al Trabajo Digno"' },
      { key: 'D', text: '"Jóvenes que avanzan"' },
    ],
    hint: 'El proyecto se enfoca en la transición de la informalidad hacia empleos formales y sostenibles.',
  },
  {
    id: 7,
    title: 'Bóveda 07 • Estadísticas de la OIT (Final)',
    question: 'Según la OIT ¿Cuánto es el porcentaje de desempleo en Bolivia?',
    type: 'multiple',
    options: [
      { key: 'A', text: '82.1' },
      { key: 'B', text: '82.4' },
      { key: 'C', text: '82.7' },
      { key: 'D', text: '82.2' },
    ],
    hint: 'Cifra oficial registrada que refleja la magnitud del subempleo e informalidad en el país.',
  },
];
