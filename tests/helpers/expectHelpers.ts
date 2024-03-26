import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { BalanceInfo, MainContract } from '../../build/MainContract/tact_MainContract';
import { FounderContract } from "../../build/FounderContract/tact_FounderContract";
import { expectHaveTran } from './expectations/expectHaveTran';
import { expectHaveOnlyOneEvent, expectNotHaveEvents, expectHaveFailEvents } from './expectations/expectHaveEvent';
import { expectSucceedDeposit } from './expectations/expectSucceedDeposit';
import { Address } from '@ton/core';
import { expectFailedClaimStakeHoldersRewards } from './expectations/expectFailedClaimStakeHoldersRewards';
import { expectHaveStakeHolderTran } from './expectations/expectHaveStakeHolderTran';
import { ExitCodes } from './consts';


export interface ExpectHelpersType {
    haveTran: (result: SendMessageResult, value: bigint, success: boolean) => void;
    haveOnlyOneEvent: (result: SendMessageResult, value: bigint) => void;
    notHaveEvents: (result: SendMessageResult) => void;
    haveFailEvents: (result: SendMessageResult) => void;
    succeedDeposit: (upLine: Address | null) => Promise<BalanceInfo>;
}

export interface FounderContractExpectHelpersType {
    haveTran: (sender: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint, success: boolean) => void;
    haveOnlyOneEvent: (sender: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint) => void;
    failedClaimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>, exitCode: ExitCodes) => void;
    haveStakeHolderTran: (stakeHolder: SandboxContract<TreasuryContract>, value: bigint, result: SendMessageResult) => void;
}

export const expectHelpers = (contract: SandboxContract<MainContract>, deployer: SandboxContract<TreasuryContract>): ExpectHelpersType => {
    return {
        haveTran: (result: SendMessageResult, value: bigint, success: boolean = true) => expectHaveTran(contract, deployer, result, value, success),
        haveOnlyOneEvent: (result: SendMessageResult, value: bigint) => expectHaveOnlyOneEvent(contract, deployer, result, value),
        notHaveEvents: expectNotHaveEvents,
        haveFailEvents: expectHaveFailEvents,
        succeedDeposit: (upLine: Address | null) => expectSucceedDeposit(contract, deployer, upLine),
    };
};

export const founderContractExpectHelpers = (contract: SandboxContract<FounderContract>): FounderContractExpectHelpersType => {
    return {
        haveTran: (sender: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint, success: boolean = true) => expectHaveTran(contract, sender, result, value, success),
        haveOnlyOneEvent: (sender: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint) => expectHaveOnlyOneEvent(contract, sender, result, value),
        failedClaimStakeHoldersRewards: (sender: SandboxContract<TreasuryContract>, exitCode: ExitCodes) => expectFailedClaimStakeHoldersRewards(contract, sender, exitCode),
        haveStakeHolderTran: (stakeHolder: SandboxContract<TreasuryContract>, value: bigint, result: SendMessageResult) => expectHaveStakeHolderTran(contract, stakeHolder, value, result),
    };
};
