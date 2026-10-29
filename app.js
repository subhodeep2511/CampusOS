(() => {
  "use strict";

  const STORAGE_KEY = "campusos-demo-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
  const today = new Date();
  const isoDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const shiftDate = (date, days) => { const d = new Date(date); d.setDate(d.getDate()+days); return d; };
  const fmtDate = (date, opts = {day:"numeric",month:"short"}) => new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", opts);
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const currentDay = today.getDay();

  const defaultData = () => {
    const dateOffset = n => isoDate(shiftDate(today, n));
    return {
      profile: { name:"Subhodeep Sarkar", programme:"MCA · Cloud Computing & DevOps", session:"2026–27" },
      subjects: [
        {id:"web",name:"Web Programming",code:"MCA-104",faculty:"Dr. Neha Sharma",held:24,attended:22,color:"indigo"},
        {id:"python",name:"Python Programming",code:"MCA-102",faculty:"Prof. Arvind Kumar",held:26,attended:22,color:"green"},
        {id:"dbms",name:"Database Management",code:"MCA-103",faculty:"Dr. P. K. Mehta",held:25,attended:21,color:"blue"},
        {id:"ds",name:"Data Structures",code:"MCA-101",faculty:"Prof. Ritu Malhotra",held:28,attended:22,color:"amber"},
        {id:"math",name:"Discrete Mathematics",code:"MCA-105",faculty:"Dr. Karan Gill",held:27,attended:23,color:"green"}
      ],
      assignments: [
        {id:101,title:"DOM manipulation & event handling",subject:"Web Programming",due:dateOffset(2),status:"pending",description:"Build a small interactive page using DOM methods and keyboard or mouse events.",priority:"High"},
        {id:102,title:"Python collection operations",subject:"Python Programming",due:dateOffset(4),status:"pending",description:"Demonstrate list, tuple, set and dictionary operations with clear output.",priority:"Normal"},
        {id:103,title:"PL/SQL trigger implementation",subject:"Database Management",due:dateOffset(6),status:"pending",description:"Create an audit trigger and demonstrate its effect on account balance changes.",priority:"High"},
        {id:104,title:"Linked list operations",subject:"Data Structures",due:dateOffset(-2),status:"submitted",description:"Implement insertion, deletion, traversal and search operations.",priority:"Normal"},
        {id:105,title:"CSS layout and responsive design",subject:"Web Programming",due:dateOffset(-5),status:"submitted",description:"Create a responsive layout using CSS grid, flexbox and media queries.",priority:"Normal"},
        {id:106,title:"Set theory problem sheet",subject:"Discrete Mathematics",due:dateOffset(9),status:"pending",description:"Solve the assigned problems on sets, relations and functions.",priority:"Low"}
      ],
      marks: [
        {id:201,title:"MST 1",subject:"Web Programming",date:dateOffset(-12),score:92,max:100},
        {id:202,title:"Practical assessment",subject:"Python Programming",date:dateOffset(-10),score:84,max:100},
        {id:203,title:"SQL lab test",subject:"Database Management",date:dateOffset(-8),score:78,max:100},
        {id:204,title:"MST 1",subject:"Data Structures",date:dateOffset(-6),score:64,max:100},
        {id:205,title:"Quiz 2",subject:"Discrete Mathematics",date:dateOffset(-4),score:73,max:100},
        {id:206,title:"HTML & CSS practical",subject:"Web Programming",date:dateOffset(-3),score:88,max:100},
        {id:207,title:"Python collections quiz",subject:"Python Programming",date:dateOffset(-2),score:81,max:100},
        {id:208,title:"Database concepts quiz",subject:"Database Management",date:dateOffset(-1),score:73,max:100}
      ],
      classes: [
        {id:301,day:1,start:"09:30",end:"10:30",subject:"Database Management",room:"Block B · 204",color:"blue"},
        {id:302,day:1,start:"10:30",end:"11:30",subject:"Python Programming",room:"Lab 3",color:"green"},
        {id:303,day:1,start:"12:30",end:"13:30",subject:"Discrete Mathematics",room:"Block A · 112",color:"amber"},
        {id:304,day:2,start:"09:30",end:"10:30",subject:"Data Structures",room:"Block A · 108",color:"amber"},
        {id:305,day:2,start:"11:30",end:"12:30",subject:"Web Programming",room:"Lab 2",color:"indigo"},
        {id:306,day:3,start:"09:30",end:"10:30",subject:"Python Programming",room:"Lab 3",color:"green"},
        {id:307,day:3,start:"11:30",end:"12:30",subject:"Database Management",room:"Block B · 204",color:"blue"},
        {id:308,day:4,start:"10:30",end:"11:30",subject:"Web Programming",room:"Lab 2",color:"indigo"},
        {id:309,day:4,start:"12:30",end:"13:30",subject:"Data Structures",room:"Block A · 108",color:"amber"},
        {id:310,day:5,start:"09:30",end:"10:30",subject:"Discrete Mathematics",room:"Block A · 112",color:"amber"},
        {id:311,day:5,start:"11:30",end:"12:30",subject:"Python Programming",room:"Lab 3",color:"green"},
        {id:312,day:6,start:"10:30",end:"11:30",subject:"Web Programming",room:"Lab 2",color:"indigo"}
      ],
      attendanceLog: []
    };
  };

  let data = loadData();
  let activeView = "overview";
  let assignmentFilter = "all";
  let timetableOffset = 0;
  let modalMode = null;
  let editingId = null;
  let tourIndex = 0;

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.profile && Array.isArray(parsed.subjects)) return parsed;
      }
    } catch (error) { console.warn("Could not load saved CampusOS data.", error); }
    return defaultData();
  }
  function saveData() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (error) { toast("Browser storage is unavailable. Your latest changes may not persist.", "error"); }
  }
  function toast(message, type = "success") {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="toast-mark">${type === "error" ? "!" : "✓"}</span><span>${escapeHTML(message)}</span>`;
    $("#toastRegion").append(el);
    window.setTimeout(() => el.remove(), 3400);
  }
  function subjectByName(name) { return data.subjects.find(s => s.name === name); }
  function pct(subject) { return subject.held ? Math.round(subject.attended / subject.held * 1000) / 10 : 0; }
  function overallAttendance() {
    const held = data.subjects.reduce((sum,s)=>sum+s.held,0);
    const attended = data.subjects.reduce((sum,s)=>sum+s.attended,0);
    return held ? attended / held * 100 : 0;
  }
  function avgMarks() {
    return data.marks.length ? data.marks.reduce((sum,m)=>sum+(m.score / m.max * 100),0) / data.marks.length : 0;
  }
  function grade(score) {
    if (score >= 90) return ["A+", "good"];
    if (score >= 80) return ["A", "good"];
    if (score >= 70) return ["B", "good"];
    if (score >= 60) return ["C", "warning"];
    return ["Needs work", "danger"];
  }
  function subjectColor(subject) {
    const s = subject.toLowerCase();
    if (s.includes("python")) return "green";
    if (s.includes("database") || s.includes("sql")) return "blue";
    if (s.includes("mathematics")) return "amber";
    if (s.includes("structure")) return "amber";
    return "indigo";
  }
  function initials(text) { return text.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }
  function navTo(view) {
    if (!$("#view-"+view)) return;
    activeView = view;
    $$(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+view));
    $$(".nav-item[data-view]").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
    $("#pageCrumb").textContent = ({overview:"Overview",attendance:"Attendance",assignments:"Assignments",marks:"Marks & results",timetable:"Timetable",analytics:"Analytics",settings:"Settings"})[view] || "Overview";
    $("#sidebar").classList.remove("open");
    $(".sidebar-backdrop")?.remove();
    window.scrollTo({top:0,behavior:"smooth"});
    renderView(view);
  }
  function renderView(view) {
    if (view==="overview") renderOverview();
    if (view==="attendance") renderAttendance();
    if (view==="assignments") renderAssignments();
    if (view==="marks") renderMarks();
    if (view==="timetable") renderTimetable();
    if (view==="analytics") renderAnalytics();
    if (view==="settings") renderSettings();
  }
  function greeting() {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  }
  function renderOverview() {
    const att = overallAttendance();
    const pending = data.assignments.filter(a=>a.status==="pending");
    const firstName = (data.profile.name.trim() || "Student").split(/\s+/)[0];
    $("#view-overview .page-heading h1").innerHTML = `${greeting()}, ${escapeHTML(firstName)} <span class="wave">✳</span>`;
    $("#overviewAttendance").innerHTML = `${att.toFixed(1)}<span>%</span>`;
    $("#attendanceProgress").style.width = `${Math.min(100,att)}%`;
    $("#pendingAssignments").textContent = pending.length;
    $("#averageScore").innerHTML = `${avgMarks().toFixed(1)}<span>%</span>`;
    $("#classesThisWeek").textContent = data.classes.length;
    $(".next-class-time").textContent = nextClassLabel();
    $("#attendanceNavCount").textContent = data.subjects.filter(s=>pct(s)<75).length || "✓";
    const nextDue = pending.filter(a=>a.due>=isoDate(today)).sort((a,b)=>a.due.localeCompare(b.due))[0];
    $("#nextDueText").textContent = nextDue ? (daysFromToday(nextDue.due)===0?"Due today":`Due in ${daysFromToday(nextDue.due)} day${daysFromToday(nextDue.due)===1?"":"s"}`) : "No upcoming deadlines";
    $("#todayLabel").textContent = today.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();
    $("#scheduleDateLabel").textContent = today.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});
    $("#attendanceOverviewRows").innerHTML = data.subjects.map(s=>`
      <div class="attendance-row"><span class="subject-name">${escapeHTML(s.name)}</span><div class="subject-track"><span class="${pct(s)<75?"low":""}" style="width:${Math.min(100,pct(s))}%"></span></div><span class="subject-percent">${pct(s).toFixed(1)}%</span></div>`).join("");
    const deadlines = [...data.assignments].sort((a,b)=>a.due.localeCompare(b.due)).slice(0,4);
    $("#deadlineList").innerHTML = deadlines.length ? deadlines.map(a=>{
      const d = new Date(`${a.due}T12:00:00`);
      return `<div class="deadline-item"><div class="date-tile"><strong>${d.getDate()}</strong><small>${d.toLocaleDateString("en-IN",{month:"short"})}</small></div><div class="deadline-meta"><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.subject)}</small></div><span class="deadline-status ${a.status==="submitted"?"submitted":""}">${a.status==="submitted"?"Submitted":daysFromToday(a.due)<0?"Overdue":"Pending"}</span></div>`;
    }).join("") : `<div class="empty-state">No assignments yet.</div>`;
    const todayClasses = data.classes.filter(c=>c.day===currentDay).sort((a,b)=>a.start.localeCompare(b.start));
    $("#todaySchedule").innerHTML = todayClasses.length ? todayClasses.slice(0,4).map((c,i)=>`<div class="schedule-item"><span class="schedule-time">${timeLabel(c.start)}</span><span class="schedule-line ${c.color==="green"?"green":c.color==="amber"?"amber":""}"></span><div class="schedule-info"><strong>${escapeHTML(c.subject)}</strong><small>${escapeHTML(c.room)}</small></div><span class="schedule-room">${timeLabel(c.end)}</span></div>`).join("") : `<div class="empty-state">No classes scheduled for today. Enjoy the breathing room.</div>`;
    const recent = data.marks.slice(-4);
    $("#performanceChart").innerHTML = recent.length ? recent.map(m=>{
      const score = Math.round(m.score/m.max*100);
      const benchmark = Math.max(35,Math.min(88,score-5+((m.id%3)*4)));
      return `<div class="chart-group"><div class="chart-bar mine" style="height:${score}%;" title="Your score: ${score}%"></div><div class="chart-bar average" style="height:${benchmark}%;" title="Illustrative benchmark: ${benchmark}%"></div><span class="chart-label">${escapeHTML(m.subject.split(" ")[0])}</span></div>`;
    }).join("") : `<div class="empty-state">Add results to see your score trend.</div>`;
    renderSmartInsights();
  }
  function renderSmartInsights() {
    const cards = [];
    const lowAttendance = data.subjects.filter(s => pct(s) < 75).sort((a,b)=>pct(a)-pct(b));
    if (lowAttendance.length) {
      const s = lowAttendance[0];
      cards.push({tone:"risk",icon:"!",title:`Attendance needs attention: ${s.name}`,body:`Your recorded attendance is ${pct(s).toFixed(1)}%, below the 75% reference threshold. Attend upcoming classes and verify the official register.`,action:"Review attendance",view:"attendance",rule:"Rule: recorded attendance < 75%."});
    } else {
      const near = data.subjects.filter(s=>pct(s) >= 75 && pct(s) < 80).sort((a,b)=>pct(a)-pct(b));
      if (near.length) {
        const s=near[0];
        cards.push({tone:"watch",icon:"↗",title:`Keep a buffer in ${s.name}`,body:`Attendance is ${pct(s).toFixed(1)}%. A small buffer above the reference threshold can help absorb an unavoidable absence.`,action:"Open planner",view:"attendance",rule:"Rule: attendance is 75–79.9%."});
      } else {
        cards.push({tone:"good",icon:"✓",title:"Attendance is above the reference threshold",body:"All recorded subjects are at or above 80%. Keep checking the official register for discrepancies.",action:"View attendance",view:"attendance",rule:"Rule: all subject rates are at least 80%."});
      }
    }
    const pending = data.assignments.filter(a=>a.status==="pending");
    const overdue = pending.filter(a=>daysFromToday(a.due)<0);
    const dueSoon = pending.filter(a=>daysFromToday(a.due)>=0 && daysFromToday(a.due)<=3).sort((a,b)=>a.due.localeCompare(b.due));
    if (overdue.length) {
      cards.push({tone:"risk",icon:"⌛",title:`${overdue.length} assignment${overdue.length===1?" is":"s are"} overdue`,body:`Start with “${overdue[0].title}”. If a deadline has changed, update the record so the dashboard stays accurate.`,action:"Review assignments",view:"assignments",rule:"Rule: pending assignment due date is before today."});
    } else if (dueSoon.length) {
      cards.push({tone:"watch",icon:"◷",title:`${dueSoon.length} assignment${dueSoon.length===1?" is":"s are"} due soon`,body:`Next up: “${dueSoon[0].title}” ${daysFromToday(dueSoon[0].due)===0?"is due today":`is due in ${daysFromToday(dueSoon[0].due)} day${daysFromToday(dueSoon[0].due)===1?"":"s"}`}.`,action:"Plan coursework",view:"assignments",rule:"Rule: pending assignment due within 3 days."});
    } else {
      cards.push({tone:"good",icon:"✓",title:"No immediate assignment deadline flagged",body:"No pending assignment is due within the next three days. Review the full list so longer-term work does not get forgotten.",action:"View assignments",view:"assignments",rule:"Rule: no pending deadlines in the next 3 days."});
    }
    const subjectAverages = data.subjects.map(s=>{const ms=data.marks.filter(m=>m.subject===s.name);return {name:s.name,count:ms.length,avg:ms.length?ms.reduce((sum,m)=>sum+m.score/m.max*100,0)/ms.length:null};}).filter(s=>s.count).sort((a,b)=>a.avg-b.avg);
    const low = subjectAverages.find(s=>s.avg<60);
    if (low) cards.push({tone:"watch",icon:"↗",title:`Review recent results in ${low.name}`,body:`The recorded assessment average is ${low.avg.toFixed(1)}%. Review the specific questions missed before drawing conclusions from a small sample.`,action:"Review results",view:"marks",rule:"Rule: recorded subject average < 60%; sample size shown in results."});
    else cards.push({tone:"neutral",icon:"⌁",title:"Use assessment trends carefully",body:subjectAverages.length?`You have recorded results for ${subjectAverages.length} subject${subjectAverages.length===1?"":"s"}. Compare multiple assessments and focus on topics where errors repeat.`:"Add assessment results to make subject-level analysis available.",action:"View results",view:"marks",rule:"Guidance: a trend is more useful than a single score."});
    $("#smartInsights").innerHTML=cards.map(c=>`<article class="smart-insight ${c.tone}"><div class="smart-icon">${c.icon}</div><div class="smart-copy"><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.body)}</p><small>${escapeHTML(c.rule)}</small><button class="quiet-button" data-navigate="${c.view}">${escapeHTML(c.action)} <span>→</span></button></div></article>`).join("");
  }
  function daysFromToday(date) {
    const a = new Date(`${isoDate(today)}T12:00:00`);
    const b = new Date(`${date}T12:00:00`);
    return Math.round((b-a)/86400000);
  }
  function nextClassLabel() {
    if (!data.classes.length) return "No classes scheduled";
    const now = new Date();
    const candidates = data.classes.map(c => {
      const delta = (c.day - now.getDay() + 7) % 7;
      const date = shiftDate(now, delta);
      const [hour, minute] = c.start.split(":").map(Number);
      date.setHours(hour, minute, 0, 0);
      if (date <= now) date.setDate(date.getDate() + 7);
      return {date, start:c.start};
    }).sort((a,b)=>a.date-b.date);
    const next=candidates[0];
    const prefix=isoDate(next.date)===isoDate(now)?"Today":dayShort[next.date.getDay()];
    return `${prefix} · ${timeLabel(next.start)}`;
  }
  function renderAttendance() {
    const held=data.subjects.reduce((n,s)=>n+s.held,0), attended=data.subjects.reduce((n,s)=>n+s.attended,0);
    $("#attendanceOverallLarge").textContent=`${overallAttendance().toFixed(1)}%`;
    $("#classesAttended").textContent=attended;
    $("#classesMissed").textContent=held-attended;
    $("#belowTargetCount").textContent=data.subjects.filter(s=>pct(s)<75).length;
    const query=($("#attendanceSearch").value||"").toLowerCase();
    const filtered=data.subjects.filter(s=>(s.name+" "+s.faculty+" "+s.code).toLowerCase().includes(query));
    $("#attendanceTableBody").innerHTML=filtered.map(s=>{
      const p=pct(s), safeMiss=Math.max(0,Math.floor((s.attended/0.75)-s.held));
      const status=p>=85?["On track","good"]:p>=75?["At risk","warning"]:["Below target","danger"];
      return `<tr><td><div class="table-subject"><span class="subject-badge ${s.color}">${initials(s.name)}</span><span><strong class="table-main">${escapeHTML(s.name)}</strong><small class="table-secondary">${escapeHTML(s.code)}</small></span></div></td><td>${escapeHTML(s.faculty)}</td><td>${s.held}</td><td>${s.attended}</td><td><div class="progress-cell"><div class="subject-track"><span class="${p<75?"low":""}" style="width:${Math.min(100,p)}%"></span></div><strong>${p.toFixed(1)}%</strong></div></td><td><span class="status-pill ${status[1]}">${status[0]}</span></td><td><button class="row-action" data-action="attendance-record" data-id="${s.id}" aria-label="Record attendance for ${escapeHTML(s.name)}">＋</button></td></tr>`;
    }).join("") || `<tr><td colspan="7"><div class="empty-state">No subjects match your search.</div></td></tr>`;
    const low=data.subjects.filter(s=>pct(s)<75);
    $("#attendanceInsight").textContent=low.length ? `${low.map(s=>s.name).join(", ")} ${low.length===1?"is":"are"} currently below the 75% reference target. Prioritize attending upcoming classes and check your institution's official attendance policy.` : `All listed subjects are currently at or above 75%. ${data.subjects.filter(s=>pct(s)<85).length ? "Keep an eye on subjects with less buffer." : "Your attendance has a comfortable buffer above the reference threshold."}`;
    renderAttendancePlanner();
  }
  function renderAttendancePlanner() {
    const select=$("#plannerSubject");
    if(!select) return;
    const previous=select.value;
    select.innerHTML=data.subjects.map(s=>`<option value="${s.id}">${escapeHTML(s.name)}</option>`).join("");
    if(data.subjects.some(s=>s.id===previous)) select.value=previous;
    const subject=data.subjects.find(s=>s.id===select.value) || data.subjects[0];
    if(!subject) {$("#plannerResult").innerHTML="<p>Add a subject to calculate an attendance plan.</p>";return;}
    const target=Number($("#plannerTarget").value||75)/100;
    const current=pct(subject);
    let headline, detail, metric;
    if(current/100>=target) {
      const misses=Math.max(0,Math.floor(subject.attended/target-subject.held+1e-9));
      headline=`You're currently above the ${(target*100).toFixed(0)}% target`;
      detail=misses>0?`Mathematically, you could miss up to ${misses} additional class${misses===1?"":"es"} before dropping below this target, assuming totals are accurate. Avoid treating this as a recommendation to miss class.`:"You have no full-class absence buffer at this target. Attending upcoming classes increases your buffer.";
      metric=`${current.toFixed(1)}%`;
    } else {
      const needed=Math.max(0,Math.ceil((target*subject.held-subject.attended)/(1-target)-1e-9));
      headline=`Attend ${needed} consecutive class${needed===1?"":"es"} to reach ${(target*100).toFixed(0)}%`;
      detail=`If you attend each of the next ${needed} classes in this subject, your projected rate becomes ${((subject.attended+needed)/(subject.held+needed)*100).toFixed(1)}%. This assumes no further absences.`;
      metric=`${current.toFixed(1)}% now`;
    }
    $("#plannerResult").innerHTML=`<div class="planner-metric"><strong>${escapeHTML(metric)}</strong><span>Current rate</span></div><div class="planner-copy"><h3>${escapeHTML(headline)}</h3><p>${escapeHTML(detail)}</p></div>`;
  }
  function renderAssignments() {
    const query=($("#assignmentSearch").value||"").toLowerCase(), subj=$("#assignmentSubjectFilter").value||"all";
    const all=data.assignments;
    $("#countAll").textContent=all.length;
    $("#countPending").textContent=all.filter(a=>a.status==="pending").length;
    $("#countSubmitted").textContent=all.filter(a=>a.status==="submitted").length;
    const subjects=[...new Set(all.map(a=>a.subject))];
    const select=$("#assignmentSubjectFilter");
    const old=select.value;
    select.innerHTML='<option value="all">All subjects</option>'+subjects.map(s=>`<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`).join("");
    select.value=subjects.includes(old)?old:"all";
    const filtered=all.filter(a=>(assignmentFilter==="all"||a.status===assignmentFilter)&&(select.value==="all"||a.subject===select.value)&&(a.title+" "+a.subject+" "+a.description).toLowerCase().includes(query));
    $("#assignmentGrid").innerHTML=filtered.length?filtered.sort((a,b)=>a.due.localeCompare(b.due)).map(a=>{
      const overdue=a.status==="pending"&&daysFromToday(a.due)<0;
      const dueLabel=daysFromToday(a.due)===0?"Today":daysFromToday(a.due)<0?`${Math.abs(daysFromToday(a.due))} day${Math.abs(daysFromToday(a.due))===1?"":"s"} overdue`:fmtDate(a.due,{day:"numeric",month:"short",year:"numeric"});
      return `<article class="assignment-card"><div class="assignment-card-top"><span class="course-chip">${escapeHTML(a.subject)}</span><span class="status-pill ${a.status==="submitted"?"good":overdue?"danger":"warning"}">${a.status==="submitted"?"Submitted":overdue?"Overdue":a.priority==="High"?"High priority":"Pending"}</span></div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.description||"No description added.")}</p><div class="assignment-card-bottom"><span class="due-info">Due date<strong>${escapeHTML(dueLabel)}</strong></span><div class="card-actions"><button class="mini-action" data-action="edit-assignment" data-id="${a.id}">Edit</button><button class="mini-action ${a.status==="submitted"?"":"complete"}" data-action="toggle-assignment" data-id="${a.id}">${a.status==="submitted"?"Reopen":"Mark done"}</button></div></div></article>`;
    }).join(""):`<div class="empty-panel"><strong>No assignments found</strong>Try a different filter or add a new assignment.</div>`;
  }
  function renderMarks() {
    const scores=data.marks.map(m=>m.score/m.max*100), avg=avgMarks(), high=data.marks.reduce((a,b)=>!a||b.score/b.max>a.score/a.max?b:a,null);
    $("#marksAverage").textContent=`${avg.toFixed(1)}%`;
    $("#highestMark").textContent=high?`${Math.round(high.score/high.max*100)}%`:"—";
    $("#highestMarkSubject").textContent=high?high.subject:"No results yet";
    $("#assessmentCount").textContent=data.marks.length;
    $("#needsAttention").textContent=scores.filter(s=>s<60).length;
    const q=($("#marksSearch").value||"").toLowerCase();
    const rows=data.marks.filter(m=>(m.title+" "+m.subject).toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date));
    $("#marksTableBody").innerHTML=rows.length?rows.map(m=>{
      const p=m.score/m.max*100, g=grade(p);
      return `<tr><td><strong class="table-main">${escapeHTML(m.title)}</strong></td><td>${escapeHTML(m.subject)}</td><td>${fmtDate(m.date,{day:"numeric",month:"short",year:"numeric"})}</td><td><strong class="table-main">${m.score} / ${m.max}</strong><small class="table-secondary">${p.toFixed(1)}%</small></td><td><span class="status-pill ${g[1]}">${g[0]}</span></td><td><div class="progress-cell"><div class="subject-track"><span class="${p<60?"low":""}" style="width:${Math.min(100,p)}%"></span></div><strong>${p.toFixed(0)}%</strong></div></td><td><button class="row-action" data-action="delete-mark" data-id="${m.id}" aria-label="Delete ${escapeHTML(m.title)}">×</button></td></tr>`;
    }).join(""):`<tr><td colspan="7"><div class="empty-state">No assessment results found.</div></td></tr>`;
    const subjectAverages=data.subjects.map(s=>({name:s.name,score:data.marks.filter(m=>m.subject===s.name).reduce((n,m,_,arr)=>n+(m.score/m.max*100)/arr.length,0),count:data.marks.filter(m=>m.subject===s.name).length})).filter(s=>s.count).sort((a,b)=>a.score-b.score);
    const low=subjectAverages[0];
    const best=subjectAverages[subjectAverages.length-1];
    $("#focusAreas").innerHTML=`<div class="focus-card"><span class="focus-number">01</span><div><strong>${low?`Review ${escapeHTML(low.name)}`:"Add assessment data"}</strong><p>${low?`Current recorded average is ${low.score.toFixed(1)}%. Review missed questions and practise the topics that caused errors.`:"Record results to receive subject-level study suggestions."}</p></div></div><div class="focus-card"><span class="focus-number">02</span><div><strong>${best?`Build on ${escapeHTML(best.name)}`:"Track consistency"}</strong><p>${best?`Your strongest recorded subject averages ${best.score.toFixed(1)}%. Use the same preparation habits in other subjects.`:"Record more than one assessment to identify a trend."}</p></div></div><div class="focus-card"><span class="focus-number">03</span><div><strong>Use evidence, not guesses</strong><p>Compare scores across assessments before changing your study plan. A single result is not a complete picture.</p></div></div>`;
  }
  function timeLabel(time) {
    const [h,m]=time.split(":").map(Number), period=h>=12?"PM":"AM", hour=h%12||12;
    return `${hour}:${String(m).padStart(2,"0")} ${period}`;
  }
  function weekStart(offset=0) {
    const d=new Date(today); d.setHours(12,0,0,0); d.setDate(d.getDate()-d.getDay()+offset*7); return d;
  }
  function renderTimetable() {
    const start=weekStart(timetableOffset), end=shiftDate(start,6);
    $("#weekRange").textContent=`${start.toLocaleDateString("en-IN",{day:"numeric",month:"short"})} – ${end.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}`;
    const dayCols=Array.from({length:7},(_,i)=>{
      const date=shiftDate(start,i), day=date.getDay(), classes=data.classes.filter(c=>c.day===day).sort((a,b)=>a.start.localeCompare(b.start));
      const isToday=isoDate(date)===isoDate(today);
      return `<div class="day-column"><div class="day-header ${isToday?"today":""}"><small>${dayShort[day]}</small><strong>${date.getDate()}</strong></div><div class="day-classes">${classes.length?classes.map(c=>`<div class="class-card ${c.color}" title="${escapeHTML(c.subject)}"><strong>${escapeHTML(c.subject)}</strong><small class="class-time">${timeLabel(c.start)}–${timeLabel(c.end)}</small><small>${escapeHTML(c.room)}</small><div style="text-align:right;margin-top:5px"><button class="row-action" style="font-size:12px" data-action="edit-class" data-id="${c.id}" aria-label="Edit class">···</button></div></div>`).join(""):`<div class="no-class">No classes</div>`}</div></div>`;
    }).join("");
    $("#timetableGrid").innerHTML=dayCols;
  }
  function renderAnalytics() {
    $("#analyticsAttendanceChart").innerHTML=data.subjects.map(s=>`<div class="horizontal-row"><span class="label">${escapeHTML(s.name)}</span><div class="horizontal-track"><span class="${pct(s)<75?"below":""}" style="width:${Math.min(100,pct(s))}%"></span></div><strong>${pct(s).toFixed(1)}%</strong></div>`).join("");
    $("#analyticsMarksChart").innerHTML=data.subjects.map(s=>{
      const arr=data.marks.filter(m=>m.subject===s.name), avg=arr.length?arr.reduce((n,m)=>n+m.score/m.max*100,0)/arr.length:0;
      return `<div class="horizontal-row"><span class="label">${escapeHTML(s.name)}</span><div class="horizontal-track"><span class="${avg<60?"below":""}" style="width:${avg}%"></span></div><strong>${arr.length?avg.toFixed(1)+"%":"—"}</strong></div>`;
    }).join("");
    const held=data.subjects.reduce((n,s)=>n+s.held,0),attended=data.subjects.reduce((n,s)=>n+s.attended,0);
    $("#analyticsSummary").innerHTML=[["Attendance",`${overallAttendance().toFixed(1)}%`,"Across all subjects"],["Assessment average",`${avgMarks().toFixed(1)}%`,"Recorded results"],["Assignments",data.assignments.length,`${data.assignments.filter(a=>a.status==="pending").length} pending`],["Classes logged",held,`${attended} attended`]].map(x=>`<div class="summary-metric"><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join("");
  }
  function renderSettings() {
    $("#profileName").value=data.profile.name;
    $("#profileProgramme").value=data.profile.programme;
    $("#profileSession").value=data.profile.session;
  }

  function field(name,label,type="text",value="",opts={}) {
    const full=opts.full?" field-full":"";
    const req=opts.required===false?"":" required";
    let control="";
    if(type==="select") control=`<select class="field-select" id="field-${name}" name="${name}"${req}>${opts.options.map(o=>`<option value="${escapeHTML(o.value)}" ${String(value)===String(o.value)?"selected":""}>${escapeHTML(o.label)}</option>`).join("")}</select>`;
    else if(type==="textarea") control=`<textarea class="field-textarea" id="field-${name}" name="${name}" maxlength="${opts.maxlength||500}"${req}>${escapeHTML(value)}</textarea>`;
    else control=`<input class="field-input" id="field-${name}" name="${name}" type="${type}" value="${escapeHTML(value)}" ${opts.min!==undefined?`min="${opts.min}"`:""} ${opts.max!==undefined?`max="${opts.max}"`:""} ${opts.step?`step="${opts.step}"`:""} ${opts.maxlength?`maxlength="${opts.maxlength}"`:""}${req}>`;
    return `<label class="field-label${full}" for="field-${name}">${label}${control}</label>`;
  }
  function openModal(mode, record=null) {
    modalMode=mode; editingId=record?.id??null;
    $("#formError").textContent="";
    const fields=$("#modalFields");
    const subjects=data.subjects.map(s=>({value:s.name,label:s.name}));
    const subjectOpts=subjects.length?subjects:[{value:"General",label:"General"}];
    let title="", html="";
    if(mode==="assignment") {
      title=record?"Edit assignment":"Add assignment";
      html=field("title","Assignment title","text",record?.title||"",{full:true,maxlength:120})+
        field("subject","Subject","select",record?.subject||subjectOpts[0].value,{options:subjectOpts})+
        field("due","Due date","date",record?.due||isoDate(shiftDate(today,7)))+
        field("priority","Priority","select",record?.priority||"Normal",{options:[{value:"Low",label:"Low"},{value:"Normal",label:"Normal"},{value:"High",label:"High"}]})+
        field("description","Description","textarea",record?.description||"",{full:true,required:false,maxlength:400});
    } else if(mode==="attendance") {
      title="Record attendance";
      const s=record||data.subjects[0];
      html=field("subjectId","Subject","select",s?.id||"",{options:data.subjects.map(x=>({value:x.id,label:x.name}))})+
        field("result","Today's status","select","present",{options:[{value:"present",label:"Present"},{value:"absent",label:"Absent"}]})+
        `<p class="field-full" style="font-size:10px;color:#8994a4;line-height:1.6;margin:0">This records one additional class for the selected subject. It updates the totals in this browser only.</p>`;
    } else if(mode==="mark") {
      title="Add assessment result";
      html=field("title","Assessment name","text",record?.title||"",{maxlength:100})+
        field("subject","Subject","select",record?.subject||subjectOpts[0].value,{options:subjectOpts})+
        field("date","Assessment date","date",record?.date||isoDate(today))+
        field("score","Score earned","number",record?.score??"",{min:0,max:1000,step:"0.5"})+
        field("max","Maximum score","number",record?.max??100,{min:1,max:1000,step:"0.5"});
    } else if(mode==="class") {
      title=record?"Edit class":"Add class";
      html=field("subject","Subject","select",record?.subject||subjectOpts[0].value,{options:subjectOpts})+
        field("day","Day","select",record?.day??1,{options:dayNames.map((d,i)=>({value:i,label:d}))})+
        field("start","Start time","time",record?.start||"09:30")+
        field("end","End time","time",record?.end||"10:30")+
        field("room","Room / location","text",record?.room||"",{full:true,maxlength:80});
    }
    $("#modalTitle").textContent=title;
    $("#modalEyebrow").textContent=mode==="attendance"?"ATTENDANCE":mode==="assignment"?"COURSEWORK":mode==="mark"?"ASSESSMENT":"TIMETABLE";
    fields.innerHTML=html;
    $("#saveRecordButton").textContent=record?"Save changes":mode==="attendance"?"Record attendance":"Save record";
    $("#modalBackdrop").classList.add("open");
    $("#modalBackdrop").setAttribute("aria-hidden","false");
    window.setTimeout(()=>$("#modalFields input, #modalFields select")?.focus(),50);
  }
  function closeModal() {
    $("#modalBackdrop").classList.remove("open");
    $("#modalBackdrop").setAttribute("aria-hidden","true");
    $("#recordForm").reset(); modalMode=null; editingId=null;
  }
  function formValues() { return Object.fromEntries(new FormData($("#recordForm")).entries()); }
  function handleRecordSubmit(event) {
    event.preventDefault();
    const v=formValues();
    if(!$("#recordForm").reportValidity()) return;
    if(modalMode==="assignment") {
      const record={id:editingId??Date.now(),title:v.title.trim(),subject:v.subject,due:v.due,status:editingId?(data.assignments.find(a=>a.id===editingId)?.status||"pending"):"pending",description:v.description.trim(),priority:v.priority};
      if(editingId) data.assignments=data.assignments.map(a=>a.id===editingId?record:a); else data.assignments.push(record);
      saveData(); closeModal(); renderView(activeView); toast(editingId?"Assignment updated.":"Assignment added.");
    } else if(modalMode==="attendance") {
      const s=data.subjects.find(x=>x.id===v.subjectId);
      if(!s) {$("#formError").textContent="Select a valid subject.";return;}
      s.held+=1; if(v.result==="present") s.attended+=1;
      data.attendanceLog.push({subjectId:s.id,date:isoDate(today),result:v.result});
      saveData(); closeModal(); renderView(activeView); toast(`Attendance recorded: ${v.result}.`);
    } else if(modalMode==="mark") {
      const score=Number(v.score), max=Number(v.max);
      if(!Number.isFinite(score)||!Number.isFinite(max)||max<=0||score<0||score>max) {$("#formError").textContent="Score must be between zero and the maximum score.";return;}
      data.marks.push({id:Date.now(),title:v.title.trim(),subject:v.subject,date:v.date,score,max});
      saveData(); closeModal(); renderView(activeView); toast("Assessment result added.");
    } else if(modalMode==="class") {
      if(v.end<=v.start) {$("#formError").textContent="End time must be later than start time.";return;}
      const day=Number(v.day);
      const overlap=data.classes.some(c=>c.day===day&&c.id!==editingId&&v.start<c.end&&v.end>c.start);
      if(overlap) {$("#formError").textContent="This class overlaps another class on the selected day. Choose a different time.";return;}
      const record={id:editingId??Date.now(),day,start:v.start,end:v.end,subject:v.subject,room:v.room.trim(),color:subjectColor(v.subject)};
      if(editingId) data.classes=data.classes.map(c=>c.id===editingId?record:c); else data.classes.push(record);
      saveData(); closeModal(); renderView(activeView); toast(editingId?"Class updated.":"Class added to timetable.");
    }
  }
  function handleAction(event) {
    const button=event.target.closest("[data-action]");
    if(!button) return;
    const id=Number(button.dataset.id), action=button.dataset.action;
    if(action==="attendance-record") {
      const s=data.subjects.find(x=>x.id===button.dataset.id); openModal("attendance",s);
    } else if(action==="edit-assignment") {
      const a=data.assignments.find(x=>x.id===id); if(a) openModal("assignment",a);
    } else if(action==="toggle-assignment") {
      const a=data.assignments.find(x=>x.id===id); if(!a)return;
      a.status=a.status==="submitted"?"pending":"submitted"; saveData(); renderView(activeView); toast(a.status==="submitted"?"Assignment marked as submitted.":"Assignment reopened.");
    } else if(action==="delete-mark") {
      if(confirm("Delete this assessment result?")) {data.marks=data.marks.filter(m=>m.id!==id);saveData();renderView(activeView);toast("Assessment result deleted.");}
    } else if(action==="edit-class") {
      const c=data.classes.find(x=>x.id===id); if(c) openModal("class",c);
    }
  }
  function exportJSON() {
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url;a.download=`campusos-workspace-${isoDate(today)}.json`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
    toast("Workspace data exported.");
  }
  function exportAnalytics() {
    const lines=[["CampusOS Academic Summary"],["Generated",new Date().toLocaleString()],[],["Attendance by subject"],["Subject","Classes held","Attended","Attendance %"],...data.subjects.map(s=>[s.name,s.held,s.attended,pct(s).toFixed(1)]),[],["Assessment results"],["Assessment","Subject","Date","Score","Maximum","Percentage"],...data.marks.map(m=>[m.title,m.subject,m.date,m.score,m.max,(m.score/m.max*100).toFixed(1)])];
    const csv=lines.map(row=>row.map(cell=>`"${String(cell??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}), url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url;a.download=`campusos-academic-report-${isoDate(today)}.csv`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);toast("Academic report exported as CSV.");
  }
  function renderSettingsName() {
    const name=data.profile.name.trim()||"Student";
    $(".profile-meta strong").textContent=name;
    $(".avatar.top-avatar").textContent=initials(name);
    $(".profile-mini .avatar").textContent=initials(name);
    const first=name.split(/\s+/)[0];
    const h=$(".page-heading h1",$("#view-overview"));
    if(h) h.innerHTML=`${greeting()}, ${escapeHTML(first)} <span class="wave">✳</span>`;
  }
  function startTour() {
    tourIndex=0; $("#tourBackdrop").hidden=false; renderTourStep();
  }
  const tourSteps=[
    ["Your academic overview","A single view of attendance, upcoming deadlines, recent assessment scores, and today's schedule."],
    ["Keep attendance visible","Subject-level progress makes it easier to spot when attendance is getting close to the minimum requirement."],
    ["Stay on top of coursework","Add assignments, track due dates, and mark work as submitted. Your changes persist in this browser."],
    ["Use evidence to improve","Marks and analytics turn your recorded results into a clearer picture of where to focus."]
  ];
  function renderTourStep() {
    const step=tourSteps[tourIndex];
    $("#tourStep").textContent=`${String(tourIndex+1).padStart(2,"0")} / ${String(tourSteps.length).padStart(2,"0")}`;
    $("#tourTitle").textContent=step[0];$("#tourText").textContent=step[1];
    $("#tourNext").textContent=tourIndex===tourSteps.length-1?"Finish tour ✓":"Next →";
  }
  function bindEvents() {
    $$(".nav-item[data-view]").forEach(btn=>btn.addEventListener("click",()=>navTo(btn.dataset.view)));
    $$("[data-navigate]").forEach(btn=>btn.addEventListener("click",()=>navTo(btn.dataset.navigate)));
    $("#mobileMenu").addEventListener("click",()=>{
      $("#sidebar").classList.toggle("open");
      if($("#sidebar").classList.contains("open")) {
        const backdrop=document.createElement("div");backdrop.className="sidebar-backdrop";document.body.append(backdrop);
        backdrop.addEventListener("click",()=>{$("#sidebar").classList.remove("open");backdrop.remove();});
      } else $(".sidebar-backdrop")?.remove();
    });
    $("#quickAddButton").addEventListener("click",()=>openQuickAdd());
    $("#markAttendanceButton").addEventListener("click",()=>openModal("attendance"));
    $("#addAssignmentButton").addEventListener("click",()=>openModal("assignment"));
    $("#addMarkButton").addEventListener("click",()=>openModal("mark"));
    $("#addClassButton").addEventListener("click",()=>openModal("class"));
    $("#closeModalButton").addEventListener("click",closeModal);
    $("#cancelModalButton").addEventListener("click",closeModal);
    $("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal();});
    $("#recordForm").addEventListener("submit",handleRecordSubmit);
    $("#attendanceSearch").addEventListener("input",renderAttendance);
    $("#plannerSubject").addEventListener("change",renderAttendancePlanner);
    $("#plannerTarget").addEventListener("change",renderAttendancePlanner);
    $("#assignmentSearch").addEventListener("input",renderAssignments);
    $("#assignmentSubjectFilter").addEventListener("change",renderAssignments);
    $("#marksSearch").addEventListener("input",renderMarks);
    $("#assignmentTabs").addEventListener("click",e=>{
      const tab=e.target.closest("[data-filter]");if(!tab)return;
      assignmentFilter=tab.dataset.filter;
      $$(".tab",$("#assignmentTabs")).forEach(t=>t.classList.toggle("active",t===tab));
      renderAssignments();
    });
    $("#smartInsights").addEventListener("click",e=>{const btn=e.target.closest("[data-navigate]");if(btn)navTo(btn.dataset.navigate);});
    $("#attendanceTableBody").addEventListener("click",handleAction);
    $("#assignmentGrid").addEventListener("click",handleAction);
    $("#marksTableBody").addEventListener("click",handleAction);
    $("#timetableGrid").addEventListener("click",handleAction);
    $("#previousWeek").addEventListener("click",()=>{timetableOffset--;renderTimetable();});
    $("#nextWeek").addEventListener("click",()=>{timetableOffset++;renderTimetable();});
    $("#currentWeekButton").addEventListener("click",()=>{timetableOffset=0;renderTimetable();});
    $("#profileForm").addEventListener("submit",e=>{
      e.preventDefault();
      data.profile.name=$("#profileName").value.trim();
      data.profile.programme=$("#profileProgramme").value.trim();
      data.profile.session=$("#profileSession").value.trim();
      saveData();renderSettingsName();toast("Profile settings saved.");
    });
    $("#exportDataButton").addEventListener("click",exportJSON);
    $("#exportAnalyticsButton").addEventListener("click",exportAnalytics);
    $("#resetDataButton").addEventListener("click",()=>{
      if(confirm("Reset all CampusOS demo data in this browser? Your edits will be lost.")){
        data=defaultData();saveData();renderSettingsName();renderView(activeView);toast("Demo data restored.");
      }
    });
    $("#helpButton").addEventListener("click",startTour);
    $("#tourSkip").addEventListener("click",()=>$("#tourBackdrop").hidden=true);
    $("#tourNext").addEventListener("click",()=>{
      if(tourIndex<tourSteps.length-1){tourIndex++;renderTourStep();}
      else {$("#tourBackdrop").hidden=true;toast("You're ready to explore CampusOS.");}
    });
    $("#notificationButton").addEventListener("click",()=>{
      const pending=data.assignments.filter(a=>a.status==="pending").length;
      toast(pending?`You have ${pending} pending assignment${pending===1?"":"s"} in your workspace.`:"You're all caught up.");
    });
    $("#profileMenu").addEventListener("click",()=>navTo("settings"));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();$("#tourBackdrop").hidden=true;$("#sidebar").classList.remove("open");$(".sidebar-backdrop")?.remove();}});
  }
  function openQuickAdd() {
    const choice = document.createElement("div");
    choice.className = "quick-add-menu";
    choice.setAttribute("role", "dialog");
    choice.setAttribute("aria-label", "Choose a record to add");
    choice.innerHTML = `<div class="quick-add-card"><div class="quick-add-heading"><strong>What would you like to add?</strong><button class="icon-button" type="button" data-close-quick aria-label="Close quick add">×</button></div><button type="button" data-mode="assignment"><span>▤</span><span><strong>Assignment</strong><small>Add coursework and a due date</small></span><b>→</b></button><button type="button" data-mode="attendance"><span>◷</span><span><strong>Attendance</strong><small>Record a present or absent class</small></span><b>→</b></button><button type="button" data-mode="mark"><span>⌁</span><span><strong>Assessment result</strong><small>Record a score or practical mark</small></span><b>→</b></button><button type="button" data-mode="class"><span>▦</span><span><strong>Timetable class</strong><small>Add a weekly class session</small></span><b>→</b></button></div>`;
    document.body.append(choice);
    let onEscape;
    const close=()=>{choice.remove(); if(onEscape) document.removeEventListener("keydown",onEscape);};
    choice.addEventListener("click",e=>{
      if(e.target===choice || e.target.closest("[data-close-quick]")){close();return;}
      const button=e.target.closest("[data-mode]");
      if(button){const mode=button.dataset.mode;close();openModal(mode);}
    });
    onEscape=e=>{if(e.key==="Escape") close();};
    document.addEventListener("keydown",onEscape);
  }

  function init() {
    bindEvents();
    renderSettingsName();
    renderOverview();
    let hasSeenTour = false;
    try { hasSeenTour = sessionStorage.getItem("campusos-tour-seen") === "1"; } catch (_) { /* Storage may be disabled in private or restricted contexts. */ }
    if(!hasSeenTour) {
      window.setTimeout(()=>{
        startTour();
        try { sessionStorage.setItem("campusos-tour-seen","1"); } catch (_) { /* The tour can still be used without session storage. */ }
      },650);
    }
    // Keep the current date visible without relying on a fixed academic calendar.
    $("#todayLabel").textContent=today.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();
  }
  init();
})();
