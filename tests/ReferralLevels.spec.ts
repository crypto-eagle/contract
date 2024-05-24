// import { createEarnContractInstance, methodHelpers, MethodHelpersType } from './helpers';
// import { minDeposit } from './helpers/consts';
// import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
// import { EarnContract } from '../build/EarnContract/tact_EarnContract';
// import { toNano } from '@ton/core';
//
// describe('referral system', () => {
//     let blockchain: Blockchain;
//     let methodHelper: MethodHelpersType;
//     let contract: SandboxContract<EarnContract>;
//     let deployer: SandboxContract<TreasuryContract>;
//
//     beforeEach(async () => {
//         const instance = await createEarnContractInstance();
//         deployer = instance.deployer;
//         contract = instance.contract;
//         blockchain = instance.blockchain;
//
//         methodHelper = methodHelpers(contract, instance.deployer);
//     });
//
//     it('should deploy', async () => {
//         // the check is done inside beforeEach
//         // blockchain and mainContract are ready to use
//     });
//
//     /*it('should add upLiner (1 lvl) 30%', async () => {
//         // deposit to test wallet
//         const [testWallet] = await blockchain.createWallets(1);
//         const testWalletHelper = methodHelpers(contract, testWallet);
//
//         await testWalletHelper.deposit(minDeposit, null);
//         const testWalletBalanceInfo = await testWalletHelper.getMyBalanceInfo();
//
//         expect(testWalletBalanceInfo?.totalDeposits).toBe(minDeposit);
//
//         let deployerInfo = await methodHelper.getMyInvestorInfo();
//         const ownerBonus30 = minDeposit / 100n * 30n;
//
//         expect(deployerInfo?.bonus).toBe(ownerBonus30);
//
//         const balanceInfo = await methodHelper.getMyBalanceInfo();
//         expect(balanceInfo?.referralBonus).toBe(ownerBonus30);
//         expect(balanceInfo?.dailyIncome).toBe(0n);
//         expect(balanceInfo?.totalDeposits).toBe(0n);
//         expect(balanceInfo?.totalWithdrawals).toBe(0n);
//         expect(balanceInfo?.totalEarns).toBe(0n);
//     });*/
//
//     /*it('should count upLiners (20 lvl)', async () => {
//         const depositVal = toNano(10);
//         const depositOnePercent = depositVal / 100n;
//
//         const multi = (percent: bigint, times: bigint) => {
//             return depositOnePercent * percent * times;
//         };
//
//         const expectations = [
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 5n), // 1
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 5n), // 2
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 5n), // 3
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 5n), // 4
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 5n), // 5
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 4n), // 6
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 3n), // 7
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 2n), // 8
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n) + multi(5n, 1n), // 9
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 5n), // 10
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 4n), // 11
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 3n), // 12
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 2n), // 13
//             depositOnePercent * 30n + multi(10n, 4n) + multi(8n, 1n), // 14
//             depositOnePercent * 30n + multi(10n, 4n), // 15
//             depositOnePercent * 30n + multi(10n, 3n), // 16
//             depositOnePercent * 30n + multi(10n, 2n), // 17
//             depositOnePercent * 30n + multi(10n, 1n), // 18
//             depositOnePercent * 30n, // 19
//             0n // 20
//         ];
//
//         const wallets = await blockchain.createWallets(20);
//
//         let parentWallet = deployer;
//         await methodHelpers(contract, parentWallet).deposit(depositVal, null);
//
//         for (const wallet of wallets) {
//             const testWalletHelper = methodHelpers(contract, wallet);
//             await testWalletHelper.deposit(depositVal, parentWallet.address);
//
//             const testWalletBalanceInfo = await testWalletHelper.getMyBalanceInfo();
//             expect(testWalletBalanceInfo?.totalDeposits).toBe(depositVal);
//
//             parentWallet = wallet;
//         }
//
//         parentWallet = deployer;
//         for (let i = 0; i < 20; i++) {
//             const wallet = wallets[i];
//             const expectation = expectations[i];
//
//             const walletHelper = methodHelpers(contract, wallet);
//             const walletInfo = await walletHelper.getMyInvestorInfo();
//
//             expect(walletInfo?.bonus).toBe(expectation);
//             expect(walletInfo?.upLine).toEqualAddress(parentWallet.address);
//
//             const balanceInfo = await walletHelper.getMyBalanceInfo();
//             expect(balanceInfo?.referralBonus).toBe(expectation);
//             expect(balanceInfo?.dailyIncome).toBe(0n);
//             expect(balanceInfo?.totalDeposits).toBe(depositVal);
//             expect(balanceInfo?.totalWithdrawals).toBe(0n);
//             expect(balanceInfo?.totalEarns).toBe(0n);
//
//             parentWallet = wallets[i];
//         }
//     });*/
// });
