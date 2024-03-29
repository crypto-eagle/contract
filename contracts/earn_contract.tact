import "@stdlib/deploy";
import "@stdlib/ownable";

import "./helpers-v2/messages.tact";
import "./helpers-v2/structures.tact";
import "./helpers-v2/functions.tact";


contract EarnContract with Deployable, Ownable, Functions {
    owner: Address;
    meta: ContractMeta;

    init(id: Int, minDeposit: Int, founder: Address) {
        self.owner = sender();

        self.meta = ContractMeta {
            id: id,
            founder: founder,
            minDeposit: minDeposit,
            roundMultiplier: 3,
            maxDepositMultiplier: 100,
            investors: emptyMap(),
            bonusSystem: emptyMap()
        };

        self.initBonus(self.meta);
        self.makeInvestor(self.meta, self.owner, null);
    }

    // --- methods ---

    receive(msg: Deposit) {
        let msgDeposit: Int = context().value;

        require(msgDeposit >= self.minDeposit(), "Minimum deposit is not enough");
        require(msgDeposit <= self.maxDeposit(), "Maximum deposit exceeded");

        self.deposit(self.meta, sender(), msg.upLine);
    }


    // --- getters ---

    get fun meta(): ContractMeta {
        return self.meta;
    }

    get fun minDeposit(): Int {
        // todo: check last deposit more than
        // return max(investor.currentRound.deposit, self.meta.minDeposit);
        return self.getMinDeposit(self.meta, sender());
    }

    get fun maxDeposit(): Int {
        return self.getMinDeposit(self.meta, sender()) * self.meta.maxDepositMultiplier;
    }

}
