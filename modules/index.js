import newFunction, {
    clientName,
    // Is possible add an alias to an import
    saving as clientSaving,
    showInfo,
    hasBalance,
    Client,
} from "./index2.js";
import { Company } from "./company.js";

// console.log(clientName);
// console.log(saving);

console.log(showInfo("santino", 300));

hasBalance(clientSaving - 1000);

const newClient = new Client("santino", 200);
newClient.showInfo();

const newCompany = new Company("electro tech", 10000, "information technology");
newCompany.showInfo();

newFunction();
