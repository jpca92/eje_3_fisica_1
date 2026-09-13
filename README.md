# Simulación de fricción estática del garrafón

Proyecto web modular para el ejercicio de la página 144.

## Datos originales

- Fuerza normal: `N = 210 N`
- Caso 1: `f = 42 N`
- Caso 2: `f = 21 N`

## Resultados

En el instante en que el garrafón comienza a moverse:

```text
f = fs,max = μs N
μs = f / N
```

Caso 1:

```text
μs = 42 / 210 = 0.20
```

Caso 2:

```text
μs = 21 / 210 = 0.10
```

El segundo valor sigue siendo un coeficiente de fricción estática, porque el enunciado describe otra vez el umbral de inicio del movimiento.

## Estructura

```text
simulacion_friccion_garrafon/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── animation.js
    ├── constants.js
    ├── physics.js
    └── ui.js
```

## Funcionalidad

La interfaz permite modificar:

- La fuerza normal.
- La fuerza horizontal del caso 1.
- La fuerza horizontal del caso 2.
- El coeficiente de fricción estática de cada caso.
- El coeficiente de fricción cinética de cada caso, si se desea simular el deslizamiento posterior.
- El caso que se desea animar.

En cada caso se necesita la fuerza normal y al menos uno de estos datos: fuerza límite o coeficiente estático. Si se proporciona `μs`, el programa calcula la fuerza límite; si se proporciona la fuerza, calcula `μs`. Si ambos se escriben, deben ser consistentes. Los casos son independientes: se puede dejar uno vacío y animar el otro.

Al pulsar `Iniciar`, la fuerza aplicada y la fricción estática aumentan juntas hasta el valor crítico. Los cambios en los campos no arrancan ni reinician la animación; se aplican al pulsar `Iniciar`.

La fricción estática solo se muestra hasta el umbral. Para continuar con una fase físicamente distinta de deslizamiento hay que introducir `μk`; entonces se muestra `fₖ = μkN` y la animación usa la fuerza neta para representar el desplazamiento. Si `μk` está vacío, la animación termina correctamente en el umbral porque el ejercicio no proporciona ese dato.

En una superficie horizontal, la normal que actúa sobre el garrafón apunta hacia arriba y cumple `N = P` en magnitud. La normal que ejerce el garrafón sobre la superficie es la fuerza de reacción opuesta.

## Pruebas

El proyecto incluye pruebas unitarias de la lógica física, que verifican automáticamente los cálculos. Requieren Node.js y se ejecutan con:

```bash
npm test
```

## Ejecución local

El proyecto utiliza módulos JavaScript ES6, por lo que debe servirse mediante un servidor local. Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Luego abrir en el navegador:

```text
http://localhost:8000
```
