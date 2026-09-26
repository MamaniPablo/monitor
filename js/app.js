const $=id=>document.getElementById(id);
const historyCPU=[],historyRX=[],historyTX=[],maxPoints=60;
const state={cpu:18.7,ram:42.3,disk:37.8,rx:1843200,tx:768000,load:[0.72,0.61,0.49],
containers:[
{name:"my-nginx",status:"running",cpu:2.4,mem:4.8,used:.09,limit:1,rx:32000,tx:18000,uptime:"2d 08h"},
{name:"monitoring",status:"running",cpu:1.1,mem:3.2,used:.07,limit:1,rx:12000,tx:9000,uptime:"2d 08h"},
{name:"postgres",status:"running",cpu:.8,mem:7.6,used:.15,limit:2,rx:5400,tx:4100,uptime:"5d 14h"}]};
const fmtGB=n=>`${Number(n||0).toFixed(1)} GB`;
const fmtRate=n=>{n=Number(n||0);if(n<1024)return`${n.toFixed(0)} B/s`;if(n<1048576)return`${(n/1024).toFixed(1)} KB/s`;return`${(n/1048576).toFixed(1)} MB/s`};
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function setGauge(id,v){$(id).style.strokeDashoffset=301.59-(301.59*Math.max(0,Math.min(100,v))/100)}
function setBar(id,v){$(id).style.width=Math.max(0,Math.min(100,v))+"%"}
function drawChart(id,a,maxY,color="#00ff79"){
 const c=$(id),ctx=c.getContext("2d"),r=c.getBoundingClientRect(),d=devicePixelRatio||1,w=Math.max(10,r.width),h=Math.max(10,r.height);
 c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);ctx.strokeStyle="rgba(0,255,110,.12)";
 for(let i=0;i<5;i++){let y=8+i*(h-18)/4;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 if(a.length<2)return;ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=8;ctx.lineWidth=2;ctx.beginPath();
 a.forEach((v,i)=>{let x=i*(w-4)/(a.length-1)+2,y=h-10-(Math.min(maxY,Math.max(0,v))/maxY)*(h-20);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.shadowBlur=0
}
function update(){
 state.cpu=Math.max(3,Math.min(92,state.cpu+(Math.random()-.5)*5));state.ram=Math.max(20,Math.min(85,state.ram+(Math.random()-.5)*1.2));
 state.load=state.load.map((v,i)=>Math.max(.1,v+(Math.random()-.5)*[.15,.08,.05][i]));state.rx=Math.max(5e4,state.rx*(.92+Math.random()*.16));state.tx=Math.max(2e4,state.tx*(.92+Math.random()*.16));
 $("osName").textContent="CentOS Stream 10";$("release").textContent="10 (Coughlan)";$("hostname").textContent="mamanilab";$("sideHost").textContent="mamanilab";
 $("kernel").textContent="6.12.x";$("arch").textContent="x86_64";$("cpuModel").textContent="Intel / AMD x86_64";$("cores").textContent="HOST / LOGICAL";$("uptime").textContent="2d 08h 14m";$("hostDate").textContent=new Date().toLocaleString("es-AR");
 $("cpu").textContent=state.cpu.toFixed(1)+"%";$("ram").textContent=state.ram.toFixed(1)+"%";$("disk").textContent=state.disk.toFixed(1)+"%";
 $("cpuMeta").textContent="modo demostración";$("ramMeta").textContent="datos de ejemplo";$("diskMeta").textContent="datos de ejemplo";
 setGauge("cpuArc",state.cpu);setGauge("ramArc",state.ram);setGauge("diskArc",state.disk);
 $("cpuBarText").textContent=state.cpu.toFixed(1)+"%";$("ramBarText").textContent=state.ram.toFixed(1)+"%";$("diskBarText").textContent=state.disk.toFixed(1)+"%";
 setBar("cpuBar",state.cpu);setBar("ramBar",state.ram);setBar("diskBar",state.disk);
 $("load1").textContent=state.load[0].toFixed(2);$("load5").textContent=state.load[1].toFixed(2);$("load15").textContent=state.load[2].toFixed(2);
 $("swap").textContent="0.0 GB / 4.0 GB";$("iface").textContent="br0";
 historyCPU.push(state.cpu);historyCPU.splice(0,historyCPU.length-maxPoints);historyRX.push(state.rx);historyTX.push(state.tx);
 historyRX.splice(0,historyRX.length-maxPoints);historyTX.splice(0,historyTX.length-maxPoints);$("rx").textContent=fmtRate(state.rx);$("tx").textContent=fmtRate(state.tx);
 drawChart("cpuChart",historyCPU,100);drawChart("netChart",historyRX.map((v,i)=>Math.max(v,historyTX[i]||0)),Math.max(1024,...historyRX,...historyTX)*1.15,"#00e9ff");
 const cs=state.containers,totalCpu=cs.reduce((a,c)=>a+c.cpu,0),totalMem=cs.reduce((a,c)=>a+c.mem,0);
 $("totalContainers").textContent=cs.length;$("runningContainers").textContent=cs.length;$("stoppedContainers").textContent=0;$("containerCount").textContent=cs.length+" CONTENEDORES";
 $("dockerCpu").textContent=totalCpu.toFixed(1)+"%";$("dockerMem").textContent=totalMem.toFixed(1)+"%";setBar("dockerCpuBar",Math.min(100,totalCpu));setBar("dockerMemBar",Math.min(100,totalMem));
 $("containerTable").innerHTML=cs.map(c=>`<tr><td>${esc(c.name)}</td><td><span class="state-dot"></span>RUNNING</td><td>${c.cpu.toFixed(1)}</td><td>${c.mem.toFixed(1)}</td><td>${fmtGB(c.used)} / ${fmtGB(c.limit)}</td><td>${fmtRate(c.rx)} / ${fmtRate(c.tx)}</td><td>${c.uptime}</td></tr>`).join("");
 $("memoryBars").innerHTML=[...cs].sort((a,b)=>b.mem-a.mem).map(c=>`<div class="memrow"><span>${esc(c.name)}</span><i><u style="width:${Math.min(100,c.mem*8)}%"></u></i><b>${c.mem.toFixed(1)}%</b></div>`).join("");
 $("dockerVersion").textContent="Docker Engine";$("apiInfo").textContent="STATIC / DEMO";$("clock").textContent=new Date().toLocaleTimeString("es-AR");
 $("systemState").textContent="● DEMO MODE";$("systemState").className="online";
}
update();setInterval(update,5000);
window.addEventListener("resize",()=>{drawChart("cpuChart",historyCPU,100);drawChart("netChart",historyRX.map((v,i)=>Math.max(v,historyTX[i]||0)),Math.max(1024,...historyRX,...historyTX)*1.15,"#00e9ff")});
