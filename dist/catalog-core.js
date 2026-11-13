/* Local-only catalogue comparison. No network requests. */
(function(root){
const aliases={name:['name','product','product name','title','название','товар','наименование'],price:['price','cost','цена','стоимость'],sku:['sku','mpn','model code','part number','артикул производителя','код производителя'],brand:['brand','vendor','бренд','производитель'],url:['url','link','ссылка'],stock:['stock','count','quantity','остаток','количество','наличие']};
const clean=s=>String(s??'').trim();
const norm=s=>clean(s).toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,' ').trim().replace(/\s+/g,' ');
function mapping(headers){const out={};for(const [k,terms] of Object.entries(aliases)){out[k]=headers.find(h=>terms.includes(norm(h)))||'';}return out;}
function amount(s){const v=clean(s).replace(/[₽р$€£]/gi,'').replace(/руб(?:лей|ля|\.)?/gi,'').replace(/\s/g,'').replace(',','.');return /^\d+(?:\.\d{1,2})?$/.test(v)?Number(v):null;}
function items(parsed,map,shop){if(!map.name||!map.price)throw Error('Map name and price columns for '+shop+'.');return parsed.rows.map((row,i)=>{const val=k=>map[k]?clean(row[parsed.headers.indexOf(map[k])]):'';return {shop,name:val('name'),price:amount(val('price')),rawPrice:val('price'),sku:val('sku'),brand:val('brand'),url:val('url'),stock:val('stock'),row:i+2};}).filter(x=>x.name);}
function identity(x){if(x.sku)return 'sku:'+norm(x.brand)+'|'+norm(x.sku);return 'name:'+norm(x.name);}
function compare(a,b){const groups=arr=>{const m=new Map();for(const x of arr){const k=identity(x);if(!m.has(k))m.set(k,[]);m.get(k).push(x);}return m;};const left=groups(a),right=groups(b),out=[];for(const [key,aa] of left){const bb=right.get(key)||[];if(aa.length!==1||bb.length>1){out.push({status:'review',a:aa[0],b:bb[0]||null,reason:'Duplicate/ambiguous identity'});continue;}const x=aa[0],y=bb[0];if(!y){out.push({status:'only-a',a:x,b:null});continue;}if(x.price===null||y.price===null){out.push({status:'review',a:x,b:y,reason:'Missing or invalid price'});continue;}out.push({status:'matched',a:x,b:y,difference:y.price-x.price});}for(const [key,bb] of right){if(left.has(key))continue;for(const y of bb)out.push({status:'only-b',a:null,b:y});}return out;}
const api={mapping,amount,items,identity,compare};if(typeof module!=='undefined')module.exports=api;root.CatalogCore=api;
})(globalThis);
