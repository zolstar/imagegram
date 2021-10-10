export class Base64Helper {
  encode(unencoded) {
    return Buffer.from(unencoded || '').toString('base64');
  }

  decode(encoded) {
    return Buffer.from(encoded || '', 'base64').toString('utf8');
  }

  urlEncode(unencoded) {
    const encoded = this.encode(unencoded);
    return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
  }

  urlDecode(encoded) {
    encoded = encoded.replace('-', '+').replace('_', '/');
    while (encoded.length % 4) encoded += '=';
    return this.decode(encoded);
  }
}

export const base64Helper = new Base64Helper();
