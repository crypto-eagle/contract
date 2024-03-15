import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../../../build/MainContract/tact_MainContract';

export const expectHaveTran = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint, success: boolean = true) => {
    expect(result.transactions).toHaveTransaction({
        from: deployer.address,
        to: contract.address,
        value,
        success
    });
};

