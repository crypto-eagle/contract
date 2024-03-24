import "@stdlib/deploy";
import "@stdlib/ownable";

import "./helpers/messages.tact";
import "./helpers/structures.tact";
import "./helpers/dummy-functions.tact";


contract MainContract with Deployable, Ownable, Functions {
    id: Int as uint32;
    owner: Address;

    minDeposit: Int as coins;
    investors: map<Address, Investor>;
    bonuses: map<Int, Int>;

    const dayTimeLength: Int = 24*60*60;
    const hoursTimeLength: Int = 60*60;

    init(id: Int, minDeposit: Int) {
        self.id = id;
        self.owner = sender();
        self.minDeposit = minDeposit;
        self.getOrMakeInvestor(self.owner);

        self.bonuses.set(1, 30);
        self.bonuses.set(2, 10);
        self.bonuses.set(3, 10);
        self.bonuses.set(4, 10);
        self.bonuses.set(5, 10);
        self.bonuses.set(6, 8);
        self.bonuses.set(7, 8);
        self.bonuses.set(8, 8);
        self.bonuses.set(9, 8);
        self.bonuses.set(10, 8);
        self.bonuses.set(11, 5);
        self.bonuses.set(12, 5);
        self.bonuses.set(13, 5);
        self.bonuses.set(14, 5);
        self.bonuses.set(15, 5);
    }

    // --- methods ---

    receive(msg: Deposit) {
        let msgValue: Int = context().value;
        require(msgValue >= self.minDeposit, "Minimum deposit is not enough");

        let investorData: Investor = self.getOrMakeInvestor(sender());

        self.deposit(sender(), msg.upLine, msgValue);
    }

    // --- getters ---

    get fun investorInfo(address: Address): Investor? {
        return self.investors.get(address);
    }

    get fun balanceInfo(address: Address): BalanceInfo? {
        let investorInfoOpt: Investor? = self.investorInfo(address);
        if (investorInfoOpt == null) {
            return null;
        }

        return self.getBalanceInfo(investorInfoOpt!!);
    }

    get fun minDepositValue(): Int {
        return self.minDeposit;
    }

    // --- functions ---

    fun deposit(investor: Address, upLine: Address?, amount: Int) {
        let investorData: Investor = self.investors.get(investor)!!;
        if (upLine != null && investorData.transfersCount == 0) {
            investorData.upLine = upLine!!;

            // throw if upLine not found
            if (self.investors.get(investorData.upLine) == null) {
                throw(1000);
            }
        }

        let transfer: Transfer = self.makeTransfer(amount, true);
        investorData.transfers.set(investorData.transfersCount, transfer);
        investorData.transfersCount = investorData.transfersCount + 1;

        self.investors.set(investor, investorData);

        self.addBonuses(investorData, amount, 1);

        emit("Deposited".asComment());
    }

    fun addBonuses(investor: Investor, amount: Int, level: Int) {
        if (self.investors.get(investor.upLine) == null) {
            return;
        }
        let upLineInvestor: Investor = self.investors.get(investor.upLine)!!;

        let percent: Int? = self.bonuses.get(level);
        if (percent == null) {
            return;
        }

        let bonusAmount: Int = amount / 100 * percent!!;

        upLineInvestor.bonus = upLineInvestor.bonus + bonusAmount;
        self.investors.set(investor.upLine, upLineInvestor);

        if (investor.upLine == self.owner) {
            return;
        }

        self.addBonuses(upLineInvestor, amount, level + 1);
    }

    fun getOrMakeInvestor(investor: Address): Investor {
        if (self.investors.get(investor) == null) {
            let investorData: Investor = Investor {
                transfersCount: 0,
                transfers: null,
                bonus: ton("0"),
                upLine: self.owner
            };

            self.investors.set(sender(), investorData);
        }

        return self.investors.get(investor)!!;
    }

    fun getBalanceInfo(investor: Investor): BalanceInfo? {
        let totalDeposits: Int = 0;
        let totalWithdrawals: Int = 0;

        let i: Int = 0;
        repeat (investor.transfersCount) {
            let transfer: Transfer = investor.transfers.get(i)!!;
            if (transfer.isDeposit) {
                totalDeposits = totalDeposits + transfer.amount;
            } else {
                totalWithdrawals = totalWithdrawals + transfer.amount;
            }
            i = i + 1;
        }

        return BalanceInfo {
            totalDeposits: totalDeposits,
            totalWithdrawals: totalWithdrawals,
            totalEarns: 0,
            referralBonus: investor.bonus,
            dailyIncome: self.getDailyIncome(investor)
        };
    }

    fun getDailyIncome(investor: Investor): Int {
        let dailyIncome: Int = 0;

        let currentChangeBalanceDate: Int? = null;
        let currentBalance: Int = 0;

        let i: Int = 0;
        repeat (investor.transfersCount) {
            let transfer: Transfer = investor.transfers.get(i)!!;

            if (currentBalance >= self.minDeposit && currentChangeBalanceDate != null) {
                let diff: Int = transfer.date - currentChangeBalanceDate!!;
                let diffDays: Int = (diff + self.hoursTimeLength) / self.dayTimeLength;
                dailyIncome = dailyIncome + currentBalance * diffDays;
            }

            if (transfer.isDeposit) {
                currentBalance = currentBalance + transfer.amount;
            } else {
                currentBalance = currentBalance - transfer.amount;
            }

            if (currentBalance >= self.minDeposit) {
               currentChangeBalanceDate = transfer.date;
            }

            i = i + 1;
        }

        if (currentBalance >= self.minDeposit) {
            let diff: Int = now() - currentChangeBalanceDate!!;
            let diffDays: Int = (diff + self.hoursTimeLength) / self.dayTimeLength;

            dailyIncome = dailyIncome + currentBalance * diffDays;
        }

        return dailyIncome / 100;
    }

}
