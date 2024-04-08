import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';
import { ExitCodes } from '../consts';

export const expectHaveTran = (contract: SandboxContract<EarnContract | FounderContract>, sender: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint, success: boolean = true) => {
    expect(result.transactions).toHaveTransaction({
        from: sender.address,
        to: contract.address,
        value,
        success
    });
};
export const expectHaveTranWith = (contract: SandboxContract<EarnContract | FounderContract>, sender: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint, exitCode: ExitCodes) => {
    expect(result.transactions).toHaveTransaction({
        from: sender.address,
        to: contract.address,
        value,
        success: false,
        exitCode
    });
};

