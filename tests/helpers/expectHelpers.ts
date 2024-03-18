import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { Investor, MainContract } from '../../build/MainContract/tact_MainContract';
import { expectHaveTran } from './expectations/expectHaveTran';
import { expectHaveOnlyOneEvent, expectNotHaveEvents, expectHaveFailEvents } from './expectations/expectHaveEvent';
import { expectSucceedDeposit } from './expectations/expectSucceedDeposit';


export interface ExpectHelpersType {
    haveTran: (result: SendMessageResult, value: bigint, success: boolean) => void;
    haveOnlyOneEvent: (result: SendMessageResult, value: bigint) => void;
    notHaveEvents: (result: SendMessageResult) => void;
    haveFailEvents: (result: SendMessageResult) => void;
    succeedDeposit: () => Promise<Investor>;
}

export const expectHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): ExpectHelpersType => {
    return {
        haveTran: (result: SendMessageResult, value: bigint, success: boolean = true) => expectHaveTran(contract, deployer, result, value, success),
        haveOnlyOneEvent: (result: SendMessageResult, value: bigint) => expectHaveOnlyOneEvent(contract, deployer, result, value),
        notHaveEvents: expectNotHaveEvents,
        haveFailEvents: expectHaveFailEvents,
        succeedDeposit: () => expectSucceedDeposit(contract, deployer)
    };
};
