import bufferToText from '../utils/buffer-to-text';
import compareArrays from '../utils/compare-arrays';
import {colonSymbolCode} from '../tokens';
import {Tag, State, Statement} from '../index';

/**
 * @description :21:
 * @type {Uint8Array}
 */
const token: Uint8Array = new Uint8Array([colonSymbolCode, 50, 49, colonSymbolCode]);
const tokenLength: number = token.length;
const relatedReferenceNumberTag: Tag = {
    readToken(state: State) {
        if (!compareArrays(token, 0, state.data, state.pos, tokenLength)) {
            return 0;
        }

        return state.pos + tokenLength;
    },

    close(state: State) {
        const statement: Statement | undefined = state.statements[state.statementIndex];

        if (!statement) {
            return;
        }

        statement.relatedReferenceNumber = bufferToText(state.data, state.tagContentStart, state.tagContentEnd);
    }
};

export default relatedReferenceNumberTag;
