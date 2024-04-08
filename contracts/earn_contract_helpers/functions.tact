import "./structures.tact";

trait Functions {

    fun resolveUpLine(msg: Deposit, contractMeta: ContractMeta): Address {
        if (null == msg.upLine) {
            return contractMeta.founder;
        }

        return msg.upLine!!;
    }

    fun createInvestor(address: Address, upLine: Address): Investor {
        return Investor {
            address: address,
            upLine: upLine,
            round: self.createRound(0, 0, now(), now(), true),
            referralBonus: 0
        };
    }

    fun createRound(serial: Int, amount: Int, createdAt: Int, claimedAt: Int, isClaimed: Bool): Round {
        return Round {
            serial: serial,
            amount: amount,
            createdAt: createdAt,
            claimedAt: claimedAt,
            isClaimed: isClaimed
        };
    }

    fun calcMinDepositAmount(investor: Investor?, contractMeta: ContractMeta): Int {
        if (investor == null) {
            return contractMeta.minDeposit;
        }

        let investorInstance: Investor = investor!!;

        return max(contractMeta.minDeposit, investorInstance.round.amount);
    }

    fun calcMaxDepositAmount(investor: Investor?, contractMeta: ContractMeta): Int {
        let initialMaxDepositAmount: Int = contractMeta.minDeposit * contractMeta.maxDepositMultiplier;

        if (investor == null) {
            return initialMaxDepositAmount;
        }

        let investorInstance: Investor = investor!!;

        let multiplier: Int = 1;
        if (investorInstance.round.serial == 1) {
            multiplier = 3;
        }

        if (investorInstance.round.serial == 2) {
            multiplier = 9;
        }

        if (investorInstance.round.serial > 2) {
            multiplier = 20;
        }

        return multiplier * initialMaxDepositAmount;
    }

    fun deposit(investor: Investor, amount: Int, contractMeta: ContractMeta, upLine: Investor?) {
        require(investor.round.isClaimed, "Claim rewards before deposit");
        require(
            amount >= self.calcMinDepositAmount(investor, contractMeta),
            "Deposit amount is not enough"
        );
        require(
            amount <= self.calcMaxDepositAmount(investor, contractMeta),
            "Maximum deposit limit exceeded"
        );

        investor.round = self.createRound(investor.round.serial + 1, amount, now(), 0, false);

        self.enrollUpLineDepositBonus(investor, contractMeta, upLine);
        self.enrollFounderDepositBonus(investor, contractMeta);
    }

    fun enrollUpLineDepositBonus(investor: Investor, contractMeta: ContractMeta, upLine: Investor?) {
        if (upLine == null) {
            return;
        }

        let depositDirectBonus: Int = investor.round.amount * contractMeta.depositDirectUpLineBonusPercent / 100;
        let upLineInvestor: Investor = upLine!!;

        upLineInvestor.referralBonus = upLineInvestor.referralBonus + depositDirectBonus;
    }

    fun enrollFounderDepositBonus(investor: Investor, contractMeta: ContractMeta) {
        let everyDepositBonus: Int = investor.round.amount * contractMeta.depositFounderBonusPercent / 100;
        let bonusAmount: Int = everyDepositBonus;

        if (investor.upLine == contractMeta.founder) {
            let depositDirectBonus: Int = investor.round.amount * contractMeta.depositDirectUpLineBonusPercent / 100;

            bonusAmount = bonusAmount + depositDirectBonus;
        }

        self.payFounderBonus(bonusAmount, contractMeta);
    }

    fun calcDailyIncome(investor: Investor, contractMeta: ContractMeta): Int {
        if (investor.round.isClaimed) {
            return 0;
        }

        return min(
            (investor.round.amount * self.calcRoundDurationInDays(investor) / 100),
            self.calcMaxRewards(investor, contractMeta)
        );
    }

    fun calcRoundDurationInDays(investor: Investor): Int {
        let durationInSeconds: Int = now() - investor.round.createdAt;
        if (investor.round.isClaimed) {
            durationInSeconds = investor.round.claimedAt - investor.round.createdAt;
        }

        return durationInSeconds / (60 * 60 * 24);
    }

    fun calcMaxRewards(investor: Investor, contractMeta: ContractMeta): Int {
        return investor.round.amount * contractMeta.rewardsPercent / 100;
    }

    fun claimRewards(investor: Investor, contractMeta: ContractMeta): Int {
        require(!investor.round.isClaimed, "You already claimed rewards");

        let maxRewards: Int = self.calcMaxRewards(investor, contractMeta);
        let dailyIncome: Int = self.calcDailyIncome(investor, contractMeta);
        let referralBonus: Int = investor.referralBonus;

        require((dailyIncome + referralBonus) >= maxRewards, "Your rewards amount is not enough to claim");

        investor.round.isClaimed = true;
        investor.round.claimedAt = now();
        investor.referralBonus = referralBonus - (maxRewards - dailyIncome);

        self.payInvestorRewards(investor, maxRewards);

        return maxRewards;
    }

    fun payInvestorRewards(investor: Investor, rewardsAmount: Int) {
        send(
            SendParameters {
                to: investor.address,
                bounce: true,
                value: rewardsAmount,
                mode: SendPayGasSeparately
            }
        );
    }

    fun payFounderBonus(bonusAmount: Int, contractMeta: ContractMeta) {
        send(
            SendParameters {
                to: contractMeta.founder,
                bounce: true,
                value: bonusAmount,
                mode: SendPayGasSeparately
            }
        );
    }

}
