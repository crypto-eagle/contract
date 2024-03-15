import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MainContract } from '../wrappers/MainContract';
import '@ton/test-utils';
import { ExpectHelpersType, MethodHelpersType, expectHelpers, methodHelpers, createContractInstance } from './helpers';

describe('MainContract', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<MainContract>;
    let helper: MethodHelpersType;
    let expectHelper: ExpectHelpersType;

    beforeEach(async () => {
        const instance = await createContractInstance();
        deployer = instance.deployer;
        contract = instance.contract;

        helper = methodHelpers(contract, deployer);
        expectHelper = expectHelpers(contract, deployer);
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mainContract are ready to use
    });

    describe('deposit fail', () => {
        it('should not increase balance because of min deposit', async () => {
            const balanceBefore = await helper.getBalanceInfo();
            const value = toNano(0.02);

            const result = await helper.deposit(value);
            expectHelper.expectHaveTran(result, value, false);

            const balanceAfter = await helper.getBalanceInfo();

            expect(balanceBefore).toBe(balanceAfter);
            expectHelper.expectHaveFailEvents(result);
        });
    });

    describe('deposit succeed', () => {
        it('should increase balance', async () => {
            const balanceBefore = await helper.getBalanceInfo();
            const value = toNano(5);

            const result = await helper.deposit(value);
            expectHelper.expectHaveTran(result, value, true);

            const balanceAfter = await helper.getBalanceInfo();

            expect(balanceBefore).toBeNull();

            expect(balanceAfter).not.toBeNull();
            expect(balanceAfter?.total).toBe(value);
            expectHelper.expectHaveOnlyOneEvent(result, value);
        });
    });
});
