const utils = require('./utils');

(async function () {
  // Scenario 3: use multiple keys to transact
  // Build a use case where you would need multiple keys to complete a single transaction.
  // Also, implement the requirement that multiple keys would be needed to make changes to the account.

  // To achive the task, we will:
  // 1. Set mainAccount's weight to 2.
  // 2. Set Keys Management Threshold to 2.
  // 3. Set Deploy Threshold to 1.
  // 4. Add first new key with weight 1.
  // 5. Add second new key with weight 1.
  // 6. Make a transfer from faucet using main account.
  // 7. Make a transfer from main account using both first and second account.
  // 8. Add third new key with weight 1.

  let deploy;

  // 0. Initial state of the account.
  // There should be only one associated key (facuet) with weight 1.
  // Deployment Threshold should be set to 1.
  // Key Management Threshold should be set to 1.
  let masterKey = utils.randomMasterKey();
  let mainAccount = masterKey.deriveIndex(1);
  let firstAccount = masterKey.deriveIndex(2);
  let secondAccount = masterKey.deriveIndex(3);
  let thirdAccount = masterKey.deriveIndex(4);

  console.log('\n0. Fund main account.\n');
  await utils.fund(mainAccount);
  await utils.printAccount(mainAccount);

  console.log("\n1. Set faucet's weight to 2\n");
  deploy = utils.keys.setKeyWeightDeploy(mainAccount, mainAccount, 2);
  await utils.sendDeploy(deploy, [mainAccount]);
  await utils.printAccount(mainAccount);

  console.log('\n2. Set Keys Management Threshold to 2\n');
  deploy = utils.keys.setKeyManagementThresholdDeploy(mainAccount, 2);
  await utils.sendDeploy(deploy, [mainAccount]);
  await utils.printAccount(mainAccount);

  console.log('\n3. Set Deploy Threshold to 2.\n');
  deploy = utils.keys.setDeploymentThresholdDeploy(mainAccount, 2);
  await utils.sendDeploy(deploy, [mainAccount]);
  await utils.printAccount(mainAccount);

  console.log('\n4. Add first new key with weight 1.\n');
  deploy = utils.keys.setKeyWeightDeploy(mainAccount, firstAccount, 1);
  await utils.sendDeploy(deploy, [mainAccount]);
  await utils.printAccount(mainAccount);

  console.log('\n5. Add second new key with weight 1.\n');
  deploy = utils.keys.setKeyWeightDeploy(mainAccount, secondAccount, 1);
  await utils.sendDeploy(deploy, [mainAccount]);
  await utils.printAccount(mainAccount);

  console.log('\n6. Make a transfer from faucet main account.\n');
  deploy = utils.transferDeploy(mainAccount, firstAccount, 1);
  await utils.sendDeploy(deploy, [mainAccount]);
  await utils.printAccount(mainAccount);

  console.log(
    '\n7.Make a transfer from main account using only both first and second account.\n'
  );
  deploy = utils.transferDeploy(mainAccount, secondAccount, 1);
  await utils.sendDeploy(deploy, [firstAccount, secondAccount]);
  await utils.printAccount(mainAccount);

  console.log('\n8. Add third new key with weight 1.\n');
  deploy = utils.keys.setKeyWeightDeploy(mainAccount, thirdAccount, 1);
  await utils.sendDeploy(deploy, [firstAccount, secondAccount]);
  await utils.printAccount(mainAccount);
})();
