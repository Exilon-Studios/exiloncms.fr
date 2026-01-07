import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';

// Register fonts for better typography
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 700 },
  ],
});

interface InvoiceItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  companyName: string;
  companyAddress: string;
  companyPostalCode: string;
  companyCity: string;
  companyCountry: string;
  companySiret?: string;
  companyVat?: string;
  companyEmail: string;
  companyPhone?: string;
  companyType: 'company' | 'association' | 'micro_enterprise' | 'auto_entrepreneur';
  vatRate: number;

  customerName: string;
  customerEmail: string;
  customerMinecraftUsername?: string;

  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  total: number;

  paymentMethod?: string;
  paymentDate?: string;
  stripeInvoiceId?: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  companyDetails: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.5,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2563eb',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2563eb',
    textAlign: 'right',
    marginTop: 8,
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  addresses: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 20,
  },
  addressBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
  },
  addressLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  addressContent: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.6,
  },
  addressName: {
    fontWeight: 700,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableHeaderCellRight: {
    flex: 1,
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCell: {
    flex: 2,
    fontSize: 9,
    color: '#334155',
  },
  tableCellSmall: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    textAlign: 'center',
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    textAlign: 'right',
  },
  itemName: {
    fontWeight: 700,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 8,
    color: '#64748b',
  },
  totals: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 250,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  totalRowFinal: {
    borderTopWidth: 2,
    borderTopColor: '#1e293b',
    borderBottomWidth: 0,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: '#64748b',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 9,
    color: '#334155',
    fontWeight: 500,
  },
  totalLabelFinal: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: 700,
  },
  totalValueFinal: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: 700,
  },
  paymentInfo: {
    backgroundColor: '#fefce8',
    borderLeftWidth: 3,
    borderLeftColor: '#eab308',
    padding: 15,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20,
  },
  paymentInfoTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#854d0e',
    marginBottom: 8,
  },
  paymentInfoText: {
    fontSize: 9,
    color: '#854d0e',
    lineHeight: 1.6,
  },
  legalNotice: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 4,
    marginTop: 20,
  },
  legalNoticeTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#475569',
    marginBottom: 8,
  },
  legalNoticeText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.6,
  },
  legalNoticeBold: {
    fontWeight: 700,
    color: '#475569',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

const getVatMention = (companyType: string, vatNumber?: string): string => {
  if (companyType === 'association') {
    return 'TVA non applicable - Article 261-7-1 du CGI';
  }
  if (companyType === 'auto_entrepreneur' || companyType === 'micro_enterprise') {
    return 'TVA non applicable - Article 293 B du CGI';
  }
  if (!vatNumber) {
    return 'TVA non applicable';
  }
  return `TVA Intracommunautaire : ${vatNumber}`;
};

const getLegalMentions = (companyType: string): string[] => {
  const baseMentions = [
    'En cas de retard de paiement, une pénalité de 3 fois le taux d\'intérêt légal sera appliquée conformément à l\'article L441-10 du Code de Commerce.',
    'Indemnité forfaitaire pour frais de recouvrement : 40 € (article D441-5 du Code de Commerce).',
    'La présente facture est établie conformément aux dispositions du Code Général des Impôts (articles 289 et 289 I du CGI).',
  ];

  if (companyType === 'association') {
    return [
      ...baseMentions,
      'Association loi 1901 à but non lucratif.',
      'Les adhérents bénéficient des dispositions de l\'article 200 du CGI.',
    ];
  }

  if (companyType === 'auto_entrepreneur') {
    return [
      ...baseMentions,
      'Auto-entrepreneur : dispense d\'imposition de TVA (article 293 B du CGI).',
      'Prestation de services soumises aux droits d\'apport en déduction.',
    ];
  }

  if (companyType === 'micro_enterprise') {
    return [
      ...baseMentions,
      'Micro-entreprise : franchise de TVA (article 293 B du CGI).',
      'Le client ne peut pas déduire la TVA des prix payés.',
    ];
  }

  return baseMentions;
};

export const InvoiceDocument = ({ data }: { data: InvoiceData }) => {
  const vatMention = getVatMention(data.companyType, data.companyVat);
  const legalMentions = getLegalMentions(data.companyType);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{data.companyName}</Text>
              <Text style={styles.companyDetails}>
                {data.companyAddress}
                {'\n'}
                {data.companyPostalCode} {data.companyCity}
                {'\n'}
                {data.companyCountry}
                {data.companySiret && (
                  <>
                    {'\n'}SIRET : {data.companySiret}
                  </>
                )}
                {data.companyPhone && (
                  <>
                    {'\n'}Tél : {data.companyPhone}
                  </>
                )}
                {'\n'}
                {data.companyEmail}
              </Text>
            </View>
            <View>
              <Text style={styles.invoiceTitle}>FACTURE</Text>
              <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
              <Text style={styles.invoiceMeta}>
                Date d'émission : {data.invoiceDate}
                {data.dueDate && `\nDate d'échéance : ${data.dueDate}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addresses}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Émetteur</Text>
            <Text style={styles.addressContent}>
              <Text style={styles.addressName}>{data.companyName}</Text>
              {'\n'}
              {data.companyAddress}
              {'\n'}
              {data.companyPostalCode} {data.companyCity}
              {'\n'}
              {data.companyCountry}
              {data.companySiret && (
                <>
                  {'\n'}SIRET : {data.companySiret}
                </>
              )}
              {data.companyVat && (
                <>
                  {'\n'}N° TVA : {data.companyVat}
                </>
              )}
            </Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Client</Text>
            <Text style={styles.addressContent}>
              <Text style={styles.addressName}>{data.customerName}</Text>
              {'\n'}
              {data.customerEmail}
              {data.customerMinecraftUsername && (
                <>
                  {'\n'}Pseudo Minecraft : {data.customerMinecraftUsername}
                </>
              )}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <Text style={styles.sectionTitle}>Détail des prestations / produits</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Désignation</Text>
            <Text style={styles.tableHeaderCellRight}>Qté</Text>
            <Text style={styles.tableHeaderCellRight}>Prix unitaire</Text>
            <Text style={styles.tableHeaderCellRight}>Total HT</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
              </View>
              <Text style={styles.tableCellSmall}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>{item.price.toFixed(2)} €</Text>
              <Text style={styles.tableCellRight}>{(item.price * item.quantity).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total HT</Text>
            <Text style={styles.totalValue}>{data.subtotal.toFixed(2)} €</Text>
          </View>
          {data.vatRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA ({data.vatRate}%)</Text>
              <Text style={styles.totalValue}>{data.vatAmount.toFixed(2)} €</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalLabelFinal}>Total TTC</Text>
            <Text style={styles.totalValueFinal}>{data.total.toFixed(2)} €</Text>
          </View>
          {data.paymentMethod && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Mode de paiement</Text>
              <Text style={styles.totalValue}>{data.paymentMethod}</Text>
            </View>
          )}
        </View>

        {/* VAT Mention */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentInfoTitle}>Régime de TVA</Text>
          <Text style={styles.paymentInfoText}>{vatMention}</Text>
        </View>

        {/* Payment Info */}
        {data.paymentDate && (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoTitle}>Informations de paiement</Text>
            <Text style={styles.paymentInfoText}>
              {data.stripeInvoiceId ? `Facture Stripe : ${data.stripeInvoiceId}\n` : ''}
              {data.paymentMethod && `Mode de paiement : ${data.paymentMethod}\n`}
              Date de règlement : {data.paymentDate}
            </Text>
          </View>
        )}

        {/* Legal Mentions */}
        <View style={styles.legalNotice}>
          <Text style={styles.legalNoticeTitle}>Mentions légales</Text>
          {legalMentions.map((mention, index) => (
            <Text key={index} style={styles.legalNoticeText}>
              {mention}
            </Text>
          ))}
          <Text style={[styles.legalNoticeText, { marginTop: 10 }]}>
            <Text style={styles.legalNoticeBold}>
              Éditeur : {data.companyName} | SIRET : {data.companySiret || 'N/A'} | {vatMention}
            </Text>
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Facture générée automatiquement - {new Date().toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
