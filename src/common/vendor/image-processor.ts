import * as Jimp from 'jimp';
import { join } from 'path';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export class ImageProcessor {
  static async bufferToJpg(buffer: Buffer) {
    const image = await Jimp.read(buffer);
    const fileName = randomStringGenerator() + '.jpg';
    await image.writeAsync(join(__dirname, './../../public', fileName));
    return fileName;
  }
}
