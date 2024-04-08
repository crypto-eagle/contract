import "@stdlib/deploy";
import "@stdlib/ownable";

import "./earn_contract_helpers/messages.tact";
import "./earn_contract_helpers/structures.tact";
import "./earn_contract_helpers/functions.tact";

contract EarnContract with Deployable, Ownable, Functions {
    id: Int as uint32;
    owner: Address;
    meta: ContractMeta;
    investors: map<Address, Investor>;
    claimRewardsBonusPercentByLevel: map<Int, Int>;

    init(
        id: Int,
        founder: Address,
        minDeposit: Int,
        maxDepositMultiplier: Int,
        rewardsPercent: Int,
        depositDirectUpLineBonusPercent: Int,
        depositFounderBonusPercent: Int
    ) {
        self.id = id;
        self.owner = sender();
        self.meta = ContractMeta {
            founder: founder,
            minDeposit: minDeposit,
            maxDepositMultiplier: maxDepositMultiplier,
            rewardsPercent: rewardsPercent,
            depositDirectUpLineBonusPercent: depositDirectUpLineBonusPercent,
            depositFounderBonusPercent: depositFounderBonusPercent
        };
        self.investors = emptyMap();
        self.claimRewardsBonusPercentByLevel = emptyMap();

        self.claimRewardsBonusPercentByLevel.set(1, 30);
        self.claimRewardsBonusPercentByLevel.set(2, 10);
        self.claimRewardsBonusPercentByLevel.set(3, 10);
        self.claimRewardsBonusPercentByLevel.set(4, 10);
        self.claimRewardsBonusPercentByLevel.set(5, 10);
        self.claimRewardsBonusPercentByLevel.set(6, 8);
        self.claimRewardsBonusPercentByLevel.set(7, 8);
        self.claimRewardsBonusPercentByLevel.set(8, 8);
        self.claimRewardsBonusPercentByLevel.set(9, 8);
        self.claimRewardsBonusPercentByLevel.set(10, 8);
        self.claimRewardsBonusPercentByLevel.set(11, 5);
        self.claimRewardsBonusPercentByLevel.set(12, 5);
        self.claimRewardsBonusPercentByLevel.set(13, 5);
        self.claimRewardsBonusPercentByLevel.set(14, 5);
        self.claimRewardsBonusPercentByLevel.set(15, 5);
    }

    // --- methods ---

    receive(msg: Deposit) {
        let depositAmount: Int = context().value;
        let investor: Investor = self.getOrCreateInvestorFromSender(self.resolveUpLine(msg, self.meta));

        require(investor.round.isClaimed, "Claim rewards before deposit");
        require(
            depositAmount >= self.calcMinDepositAmount(investor, self.meta),
            "Deposit amount is not enough"
        );
        require(
            depositAmount <= self.calcMaxDepositAmount(investor, self.meta),
            "Maximum deposit limit exceeded"
        );

        investor.round = self.createRound(investor.round.serial + 1, depositAmount, now(), 0, false);
        investor.totalDeposit = investor.totalDeposit + depositAmount;
        self.investors.set(investor.address, investor);

        self.enrollUpLineDepositBonus(investor, self.meta, self.investors.get(investor.upLine));
        self.enrollFounderDepositBonus(investor, self.meta);

        emit("Deposited".asComment());
    }

    receive(msg: ClaimRewards) {
        let investor: Investor = self.tryToResolveInvestor(sender());

        require(!investor.round.isClaimed, "You already claimed rewards");

        let maxRewards: Int = self.calcMaxRewards(investor, self.meta);
        let dailyIncome: Int = self.calcDailyIncome(investor, self.meta);
        let referralBonus: Int = investor.referralBonus;

        require((dailyIncome + referralBonus) >= maxRewards, "Your rewards amount is not enough to claim");

        investor.round.isClaimed = true;
        investor.round.claimedAt = now();
        investor.referralBonus = referralBonus - (maxRewards - dailyIncome);
        investor.totalClaimedRewards = investor.totalClaimedRewards + maxRewards;
        self.investors.set(investor.address, investor);

        self.payInvestorRewards(investor, maxRewards);

        self.enrollClaimRewardsBonus(investor, maxRewards, 1);

        emit("Claimed rewards".asComment());
    }

    // --- getters ---

    get fun minDepositAmount(address: Address): Int {
        return self.calcMinDepositAmount(self.resolveInvestor(address), self.meta);
    }

    get fun maxDepositAmount(address: Address): Int {
        return self.calcMaxDepositAmount(self.resolveInvestor(address), self.meta);
    }

    get fun investorProfile(address: Address): Profile {
        let investor: Investor = self.tryToResolveInvestor(address);

        return Profile {
            totalDeposit: investor.totalDeposit,
            totalClaimedRewards: investor.totalClaimedRewards,
            totalReferralBonus: investor.totalReferralBonus,
            currentRound: investor.round.serial,
            currentDeposit: investor.round.amount,
            currentReferralBonus: investor.referralBonus,
            currentDailyIncome: self.calcDailyIncome(investor, self.meta)
        };
    }

    // --- functions ---

    fun tryToResolveInvestor(address: Address): Investor {
        let investor: Investor? = self.resolveInvestor(address);

        require((investor != null), "Investor is not registered");

        return investor!!;
    }

    fun resolveInvestor(address: Address): Investor? {
        return self.investors.get(address);
    }

    fun getOrCreateInvestorFromSender(upLine: Address): Investor {
        let investor: Investor? = self.resolveInvestor(sender());

        if (null != investor) {
            return investor!!;
        }

        let newInvestorAddress: Address = sender();
        let newInvestor: Investor = self.createInvestor(newInvestorAddress, upLine);

        self.investors.set(newInvestorAddress, newInvestor);

        return newInvestor;
    }

    fun enrollUpLineDepositBonus(investor: Investor, contractMeta: ContractMeta, upLine: Investor?) {
        if (upLine == null) {
            return;
        }

        let depositDirectBonus: Int = investor.round.amount * contractMeta.depositDirectUpLineBonusPercent / 100;
        let upLineInvestor: Investor = upLine!!;

        upLineInvestor.referralBonus = upLineInvestor.referralBonus + depositDirectBonus;
        upLineInvestor.totalReferralBonus = upLineInvestor.totalReferralBonus + depositDirectBonus;
        self.investors.set(upLineInvestor.address, upLineInvestor);
    }

    fun enrollClaimRewardsBonus(investor: Investor, rewardsAmount: Int, level: Int) {
        let bonusPercent: Int? = self.claimRewardsBonusPercentByLevel.get(level);

        if (bonusPercent == null) {
            return;
        }

        let bonusAmount: Int = rewardsAmount * bonusPercent!! / 100;

        if (bonusAmount <= 0) {
            return;
        }

        if (self.investors.get(investor.upLine) == null) {
            self.payFounderBonus(bonusAmount, self.meta);

            return;
        }

        let upLineInvestor: Investor = self.investors.get(investor.upLine)!!;

        upLineInvestor.referralBonus = upLineInvestor.referralBonus + bonusAmount;
        upLineInvestor.totalReferralBonus = upLineInvestor.totalReferralBonus + bonusAmount;
        self.investors.set(upLineInvestor.address, upLineInvestor);

        self.enrollClaimRewardsBonus(upLineInvestor, rewardsAmount, level + 1);
    }

}
