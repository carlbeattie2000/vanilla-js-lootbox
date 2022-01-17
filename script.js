function LootTable () {
  this.lootTable = [
    {
      img: "./img/swordBasic.png",
      sellFor: 25,
      weight: 750
    },
    {
      img: "./img/swordGod.png",
      sellFor: 75,
      weight: 100
    },
    {
      img: "./img/goldenAxe.png",
      sellFor: 125,
      weight: 70
    },
    {
      img: "./img/axeMyth.png",
      sellFor: 150,
      weight: 50
    },
    {
      img: "./img/hammerFine.png",
      sellFor: 50,
      weight: 300
    },
    {
      img: "./img/hammerMyth.png",
      sellFor: 600,
      weight: 5
    },
    {
      img: "./img/axeFlawless.png",
      sellFor: 300,
      weight: 20
    }
  ];

  this.getTableTotalWeight = function () {
    let totalWeight = 0;

    for (let item of this.lootTable) {
      totalWeight += item.weight;
    }

    return totalWeight;
  }

  this.randomNumberWithinMaxRange = function(maxRange) {
    return Math.floor(Math.random() * maxRange);
  }

  this.getRandomLootFromTable = function() {
    const totalWeight = this.getTableTotalWeight();

    let randomNumber = this.randomNumberWithinMaxRange(totalWeight);

    for (let loot of this.lootTable) {
      if (randomNumber <= loot.weight)
        return loot;
      else
        randomNumber -= loot.weight
    }
  }
}

function Player() {
  this.coins = 500;
  this.openBoxCost = 50;
  this.inAnimation = false;
  this.inventory = [];

  this.updateCoinGUI = function (documentID) {
    return document.getElementById(documentID).textContent = this.coins;
  }

  this.hasEnoughCoins = () => {
    if (this.coins < this.openBoxCost) {
      document.getElementById("noCoinsLeftWindow").classList.toggle("hidden");
      return false
    }

    return true
  }

  this.addCoins = function(amount) {
    this.coins += amount;
    return this.updateCoinGUI("coins");
  }

  this.removeCoinsForSpin = function() {
    this.coins -= this.openBoxCost;
    return this.updateCoinGUI("coins");
  }

  this.toggleInAnimation = function() {
    return this.inAnimation = !this.inAnimation;
  }

  this.isInAnimation = function() {
    return this.inAnimation;
  }

  this.addLootToInventory = function(lootItem) {
    return this.inventory.push(lootItem);
  }

  this.removeLootFromInventory = function(lootItem) {
    return this.inventory.splice(this.inventory.indexOf(lootItem), 1);
  }

  this.displayInventoryItems = function(documentID, buttonsClass) {
    let inventoryContainers = "";

    this.inventory.forEach(lootItem => {
      const newDiv = `
        <div class="inventory-item">
          <div><img src="${lootItem.img}"></div>
          <div><button value="${lootItem.img}" class="btn">sell ${lootItem.sellFor} coins</button></div>
        </div>
      `

      inventoryContainers += newDiv;
    })

    document.getElementById(documentID).innerHTML = inventoryContainers;

    return this.inventorySellButtons(buttonsClass);
  }

  this.inventorySellButtons = function (classToQuery) {
    const buttons = document.querySelectorAll(classToQuery);

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        for (let lootItem of this.inventory) {
          if (lootItem.img == button.value) {
            this.addCoins(lootItem.sellFor);

            button.parentElement.parentElement.remove();

            return this.removeLootFromInventory(lootItem);
          }
        }
      })
    })
  }
}

function LootBoxContainerAnimations() {
  this.lootBoxLid = document.querySelector(".loot-box-lid");
  this.lootItem = document.getElementById("lootItem");

  this.openAnimation = function (lootImg) {
    this.lootItem.src = lootImg;
    this.lootItem.style.transform = "translateY(-90%)";
    this.lootItem.style.height = "25vh";
    this.lootItem.style.top = "-10%";

    this.lootBoxLid.style.transform = "translateY(-100%)";
    this.lootBoxLid.style.boxShadow = ".25em .2em 3em .5em #7743cc";
  }

  this.closeAnimation = function () {
    this.lootItem.style.transform = "translateY(0)";
    this.lootItem.style.height = "";
    this.lootItem.style.top = "50%";

    setTimeout(() => {
      this.lootBoxLid.style.transform = "translateY(0)";
      this.lootBoxLid.style.boxShadow = "";
    }, 750)
  }
}

const lootTable = new LootTable();
const player = new Player();
const lootBoxContainer = new LootBoxContainerAnimations();

const openLootContainer = () => {
  if (player.isInAnimation() || !player.hasEnoughCoins()) {
    return
  }

  player.removeCoinsForSpin()

  const lootOpened = lootTable.getRandomLootFromTable();

  player.addLootToInventory(lootOpened);

  lootBoxContainer.openAnimation(lootOpened.img);

  player.toggleInAnimation();

  setTimeout(() => {
    player.displayInventoryItems("inventory", ".btn");
    lootBoxContainer.closeAnimation();
    player.toggleInAnimation();
  }, 2500)

}

document.getElementById("open-box").addEventListener("click", () => {
  openLootContainer();
})