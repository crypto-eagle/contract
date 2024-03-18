import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../../../build/MainContract/tact_MainContract';

export const deposit = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>, value: bigint): Promise<SendMessageResult> => {
    return contract.send(
        deployer.getSender(),
        {
            value
        }, {
            $$type: 'Deposit',
            upLine: null
        });
};

