import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';
import { claimStakeHoldersRewardsGasValue } from '../consts';

export const claimStakeHoldersRewards = (contract: SandboxContract<FounderContract>, sender: SandboxContract<TreasuryContract>): Promise<SendMessageResult> => {
    return contract.send(
        sender.getSender(),
        {
            value: claimStakeHoldersRewardsGasValue,
            bounce: true,
        },
        {
            $$type: 'ClaimStakeHoldersRewards'
        },
    );
};
