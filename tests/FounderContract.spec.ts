// import { toNano } from '@ton/core';
// import { SandboxContract, TreasuryContract } from '@ton/sandbox';
// import { FounderContract } from '../wrappers/FounderContract';
// import '@ton/test-utils';
// import {
//     createFounderContractInstance,
//     founderContractExpectHelpers,
//     FounderContractExpectHelpersType,
//     founderContractMethodHelpers,
//     FounderContractMethodHelpersType
// } from './helpers';
// import { ExitCodes, founderMinBalanceForStorage, minDeposit } from './helpers/consts';
//
// describe('FounderContract', () => {
//     let deployer: SandboxContract<TreasuryContract>;
//     let contract: SandboxContract<FounderContract>;
//     let mainContract: SandboxContract<TreasuryContract>;
//     let stakeHolderAContract: SandboxContract<TreasuryContract>;
//     let stakeHolderBContract: SandboxContract<TreasuryContract>;
//     let stakeHolderCContract: SandboxContract<TreasuryContract>;
//
//     let expectHelper: FounderContractExpectHelpersType;
//     let methodHelper: FounderContractMethodHelpersType;
//
//     beforeEach(async () => {
//         const instance = await createFounderContractInstance();
//
//         deployer = instance.deployer;
//         contract = instance.contract;
//         mainContract = instance.mainContract;
//         stakeHolderAContract = instance.stakeHolderAContract;
//         stakeHolderBContract = instance.stakeHolderBContract;
//         stakeHolderCContract = instance.stakeHolderCContract;
//
//         expectHelper = founderContractExpectHelpers(contract);
//         methodHelper = founderContractMethodHelpers(contract);
//     });
//
//     it('should deploy', async () => {
//         /*_*/
//     });
//
//     describe('receive null', () => {
//
//         it('should receive any amount successfully', async () => {
//             const initialContractBalance = await contract.getBalance();
//             const amount = toNano('1');
//
//             const receiveNullResult = await contract.send(
//                 mainContract.getSender(),
//                 {
//                     value: amount,
//                 },
//                 null,
//             );
//
//             expect(initialContractBalance).toEqual(toNano('0'));
//             expect(await contract.getBalance()).toEqual(initialContractBalance + amount - receiveNullResult.transactions[1].totalFees.coins);
//             expectHelper.haveTran(mainContract, receiveNullResult, amount, true);
//             expectHelper.haveOnlyOneEvent(mainContract, receiveNullResult, amount);
//         });
//
//     });
//
//     describe('receive TopUpWithFounderFee', () => {
//
//         it('should receive minimal founder fee from main contract successfully', async () => {
//             const founderFeeAmount = (minDeposit * 310n / 100n) * 30n / 100n;
//             const initialContractBalance = await contract.getBalance();
//
//             const receiveTopUpWithFounderFeeResult = await methodHelper.topUpWithFounderFee(mainContract, founderFeeAmount);
//
//             expect(initialContractBalance).toEqual(toNano('0'));
//             expect(await contract.getBalance()).toEqual(initialContractBalance + founderFeeAmount - receiveTopUpWithFounderFeeResult.transactions[1].totalFees.coins);
//             expectHelper.haveTran(mainContract, receiveTopUpWithFounderFeeResult, founderFeeAmount, true);
//             expectHelper.haveOnlyOneEvent(mainContract, receiveTopUpWithFounderFeeResult, founderFeeAmount);
//         });
//
//     });
//
//     describe('receive ClaimStakeHoldersRewards', () => {
//
//         it('should not claim stake holders rewards successfully - sender is not owner', async () => {
//             expectHelper.failedClaimStakeHoldersRewards(mainContract, ExitCodes.AccessDenied);
//         });
//
//         it('should not claim stake holders rewards successfully - contract balance eq 0', async () => {
//             expectHelper.failedClaimStakeHoldersRewards(deployer, ExitCodes.NotEnoughTON);
//         });
//
//         it('should not claim stake holders rewards successfully - available rewards amount is too low', async () => {
//             const initialContractBalance = await contract.getBalance();
//             const receiveTopUpWithFounderFeeResult = await methodHelper.topUpWithFounderFee(mainContract, founderMinBalanceForStorage);
//             let expectedBalance = founderMinBalanceForStorage - receiveTopUpWithFounderFeeResult.transactions[1].totalFees.coins;
//
//             expect(initialContractBalance).toEqual(toNano('0'));
//             expect(await contract.getBalance()).toEqual(expectedBalance);
//             expectHelper.failedClaimStakeHoldersRewards(deployer, ExitCodes.NotEnoughTON);
//         });
//
//     });
//
//     it('should claim stake holders rewards successfully', async () => {
//         const founderFeeAmount = (minDeposit * 310n / 100n) * 30n / 100n;
//         const initialContractBalance = await contract.getBalance();
//         const initialStakeHolderABalance = await stakeHolderAContract.getBalance();
//         const initialStakeHolderBBalance = await stakeHolderBContract.getBalance();
//         const initialStakeHolderCBalance = await stakeHolderCContract.getBalance();
//         const receiveTopUpWithFounderFeeResult = await methodHelper.topUpWithFounderFee(mainContract, founderFeeAmount);
//         const toppedUpContractBalance = await contract.getBalance();
//
//         const receiveClaimStakeHoldersRewardsResult = await methodHelper.claimStakeHoldersRewards(deployer);
//         const stakeHolderABalance = await stakeHolderAContract.getBalance();
//         const stakeHolderBBalance = await stakeHolderBContract.getBalance();
//         const stakeHolderCBalance = await stakeHolderCContract.getBalance();
//
//         expect(initialContractBalance).toEqual(toNano('0'));
//         expect(toppedUpContractBalance).toEqual(initialContractBalance + founderFeeAmount - receiveTopUpWithFounderFeeResult.transactions[1].totalFees.coins);
//         expect(await contract.getBalance()).toBeGreaterThanOrEqual(founderMinBalanceForStorage);
//         expect(stakeHolderABalance).toBeGreaterThan(initialStakeHolderABalance);
//         expect(stakeHolderBBalance).toBeGreaterThan(initialStakeHolderBBalance);
//         expect(stakeHolderCBalance).toBeGreaterThan(initialStakeHolderCBalance);
//         expect(receiveClaimStakeHoldersRewardsResult.events.length).toBe(4);
//         expect(receiveClaimStakeHoldersRewardsResult.transactions.length).toBe(5);
//
//         /* TODO: Figure out why this shit does not work
//
//         const stakeHolderARewards: bigint = stakeHolderABalance - initialStakeHolderABalance;
//         const stakeHolderBRewards: bigint = stakeHolderBBalance - initialStakeHolderBBalance;
//         const stakeHolderCRewards: bigint = stakeHolderCBalance - initialStakeHolderCBalance;
//         const totalRewards: bigint = stakeHolderARewards + stakeHolderBRewards + stakeHolderCRewards;
//
//         const expectedStakeHolderARewards: bigint = (totalRewards * 750n) / 1000n;
//         const expectedStakeHolderBRewards: bigint = (totalRewards * 125n) / 1000n;
//         const expectedStakeHolderCRewards: bigint = (totalRewards * 125n) / 1000n;
//
//         expect(stakeHolderARewards).toEqual(expectedStakeHolderARewards);
//         expect(stakeHolderBRewards).toEqual(expectedStakeHolderBRewards);
//         expect(stakeHolderCRewards).toEqual(expectedStakeHolderCRewards);
//
//         */
//     });
//
// });
