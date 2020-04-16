const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
const { allKeysAndSymbols } = require('./solution');

chai.use(deepEqualInAnyOrder);

describe('Функция принимает объект и возвращает все свойства и символы как в самом объекте, так и во всей его цепочке прототипов', function() {
  it('Возвращает свойства пустого объекта', function() {
    const obj = Object.create(null);
    const items = allKeysAndSymbols(obj);

    chai.expect(items).to.deep.equalInAnyOrder([]);
  });
  it('Возвращает все свойства объекта', function() {
    const obj = Object.create(null);
    const s1 = Symbol('A');
    obj.a = 'a';
    obj.b = null;
    obj.c = undefined;
    obj[s1] = 'symbol'
    obj.d = function() {};
    obj.e = [];
    const items = allKeysAndSymbols(obj);

    chai.expect(items).to.deep.equalInAnyOrder([
      'a', 'b', 'c', 'd', 'e', 'Symbol(A)',
    ]);
  });
  it('Возвращает все свойства в объекте и во всей его цепочке прототипов', function() {
    const obj1 = Object.create(null);
    obj1.a = 'a';
    obj1.b = null;

    const s1 = Symbol('A');
    const obj2 = Object.create(obj1);
    obj2.c = undefined;
    obj2[s1] = 'symbol';

    const s2 = Symbol('B');
    const obj3 = Object.create(obj2);
    obj3.d = [];
    obj3[s2] = 'symbol';

    const items = allKeysAndSymbols(obj3);

    chai.expect(items).to.deep.equalInAnyOrder([
      'a', 'b', 'c', 'Symbol(A)', 'd', 'Symbol(B)',
    ]);
  });
});
