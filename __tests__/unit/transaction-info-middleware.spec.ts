import * as fs from 'fs';
import {read, ReadOptions, Transaction} from '../../src';
import {toArrayBuffer} from './utils';

declare const require: (path: string) => any;

function getTestData(isBuffer: boolean): Buffer | ArrayBuffer {
    const buffer: Buffer = fs.readFileSync('./__tests__/cases/ing-1.mta');

    return isBuffer ? buffer : toArrayBuffer(buffer);
}

const runTestSuite = ({isBuffer}: {isBuffer: boolean}) =>
    describe(`transaction middlewares, isBuffer: ${isBuffer}`, () => {
        it('should assign transaction middleware results to transaction-info tag', async () => {
            // given
            const options: ReadOptions = {
                middlewares: {
                    transactionInfo: (creditMark, code, bankReference) => ({isExpense: false} as Transaction)
                }
            };
            const data = getTestData(isBuffer);

            // when
            const [statement] = await read(data, options);

            // then
            statement.transactions.forEach((transaction) => expect(transaction.isExpense).toEqual(false));
        });

        it('should run `getTransactionId` after middleware is applied', async () => {
            // given
            const getTransactionId = jest.fn();
            const options: ReadOptions = {
                getTransactionId,
                middlewares: {
                    transactionInfo: (creditMark, code, bankReference) => ({isExpense: false} as Transaction)
                }
            };
            const data = getTestData(isBuffer);

            // when
            await read(data, options);

            // then
            expect(getTransactionId.mock.calls[0][0]).toMatchObject({
                isExpense: false
            });
        });
    });

runTestSuite({isBuffer: true});
runTestSuite({isBuffer: false});
