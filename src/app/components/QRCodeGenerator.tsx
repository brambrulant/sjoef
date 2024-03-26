import React from 'react';
import QRCode from 'qrcode.react';

export interface QRGeneratorProps {
  id: string;
  value: string;
  size?: number;
  disabled?: boolean;
}

function QRCodeGenerator(props: QRGeneratorProps) {
  const { id, value } = props;
  return (
    <div>
      <QRCode
        id={id}
        value={value}
        size={props.size || 128}
        bgColor={props.disabled ? '#6b6b6b' : '#fff'}
        fgColor="#000"
        level={'H'}
        style={{
          borderRadius: '8px',
        }}
      />
    </div>
  );
}

export default QRCodeGenerator;
