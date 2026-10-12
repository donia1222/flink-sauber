# Prompts para ChatGPT · DF Flink Sauber

Proyecto: versión interactiva de **flink-sauber.li**, empresa de limpieza de Triesen (Liechtenstein).
Servicios: limpieza de ventanas, de viviendas (Umzugsreinigung mit Abgabegarantie), de oficinas, Hauswartung y alfombras.
Estilo: **limpio, luminoso y de calidad**, con los colores de su logo: **azul marino noche y oro** (las alas doradas),
más blanco, cristal y un toque de azul agua. Luz de mañana, fresca y clara. Nada de anuncio barato de productos de limpieza.

**Hero:** 4 imágenes (la primera ya está; faltan 3 nuevas). **Cuerpo:** 5 tarjetas de servicios.
Además, la web usa **fotos suyas** de su página actual (antes/después, la escalera en las ventanas y el chico del logo en la
terraza); esas no hay que generarlas.

---

## Cómo generarlas (léelo antes de empezar)

1. **Dos conversaciones de ChatGPT**: una para el HERO y otra para el CUERPO. Así mantiene el estilo.
2. **Pega primero el bloque "ESTILO COMÚN"** y después cada prompt, uno a uno y en orden.
3. Desde la segunda imagen de cada serie, **adjunta la imagen anterior** y escribe antes del prompt:
   `Same style, same color palette and lighting as the attached image.`
4. **Formato:** el HERO siempre en **horizontal 16:9**; el CUERPO en **vertical 4:5**. Si sale con otro formato, pide:
   `Make it a wide 16:9 landscape image.` o `Make it a vertical 4:5 portrait image.`
5. **Lo más importante en el hero: el "portal" debe quedar justo en el centro de la imagen.** Es el círculo limpio del
   cristal, la puerta de cristal del fondo o la gota de agua: por ahí entra la cámara. En el móvil solo se ve la franja
   central de la imagen, así que todo lo importante tiene que estar en el centro. Si sale desplazado, pide:
   `Move the [clean circle / glass door / water drop] exactly to the center of the image, keep everything else.`
6. **Nada de texto, letras, logos ni marcas de agua.** Tampoco logos inventados en la ropa. Las personas, de espaldas o de
   lado, sin mirar a cámara.
7. **Guárdala con el nombre exacto** que pone cada prompt, en la carpeta que se indica (`imagenes/hero/` o `imagenes/body/`).

---

## ESTILO COMÚN (pégalo al principio de cada conversación)

```
I am creating a series of images for a premium, interactive website of a professional cleaning company in Liechtenstein. Every image must follow these rules:
- Photorealistic, high-end architectural and interior photography, like a luxury real estate magazine. Crisp, sharp, clean.
- Color palette: bright white, clear glass, soft light grey and pale water blue, with deep midnight navy and small warm gold accents. Fresh, clear morning light. Never yellowish, never dirty-looking, never neon.
- Everything spotless and gleaming: streak-free glass, polished floors with soft reflections, tidy and calm.
- Setting: modern homes and offices in the Alps of Liechtenstein, with mountain views when there is a window.
- Calm, symmetrical composition with plenty of clear space.
- No text, no letters, no logos, no watermarks, no brand names on clothes or products. People only seen from behind or from the side, never looking at the camera.
I will send you the prompts one by one. Reply only with the image.
```

---

## SERIE 1 · HERO (carpeta `imagenes/hero/`, formato 16:9)

El recorrido del inicio, todo sobre limpieza. La web empieza con el cristal **sucio** y una rasqueta lo limpia con el
primer scroll; después la cámara entra por el círculo limpio → un baño reluciente que se está limpiando → por su espejo
redondo, un grifo de cromo con una gota → y por la gota, el equipo terminando un piso impecable.

### `1-fenster.png`, el cristal mojado con un círculo limpio ✔ (ya está, se queda)

### `2-bad.png`, el baño reluciente (NUEVA)
Adjunta `1-fenster.png` y escribe antes `Same style, same color palette and lighting as the attached image.`
```
A bright, spotless, modern bathroom in perfect one-point perspective, completely symmetrical, while it is being cleaned. Light marble walls, a floating white double vanity with gleaming chrome taps, a walk-in shower with crystal-clear, streak-free glass, a polished floor with soft reflections. Exactly in the center of the far wall, above the vanity, a large perfectly round mirror, about 16% of the image width, freshly polished, reflecting only soft bright light. On the left side, a professional cleaner seen from behind in a plain deep navy uniform without logo polishes the shower glass with a squeegee; on the vanity, a folded navy microfiber cloth and a white spray bottle without label; a few fresh water droplets sparkle on the glass. Fresh, sparkling, immaculate. Photorealistic, 16:9 landscape.
```

### `3-armatur.png`, el grifo de cromo con una gota (NUEVA)
```
Extreme close-up of a polished chrome kitchen tap being cleaned: a hand in a plain deep navy sleeve holds a folded white microfiber cloth against the side of the tap, which is perfectly shiny, without any limescale or fingerprints. Exactly in the center of the image, one single crystal-clear water drop hangs from the mouth of the tap, perfectly round, about 10% of the image width, with a bright highlight. Below, a spotless white sink. Background: a softly blurred, clean, bright white kitchen. Sparkling, ultra sharp, luxurious. Photorealistic, 16:9 landscape.
```

### `4-team.png`, el final: el equipo terminando (NUEVA)
```
A bright, spotless, open-plan apartment in clear morning light: a polished light wood floor with soft reflections, a gleaming white kitchen island, streak-free floor-to-ceiling windows. Two professional cleaners in plain deep navy uniforms without logos, seen from behind and from the side, faces not visible, finishing their work: on the left, one cleans a large window with a squeegee; on the right, the other wipes the kitchen island with a microfiber cloth. Between them, a neat, professional cleaning trolley with folded navy and white microfiber cloths, spray bottles without labels and a bucket. The center and the upper half of the image are calm and open, without people. Fresh, satisfying, immaculate. Photorealistic, 16:9 landscape.
```

### `abzieher.png`, el limpiacristales que limpia la pantalla (NUEVA, sin fondo)
Es el que pasa por encima del hero al empezar y lo deja de sucio a limpio. **Tiene que salir con fondo transparente.**
```
A professional window squeegee held by a hand, isolated on a fully transparent background (PNG with alpha), no shadow, no background, no surface. The rubber blade of the squeegee is perfectly vertical, running along the right side of the image from the very top to the very bottom; the blade is black rubber in a polished stainless steel channel with a thin gold detail. The handle comes out of the middle of the blade and goes horizontally to the left, and a hand in a plain deep navy sleeve without logo grips it firmly, the arm leaving the image on the left edge. A few fresh water droplets on the blade. Photorealistic product photography, sharp, soft studio light, vertical 2:3 portrait.
```
Si sale con fondo (blanco o de cuadros dibujados), pide: `Remove the background completely, transparent PNG.`
La goma tiene que ir **recta en vertical y de arriba abajo**, y la mano **a la izquierda**.

Revisa en las tres que lo que hace de portal quede **justo en el centro**: el espejo redondo en `2-bad` y la gota en
`3-armatur`. En `4-team`, que el centro quede libre para el texto. Las personas, a los lados.

---

## SERIE 2 · CUERPO (carpeta `imagenes/body/`, formato vertical 4:5)

Las tarjetas de los servicios. En la web empiezan "sucias" y una rasqueta las limpia con el scroll, así que tienen que
verse **muy limpias y luminosas**. Son cinco: la de alfombras (`teppich.png`) se añadió al quitar la foto de su web.

### `fenster.png`, limpieza de ventanas
```
A professional window cleaner seen from behind, wearing a plain deep navy polo shirt without any logo, cleaning a large floor-to-ceiling glass window with a squeegee, leaving a perfectly streak-free, gleaming surface. Through the glass, a bright view of the Alps in Liechtenstein. Clean modern interior, fresh morning light, a light water mist sparkling in the sun. Photorealistic, vertical 4:5 portrait.
```

### `wohnung.png`, limpieza de vivienda con garantía de entrega
```
An empty, freshly cleaned modern apartment ready for handover: bright white walls, spotless light oak floor with a soft shine, a gleaming white kitchen with clean stainless steel, sunlight through streak-free windows. On the kitchen counter, a small set of house keys with a navy key tag lies neatly next to a folded white microfiber cloth. Calm, perfect, immaculate. Photorealistic, vertical 4:5 portrait, no people.
```

### `buero.png`, limpieza de oficinas
```
A modern, spotless open-plan office in the early evening, after work: clean white desks, tidy chairs, glass walls without a single fingerprint, warm city lights and mountains in the blue hour outside the windows. A cleaner in a plain deep navy uniform without logo, seen from the side and slightly blurred in the background, discreetly wiping a glass partition. Calm, quiet, professional. Photorealistic, vertical 4:5 portrait.
```

### `hauswartung.png`, Hauswartung (cuidado del edificio)
```
The entrance of a well-kept modern apartment building in Liechtenstein on a crisp, sunny winter morning: a freshly cleared, perfectly clean stone path and steps, neatly trimmed snow-covered hedges, a spotless glass entrance door, a wooden bench, and the snowy Alps in the background under a clear blue sky. Fresh, orderly and cared for. Photorealistic, vertical 4:5 portrait, no people.
```

### `teppich.png`, limpieza de alfombras (nueva)
```
Close-up of a professional carpet cleaning machine gliding over a large, soft, light beige wool rug in a bright modern living room. One half of the rug, behind the machine, is visibly fresh, bright and clean; a few fine water droplets catch the morning light. Only the hands and lower arms of the cleaner, in a plain deep navy sleeve without logo, are visible. Light-grey sofa, a navy cushion, mountains through the window in the soft background. Photorealistic, vertical 4:5 portrait.
```

---

## Cuando las tengas

Ponlas en su carpeta con el nombre exacto y avísame. Yo mido el centro de cada portal (el círculo, la puerta y la gota),
las convierto a WebP y ajusto el recorrido. Mientras faltan, la web usa imágenes provisionales con el portal marcado.
