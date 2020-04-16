
/**
 * Возвращает все свойства и символы как в самом объекте, так и во всей его цепочке прототипов
 * @param {Object} object
 */
function allKeysAndSymbols(object) {
  let items = [], proto = object;

  while(proto) {
    items.push(...Object.getOwnPropertyNames(proto));
    items.push(...Object.getOwnPropertySymbols(proto).map(it => it.toString()));

    proto = Object.getPrototypeOf(proto);
  }
  return items;
}

module.exports = { allKeysAndSymbols };
