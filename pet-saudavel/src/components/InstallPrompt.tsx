import { useEffect, useState } from "react"

// Convite para "adicionar à tela de início".
// - Android/Chrome: usa o evento nativo beforeinstallprompt.
// - iPhone/Safari: não existe evento nativo → mostramos instruções manuais.
// Aparece a partir do 2º acesso (plano v1, seção 06) e pode ser dispensado.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "ps_install_dismissed"
const VISITS_KEY = "ps_visits"

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}
function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error propriedade só existe no Safari iOS
    window.navigator.standalone === true
  )
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [iosHelp, setIosHelp] = useState(false)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return

    const visits = Number(localStorage.getItem(VISITS_KEY) ?? "0") + 1
    localStorage.setItem(VISITS_KEY, String(visits))
    const segundoAcesso = visits >= 2

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      if (segundoAcesso) setShow(true)
    }
    window.addEventListener("beforeinstallprompt", onPrompt)

    // iPhone não dispara o evento; mostramos ajuda manual no 2º acesso.
    if (isIOS() && segundoAcesso) setShow(true)

    return () => window.removeEventListener("beforeinstallprompt", onPrompt)
  }, [])

  if (!show) return null

  const dispensar = () => {
    localStorage.setItem(DISMISS_KEY, "1")
    setShow(false)
  }

  const instalar = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice
      dispensar()
    } else if (isIOS()) {
      setIosHelp(true)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-20 mx-auto max-w-[520px] px-3">
      <div className="rounded-xl border border-gold bg-card p-4 shadow-lg">
        {!iosHelp ? (
          <>
            <p className="font-display text-sm font-semibold text-ink">
              📲 Instale o Pet Saudável
            </p>
            <p className="mt-1 text-sm text-muted">
              Deixe o app na tela de início do celular. Abre em um toque e o SOS
              funciona até sem internet.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={instalar}
                className="flex-1 rounded-lg bg-dark px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-parchment"
              >
                Instalar
              </button>
              <button
                onClick={dispensar}
                className="rounded-lg border border-gold px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-muted"
              >
                Agora não
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-display text-sm font-semibold text-ink">
              Como instalar no iPhone
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
              <li>
                Toque no botão <strong>Compartilhar</strong> (o quadrado com a seta
                para cima).
              </li>
              <li>
                Escolha <strong>“Adicionar à Tela de Início”</strong>.
              </li>
              <li>
                Confirme em <strong>Adicionar</strong>.
              </li>
            </ol>
            <button
              onClick={dispensar}
              className="mt-3 w-full rounded-lg border border-gold px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide text-muted"
            >
              Entendi
            </button>
          </>
        )}
      </div>
    </div>
  )
}
