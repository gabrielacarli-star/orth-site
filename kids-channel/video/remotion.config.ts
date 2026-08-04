import { Config } from "@remotion/cli/config";

// Qualidade de imagem: JPEG comprime rápido, mas desenho vetorial plano
// tem áreas chapadas de cor onde o JPEG cria "sujeira" na borda do traço.
// PNG mantém o traço limpo. Renderiza um pouco mais devagar, vale a pena.
Config.setVideoImageFormat("png");

// 1080p é o suficiente pra YouTube kids — a maioria assiste em TV ou tablet,
// e 4K aqui só multiplicaria o tempo de render sem ninguém perceber.
Config.setCodec("h264");

Config.setChromiumOpenGlRenderer("angle");

// Normalmente o Remotion baixa o próprio Chrome sozinho na primeira vez e
// você não precisa fazer nada. Em máquina sem acesso a esse download (CI,
// container fechado), aponte a variável REMOTION_CHROME pro Chrome/Chromium
// que já existe na máquina — ver README, seção "Renderizar".
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
