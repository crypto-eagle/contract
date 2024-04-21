import "@stdlib/ownable";
import "@stdlib/deploy";
import "./founder_contract_helpers/messages.tact";

contract FounderContract with Deployable, Ownable {
    // TODO: Change storage costs value after tests phase
    const MinBalanceForStorage: Int = ton("0.01");

    const StakePercentA: Int = 750;
    const StakePercentB: Int = 125;
    const StakePercentC: Int = 125;

    id: Int as uint32;
    owner: Address;

    stakeHolderA: Address;
    stakeHolderB: Address;
    stakeHolderC: Address;

    init(id: Int, stakeHolderA: Address, stakeHolderB: Address, stakeHolderC: Address) {
        self.id = id;
        self.owner = sender();

        self.stakeHolderA = stakeHolderA;
        self.stakeHolderB = stakeHolderB;
        self.stakeHolderC = stakeHolderC;
    }

    // --- methods ---

    receive() {
        emit("Thanks for supporting us".asComment());
    }

    receive(msg: ClaimStakeHoldersRewards) {
        nativeThrowUnless(132, sender() == self.owner);

        let availableRewardsAmount: Int = myBalance() - context().value - self.MinBalanceForStorage;

        // TODO: Should we compare with some minimal amount to avoid claiming low amounts by ourselves to not waste the gas?
        nativeThrowUnless(37, availableRewardsAmount > 0);

        self.claimStakeHolderRewards(
            self.stakeHolderA,
            availableRewardsAmount * self.StakePercentA / 1000
        );

        self.claimStakeHolderRewards(
            self.stakeHolderB,
            availableRewardsAmount * self.StakePercentB / 1000
        );

        self.claimStakeHolderRewards(
            self.stakeHolderC,
            availableRewardsAmount * self.StakePercentC / 1000
        );

        emit("Claimed stake holders rewards".asComment());
    }

    receive("withdraw all") {
        require(sender() == sender(), "Only deployer is allowed to withdraw");

        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    // --- functions ---

    fun claimStakeHolderRewards(stakeHolder: Address, rewardsAmount: Int) {
        send(
            SendParameters {
                to: stakeHolder,
                bounce: true,
                value: rewardsAmount,
                mode: SendPayGasSeparately
            }
        );
    }

    // --- getters ---

    get fun balance(): Int {
        return myBalance();
    }
}
