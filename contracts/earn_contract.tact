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

        self.deposit(investor, depositAmount, self.meta, self.investors.get(investor.upLine));

        emit("Deposited".asComment());
    }

    receive(msg: ClaimRewards) {
        let investor: Investor = self.tryToResolveInvestorFromSender();

        let rewardsAmount: Int = self.claimRewards(investor, self.meta);

        self.enrollClaimRewardsBonus(investor, rewardsAmount, 1);

        emit("Claimed rewards".asComment());
    }

    // --- getters ---

    get fun minDepositAmount(): Int {
        return self.calcMinDepositAmount(self.resolveInvestorFromSender(), self.meta);
    }

    get fun maxDepositAmount(): Int {
        return self.calcMaxDepositAmount(self.resolveInvestorFromSender(), self.meta);
    }

    get fun investorProfile(): Profile {
        let investor: Investor = self.tryToResolveInvestorFromSender();

        return Profile {
            referralBonus: investor.referralBonus
        };
    }

    // --- functions ---

    fun tryToResolveInvestorFromSender(): Investor {
        let investor: Investor? = self.resolveInvestorFromSender();

        require((investor != null), "You are not registered");

        return investor!!;
    }

    fun resolveInvestorFromSender(): Investor? {
        return self.investors.get(sender());
    }

    fun getOrCreateInvestorFromSender(upLine: Address): Investor {
        let investor: Investor? = self.resolveInvestorFromSender();

        if (null != investor) {
            return investor!!;
        }

        let newInvestorAddress: Address = sender();
        let newInvestor: Investor = self.createInvestor(newInvestorAddress, upLine);

        self.investors.set(newInvestorAddress, newInvestor);

        return newInvestor;
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

        self.enrollClaimRewardsBonus(upLineInvestor, rewardsAmount, level + 1);
    }

}
