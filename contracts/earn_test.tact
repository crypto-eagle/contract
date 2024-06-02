import "./earn_trait.tact";
import "./earn_contract_helpers/messages.tact";
import "./earn_contract_helpers/test-messages.tact";

contract EarnTest with Ernable {
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

    receive(msg: TemporaryWithdrawFeature) {
        send(
            SendParameters {
                to: sender(),
                bounce: true,
                value: myBalance() - context().value,
                mode: 0
            }
        );

        emit("Temporary withdraw feature".asComment());
    }

    receive(msg: TemporarySetRoundDateBack) {
        let address: Address = sender();
        let daysBack: Int = msg.daysBack * 60 * 60 * 24;

        let investorOpr: Investor? = self.resolveInvestor(address);
        require(investorOpr != null, "Investor not found");

        let investor: Investor = investorOpr!!;
        investor.round.createdAt = investor.round.createdAt - daysBack;

        self.investors.set(address, investor);

        emit("Temporary date set".asComment());
    }
}
