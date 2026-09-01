import type { Locale } from "./books";
import type { Chapter } from "./types";

/**
 * Conventional NT section titles for when the ESV HTML headings are
 * missing (WEB fallback, seed, Spanish). Not a Crossway dump — used only
 * to keep the page from reading as an unbroken column.
 *
 * Key: BOOK.chapter.verse
 */
const RAW = `
MAT
1.1 The Genealogy of Jesus Christ | Genealogía de Jesucristo
1.18 The Birth of Jesus Christ | Nacimiento de Jesucristo
2.1 The Visit of the Wise Men | La visita de los magos
2.13 The Flight to Egypt | La huida a Egipto
2.16 Herod Kills the Children | Herodes mata a los niños
2.19 The Return to Nazareth | El regreso a Nazaret
3.1 John the Baptist Prepares the Way | Juan el Bautista prepara el camino
3.13 The Baptism of Jesus | El bautismo de Jesús
4.1 The Temptation of Jesus | La tentación de Jesús
4.12 Jesus Begins His Ministry | Jesús comienza su ministerio
4.18 Jesus Calls the First Disciples | Jesús llama a los primeros discípulos
5.1 The Sermon on the Mount | El Sermón del Monte
5.3 The Beatitudes | Las Bienaventuranzas
5.13 Salt and Light | Sal y luz
5.17 Christ Came to Fulfill the Law | Cristo vino a cumplir la ley
6.1 Giving to the Needy | Dar a los necesitados
6.5 The Lord’s Prayer | El Padrenuestro
6.16 Fasting | El ayuno
6.19 Treasure in Heaven | Tesoro en el cielo
7.1 Judging Others | No juzguéis
7.7 Ask, Seek, Knock | Pedid, buscad, llamad
7.15 A Tree and Its Fruit | El árbol y su fruto
7.24 The Wise and Foolish Builders | Los dos cimientos
8.1 Jesus Cleanses a Leper | Jesús limpia a un leproso
8.5 The Faith of a Centurion | La fe del centurión
8.14 Jesus Heals Many | Jesús sana a muchos
8.23 Jesus Calms a Storm | Jesús calma la tormenta
8.28 Jesus Heals Two Men with Demons | Los endemoniados gadarenos
9.1 Jesus Heals a Paralytic | Jesús sana a un paralítico
9.9 Jesus Calls Matthew | Jesús llama a Mateo
9.18 A Girl Restored and a Woman Healed | La hija de Jairo y la mujer
9.35 The Harvest Is Plentiful | La mies es mucha
10.1 The Twelve Apostles | Los doce apóstoles
11.1 Messengers from John the Baptist | Los mensajeros de Juan
11.25 Come to Me | Venid a mí
12.1 Jesus Is Lord of the Sabbath | Señor del sábado
13.1 The Parable of the Sower | Parábola del sembrador
13.24 The Weeds | El trigo y la cizaña
13.31 The Mustard Seed and the Leaven | El grano de mostaza y la levadura
14.13 Jesus Feeds the Five Thousand | La alimentación de los cinco mil
14.22 Jesus Walks on the Water | Jesús anda sobre el agua
16.13 Peter Confesses Jesus as the Christ | La confesión de Pedro
16.21 Jesus Foretells His Death | Jesús anuncia su muerte
17.1 The Transfiguration | La transfiguración
18.1 Who Is the Greatest? | ¿Quién es el mayor?
18.21 The Unforgiving Servant | El siervo inmisericorde
19.16 The Rich Young Man | El joven rico
21.1 The Triumphal Entry | La entrada triunfal
21.12 Jesus Cleanses the Temple | Jesús limpia el templo
22.15 Paying Taxes to Caesar | El tributo a César
22.34 The Great Commandment | El gran mandamiento
24.1 Signs of the End of the Age | Señales del fin
25.1 The Ten Virgins | Las diez vírgenes
25.14 The Parable of the Talents | Parábola de los talentos
25.31 The Final Judgment | El juicio final
26.17 The Passover with the Disciples | La Pascua
26.26 Institution of the Lord’s Supper | La Cena del Señor
26.36 Jesus in Gethsemane | Getsemaní
26.47 Betrayal and Arrest | La traición y el arresto
26.69 Peter Denies Jesus | Pedro niega a Jesús
27.1 Jesus Delivered to Pilate | Jesús ante Pilato
27.32 The Crucifixion | La crucifixión
27.57 Jesus Is Buried | La sepultura
28.1 The Resurrection | La resurrección
28.16 The Great Commission | La gran comisión

MRK
1.1 John the Baptist Prepares the Way | Juan el Bautista prepara el camino
1.9 The Baptism of Jesus | El bautismo de Jesús
1.12 The Temptation of Jesus | La tentación de Jesús
1.14 Jesus Begins His Ministry | Jesús comienza su ministerio
1.16 Jesus Calls the First Disciples | Jesús llama a los primeros discípulos
1.21 Jesus Heals a Man with an Unclean Spirit | Un espíritu inmundo
1.29 Jesus Heals Many | Jesús sana a muchos
1.40 Jesus Cleanses a Leper | Jesús limpia a un leproso
2.1 Jesus Heals a Paralytic | Jesús sana a un paralítico
2.13 Jesus Calls Levi | Jesús llama a Leví
2.23 Jesus Is Lord of the Sabbath | Señor del sábado
3.13 The Twelve Apostles | Los doce apóstoles
4.1 The Parable of the Sower | Parábola del sembrador
4.35 Jesus Calms a Storm | Jesús calma la tormenta
5.1 Jesus Heals a Man with a Demon | El endemoniado geraseno
5.21 Jairus’s Daughter and a Woman Healed | La hija de Jairo
6.30 Jesus Feeds the Five Thousand | La alimentación de los cinco mil
6.45 Jesus Walks on the Water | Jesús anda sobre el agua
8.27 Peter Confesses Jesus as the Christ | La confesión de Pedro
9.2 The Transfiguration | La transfiguración
10.17 The Rich Young Man | El joven rico
11.1 The Triumphal Entry | La entrada triunfal
11.15 Jesus Cleanses the Temple | Jesús limpia el templo
12.28 The Great Commandment | El gran mandamiento
13.1 Signs of the End of the Age | Señales del fin
14.12 The Passover with the Disciples | La Pascua
14.22 Institution of the Lord’s Supper | La Cena del Señor
14.32 Jesus in Gethsemane | Getsemaní
14.43 Betrayal and Arrest | La traición y el arresto
15.1 Jesus Before Pilate | Jesús ante Pilato
15.21 The Crucifixion | La crucifixión
15.42 Jesus Is Buried | La sepultura
16.1 The Resurrection | La resurrección

LUK
1.1 Dedication to Theophilus | Dedicatoria a Teófilo
1.5 Birth of John the Baptist Foretold | Anuncio del nacimiento de Juan
1.26 Birth of Jesus Foretold | Anuncio del nacimiento de Jesús
1.39 Mary Visits Elizabeth | María visita a Elisabet
1.46 Mary’s Song | El Magnificat
1.57 The Birth of John the Baptist | Nacimiento de Juan
2.1 The Birth of Jesus Christ | Nacimiento de Jesús
2.8 The Shepherds and the Angels | Los pastores y los ángeles
2.22 Jesus Presented at the Temple | Jesús presentado en el templo
2.41 The Boy Jesus in the Temple | El niño Jesús en el templo
3.1 John the Baptist Prepares the Way | Juan el Bautista prepara el camino
3.21 The Baptism of Jesus | El bautismo de Jesús
4.1 The Temptation of Jesus | La tentación de Jesús
4.16 Jesus Rejected at Nazareth | Jesús rechazado en Nazaret
5.1 Jesus Calls the First Disciples | Jesús llama a los primeros discípulos
6.20 The Beatitudes | Las Bienaventuranzas
7.1 The Faith of a Centurion | La fe del centurión
8.4 The Parable of the Sower | Parábola del sembrador
8.22 Jesus Calms a Storm | Jesús calma la tormenta
9.10 Jesus Feeds the Five Thousand | La alimentación de los cinco mil
9.18 Peter Confesses Jesus as the Christ | La confesión de Pedro
9.28 The Transfiguration | La transfiguración
10.25 The Good Samaritan | El buen samaritano
11.1 The Lord’s Prayer | El Padrenuestro
12.22 Do Not Be Anxious | No os afanéis
15.1 The Lost Sheep | La oveja perdida
15.11 The Prodigal Son | El hijo pródigo
18.9 The Pharisee and the Tax Collector | El fariseo y el publicano
18.18 The Rich Ruler | El gobernante rico
19.1 Jesus and Zacchaeus | Zaqueo
19.28 The Triumphal Entry | La entrada triunfal
22.7 The Passover with the Disciples | La Pascua
22.14 Institution of the Lord’s Supper | La Cena del Señor
22.39 Jesus in Gethsemane | Getsemaní
22.47 Betrayal and Arrest | La traición y el arresto
23.1 Jesus Before Pilate | Jesús ante Pilato
23.26 The Crucifixion | La crucifixión
23.50 Jesus Is Buried | La sepultura
24.1 The Resurrection | La resurrección
24.13 The Road to Emmaus | El camino a Emaús
24.36 Jesus Appears to His Disciples | Jesús se aparece a los discípulos

JHN
1.1 The Word Became Flesh | El Verbo se hizo carne
1.19 The Testimony of John the Baptist | El testimonio de Juan el Bautista
1.29 Behold, the Lamb of God | He aquí el Cordero de Dios
1.35 Jesus Calls the First Disciples | Jesús llama a los primeros discípulos
1.43 Jesus Calls Philip and Nathanael | Jesús llama a Felipe y a Natanael
2.1 The Wedding at Cana | Las bodas de Caná
2.13 Jesus Cleanses the Temple | Jesús limpia el templo
3.1 You Must Be Born Again | Debéis nacer de nuevo
3.16 For God So Loved the World | De tal manera amó Dios al mundo
4.1 Jesus and the Woman of Samaria | La mujer samaritana
5.1 The Healing at the Pool | La curación en Betesda
6.1 Jesus Feeds the Five Thousand | La alimentación de los cinco mil
6.16 Jesus Walks on Water | Jesús anda sobre el agua
6.22 I Am the Bread of Life | Yo soy el pan de vida
7.1 Jesus at the Feast of Booths | Jesús en la fiesta de los tabernáculos
8.12 I Am the Light of the World | Yo soy la luz del mundo
9.1 Jesus Heals a Man Born Blind | El ciego de nacimiento
10.1 I Am the Good Shepherd | Yo soy el buen pastor
11.1 The Death of Lazarus | La muerte de Lázaro
11.38 Jesus Raises Lazarus | Jesús resucita a Lázaro
12.12 The Triumphal Entry | La entrada triunfal
13.1 Jesus Washes the Disciples’ Feet | Jesús lava los pies de los discípulos
14.1 I Am the Way, the Truth, and the Life | Yo soy el camino, la verdad y la vida
15.1 I Am the True Vine | Yo soy la vid verdadera
16.16 Your Sorrow Will Turn into Joy | Vuestra tristeza se convertirá en gozo
17.1 The High Priestly Prayer | La oración sacerdotal
18.1 Betrayal and Arrest of Jesus | La traición y el arresto
18.28 Jesus Before Pilate | Jesús ante Pilato
19.16 The Crucifixion | La crucifixión
19.38 Jesus Is Buried | La sepultura
20.1 The Resurrection | La resurrección
20.19 Jesus Appears to the Disciples | Jesús se aparece a los discípulos
20.24 Jesus and Thomas | Jesús y Tomás
21.1 Jesus Appears to Seven Disciples | Jesús se aparece a siete discípulos
21.15 Jesus and Peter | Jesús y Pedro

ACT
1.1 The Promise of the Holy Spirit | La promesa del Espíritu Santo
1.12 Matthias Chosen | Matías es elegido
2.1 The Coming of the Holy Spirit | La venida del Espíritu Santo
2.14 Peter’s Sermon at Pentecost | El sermón de Pedro en Pentecostés
3.1 The Lame Beggar Healed | El cojo de la puerta Hermosa
4.1 Peter and John Before the Council | Pedro y Juan ante el concilio
7.1 Stephen’s Speech | El discurso de Esteban
8.26 Philip and the Ethiopian | Felipe y el etíope
9.1 The Conversion of Saul | La conversión de Saulo
10.1 Peter and Cornelius | Pedro y Cornelio
13.1 Barnabas and Saul Sent Off | Bernabé y Saulo enviados
15.1 The Jerusalem Council | El concilio de Jerusalén
16.6 The Macedonian Call | La visión macedonia
16.25 Paul and Silas in Prison | Pablo y Silas en la cárcel
17.16 Paul in Athens | Pablo en Atenas
18.1 Paul in Corinth | Pablo en Corinto
19.1 Paul in Ephesus | Pablo en Éfeso
27.1 Paul Sails for Rome | Pablo navega a Roma
28.11 Paul Arrives at Rome | Pablo llega a Roma

ROM
1.1 Greeting | Saludo
1.16 The Righteous Shall Live by Faith | El justo por la fe vivirá
1.18 God’s Wrath on Unrighteousness | La ira de Dios
3.21 The Righteousness of God Through Faith | La justicia de Dios por la fe
4.1 Abraham Justified by Faith | Abraham justificado por la fe
5.1 Peace with God | Paz con Dios
6.1 Dead to Sin, Alive to God | Muertos al pecado
8.1 Life in the Spirit | Vida en el Espíritu
8.28 More Than Conquerors | Más que vencedores
9.1 God’s Sovereign Choice | La soberanía de Dios
12.1 A Living Sacrifice | Un sacrificio vivo
13.1 Submission to Authorities | Sujeción a las autoridades
15.14 Paul’s Ministry | El ministerio de Pablo

1CO
1.1 Greeting | Saludo
1.10 Divisions in the Church | Divisiones en la iglesia
2.1 Proclaiming Christ Crucified | Cristo crucificado
13.1 The Way of Love | El camino del amor
15.1 The Resurrection of Christ | La resurrección de Cristo
15.12 The Resurrection of the Dead | La resurrección de los muertos
16.1 The Collection for the Saints | La ofrenda para los santos

2CO
1.1 Greeting | Saludo
4.1 The Light of the Gospel | La luz del evangelio
5.16 The Ministry of Reconciliation | El ministerio de la reconciliación
12.1 Paul’s Visions and His Thorn | El aguijón en la carne

GAL
1.1 Greeting | Saludo
2.15 Justified by Faith | Justificados por la fe
5.1 Freedom in Christ | Libertad en Cristo
5.16 Walk by the Spirit | Andad por el Espíritu

EPH
1.1 Greeting | Saludo
2.1 By Grace Through Faith | Por gracia sois salvos
4.1 Unity in the Body | Unidad en el cuerpo
5.22 Wives and Husbands | Esposas y esposos
6.10 The Whole Armor of God | Toda la armadura de Dios

PHP
1.1 Greeting | Saludo
2.1 Christ’s Example of Humility | El ejemplo de Cristo
4.4 Rejoice in the Lord | Gozaos en el Señor

COL
1.1 Greeting | Saludo
1.15 The Preeminence of Christ | La preeminencia de Cristo
3.1 Put On the New Self | Vestíos del nuevo hombre

1TH
1.1 Greeting | Saludo
4.13 The Coming of the Lord | La venida del Señor

2TH
1.1 Greeting | Saludo
2.1 The Man of Lawlessness | El hombre de pecado

1TI
1.1 Greeting | Saludo
3.1 Qualifications for Overseers | Requisitos de los obispos
6.11 Fight the Good Fight | Pelea la buena batalla

2TI
1.1 Greeting | Saludo
3.16 All Scripture Is Breathed Out by God | Toda la Escritura es inspirada
4.1 Preach the Word | Predica la palabra

TIT
1.1 Greeting | Saludo
2.11 The Grace of God Has Appeared | La gracia de Dios se ha manifestado

PHM
1.1 Greeting | Saludo

HEB
1.1 The Supremacy of God’s Son | La supremacía del Hijo
2.1 Warning Against Neglect | Advertencia contra el descuido
4.14 Jesus the Great High Priest | Jesús el gran sumo sacerdote
11.1 By Faith | Por la fe
12.1 Jesus, Founder and Perfecter of Our Faith | Jesús, autor y consumador

JAS
1.1 Greeting | Saludo
1.19 Hearing and Doing the Word | Sed hacedores de la palabra
2.14 Faith Without Works | La fe sin obras
3.1 Taming the Tongue | La lengua

1PE
1.1 Greeting | Saludo
2.4 A Living Stone | Piedra viva
5.1 Shepherd the Flock | Apacentad la grey

2PE
1.1 Greeting | Saludo
1.16 Christ’s Glory and the Prophetic Word | La gloria de Cristo
3.1 The Day of the Lord Will Come | El día del Señor

1JN
1.1 The Word of Life | La Palabra de vida
4.7 God Is Love | Dios es amor

2JN
1.1 Greeting | Saludo

3JN
1.1 Greeting | Saludo

JUD
1.1 Greeting | Saludo

REV
1.1 Prologue | Prólogo
1.9 A Vision of the Son of Man | Visión del Hijo del Hombre
2.1 To the Church in Ephesus | A la iglesia en Éfeso
4.1 The Throne in Heaven | El trono en el cielo
5.1 The Scroll and the Lamb | El libro y el Cordero
6.1 The Seven Seals | Los siete sellos
8.1 The Seven Trumpets | Las siete trompetas
12.1 The Woman and the Dragon | La mujer y el dragón
19.11 The Rider on a White Horse | El jinete del caballo blanco
20.1 The Thousand Years | Los mil años
21.1 The New Heaven and the New Earth | Cielo nuevo y tierra nueva
22.1 The River of Life | El río de agua de vida
`;

const INDEX = new Map<string, { en: string; es: string }>();

let book = "";
for (const line of RAW.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  if (/^[A-Z0-9]{2,3}$/.test(trimmed)) {
    book = trimmed;
    continue;
  }
  const m = trimmed.match(/^(\d+)\.(\d+)\s+(.+?)\s+\|\s+(.+)$/);
  if (!m || !book) continue;
  const key = `${book}.${m[1]}.${m[2]}`;
  if (INDEX.has(key)) continue;
  INDEX.set(key, { en: m[3], es: m[4] });
}

const EXTRA = `
MAT
5.21 Anger | La ira
5.27 Lust | El adulterio del corazón
5.33 Oaths | Los juramentos
5.38 Retaliation | El otro carrillo
5.43 Love Your Enemies | Amad a vuestros enemigos
8.18 The Cost of Following Jesus | El costo de seguir a Jesús
11.20 Woe to Unrepentant Cities | Ay de las ciudades impenitentes
12.15 God’s Chosen Servant | El siervo elegido
12.22 Blasphemy Against the Holy Spirit | Blasfemia contra el Espíritu
12.38 The Sign of Jonah | La señal de Jonás
13.44 The Hidden Treasure | El tesoro escondido
13.53 Jesus Rejected at Nazareth | Jesús rechazado en Nazaret
14.1 The Death of John the Baptist | Muerte de Juan el Bautista
15.1 Traditions and Commandments | Tradiciones y mandamientos
15.21 The Canaanite Woman | La mujer cananea
16.1 The Pharisees Demand a Sign | La señal del cielo
18.10 The Parable of the Lost Sheep | La oveja perdida
19.1 Teaching About Divorce | Enseñanza sobre el divorcio
20.1 Laborers in the Vineyard | Los obreros de la viña
20.17 Jesus Foretells His Death a Third Time | Jesús anuncia su muerte
20.29 Jesus Heals Two Blind Men | Dos ciegos
21.23 The Authority of Jesus | La autoridad de Jesús
22.1 The Parable of the Wedding Feast | La fiesta de bodas
23.1 Seven Woes to the Scribes | Ay de los escribas
24.36 No One Knows That Day and Hour | Nadie sabe el día ni la hora
26.1 The Plot to Kill Jesus | El complot para matar a Jesús
26.6 Jesus Anointed at Bethany | Jesús ungido en Betania
27.11 Jesus Before Pilate | Jesús ante Pilato
27.45 The Death of Jesus | La muerte de Jesús
28.11 The Report of the Guard | El informe de la guardia

MRK
3.1 A Man with a Withered Hand | El hombre de la mano seca
3.20 Blasphemy Against the Holy Spirit | Blasfemia contra el Espíritu
6.1 Jesus Rejected at Nazareth | Jesús rechazado en Nazaret
6.14 The Death of John the Baptist | Muerte de Juan el Bautista
7.1 Traditions and Commandments | Tradiciones y mandamientos
7.24 The Syrophoenician Woman | La mujer sirofenicia
8.1 Jesus Feeds the Four Thousand | La alimentación de los cuatro mil
8.11 The Pharisees Demand a Sign | La señal del cielo
8.22 Jesus Heals a Blind Man at Bethsaida | El ciego de Betsaida
9.14 Jesus Heals a Boy with an Unclean Spirit | El muchacho endemoniado
9.30 Jesus Foretells His Death | Jesús anuncia su muerte
10.1 Teaching About Divorce | Enseñanza sobre el divorcio
10.32 Jesus Foretells His Death a Third Time | Jesús anuncia su muerte
10.46 Jesus Heals Blind Bartimaeus | Bartimeo el ciego
11.27 The Authority of Jesus | La autoridad de Jesús
12.1 The Parable of the Tenants | Los labradores malvados
12.13 Paying Taxes to Caesar | El tributo a César
12.41 The Widow’s Offering | La ofrenda de la viuda
13.24 The Coming of the Son of Man | La venida del Hijo del Hombre
14.1 The Plot to Kill Jesus | El complot para matar a Jesús
14.53 Jesus Before the Council | Jesús ante el concilio
15.16 Jesus Is Mocked | Jesús es escarnecido
16.9 Jesus Appears to Mary Magdalene | Jesús se aparece a María Magdalena

LUK
4.31 Jesus Heals a Man with an Unclean Spirit | Un espíritu inmundo
5.12 Jesus Cleanses a Leper | Jesús limpia a un leproso
5.17 Jesus Heals a Paralytic | Jesús sana a un paralítico
6.1 Jesus Is Lord of the Sabbath | Señor del sábado
6.12 The Twelve Apostles | Los doce apóstoles
7.11 Jesus Raises a Widow’s Son | El hijo de la viuda de Naín
7.36 A Sinful Woman Forgiven | La pecadora perdonada
8.26 Jesus Heals a Man with a Demon | El endemoniado geraseno
8.40 Jairus’s Daughter and a Woman Healed | La hija de Jairo
9.1 Jesus Sends Out the Twelve | Envío de los doce
9.37 Jesus Heals a Boy with an Unclean Spirit | El muchacho endemoniado
9.51 A Samaritan Village Rejects Jesus | Una aldea samaritana
10.1 Jesus Sends Out the Seventy-Two | Envío de los setenta y dos
10.38 Martha and Mary | Marta y María
11.14 Jesus and Beelzebul | Jesús y Beelzebú
12.1 Beware of the Leaven of the Pharisees | La levadura de los fariseos
13.10 A Woman with a Disabling Spirit | La mujer encorvada
14.1 Healing of a Man on the Sabbath | Curación en sábado
16.19 The Rich Man and Lazarus | El rico y Lázaro
17.11 Jesus Cleanses Ten Lepers | Diez leprosos
18.1 The Persistent Widow | La viuda insistente
18.35 Jesus Heals a Blind Beggar | El ciego de Jericó
19.11 The Parable of the Ten Minas | Las diez minas
20.1 The Authority of Jesus Challenged | La autoridad de Jesús
21.1 The Widow’s Offering | La ofrenda de la viuda
22.1 The Plot to Kill Jesus | El complot para matar a Jesús
22.54 Peter Denies Jesus | Pedro niega a Jesús
23.32 The Crucifixion | La crucifixión
24.50 The Ascension | La ascensión

JHN
5.19 The Authority of the Son | La autoridad del Hijo
6.60 The Words of Eternal Life | Palabras de vida eterna
7.32 Officers Sent to Arrest Jesus | Envío para prender a Jesús
8.31 The Truth Will Set You Free | La verdad os hará libres
8.48 Before Abraham Was, I Am | Antes que Abraham fuese, yo soy
10.22 I and the Father Are One | Yo y el Padre uno somos
11.45 The Plot to Kill Jesus | El complot para matar a Jesús
12.1 Mary Anoints Jesus at Bethany | María unge a Jesús
12.20 Some Greeks Seek Jesus | Unos griegos buscan a Jesús
12.27 The Son of Man Must Be Lifted Up | El Hijo del Hombre ha de ser levantado
13.21 One of You Will Betray Me | Uno de vosotros me entregará
13.31 A New Commandment | Un mandamiento nuevo
16.4 The Work of the Holy Spirit | La obra del Espíritu Santo
18.15 Peter Denies Jesus | Pedro niega a Jesús

ACT
5.1 Ananias and Sapphira | Ananías y Safira
6.1 Seven Chosen to Serve | Los siete elegidos
8.1 Saul Ravages the Church | Saulo persigue a la iglesia
8.4 Philip Proclaims Christ in Samaria | Felipe en Samaria
9.32 Peter Heals Aeneas | Pedro sana a Eneas
11.1 Peter Reports to the Church | Pedro informa a la iglesia
12.1 James Killed and Peter Imprisoned | Jacobo muerto y Pedro preso
14.8 Paul and Barnabas at Lystra | Pablo y Bernabé en Listra
16.11 The Conversion of Lydia | La conversión de Lidia
20.7 Eutychus Raised from the Dead | Eutico resucitado
21.17 Paul Visits James | Pablo visita a Jacobo
22.1 Paul’s Defense | Defensa de Pablo
23.12 A Plot to Kill Paul | Complot contra Pablo
24.1 Paul Before Felix | Pablo ante Félix
25.1 Paul Appeals to Caesar | Pablo apela al César
26.1 Paul’s Defense Before Agrippa | Pablo ante Agripa

ROM
2.1 God’s Righteous Judgment | El justo juicio de Dios
3.1 God’s Righteousness Upheld | La justicia de Dios se mantiene
5.12 Death in Adam, Life in Christ | Muerte en Adán, vida en Cristo
6.15 Slaves to Righteousness | Siervos de la justicia
7.1 Released from the Law | Libres de la ley
7.7 The Law and Sin | La ley y el pecado
8.18 Future Glory | La gloria venidera
10.1 The Message of Salvation to All | El mensaje de salvación
11.1 The Remnant of Israel | El remanente de Israel
12.9 Marks of the True Christian | Señales del cristiano
13.8 Fulfilling the Law Through Love | El amor cumple la ley
14.1 Do Not Pass Judgment on One Another | No juzguéis
15.1 The Example of Christ | El ejemplo de Cristo
16.1 Personal Greetings | Saludos personales

1CO
5.1 Sexual Immorality Defiles the Church | La inmoralidad en la iglesia
6.1 Lawsuits Against Believers | Pleitos entre creyentes
7.1 Principles for Marriage | Principios para el matrimonio
8.1 Food Offered to Idols | Lo sacrificado a los ídolos
9.1 Paul Surrenders His Rights | Pablo cede sus derechos
10.1 Warning Against Idolatry | Advertencia contra la idolatría
11.17 The Lord’s Supper | La Cena del Señor
12.1 Spiritual Gifts | Dones espirituales
12.12 One Body with Many Members | Un cuerpo, muchos miembros
14.1 Prophecy and Tongues | Profecía y lenguas
15.35 The Resurrection Body | El cuerpo de la resurrección

2CO
3.1 Ministers of the New Covenant | Ministros del nuevo pacto
5.1 Our Heavenly Dwelling | Nuestra morada celestial
8.1 Encouragement to Give Generously | La ofrenda generosa
11.1 Paul and the False Apostles | Pablo y los falsos apóstoles

GAL
3.1 By Faith, or by Works of the Law? | ¿Por la fe o por las obras?
4.21 Example of Hagar and Sarah | Agar y Sara
6.1 Bear One Another’s Burdens | Llevad los unos las cargas de los otros

EPH
1.15 Thanksgiving and Prayer | Acción de gracias
3.1 The Mystery of the Gospel Revealed | El misterio revelado
4.17 The New Life | La vida nueva
5.1 Walk in Love | Andad en amor
6.1 Children and Parents | Hijos y padres

PHP
1.12 The Advance of the Gospel | El avance del evangelio
2.12 Lights in the World | Luminares en el mundo
3.1 Righteousness Through Faith | Justicia por la fe
4.10 God’s Provision | La provisión de Dios

COL
1.24 Paul’s Ministry to the Church | El ministerio de Pablo
2.6 Alive in Christ | Vivos en Cristo
3.18 Rules for Christian Households | El hogar cristiano
4.2 Further Instructions | Más instrucciones

1TH
4.1 A Life Pleasing to God | Una vida que agrada a Dios
5.1 The Day of the Lord | El día del Señor

2TH
3.6 Warning Against Idleness | Advertencia contra el ocio

1TI
2.1 Pray for All People | Orad por todos
4.1 Some Will Depart from the Faith | Algunos apostatarán
5.1 Instructions for the Church | Instrucciones para la iglesia

2TI
2.1 A Good Soldier of Christ Jesus | Buen soldado de Cristo
4.9 Personal Instructions | Encargos personales

TIT
1.5 Qualifications for Elders | Requisitos de los ancianos
2.1 Teach Sound Doctrine | Enseña la sana doctrina
3.1 Be Ready for Every Good Work | Dispuestos a toda buena obra

HEB
3.1 Jesus Greater Than Moses | Jesús mayor que Moisés
5.1 The High Priest of a Better Covenant | Sumo sacerdote de un mejor pacto
6.13 The Certainty of God’s Promise | La certeza de la promesa
8.1 Jesus, High Priest of a Better Covenant | Un mejor pacto
9.11 Redemption Through the Blood of Christ | Redención por la sangre de Cristo
10.1 Christ’s Sacrifice Once for All | El sacrificio de una vez
12.3 Do Not Grow Weary | No os canséis
13.1 Sacrifices Pleasing to God | Sacrificios agradables a Dios

JAS
1.2 Testing of Your Faith | La prueba de la fe
3.13 Wisdom from Above | Sabiduría de lo alto
4.1 Warning Against Worldliness | Advertencia contra el mundanalismo
5.13 The Prayer of Faith | La oración de fe

1PE
1.13 Called to Be Holy | Llamados a ser santos
2.13 Submission to Authority | Sujeción a la autoridad
3.1 Wives and Husbands | Esposas y esposos
3.8 Suffering for Righteousness’ Sake | Sufrir por hacer el bien
4.1 Stewards of God’s Grace | Administradores de la gracia

2PE
2.1 False Prophets and Teachers | Falsos profetas
3.8 The Day of the Lord Will Come | El día del Señor

1JN
1.5 Walking in the Light | Andar en luz
2.18 Warning Concerning Antichrists | Advertencia sobre el anticristo
3.1 Children of God | Hijos de Dios
4.1 Test the Spirits | Probad los espíritus
5.1 Overcoming the World | Vencer al mundo

JUD
1.5 Judgment on False Teachers | Juicio a los falsos maestros
1.17 A Call to Persevere | Llamado a perseverar

REV
2.8 To the Church in Smyrna | A la iglesia en Esmirna
2.12 To the Church in Pergamum | A la iglesia en Pérgamo
2.18 To the Church in Thyatira | A la iglesia en Tiatira
3.1 To the Church in Sardis | A la iglesia en Sardis
3.7 To the Church in Philadelphia | A la iglesia en Filadelfia
3.14 To the Church in Laodicea | A la iglesia en Laodicea
7.1 The 144,000 of Israel | Los 144.000 de Israel
10.1 The Angel and the Little Scroll | El ángel y el librito
11.15 The Seventh Trumpet | La séptima trompeta
13.1 The First Beast | La primera bestia
14.1 The Lamb and the 144,000 | El Cordero y los 144.000
15.1 The Seven Bowls of God’s Wrath | Las siete copas
17.1 The Great Prostitute and the Beast | La gran ramera y la bestia
18.1 The Fall of Babylon | La caída de Babilonia
19.1 Rejoicing in Heaven | Gozo en el cielo
21.9 The New Jerusalem | La nueva Jerusalén
`;

let extraBook = "";
for (const line of EXTRA.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  if (/^[A-Z0-9]{2,3}$/.test(trimmed)) {
    extraBook = trimmed;
    continue;
  }
  const em = trimmed.match(/^(\d+)\.(\d+)\s+(.+?)\s+\|\s+(.+)$/);
  if (!em || !extraBook) continue;
  const key = `${extraBook}.${em[1]}.${em[2]}`;
  if (INDEX.has(key)) continue;
  INDEX.set(key, { en: em[3], es: em[4] });
}

export function ntHeading(
  bookId: string,
  chapter: number,
  verse: number,
  locale: Locale,
): string | undefined {
  const hit = INDEX.get(`${bookId}.${chapter}.${verse}`);
  if (!hit) return undefined;
  return locale === "es" ? hit.es : hit.en;
}

/** Fill missing titles. Spanish always prefers the Spanish conventional title. */
export function attachNtHeadings(chapter: Chapter, locale: Locale): Chapter {
  let changed = false;
  const verses = chapter.verses.map((v) => {
    const fallback = ntHeading(v.bookId, v.chapter, v.verse, locale);
    if (!fallback) return v;
    if (locale === "es") {
      if (v.title === fallback) return v;
      changed = true;
      return { ...v, title: fallback };
    }
    if (v.title) return v;
    changed = true;
    return { ...v, title: fallback };
  });
  return changed ? { ...chapter, verses } : chapter;
}

export function ntHeadingCount(): number {
  return INDEX.size;
}
