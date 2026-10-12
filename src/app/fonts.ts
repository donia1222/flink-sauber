import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google';

// Titulares: Bricolage Grotesque, moderna y cercana. Texto: Plus Jakarta Sans, limpia y clara.
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});

export const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans-jakarta',
});
