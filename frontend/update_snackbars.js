const fs=require('fs');
const path=require('path');
function walk(d,cb){
    fs.readdirSync(d).forEach(f=>{
        let p=path.join(d,f);
        fs.statSync(p).isDirectory()?walk(p,cb):cb(p);
    });
}
walk('./src',f=>{
    if(!f.endsWith('.ts'))return;
    let c=fs.readFileSync(f,'utf8');
    let o=c;
    c=c.replace(/this\.snackBar\.open\(([\s\S]*?),\s*'Cerrar'(?:,\s*\{\s*duration:\s*\d+\s*\})?\s*\)/g,(m,msg)=>{
        if(m.includes('panelClass')) return m;
        let text=msg.toLowerCase();
        if(text.includes('error')||text.includes('err.')){
            return `this.snackBar.open(${msg}, 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] })`;
        }
        return m;
    });
    if(c!==o){fs.writeFileSync(f,c);console.log('Updated '+f);}
});
