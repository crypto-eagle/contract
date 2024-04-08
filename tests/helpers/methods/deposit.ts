import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { Address } from '@ton/core';

export const deposit = (contract: SandboxContract<EarnContract>, deployer: SandboxContract<TreasuryContract>, value: bigint, upLine: Address | null): Promise<SendMessageResult> => {
    return contract.send(
        deployer.getSender(),
        {
            value
        }, {
            $$type: 'Deposit',
            upLine
        });
};

