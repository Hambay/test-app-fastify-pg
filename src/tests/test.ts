import { CategoryParser } from '../category/category.parser';
import { replaceESymbol } from '../utils/replacers';
import { isSlug, isUUID } from '../utils/validators';

console.log(true == isSlug('dfgdfg-fdg'));
console.log(false == isSlug('dfgdfg-fdg-'));
console.log(false == isSlug('dfgdfg-fdgпарапр'));
console.log(false == isSlug('-dfgdfg-fdg'));

console.log(true == isUUID('1284fd6d-7120-4044-b1cf-14cb8f4ea241'));
console.log(true == isUUID('3556d42b-0341-41cd-985a-3ab22d40366b'));
console.log(false == isUUID('1284fd6d-7120-4044-b1cf-14cb8f4ea24'));

console.log(replaceESymbol('Мёд'))
console.log(replaceESymbol('Мед'))

const parser = new CategoryParser()

parser.parseForCreate({
  slug: 'dfgdfg-dfgdfg',
  name: 'aaa',
  description: '',
  active: false
})

try {
  parser.parseForCreate({
    slug: 'dfgdfg-dfgdfg-',
    name: 'aaa',
    description: '',
    active: false
  })
} catch (error) {
  console.log('parseForCreate true')
}

console.log(
  parser.parseForUpdate({
    slug: 'dfgdfg-dfgdfg ',
    // name: '  aaa  ',
    description: '    ',
  })
);
