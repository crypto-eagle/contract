import "@stdlib/deploy";
import "@stdlib/ownable";

import "./earn_contract_helpers/messages.tact";
import "./earn_contract_helpers/structures.tact";
import "./earn_contract_helpers/functions.tact";
import "./earn_contract_helpers/response-models.tact";

trait Ernable with Deployable, Ownable, Functions {
    id: Int;
    owner: Address;
    meta: ContractMeta;
    investors: map<Address, Investor>;
    claimRewardsBonusPercentByLevel: map<Int, Int>;

    // --- methods ---

    receive(msg: Deposit) {
        let depositAmount: Int = context().value;
        let investor: Investor = self.getOrCreateInvestorFromSender(self.resolveUpLine(msg, self.meta));

        require(self.isDepositAvailable(investor), "Claim rewards before deposit");
        require(
        depositAmount >= self.calcMinDepositAmount(investor, self.meta),
        "Deposit amount is not enough"
        );
        require(
        depositAmount <= self.calcMaxDepositAmount(investor, self.meta),
        "Maximum deposit limit exceeded"
        );

        investor.round = self.createRound(investor.round.serial + 1, depositAmount, now(), false);
        investor.totalDeposit = investor.totalDeposit + depositAmount;
        self.investors.set(investor.address, investor);

        self.enrollUpLineDepositBonus(investor, self.investors.get(investor.upLine));
        self.enrollFounderDepositBonus(investor, self.meta);

        emit("Deposited".asComment());
    }

    receive(msg: ClaimRewards) {
        let investor: Investor = self.tryToResolveInvestor(sender());

        require(!investor.round.isClaimed, "You already claimed rewards");

        let claimableDailyIncome: Int = self.calcDailyIncome(investor, self.meta) - investor.round.claimedDailyIncome;
        let referralBonus: Int = investor.referralBonus;
        let claimableRewards: Int = self.calcClaimableRewards(investor, self.meta, (claimableDailyIncome + referralBonus));

        require(claimableRewards > 0, "Your rewards amount is not enough to claim");

        self.payInvestorRewards(investor, claimableRewards);

        investor.round.claimedDailyIncome = investor.round.claimedDailyIncome + claimableDailyIncome;
        investor.referralBonus = referralBonus - (claimableRewards - claimableDailyIncome);
        investor.totalClaimedRewards = investor.totalClaimedRewards + claimableRewards;
        if (investor.totalClaimedRewards == self.calcMaxRewards(investor.totalDeposit, self.meta)) {
            investor.round.isClaimed = true;
        }

        self.investors.set(investor.address, investor);

        self.enrollClaimRewardsBonus(investor, claimableRewards, 1);

        emit("Claimed rewards".asComment());
    }

    // --- getters ---

    get fun depositConstraints(address: Address): DepositConstraintsResponse {
        return DepositConstraintsResponse {
        min: self.calcMinDepositAmount(self.resolveInvestor(address), self.meta),
        max: self.calcMaxDepositAmount(self.resolveInvestor(address), self.meta)
        };
    }

    get fun investorProfile(address: Address): ProfileDataResponse? {
        let resolvedInvestor: Investor? = self.resolveInvestor(address);
        if (resolvedInvestor == null) {
            return null;
        }

        let investor: Investor = resolvedInvestor!!;
        let claimableDailyIncome: Int = self.calcDailyIncome(investor, self.meta) - investor.round.claimedDailyIncome;
        let currentClaimableRewards: Int = self.calcClaimableRewards(investor, self.meta, (claimableDailyIncome + investor.referralBonus));
        let currentClaimedRewards: Int = investor.totalClaimedRewards - self.calcMaxRewards(investor.totalDeposit - investor.round.amount, self.meta);
        let currentMaxRewards: Int = self.calcMaxRewards(investor.round.amount, self.meta);

        let profile: ProfileDataResponse = ProfileDataResponse {
                canDeposit: self.isDepositAvailable(investor),
                refAddress: investor.address,
                upLine: investor.upLine,
                total: ProfileTotals {
                deposit: investor.totalDeposit,
                claimed: investor.totalClaimedRewards,
                referalBonus: investor.totalReferralBonus
            },
                current: ProfileCurrentRound {
                deposit: investor.round.amount,
                claimedAmount: currentClaimedRewards,
                secondsPast: now() - investor.round.createdAt,
                earnedAmount: currentClaimableRewards,
                earnedPercent: currentClaimableRewards * 100 / currentMaxRewards
            }
        };

        if (investor.round.isClaimed) {
            profile.current = null;
        }

        return profile;
    }

    get fun balance(): Int {
        return myBalance();
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

    fun enrollUpLineDepositBonus(investor: Investor, upLine: Investor?) {
        if (upLine == null) {
            return;
        }

        let depositDirectBonus: Int = investor.round.amount * self.meta.depositDirectUpLineBonusPercent / 100;
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
