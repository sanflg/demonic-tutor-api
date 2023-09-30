const Card = require('../models/Card');

const { Op } = require("sequelize");

/**
 * Functional: Check if Card/s already exist in DDBB, if not, store it/them. 
 * @param {String} cardCollection
 * */
async function checkCardsForStorage(cardCollection) {
  const missingIds = await getCardsIdsNotInDDBB(cardCollection);
  const addCards = cardCollection.cards.filter(card => missingIds.includes(card.id));
  await Card.bulkCreate(addCards);
};

/**
 * Functional: Map cardId for sequelize search from card entity. 
 * @param {Card[]} cardArray
 * */
function mapCardsIdAndBuildSearchArray(cardArray) {
  let cardIdArray = cardArray.cards.map(card => card.id);
  return buildSearchArrayByCardId(cardIdArray);
};

/**
 * Functional: Build DDBB sequelize search by cardId array. 
 * @param {String[]} cardIdArray
 * */
function buildSearchArrayByCardId(cardIdArray) {
  let resultSearch = [];
  for (let cardId of cardIdArray) {
    resultSearch.push({ id: cardId });
  };
  return resultSearch;
};

/**
 * Functional: Check if Card ID exist in DDBB and return not present Ids in array. 
 * @param {Card[]} cardArray
 * @param {Callback} callback
 * */
async function getCardsIdsNotInDDBB(cardArray) {
  console.log(mapCardsIdAndBuildSearchArray(cardArray))
  const databaseCards = await Card.findAll({ where: { [Op.or]: mapCardsIdAndBuildSearchArray(cardArray) } });
  let cardIdsNotInBBDD = cardArray.cards
    //3- Get only the cards not stored in DDBB
    .filter(card => !
      //1- Do a list of cards found in DDBB
      databaseCards.map(card => card.id)
        //2 - Check if DDBB cards id list contain each requested card
        .includes(card.id))
    //4- Do a list of ids of cards not in DDBB
    .map(card => card.id);
  return cardIdsNotInBBDD;
};

module.exports = {
  mapCardsIdAndBuildSearchArray, buildSearchArrayByCardId, checkCardsForStorage, getCardsIdsNotInDDBB
}  