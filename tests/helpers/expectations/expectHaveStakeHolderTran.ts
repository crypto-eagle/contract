import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';

export const expectHaveStakeHolderTran = (contract: SandboxContract<FounderContract>, stakeHolder: SandboxContract<TreasuryContract>, value: bigint, result: SendMessageResult) => {
    expect(result.transactions).toHaveTransaction({
        from: contract.address,
        to: stakeHolder.address,
        value,
        success: true
    });
};
