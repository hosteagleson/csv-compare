/* CSV Compare: dependency-free, browser-local data processing. */
(function(root){
function parse(text, delimiter){
 text=text.replace(/^\uFEFF/,'');
 if(!delimiter){const first=text.split(/\r?\n/)[0];delimiter=[',',';','\t'].sort((a,b)=>first.split(b).length-first.split(a).length)[0];}
 const rows=[];let row=[],cell='',quoted=false,closed=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;}
 else if(c==='"'&&!cell&&!closed)quoted=true;
 else if(c===delimiter){row.push(cell);cell='';closed=false;}
 else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';closed=false;}
 else {if(closed||c==='"')throw Error('Invalid CSV quoting. Check the file format.');cell+=c;}}
 if(quoted)throw Error('A quoted field is not closed.');row.push(cell);if(row.some(v=>v!==''))rows.push(row);
 if(rows.length<1)throw Error('This file is empty.');const headers=rows.shift().map(s=>s.trim());
 if(headers.some(s=>!s)||new Set(headers).size!==headers.length)throw Error('Column headers must be nonempty and unique.');
 if(rows.some(r=>r.length!==headers.length))throw Error('Some rows have a different number of fields than the header. Check the delimiter.');
 if(rows.length>50000)throw Error('Please use files with 50,000 rows or fewer.');return {headers,rows,delimiter};
}
function compare(a,b,key,fields,trim){
 const norm=v=>trim?v.trim():v;
 function index(data){const map=new Map(),ki=data.headers.indexOf(key);for(const r of data.rows){const k=norm(r[ki]);if(!k)throw Error('Empty key found. Every row needs a unique key.');if(map.has(k))throw Error('Duplicate key found: '+k+'. Choose a unique column.');map.set(k,r);}return map;}
 const am=index(a),bm=index(b),out=[];
 for(const [k,r] of am){if(!bm.has(k)){out.push({status:'removed',key:k,field:'',before:'',after:''});continue;}const nr=bm.get(k);let changed=false;for(const f of fields){const x=r[a.headers.indexOf(f)],y=nr[b.headers.indexOf(f)];if(norm(x)!==norm(y)){changed=true;out.push({status:'changed',key:k,field:f,before:x,after:y});}}if(!changed)out.push({status:'unchanged',key:k,field:'',before:'',after:''});}
 for(const [k] of bm)if(!am.has(k))out.push({status:'added',key:k,field:'',before:'',after:''});return out;
}
function csv(rows){return '\uFEFF'+rows.map(r=>r.map(v=>{v=String(v??'');if(/^[\s]*[=+@-]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');}
 const api={parse,compare,csv};if(typeof module!=='undefined')module.exports=api;root.CSVCore=api;
})(globalThis);
