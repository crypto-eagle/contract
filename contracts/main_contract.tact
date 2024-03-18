import "@stdlib/deploy";
import "@stdlib/ownable";

struct Transfer {
    date: Int as uint32;
    amount: Int as coins;
    isDeposit: Bool;
}

struct Investor {
    upLine: Address;
    transfers: map<Int as uint32, Transfer>;
    transfersLength: Int as uint32;
}

message Deposit {
    upLine: Address?;
}

contract MainContract with Deployable, Ownable {
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

    receive(msg: Deposit) {
        let msgValue: Int = context().value;
        require(msgValue >= self.minDeposit, "Minimum deposit is not enough");

        let investorData: Investor = self.getInvestor(sender());
        if (msg.upLine != null && investorData.transfersLength == 0) {
            investorData.upLine = msg.upLine!!;
        }

        self.deposit(sender(), msgValue - self.gasConsumption);
    }

    fun deposit(investor: Address, amount: Int) {
        let investorData: Investor = self.investors.get(investor)!!;

        let transfer: Transfer = self.makeTransfer(amount, true);
        investorData.transfers.set(investorData.transfersLength, transfer);
        investorData.transfersLength = investorData.transfersLength + 1;

        self.investors.set(investor, investorData);

        emit("Deposited".asComment());
    }

    fun makeTransfer(amount: Int, isDeposit: Bool): Transfer {
        return Transfer {
           date: now(),
           isDeposit: isDeposit,
           amount: amount
       };
    }

    fun getInvestor(investor: Address): Investor {
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

    get fun investorInfo(address: Address): Investor? {
        return self.investors.get(address);
    }

    get fun totalBalance(): Int {
        return myBalance();
    }

}
