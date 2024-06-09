import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../wrappers/EarnContract';
import {
    createEarnContractInstance,
    expectHelpers,
    ExpectHelpersType,
    methodHelpers,
    MethodHelpersType
} from './helpers';
import { maxDepositMultiplier, minDeposit } from './helpers/consts';
import { FounderContract } from '../build/FounderContract/tact_FounderContract';

async function hasMaxDepositAndSameMinDepositAfterFirstDeposit(methodHelper: MethodHelpersType, userWallet: SandboxContract<TreasuryContract>) {
    const result = await methodHelper.getDepositConstraints(userWallet.address);
    expect(result).not.toBeNull();

    expect(result.min).toEqual(minDeposit);

    const initialMaxDepositAmount = minDeposit * maxDepositMultiplier * 3n;
    expect(result.max).toEqual(initialMaxDepositAmount);
}

describe('EarnContract', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<EarnContract>;
    let investor: SandboxContract<TreasuryContract>;
    let upLine: SandboxContract<TreasuryContract>;
    let founderContract: SandboxContract<FounderContract>;
    let blockchain: Blockchain;
    let methodHelper: MethodHelpersType;
    let expectHelper: ExpectHelpersType;

    beforeEach(async () => {
        const instance = await createEarnContractInstance();
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
        // blockchain and mainContract are ready to use
    });

    describe('Not in Project', () => {
        let userWallet: SandboxContract<TreasuryContract>;

        beforeEach(async () => {
            userWallet = await blockchain.treasury('userWallet');
        });

        it('has initial depositConstraints', async () => {
            const result = await methodHelper.getDepositConstraints(userWallet.address);
            expect(result).not.toBeNull();

            expect(result.min).toEqual(minDeposit);

            const initialMaxDepositAmount = minDeposit * maxDepositMultiplier;
            expect(result.max).toEqual(initialMaxDepositAmount);
        });

        it('has empty investorProfile', async () => {
            const result = await methodHelper.getInvestorProfile(userWallet.address);
            expect(result).toBeNull();
        });
    });

    describe('First deposit no upLine', () => {
        let userWallet: SandboxContract<TreasuryContract>;

        beforeEach(async () => {
            userWallet = await blockchain.treasury('userWallet');
            await methodHelper.deposit(userWallet, minDeposit, null);
        });

        it('has extended max deposit and same min deposit', async () => {
            await hasMaxDepositAndSameMinDepositAfterFirstDeposit(methodHelper, userWallet);
        });

        it('has proper investorProfile', async () => {
            const result = await methodHelper.getInvestorProfile(userWallet.address);
            expect(result).not.toBeNull();

            const profile = result!;

            expect(profile.canDeposit).toBeFalsy();
            expect(profile.refAddress.toString()).toBe(userWallet.address.toString());
            expect(profile.upLine.toString()).toBe(founderContract.address.toString());

            expect(profile.total.deposit).toBe(minDeposit);
            expect(profile.total.claimed).toBe(0n);
            expect(profile.total.referalBonus).toBe(0n);

            expect(profile.current).not.toBeNull();
            expect(profile.current!.deposit).toBe(minDeposit);
            expect(profile.current!.claimedAmount).toBe(0n);
            expect(profile.current!.secondsPast).toBeLessThan(100n);
            expect(profile.current!.earnedAmount).toBe(0n);
            expect(profile.current!.earnedPercent).toBe(0n);

            const founderBalance = await founderContract.getBalance();
            expect(founderBalance).toBe(0n);
        });

        it('cannot claim rewards', async () => {
            const profileBefore = (await methodHelper.getInvestorProfile(userWallet.address))!;
            expect(profileBefore).not.toBeNull();
            expect(profileBefore.total.deposit).toBe(minDeposit);
            expect(profileBefore.current).not.toBeNull();
            expect(profileBefore.current!.deposit).toBe(minDeposit);

            await methodHelper.claimRewards(userWallet);

            const profileAfter = (await methodHelper.getInvestorProfile(userWallet.address))!;
            expect(profileAfter).not.toBeNull();
            expect(profileAfter.total.deposit).toBe(minDeposit);
            expect(profileAfter.current).not.toBeNull();
            expect(profileAfter.current!.deposit).toBe(minDeposit);
        });
    });

    describe('First deposit no upLine and after 310 days', () => {
        let userWallet: SandboxContract<TreasuryContract>;

        beforeEach(async () => {
            userWallet = await blockchain.treasury('userWallet');
            await methodHelper.deposit(userWallet, minDeposit, null);


            let nowDate = new Date();
            nowDate.setDate(nowDate.getDate() + 310);
            jest.useFakeTimers().setSystemTime(nowDate.getTime());
        });

        it('has extended max deposit and same min deposit', async () => {
            await hasMaxDepositAndSameMinDepositAfterFirstDeposit(methodHelper, userWallet);
        });

        it('has proper investorProfile', async () => {
            const result = await methodHelper.getInvestorProfile(userWallet.address);
            expect(result).not.toBeNull();

            const profile = result!;

            expect(profile.canDeposit).toBeFalsy();
            expect(profile.refAddress.toString()).toBe(userWallet.address.toString());
            expect(profile.upLine.toString()).toBe(founderContract.address.toString());

            expect(profile.total.deposit).toBe(minDeposit);
            expect(profile.total.claimed).toBe(0n);
            expect(profile.total.referalBonus).toBe(0n);

            const secondsPast = BigInt(310 * 24 * 60 * 60);
            const earnedAmount = BigInt(Number(minDeposit) * 3.1);

            expect(profile.current).not.toBeNull();
            expect(profile.current!.deposit).toBe(minDeposit);
            expect(profile.current!.claimedAmount).toBe(0n);
            expect(profile.current!.secondsPast).toBe(secondsPast);
            expect(profile.current!.earnedAmount).toBe(BigInt(earnedAmount));
            expect(profile.current!.earnedPercent).toBe(100n);

            const founderBalance = await founderContract.getBalance();
            expect(founderBalance).toBe(0n);
        });

        it('can claim rewards', async () => {
            const profileBefore = (await methodHelper.getInvestorProfile(userWallet.address))!;
            expect(profileBefore).not.toBeNull();
            expect(profileBefore.canDeposit).toBeFalsy();
            expect(profileBefore.current).not.toBeNull();

            await methodHelper.claimRewards(userWallet);

            const profileAfter = (await methodHelper.getInvestorProfile(userWallet.address))!;
            expect(profileAfter).not.toBeNull();

            expect(profileAfter.canDeposit).toBeTruthy();

            const earnedAmount = BigInt(Number(minDeposit) * 3.1);
            expect(profileAfter.total.deposit).toBe(minDeposit);
            expect(profileAfter.total.claimed).toBe(earnedAmount);
            expect(profileAfter.total.referalBonus).toBe(0n);

            expect(profileAfter.current).toBeNull();
        });
    });

    describe('2 deposit rounds', () => {
        let userWallet: SandboxContract<TreasuryContract>;

        beforeEach(async () => {
            userWallet = await blockchain.treasury('userWallet');
            await methodHelper.deposit(userWallet, minDeposit * 2n, null);


            let nowDate = new Date();
            nowDate.setDate(nowDate.getDate() + 310);
            jest.useFakeTimers().setSystemTime(nowDate.getTime());

            await methodHelper.claimRewards(userWallet);
            await methodHelper.deposit(userWallet, minDeposit * 4n, null);

            nowDate = new Date();
            nowDate.setDate(nowDate.getDate() + 310);
            jest.useFakeTimers().setSystemTime(nowDate.getTime());

            // await methodHelper.claimRewards(userWallet);
        });

        it('has extended max/min deposit', async () => {
            const result = await methodHelper.getDepositConstraints(userWallet.address);
            expect(result).not.toBeNull();

            console.log('result', result);

            const min = minDeposit * 4n;
            expect(result.min).toEqual(min);

            const max = minDeposit * maxDepositMultiplier * 9n;
            expect(result.max).toEqual(max);
        });

        it('has proper investorProfile', async () => {
            const result = await methodHelper.getInvestorProfile(userWallet.address);
            expect(result).not.toBeNull();

            const profile = result!;

            expect(profile.canDeposit).toBeFalsy();
            expect(profile.refAddress.toString()).toBe(userWallet.address.toString());
            expect(profile.upLine.toString()).toBe(founderContract.address.toString());

            expect(profile.total.deposit).toBe(minDeposit * 6n);
            expect(profile.total.claimed).toBe(minDeposit * 2n * 31n / 10n);
            expect(profile.total.referalBonus).toBe(0n);

            const secondsPast = BigInt(310 * 24 * 60 * 60);
            const earnedAmount = BigInt(Number(minDeposit * 4n) * 3.1);

            expect(profile.current).not.toBeNull();
            expect(profile.current!.deposit).toBe(minDeposit * 4n);
            expect(profile.current!.claimedAmount).toBe(0n);
            expect(profile.current!.secondsPast).toBe(secondsPast);
            expect(profile.current!.earnedAmount).toBe(BigInt(earnedAmount));
            expect(profile.current!.earnedPercent).toBe(100n);

            const founderBalance = await founderContract.getBalance();
            expect(founderBalance).toBe(0n);
        });

        it('can claim rewards', async () => {
            const profileBefore = (await methodHelper.getInvestorProfile(userWallet.address))!;
            expect(profileBefore).not.toBeNull();
            expect(profileBefore.canDeposit).toBeFalsy();
            expect(profileBefore.current).not.toBeNull();

            await methodHelper.claimRewards(userWallet);

            const profileAfter = (await methodHelper.getInvestorProfile(userWallet.address))!;
            expect(profileAfter).not.toBeNull();

            expect(profileAfter.canDeposit).toBeTruthy();

            const totalEarnedAmount = BigInt(Number(minDeposit * 6n) * 3.1);
            expect(profileAfter.total.deposit).toBe(minDeposit * 6n);
            expect(profileAfter.total.claimed).toBe(totalEarnedAmount);
            expect(profileAfter.total.referalBonus).toBe(0n);

            expect(profileAfter.current).toBeNull();
        });
    });

});
