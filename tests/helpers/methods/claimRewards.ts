import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { toNano } from '@ton/core';

export const claimRewards = (contract: SandboxContract<EarnContract>, deployer: SandboxContract<TreasuryContract>): Promise<SendMessageResult> => {
    return contract.send(
        deployer.getSender(),
        {
            value: toNano('0.05')
        }, {
            $$type: 'ClaimRewards'
        });
};

