// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";
// "use strict";
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
// Import our contract artifacts and turn them into usable abstractions.
import leonidas_artifacts from '../../build/contracts/Leonidas.json'

// Leonidas is our usable abstraction, which we'll use through the code below.
var Leonidas = contract(leonidas_artifacts);

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// Bootstrap the Leonidas abstraction for Use.
Leonidas.setProvider(web3.currentProvider);

var app = angular.module('LeonidasDapp', [ 'ngRoute' ]);

app.controller("MainController", function ($scope) {
    Leonidas.deployed().then(function(contract) {
        $scope.balanceInEther = web3.fromWei(web3.eth.getBalance(contract.address).toNumber(), "ether");

        $scope.contract_address = contract.address;
        $scope.contract_abi = JSON.stringify(contract.abi);

        $scope.accounts = [];
        angular.forEach(web3.eth.accounts, function(obj) {
            contract.isAllowedToSend.call(obj).then(function(isAllowed) {
                $scope.accounts.push({address: obj, isAllowed:isAllowed});
                $scope.$apply();
            })
        });
    });
});

app.controller("ShowEventsController", function($scope) {

    $scope.ourEvents = [];
    $scope.ourDepositEvents = [];
    $scope.withdrawals = [];

    Leonidas.deployed().then(function(myContract) {

        var events = myContract.allEvents({fromBlock: 0, toBlock: 'latest'});

        events.watch(function(error, result) {

            $scope.ourEvents.push(result);
            $scope.$apply();
        });

        var depositEvents = myContract.Deposit(null, {fromBlock: 0, toBlock: 'latest'}, function(error, result) {
            $scope.ourDepositEvents.push(result);
            $scope.$apply();
        });

        $scope.$on('$destroy', function() {
            events.stopWatching();
            depositEvents.stopWatching();
        });

        myContract.getAmountOfWithdrawals.call(web3.eth.accounts[0]).then(function(result) {
            var numberOfWithdrawals = result.toNumber();
            for(var i = 1; i <= numberOfWithdrawals; i++) {
                myContract.getWithdrawalForAddress.call(web3.eth.accounts[0], i).then(function(result_withdrawal) {
                    result_withdrawal[1] = web3.fromWei(result_withdrawal[1], "ether").toNumber();
                    $scope.withdrawals.push(result_withdrawal);
                    $scope.$apply();
                });
            }
            return this;
        });
    });
});

app.controller('SendFundsController', function($scope) {

    $scope.accounts = web3.eth.accounts;

    $scope.depositFunds = function(address, amount) {
        Leonidas.deployed().then(function(contract) {
            web3.eth.sendTransaction({from: address, to: contract.address, value: web3.toWei(amount, "ether")}, function(error, result) {
                if(error) {
                    $scope.has_errors = "I did not work";
                } else {
                    $scope.transfer_success = true;
                }
                $scope.$apply();
            });
        });
    }

    $scope.withdrawFunds = function(address, amount) {
        Leonidas.deployed().then(function(contract) {
            contract.sendFunds(web3.toWei(amount, "ether"), address, {from: web3.eth.accounts[0], gas: 200000}).then(function () {
                $scope.transfer_success = true;
                $scope.$apply();
            }).catch(function (error) {
                console.error(error);
                $scope.has_errors = error;
                $scope.$apply();
            });
        });

    }
});

app.controller("PermissionsController", function ($scope) {
    Leonidas.deployed().then(function(contract) {
        $scope.loading = false;
        $scope.success = false;
        $scope.error = false;

        $scope.changePermission = function(address, allowDisallow) {
            console.log(address);
            $scope.loading = true;
            $scope.success = false;
            $scope.error = false;
            if(allowDisallow == 'allow') {
                contract.allowAddressToSendMoney(address, {from: web3.eth.accounts[0]}).then(function() {
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.$apply();
                }).catch(function(error) {
                    console.error(error);
                    $scope.loading = false;
                    $scope.error = error.message;
                    $scope.$apply();
                });
            } else {
                contract.disallowAddressToSendMoney(address, {from: web3.eth.accounts[0]}).then(function() {
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.$apply();
                }).catch(function(error) {
                    console.error(error);
                    $scope.loading = false;
                    $scope.error = error.message;
                    $scope.$apply();
                });
            }
        }
    });


});

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/views/main.html',
        controller: 'MainController'
    }).when('/events', {
        templateUrl: 'app/views/events.html',
        controller: 'ShowEventsController'
    }).when('/sendfunds', {
        templateUrl: 'app/views/sendfunds.html',
        controller: 'SendFundsController'
    }).when('/permissions', {
        templateUrl: 'app/views/permissions.html',
        controller: 'PermissionsController'
    }).otherwise({redirectTo: '/'});

});

