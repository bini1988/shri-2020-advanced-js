
/**
 * Возвращает все свойства и символы как в самом объекте, так и во всей его цепочке прототипов
 * @param {Object} object
 * @return {string[]}
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

/**
 * Возвращает прокси-объект, для которого оператор in вернет истину только в том случает, когда свойство находится в самом объекте, но не в его прототипе
 * @param {Object} object
 * @return {Object}
 */
function enhanceIn(object) {
  return new Proxy(object, {
    has (target, key) {
      const names = Object.getOwnPropertyNames(target);
      const symbols = Object.getOwnPropertySymbols(target);

      return names.includes(key) || symbols.includes(key);
    },
  });
}

module.exports = { allKeysAndSymbols, enhanceIn };
