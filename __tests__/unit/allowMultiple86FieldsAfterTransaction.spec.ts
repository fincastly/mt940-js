import * as fs from 'fs';
import {read, ReadOptions} from '../../src';
import {toArrayBuffer} from './utils';

declare const require: (path: string) => any;

function getTestData(isBuffer: boolean, filePath: string): Buffer | ArrayBuffer {
    const buffer: Buffer = fs.readFileSync(filePath);

    return isBuffer ? buffer : toArrayBuffer(buffer);
}

const isBuffer = true;
describe('allow multiple 86 fields after transaction', () => {
    it('should append data if multiple 86 lines are found after transaction', async () => {
        // given
        const options: ReadOptions = {readMultipleInformationForAccountOwnerTagsPerTransaction: true};
        const data = getTestData(isBuffer, './__tests__/cases/ing-1-with-multiple-86-lines.mta');
        const expected: any[] = require(`./../cases/ing-1.json`);

        // when
        const actual = await read(data, options);

        // then
        expect(actual).toEqual(expected);
    });
});
