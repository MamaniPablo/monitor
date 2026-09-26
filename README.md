# CentOS Matrix Monitor

Sitio web estático, listo para subir a GitHub.

Estructura:

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

No contiene API, Docker Compose ni backend. Por eso funciona directamente como sitio estático.

IMPORTANTE: sin una API/backend el navegador no puede leer estadísticas reales del CentOS. Esta versión usa datos de demostración que cambian cada 5 segundos para que puedas probar el diseño y los gráficos.

Para datos reales del servidor, más adelante se puede agregar una API o un agente de monitoreo.

## Subir a GitHub

```bash
cd /opt/webs/monitor
git init
git add .
git commit -m "CentOS Matrix Monitor"
git branch -M main
git remote add origin git@github.com:MamaniPablo/monitor.git
git push -u origin main
```

Si ya existe un repositorio Git en `/opt/webs/monitor/web`, no reutilices ese `.git`: esta versión está pensada para que `.git` quede en `/opt/webs/monitor`.
