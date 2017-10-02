var Leonidas = artifacts.require("./Leonidas.sol");

contract('Leonidas', function(accounts) {
    it("owner is allowed to send funds", function() {
        var myContract = Leonidas.deployed();
        return myContract.then(function(instance) {
            return instance.isAllowedToSend.call(accounts[0])
        }).then(function(isAllowed) {
            assert.equal(isAllowed, true, "owner should be allowed to send funds");
        });
    });

    it("other account can't send funds", function() {
        var myContract = Leonidas.deployed();
        return myContract.then(function(instance) {
            return instance.isAllowedToSend.call(accounts[2])
        }).then(function(isAllowed) {
            assert.equal(isAllowed, false, "other account can't send funds");
        });
    });

    it("adding accounts to the allowed list", function() {
        var myContract = Leonidas.deployed();
        return myContract.then(function(instance) {
            return instance.isAllowedToSend.call(accounts[1])
        }).then(function(isAllowed) {
            assert.equal(isAllowed, false, "the other account was allowed");
        });
        return myContract.then(function(instance) {
            return instance.allowAddressToSendMoney(accounts[1]);
            return instance.isAllowedToSend.call(accounts[1]);
        }).then(function(isAllowed) {
            assert.equal(true, isAllowed, "the other account was not allowed");
        });
        return myContract.then(function(instance) {
                return instance.disallowAddressToSendMoney(accounts[1]);
                return instance.isAllowedToSend.call(accounts[1]);
        }).then(function(isAllowed) {
            assert.equal(false, isAllowed, "the account was allowed");
        });
    });

    it("Check Deposit Events", function(done) {
        var meta;
        Leonidas.deployed().then(function(instance) {
            meta = instance;
            var event = meta.allEvents();
            event.watch(function (error, result) {
                if (error) {
                    console.err(error);
                } else {
                    // Check that the events are correct
                    assert.equal(result.event, "Deposit");
                    assert.equal(web3.fromWei(result.args.amount.valueOf(), "ether"), 1);
                    assert.equal(result.args._sender.valueOf(), web3.eth.accounts[0]);
                    event.stopWatching();
                    done();
                }
            });
            // Send ether
            web3.eth.sendTransaction({ from: web3.eth.accounts[0], to: meta.address, value: web3.toWei(1, "ether")});
        });
    });

    it("should check not allowed Deposit Events", function (done) {
        var meta;
        Leonidas.deployed().then(function(instance) {
            meta = instance;

            // we'll send ether
            web3.eth.sendTransaction({
                from: web3.eth.accounts[1],
                to: meta.address,
                value: web3.toWei(1, "ether")
            }, function (error, result) {
                if (error) {
                    done();
                } else {
                    done(result);
                }
            });
        });

    });
});