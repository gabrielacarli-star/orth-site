import "server-only"
import crypto from "crypto"

function getKey(): Buffer {
  const raw = process.env.VAULT_ENCRYPTION_KEY
  if (!raw) throw new Error("VAULT_ENCRYPTION_KEY não configurada.")
  const key = Buffer.from(raw, "base64")
  if (key.length !== 32) {
    throw new Error("VAULT_ENCRYPTION_KEY inválida (precisa ser uma chave de 32 bytes em base64).")
  }
  return key
}

export function vaultConfigurado() {
  return Boolean(process.env.VAULT_ENCRYPTION_KEY)
}

export function criptografar(texto: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString("base64")
}

export function descriptografar(cifrado: string): string {
  const key = getKey()
  const dados = Buffer.from(cifrado, "base64")
  const iv = dados.subarray(0, 12)
  const tag = dados.subarray(12, 28)
  const encrypted = dados.subarray(28)
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString("utf8")
}
