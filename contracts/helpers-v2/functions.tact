import "./structures.tact";
import "./rounds.tact";


trait Functions with Rounds {

    get fun totalBalance(): Int {
        return myBalance();
    }

    fun initBonus(meta: ContractMeta) {
        let bonuses: map<Int, Int> = emptyMap();
        bonuses.set(1, 30);
        bonuses.set(2, 10);
        bonuses.set(3, 10);
        bonuses.set(4, 10);
        bonuses.set(5, 10);
        bonuses.set(6, 8);
        bonuses.set(7, 8);
        bonuses.set(8, 8);
        bonuses.set(9, 8);
        bonuses.set(10, 8);
        bonuses.set(11, 5);
        bonuses.set(12, 5);
        bonuses.set(13, 5);
        bonuses.set(14, 5);
        bonuses.set(15, 5);

        meta.bonusSystem = bonuses;
    }

    fun makeInvestor(meta: ContractMeta, investorAddress: Address, upLine: Address?): Investor {
        require(meta.investors.get(investorAddress) == null, "Investor already exists");

        if (upLine == null) {
            upLine = meta.rootUpLine;
        }

        // throw if upLine not found
        require(meta.investors.get(upLine!!) != null, "UpLine not exists");

        let investorData: Investor = Investor {
            upLine: upLine!!,
            address: investorAddress,
            dailyIncome: ton("0"),
            dailyIncomeHistorical: ton("0"),
            bonus: ton("0"),
            bonusHistorical: ton("0"),
            round: null,
            currentRound: null
        };

        self.updateInvestor(meta, investorData);
        return investorData;
    }

    fun updateInvestor(meta: ContractMeta, investor: Investor) {
        meta.investors.set(investor.address, investor);
    }

    fun addBonuses(meta: ContractMeta, investor: Investor, amount: Int, level: Int) {
        if (meta.investors.get(investor.upLine) == null) {
            return;
        }
        let upLineInvestor: Investor = meta.investors.get(investor.upLine)!!;

        let percent: Int? = meta.bonusSystem.get(level);
        if (percent == null) {
            return;
        }

        let bonusAmount: Int = amount / 100 * percent!!;

        upLineInvestor.bonus = upLineInvestor.bonus + bonusAmount;
        self.updateInvestor(meta, upLineInvestor);

        if (investor.upLine == meta.rootUpLine) {
            return;
        }

        self.addBonuses(meta, upLineInvestor, amount, level + 1);
    }

    fun getMinDeposit(meta: ContractMeta, investorAddress: Address): Int {
        let minDeposit: Int = meta.minDeposit;

        let investorData: Investor? = meta.investors.get(investorAddress);
        if (investorData != null) {
            let investor: Investor = investorData!!;
            require(self.isRoundFinished(investor), "Current round is not finished");

            minDeposit = minDeposit + (investor.round!!) * meta.roundMultiplier;
        }

        return minDeposit;
    }

    fun deposit(meta: ContractMeta, investorAddress: Address, upLineAddress: Address?) {
        let investorData: Investor? = meta.investors.get(investorAddress);
        if (investorData != null) {
            // закрываем круг
            let investor: Investor = investorData!!;

            self.closeRound(investor);
            self.updateInvestor(meta, investor);
        } else {
            investorData = self.makeInvestor(meta, sender(), upLineAddress);
        }

        let investor: Investor = meta.investors.get(sender())!!;

        self.makeNewRound(investor);
        // todo: move bonuses to withdraw
        // self.addBonuses(self.meta, investor, amount, 1);
        self.updateInvestor(meta, investor);

        emit("Deposited".asComment());
    }

}
