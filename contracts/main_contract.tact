import "@stdlib/deploy";
import "@stdlib/ownable";

struct InvestorBalanceInfo {
    total: Int;
}

contract MainContract with Deployable, Ownable {
    id: Int as uint32;
    owner: Address;

    minDeposit: Int as coins;

    investors: map<Address, InvestorBalanceInfo>;

    init(id: Int, minDeposit: Int) {
        self.id = id;
        self.owner = sender();
        self.minDeposit = minDeposit;
    }

    receive("Deposit") {
        let msgValue: Int = context().value;
        require(msgValue >= self.minDeposit, "Minimum deposit is not enough");

        self.deposit(msgValue, sender());
    }

    fun deposit(amount: Int, investor: Address) {
        self.investors.set(sender(), InvestorBalanceInfo{total: amount});
                // deployer: Address = sender();

        emit("Deposited".asComment());
    }

    get fun balanceInfo(address: Address): InvestorBalanceInfo? {
        //let investorData: InvestorBalanceInfo? = self.investors.get(sender());
        //if (investorData == null) {
          //  return null;
        //}

        return self.investors.get(address);
    }

    get fun allItem(): map<Address, InvestorBalanceInfo> {
        return self.investors;
    }

    get fun totalBalance(): Int {
        self.requireOwner();
        return myBalance();
    }

}
