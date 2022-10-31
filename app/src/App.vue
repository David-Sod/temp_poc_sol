<template>
  <main>
    <section>
      <h1>Basic ERC721 Contract</h1>
      <div>
        <span>My account is </span> <span>{{ account }}</span>
      </div>
    </section>
    <section>
      <button v-if="!account" @click="connectWallet()">
        Connect my wallet
      </button>
      <button @click="handleMintToken()" :disabled="loading">Mint token</button>
      <button @click="getAllTokens()" :disabled="loading">Get tokens</button>
    </section>
    <section>
      <h2>All tokens</h2>
      <div :key="t" v-for="t in tokens">Token ID: {{ t }}</div>
    </section>
  </main>
</template>

<script>
const Web3 = require("web3");
import { onMounted, ref } from "vue";
import ABIZombies from "../../contract/build/contracts/Zombies.json";

export default {
  name: "App",
  setup() {
    const account = ref("");
    const web3 = new Web3(Web3.givenProvider || process.env.VUE_APP_NODE_URL);
    const tokens = ref([]);
    const loading = ref(false);

    const myContract = new web3.eth.Contract(
      ABIZombies.abi,
      process.env.VUE_APP_CONTRACT_ADDRESS
    );

    const handleMintToken = async () => {
      try {
        loading.value = true;
        const res = await myContract.methods
          .safeMint(account.value)
          .send({ from: account.value });

        if (!res.status) {
          throw Error("Error while minting a token");
        }

        await getAllTokens();
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    };

    const getAllTokens = async () => {
      try {
        console.log("Getting all tokens");

        loading.value = true;
        myContract
          .getPastEvents("Transfer", {
            filter: {
              _from: "0x0000000000000000000000000000000000000000",
            },
            fromBlock: 0,
          })
          .then((events) => {
            tokens.value = [];
            for (let event of events) {
              tokens.value.push(event.returnValues.tokenId);
            }
          });
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await getAllTokens();
      // eslint-disable-next-line
      account.value = ethereum.selectedAddress;
    });

    const connectWallet = async () => {
      // eslint-disable-next-line
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account.value = accounts[0];
    };

    return {
      account,
      loading,
      tokens,
      handleMintToken,
      connectWallet,
      getAllTokens,
    };
  },
};
</script>

<style>
section {
  padding: 1rem;
}
</style>
