trait Rounds {
    const dayTimeLength: Int = 24*60*60;
    const oneHourTimeLength: Int = 60*60;


    fun availableForWithdrawal(investor: Investor): Int {
        return investor.dailyIncome + investor.bonus;
    }

    fun closeRound(investor: Investor) {
        require(self.isRoundFinished(investor), "Current round is not finished");

        let currentRound: Round = investor.currentRound!!;
        let currentRoundDailyIncome: Int = self.getDailyIncome(currentRound);

        investor.dailyIncome = investor.dailyIncome + currentRoundDailyIncome;
        investor.dailyIncomeHistorical = investor.dailyIncomeHistorical + currentRoundDailyIncome;

        investor.currentRound = null;
    }

    fun isRoundFinished(investor: Investor): Bool {
        let currentRound: Round = investor.currentRound!!;

        let depositAmount: Int = currentRound.deposit;
        let reachedBalance: Int = investor.bonus + self.getDailyIncome(currentRound);

        return depositAmount * 310 >= reachedBalance;
    }

    fun getDailyIncome(currentRound: Round): Int {
        let openDate: Int = currentRound.openDate;
        let depositAmount: Int = currentRound.deposit;

        let diffSecs: Int = now() - openDate;
        let diffDays: Int = (diffSecs + self.oneHourTimeLength) / self.dayTimeLength;

        return depositAmount * diffDays / 100;
    }

    fun makeNewRound(investor: Investor) {
        require(investor.currentRound == null, "Current round is not finished");

        if (investor.round == null) {
            investor.round = 0;
        } else {
            investor.round = (investor.round!!) + 1;
        }

        investor.currentRound = Round {
            deposit: context().value,
            openDate: now()
        };
    }
}
