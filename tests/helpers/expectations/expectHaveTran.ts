import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';
import { ExitCodes } from '../consts';

export const expectHaveTran = (receiver: SandboxContract<EarnContract | FounderContract | TreasuryContract>, sender: SandboxContract<EarnContract | FounderContract | TreasuryContract>, result: SendMessageResult, value: bigint, success: boolean = true) => {
    expect(result.transactions).toHaveTransaction({
        from: sender.address,
        to: receiver.address,
        value,
        success
    });
};
export const expectHaveTranWith = (receiver: SandboxContract<EarnContract | FounderContract | TreasuryContract>, sender: SandboxContract<EarnContract | FounderContract | TreasuryContract>, result: SendMessageResult, value: bigint, exitCode: ExitCodes) => {
    expect(result.transactions).toHaveTransaction({
        from: sender.address,
        to: receiver.address,
        value,
        success: false,
        exitCode
    });
};

