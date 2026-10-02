export interface VerseWord {
  id: number;
  position: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  code_v2: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  text_qpc_hafs: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_number?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  char_type_name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  line_number?: number;
}
