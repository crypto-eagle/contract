import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/founder_contract.tact',
    options: {
        debug: true,
    },
};
