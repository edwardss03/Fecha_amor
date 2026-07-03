// =====================================================================
// CONFIGURACIÓN — Álbum Digital Jesús ❤️ Viviana
// =====================================================================
//
// PARA ACTIVAR SUPABASE:
// 1. Ve a https://supabase.com y crea un proyecto gratis
// 2. Ve a Project Settings > API
// 3. Copia tu URL y anon key aquí abajo
// 4. En Supabase, ejecuta el SQL de la sección "BASE DE DATOS" de abajo
// 5. Crea un Storage Bucket llamado "fotos-album" (público)
//
// =====================================================================

const CONFIG = {
  // --- Supabase (dejar vacío para usar datos locales) ---
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',

  // --- Administrador ---
  ADMIN_PASSWORD: 'qt850f9jb8y',

  // --- Fechas ---
  START_DATE: '2025-07-05', // Fecha de inicio de la relación

  // --- Fotos principales ---
  HERO_PHOTO: 'fotovivi_22.jpg',   // Foto del Hero (cambia al número que quieras)
  FINAL_PHOTO: 'fotovivi_33.jpg',  // Foto de la sección final
};

// =====================================================================
// BASE DE DATOS — SQL para ejecutar en Supabase (solo una vez)
// =====================================================================
/*
CREATE TABLE capitulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  portada TEXT,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capitulo_id UUID REFERENCES capitulos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar acceso público de lectura
ALTER TABLE capitulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública" ON capitulos FOR SELECT USING (estado = 'publicado');
CREATE POLICY "Escritura total" ON capitulos FOR ALL USING (true);
CREATE POLICY "Lectura pública fotos" ON fotos FOR SELECT USING (true);
CREATE POLICY "Escritura total fotos" ON fotos FOR ALL USING (true);
*/

// =====================================================================
// DATOS LOCALES — Se usan cuando Supabase no está configurado
// =====================================================================

const FALLBACK_CHAPTERS = [
  {
    id: '12',
    fecha: '2026-07-05',
    titulo: 'Amor',
    mensaje: `Por fin llego el dia tan esperado amor, feliz primer año juntos mi vida hermosa!!! No sabes las lagrimas que me brotan al escribir este mensaje, le doy gracias a Dios por siempre protegernos y cuidarnos para llegar a este dia tan especial para nosotros. Nunca pense conocer a mi otra mitad a tan temprana edad y que gusto es poder compartir muchas cosas a tu lado, te quiero para toda la vida y quiero que me acompañes por el resto de mis días. Gracias infinitas nuevamente y este es el inicio de muchas aventuras y sueños que cumpliremos juntos. Estare para ti siempre y se que tu tambien para mí. Te amouuu

Psdt: Encontré mi one piece, eres tú mi amor!!!`,
    portada: 'fotovivi_35.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f12a', url: 'fotovivi_35.jpg', orden: 0 },
      { id: 'f12b', url: 'fotovivi_36.jpg', orden: 1 },
      { id: 'f12c', url: 'fotovivi_37.jpg', orden: 2 },
    ]
  },
  {
    id: '11',
    fecha: '2026-06-05',
    titulo: 'dulcecita',
    mensaje: `Amor, ahora si cuenta regresivaaaa, dios que felicidad seguir enamorado como el primer dia contigo mi vida. Que felicidad todo lo que hemos pasado y estoy feliz por que el amor entre nosotros sigue impune y es buenazo querer seguir viviendo todo a tu lado. Ha sido un mes en los cuales seguimos aprendiendo pero ahora actuando de mejor manera, eres todo lo que quiero mi vida bella. Creeme que la sonrisa con la que escribo y como mis ojos se iluminan por pensarte, no lo olvidaré jamás.

Cada camino que hemos tomado y cada situacion con la manera ya sea buena o mala no importa por que terminamos arreglandolo y eso nos vuelve una pareja unida y con ganas de que nuestro amor siga dando todo.

psdt: 11 11 11 de la noche todavia me contestas!!! turururu`,
    portada: 'fotovivi_31.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f11a', url: 'fotovivi_31.jpg', orden: 0 },
      { id: 'f11b', url: 'fotovivi_32.jpg', orden: 1 },
      { id: 'f11c', url: 'fotovivi_33.jpg', orden: 2 },
    ]
  },
  {
    id: '10',
    fecha: '2026-05-05',
    titulo: 'frambuesita',
    mensaje: `Amor, ya son 10 meses juntos y de verdad siento que seguimos igual de emocionados y enamorados como al inicio. Volvimos a viajar, a salir, a disfrutar, y cada momento contigo me confirma que eres la persona con la que quiero vivir todo. Ha sido un mes intenso, con muchas emociones, pero a pesar de todo lo supimos superar porque lo que sentimos es real y fuerte. Sabemos que somos el uno para el otro y que siempre queremos lo mejor para nuestra relación.

Cada experiencia, buena o difícil, nos enseña y nos hace crecer, y sé que en el futuro vamos a aprender aún más de nuestros errores para seguir construyendo algo bonito juntos. Te amo mucho, cada vez más y más cerca del año…

psdt: Completamos los meses con los dedos de las manos jaja`,
    portada: 'fotovivi_28.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f10a', url: 'fotovivi_28.jpg', orden: 0 },
      { id: 'f10b', url: 'fotovivi_29.jpg', orden: 1 },
      { id: 'f10c', url: 'fotovivi_30.jpg', orden: 2 },
    ]
  },
  {
    id: '9',
    fecha: '2026-04-05',
    titulo: 'kekito',
    mensaje: `Amor, 9 meses y creeeme que la felicidad que tengo es demasiada, mi amor aumenta cada día más y no puedo evitar sentirme tan afortunado de tenerte a mi lado. Agradezco cada momento que compartimos, cada risa, cada abrazo y cada conversación profunda que tenemos. Eres mi compañera de vida, mi confidente, mi mejor amiga y no puedo imaginar mi futuro sin ti.

Estoy emocionado por todo lo que aún nos espera, por los sueños que vamos a cumplir juntos y por seguir construyendo esta hermosa historia de amor que tenemos. Te amo con todo mi corazón y cada día me enamoro más de ti.

psdt: 9 mesesotes y la vida me sigue regalando una sonrisa`,
    portada: 'fotovivi_25.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f9a', url: 'fotovivi_25.jpg', orden: 0 },
      { id: 'f9b', url: 'fotovivi_26.jpg', orden: 1 },
      { id: 'f9c', url: 'fotovivi_27.jpg', orden: 2 },
    ]
  },
  {
    id: '8',
    fecha: '2026-03-05',
    titulo: 'Panquequito',
    mensaje: `Amor, ya son 8 meses juntos!!! Nuestro viaje a Paracas fue algo muy especial porque fue nuestro primer viaje juntos, y sé que será el primero de muchísimos más que viviremos. Cada momento contigo se queda guardado en mi corazón y lo sabes...

Aquella noche en el mar fue un momento muy especial para mí, pasaron semanas tensas y tú estuviste ahí apoyándome, dándome tranquilidad sin dudarlo. Ese momento me hizo confirmar una vez más todo el amor que siento por ti y lo importante que eres en mi vida.

Gracias por esto tan lindo que tenemos mi amor. Te amo mucho y quiero seguir construyendo más recuerdos contigo.

psdt: Me imagino cada día contigo, cada momento perfecto que vivimos juntos.`,
    portada: 'fotovivi_22.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f8a', url: 'fotovivi_22.jpg', orden: 0 },
      { id: 'f8b', url: 'fotovivi_23.jpg', orden: 1 },
      { id: 'f8c', url: 'fotovivi_24.jpg', orden: 2 },
    ]
  },
  {
    id: '7',
    fecha: '2026-02-05',
    titulo: 'Morenita',
    mensaje: `Amor, oficialmente ya vamos 7 meses y sigo sin creer lo rápido que pasó todo. Aunque últimamente estemos full y nos veamos un poco menos, siempre encontramos la forma de estar juntos, aunque sea con llamadas, mensajes o esas bolitas de WhatsApp que ya son parte de lo nuestro.

Se que hemos tenido cositas ahi no tan chiditas pero al final la felicidad gana, hemos madurado, bueno tu mas que yo pero igual creeme que seguire dando todo, porque los dos queremos seguir mejorando. Los meses no cuadran con lo que sentimos, porque a tu lado parece que llevamos muchísimo más tiempo.

Te amo con todo mi corazón y solo quiero que sigan viniendo más meses lindos, más risas y un verano muuuy bonito contigo.

psdt: 7 meses contigo y todavía siento que quiero elegirte todos los días.`,
    portada: 'fotovivi_19.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f7a', url: 'fotovivi_19.jpg', orden: 0 },
      { id: 'f7b', url: 'fotovivi_20.jpg', orden: 1 },
      { id: 'f7c', url: 'fotovivi_21.jpg', orden: 2 },
    ]
  },
  {
    id: '6',
    fecha: '2026-01-05',
    titulo: 'Rocotita',
    mensaje: `Seis meses y parecen más, vas pa tu casa y ya te echo de menos. Los girasoles no tenían sentido, pero ya lo tienen desde que nos vemos. Que increible como el tiempo es tan distinto a lo que imaginé, empezar el año a tu lado se me hace tan especial y único que solo me queda decirle gracias a la vida por este sentimiento llamado "amor", xq si Viviana, siento amor, amor del bueno y es un amor único que nunca en la vida he sentido y me hace tan feliz el dar a conocer este sentimiento contigo.

Finalizamos el 2025 de la mejor manera, diciembre fue una locura y pasarla a tu lado se me hace tan alegre y divertido, me sacas tantas sonrisas que solo quiero vivir para despertarme y darme cuenta que no es un sueño, que realmente estoy viviendo un cariño único.

Me encanta cada parte de ti, soy fanático de tu locura y cómo te ves en ropita interior. Y aunque mides poco, nadie está a tu altura. No eres la primera, pero sí mi único amor. Un pedacito de lo que siento te lo digo con esta canción. Te amo y feliz año nuevo bb.

psdt: Dijiste que arreglé tus daños y tú sin darte cuenta, me curaste igual...`,
    portada: 'fotovivi_16.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f6a', url: 'fotovivi_16.jpg', orden: 0 },
      { id: 'f6b', url: 'fotovivi_18.jpg', orden: 1 },
      { id: 'f6c', url: 'fotovivi_17.jpg', orden: 2 },
    ]
  },
  {
    id: '5',
    fecha: '2025-12-05',
    titulo: 'Cosita',
    mensaje: `Amor, ya son 5 meses y siento que cada día a tu lado me hace más feliz. Fuimos al bingo y casi ganamos... no tan casi jaja, pero igual la pasé increíble contigo.

Hicimos nuestras cositas de chavos uwu, fuimos a los cumpleaños y reus de tus amigos, y me encantó sentirme tan cómodo, como si de verdad ya fuera parte de tu mundo.

Bueno... ya lo soy pero aun así me hace feliz que todos sepan que estamos juntos y que vivamos algo tan bonito. Se que hemos tenido discusiones, pero siempre lo superamos porque los dos queremos un futuro juntos y mejorar siempre. Te amo mucho mi amor y sigo enamorado como el primer día, incluso más. Asi que vamos por más.

psdt: Eres mi todo!!!`,
    portada: 'fotovivi_13.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f5a', url: 'fotovivi_13.jpg', orden: 0 },
      { id: 'f5b', url: 'fotovivi_14.jpg', orden: 1 },
      { id: 'f5c', url: 'fotovivi_15.jpg', orden: 2 },
    ]
  },
  {
    id: '4',
    fecha: '2025-11-05',
    titulo: 'Ricurita',
    mensaje: `Amor, hoy cumplimos 4 meses y de verdad siento que ha sido un camino lleno de momentos increíbles. Hemos tenido risas, peleitas, abrazos y hasta nuestro primer Halloween juntos, y cada cosa contigo ha sido especial. Aún pienso en mi cumple y en lo hermoso que fue todo lo que hiciste por mí: la sorpresa, llevarme a comer mi comida favorita y ese perfume que tanto quería.

Me hiciste sentir la persona más afortunada del mundo. Gracias por hacerme sentir tan especial, por tu cariño y por todo lo que compartimos día a día. Contigo todo se siente más bonito, más real y más nuestro. Te amo y me emociona todo lo que aún nos falta vivir juntos.

psdt: Te amodoro con todo mi cocoro!!!`,
    portada: 'fotovivi_12.JPG',
    estado: 'publicado',
    fotos: [
      { id: 'f4a', url: 'fotovivi_12.JPG', orden: 0 },
      { id: 'f4b', url: 'fotovivi_10.jpg', orden: 1 },
      { id: 'f4c', url: 'fotovivi_11.jpg', orden: 2 },
    ]
  },
  {
    id: '3',
    fecha: '2025-10-05',
    titulo: 'Marmoleadota',
    mensaje: `Gear third jiji, asuuu amor la verdad es que cada dia que pasa es increible porque se que te tengo a mi lado y eso me hace sentir muy feliz. Me encanta esta conexión que tenemos y que se sigue sincronizando.

Gracias por apoyarme en mis momentos difíciles, por ser mi hombro cuando más te necesité y por estar siempre ahí con amor y comprensión. Me haces sentir en casa cada vez que estoy contigo. Tres meses parecen poco, pero contigo el tiempo se siente infinito. Te amo con todo mi corazón y me emociona seguir construyendo todo esto juntos.

Vamos por más mi kekito Marmoleado!!!`,
    portada: 'fotovivi_7.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f3a', url: 'fotovivi_7.jpg', orden: 0 },
      { id: 'f3b', url: 'fotovivi_8.jpg', orden: 1 },
      { id: 'f3c', url: 'fotovivi_9.jpg', orden: 2 },
    ]
  },
  {
    id: '2',
    fecha: '2025-09-05',
    titulo: 'Hermosota',
    mensaje: `Amor, 2 mesesitos y no puedo dejar de pensar en todo lo bonito que vivimos en este tiempo. Cada momento a tu lado ha sido especial. Recuerdo cuando volviste de Brasil, moría por verte y sentirte cerca otra vez.

Gracias por todo lo que me das y lo que me ofreces, por tu paciencia, tu ternura y por enseñarme tanto. Me encanta cómo me entiendes y quiero que sepas que siempre voy a estar para apoyarte y crecer juntos. A veces siento que ya llevamos años, pero recién van 2 meses y ya se siente demasiado grande lo que tenemos. Te amo con todo mi corazón y me emociona pensar en todo lo que aún nos espera.

psdt: Te adoro como el primer día!!!`,
    portada: 'fotovivi_4.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f2a', url: 'fotovivi_4.jpg', orden: 0 },
      { id: 'f2b', url: 'fotovivi_5.jpg', orden: 1 },
      { id: 'f2c', url: 'fotovivi_6.jpg', orden: 2 },
    ]
  },
  {
    id: '1',
    fecha: '2025-08-05',
    titulo: 'Amorsote',
    mensaje: `Mi amor bello sabes las ganas que tenia de estar contigo y no me pude esperar para pedirtelo de manera oficial, en tan poco tiempo me has llenado de tantas emociones que para mi el significado de amar a alguien se me queda pequeño. Eres mi persona favorita y quiero que seas la unica en mi futuro.

Es inexplicable como recien vamos 1 mes pero literal siento que llevamos muchisimo tiempo, es como si te conociera de toda la vida y la conexión que tenemos es única y especial. Agradezco mucho a la vida por darme la oportunidad de tenerme a tu lado.

psdt: Eres muuuuy linda!!!`,
    portada: 'fotovivi_1.jpg',
    estado: 'publicado',
    fotos: [
      { id: 'f1a', url: 'fotovivi_1.jpg', orden: 0 },
      { id: 'f1b', url: 'fotovivi_2.jpg', orden: 1 },
      { id: 'f1c', url: 'fotovivi_3.jpg', orden: 2 },
    ]
  },
];
