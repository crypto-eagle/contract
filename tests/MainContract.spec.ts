import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../wrappers/MainContract';
import { createContractInstance, expectHelpers, ExpectHelpersType, methodHelpers, MethodHelpersType } from './helpers';
import { depositGasConsumption, minDeposit } from './helpers/consts';
import { ExitCodes } from './helpers/consts/exitCodes';
import { toNano } from '@ton/core';
import { expectHaveTran, expectHaveTranWith } from './helpers/expectations/expectHaveTran';
import { expectHaveFailEvents } from './helpers/expectations/expectHaveEvent';


describe('MainContract', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<MainContract>;
    let blockchain: Blockchain;
    let methodHelper: MethodHelpersType;
    let expectHelper: ExpectHelpersType;

    beforeEach(async () => {
        const instance = await createContractInstance();
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

    describe('deposit', () => {
        it('should not increase balance because of min deposit', async () => {
            const balanceBefore = await methodHelper.getMyBalanceInfo();
            const value = toNano(0.02);

            const result = await methodHelper.deposit(value, null);
            expectHaveTran(contract, deployer, result, value, false);

            const balanceAfter = await methodHelper.getMyBalanceInfo();

            expect(balanceBefore).toEqual(balanceAfter);
            expectHaveFailEvents(result);
        });

        it('should not increase balance with not existed upLine', async () => {
            const balanceBefore = await methodHelper.getMyBalanceInfo();
            const value = minDeposit;

            const wallets = await blockchain.createWallets(1, { balance: toNano(1000) });
            const result = await methodHelper.deposit(value, wallets[0].address);

            expectHaveTranWith(contract, deployer, result, value, ExitCodes.NotExistedUpLine);

            const balanceAfter = await methodHelper.getMyBalanceInfo();

            expect(balanceBefore).toEqual(balanceAfter);
            expectHaveFailEvents(result);
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
            const result = await methodHelper.getMyBalanceInfo();
            expect(result).not.toBeNull();
            expect(result?.totalDeposits).toBe(0n);
        });

        it('should return total deposits after deposit', async () => {
            await expectHelper.succeedDeposit(null);
            const result = await methodHelper.getMyBalanceInfo();

            expect(result).not.toBeNull();
            expect(result!.totalDeposits).toBe(minDeposit - depositGasConsumption);
        });

        it('should return total deposits after 10 deposits', async () => {
            for (const _ of Array(10)) {
                await methodHelper.deposit(minDeposit, null);
            }
            const result = await methodHelper.getMyBalanceInfo();

            expect(result).not.toBeNull();
            expect(result!.totalDeposits).toBe(minDeposit * 10n - depositGasConsumption * 10n);
        });
    });

});
