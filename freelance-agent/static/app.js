const $=id=>document.getElementById(id);
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
const SOURCE_HOSTS=['freelancer.com','www.freelancer.com','upwork.com','www.upwork.com','fiverr.com','www.fiverr.com','peopleperhour.com','www.peopleperhour.com'];
function renderSources(sources){
  const list=$('sourceList');if(!list)return;list.replaceChildren();
  Object.entries(sources||{}).forEach(([name,source])=>{
    const row=el('div','source-row'),copy=el('div','source-copy');copy.append(el('strong','',name),el('span','source-status',source.status||'Status unavailable'));
    row.append(copy);
    try{const u=new URL(source.search_url);if(u.protocol==='https:'&&SOURCE_HOSTS.includes(u.hostname)){const a=el('a','source-link','Open marketplace search ↗');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';row.append(a)}}catch{}
    if(source.searched)row.classList.add(source.failed?'source-failed':'source-searched');list.append(row);
  });
}
function renderJob(job){
  const card=el('article','job-card'),top=el('div','job-top'),left=el('div');
  left.append(el('h3','',job.title||'Untitled project'));
  left.append(el('div','meta',`${job.source||'Unknown source'}${job.company_or_client?' · '+job.company_or_client:''}${job.posted_at?' · Posted '+job.posted_at:''}`));
  top.append(left,el('span','score',`${job.match_score}/100`));card.append(top);
  const chips=el('div','chips');chips.append(el('span','chip',job.budget_label||'Not specified'),el('span','chip',job.payment_type||'Payment type not specified'),el('span','chip',`Beginner fit: ${job.beginner_fit_score??0}/15`));
  (job.required_skills||[]).slice(0,8).forEach(s=>chips.append(el('span','chip',s)));
  (job.red_flags||[]).forEach(s=>chips.append(el('span','chip warn',s)));card.append(chips);
  if(job.description)card.append(el('p','description',job.description));
  const details=el('div','detail-grid');details.append(el('div','','Match analysis: '+((job.match_reasons||[]).join(' ')||'No match explanation available.')));
  details.append(el('div','','Beginner-fit analysis: '+(job.beginner_explanation||'Not stated by source.')));
  details.append(el('div','','Budget data: '+(job.budget_status||'Not specified')));
  details.append(el('div','','Client/payment verification: '+(job.payment_verification||'Not provided by source')));
  details.append(el('div','','Competition: '+(job.competition_count==null?'Not provided':`${job.competition_count} bids/proposals reported`)));
  details.append(el('div','','Posted: '+(job.posted_at||'Not provided')));
  details.append(el('div','','Deadline: '+(job.deadline||'Not provided')));card.append(details);
  const proposal=el('details','proposal'),summary=el('summary','', 'Proposal draft (review before sending)'),draftText=el('p','', 'Select “Draft Proposal” to create a local template for review.');proposal.append(summary,draftText);
  const draftButton=el('button','draft-button','Draft Proposal');draftButton.type='button';draftButton.addEventListener('click',async()=>{
    draftButton.disabled=true;draftButton.textContent='Creating draft…';
    try{const response=await fetch('/api/draft-proposal',{method:'POST',headers:{'Content-Type':'application/json','X-App-Secret':$('accessKey')?.value||''},body:JSON.stringify({title:job.title,required_skills:job.required_skills||[]})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Could not create proposal draft.');draftText.textContent=data.proposal;proposal.open=true;proposal.scrollIntoView({behavior:'smooth',block:'nearest'})}
    catch(error){draftText.textContent=error.message||'Could not create proposal draft.';proposal.open=true}
    finally{draftButton.disabled=false;draftButton.textContent='Draft Proposal'}
  });card.append(draftButton,proposal);
  try{const u=new URL(job.job_url);if(u.protocol==='https:'&&SOURCE_HOSTS.includes(u.hostname)){const a=el('a','open-link','Open original project ↗');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';card.append(a)}}catch{}
  return card;
}
async function search(){
  const button=$('find'),status=$('status'),section=$('resultsSection');
  button.disabled=true;button.querySelector('span').textContent='Searching…';status.hidden=false;status.className='status';status.textContent='Starting your search. Only configured authorized APIs are called; unconfigured marketplaces remain available through their search links.';section.hidden=true;
  try{
    const response=await fetch('/api/find-jobs',{method:'POST',headers:{'Content-Type':'application/json','X-App-Secret':$('accessKey')?.value||''},body:JSON.stringify({minimum_budget:Number($('budget').value),currency:$('currency').value,project_type:$('projectType').value,limit:Number($('limit').value),beginner_only:$('beginner').checked,recent_only:$('recent').checked,recent_days:Number($('recentDays').value),include_keywords:$('includeKeywords').value,exclude_keywords:$('excludeKeywords').value})});
    const data=await response.json();if(!response.ok)throw new Error(data.error||`Search failed (${response.status})`);
    renderSources(data.sources);
    $('results').replaceChildren();data.jobs.forEach(j=>$('results').append(renderJob(j)));$('resultCount').textContent=`${data.jobs.length} found`;
    $('resultsTitle').textContent=data.jobs.length?'Matching freelance tasks':'No matching tasks';section.hidden=false;
    const empty=$('emptyMessage');empty.hidden=Boolean(data.jobs.length);empty.textContent=data.jobs.length?'':(data.empty_message||'No matching projects were returned. Review source status or try changing the filters.');
    if(data.telegram?.sent){status.className='status success';status.textContent=`Search complete. ${data.telegram.message}`}
    else if(data.telegram?.status==='failed'){status.className='status error';status.textContent=`Search complete; results are shown below, but Telegram delivery failed. ${data.telegram.message}`}
    else if(data.telegram?.status==='not_configured'){status.className='status';status.textContent=`Search complete. Results are shown below. Telegram is not configured: ${data.telegram.message}`}
    else{status.className='status';status.textContent=`Search complete. Results are shown below. ${data.telegram?.message||''}`}
  }catch(error){status.className='status error';status.textContent=error.message||'Search failed. Please try again.'}
  finally{button.disabled=false;button.querySelector('span').textContent='Find Freelance Tasks'}
}
$('find').addEventListener('click',search);
fetch('/api/sources').then(r=>r.json()).then(data=>renderSources(data.sources)).catch(()=>renderSources({}));
