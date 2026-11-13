import json, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
r=json.load(open('resultados.json'))['normal']
ob={float(k):v['p']*100 for k,v in r['curve'].items()}
lk={float(k):v*100 for k,v in r['curveLeak'].items()}
plt.rcParams.update({'font.family':'Liberation Serif','font.size':11})
fig,ax=plt.subplots(figsize=(6.4,3.6),dpi=250)
xs=sorted(ob); ax.plot(xs,[ob[x] for x in xs],color='#2a78d6',lw=2,marker='o',ms=6,label='Obstrucción (tiempo de B+)')
xl=sorted(lk); ax.plot(xl,[lk[x] for x in xl],color='#eb6834',lw=2,ls='--',marker='s',ms=6,label='Fuga (caudal)')
ax.axhline(95,color='#666666',lw=1,ls=':'); ax.text(1.05,96.5,'Criterio de éxito: 95 %',color='#333333',fontsize=10)
ax.set_xlabel('Desplazamiento de la variable (en desviaciones estándar, s, de la línea base)')
ax.set_ylabel('Probabilidad de alarma\npersistente en ≤ 10 ciclos (%)')
ax.set_xlim(0.8,6.2); ax.set_ylim(-3,105)
ax.grid(axis='y',color='#e3e3e3',lw=0.8); ax.set_axisbelow(True)
for sp in ('top','right'): ax.spines[sp].set_visible(False)
ax.legend(frameon=False,loc='lower right')
fig.tight_layout(); fig.savefig('figura_8_curva_deteccion.png',facecolor='white')
