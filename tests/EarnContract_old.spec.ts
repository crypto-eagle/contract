// import '@ton/test-utils';
// import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
// import { EarnContract } from '../wrappers/EarnContract';
// import { createEarnContractInstance, expectHelpers, ExpectHelpersType, methodHelpers, MethodHelpersType } from './helpers';
// import { minDeposit, ExitCodes, rewardsPercent, maxDepositMultiplier } from './helpers/consts';
// import { Address, fromNano, toNano } from '@ton/core';
// import { expectHaveTran, expectHaveTranWith } from './helpers/expectations/expectHaveTran';
// import { expectHaveFailEvents, expectHaveOnlyOneEvent } from './helpers/expectations/expectHaveEvent';
// import { expectInvestorProfile } from './helpers/expectations/expectInvestorProfile';
// import { EventMessageSent } from '@ton/sandbox/dist/event/Event';
//
// const calcFounderDepositBonus = (depositAmount: bigint, percent: bigint): bigint => {
//     return depositAmount * percent / 100n;
// };
//
// const calcMaxClaimableRewards = (depositAmount: bigint, rewardsAmount: bigint): bigint => {
//     const maxRewardsAmount = depositAmount * rewardsPercent / 100n;
//     if (rewardsAmount > maxRewardsAmount) {
//         return maxRewardsAmount;
//     }
//
//     return rewardsAmount;
// };
//
// describe('EarnContract', () => {
//     let deployer: SandboxContract<TreasuryContract>;
//     let contract: SandboxContract<EarnContract>;
//     let investor: SandboxContract<TreasuryContract>;
//     let upLine: SandboxContract<TreasuryContract>;
//     let founderContract: SandboxContract<TreasuryContract>;
//     let blockchain: Blockchain;
//     let methodHelper: MethodHelpersType;
//     let expectHelper: ExpectHelpersType;
//
//     beforeEach(async () => {
//         const instance = await createEarnContractInstance();
//         deployer = instance.deployer;
//         contract = instance.contract;
//         investor = instance.investor;
//         upLine = instance.upLine;
//         founderContract = instance.founderContract;
//         blockchain = instance.blockchain;
//
//         methodHelper = methodHelpers(contract, deployer);
//         expectHelper = expectHelpers(contract, deployer);
//     });
//
//     it('should deploy', async () => {
//         // the check is done inside beforeEach
//         // blockchain and mainContract are ready to use
//     });
//
//     describe('receive initial Deposit', () => {
//         const cases = [
//             { value: minDeposit, upLineInit: () => null, profileUpLine: () => founderContract.address, founderBonusPercent: 11n },
//             { value: minDeposit, upLineInit: () => upLine.address, profileUpLine: () => upLine.address, founderBonusPercent: 1n },
//             { value: minDeposit + 1n, upLineInit: () => null, profileUpLine: () => founderContract.address, founderBonusPercent: 11n },
//             { value: minDeposit + 1n, upLineInit: () => upLine.address, profileUpLine: () => upLine.address, founderBonusPercent: 1n },
//             { value: minDeposit * maxDepositMultiplier - 1n, upLineInit: () => null, profileUpLine: () => founderContract.address, founderBonusPercent: 11n },
//             { value: minDeposit * maxDepositMultiplier - 1n, upLineInit: () => upLine.address, profileUpLine: () => upLine.address, founderBonusPercent: 1n },
//             { value: minDeposit * maxDepositMultiplier, upLineInit: () => null, profileUpLine: () => founderContract.address, founderBonusPercent: 11n },
//             { value: minDeposit * maxDepositMultiplier, upLineInit: () => upLine.address, profileUpLine: () => upLine.address, founderBonusPercent: 1n },
//         ];
//
//         it.each(cases)(
//             'should update investor profile',
//             async ({ value, upLineInit, profileUpLine }) => {
//                 await methodHelper.deposit(investor, value, upLineInit());
//
//                 await expectInvestorProfile(
//                     contract,
//                     investor.address,
//                     value,
//                     0n,
//                     0n,
//                     false,
//                     1n,
//                     0n,
//                     value,
//                     0n,
//                     0n,
//                     profileUpLine()
//                 );
//             }
//         );
//
//         it.each(cases)(
//             'should have transaction from investor to contract',
//             async ({ value, upLineInit }) => {
//                 const result = await methodHelper.deposit(investor, value, upLineInit());
//
//                 const date = new Date();
//                 date.setDate(date.getDate() + 2);
//                 console.log('date', date);
//                 jest
//                     .useFakeTimers()
//                     .setSystemTime(date);
//
//                 const profile = await methodHelper.getInvestorProfile(investor.address);
//
//                 console.log('profile', profile);
//
//                 expectHaveTran(contract, investor, result, value, true);
//             }
//         );
//
//         it.each(cases)(
//             'should decrease investor balance',
//             async ({ value, upLineInit }) => {
//                 const investorInitialBalance = await investor.getBalance();
//
//                 await methodHelper.deposit(investor, value, upLineInit());
//
//                 expect(investorInitialBalance).toBeGreaterThan(await investor.getBalance());
//             }
//         );
//
//         it.each(cases)(
//             'should increase contract balance',
//             async ({ value, upLineInit }) => {
//                 const contractInitialBalance = await contract.getBalance();
//
//                 await methodHelper.deposit(investor, value, upLineInit());
//
//                 expect(await contract.getBalance()).toBeGreaterThan(contractInitialBalance);
//             }
//         );
//
//         it.each(cases)(
//             'should have exact 2 events',
//             async ({ value, upLineInit }) => {
//                 const result = await methodHelper.deposit(investor, value, upLineInit());
//
//                 expect(result.events.length).toEqual(2);
//             }
//         );
//
//         it.each(cases)(
//             'should have exact 3 transactions',
//             async ({ value, upLineInit }) => {
//                 const result = await methodHelper.deposit(investor, value, upLineInit());
//
//                 expect(result.transactions.length).toEqual(3);
//             }
//         );
//
//         it.each(cases)(
//             'should have transaction from contract to founder',
//             async ({ value, upLineInit, founderBonusPercent }) => {
//                 const founderBonus = calcFounderDepositBonus(value, founderBonusPercent);
//
//                 const result = await methodHelper.deposit(investor, value, upLineInit());
//
//                 expectHaveTran(founderContract, contract, result, founderBonus, true);
//             }
//         );
//
//         it.each(cases)(
//             'should increase founder balance',
//             async ({ value, upLineInit }) => {
//                 const founderContractInitialBalance = await founderContract.getBalance();
//
//                 await methodHelper.deposit(investor, value, upLineInit());
//
//                 expect(await founderContract.getBalance()).toBeGreaterThan(founderContractInitialBalance);
//             }
//         );
//
//         it.each(cases)(
//             'should increase upLine referral bonus amount',
//             async ({ value, upLineInit }) => {
//                 const upLineAddress = upLineInit();
//                 if (upLineAddress != null) {
//                     const upLineDepositAmount = minDeposit;
//                     await methodHelper.deposit(upLine, upLineDepositAmount, null);
//
//                     await methodHelper.deposit(investor, value, upLineAddress);
//                     const expectedUpLineReferralBonus = value * 10n / 100n;
//
//                     await expectInvestorProfile(
//                         contract,
//                         upLineAddress,
//                         upLineDepositAmount,
//                         0n,
//                         expectedUpLineReferralBonus,
//                         false,
//                         1n,
//                         0n,
//                         upLineDepositAmount,
//                         0n,
//                         calcMaxClaimableRewards(minDeposit, expectedUpLineReferralBonus),
//                         founderContract.address
//                     );
//                 }
//             }
//         );
//
//     });
//
//     it('should withdraw', async () => {
//         await methodHelper.deposit(investor, toNano('100'), null);
//
//         console.log('deployer before', fromNano(await deployer.getBalance()));
//         console.log('contract before', fromNano(await contract.getBalance()));
//
//         await contract.send(
//             deployer.getSender(),
//             {
//                 value: toNano('0.1'),
//                 bounce: true
//             },
//             {
//                 $$type: "TemporaryWithdrawFeature"
//             }
//         );
//
//         const contractBalance = await contract.getBalance();
//         console.log('deployer after', fromNano(await deployer.getBalance()));
//         console.log('contract after', fromNano(await contract.getBalance()));
//
//         expect(contractBalance).toBeLessThan(toNano(0.1));
//     });
//
//     it('should return min deposit', async () => {
//         //const maxDeposit = await contract.getMaxDepositAmount(deployer.address);
//         //console.log('maxDeposit', fromNano(maxDeposit));
//     });
//
//     it('should deposit', async () => {
//         // const value = toNano(10);
//         // const result = await methodHelper.deposit(investor, value, null);
//         // expectHaveTran(contract, deployer, result, value, true);
//         //const investorProfile = await contract.getInvestorProfile(deployer.address);
//         //console.log('investorProfile.depositIsAvailable', investorProfile.depositIsAvailable);
//     });
//
//     it('should return profile', async () => {
//         // const result = await methodHelper.getInvestorProfile(deployer.address);
//         // expect(result).not.toBeNull();
//     });
//
//     describe('deposit', () => {
//         it('should not increase balance because of min deposit', async () => {
//             /*const balanceBefore = await methodHelper.getMyBalanceInfo();
//             const value = toNano(0.02);
//
//             const result = await methodHelper.deposit(value, null);
//             expectHaveTran(contract, deployer, result, value, false);
//
//             const balanceAfter = await methodHelper.getMyBalanceInfo();
//
//             expect(balanceBefore).toEqual(balanceAfter);
//             expectHaveFailEvents(result);*/
//         });
//
//         it('should not increase balance with not existed upLine', async () => {
//             /*const balanceBefore = await methodHelper.getMyBalanceInfo();
//             const value = minDeposit;
//
//             const wallets = await blockchain.createWallets(1, { balance: toNano(1000) });
//             const result = await methodHelper.deposit(value, wallets[0].address);
//
//             expectHaveTranWith(contract, deployer, result, value, ExitCodes.NotExistedUpLine);
//
//             const balanceAfter = await methodHelper.getMyBalanceInfo();
//
//             expect(balanceBefore).toEqual(balanceAfter);
//             expectHaveFailEvents(result);*/
//         });
//
//         it('should increase balance with owner upLine', async () => {
//             //await expectHelper.succeedDeposit(null);
//         });
//
//         it('should increase balance with owner upLine', async () => {
//             //await expectHelper.succeedDeposit(null);
//         });
//     });
//
//     describe('balance info', () => {
//         it('should return empty balance', async () => {
//             /*const result = await methodHelper.getMyBalanceInfo();
//             expect(result).not.toBeNull();
//             expect(result?.totalDeposits).toBe(0n);*/
//         });
//
//         it('should return total deposits after deposit', async () => {
//             /*await expectHelper.succeedDeposit(null);
//             const result = await methodHelper.getMyBalanceInfo();
//
//             expect(result).not.toBeNull();
//             expect(result!.totalDeposits).toBe(minDeposit);*/
//         });
//
//         it('should return total deposits after 10 deposits', async () => {
//             /*for (const _ of Array(10)) {
//                 await methodHelper.deposit(minDeposit, null);
//             }
//             const result = await methodHelper.getMyBalanceInfo();
//
//             expect(result).not.toBeNull();
//             expect(result!.totalDeposits).toBe(minDeposit * 10n);*/
//         });
//     });
//
//     describe('daily percent', () => {
//         it('should return 0 for 0 deposits', async () => {
//             /*const result = await methodHelper.getMyBalanceInfo();
//
//             expect(result).not.toBeNull();
//             expect(result?.totalDeposits).toBe(0n);
//             expect(result?.totalWithdrawals).toBe(0n);
//             expect(result?.totalEarns).toBe(0n);
//             expect(result?.referralBonus).toBe(0n);
//             expect(result?.dailyIncome).toBe(0n);*/
//         });
//
//         it('should return 0 for 1 deposits now', async () => {
//             /*await methodHelper.deposit(minDeposit, null);
//             const result = await methodHelper.getMyBalanceInfo();
//             const ownerBonus30 = minDeposit / 100n * 30n;
//
//             expect(result).not.toBeNull();
//             expect(result?.totalDeposits).toBe(minDeposit);
//             expect(result?.totalWithdrawals).toBe(0n);
//             expect(result?.totalEarns).toBe(0n);
//             expect(result?.referralBonus).toBe(ownerBonus30);
//             expect(result?.dailyIncome).toBe(0n);*/
//         });
//
//         /*it.each(['1', '2', '4', '8', '16', '32', '64', '128', '256'])(
//             'should return proper daily income after 1 deposit %s day before', async (offset) => {
//                 const offsetDays = +offset;
//
//                 await methodHelper.deposit(minDeposit, null);
//                 const ownerBonus30 = minDeposit / 100n * 30n;
//
//                 let nowDate = new Date();
//                 nowDate.setDate(nowDate.getDate() + offsetDays);
//                 jest.useFakeTimers().setSystemTime(nowDate.getTime());
//
//                 const result = await methodHelper.getMyBalanceInfo();
//
//                 expect(result).not.toBeNull();
//                 expect(result?.totalDeposits).toBe(minDeposit);
//                 expect(result?.totalWithdrawals).toBe(0n);
//                 expect(result?.totalEarns).toBe(0n);
//                 expect(result?.referralBonus).toBe(ownerBonus30);
//                 expect(result?.dailyIncome).toBe(minDeposit / 100n * BigInt(offsetDays));
//             });*/
//
//         /*it.each(['15', '23', '39', '71', '135', '263'])(
//             'should return proper daily income after 2 deposits (1 today, 1 in 7 days) deposits %s day before', async (offset) => {
//                 const offsetDays = +offset;
//                 let ownerBonus30 = minDeposit / 100n * 30n;
//
//                 await methodHelper.deposit(minDeposit, null);
//
//                 const secondDepositDate = new Date();
//                 secondDepositDate.setDate(secondDepositDate.getDate() + 7);
//                 const checkDate = new Date();
//                 checkDate.setDate(checkDate.getDate() + offsetDays);
//
//                 jest.useFakeTimers().setSystemTime(secondDepositDate.getTime());
//                 await methodHelper.deposit(minDeposit, null);
//
//                 jest.useFakeTimers().setSystemTime(checkDate.getTime());
//                 const result = await methodHelper.getMyBalanceInfo();
//
//                 expect(result).not.toBeNull();
//                 expect(result?.totalDeposits).toBe(minDeposit * 2n);
//                 expect(result?.totalWithdrawals).toBe(0n);
//                 expect(result?.totalEarns).toBe(0n);
//                 expect(result?.referralBonus).toBe(ownerBonus30 * 2n);
//
//                 let income = minDeposit * 7n / 100n;
//                 income += minDeposit * 2n * (BigInt(offsetDays) - 7n) / 100n;
//
//                 expect(result?.dailyIncome).toBe(income);
//             });*/
//
//         /*it.each(['15', '23', '39', '71', '135', '263'])(
//             'should return proper daily income after 3 deposits (1 today, 1 in 7 days, 1 in 8 days) deposits %s day before', async (offset) => {
//                 const offsetDays = +offset;
//                 let ownerBonus30 = minDeposit / 100n * 30n;
//
//                 await methodHelper.deposit(minDeposit, null);
//
//                 const secondDepositDate = new Date();
//                 secondDepositDate.setDate(secondDepositDate.getDate() + 7);
//                 const thirdDepositDate = new Date();
//                 thirdDepositDate.setDate(thirdDepositDate.getDate() + 8);
//                 const checkDate = new Date();
//                 checkDate.setDate(checkDate.getDate() + offsetDays);
//
//                 jest.useFakeTimers().setSystemTime(secondDepositDate.getTime());
//                 await methodHelper.deposit(minDeposit, null);
//
//                 jest.useFakeTimers().setSystemTime(thirdDepositDate.getTime());
//                 await methodHelper.deposit(minDeposit, null);
//
//                 jest.useFakeTimers().setSystemTime(checkDate.getTime());
//                 const result = await methodHelper.getMyBalanceInfo();
//
//                 expect(result).not.toBeNull();
//                 expect(result?.totalDeposits).toBe(minDeposit * 3n);
//                 expect(result?.totalWithdrawals).toBe(0n);
//                 expect(result?.totalEarns).toBe(0n);
//                 expect(result?.referralBonus).toBe(ownerBonus30 * 3n);
//
//                 let income = minDeposit * 7n / 100n;
//                 income += minDeposit * 2n * (8n - 7n) / 100n;
//                 income += minDeposit * 3n * (BigInt(offsetDays) - 8n) / 100n;
//
//                 expect(result?.dailyIncome).toBe(income);
//             });*/
//     });
//
// });
