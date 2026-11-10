const store={};global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]};
const app={innerHTML:'',focus(){}}; let QV={};
global.document={querySelector:q=>q in QV?QV[q]:app,addEventListener:()=>{},createElement:()=>({style:{},remove(){},setAttribute(){},appendChild(){},querySelector:()=>({})}),body:{appendChild(){}},getElementById:()=>null,querySelectorAll:q=>QV.__all&&q.includes('rv-i')?QV.__all:[],documentElement:{setAttribute(){},removeAttribute(){}}};
global.window={scrollY:0,scrollTo(){}};global.location={hash:'',pathname:'/',search:''};global.history={pushState(){},replaceState(){}};global.setTimeout=()=>{};global.addEventListener=()=>{};
// Синтетический прогон задач персон на логике прототипа.
// Запуск из папки research/tools:  node persona-tests.js
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const APP=scripts[scripts.length-1][1];
eval(APP+`
modal=o=>{o.onOk&&o.onOk()};
const results=[];
function task(id,persona,title,fn){
  S=seed(); ui.wiz=null; ui.session=null; QV={}; let n=0; const notes=[]; const step=(k=1)=>{n+=k};
  let res; try{ res=fn(step,notes) }catch(e){ res={ok:false}; notes.push('ошибка: '+e.message) }
  results.push({id,persona,title,result:res.ok===true?'успех':res.ok==='partial'?'частично':'провал',steps:n,notes:notes.concat(res.notes||[])});
}
const login=r=>A.login({dataset:{k:r}});
const html=()=>app.innerHTML;

task('T1','P2','Создать проект для банка и отправить на утверждение',(step,notes)=>{
  login('pm'); go('wizard'); step(1); const d=ui.wiz.d;
  d.name='Атриум — кабинет корпоративного клиента'; step(1); d.code='ATRIUM'; step(1); d.start='2026-12-01'; step(2); d.end='2027-06-30'; step(2); d.client='АО «Банк Восток»'; step(1);
  // модель «Банк» выбрана по умолчанию
  A.wnext(); step(1); if(ui.wiz.step!==1) return {ok:false,notes:['не прошёл шаг 1: '+wErr(0,d)]};
  d.clientReps.push('Иванов И., владелец продукта'); step(2); d.clientReps.push('Петрова А., аналитик'); step(2); A.wnext(); step(1);
  for(const [emp,role] of [['e40','be'],['e41','qa'],['e42','ba']]){ d.team.push({emp,role:S.emps.find(e=>e.id===emp).role,tools:[...R(S.emps.find(e=>e.id===emp).role).req]}); step(4) }
  d.team[0].tools.push('idea'); step(1); d.team[0].tools.push('aide'); step(1);
  A.wnext(); step(1); A.wnext(); step(1); A.wsubmit(); step(1);
  const p=S.projects.find(x=>x.code==='ATRIUM');
  notes.push('Мастер подставил строгую изоляцию и on-prem LLM для банка без участия ПМ');
  notes.push('Представители заказчика — свободный текст, контакт не запрашивается');
  notes.push('При выборе людей не видно их загрузки (справочник ПМ недоступен)');
  return {ok:p?.status==='pending'};
});
task('T2','P2','Понять, почему вернули «Квант», исправить и отправить снова',(step,notes)=>{
  login('pm'); go('dashboard'); const seen=attention().some(a=>a.t.includes('Квант')); step(1);
  A.open({dataset:{id:'p6'}}); step(1); go('project'); const sawComment=html().includes('вернул на доработку'); 
  A.edit({dataset:{id:'p6'}}); step(1); A.wnext(); step(1); A.wnext(); step(1);
  const m=ui.wiz.d.team.find(x=>x.emp==='e15'); A.wtool({dataset:{i:String(ui.wiz.d.team.indexOf(m)),t:'vpn'}}); step(1);
  A.wnext(); step(1); A.wnext(); step(1); A.wsubmit(); step(1);
  const p=P('p6');
  notes.push(seen?'Возврат виден в «Требует внимания»':'Возврат не виден на обзоре');
  notes.push(sawComment?'Комментарий ЦК виден в паспорте':'Комментария нет');
  return {ok:p.status==='pending'&&!p.team.find(x=>x.emp==='e15').tools.includes('vpn')};
});
task('T3','P1','Проверить отклонения и утвердить «Полярис»',(step,notes)=>{
  login('ck'); go('approvals'); step(1); const viol=html().includes('Отклонения от шаблонов'); 
  A.approve({dataset:{id:'p4'}}); step(2);
  notes.push(viol?'Есть отклонения':'Отклонений нет — плашка «Соответствует шаблонам»');
  notes.push('Сводка заявок видна до подтверждения: '+projTickets('p4').length+' заявок');
  return {ok:P('p4').status==='provisioning'};
});
task('T4','P1','Сделать «ИИ-ассистент в IDE» опциональным для тестировщика',(step,notes)=>{
  login('ck'); go('roles'); step(1); A.rtool({dataset:{r:'qa',t:'aide'}}); step(1);
  const after1=R('qa').req.includes('aide')?'обязательный':R('qa').opt.includes('aide')?'опциональный':'нет';
  A.rtool({dataset:{r:'qa',t:'aide'}}); step(1);
  notes.push('Первый клик сделал инструмент «'+after1+'», нужен второй клик — цикл переключения неочевиден без подсказки (её убрали вместе с описаниями)');
  notes.push('Не видно, каких проектов коснётся изменение');
  return {ok:R('qa').opt.includes('aide')?'partial':false};
});
task('T5','P3','Найти просроченные по SLA заявки «Веги» и закрыть их',(step,notes)=>{
  login('support'); go('desk'); step(1); const late=S.tickets.filter(t=>slaInfo(t)?.c==='late');
  notes.push('Плашка «Просрочено по SLA: '+late.length+'» есть, но фильтра «только просроченные» нет — нужно просматривать список глазами');
  late.forEach(t=>{ if(t.status==='new'){A.tk({dataset:{id:t.id,s:'wip'}}); step(1)} A.tk({dataset:{id:t.id,s:'done'}}); step(1); step(1) /* поиск строки */ });
  return {ok:S.tickets.filter(t=>slaInfo(t)?.c==='late').length===0?'partial':false};
});
task('T6','P3','Исправить ошибочно закрытую заявку',(step,notes)=>{
  login('support'); go('desk'); const t=S.tickets.find(x=>x.pid==='p2'&&x.status==='new'); const sn=snap(['p2']);
  A.tk({dataset:{id:t.id,s:'wip'}}); step(1); A.tk({dataset:{id:t.id,s:'done'}}); step(1); restore(sn); step(1);
  notes.push('Отмена доступна 7 секунд в уведомлении; после этого вернуть статус нельзя');
  return {ok:t.status==='new'};
});
task('T7','P4','Убедиться, что готова к работе на «Орионе», и отметить обязательное',(step,notes)=>{
  login('emp'); go('my'); step(0); const r0=readiness(P('p1'),'e3');
  r0.items.filter(i=>!i.ok&&!i.auto).forEach(i=>{A.ack({dataset:{id:'p1',k:i.k}}); step(1)});
  const r1=readiness(P('p1'),'e3');
  notes.push('Готовность была '+r0.done+' из '+r0.total+', стала '+r1.done+' из '+r1.total);
  notes.push('«Ознакомлен» не ведёт на документ методологии — отметка формальная');
  return {ok:r1.done===r1.total};
});
task('T8','P4','Запросить недостающий инструмент (DBeaver)',(step,notes)=>{
  login('emp'); go('my'); step(1); const has=/Запросить/.test(html());
  notes.push(has?'Кнопка есть':'Кнопки запроса нет; не указано, кто ПМ проекта — непонятно, к кому идти');
  return {ok:has};
});
task('T9','P2','Добавить тестировщику Postman в активном проекте «Гелиос»',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p7'}}); step(1); ui.tab='team'; go('project'); step(1);
  const canToggle=/data-act="wtool"/.test(html());
  notes.push(canToggle?'Можно':'Набор инструментов участника после старта не редактируется; обходной путь «убрать и добавить» выдаёт только обязательные инструменты');
  return {ok:canToggle};
});
task('T10','P2','Провести квартальный пересмотр доступов «Ориона»',(step,notes)=>{
  login('pm'); go('dashboard'); const due=attention().some(a=>a.t.includes('пересмотр')); step(1);
  QV.__all=[{dataset:{emp:'e7',tool:'vpn'}}]; A.review({dataset:{id:'p1'}}); step(3);
  notes.push(due?'Напоминание о пересмотре есть на обзоре':'Напоминания нет');
  notes.push('Отозван 1 лишний доступ, создана заявка на отзыв');
  return {ok:P('p1').lastReview===today()&&!P('p1').team.find(m=>m.emp==='e7').tools.includes('vpn')};
});
task('T11','P2','Продлить «Гелиос» на месяц',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p7'}}); step(1); go('project'); const canEdit=/data-act="edit"/.test(html());
  notes.push(canEdit?'Есть редактирование':'Для активного проекта нет ни «Редактировать», ни «Продлить»; срок доступов истечёт 30.11');
  return {ok:canEdit};
});
task('T12','P2','Завершить «Гелиос» и убедиться, что доступы отозваны',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p7'}}); step(1); A.close({dataset:{id:'p7'}}); step(2);
  const n=projTickets('p7').filter(t=>t.op==='revoke'&&t.status!=='done').length;
  A.logout(); login('support'); A.tkall({dataset:{id:'p7'}});
  notes.push('Создано '+n+' заявок на отзыв и архив; закрытие после их выполнения');
  return {ok:P('p7').status==='closed'};
});
task('T13','P1','Найти свободного backend-разработчика',(step,notes)=>{
  login('ck'); go('people'); step(1); ui.erole='be'; step(2); ui.eload='free'; step(2); go('people');
  const n=peopleData().length; notes.push('Найдено свободных: '+n);
  return {ok:n>0};
});
task('T14','P2','Подобрать в команду свободного backend-разработчика',(step,notes)=>{
  login('pm'); go('wizard'); step(1); const hasPeople=NAV.pm.some(([v])=>v==='people');
  notes.push('В списке сотрудников мастера только «Имя — Роль», без загрузки; справочник ПМ недоступен ('+(hasPeople?'есть':'нет')+')');
  return {ok:'partial'};
});
require('fs').writeFileSync(require('path').join(__dirname,'persona-results.json'),JSON.stringify(results,null,2));
results.forEach(r=>console.log(r.id,r.persona,r.result.padEnd(9),'шагов:',String(r.steps).padStart(2),'|',r.title));
`);
