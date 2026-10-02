// profile display — labelKey / descKey are looked up via the "gameModes" namespace
export const MODE_DISPLAY: Record<
  string,
  { labelKey: string; icon: string; iconCls: string; dotCls: string }
> = {
  'missing-word-count': {
    labelKey: 'wordCount',
    icon: 'find_replace',
    iconCls: 'text-primary',
    dotCls: 'bg-primary/10',
  },
  'locate-verse': {
    labelKey: 'locateVerse',
    icon: 'my_location',
    iconCls: 'text-tertiary',
    dotCls: 'bg-tertiary/10',
  },
  'next-verse': {
    labelKey: 'nextVerse',
    icon: 'format_quote',
    iconCls: 'text-secondary',
    dotCls: 'bg-secondary/10',
  },
  'translation-quiz': {
    labelKey: 'translationQuiz',
    icon: 'translate',
    iconCls: 'text-green-700',
    dotCls: 'bg-green-100',
  },
};

// stats helpers — labelKey / descKey are looked up via the "gameModes" namespace
export const MODE_META: Record<
  string,
  { labelKey: string; icon: string; iconCls: string; bgCls: string; descKey: string }
> = {
  'missing-word-count': {
    labelKey: 'mwcLabel',
    icon: 'find_replace',
    iconCls: 'text-primary',
    bgCls: 'bg-primary/10',
    descKey: 'mwcDesc',
  },
  'locate-verse': {
    labelKey: 'lvLabel',
    icon: 'my_location',
    iconCls: 'text-tertiary',
    bgCls: 'bg-tertiary/10',
    descKey: 'lvDesc',
  },
  'next-verse': {
    labelKey: 'nvLabel',
    icon: 'format_quote',
    iconCls: 'text-secondary',
    bgCls: 'bg-secondary/10',
    descKey: 'nvDesc',
  },
  'translation-quiz': {
    labelKey: 'tqLabel',
    icon: 'translate',
    iconCls: 'text-green-700',
    bgCls: 'bg-green-100',
    descKey: 'tqDesc',
  },
};
