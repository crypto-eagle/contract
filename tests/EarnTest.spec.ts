import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { EarnTest } from '../wrappers/EarnTest';
import '@ton/test-utils';
import { createEarnTestContractInstance } from './helpers/createEarnTestContractInstance';
import { FounderContract } from '../build/FounderContract/tact_FounderContract';
import { expectHelpers, ExpectHelpersType, methodHelpers, MethodHelpersType } from './helpers';
import { minDeposit } from './helpers/consts';
import { toNano } from '@ton/core';
import { expectHaveTran } from './helpers/expectations/expectHaveTran';

async function getProfile(methodHelper: MethodHelpersType, userWallet: SandboxContract<TreasuryContract>) {
    let result = await methodHelper.getInvestorProfile(userWallet.address);
    expect(result).not.toBeNull();

    return result!;
}

describe('EarnTest', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<EarnTest>;
    let investor: SandboxContract<TreasuryContract>;
    let upLine: SandboxContract<TreasuryContract>;
    let founderContract: SandboxContract<FounderContract>;
    let blockchain: Blockchain;
    let methodHelper: MethodHelpersType;
    let expectHelper: ExpectHelpersType;

    beforeEach(async () => {
        const instance = await createEarnTestContractInstance();
        deployer = instance.deployer;
        contract = instance.contract;
        investor = instance.investor;
        upLine = instance.upLine;
        founderContract = instance.founderContract.contract;
        blockchain = instance.blockchain;

        methodHelper = methodHelpers(contract);
        expectHelper = expectHelpers(contract, deployer);
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and earnTest are ready to use
    });

    it('should set round date', async () => {
        let userWallet: SandboxContract<TreasuryContract>;
        userWallet = await blockchain.treasury('userWallet');

        await methodHelper.deposit(userWallet, minDeposit, null);
        let profile = await getProfile(methodHelper, userWallet);
        expect(profile.current!.secondsPast).toBe(0n);

        const result = await contract.send(
            userWallet.getSender(),
            {
                value: toNano('0.2')
            }, {
                $$type: 'TemporarySetRoundDateBack',
                daysBack: 10n
            });

        expectHaveTran(contract, userWallet, result, toNano('0.2'), true);

        profile = await getProfile(methodHelper, userWallet);
        expect(profile.current!.secondsPast).toBe(10n * 24n * 60n * 60n);
    });
});
