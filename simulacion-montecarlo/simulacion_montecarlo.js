// Monte Carlo de la regla de decisión usando el código real de los nodos del flujo
const fs = require('fs');
const d = JSON.parse(fs.readFileSync(process.argv[2]));
const by = Object.fromEntries(d.map(n => [n.name, n]));
const fZ = new Function('msg', 'flow', 'node', by['Z-Score'].func);
const fD = new Function('msg', 'flow', 'node', by['DETECCION DE ANOMALIAS'].func);
const node = { warn: () => {}, status: () => {} };

// RNG reproducible
let seed = Number(process.argv[3] || 12345);
function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed + 0.5) / 4294967296; }
function gauss() { let u = rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function chi2(k) { let s = 0; for (let i = 0; i < k; i++) { const g = gauss(); s += g * g; } return s; }
function t4unit() { return gauss() / Math.sqrt(chi2(4) / 4) / Math.SQRT2; } // var 1
const REF = { AP: [447.12, 115.0403], AN: [621.44, 35.6149], BP: [413.08, 31.7660], BN: [558.92, 42.7697],
  CP: [383.08, 48.2579], CN: [583.96, 65.2109], caudal: [3.3480, 0.7094] };
const TVARS = ['AP', 'AN', 'BP', 'BN', 'CP', 'CN'];

function makeSim(dist) {
  const store = {}; const flow = { get: k => store[k], set: (k, v) => { store[k] = v; } };
  let k = 0; let anomCycles = 0, cycles = 0;
  function cycle(fault) {
    const c = { ciclo: ++k };
    for (const v of [...TVARS, 'caudal']) {
      const [m, s] = REF[v]; const e = dist === 't4' ? t4unit() : gauss();
      let x = m + s * e;
      if (fault && fault.type === 'obs' && fault.v === v) x = x * fault.f;
      if (fault && fault.type === 'leak' && v === 'caudal') x = x + fault.delta;
      c[v] = Math.max(v === 'caudal' ? 0 : 1, v === 'caudal' ? x : Math.round(x));
    }
    flow.set('ciclos', [c]);
    const z = fZ({ payload: null }, flow, node); if (!z) return null;
    fD(z, flow, node);
    const est = flow.get('estadoAnomaliaDashboard');
    if (!fault) { cycles++; if (est.anomalia) anomCycles++; }
    return est.estados;
  }
  return { cycle, stats: () => ({ anomCycles, cycles }) };
}

function runTramo(sim, fault) {
  // devuelve {correct, other, delay}
  let correct = false, other = false, delay = null;
  const target = fault ? (fault.type === 'obs' ? fault.v : 'caudal') : null;
  for (let i = 1; i <= 10; i++) {
    const e = sim.cycle(fault);
    for (const [v, st] of Object.entries(e)) {
      if (st.estado === 'FALLA') {
        if (v === target) { if (!correct) { correct = true; delay = i; } }
        else other = true;
      }
    }
  }
  sim.cycle(null); // ciclo descartado de recuperación
  return { correct, other, delay };
}

function protocol(nObs, nLeak, nNorm, dist, ranges) {
  const sim = makeSim(dist);
  for (let i = 0; i < 20; i++) sim.cycle(null); // calentamiento
  const tramos = [];
  for (let i = 0; i < nObs; i++) tramos.push({ type: 'obs', v: TVARS[Math.floor(rnd() * 6)], f: ranges.f[0] + rnd() * (ranges.f[1] - ranges.f[0]) });
  for (let i = 0; i < nLeak; i++) tramos.push({ type: 'leak', delta: ranges.d[0] + rnd() * (ranges.d[1] - ranges.d[0]) });
  for (let i = 0; i < nNorm; i++) tramos.push(null);
  for (let i = tramos.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [tramos[i], tramos[j]] = [tramos[j], tramos[i]]; }
  const res = { VP: 0, FN: 0, FP: 0, VN: 0, miscl: 0, obsVP: 0, obsN: 0, leakVP: 0, leakN: 0, delays: [], byVar: {} };
  for (const f of tramos) {
    const r = runTramo(sim, f);
    if (f) {
      if (r.correct) { res.VP++; res.delays.push(r.delay); } else { res.FN++; if (r.other) res.miscl++; }
      if (f.type === 'obs') { res.obsN++; if (r.correct) res.obsVP++; const b = res.byVar[f.v] || (res.byVar[f.v] = [0, 0]); b[1]++; if (r.correct) b[0]++; }
      else { res.leakN++; if (r.correct) res.leakVP++; }
    } else { if (r.correct || r.other) res.FP++; else res.VN++; }
  }
  res.stats = sim.stats();
  return res;
}

// Curva de detección: P(alarma persistente correcta en 10 ciclos) vs desplazamiento en unidades de s
function curveLeak(dist, deltas, n) {
  const out = {};
  for (const ds of deltas) {
    let hit = 0; const sim = makeSim(dist);
    for (let i = 0; i < 20; i++) sim.cycle(null);
    for (let r = 0; r < n; r++) { const t = runTramo(sim, { type: 'leak', delta: ds * REF.caudal[1] }); if (t.correct) hit++; }
    out[ds] = hit / n;
  }
  return out;
}
function curve(dist, deltas, n) {
  const out = {};
  for (const ds of deltas) {
    let hit = 0, delaySum = 0;
    const sim = makeSim(dist);
    for (let i = 0; i < 20; i++) sim.cycle(null);
    for (let r = 0; r < n; r++) {
      const v = 'BP'; const [m, s] = REF[v];
      const f = { type: 'obs', v, f: (m + ds * s) / m };
      const t = runTramo(sim, f); if (t.correct) { hit++; delaySum += t.delay; }
    }
    out[ds] = { p: hit / n, delay: hit ? delaySum / hit : null };
  }
  return out;
}

const ranges = { f: [1.2, 4.0], d: [0.5, 5.0] };
const result = {};
for (const dist of ['normal', 't4']) {
  const big = protocol(3000, 3000, 3000, dist, ranges);
  const reps = []; for (let r = 0; r < 200; r++) { const p = protocol(30, 30, 30, dist, ranges); reps.push({ sens: p.VP / (p.VP + p.FN), esp: p.VN / (p.VN + p.FP) }); }
  reps.sort((a, b) => a.sens - b.sens); const espMin = Math.min(...reps.map(r => r.esp)); const sensMean = reps.reduce((a,r)=>a+r.sens,0)/reps.length;
  result[dist] = { big, sensP5: reps[Math.floor(0.05 * reps.length)].sens, sensP95: reps[Math.floor(0.95 * reps.length)].sens,
    curve: curve(dist, [1, 2, 3, 3.5, 4, 4.5, 5, 6], 3000), curveLeak: curveLeak(dist, [2, 3, 4, 5, 6], 3000), reps };
}
for (const k in result) { result[k].reps = undefined; }
console.log(JSON.stringify(result, (k, v) => k === 'delays' ? { mean: v.reduce((a, b) => a + b, 0) / v.length, max: Math.max(...v), min: Math.min(...v) } : v, 1));
