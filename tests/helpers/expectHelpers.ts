import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../../build/MainContract/tact_MainContract';
import { expectHaveTran } from './expectations/expectHaveTran';
import { expectHaveOnlyOneEvent, expectNotHaveEvents, expectHaveFailEvents } from './expectations/expectHaveEvent';


export interface ExpectHelpersType {
    expectHaveTran: (result: SendMessageResult, value: bigint, success: boolean) => void;
    expectHaveOnlyOneEvent: (result: SendMessageResult, value: bigint) => void;
    expectNotHaveEvents: (result: SendMessageResult) => void;
    expectHaveFailEvents: (result: SendMessageResult) => void;
}

export const expectHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): ExpectHelpersType => {
    return {
        expectHaveTran: (result: SendMessageResult, value: bigint, success: boolean = true) => expectHaveTran(contract, deployer, result, value, success),
        expectHaveOnlyOneEvent: (result: SendMessageResult, value: bigint) => expectHaveOnlyOneEvent(contract, deployer, result, value),
        expectNotHaveEvents,
        expectHaveFailEvents
    };
};
