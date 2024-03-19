import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import { MainContract } from '../wrappers/MainContract';
import '@ton/test-utils';
import {
    ExpectHelpersType,
    MethodHelpersType,
    expectHelpers,
    methodHelpers,
    createContractInstance
} from './helpers';
import { gasConsumption, minDeposit, testAddress } from './helpers/consts';


describe('MainContract', () => {
    let deployer: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<MainContract>;
    let methodHelper: MethodHelpersType;
    let expectHelper: ExpectHelpersType;

    beforeEach(async () => {
        const instance = await createContractInstance();
        deployer = instance.deployer;
        contract = instance.contract;

        methodHelper = methodHelpers(contract, deployer);
        expectHelper = expectHelpers(contract, deployer);
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mainContract are ready to use
    });

    describe('deposit', () => {
        it('should not increase balance because of min deposit', async () => {
            await expectHelper.failedDeposit();
        });

        it('should increase balance with owner upLine', async () => {
            await expectHelper.succeedDeposit(null);
        });

        it('should increase balance with custom upLine', async () => {
            await expectHelper.succeedDeposit(testAddress);
        });
    });

    describe('balance info', () => {
        it('should return empty balance', async () => {
            const result = await methodHelper.getBalanceInfo();
            expect(result).toBeNull();
        });

        it('should return total deposits after deposit', async () => {
            await expectHelper.succeedDeposit(null);
            const result = await methodHelper.getBalanceInfo();

            expect(result).not.toBeNull();
            expect(result!.totalDeposits).toBe(minDeposit - gasConsumption);
        });

        it('should return total deposits after 10 deposits', async () => {
            for (const _ of Array(10)) {
                await methodHelper.deposit(minDeposit, null);
            }
            const result = await methodHelper.getBalanceInfo();

            expect(result).not.toBeNull();
            expect(result!.totalDeposits).toBe(minDeposit * 10n - gasConsumption * 10n);
        });
    });
});
