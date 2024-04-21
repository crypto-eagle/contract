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
            round: self.createRound(0, 0, now(), true),
            referralBonus: 0,
            totalDeposit: 0,
            totalClaimedRewards: 0,
            totalReferralBonus: 0
        };
    }

    fun createRound(serial: Int, amount: Int, createdAt: Int, isClaimed: Bool): Round {
        return Round {
            serial: serial,
            amount: amount,
            createdAt: createdAt,
            isClaimed: isClaimed,
            claimedDailyIncome: 0
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
            self.calcMaxRewards(investor.round.amount, contractMeta)
        );
    }

    fun calcRoundDurationInDays(investor: Investor): Int {
        let durationInSeconds: Int = now() - investor.round.createdAt;

        return durationInSeconds / (60 * 60 * 24);
    }

    fun calcMaxRewards(amount: Int, contractMeta: ContractMeta): Int {
        return amount * contractMeta.rewardsPercent / 100;
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
                mode: 0
            }
        );
    }

    fun isDepositAvailable(investor: Investor): Bool {
        return investor.round.isClaimed;
    }

    fun calcClaimableRewards(investor: Investor, contractMeta: ContractMeta, dailyIncomeAndBonus: Int): Int {
        return min(
            (self.calcMaxRewards(investor.totalDeposit, contractMeta) - investor.totalClaimedRewards),
            dailyIncomeAndBonus
        );
    }

}
