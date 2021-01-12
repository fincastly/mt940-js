import * as fs from 'fs';
import { read, ReadOptions, Transaction } from '../../src';

declare const require: (path: string) => any;

function toArrayBuffer(buffer: Buffer) {
    const length: number = buffer.length;
    const ab: ArrayBuffer = new ArrayBuffer(length);
    const view: Uint8Array = new Uint8Array(ab);

    for (let i = 0; i < length; i++) {
        view[i] = buffer[i];
    }

    return ab;
}

function getTestData(isBuffer: boolean): Buffer | ArrayBuffer {
    const buffer: Buffer = fs.readFileSync('./__tests__/cases/ing-1.mta');

    return isBuffer ? buffer : toArrayBuffer(buffer);
}

describe('transaction middlewares', () => {
    function test([data, expectedResult]: [Buffer | ArrayBuffer, any], options: ReadOptions) {
        it('should parse the file content', () => {
            return read(data).then((statements) => {
                expect(statements).toEqual(expectedResult);
            });
        });
    }

    it('should assign transaction middleware results to transaction-info tag', async () => {
        // given
        const isBuffer = true;
        const options: ReadOptions = {
            middlewares: {
                transactionInfo: (creditMark, code, bankReference) => ({ isExpense: false } as Transaction),
            },
        };
        const data = getTestData(isBuffer);

        // when
        const [statement] = await read(data, options);

        // then
        statement.transactions.forEach(transaction => expect(transaction.isExpense).toEqual(false));
    });

    it('should run `getTransactionId` after middleware is applied', async () => {
        // given
        const isBuffer = true;
        const getTransactionId = jest.fn();
        const options: ReadOptions = {
            getTransactionId,
            middlewares: {
                transactionInfo: (creditMark, code, bankReference) => ({ isExpense: false } as Transaction),
            },
        };
        const data = getTestData(isBuffer);

        // when
        await read(data, options);

        // then
        expect(getTransactionId.mock.calls[0][0]).toMatchObject({
            isExpense: false,
        });
    });
});
