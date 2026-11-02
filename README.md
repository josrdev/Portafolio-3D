# Portafolis 3D

Experiència web interactiva construïda amb A-Frame, Three.js i Vite. L'escena inclou una oficina 3D, un monitor i un braç animat.

## Requisits i execució

Cal tenir Node.js i npm instal·lats. Des de l'arrel del projecte:

```bash
npm install
npm run dev
```

Per generar i previsualitzar la versió de producció:

```bash
npm run build
npm run preview
```

## Controls

- **WASD** o les fletxes: moure's.
- **Ratolí**: mirar. Si el navegador no permet bloquejar el punter, arrossega l'escena. Prem `Esc` per alliberar el punter.
- **E**: obrir l'estació enfocada.
- **L**: encendre o apagar la llanterna.
- **Mòbil o tauleta**: arrossegar per mirar i mantenir premuts els controls de moviment.
- El menú de seccions permet obrir qualsevol secció sense desplaçar-se fins a l'estació.
- **Reduir moviment** atenua les animacions; també es respecta la preferència del sistema operatiu.

En entrar al recorregut es mostra durant uns vuit segons una benvinguda HUD. El model 3D continua visible al fons, mentre que els panells de navegació i ubicació s'amaguen temporalment.

## Àudio i introducció

La introducció cinematogràfica utilitza `diamond_tunes-cinematic-sound-effect-327618.mp3`. La seva animació i les fases de càrrega es basen en el temps real de reproducció, els atacs mesurats i les freqüències analitzades amb Web Audio API. Quan acaba la pista, la pantalla de càrrega s'esvaeix.

Els navegadors poden bloquejar la reproducció automàtica. Si passa, l'àudio comença amb la primera interacció de l'usuari. `ambiente.mp3` acompanya la càrrega dels models i es reprodueix en bucle durant l'exploració. El botó de so controla la música i els efectes; el fitxer `47313572-ui-sounds-pack-2-sound-5-358890.mp3` s'utilitza en obrir un panell.

## Estructura del projecte

- `index.html`: estructura de la interfície, l'escena A-Frame i la precàrrega dels models.
- `src/main.js`: contingut, càrrega dels models, àudio, controls, col·lisions i animacions.
- `src/style.css`: estils, animacions i disseny adaptable.
- `public/` i els fitxers GLB: recursos estàtics i models 3D.

## Funcions principals

- `sections`: dades de les estacions, com ara el text, la posició i el contingut dels panells.
- `makeStation`: crea el marcador 3D i l'etiqueta de cada secció.
- `loadRoom`, `loadScreen` i `loadArm`: carreguen l'escenari, el monitor i el braç.
- `createMusicAudio`, `setSoundEnabled` i `updateMusicVisuals`: configuren els canals d'àudio i actualitzen els efectes visuals.
- `movePlayer`, `applyGravity` i `isMovementBlocked`: gestionen el moviment, la gravetat i les col·lisions.
- `openSection` i `closePanel`: obren i tanquen els panells de contingut.
- `renderFrame`: actualitza l'escena i els elements animats a cada fotograma.

Per editar el contingut, modifica `sections` a `src/main.js`. Les etiquetes del menú són a `index.html`; els seus atributs `data-section` han de coincidir amb els identificadors de les seccions.

L'oficina reprodueix només els dos clips de gir dels ventiladors inclosos al GLB. Les rutes dels models es declaren a `index.html` i s'utilitzen des de `src/main.js`.
