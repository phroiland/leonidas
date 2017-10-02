# Leonidas Dapp with truffle-init-webpack

Example webpack project with Truffle. Includes contracts, migrations, tests, user interface and webpack build pipeline.

This was built using the Pycharm IDE with a Solidity plugin on Ubuntu 16.04

## Dependencies

node, npm, truffle, web3, bower, angular, testrpc

node:

    $ sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

npm and packages:
    
    $ sudo npm install -g npm
    $ sudo npm install -g truffle
    $ sudo npm install -g web3
    $ sudo npm install -g bower
    
## Building and the frontend

    $ git clone ...
    $ cd leonidas
    $ sudo npm install -g nodejs
    $ sudo npm install -g ethereumjs-testrpc
    $ bower init --allow-root 
    ? (accept defaults)

Make a .bowerrc file and add the following:
    
    $ touch .bowerc
    
    {
        "directory": "app/bower_components"
    }
    
Then...
    
    $ bower install --save angular angular-route --allow-root
    $ truffle compile

In a separate terminal:
    
    $ testrpc
    
Continue in previous terminal:

    $ truffle migrate
    $ npm run dev

Open browser to:
    
    http://localhost:8080

## Usage

To initialize a project a project of your own...
    
    $ mkdir yourProject
    $ cd yourProject
    $ truffle unbox webpack
    $ bower init --allow-root

Make a .bowerrc file and add the following:
    
    {
        "directory": "app/bower_components"
    }
    
Then...
    
    $ cd app
    $ bower install --save angular angular-route --allow-root
    
Compile and Migrate...

## Possible upgrades

* Use the webpack hotloader to sense when contracts or javascript have been recompiled and rebuild the application.

* Contributions welcome!