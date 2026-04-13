import { Injectable, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  aes256GcmDecrypt,
  aes256GcmEncrypt,
  decomposeEncryptedData,
  deriveKey,
  formatEncryptedData,
  generateRandomString,
} from "src/core/utils/crypto-utils";
import {
  DescryptDEKSchema,
  GenerateDEKResponse,
  GenerateKEKResponse,
} from "./types";
import { InfisicalService } from "src/common/infisical/infisical.service";

@Injectable()
export class EncryptionKeyService {
  constructor(
    private configService: ConfigService,
    @Optional() private infisicalService: InfisicalService,
  ) {}

  // generate Key Encryption Key
  async generateKEK(userId: string): Promise<GenerateKEKResponse | null> {
    const masterKey = this.configService.get<string>("encryption.keyMaster");

    if (!masterKey || !this.infisicalService) return null;

    // generate KEK based on masterKey
    const plainKEK = deriveKey(masterKey).toString("hex");

    const { IV, encrypted, tag } = aes256GcmEncrypt(plainKEK, masterKey);
    const encryptedKEK = formatEncryptedData(IV, encrypted, tag);

    // send encrypted KEK to infiscal
    await this.infisicalService.createSecret(
      `KEK_user_${userId}`,
      encryptedKEK,
    );

    return {
      plainKEK,
    };
  }

  // generate DEK encryption key
  generateDEK(kek?: string): GenerateDEKResponse | null {
    const randomKey = generateRandomString(32);

    if (!kek) return null;

    const { IV, tag, encrypted } = aes256GcmEncrypt(randomKey, kek);

    return {
      encryptedDEK: formatEncryptedData(IV, encrypted, tag),
      plainDEK: randomKey,
    };
  }

  // decrypt KEK
  async decryptKEK(userId: string): Promise<string | null> {
    const masterKey = this.configService.get<string>("encryption.keyMaster");

    if (!masterKey || !this.infisicalService) return null;

    // get stored KEK from infisical
    const secret = await this.infisicalService.getSecret(
      `KEK_user_${userId}`,
    );
    if (!secret) return null;

    const { IV, encrypted, tag } = decomposeEncryptedData(secret.secretValue);

    return aes256GcmDecrypt({
      encrypted,
      key: masterKey,
      IV,
      tag,
    });
  }

  // decrypt DEK
  decryptDEK(params: DescryptDEKSchema): string | null {
    return aes256GcmDecrypt({
      encrypted: params.Dek,
      key: params.Kek,
      IV: params.IV,
      tag: params.tag,
    });
  }
}
