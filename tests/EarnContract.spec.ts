import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../wrappers/EarnContract';
import { createEarnContractInstance, expectHelpers, ExpectHelpersType, methodHelpers, MethodHelpersType } from './helpers';
import { minDeposit, ExitCodes } from './helpers/consts';
import { Address, fromNano, toNano } from '@ton/core';
import { expectHaveTran, expectHaveTranWith } from './helpers/expectations/expectHaveTran';
import { expectHaveFailEvents } from './helpers/expectations/expectHaveEvent';

describe('EarnContract', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<EarnContract>;
    let blockchain: Blockchain;
    let methodHelper: MethodHelpersType;
    let expectHelper: ExpectHelpersType;

    beforeEach(async () => {
        const instance = await createEarnContractInstance();
        deployer = instance.deployer;
        contract = instance.contract;
        blockchain = instance.blockchain;

        methodHelper = methodHelpers(contract, deployer);
        expectHelper = expectHelpers(contract, deployer);
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mainContract are ready to use
    });

    it('should return min deposit', async () => {
        const minDeposit = await contract.getMinDepositAmount(deployer.address);
        console.log('minDeposit', fromNano(minDeposit));
    });

    it('should return min deposit', async () => {
        const maxDeposit = await contract.getMaxDepositAmount(deployer.address);
        console.log('maxDeposit', fromNano(maxDeposit));
    });

    it('should deposit', async () => {
        const value = toNano(10);
        const result = await methodHelper.deposit(value, null);
        expectHaveTran(contract, deployer, result, value, true);
        const investorProfile = await contract.getInvestorProfile(deployer.address);
        console.log('investorProfile', investorProfile);
    });

    it('should return profile', async () => {
        const result = await methodHelper.getInvestorProfile(deployer.address);
        expect(result).not.toBeNull();
    });

    describe('deposit', () => {
        it('should not increase balance because of min deposit', async () => {
            /*const balanceBefore = await methodHelper.getMyBalanceInfo();
            const value = toNano(0.02);

            const result = await methodHelper.deposit(value, null);
            expectHaveTran(contract, deployer, result, value, false);

            const balanceAfter = await methodHelper.getMyBalanceInfo();

            expect(balanceBefore).toEqual(balanceAfter);
            expectHaveFailEvents(result);*/
        });

        it('should not increase balance with not existed upLine', async () => {
            /*const balanceBefore = await methodHelper.getMyBalanceInfo();
            const value = minDeposit;

            const wallets = await blockchain.createWallets(1, { balance: toNano(1000) });
            const result = await methodHelper.deposit(value, wallets[0].address);

            expectHaveTranWith(contract, deployer, result, value, ExitCodes.NotExistedUpLine);

            const balanceAfter = await methodHelper.getMyBalanceInfo();

            expect(balanceBefore).toEqual(balanceAfter);
            expectHaveFailEvents(result);*/
        });

        it('should increase balance with owner upLine', async () => {
            await expectHelper.succeedDeposit(null);
        });

        it('should increase balance with owner upLine', async () => {
            await expectHelper.succeedDeposit(null);
        });
    });

    describe('balance info', () => {
        it('should return empty balance', async () => {
            /*const result = await methodHelper.getMyBalanceInfo();
            expect(result).not.toBeNull();
            expect(result?.totalDeposits).toBe(0n);*/
        });

        it('should return total deposits after deposit', async () => {
            /*await expectHelper.succeedDeposit(null);
            const result = await methodHelper.getMyBalanceInfo();

            expect(result).not.toBeNull();
            expect(result!.totalDeposits).toBe(minDeposit);*/
        });

        it('should return total deposits after 10 deposits', async () => {
            /*for (const _ of Array(10)) {
                await methodHelper.deposit(minDeposit, null);
            }
            const result = await methodHelper.getMyBalanceInfo();

            expect(result).not.toBeNull();
            expect(result!.totalDeposits).toBe(minDeposit * 10n);*/
        });
    });

    describe('daily percent', () => {
        it('should return 0 for 0 deposits', async () => {
            /*const result = await methodHelper.getMyBalanceInfo();

            expect(result).not.toBeNull();
            expect(result?.totalDeposits).toBe(0n);
            expect(result?.totalWithdrawals).toBe(0n);
            expect(result?.totalEarns).toBe(0n);
            expect(result?.referralBonus).toBe(0n);
            expect(result?.dailyIncome).toBe(0n);*/
        });

        it('should return 0 for 1 deposits now', async () => {
            /*await methodHelper.deposit(minDeposit, null);
            const result = await methodHelper.getMyBalanceInfo();
            const ownerBonus30 = minDeposit / 100n * 30n;

            expect(result).not.toBeNull();
            expect(result?.totalDeposits).toBe(minDeposit);
            expect(result?.totalWithdrawals).toBe(0n);
            expect(result?.totalEarns).toBe(0n);
            expect(result?.referralBonus).toBe(ownerBonus30);
            expect(result?.dailyIncome).toBe(0n);*/
        });

        /*it.each(['1', '2', '4', '8', '16', '32', '64', '128', '256'])(
            'should return proper daily income after 1 deposit %s day before', async (offset) => {
                const offsetDays = +offset;

                await methodHelper.deposit(minDeposit, null);
                const ownerBonus30 = minDeposit / 100n * 30n;

                let nowDate = new Date();
                nowDate.setDate(nowDate.getDate() + offsetDays);
                jest.useFakeTimers().setSystemTime(nowDate.getTime());

                const result = await methodHelper.getMyBalanceInfo();

                expect(result).not.toBeNull();
                expect(result?.totalDeposits).toBe(minDeposit);
                expect(result?.totalWithdrawals).toBe(0n);
                expect(result?.totalEarns).toBe(0n);
                expect(result?.referralBonus).toBe(ownerBonus30);
                expect(result?.dailyIncome).toBe(minDeposit / 100n * BigInt(offsetDays));
            });*/

        /*it.each(['15', '23', '39', '71', '135', '263'])(
            'should return proper daily income after 2 deposits (1 today, 1 in 7 days) deposits %s day before', async (offset) => {
                const offsetDays = +offset;
                let ownerBonus30 = minDeposit / 100n * 30n;

                await methodHelper.deposit(minDeposit, null);

                const secondDepositDate = new Date();
                secondDepositDate.setDate(secondDepositDate.getDate() + 7);
                const checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + offsetDays);

                jest.useFakeTimers().setSystemTime(secondDepositDate.getTime());
                await methodHelper.deposit(minDeposit, null);

                jest.useFakeTimers().setSystemTime(checkDate.getTime());
                const result = await methodHelper.getMyBalanceInfo();

                expect(result).not.toBeNull();
                expect(result?.totalDeposits).toBe(minDeposit * 2n);
                expect(result?.totalWithdrawals).toBe(0n);
                expect(result?.totalEarns).toBe(0n);
                expect(result?.referralBonus).toBe(ownerBonus30 * 2n);

                let income = minDeposit * 7n / 100n;
                income += minDeposit * 2n * (BigInt(offsetDays) - 7n) / 100n;

                expect(result?.dailyIncome).toBe(income);
            });*/

        /*it.each(['15', '23', '39', '71', '135', '263'])(
            'should return proper daily income after 3 deposits (1 today, 1 in 7 days, 1 in 8 days) deposits %s day before', async (offset) => {
                const offsetDays = +offset;
                let ownerBonus30 = minDeposit / 100n * 30n;

                await methodHelper.deposit(minDeposit, null);

                const secondDepositDate = new Date();
                secondDepositDate.setDate(secondDepositDate.getDate() + 7);
                const thirdDepositDate = new Date();
                thirdDepositDate.setDate(thirdDepositDate.getDate() + 8);
                const checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + offsetDays);

                jest.useFakeTimers().setSystemTime(secondDepositDate.getTime());
                await methodHelper.deposit(minDeposit, null);

                jest.useFakeTimers().setSystemTime(thirdDepositDate.getTime());
                await methodHelper.deposit(minDeposit, null);

                jest.useFakeTimers().setSystemTime(checkDate.getTime());
                const result = await methodHelper.getMyBalanceInfo();

                expect(result).not.toBeNull();
                expect(result?.totalDeposits).toBe(minDeposit * 3n);
                expect(result?.totalWithdrawals).toBe(0n);
                expect(result?.totalEarns).toBe(0n);
                expect(result?.referralBonus).toBe(ownerBonus30 * 3n);

                let income = minDeposit * 7n / 100n;
                income += minDeposit * 2n * (8n - 7n) / 100n;
                income += minDeposit * 3n * (BigInt(offsetDays) - 8n) / 100n;

                expect(result?.dailyIncome).toBe(income);
            });*/
    });

});
