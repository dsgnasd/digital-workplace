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
  login('ck'); go('roles'); step(1); const legend=/Нажатие переключает/.test(html());
  A.rtool({dataset:{r:'qa',t:'aide'}}); step(1);
  notes.push(legend?'Порядок «не используется → опциональный → обязательный»: один клик делает инструмент опциональным, уведомление называет новый статус':'Подсказки нет');
  notes.push(/участник/.test(html())?'В карточке роли видно, на скольких проектах и у скольких участников она используется':'Использование роли не видно');
  return {ok:R('qa').opt.includes('aide')&&legend};
});
task('T7','P4','Убедиться, что готова к работе на «Орионе», и отметить обязательное',(step,notes)=>{
  login('emp'); go('my'); const r0=readiness(P('p1'),'e3'); QV['#mAck']={checked:true};
  r0.items.filter(i=>!i.ok&&!i.auto).forEach(i=>{A.learn({dataset:{id:'p1',k:i.k}}); step(3)});
  const r1=readiness(P('p1'),'e3');
  notes.push('Готовность была '+r0.done+' из '+r0.total+', стала '+r1.done+' из '+r1.total);
  notes.push('Отметка ставится только после открытия методологии или правил ИБ и подтверждения галочкой');
  return {ok:r1.done===r1.total};
});
task('T8','P4','Запросить недостающий инструмент (DBeaver)',(step,notes)=>{
  login('emp'); go('my'); step(1); const pm=/Руководитель проекта: <b>/.test(html());
  QV['#mTool']={value:'dbeaver'}; QV['#mWhy']={value:'Проверять данные в тестовой базе',focus(){}};
  A.rqnew({dataset:{id:'p1'}}); step(1+3+1+1);
  const q=(P('p1').requests||[]).find(x=>x.emp==='e3'&&x.tool==='dbeaver');
  notes.push(pm?'На карточке проекта видно руководителя проекта и канал команды':'Руководитель проекта не указан');
  notes.push(q?'Запрос ушёл руководителю проекта, у сотрудника статус «Ждёт решения руководителя»':'Запрос не создан');
  return {ok:!!q&&pm};
});
task('T9','P2','Добавить тестировщику Postman в активном проекте «Гелиос»',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p7'}}); step(1); ui.tab='team'; go('project'); step(1);
  const canEdit=/data-act="medit"/.test(html());
  QV.__all=[{checked:true,dataset:{tool:'postman'}},{checked:true,dataset:{tool:'dbeaver'}}];
  A.medit({dataset:{id:'p7',emp:'e3'}}); step(3);
  const m=P('p7').team.find(x=>x.emp==='e3'); const t=projTickets('p7').find(x=>x.tool==='postman'&&x.emp==='e3'&&x.status==='new');
  notes.push(canEdit?'У участника есть «Изменить инструменты»: модалка с обязательными (заблокированы) и опциональными':'Нет кнопки');
  notes.push(t?'Создана заявка на выдачу Postman, остальные доступы не тронуты':'Заявка не создана');
  return {ok:canEdit&&m.tools.includes('postman')&&!!t};
});
task('T10','P2','Провести квартальный пересмотр доступов «Ориона»',(step,notes)=>{
  login('pm'); go('dashboard'); const due=attention().some(a=>a.t.includes('пересмотр')); step(1);
  QV.__all=[{dataset:{emp:'e7',tool:'vpn'}}]; A.review({dataset:{id:'p1'}}); step(3);
  notes.push(due?'Напоминание о пересмотре есть на обзоре':'Напоминания нет');
  notes.push('Отозван 1 лишний доступ, создана заявка на отзыв');
  return {ok:P('p1').lastReview===today()&&!P('p1').team.find(m=>m.emp==='e7').tools.includes('vpn')};
});
task('T11','P2','Продлить «Гелиос» на месяц',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p7'}}); step(1); go('project'); const has=/data-act="extend"/.test(html());
  QV['#mEnd']={value:'2026-12-31'}; A.extend({dataset:{id:'p7'}}); step(1+2+1);
  notes.push(has?'Кнопка «Продлить» в паспорте, дата по умолчанию +30 дней':'Нет кнопки');
  notes.push('Доступы теперь до '+fmtD(P('p7').end)+', напоминание о скором окончании исчезло: '+!attention().some(a=>a.t.includes('Гелиос')&&a.t.includes('завершается')));
  return {ok:has&&P('p7').end==='2026-12-31'};
});
task('T12','P2','Завершить «Гелиос» и убедиться, что доступы отозваны',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p7'}}); step(1); A.close({dataset:{id:'p7'}}); step(2);
  const n=projTickets('p7').filter(t=>t.op==='revoke'&&t.status!=='done').length;
  A.tksync({dataset:{id:'p7'}}); step(1); // статусы отзыва пришли из сервис-деска
  notes.push('Создано '+n+' заявок на отзыв и архив; закрытие после их выполнения');
  return {ok:P('p7').status==='closed'};
});
task('T13','P1','Найти свободного backend-разработчика',(step,notes)=>{
  login('ck'); go('people'); step(1); ui.erole='be'; step(2); ui.eload='free'; step(2); go('people');
  const n=peopleData().length; notes.push('Найдено свободных: '+n);
  return {ok:n>0};
});
task('T14','P2','Подобрать в команду свободного backend-разработчика',(step,notes)=>{
  login('pm'); go('wizard'); step(1);
  const opts=empOptions(S.emps.filter(e=>e.role==='be')); const first=opts.match(/<option[^>]*>([^<]*)</)[1];
  step(3); // открыть список, ввести «backend», выбрать первого
  notes.push('Список отсортирован по загрузке, первым идёт: «'+first+'»');
  return {ok:/свободен/.test(first)};
});
task('T15','P2','Рассмотреть запрос доступа от сотрудника',(step,notes)=>{
  P('p1').requests=[{id:'RQ-1',emp:'e3',tool:'dbeaver',reason:'Проверять данные в тестовой базе',d:today(),status:'pending'}];
  login('pm'); go('dashboard'); const seen=attention().some(a=>a.t.includes('просит доступ')); step(1);
  A.open({dataset:{id:'p1'}}); step(1); ui.tab='team'; go('project'); step(1); const block=/Запросы доступа/.test(html());
  A.rqok({dataset:{id:'p1',rq:'RQ-1'}}); step(1);
  const t=projTickets('p1').find(x=>x.tool==='dbeaver'&&x.emp==='e3'&&x.status==='new');
  notes.push(seen?'Запрос виден в «Требует внимания»':'Не виден на обзоре');
  notes.push(block?'На вкладке «Команда и доступы» блок «Запросы доступа» с причиной':'Блока нет');
  return {ok:seen&&block&&!!t};
});
task('T16','P2','Ответить на вопрос сервис-деска по заявке',(step,notes)=>{
  login('pm'); const t=projTickets('p2').find(x=>x.status==='question'); const n=myNotifs().find(x=>x.text.includes(t.id)); step(1); // колокольчик
  A.nopen({dataset:{nid:n.id}}); step(1); QV['#mA']={value:'Выдать из резерва отдела дизайна',focus(){}}; A.ta({dataset:{id:t.id}}); step(3);
  notes.push('Вопрос пришёл из сервис-деска, ответ ушёл обратно, заявка вернулась в работу');
  return {ok:t.status!=='question'&&!!t.q.answer};
});
task('T17','P1','Добавить обязательный инструмент тестировщикам и применить к идущим проектам',(step,notes)=>{
  login('ck'); go('roles'); step(1); A.rtool({dataset:{r:'qa',t:'postman'}}); step(1);
  const u=roleUse('qa'); go('roles'); const hint=/Применить к текущим проектам/.test(html());
  const before=S.tickets.length; A.tplapply({dataset:{r:'qa'}}); step(2);
  notes.push('Роль используется: '+u.members+' участников на '+u.projects+' проектах; без нового инструмента: '+u.miss.length);
  notes.push(hint?'Появилась плашка с кнопкой «Применить к текущим проектам»':'Подсказки нет');
  notes.push('Создано заявок: '+(S.tickets.length-before));
  return {ok:hint&&roleUse('qa').miss.length===0};
});
task('T18','P2','Узнать, что проект утвердили, не заходя в него',(step,notes)=>{
  login('ck'); A.approve({dataset:{id:'p4'}}); A.logout();
  login('pm'); go('dashboard'); const unread=myNotifs().filter(n=>!n.read); step(1);
  const got=unread.some(n=>n.text.includes('утверждён')&&n.pid==='p4');
  notes.push('Непрочитанных в колокольчике: '+unread.length+(got?', среди них «Полярис утверждён»':''));
  return {ok:got};
});
task('T20','P1','Утвердить «Полярис», убрав лишний опциональный доступ',(step,notes)=>{
  login('ck'); go('approvals'); step(1); QV.__all=[{dataset:{emp:'e2',tool:'idea'}}];
  // в окне утверждения снята одна галочка
  const orig=document.querySelectorAll; document.querySelectorAll=q=>q.includes('rv-i input:not(:checked)')?QV.__all:orig(q);
  A.approve({dataset:{id:'p4'}}); step(3); document.querySelectorAll=orig;
  const p=P('p4'), m=p.team.find(x=>x.emp==='e2');
  notes.push('Проект утверждён без возврата, IntelliJ IDEA у Дмитрия Кравцова не выдаётся; руководитель проекта получил уведомление об изменениях');
  return {ok:p.status==='provisioning'&&!m.tools.includes('idea')&&!projTickets('p4').some(t=>t.tool==='idea')&&S.notifs.some(n=>n.pid==='p4'&&n.text.includes('с изменениями'))};
});
task('T21','P5','Выгрузить журнал выдачи и отзыва доступов по «Меридиану»',(step,notes)=>{
  login('ck'); go('audit'); step(1); ui.ap='p8'; step(2); go('audit'); const rows=auditRows();
  const rev=rows.filter(r=>r.type==='revoke').length, gr=rows.filter(r=>r.type==='grant').length;
  notes.push('Событий по проекту: '+rows.length+' (выдача '+gr+', отзыв '+rev+'), у каждого дата и исполнитель; кнопка «Выгрузить CSV»');
  notes.push('Отдельной роли ИБ нет — журнал смотрят руководитель ЦК и поддержка');
  return {ok:rows.length>0&&rev>0&&/Выгрузить CSV/.test(html())};
});
task('T23','P1','Добавить Grafana в каталог и сделать опциональной для DevOps',(step,notes)=>{
  login('ck'); go('catalog'); step(1); QV['#mTn']={value:'Grafana',focus(){}}; QV['#mTc']={value:'dev'}; QV['#mTg']={value:'devops'};
  A.tooledit({dataset:{}}); step(1+1+2+2+1); const t=S.tools.find(x=>x.name==='Grafana');
  const v0=R('ops').v; go('roles'); step(1); A.rtool({dataset:{r:'ops',t:t.id}}); step(1);
  notes.push('Инструмент добавлен с SLA группы DevOps ('+SLA_H.devops+' ч)');
  notes.push('Шаблон DevOps: v'+v0+' → v'+R('ops').v+', в истории: «'+R('ops').versions.slice(-1)[0].ch+'»');
  return {ok:!!t&&R('ops').opt.includes(t.id)&&R('ops').v===v0+1};
});
task('T24','P2','Понять, по какой версии шаблона собрана команда «Ориона»',(step,notes)=>{
  login('pm'); A.open({dataset:{id:'p1'}}); step(1); ui.tab='team'; go('project'); step(1);
  const h=html(); const old=h.split('есть v').length-1;
  notes.push('У участников подписано «шаблон vN»; у '+old+' из '+P('p1').team.length+' метка «есть vN» — шаблон обновлялся после сборки проекта');
  return {ok:h.includes('шаблон v')&&old>0};
});
task('T25','P1','Найти в отчёте по ИИ проект с наибольшим числом заблокированных запросов',(step,notes)=>{
  login('ck'); go('aiuse'); step(1);
  const rows=S.projects.map(p=>({p,u:aiUsage(p)})).map(x=>({c:x.p.code,b:x.u.blocked.pd+x.u.blocked.sec+x.u.blocked.db,r:x.u.weeks.slice(-4).reduce((a,b)=>a+b,0)})).sort((a,b)=>b.b-a.b);
  notes.push('Сводка: запросы за месяц, пользователи, заблокированные запросы, затраты; тепловая карта по дням и таблица по проектам');
  notes.push('Больше всего заблокировано на '+rows[0].c+': '+rows[0].b+' (из '+rows[0].r+' запросов)');
  return {ok:/Заблокированные запросы/.test(html())&&rows[0].b>0};
});
task('T26','P1','Создать модель «Ритейл» и проверить, что мастер проекта соблюдает её правила',(step,notes)=>{
  login('ck'); go('models'); step(1); const before=S.models.length;
  // форма конструктора: название, заказчик по выбору, два формата, GigaChat и on-prem, стандартная изоляция
  S.models.push(modelNorm({id:'mretail', name:'Ритейл', desc:'Розничные сети', comms:'allowed', formats:['channel','bot'], llms:['onprem','gigachat'], isolation:'standard', dlp:false, v:1, versions:[]})); save(); render(); step(4);
  const listed=html().includes('Ритейл');
  login('pm'); go('wizard'); step(1); const inWizard=html().includes('Ритейл');
  applyModel(ui.wiz.d,'mretail'); step(1);
  const s3=wStep3(ui.wiz.d), opts=LLM_PREF.filter(k=>s3.includes('option value="'+k+'"'));
  const viol=modelViolations({...ui.wiz.d, ai:{...ui.wiz.d.ai, llm:'yagpt'}});
  notes.push('Моделей стало '+(before+1)+'; в мастере LLM на выбор: '+opts.join(', ')+'; YandexGPT даёт нарушение: '+(viol[0]||'нет'));
  return {ok:listed&&inWizard&&ui.wiz.d.ai.llm==='gigachat'&&opts.join()==='gigachat,onprem'&&viol.length===1};
});
task('T27','P1','Запретить GigaChat в модели «Корпоративный заказчик» и найти проекты, которые перестали ей соответствовать',(step,notes)=>{
  login('ck'); go('models'); step(1);
  const m=S.models.find(x=>x.id==='corp'); m.llms=m.llms.filter(k=>k!=='gigachat'); m.v=(m.v||1)+1; modelNorm(m); save(); render(); step(4);
  const h=html(), off=S.projects.filter(p=>p.model==='corp'&&['provisioning','ready','active'].includes(p.status)&&modelViolations(p).length);
  const inCard=h.includes('Не соответствуют текущим правилам')&&off.every(p=>h.includes('>'+p.code+'<'));
  go('dashboard'); step(1); const inAttn=html().includes('расходится с правилами модели');
  A.open({dataset:{id:off[0]?.id}}); go('project'); step(1); const badge=html().includes('есть v'+m.v);
  notes.push('Затронуты: '+off.map(p=>p.code).join(', ')+'; в карточке модели: '+inCard+'; в «Требует внимания»: '+inAttn+'; в паспорте метка «есть v'+m.v+'»: '+badge);
  return {ok:off.length>0&&inCard&&inAttn&&badge};
});
task('T28','P1','Подготовить черновик модели, опубликовать с предпросмотром, привести проект в соответствие и найти запись в журнале',(step,notes)=>{
  login('ck'); go('models'); step(1);
  const m=S.models.find(x=>x.id==='corp');
  m.draft={name:m.name, desc:m.desc, comms:m.comms, formats:m.formats, llms:m.llms.filter(k=>k!=='gigachat'), defLlm:'yagpt', isolation:m.isolation, dlp:m.dlp, ch:'ИБ запретила GigaChat', d:today()}; save(); render(); step(5);
  const draftShown=html().includes('Черновик v2'), stillV1=m.v===1&&m.llms.includes('gigachat');
  A.mdlPub({dataset:{id:'corp'}}); step(2);
  const vg=S.projects.find(p=>p.code==='VEGA'); const before=modelViolations(vg).length;
  login('pm'); A.open({dataset:{id:vg.id}}); go('project'); step(2); const fixBtn=html().includes('Привести в соответствие');
  A.mdlFix({dataset:{id:vg.id}}); step(2);
  login('ck'); go('audit'); ui.ap='all'; ui.atype='model'; ui.aq=''; step(2); const inAudit=auditRows().some(r=>r.type==='model'&&r.text.includes('v2'));
  const used=S.projects.some(p=>p.model==='corp'&&p.status!=='closed');
  notes.push('Черновик виден: '+draftShown+', правила до публикации не менялись: '+stillV1+'; после публикации у VEGA нарушений: '+before+', после «Привести в соответствие»: '+modelViolations(vg).length+' (LLM → '+vg.ai.llm+'); в журнале: '+inAudit);
  return {ok:draftShown&&stillV1&&m.v===2&&before>0&&fixBtn&&modelViolations(vg).length===0&&vg.modelV===2&&inAudit&&used};
});
require('fs').writeFileSync(require('path').join(__dirname,'persona-results.json'),JSON.stringify(results,null,2));
results.forEach(r=>console.log(r.id,r.persona,r.result.padEnd(9),'шагов:',String(r.steps).padStart(2),'|',r.title));
`);
