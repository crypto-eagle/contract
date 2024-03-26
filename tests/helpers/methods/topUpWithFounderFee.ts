import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';

export const topUpWithFounderFee = (contract: SandboxContract<FounderContract>, sender: SandboxContract<TreasuryContract>, value: bigint): Promise<SendMessageResult> => {
    return contract.send(
        sender.getSender(),
        {
            value,
        },
        {
            $$type: 'TopUpWithFounderFee',
            amount: value,
        },
    );
};
