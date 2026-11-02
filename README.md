# Portafolis 3D interactiu

Portafolis personal concebut com un entorn 3D explorable. Combina una oficina futurista, estacions interactives, animacions, àudio sincronitzat i panells amb informació personal i projectes.

## Contingut

- [Tecnologies](#tecnologies)
- [Requisits i execució](#requisits-i-execució)
- [Funcionalitats](#funcionalitats)
- [Controls](#controls)
- [Seccions del portafolis](#seccions-del-portafolis)
- [Àudio i introducció](#àudio-i-introducció)
- [Accessibilitat i adaptació](#accessibilitat-i-adaptació)
- [Estructura i recursos](#estructura-i-recursos)
- [Personalització](#personalització)
- [Compilació i publicació](#compilació-i-publicació)

## Tecnologies

- **A-Frame**: escena WebGL i bucle de renderització.
- **Three.js** (`super-three`): càmera, il·luminació, geometria, col·lisions, models i animacions.
- **Web Audio API**: reproducció, mescla, anàlisi de freqüències i efectes de so.
- **Canvas 2D**: visualitzador de l’espectre de la introducció.
- **Vite**: servidor de desenvolupament i compilació de producció.

## Requisits i execució

Cal tenir instal·lats Node.js i npm. Des de l’arrel del projecte, instal·la les dependències i inicia el servidor local:

```bash
npm install
npm run dev
```

Vite mostrarà l’adreça local a la terminal. Per generar la versió de producció i previsualitzar-la:

```bash
npm run build
npm run preview
```

La carpeta `dist/` és una sortida generada: no cal afegir-la al repositori perquè es crea amb `npm run build`.

## Funcionalitats

### Introducció i entrada a l’entorn

- Pantalla de càrrega cinematogràfica amb el progrés real dels models 3D.
- Reactor hologràfic central, òrbites, ones, partícules i espectre reactiu a la música.
- Transició gradual des de la introducció fins al portafolis.
- Animació HUD de benvinguda durant aproximadament vuit segons en entrar a l’espai. El model 3D continua visible al fons i els panells de navegació i ubicació s’amaguen temporalment.

### Entorn 3D

- Oficina carregada des d’un model GLB, amb monitor, braç en primera persona i cinc estacions interactives.
- Moviment en primera persona, gravetat, detecció del terra i col·lisions amb parets i objectes.
- Llanterna activable i braç animat quan s’obren les estacions.
- Marcadors i etiquetes de les estacions amb indicació de proximitat i punt de mira.
- Pols ambiental subtil i il·luminació reactiva al so.
- Menú per obrir directament qualsevol secció sense desplaçar-se fins a l’estació.

### Interfície

- Panells de contingut amb animacions d’obertura i tancament.
- Indicador de l’estació explorada, avisos temporals i indicadors d’interacció.
- Controls tàctils per moure’s en dispositius mòbils.
- Control per activar o silenciar els àudios i opció per reduir el moviment.

## Controls

| Acció | Escriptori | Mòbil o tauleta |
| --- | --- | --- |
| Moure’s | `W`, `A`, `S`, `D` o les fletxes | Mantenir premuts els controls direccionals |
| Mirar | Mou el ratolí amb el punter bloquejat; també es pot arrossegar si el bloqueig no està disponible | Arrossegar sobre l’escena |
| Obrir o tancar una estació | `E` | Apropar-se i utilitzar el punt d’interacció |
| Encendre o apagar la llanterna | `L` | — |
| Tancar un panell o alliberar el punter | `Esc` | Tancar el panell |
| Activar o silenciar l’àudio | Botó **So** | Botó **So** |
| Reduir les animacions | Botó **Reduir moviment** | Botó **Reduir moviment** |

En ordinadors, es pot fer clic a l’escena per tornar a bloquejar el punter. El navegador pot mostrar un avís si no permet aquesta funció; en aquest cas, es pot continuar mirant amb el ratolí o arrossegant l’escena.

## Seccions del portafolis

El portafolis ofereix una portada i cinc estacions:

1. **Sobre mi**: presentació personal i interès pel desenvolupament d’aplicacions.
2. **GitHub**: enllaç al perfil i als repositoris de codi.
3. **Projectes**: sis projectes web —My Store, Music Box, Great Painters, Parc Ambiental, Whac a Mole i PokeApi— amb enllaços a les seves demostracions.
4. **Contacte**: enllaços a LinkedIn i al correu electrònic.
5. **Currículum**: opcions per obrir o descarregar el PDF.

Els textos, les coordenades i el contingut dels panells es defineixen a la llista `sections` de `src/main.js`.

## Àudio i introducció

La introducció utilitza `diamond_tunes-cinematic-sound-effect-327618.mp3`. Els efectes visuals segueixen el temps real de reproducció i responen a les freqüències analitzades mitjançant Web Audio API. Els impactes mesurats del fitxer alimenten pulsacions i ones visuals; les fases de la seqüència actualitzen l’estat de càrrega. Quan acaba la pista, la pantalla de càrrega s’esvaeix tan bon punt l’escena també està preparada.

Els navegadors poden impedir la reproducció automàtica amb so. Si això passa, l’aplicació torna a provar d’iniciar l’àudio quan l’usuari interactua amb la pàgina.

Els fitxers d’àudio tenen aquests usos:

- `diamond_tunes-cinematic-sound-effect-327618.mp3`: banda sonora de la introducció.
- `ambiente.mp3`: ambient de càrrega dels models i música ambiental en bucle durant l’exploració.
- `47313572-ui-sounds-pack-2-sound-5-358890.mp3`: so de l’obertura dels panells.
- Els sons breus de navegació, entrada, tancament i llanterna es sintetitzen amb Web Audio API.

El control **So** governa l’àudio de la introducció, l’ambient i els efectes d’interacció. Les transicions entre la introducció i l’ambient es gestionen amb guanys i atenuacions graduals.

## Accessibilitat i adaptació

- La interfície s’adapta a escriptoris, tauletes i mòbils.
- Es pot activar la reducció de moviment des de la interfície i es respecta `prefers-reduced-motion`.
- Els controls i estats rellevants utilitzen etiquetes accessibles, regions d’estat i atributs ARIA.
- La pantalla de benvinguda i els panells indiquen quan estan actius; durant la benvinguda, els panells de navegació i ubicació queden ocults.
- La reproducció automàtica té una alternativa quan el navegador exigeix una interacció prèvia.
- L’escena necessita un navegador compatible amb WebGL. L’àudio i l’anàlisi de freqüències requereixen Web Audio API.

## Estructura i recursos

```text
.
├── index.html
├── src/
│   ├── main.js
│   └── style.css
├── public/
│   └── CV_Joseph_Fuentes.pdf
├── hubs-cyberpunk-office/
│   ├── source/CyberpunkOffice.glb
│   └── textures/palette_0.jpeg
├── brazo.glb
├── pantalla.glb
├── ambiente.mp3
├── diamond_tunes-cinematic-sound-effect-327618.mp3
├── 47313572-ui-sounds-pack-2-sound-5-358890.mp3
├── package.json
└── package-lock.json
```

- `index.html`: estructura de la pàgina, escena A-Frame, pantalla de càrrega, benvinguda, menú, panells i precàrrega dels models.
- `src/main.js`: contingut, càrrega i preparació dels models, àudio, interaccions, col·lisions i actualització de l’escena.
- `src/style.css`: aparença, animacions, disposicions adaptables i preferències de moviment.
- `public/CV_Joseph_Fuentes.pdf`: currículum servit com a recurs estàtic.
- `hubs-cyberpunk-office/source/CyberpunkOffice.glb`: model de l’oficina; `hubs-cyberpunk-office/textures/palette_0.jpeg` n’és una textura.
- `pantalla.glb` i `brazo.glb`: models del monitor i del braç en primera persona.
- Els fitxers MP3 de l’arrel contenen la música i els efectes descrits a l’apartat d’àudio.

Els models i els àudios formen part dels recursos necessaris per executar l’experiència. No s’han d’ometre en publicar el projecte. `node_modules/` i `dist/` són carpetes generades i queden excloses per `.gitignore`.

## Personalització

### Contingut de les estacions

Edita la llista `sections` de `src/main.js`. Cada element defineix l’identificador, el número, el títol, el nom i la descripció de l’estació, la posició 3D i el contingut del panell.

Les opcions del menú són a `index.html`. Els seus atributs `data-section` han de coincidir amb els identificadors de `sections`. Els enllaços de GitHub, projectes, contacte i currículum també es poden actualitzar en aquestes dades.

### Models i recursos

Les rutes dels tres models es declaren com a enllaços de precàrrega a `index.html` i s’obtenen des de `src/main.js`. Si es canvia un fitxer o la seva ubicació, cal actualitzar la ruta tant a la precàrrega com a l’aplicació.

Els àudios s’importen des de `src/main.js`. Per substituir-ne un, conserva el seu ús corresponent o actualitza conjuntament el codi que el reprodueix.

### Animacions dels models

De les animacions incloses al model de l’oficina només es reprodueixen els dos clips de gir dels ventiladors. El braç utilitza els clips d’espera i de tret disponibles al seu GLB.

## Compilació i publicació

1. Puja al repositori els fitxers font i els recursos necessaris, inclosos els models, els àudios, la textura i el PDF que vulguis publicar.
2. Instal·la les dependències amb `npm install`.
3. Genera el lloc estàtic amb `npm run build`.
4. Publica el contingut de `dist/` en un allotjament web estàtic compatible.

El projecte no inclou cap servidor d’aplicació: la pàgina es genera com a lloc estàtic. Recorda que els recursos públics d’un desplegament —inclòs el currículum— es poden descarregar des del navegador.
