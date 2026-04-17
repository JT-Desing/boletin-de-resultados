# Boletin de Resultados ePayco

Sitio publicado en GitHub Pages:

- [https://jt-desing.github.io/boletin-de-resultados/](https://jt-desing.github.io/boletin-de-resultados/)

## Que se corrigio

- El sitio ahora intenta cargar primero `public/data/boletin-data.json`, de modo que los datos mensuales ya no dependen de editar `src/App.tsx`.
- Se agrego un flujo para convertir un Excel o CSV a JSON y desplegarlo automaticamente.
- Se reforzo el workflow de GitHub Pages para regenerar y publicar los datos en cada push.

## Como actualizar el boletin desde Excel

Puedes trabajar de dos maneras:

1. Editar `data/boletin.csv` directamente en Excel.
2. Subir un archivo `data/boletin.xlsx` con la misma estructura de columnas.

Columnas esperadas:

- `period`: periodo del boletin. Ejemplo: `2026-02`
- `path`: ruta del dato dentro del JSON. Ejemplo: `ingresos.cards[0].title`
- `type`: tipo del valor. Soporta `string`, `number`, `boolean`, `json`, `null`, `empty`
- `value`: valor final

Notas:

- Si existen ambos archivos, `data/boletin.xlsx` tiene prioridad sobre `data/boletin.csv`.
- El workflow genera `public/data/boletin-data.json`, hace commit del JSON actualizado y luego vuelve a desplegar Pages.
- El CSV actual del repositorio sirve como plantilla editable.

## Flujo automatico en GitHub

Cada push a `main`:

1. Lee `data/boletin.xlsx` o `data/boletin.csv`
2. Genera `public/data/boletin-data.json`
3. Guarda el JSON actualizado en el repositorio
4. Construye la app React
5. Publica la nueva version en GitHub Pages

## Script local

Para convertir manualmente una hoja a JSON:

```bash
python scripts/sync_spreadsheet_to_json.py data/boletin.xlsx public/data/boletin-data.json
```

Para regenerar el CSV editable desde el JSON actual:

```bash
python scripts/sync_spreadsheet_to_json.py --from-json public/data/boletin-data.json data/boletin.csv
```
