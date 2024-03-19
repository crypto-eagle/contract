import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../../../build/MainContract/tact_MainContract';
import { Address } from '@ton/core';

export const deposit = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>, value: bigint, upLine: Address | null): Promise<SendMessageResult> => {
    return contract.send(
        deployer.getSender(),
        {
            value
        }, {
            $$type: 'Deposit',
            upLine
        });
};

