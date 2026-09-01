/** O formato do anuncio.json. É a única fonte de verdade do projeto. */

export type Fala = {
  /** Segundo em que a fala entra — o mesmo instante da fala original. */
  em: number;
  /** O que a voz diz. Se houver texto queimado na tela, tem que bater. */
  texto: string;
};

export type Texto = {
  de: number;
  ate: number;
  texto: string;
  /** Distância do topo do vídeo, em pixels. Padrão 470. */
  topo?: number;
  tamanho?: number;
  largura?: number;
  /**
   * Altura da faixa desfocada por baixo do texto, em pixels.
   *
   * Só preencha quando estiver APAGANDO texto queimado. Se o texto novo
   * for mais curto que o antigo, escrever por cima deixa letras do
   * original sobrando nas pontas.
   */
  taparAltura?: number;
  desfoque?: number;
};

export type Anuncio = {
  id: string;
  /** Arquivo do vídeo original, dentro de video/public/. */
  video: string;
  fps: number;
  /**
   * Onde o anúncio termina. Menor que o original quando você corta o fim
   * — cartão final de outra marca, por exemplo.
   */
  duracaoSegundos: number;

  /** Qual dos dois caminhos de áudio usar. */
  audio: "narracao" | "jingle";

  /** Voz da ElevenLabs e idioma, pro script de narração. */
  voz?: string;
  idioma?: string;
  modelo?: string;
  /** Preenchido pelo scripts/narracao.py; não escreva à mão. */
  velocidade?: number;
  /** Prefixo dos mp3 de narração em public/. Padrão: o `id`. */
  prefixo?: string;

  falas?: Fala[];
  textos?: Texto[];

  trilha?: { arquivo: string; volume?: number; prompt?: string; duracaoSegundos?: number };
  jingle?: {
    arquivo: string;
    volume?: number;
    estilo: string;
    titulo?: string;
    letra: string[];
    duracaoSegundos?: number;
  };
};
