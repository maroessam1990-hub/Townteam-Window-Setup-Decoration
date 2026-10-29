/* Shared export model. Only uses records already authorized by the API. */
(function(root){
  function latestPhotos(data, store){
    const slots=new Map();
    for(const p of data.photos||[]){
      if(p.store!==store||p.status==='deleted'||!Number.isInteger(Number(p.slot))||Number(p.slot)<1||Number(p.slot)>5)continue;
      const previous=slots.get(Number(p.slot));
      if(!previous||new Date(p.uploaded)>new Date(previous.uploaded))slots.set(Number(p.slot),p);
    }
    return [...slots.values()].sort((a,b)=>Number(a.slot)-Number(b.slot));
  }
  function plan(data,selectedNames,cover){
    const names=new Set(selectedNames);
    const stores=(data.stores||[]).filter(s=>names.has(s.name)).sort((a,b)=>a.name.localeCompare(b.name,'ar',{numeric:true}));
    const pages=[],missing=[];
    for(const s of stores){const photos=latestPhotos(data,s.name);if(!photos.length){missing.push(s.name);continue;}for(const p of photos)pages.push({store:s.name,vm:s.vm,photo:p});}
    if(!pages.length)throw new Error('لا توجد صور في الفروع المختارة للتصدير.');
    return {cover,pages,missing,branchCount:stores.length-missing.length,slideCount:pages.length+2};
  }
  const api={latestPhotos,plan};root.WindowExportModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
