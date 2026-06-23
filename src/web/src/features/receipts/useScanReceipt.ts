import { useState } from 'react';

// Defaults to your deployed function. Override locally with VITE_OCR_URL if you
// want to hit http://localhost:7071/api/ScanReceipt instead.
const OCR_URL =
  import.meta.env.VITE_OCR_URL ??
  'https://func-snapreceipt-ocr.azurewebsites.net/api/ScanReceipt';

export type ScannedReceipt = {
  merchant?: string;
  total?: number;
  currency?: string;
  purchasedOn?: string;
};

export function useScanReceipt() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scan(file: File): Promise<ScannedReceipt | null> {
    setIsScanning(true);
    setError(null);
    try {
      const response = await fetch(OCR_URL, { method: 'POST', body: file });
      if (!response.ok) throw new Error('Scan failed');
      return (await response.json()) as ScannedReceipt;
    } catch {
      setError('Could not read the receipt. Try another photo or enter it manually.');
      return null;
    } finally {
      setIsScanning(false);
    }
  }

  return { scan, isScanning, error };
}