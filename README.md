# MOE's Tavern.

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 17.3.7.

---

## Implementaciones
Se implementó la librería [Gitmoji](https://gitmoji.dev/) para la convencion de commits.\
Se implementó la API pública [TheCocktailDB](https://www.thecocktaildb.com/api.php) para consumo del proyecto.\
Se implementó la librería [PrimeNG](https://v17.primeng.org/) para los componentes de estilos.

---

## Como correr el proyecto

#### Requisitos:
Para poder correr el proyecto es necesario nada mas tener instalado
NodeJS en sus versiones ^18.13.0 || ^20.9.0

En caso de tener NVM (Node Version Manager) recomiendo correr el comando `nvm install 18.20.4` ya que es con la version de Node con la que se llevo a cabo el desarrollo.

#### Pasos de ejecución:
Una vez instalado NodeJS se deberán ejecutar los siguientes comandos en la carpeta raíz del proyecto:
```
npm install
```

Esto descargará las dependencias necesarias para poder ejecutar el proyecto y una vez finalizada la instalación ejecutar:
```
npm start
```
Esto comenzará a compilar el proyecto y lo abrirá automáticamente en su navegador predeterminado en la direccion http://localhost:4200/cocktails

#### Como correr los test:
Para correr los test del proyecto se debe ejecutar en la carpeta raíz del proyecto el siguiente comando:
```
npm run test
```
Esto abrirá una nueva ventana de su navegador predeterminado con la lista completa de los test dentro del proyecto y en la terminal imprimirá en porcentaje el coverage total, también generará una carpeta llamada _**coverage**_ dentro de la carpeta raíz del proyecto en donde podemos encontrar el index.html para visualizarlo de una manera mas visual, se encuentra en: 
>moestavern\coverage\moestavern\index.html

---

## Estructura del proyecto
La estructura del proyecto es una arquitectura hibrida entre componentes standalone y modulares. Se utilizó la estrategia de carga perezosa para optimización de carga (lazy-loading).\
En la raíz del proyecto nos encontramos con carpetas para dividir responsabilidades:
* ``components``: Todo lo relacionado a las distintas pantallas (detalle, listado, barra de filtros).
Contiene un modulo de rutas donde se van a establecer todas las rutas relacionadas al cocktail, de esta manera si la aplicación va escalando podemos tener varios modulos de distintos apartados como pueden ser un perfil, un dashboard, panel de configuraciones, etc, haciendo la aplicación mas escalable a para futuras contribuciones.\
\
``components``: \
  |\
  |__ ``cocktail-detail``\
  |__ ``cocktail-filter``\
  |__ ``cocktail-layout``

* ``core``: le llame core al apartado donde vamos a contener todo tipo de lógica no visual, como por ejemplo los servicios, interfaces, interceptors, guards, funciones reutilizables como middlewares, etc.\
\
``core``: \
  |\
  |__ ``services``\
  |__ ``interfaces``\
  |__ ``utils``

* `shared`: esta carpeta tiene el fin de contener componentes genericamente reutilizables como tambien directivas, pipes o cualquier lógica reutilizable que sea util para el control del DOM, inputs o formularios.\
\
``shared/components``: \
  |\
  |__ ``cocktail-card``\
  |__ ``footer``\
  |__ ``header``
  


