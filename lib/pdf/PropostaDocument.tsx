import { Document, Page, View, Text, Svg, Path, StyleSheet, Link } from "@react-pdf/renderer"

export interface ItemInvestimento {
  nome: string
  descricao: string
  tipo: "setup" | "mensal"
  valor: number
}

export interface PropostaData {
  tituloProposta: string
  subtituloProposta: string
  clienteNome: string
  clienteSegmento: string
  cidadeData: string
  oQueIdentificamos: string
  comoVamosTrabalhar: string
  prazo: string
  itens: ItemInvestimento[]
  observacaoInvestimento: string
  validadeDias: number
}

const NAVY_DARK = "#060F30"
const NAVY = "#0A1C4E"
const GOLD = "#B8935A"
const MUTED = "#6B7280"
const LINE = "#E2E6F0"
const CREAM = "#F7F8FC"

function formatBRL(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
}

function paragrafos(texto: string) {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: NAVY,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 48,
  },
  coverPage: {
    fontFamily: "Helvetica",
    backgroundColor: NAVY_DARK,
    color: "#FFFFFF",
    padding: 48,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoWordmark: { fontSize: 15, fontWeight: 700, color: "#FFFFFF", letterSpacing: 1 },
  logoTagline: { fontSize: 6, color: "#8A97B4", letterSpacing: 1.5, marginTop: 1 },
  coverKicker: {
    fontSize: 9,
    color: GOLD,
    letterSpacing: 2,
    marginBottom: 10,
  },
  coverDivider: { width: 32, height: 2, backgroundColor: GOLD, marginBottom: 14 },
  coverTitle: { fontSize: 34, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15 },
  coverSubtitle: {
    fontSize: 13,
    fontFamily: "Times-Italic",
    color: "#C7D2E8",
    marginTop: 14,
  },
  coverFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1B3A8A",
    paddingTop: 14,
  },
  coverFooterLabel: { fontSize: 7.5, color: "#7CB3FF", letterSpacing: 1.5, marginBottom: 3 },
  coverFooterValue: { fontSize: 11, color: "#FFFFFF", fontWeight: 700 },
  coverFooterSub: { fontSize: 9, color: "#8A97B4", marginTop: 1 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4, marginTop: 22 },
  sectionBadge: {
    width: 16,
    height: 16,
    backgroundColor: GOLD,
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 3,
    marginRight: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: NAVY },
  sectionUnderline: { width: 28, height: 2, backgroundColor: GOLD, marginBottom: 10, marginLeft: 24 },
  paragraph: { fontSize: 10, color: "#374151", lineHeight: 1.6, marginBottom: 8 },
  investCard: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
    padding: 16,
    marginTop: 10,
  },
  investKicker: { fontSize: 8, color: MUTED, letterSpacing: 1.2, marginBottom: 10 },
  investRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  investNome: { fontSize: 10.5, fontWeight: 700, color: NAVY },
  investDescricao: { fontSize: 9, color: MUTED, marginTop: 2, maxWidth: 340 },
  investValor: { fontSize: 12, fontWeight: 700, color: NAVY },
  investValorSufixo: { fontSize: 8, fontWeight: 400, color: MUTED },
  investDividerLine: { height: 1.5, backgroundColor: NAVY, marginVertical: 6 },
  investTotalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  investTotalLabel: { fontSize: 9, fontWeight: 700, color: MUTED, letterSpacing: 1 },
  investTotalValor: { fontSize: 13, fontWeight: 700, color: NAVY },
  observacao: { fontSize: 8.5, color: MUTED, marginTop: 12, lineHeight: 1.5 },
  validade: { fontSize: 9, fontFamily: "Times-Italic", color: MUTED, marginTop: 8 },
  ctaBox: {
    backgroundColor: CREAM,
    borderRadius: 4,
    padding: 16,
    marginTop: 10,
  },
  ctaTitle: { fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", marginBottom: 6 },
  ctaText: { fontSize: 9.5, color: "#374151", textAlign: "center", lineHeight: 1.5 },
  closing: { fontSize: 10, color: "#374151", marginTop: 20 },
  brandBlock: { alignItems: "center", marginTop: 40 },
  brandName: { fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: 2 },
  brandTagline: { fontSize: 7.5, color: MUTED, letterSpacing: 1.5, marginTop: 4 },
  brandSite: { fontSize: 9, color: "#2563EB", marginTop: 6 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
  },
  footerText: { fontSize: 7.5, color: MUTED },
  footerBrand: { fontSize: 7.5, color: NAVY, fontWeight: 700, letterSpacing: 1 },
})

function PinLogo({ color = "#FFFFFF", size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={(size * 36) / 26} viewBox="0 0 26 36">
      <Path
        fillRule="evenodd"
        d="M 13 0.5 C 6.6 0.5 1.5 5.6 1.5 12 C 1.5 18.4 7.2 23.5 13 34.5 C 18.8 23.5 24.5 18.4 24.5 12 C 24.5 5.6 19.4 0.5 13 0.5 Z M 13 7 C 9.7 7 7 9.7 7 13 C 7 16.3 9.7 19 13 19 C 16.3 19 19 16.3 19 13 C 19 9.7 16.3 7 13 7 Z"
        fill={color}
      />
    </Svg>
  )
}

function SectionHeading({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <View wrap={false}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionBadge}>{numero}</Text>
        <Text style={styles.sectionTitle}>{titulo}</Text>
      </View>
      <View style={styles.sectionUnderline} />
    </View>
  )
}

function Footer({ tituloProposta, clienteNome }: { tituloProposta: string; clienteNome: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>ORTH · Presença Digital</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          `Proposta de ${tituloProposta} · ${clienteNome}  ${pageNumber} / ${totalPages}`
        }
      />
      <Text style={styles.footerBrand}>ORTH</Text>
    </View>
  )
}

export function PropostaDocument(dados: PropostaData) {
  const setupItens = dados.itens.filter((i) => i.tipo === "setup")
  const mensalItens = dados.itens.filter((i) => i.tipo === "mensal")
  const totalSetup = setupItens.reduce((acc, i) => acc + i.valor, 0)
  const totalMensal = mensalItens.reduce((acc, i) => acc + i.valor, 0)

  return (
    <Document title={`Proposta ${dados.tituloProposta} - ${dados.clienteNome}`}>
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.logoRow}>
          <PinLogo />
          <View>
            <Text style={styles.logoWordmark}>ORTH</Text>
            <Text style={styles.logoTagline}>PRESENÇA DIGITAL & POSICIONAMENTO</Text>
          </View>
        </View>

        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          <Text style={styles.coverKicker}>PROPOSTA</Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverTitle}>{dados.tituloProposta}</Text>
          {dados.subtituloProposta ? (
            <Text style={styles.coverSubtitle}>{dados.subtituloProposta}</Text>
          ) : null}
        </View>

        <View style={styles.coverFooter}>
          <View>
            <Text style={styles.coverFooterLabel}>PREPARADO PARA</Text>
            <Text style={styles.coverFooterValue}>{dados.clienteNome}</Text>
            {dados.clienteSegmento ? (
              <Text style={styles.coverFooterSub}>{dados.clienteSegmento}</Text>
            ) : null}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.coverFooterLabel}>DOCUMENTO</Text>
            <Text style={styles.coverFooterSub}>Proposta Comercial</Text>
            <Text style={styles.coverFooterSub}>{dados.cidadeData}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <SectionHeading numero={1} titulo="O que identificamos" />
        {paragrafos(dados.oQueIdentificamos).map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        <SectionHeading numero={2} titulo="Como vamos trabalhar" />
        {paragrafos(dados.comoVamosTrabalhar).map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        <SectionHeading numero={3} titulo="Prazo" />
        {paragrafos(dados.prazo).map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        <SectionHeading numero={4} titulo="Investimento" />

        {setupItens.length > 0 && (
          <View style={styles.investCard} wrap={false}>
            <Text style={styles.investKicker}>SETUP, PAGO NA ASSINATURA DO CONTRATO</Text>
            {setupItens.map((item, i) => (
              <View key={i} style={styles.investRow}>
                <View style={{ maxWidth: 360 }}>
                  <Text style={styles.investNome}>{item.nome}</Text>
                  {item.descricao ? (
                    <Text style={styles.investDescricao}>{item.descricao}</Text>
                  ) : null}
                </View>
                <Text style={styles.investValor}>{formatBRL(item.valor)}</Text>
              </View>
            ))}
            <View style={styles.investDividerLine} />
            <View style={styles.investTotalRow}>
              <Text style={styles.investTotalLabel}>TOTAL DO SETUP</Text>
              <Text style={styles.investTotalValor}>{formatBRL(totalSetup)}</Text>
            </View>
          </View>
        )}

        {mensalItens.length > 0 && (
          <View style={styles.investCard} wrap={false}>
            <Text style={styles.investKicker}>MENSALIDADE, COBRADA A CADA 30 DIAS</Text>
            {mensalItens.map((item, i) => (
              <View key={i} style={styles.investRow}>
                <View style={{ maxWidth: 360 }}>
                  <Text style={styles.investNome}>{item.nome}</Text>
                  {item.descricao ? (
                    <Text style={styles.investDescricao}>{item.descricao}</Text>
                  ) : null}
                </View>
                <Text style={styles.investValor}>
                  {formatBRL(item.valor)}
                  <Text style={styles.investValorSufixo}>/mês</Text>
                </Text>
              </View>
            ))}
            <View style={styles.investDividerLine} />
            <View style={styles.investTotalRow}>
              <Text style={styles.investTotalLabel}>TOTAL MENSAL</Text>
              <Text style={styles.investTotalValor}>
                {formatBRL(totalMensal)}
                <Text style={styles.investValorSufixo}>/mês</Text>
              </Text>
            </View>
          </View>
        )}

        {dados.observacaoInvestimento ? (
          <Text style={styles.observacao}>{dados.observacaoInvestimento}</Text>
        ) : null}
        <Text style={styles.validade}>Proposta válida por {dados.validadeDias} dias.</Text>

        <SectionHeading numero={5} titulo="Próximo passo" />
        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Vamos começar?</Text>
          <Text style={styles.ctaText}>
            Para seguir, basta confirmar por aqui que a proposta foi aprovada. Enviamos o
            contrato na sequência e, assim que assinado, já daremos início ao trabalho.
          </Text>
        </View>
        <Text style={styles.closing}>Qualquer dúvida, estamos à disposição.</Text>

        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>ORTH</Text>
          <Text style={styles.brandTagline}>PRESENÇA DIGITAL & POSICIONAMENTO</Text>
          <Link src="https://www.orthdigital.com.br" style={styles.brandSite}>
            www.orthdigital.com.br
          </Link>
        </View>

        <Footer tituloProposta={dados.tituloProposta} clienteNome={dados.clienteNome} />
      </Page>
    </Document>
  )
}
