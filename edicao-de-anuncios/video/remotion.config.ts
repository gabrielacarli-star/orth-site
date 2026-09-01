import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");

// O Remotion normalmente baixa um Chrome próprio. Em máquina sem acesso a
// remotion.media (container, CI), aponte REMOTION_CHROME pra um Chromium
// que já exista e ele usa esse.
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
