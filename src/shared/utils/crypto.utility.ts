import { Injectable } from '@nestjs/common';
import * as cr from 'typeorm-encrypted';
import { CryptoKey } from './cryptoKey.util';

@Injectable()
export class CryptoUtility {
  async encode(plainText: string): Promise<any> {
    const transformer = new cr.EncryptionTransformer(CryptoKey);
    return transformer.to(plainText);
  }

  async decode(cipherText: string): Promise<string> {
    const transformer = new cr.EncryptionTransformer(CryptoKey);
    return transformer.from(cipherText);
  }
}
