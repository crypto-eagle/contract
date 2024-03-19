import "@stdlib/deploy";
import "@stdlib/ownable";

import "./messages.tact";
import "./structures.tact";
import "./dummy-functions.tact";


contract MainContract with Deployable, Ownable, Functions {
    const gasConsumption: Int = ton("0.03");

    id: Int as uint32;
    owner: Address;

    minDeposit: Int as coins;
    investors: map<Address, Investor>;

    init(id: Int, minDeposit: Int) {
        self.id = id;
        self.owner = sender();
        self.minDeposit = minDeposit;
    }

    // --- methods ---

    receive(msg: Deposit) {
        let msgValue: Int = context().value;
        require(msgValue >= self.minDeposit, "Minimum deposit is not enough");

        let investorData: Investor = self.getOrMakeInvestor(sender());

        self.deposit(sender(), msg.upLine, msgValue - self.gasConsumption);
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

        let investor: Investor = investorInfoOpt!!;

        let totalDeposits: Int = 0;
        let totalWithdrawals: Int = 0;

        let i: Int = 0;
        repeat (investor.transfersLength) {
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
            availableEarn: 0
        };
    }

    // --- functions ---

    fun deposit(investor: Address, upLine: Address?, amount: Int) {
        let investorData: Investor = self.investors.get(investor)!!;
        if (upLine != null && investorData.transfersLength == 0) {
            investorData.upLine = upLine!!;
        }

        let transfer: Transfer = self.makeTransfer(amount, true);
        investorData.transfers.set(investorData.transfersLength, transfer);
        investorData.transfersLength = investorData.transfersLength + 1;

        self.investors.set(investor, investorData);

        emit("Deposited".asComment());
    }

    fun getOrMakeInvestor(investor: Address): Investor {
        if (self.investors.get(investor) == null) {
            let investorData: Investor = Investor {
                transfersLength: 0,
                transfers: null,
                upLine: self.owner
            };

            self.investors.set(sender(), investorData);
        }

        return self.investors.get(investor)!!;
    }

}
