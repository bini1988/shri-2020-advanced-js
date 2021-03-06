const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
const { allKeysAndSymbols, enhanceIn, asyncExecutor } = require('./solution');

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

describe('Оператор in, который игнорирует свойства прототипа', function() {
  it('Свойство находится в самом объекте', function() {
    const object = { value: 1 };
    const symbol = Symbol('bazzinga');

    object[symbol] = 42;

    Object.defineProperty(object, 'year', {
      value: 2020,
      writable: true,
      configurable: true,
      enumerable: false,
    });

    const proxy = enhanceIn(object);

    chai.expect('value' in proxy).to.equal(true);
    chai.expect('year' in proxy).to.equal(true);
    chai.expect(symbol in proxy).to.equal(true);
  });
  it('Свойство находится в прототипе объекта', function() {
    const symbol = Symbol('bazzinga');
    const proto = { value: 1 };
    proto[symbol] = 42;

    const object = Object.create(proto);
    const proxy = enhanceIn(object);

    chai.expect('value' in proxy).to.equal(false);
    chai.expect(symbol in proxy).to.equal(false);
  });
  it('Свойство отсутствует в объекте', function() {
    const object = {};
    const proxy = enhanceIn(object);

    chai.expect('value' in proxy).to.equal(false);
  });
});

describe('Функция, которая позволит использовать внутри генератора асинхронные вызовы', function() {
  const ID = 42;
  const PASS = 'pass';
  const FAIL = 'fail';
  const getId = () => new Promise(res => setTimeout(() => res(ID), 200));
  const getDataById = id => new Promise((res, rej) =>
    setTimeout(() => id === ID ? res(PASS) : rej(FAIL), 200)
  );

  it('Последовательно выполняет ассинхронные вызовы', function(done) {
    asyncExecutor(function* () {
      const id = yield getId();
      chai.expect(id).to.equal(ID);

      const data = yield getDataById(id);
      chai.expect(data).to.equal(PASS);

      done();
    });
  });
  it('Завершит последовательное выполнение ассинхронных вызовов с ошибкой', function(done) {
    asyncExecutor(function* () {
      try {
        const id = yield getId();
        chai.expect(id).to.equal(ID);

        yield getDataById(`[${id}]`);
      } catch (error) {
        chai.expect(error).to.equal(FAIL);

        const id = yield 10;
        chai.expect(id).to.equal(10);
      } finally {
        done();
      }
    });
  });
});
