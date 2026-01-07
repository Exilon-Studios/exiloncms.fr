import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from './InvoiceDocument';
import { InvoiceData } from './InvoiceDocument';

interface GenerateInvoiceParams {
  orderId: number;
  orderData: any;
  companySettings: any;
}

export const useInvoiceGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvoice = async ({ orderId, orderData, companySettings }: GenerateInvoiceParams) => {
    setIsGenerating(true);
    setError(null);

    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: `FAC-${String(orderId).padStart(6, '0')}`,
        invoiceDate: new Date(orderData.created_at).toLocaleDateString('fr-FR'),
        companyName: companySettings.company_name || 'ExilonCMS',
        companyAddress: companySettings.company_address || '',
        companyPostalCode: companySettings.company_postal_code || '',
        companyCity: companySettings.company_city || '',
        companyCountry: companySettings.company_country || 'France',
        companySiret: companySettings.company_siret,
        companyVat: companySettings.company_vat,
        companyEmail: companySettings.company_email || '',
        companyPhone: companySettings.company_phone,
        companyType: companySettings.company_type || 'company',
        vatRate: parseFloat(companySettings.company_vat_rate || '20'),

        customerName: orderData.user?.name || 'Client',
        customerEmail: orderData.user?.email || '',
        customerMinecraftUsername: orderData.minecraft_username,

        items: orderData.items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })) || [],

        subtotal: parseFloat(orderData.total) || 0,
        vatAmount: parseFloat(orderData.total) * (parseFloat(companySettings.company_vat_rate || '20') / 100),
        total: parseFloat(orderData.total) || 0,

        paymentMethod: orderData.payment_method,
        paymentDate: orderData.paid_at ? new Date(orderData.paid_at).toLocaleDateString('fr-FR') : undefined,
        stripeInvoiceId: orderData.stripe_invoice_id,
      };

      const blob = await pdf(<InvoiceDocument data={invoiceData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture_${invoiceData.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération de la facture');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateInvoice,
    isGenerating,
    error,
  };
};

// Button component for invoice download
interface InvoiceDownloadButtonProps {
  orderId: number;
  orderData: any;
  companySettings: any;
  disabled?: boolean;
}

export const InvoiceDownloadButton = ({
  orderId,
  orderData,
  companySettings,
  disabled = false,
}: InvoiceDownloadButtonProps) => {
  const { generateInvoice, isGenerating, error } = useInvoiceGenerator();

  const handleDownload = async () => {
    const success = await generateInvoice({ orderId, orderData, companySettings });
    if (!success && error) {
      console.error('Invoice generation failed:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={disabled || isGenerating}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Génération...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger la facture
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          Erreur lors de la génération de la facture
        </div>
      )}
    </>
  );
};
