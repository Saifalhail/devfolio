import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaDownload } from 'react-icons/fa';
import logo from '../../../assets/logo.png';
import { colors, spacing, typography, borderRadius } from '../../../styles/GlobalTheme';

// Precomputed CRC32 table for zip generation
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function concat(arrays) {
  const length = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  arrays.forEach(a => { out.set(a, offset); offset += a.length; });
  return out;
}

function createZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach(({ name, content }) => {
    const nameBytes = encoder.encode(name);
    const dataBytes = content instanceof Uint8Array ? content : encoder.encode(content);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    // Local file header
    const local = new Uint8Array(30 + nameBytes.length);
    let p = 0;
    const w16 = v => { local[p++] = v & 255; local[p++] = (v >> 8) & 255; };
    const w32 = v => { w16(v & 0xffff); w16(v >>> 16); };
    w32(0x04034b50);
    w16(20); // version
    w16(0); // flag
    w16(0); // compression
    w16(0); w16(0); // mod time/date
    w32(crc);
    w32(size);
    w32(size);
    w16(nameBytes.length);
    w16(0); // extra length
    local.set(nameBytes, p);

    localParts.push(local, dataBytes);

    const central = new Uint8Array(46 + nameBytes.length);
    p = 0;
    const c16 = v => { central[p++] = v & 255; central[p++] = (v >> 8) & 255; };
    const c32 = v => { c16(v & 0xffff); c16(v >>> 16); };
    c32(0x02014b50);
    c16(20); // version made by
    c16(20); // version needed
    c16(0); // flag
    c16(0); // compression
    c16(0); c16(0); // time/date
    c32(crc);
    c32(size);
    c32(size);
    c16(nameBytes.length);
    c16(0); // extra len
    c16(0); // comment len
    c16(0); // disk start
    c16(0); // internal attr
    c32(0); // external attr
    c32(offset);
    central.set(nameBytes, p);

    centralParts.push(central);
    offset += local.length + dataBytes.length;
  });

  const centralStart = offset;
  const centralData = concat(centralParts);
  offset += centralData.length;

  const end = new Uint8Array(22);
  let p = 0;
  const e16 = v => { end[p++] = v & 255; end[p++] = (v >> 8) & 255; };
  const e32 = v => { e16(v & 0xffff); e16(v >>> 16); };
  e32(0x06054b50);
  e16(0); e16(0); // disk numbers
  e16(files.length); e16(files.length);
  e32(centralData.length);
  e32(centralStart);
  e16(0); // comment length

  return concat([...localParts, centralData, end]);
}

const DesignKit = () => {
  const { t } = useTranslation();

  const handleDownload = async () => {
    const theme = { colors, spacing, typography, borderRadius };
    const fonts = ['Nunito', 'Tajawal', 'Cairo', 'Fredoka'];

    const res = await fetch(logo);
    const logoBytes = new Uint8Array(await (await res.blob()).arrayBuffer());

    const zipData = createZip([
      { name: 'theme.json', content: JSON.stringify(theme, null, 2) },
      { name: 'fonts.txt', content: fonts.join('\n') },
      { name: 'logo.png', content: logoBytes },
      { name: 'colors.json', content: JSON.stringify(colors, null, 2) }
    ]);

    const blob = new Blob([zipData], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-kit.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload}>
      <FaDownload />
      {t('design.downloadKit', 'Download Design Kit')}
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #6e57e0, #9b6dff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  svg {
    font-size: 0.9rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(110, 87, 224, 0.3);
  }
`;

export default DesignKit;
