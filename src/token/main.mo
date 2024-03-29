import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor Token{

    let owner : Principal = Principal.fromText("52bkn-eu2k7-mcvlf-jijhc-6uddu-2kjdu-oee3m-mjerh-pp7lf-42bab-nae");
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "DBEY";

    private stable var balanceEntries : [(Principal, Nat)] = [];

    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    if(balances.size() < 1){
    balances.put(owner, totalSupply);
    };


    public query func balanceOf(who: Principal): async Nat{
        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };

        return balance;
    };

    public query func getSymbol(): async Text{
        return symbol;
    };

    public shared(msg) func payOut(): async Text{
        if(balances.get(msg.caller) == null){
        let amount = 10000;
        let result = await transfer(msg.caller, amount);
        return result;
        } else {
            return "Already Claimed";
        }
    };

    public shared(msg) func transfer(to: Principal, amount: Nat) : async Text {
        let balanceFrom = await balanceOf(msg.caller);
        if(balanceFrom > amount){
            let newFromBalance : Nat = balanceFrom - amount;
            balances.put(msg.caller, newFromBalance);

            let recipientBalance = await balanceOf(to);
            let newToBalance: Nat = recipientBalance + amount;
            balances.put(to, newToBalance);
            return "Success";

        } else {
            return "Insufficient funds"
        }
    };

    system func preupgrade(){
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade(){
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
        if(balances.size() < 1){
            balances.put(owner, totalSupply);
        }
    };
}