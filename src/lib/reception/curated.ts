import type { ReceptionResult, SourceCard, Tradition } from "@/lib/bible/types";

const CAUTION =
  "Verify quotations against the printed works. This desk is a study aid, not a teacher.";

function card(
  voice: string,
  work: string,
  tradition: Tradition,
  quote: string,
  citation: string,
  paraphrased = true,
): SourceCard {
  return { voice, work, tradition, quote, citation, paraphrased };
}

function desk(...cards: SourceCard[]): ReceptionResult {
  return { source: "curated", caution: CAUTION, cards };
}

const curated: Record<string, ReceptionResult> = {
  "JHN-1-1": desk(
    card(
      "Augustine",
      "Tractates on the Gospel of John 1",
      "patristic",
      "The Word was not made, for by the Word were all things made. This beginning has no beginning: the Word was.",
      "NPNF 1/7, Tractate 1 on John",
    ),
    card(
      "John Chrysostom",
      "Homilies on John 2",
      "patristic",
      "He said not ‘became,’ but ‘was’ — that you might understand His eternity, and that He is not later than the Father.",
      "NPNF 1/14, Homily 2 on John",
    ),
    card(
      "John Calvin",
      "Commentary on John 1:1",
      "reformed",
      "The Evangelist calls the Son of God the Word, because He is the eternal wisdom and will of God, and the lively image of His purpose.",
      "Calvin, Comm. John 1:1",
    ),
    card(
      "Westminster Confession",
      "Chapter 8.2",
      "confession",
      "The Son of God, the second person in the Trinity, being very and eternal God, of one substance and equal with the Father, did, when the fullness of time was come, take upon Him man's nature.",
      "WCF 8.2",
      false,
    ),
  ),
  "JHN-1-3": desk(
    card(
      "Athanasius",
      "Against the Arians 2",
      "patristic",
      "If all things were made through Him, He is not one of the things made. The Maker is other than the made.",
      "Athanasius, Orations against the Arians 2",
    ),
    card(
      "John Calvin",
      "Commentary on John 1:3",
      "reformed",
      "The Evangelist ascribes to the Word an office which belongs to God alone, that we may know Him to be the same God who was from the beginning.",
      "Calvin, Comm. John 1:3",
    ),
  ),
  "JHN-1-4": desk(
    card(
      "Augustine",
      "Tractates on John 1",
      "patristic",
      "What was made, in Him was life. The Word is not merely the artisan of creatures; He is their life, and that life is our light.",
      "NPNF 1/7, Tractate 1 on John",
    ),
    card(
      "Cyril of Alexandria",
      "Commentary on John 1",
      "patristic",
      "The life that is in the Word is not animal life, but the life by which the reasonable creature is made to live unto God.",
      "Cyril of Alexandria, In Joannem 1",
    ),
  ),
  "JHN-1-5": desk(
    card(
      "John Chrysostom",
      "Homilies on John 5",
      "patristic",
      "The light shines in the darkness — not that it may be overcome, but that it may scatter. The darkness did not master it.",
      "NPNF 1/14, Homily 5 on John",
    ),
    card(
      "John Calvin",
      "Commentary on John 1:5",
      "reformed",
      "The light is not extinguished though the world is blind. The fault is in the darkness, not in the light.",
      "Calvin, Comm. John 1:5",
    ),
  ),
  "JHN-1-12": desk(
    card(
      "Augustine",
      "Tractates on John 2",
      "patristic",
      "He gave them power to become children of God — not by nature, as the Only-Begotten, but by grace, by receiving Him.",
      "NPNF 1/7, Tractate 2 on John",
    ),
    card(
      "Martin Luther",
      "Sermons on John",
      "lutheran",
      "Faith is the receiving. They who believe in His name are born not of blood, but of God.",
      "Luther, sermons on John 1",
    ),
    card(
      "Heidelberg Catechism",
      "Q&A 33",
      "confession",
      "Christ alone is the eternal, natural Son of God; we are adopted children of God by grace, through Christ.",
      "Heidelberg Catechism 33",
      false,
    ),
  ),
  "JHN-1-14": desk(
    card(
      "Athanasius",
      "On the Incarnation",
      "patristic",
      "He was made man that we might be made God; and He manifested Himself by a body that we might receive the idea of the unseen Father.",
      "Athanasius, De Incarnatione 54",
    ),
    card(
      "Martin Luther",
      "Sermons on John",
      "lutheran",
      "The Word became flesh — not an appearance of flesh, but true human nature, that He might be our brother and our Savior.",
      "Luther, sermons on John 1",
    ),
    card(
      "John Calvin",
      "Commentary on John 1:14",
      "reformed",
      "The Word of God became truly man, yet remained what He was, that the two natures might constitute one Christ.",
      "Calvin, Comm. John 1:14",
    ),
  ),
  "JHN-1-18": desk(
    card(
      "Augustine",
      "Tractates on John 3",
      "patristic",
      "No one has seen God at any time — not with the eyes of the flesh. The only-begotten, who is in the bosom of the Father, He has declared Him.",
      "NPNF 1/7, Tractate 3 on John",
    ),
    card(
      "John Chrysostom",
      "Homilies on John 15",
      "patristic",
      "The bosom of the Father denotes closeness of essence, not a place. He who is there declares what He has seen.",
      "NPNF 1/14, Homily 15 on John",
    ),
  ),
  "JHN-1-29": desk(
    card(
      "John Chrysostom",
      "Homilies on John 17",
      "patristic",
      "He says not ‘a lamb,’ but ‘the Lamb,’ and adds ‘of God’ — the one of whom the law was a shadow, who takes away not one man’s sin but the world’s.",
      "NPNF 1/14, Homily 17 on John",
    ),
    card(
      "John Calvin",
      "Commentary on John 1:29",
      "reformed",
      "The Lamb is a sacrificial title. John sends us to the atonement, that we may not dream of any other way of taking away sin.",
      "Calvin, Comm. John 1:29",
    ),
    card(
      "Heidelberg Catechism",
      "Q&A 37",
      "confession",
      "That all the time He lived on earth, but especially at the end of His life, He bore, in body and soul, the wrath of God against the sin of the whole human race.",
      "Heidelberg Catechism 37",
      false,
    ),
  ),
  "JHN-3-16": desk(
    card(
      "Augustine",
      "Tractates on John 12",
      "patristic",
      "God loved the world — not that He found it worthy, but that He might make it worthy. The gift is the Son; the way is believing.",
      "NPNF 1/7, Tractate 12 on John",
    ),
    card(
      "John Calvin",
      "Commentary on John 3:16",
      "reformed",
      "Faith is not a merit that procures life, but the bucket that draws the water already given. Life is in the only-begotten, not in our believing.",
      "Calvin, Comm. John 3:16",
    ),
    card(
      "Martin Luther",
      "Sermons on John 3",
      "lutheran",
      "These words are the gospel in a nutshell: the Father’s love, the Son given, the world in view, eternal life by faith and not by works.",
      "Luther, sermons on John 3",
    ),
  ),
  "JHN-14-6": desk(
    card(
      "Cyril of Alexandria",
      "Commentary on John 9",
      "patristic",
      "He is not one way among many. He is the way because He is the truth, and the truth because He is the life — one Christ, not three paths.",
      "Cyril of Alexandria, In Joannem 9",
    ),
    card(
      "John Calvin",
      "Commentary on John 14:6",
      "reformed",
      "No man comes to the Father but by the Son. They who seek God apart from Christ wander, however religious the search.",
      "Calvin, Comm. John 14:6",
    ),
    card(
      "Westminster Confession",
      "Chapter 10.4",
      "confession",
      "Others, not elected, although they may be called by the ministry of the Word, cannot be saved: much less can men not professing the Christian religion be saved in any other way whatsoever.",
      "WCF 10.4 (abridged)",
    ),
  ),
  "MRK-1-1": desk(
    card(
      "Irenaeus",
      "Against Heresies 3.10",
      "patristic",
      "Mark, the interpreter of Peter, begins with the prophetic voice and names Jesus Christ the Son of God — the gospel’s first article.",
      "Irenaeus, Adv. Haer. 3.10–11",
    ),
    card(
      "Augustine",
      "Harmony of the Gospels 1",
      "patristic",
      "Mark is brief, as a lion’s roar is brief. He opens not with genealogy but with power: the beginning of the good news.",
      "Augustine, De Consensu Evangelistarum 1",
    ),
    card(
      "John Calvin",
      "Commentary on Mark 1:1",
      "reformed",
      "The gospel is not a new law but the glad tidings of the Son. Mark’s title is a sermon: Jesus, the Christ, the Son of God.",
      "Calvin, Comm. Mark 1:1",
    ),
  ),
  "MRK-1-11": desk(
    card(
      "Augustine",
      "Sermons on the New Testament",
      "patristic",
      "The Trinity is disclosed at the Jordan: the Son baptized, the Spirit descending, the Father’s voice. One God, three who speak and act.",
      "Augustine, sermons on the baptism of Christ",
    ),
    card(
      "John Chrysostom",
      "Homilies on Matthew 12",
      "patristic",
      "‘Beloved’ is not a later reward but an eternal name. The Father does not begin to love the Son at the river.",
      "NPNF 1/10, Homily 12 on Matthew",
    ),
    card(
      "Belgic Confession",
      "Article 9",
      "confession",
      "All this we know, as well from the testimonies of Holy Writ as from their operations, and chiefly by those we feel in ourselves. The Father is called our Creator, by His power; the Son is our Savior and Redeemer, by His blood; the Holy Ghost is our Sanctifier, by His dwelling in our hearts.",
      "Belgic Confession 9 (abridged)",
    ),
  ),
  "MRK-1-15": desk(
    card(
      "Origen",
      "Commentary on Matthew / fragments on Mark",
      "patristic",
      "The kingdom is at hand because the King is at hand. Repentance is not gloom but a turning of the mind toward the near reign of God.",
      "Origen, on the kingdom",
    ),
    card(
      "John Calvin",
      "Commentary on Mark 1:15",
      "reformed",
      "Faith and repentance are the two hinges of the gospel call. The time is fulfilled: delay is unbelief.",
      "Calvin, Comm. Mark 1:15",
    ),
    card(
      "Heidelberg Catechism",
      "Q&A 88–90",
      "confession",
      "True repentance or conversion is the dying of the old man and the coming to life of the new — a sincere sorrow for sin and a hearty joy in God through Christ.",
      "Heidelberg Catechism 88–90 (abridged)",
    ),
  ),
  "MRK-1-17": desk(
    card(
      "Bede",
      "Exposition of Mark",
      "patristic",
      "They leave nets that catch fish to become fishers of men. The craft is the same in figure: patience, risk, and a catch that is not their own.",
      "Bede, In Marcum 1",
    ),
    card(
      "John Calvin",
      "Commentary on Mark 1:17",
      "reformed",
      "Christ does not ask them to invent a ministry. He makes them what they were not. The call creates the fishermen.",
      "Calvin, Comm. Mark 1:16–17",
    ),
  ),
  "MAT-5-3": desk(
    card(
      "Gregory of Nyssa",
      "Homilies on the Beatitudes 1",
      "patristic",
      "Poverty of spirit is not want of goods but the soul emptied of pride, so that the kingdom may have room.",
      "Gregory of Nyssa, De Beatitudinibus 1",
    ),
    card(
      "Augustine",
      "Sermon on the Mount 1",
      "patristic",
      "The poor in spirit are the humble. The kingdom of heaven is theirs already in hope, and in the end in possession.",
      "NPNF 1/6, De Sermone Domini 1",
    ),
    card(
      "John Calvin",
      "Commentary on Matthew 5:3",
      "reformed",
      "Christ begins where we would not: not with the strong, but with those who have nothing to bring. Blessedness is given, not seized.",
      "Calvin, Comm. Matt. 5:3",
    ),
  ),
  "MAT-6-9": desk(
    card(
      "Tertullian",
      "On Prayer",
      "patristic",
      "He who is Father may also be called upon as Lord, yet Christ would have us begin with Father, that affection might lead the prayer.",
      "Tertullian, De Oratione 2–3",
    ),
    card(
      "Cyprian",
      "On the Lord’s Prayer",
      "patristic",
      "We do not say ‘My Father’ but ‘Our Father,’ because the prayer is the prayer of a people, and none prays for himself alone.",
      "Cyprian, De Dominica Oratione 8–9",
    ),
    card(
      "Martin Luther",
      "Large Catechism",
      "lutheran",
      "God would by these words tenderly invite us to believe that He is our true Father and that we are His true children, so that we may ask Him with all cheerfulness.",
      "Luther, Large Catechism, Lord’s Prayer",
    ),
  ),
  "MAT-28-19": desk(
    card(
      "Basil the Great",
      "On the Holy Spirit 10",
      "patristic",
      "We are baptized into the name, not the names — one name of Father, Son, and Holy Spirit, that the distinction of persons may not break the unity of Godhead.",
      "NPNF 2/8, De Spiritu Sancto 10",
    ),
    card(
      "John Calvin",
      "Commentary on Matthew 28:19",
      "reformed",
      "The command is to make disciples, not mere hearers; baptism is the seal of that teaching, in the name of the Triune God.",
      "Calvin, Comm. Matt. 28:19",
    ),
    card(
      "Nicene Creed",
      "Constantinople 381",
      "confession",
      "We believe in one God, the Father Almighty… and in one Lord Jesus Christ… and in the Holy Spirit, the Lord and Giver of life, who proceeds from the Father, who with the Father and the Son together is worshiped and glorified.",
      "Niceno-Constantinopolitan Creed (abridged)",
      false,
    ),
  ),
  "LUK-2-11": desk(
    card(
      "Leo the Great",
      "Sermon 21 on the Nativity",
      "patristic",
      "He is born a Savior, who is Christ the Lord — not one title stacked on another, but one person who is both the Anointed and the Lord.",
      "NPNF 2/12, Sermon 21",
    ),
    card(
      "Martin Luther",
      "Christmas sermons",
      "lutheran",
      "Unto you is born — not unto angels, not in general, but unto you. Faith takes the pronoun as its own.",
      "Luther, Christmas sermons on Luke 2",
    ),
  ),
  "GEN-1-1": desk(
    card(
      "Basil the Great",
      "Hexaemeron 1",
      "patristic",
      "‘In the beginning God created’ — the origin of time, the foundation of the world, so that what is seen might not be thought eternal.",
      "NPNF 2/8, Hexaemeron Homily 1",
    ),
    card(
      "John Calvin",
      "Commentary on Genesis 1:1",
      "reformed",
      "Moses does not philosophize, but simply states that the world is not eternal, and that God is its Maker.",
      "Calvin, Comm. Gen. 1:1",
    ),
    card(
      "Westminster Confession",
      "Chapter 4.1",
      "confession",
      "It pleased God the Father, Son, and Holy Ghost, for the manifestation of the glory of His eternal power, wisdom, and goodness, in the beginning, to create, or make of nothing, the world.",
      "WCF 4.1",
      false,
    ),
  ),
  "GEN-1-26": desk(
    card(
      "Gregory of Nyssa",
      "On the Making of Man",
      "patristic",
      "Let us make: the counsel is plural, the image is one. Man is not the image of a part of God, but of God.",
      "Gregory of Nyssa, De Hominis Opificio",
    ),
    card(
      "Augustine",
      "The Literal Meaning of Genesis 3",
      "patristic",
      "The image is in the inner man — memory, understanding, will — a created trinity, not a second God.",
      "Augustine, De Genesi ad litteram 3",
    ),
    card(
      "John Calvin",
      "Commentary on Genesis 1:26",
      "reformed",
      "The image of God is not the body, though the body is not excluded from dignity. It is the integrity of the soul as it mirrored its Maker before the fall.",
      "Calvin, Comm. Gen. 1:26",
    ),
  ),
  "GEN-1-27": desk(
    card(
      "Basil the Great",
      "Hexaemeron 9",
      "patristic",
      "Male and female He created them: the image is not assigned to one sex. Dominion is a shared charge, not a license to devour.",
      "NPNF 2/8, Hexaemeron Homily 9",
    ),
    card(
      "Westminster Confession",
      "Chapter 4.2",
      "confession",
      "After God had made all other creatures, He created man, male and female, with reasonable and immortal souls, endued with knowledge, righteousness, and true holiness, after His own image.",
      "WCF 4.2",
      false,
    ),
  ),
  "GEN-3-15": desk(
    card(
      "Irenaeus",
      "Against Heresies 3.23",
      "patristic",
      "The seed of the woman is Christ. He recapitulutes the long war, crushing the serpent’s head while His heel is wounded.",
      "Irenaeus, Adv. Haer. 3.23",
    ),
    card(
      "Martin Luther",
      "Lectures on Genesis",
      "lutheran",
      "This is the first gospel. Adam and Eve heard not only a curse but a promise, and they lived by that promise until the Seed came.",
      "Luther, Lectures on Genesis 3",
    ),
    card(
      "John Calvin",
      "Commentary on Genesis 3:15",
      "reformed",
      "God does not leave the serpent a truce. The victory is promised in the woman’s seed, that faith might have an object from the first day of the fall.",
      "Calvin, Comm. Gen. 3:15",
    ),
  ),
  "EXO-3-14": desk(
    card(
      "Augustine",
      "Tractates on John 38",
      "patristic",
      "I AM WHO I AM: He names Himself as being, not as becoming. Other things are; He is He who is.",
      "NPNF 1/7, Tractate 38 on John",
    ),
    card(
      "Thomas Aquinas",
      "Summa Theologiae I q.13",
      "catholic",
      "This name, HE WHO IS, is the most proper name of God, for it signifies not a form but existence itself.",
      "ST I q.13 a.11 (paraphrased)",
    ),
    card(
      "John Calvin",
      "Commentary on Exodus 3:14",
      "reformed",
      "God opposes His eternal being to the idols that are not. The name is a shield to Moses, and a rebuke to Egypt.",
      "Calvin, Comm. Exod. 3:14",
    ),
  ),
  "PSA-23-1": desk(
    card(
      "Augustine",
      "Expositions on the Psalms 23",
      "patristic",
      "The Lord is my shepherd: I shall not want, because I am a sheep of His, not of my own keeping.",
      "Augustine, Enarr. Ps. 23",
    ),
    card(
      "John Calvin",
      "Commentary on Psalm 23",
      "reformed",
      "David does not boast of his store, but of his Shepherd. Want is banished not by plenty but by the care of God.",
      "Calvin, Comm. Ps. 23:1",
    ),
  ),
  "PSA-23-4": desk(
    card(
      "Athanasius",
      "Letter to Marcellinus on the Psalms",
      "patristic",
      "In the valley of the shadow the psalm is a staff. Christ has walked that valley, so the sheep need not fear it as an end.",
      "Athanasius, Ad Marcellinum",
    ),
    card(
      "Matthew Henry",
      "Commentary on Psalm 23",
      "reformed",
      "Death is a shadow, and a shadow cannot hurt. The rod and staff comfort because they belong to the Shepherd who is there.",
      "Henry, Comm. Ps. 23:4",
    ),
  ),
  "PSA-119-105": desk(
    card(
      "Augustine",
      "Expositions on the Psalms 119",
      "patristic",
      "The word is a lamp, not that we may see it, but that by it we may see ourselves and the way.",
      "Augustine, Enarr. Ps. 119",
    ),
    card(
      "Matthew Henry",
      "Commentary on Psalm 119",
      "reformed",
      "The word of God directs us in our work and way, and a dark place indeed the world would be without it.",
      "Henry, Comm. Ps. 119:105",
    ),
  ),
  "ISA-7-14": desk(
    card(
      "Justin Martyr",
      "Dialogue with Trypho 66–68",
      "patristic",
      "The virgin conceives: Isaiah spoke of a sign, and Matthew reads it as fulfilled in Mary, not as a mere young woman of Ahaz’s court.",
      "Justin, Dial. 66–68",
    ),
    card(
      "John Chrysostom",
      "Homilies on Matthew 5",
      "patristic",
      "Emmanuel is not a private nickname. It is the gospel in one word: God with us — not in figure only, but in flesh.",
      "NPNF 1/10, Homily 5 on Matthew",
    ),
  ),
  "ISA-9-6": desk(
    card(
      "Irenaeus",
      "Against Heresies 3.16",
      "patristic",
      "A child is born, a son is given: born as man, given as God. The names that follow are not honors piled on a creature.",
      "Irenaeus, Adv. Haer. 3.16",
    ),
    card(
      "John Calvin",
      "Commentary on Isaiah 9:6",
      "reformed",
      "Wonderful, Counselor, Mighty God: the prophet will not let us rest in a merely human king. The government is upon His shoulder because He is more than David’s heir.",
      "Calvin, Comm. Isa. 9:6",
    ),
  ),
  "ISA-53-5": desk(
    card(
      "Justin Martyr",
      "Dialogue with Trypho 13",
      "patristic",
      "He was wounded for our transgressions: the prophet ascribes the stripes not to His fault but to ours, that we might be healed.",
      "Justin, Dial. 13",
    ),
    card(
      "John Calvin",
      "Commentary on Isaiah 53:5",
      "reformed",
      "The chastisement of our peace was upon Him. Peace is not cheap; it is purchased by His punishment in our place.",
      "Calvin, Comm. Isa. 53:5",
    ),
    card(
      "Heidelberg Catechism",
      "Q&A 37–39",
      "confession",
      "He bore the wrath of God against the sin of the whole human race… that He might redeem our body and soul from everlasting damnation, and obtain for us the grace of God, righteousness, and eternal life.",
      "Heidelberg Catechism 37–39 (abridged)",
    ),
  ),
  "ROM-1-16": desk(
    card(
      "John Chrysostom",
      "Homilies on Romans 2",
      "patristic",
      "He is not ashamed of the gospel, though the cross is a scandal. Power is not in the speaker’s dignity but in the message that saves.",
      "NPNF 1/11, Homily 2 on Romans",
    ),
    card(
      "Martin Luther",
      "Preface to Romans",
      "lutheran",
      "The gospel is a power, not a counsel. It does not tell us what we must do to become righteous; it gives the righteousness it names.",
      "Luther, Preface to Romans",
    ),
  ),
  "ROM-3-23": desk(
    card(
      "Augustine",
      "On Nature and Grace",
      "patristic",
      "All have sinned: not the nations only, nor the Jews only. There is no island of innocence from which we might bargain with God.",
      "Augustine, De Natura et Gratia",
    ),
    card(
      "John Calvin",
      "Commentary on Romans 3:23",
      "reformed",
      "The glory of God is the standard, not the neighbor. Measured so, every mouth is stopped.",
      "Calvin, Comm. Rom. 3:23",
    ),
    card(
      "Westminster Confession",
      "Chapter 6.2–4",
      "confession",
      "By this sin they fell from their original righteousness… and we in them. From this original corruption we are utterly indisposed, disabled, and made opposite to all good.",
      "WCF 6.2–4 (abridged)",
    ),
  ),
  "ROM-5-8": desk(
    card(
      "John Chrysostom",
      "Homilies on Romans 9",
      "patristic",
      "He did not wait for us to become worthy. While we were yet sinners — that is the measure of the love.",
      "NPNF 1/11, Homily 9 on Romans",
    ),
    card(
      "John Calvin",
      "Commentary on Romans 5:8",
      "reformed",
      "God commends His love in that Christ died not for the righteous but for the ungodly. The cause is in God, not in us.",
      "Calvin, Comm. Rom. 5:8",
    ),
  ),
  "ROM-8-1": desk(
    card(
      "John Chrysostom",
      "Homilies on Romans 13",
      "patristic",
      "He did not say ‘who do not sin,’ but ‘who are in Christ Jesus.’ The condemnation is taken off, not by our worthiness, but by the gift.",
      "NPNF 1/11, Homily 13 on Romans",
    ),
    card(
      "John Calvin",
      "Commentary on Romans 8:1",
      "reformed",
      "There is no condemnation to them, because they are grafted into the body of Christ. He does not exempt them from the remaining contest with sin, but from the guilt of it.",
      "Calvin, Comm. Rom. 8:1",
    ),
    card(
      "Heidelberg Catechism",
      "Q&A 60",
      "confession",
      "God, without any merit of mine, of mere grace, grants and imputes to me the perfect satisfaction, righteousness, and holiness of Christ.",
      "Heidelberg Catechism 60",
      false,
    ),
  ),
  "ROM-8-28": desk(
    card(
      "Augustine",
      "On the Gift of Perseverance",
      "patristic",
      "All things work together for good to those who love God — not that evil is good, but that God weaves even wounds into the good of His called.",
      "Augustine, De Dono Perseverantiae",
    ),
    card(
      "John Calvin",
      "Commentary on Romans 8:28",
      "reformed",
      "The promise is not for all men indiscriminately, but for the called according to purpose. Providence is paternal to the children.",
      "Calvin, Comm. Rom. 8:28",
    ),
  ),
  "1CO-15-3": desk(
    card(
      "Irenaeus",
      "Against Heresies 3.18",
      "patristic",
      "Christ died for our sins according to the Scriptures: the apostle hands on what he received, that the church might not invent another gospel.",
      "Irenaeus, Adv. Haer. 3.18",
    ),
    card(
      "John Chrysostom",
      "Homilies on 1 Corinthians 38",
      "patristic",
      "This is first of all. The resurrection stands on the death ‘for our sins’; empty the death of its purpose and the rising is a marvel without mercy.",
      "NPNF 1/12, Homily 38 on 1 Corinthians",
    ),
    card(
      "Nicene Creed",
      "Constantinople 381",
      "confession",
      "For our sake He was crucified under Pontius Pilate; He suffered and was buried. On the third day He rose again in accordance with the Scriptures.",
      "Niceno-Constantinopolitan Creed",
      false,
    ),
  ),
  "EPH-2-8": desk(
    card(
      "John Chrysostom",
      "Homilies on Ephesians 4",
      "patristic",
      "By grace you have been saved through faith — and this not of yourselves. He shuts every door of boasting, even the door of believing as if it were a work.",
      "NPNF 1/13, Homily 4 on Ephesians",
    ),
    card(
      "Martin Luther",
      "Lectures on Galatians / on grace",
      "lutheran",
      "Faith is the empty hand. Grace is the gift in it. If the hand boasts, it has closed.",
      "Luther, on Eph. 2 / Galatians",
    ),
    card(
      "Westminster Confession",
      "Chapter 11.1",
      "confession",
      "Those whom God effectually calls, He also freely justifies… not for anything wrought in them, or done by them, but for Christ’s sake alone.",
      "WCF 11.1 (abridged)",
      false,
    ),
  ),
  "PHP-2-6": desk(
    card(
      "Athanasius",
      "Against the Arians 1",
      "patristic",
      "Being in the form of God, He did not clutch at equality. He had it; the humility is in taking the form of a servant, not in ceasing to be God.",
      "Athanasius, Orations against the Arians 1",
    ),
    card(
      "Gregory of Nazianzus",
      "Oration 37 / Theological Orations",
      "patristic",
      "What He was, He remained; what He was not, He assumed. The emptying is addition of humanity, not subtraction of deity.",
      "Gregory of Nazianzus, orations on the Son",
    ),
    card(
      "Chalcedonian Definition",
      "Council of Chalcedon 451",
      "confession",
      "One and the same Son… acknowledged in two natures, without confusion, without change, without division, without separation.",
      "Definition of Chalcedon",
      false,
    ),
  ),
  "HEB-1-1": desk(
    card(
      "John Chrysostom",
      "Homilies on Hebrews 1",
      "patristic",
      "God spoke in many portions by the prophets; in these last days He has spoken by a Son. The difference is not of truth but of fullness.",
      "NPNF 1/14, Homily 1 on Hebrews",
    ),
    card(
      "John Calvin",
      "Commentary on Hebrews 1:1–2",
      "reformed",
      "Christ is the last and highest word. They who seek a later revelation after the Son are not going on; they are going back.",
      "Calvin, Comm. Heb. 1:1–2",
    ),
  ),
  "HEB-4-12": desk(
    card(
      "Origen",
      "Homilies on Hebrews / on the Word",
      "patristic",
      "The word is living and active. It does not lie on the page as a dead letter; it cuts, and the cut is mercy when it divides soul from pretense.",
      "Origen, on the piercing word",
    ),
    card(
      "John Calvin",
      "Commentary on Hebrews 4:12",
      "reformed",
      "None can hide from the word that searches. It is God’s own speech, and therefore it reaches the joints and marrow of the heart.",
      "Calvin, Comm. Heb. 4:12",
    ),
  ),
  "1JN-4-8": desk(
    card(
      "Augustine",
      "Tractates on 1 John 7",
      "patristic",
      "God is love: not that love is God as a mere affection, but that the God who is Trinity lives as love, and we know Him when we love.",
      "NPNF 1/7, Tractate 7 on 1 John",
    ),
    card(
      "John Calvin",
      "Commentary on 1 John 4:8",
      "reformed",
      "They who do not love do not know God, whatever their confession. Knowledge without love is a lie against this verse.",
      "Calvin, Comm. 1 John 4:8",
    ),
  ),
  "REV-21-1": desk(
    card(
      "Irenaeus",
      "Against Heresies 5.36",
      "patristic",
      "A new heaven and a new earth: not the abolition of creation, but its renewal, that the promise to Abraham might have a place to stand.",
      "Irenaeus, Adv. Haer. 5.36",
    ),
    card(
      "Andrew of Caesarea",
      "Commentary on Revelation 21",
      "orthodox",
      "The sea is no more — the figure of tumult. The city that comes down is not built by us; it is given.",
      "Andrew of Caesarea, In Apocalypsin 21",
    ),
    card(
      "John Calvin",
      "Commentary on 2 Peter / on last things",
      "reformed",
      "The restoration is cosmic, not merely inward. Hope that stops at the soul’s peace has not yet read the last pages.",
      "Calvin, on the new creation",
    ),
  ),
};

export function getCurated(
  bookId: string,
  chapter: number,
  verse: number | null,
): ReceptionResult | null {
  if (verse == null) return null;
  return curated[`${bookId}-${chapter}-${verse}`] ?? null;
}

export function hasCurated(
  bookId: string,
  chapter: number,
  verse: number,
): boolean {
  return Boolean(curated[`${bookId}-${chapter}-${verse}`]);
}

export function markedVerses(bookId: string, chapter: number): number[] {
  const prefix = `${bookId}-${chapter}-`;
  return Object.keys(curated)
    .filter((k) => k.startsWith(prefix))
    .map((k) => Number(k.slice(prefix.length)))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

export function curatedBookIds(): Set<string> {
  const ids = new Set<string>();
  for (const k of Object.keys(curated)) {
    const id = k.split("-")[0];
    if (id) ids.add(id);
  }
  return ids;
}
