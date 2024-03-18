import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MainContract } from '../wrappers/MainContract';
import '@ton/test-utils';
import {
    ExpectHelpersType,
    MethodHelpersType,
    expectHelpers,
    methodHelpers,
    createContractInstance
} from './helpers';

const gasConsumption = toNano(0.03);

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
            const balanceBefore = await helper.getInvestorInfo();
            const value = toNano(0.02);

            const result = await helper.deposit(value);
            expectHelper.haveTran(result, value, false);

            const balanceAfter = await helper.getInvestorInfo();

            expect(balanceBefore).toBe(balanceAfter);
            expectHelper.haveFailEvents(result);
        });
    });

    describe('deposit succeed', () => {
        it('should increase balance', async () => {
            const investorInfo = await expectHelper.succeedDeposit();

            expect(investorInfo.upLine).toEqualAddress(await contract.getOwner());
            expect(investorInfo.transfersLength).toBe(1n);
            expect(investorInfo.transfers.size).toBe(1);
            expect(investorInfo.transfers.get(0)?.isDeposit).toBeTruthy();

            expect(investorInfo.transfers.get(0)?.amount).toBeLessThanOrEqual(await contract.getTotalBalance());
            expect(investorInfo.transfers.get(0)?.amount).toBe(toNano(5) - gasConsumption);
        });
    });
});
