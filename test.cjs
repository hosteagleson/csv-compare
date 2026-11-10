const assert=require('node:assert/strict');const {parse,compare,csv}=require('./dist/core.js');
const a=parse('\uFEFFSKU;Name;Price\r\n01;"Lamp; big";10\r\n02;"two\nlines";20\r\n03;"Say ""hi""";30');
assert.equal(a.rows[0][1],'Lamp; big');assert.equal(a.rows[1][1],'two\nlines');assert.equal(a.rows[2][1],'Say "hi"');
const b=parse('SKU,Name,Price\n01,Lamp,11\n02,"two\nlines",20\n04,New,40');const out=compare(a,b,'SKU',['Price'],true);assert.deepEqual(out.map(x=>x.status),['changed','unchanged','removed','added']);
assert.throws(()=>parse('a,a\n1,2'));assert.throws(()=>parse('a,b\n1'));assert.throws(()=>parse('a,b\n"oops,2'));assert.throws(()=>compare(parse('id,x\n1,a\n1,b'),b,'id',['x'],true));
assert.equal(compare(parse('id,v\n1, x '),parse('id,v\n1,x'),'id',['v'],true)[0].status,'unchanged');assert.ok(csv([['=HYPERLINK("bad")']]).includes("'=HYPERLINK"));assert.ok(csv([['a"b']]).includes('a""b'));
console.log('PASS: quoted fields, escaped quotes, multiline, BOM, delimiters, comparison, duplicates, invalid input, whitespace and safe CSV export.');
