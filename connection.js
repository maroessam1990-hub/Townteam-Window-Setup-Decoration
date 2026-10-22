(()=>{
const base='https://zgnooqosuekzlwjtplhw.supabase.co',apikey='sb_publishable_TVK_rIlyAHSTC6hjrOywvg_lCpQgkU7';
let session=null,refreshing=null;
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
async function token(){
 if(!session)return null;
 if(session.expires>Date.now()+60000)return session.access_token;
 if(!refreshing)refreshing=(async()=>{const r=await fetch(base+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});if(!r.ok){session=null;return null}const d=await r.json();session={...d,expires:Date.now()+d.expires_in*1000};return d.access_token})().finally(()=>refreshing=null);
 return refreshing;
}
window.wsFetch=async(path,options={})=>{
 if(path==='/api/auth/login'){
 const b=JSON.parse(options.body);const username=String(b.username||'').trim();if(!/^[a-z0-9.]{3,80}$/i.test(username))return json({error:'راجع اسم المستخدم'},400);
 const r=await fetch(base+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey,'Content-Type':'application/json'},body:JSON.stringify({email:username.toLowerCase()+'@window-setup.invalid',password:b.password})});
 const d=await r.json();if(!r.ok)return json({error:'اسم المستخدم أو كلمة المرور غير صحيحة'},r.status);session={...d,expires:Date.now()+d.expires_in*1000};return json({ok:true});
 }
 if(path==='/api/auth/logout'){const access=await token();session=null;if(access)await fetch(base+'/auth/v1/logout',{method:'POST',headers:{apikey,Authorization:'Bearer '+access}}).catch(()=>{});return json({ok:true});}
 const access=await token();if(!access)return json({error:'سجّل الدخول'},401);
 const headers=new Headers(options.headers);headers.set('apikey',apikey);headers.set('Authorization','Bearer '+access);
 return fetch(base+'/functions/v1/window-setup-independent'+(path.includes('?')?path.slice(path.indexOf('?')):''),{...options,headers});
};
})();
