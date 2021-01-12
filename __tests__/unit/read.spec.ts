import * as fs from 'fs';
import {read} from '../../src';
import {toArrayBuffer} from './utils';

declare const require: (path: string) => any;

describe('#read', () => {
    function getTestData(
        mt940FileName: string,
        resultFileName: string,
        isBuffer: boolean
    ): [Buffer | ArrayBuffer, any] {
        const buffer: Buffer = fs.readFileSync(`./__tests__/cases/${mt940FileName}`);
        const json: any[] = require(`./../cases/${resultFileName}`);

        return [isBuffer ? buffer : toArrayBuffer(buffer), json];
    }

    [
        ['ABN AMRO', 'abn-amro-1.STA', 'abn-amro-1.json'],
        ['ING-1', 'ing-1.mta', 'ing-1.json'],
        ['ING-2', 'ing-2.mta', 'ing-2.json'],
        ['BASE-1', 'base-1.mta', 'base-1.json'],
        ['BASE-2', 'base-2.mta', 'base-2.json'],
        ['BASE-3', 'base-3.mta', 'base-3.json']
    ].forEach(([provider, mt940FileName, resultFileName]) => {
        describe(`Provider: ${provider}`, () => {
            function test([data, expectedResult]: [Buffer | ArrayBuffer, any]) {
                it('should parse the file content', () => {
                    return read(data).then((statements) => {
                        expect(statements).toEqual(expectedResult);
                    });
                });
            }

            describe('Buffer', () => {
                test(getTestData(mt940FileName, resultFileName, true));
            });

            describe('ArrayBuffer', () => {
                test(getTestData(mt940FileName, resultFileName, false));
            });
        });
    });
});
