declare module 'react-qr-barcode-scanner' {
  import { FC } from 'react';

  interface BarcodeScannerComponentProps {
    onUpdate: (error: any, result: any) => void;
    onError?: (error: string | DOMException) => void;
    width?: string | number;
    height?: string | number;
    facingMode?: string;
    torch?: boolean;
    delay?: number;
    videoConstraints?: any;
    stopStream?: boolean;
  }

  const BarcodeScannerComponent: FC<BarcodeScannerComponentProps>;
  export default BarcodeScannerComponent;
}
