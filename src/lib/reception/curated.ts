import type { ReceptionResult, SourceCard, Tradition } from "@/lib/bible/types";
import type { Locale } from "@/lib/bible/books";

export interface CuratedReceptionEntry {
  verseRef: string;
  sourceId: string;
  excerpt: string;
  theologicalNote?: string;
  voice: string;
  work: string;
  tradition: Tradition;
  citation: string;
  /**
   * Page that actually contains the passage. Left undefined when no such page
   * has been verified: a link to a volume index is worse than no link, because
   * it looks like a citation the reader can check.
   */
  url?: string;
  /**
   * False only when the excerpt was transcribed from the source. Desk entries
   * are compressed restatements of the writer's argument at the verse, so the
   * default is true and the caution asks the reader to check the printed work.
   */
  paraphrased?: boolean;
}

const CAUTION =
  "Verify quotations against the printed works. This desk is a study aid, not a teacher.";

function card(
  voice: string,
  work: string,
  tradition: Tradition,
  quote: string,
  citation: string,
  paraphrased = true,
  note?: string,
  url?: string,
): SourceCard {
  return { voice, work, tradition, quote, citation, paraphrased, note, url, source: "curated" };
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
  "JHN-10-11": desk(
    card(
      "Augustine of Hippo",
      "Tractates on John 46",
      "patristic",
      "The good shepherd gives His life for the sheep. He who enters by the door is the shepherd; but He who is the door is Himself the shepherd. Through Christ the Mediator we are brought unto the Father, preserved by His blood from the devouring wolf.",
      "Augustine, In Ioannem Tract. 46.5",
    ),
    card(
      "John Calvin",
      "Commentary on John 10:11",
      "reformed",
      "The good shepherd giveth his life for the sheep. From the extraordinary affection which he bears towards the sheep, he shows how truly he acts as a shepherd; for he does not hesitate to die for them, unlike the hireling who flees at the wolf's approach.",
      "Calvin, Comm. John 10:11",
    ),
    card(
      "Martin Luther",
      "Sermon on John 10:11–16",
      "lutheran",
      "Christ calls Himself the Good Shepherd because He does not drive the sheep with threats or demands of the law, but gives His own life for them and preserves them in grace against the wolf, sin, and death.",
      "Luther, Church Postil, Misericordias Domini",
    ),
    card(
      "Matthew Henry",
      "Commentary on the Whole Bible",
      "reformed",
      "It is the property of every good shepherd to hazard his life in defense of his sheep; but Christ did much more than hazard it: he actually laid down his life for the sheep, to pay their ransom and satisfy the divine justice.",
      "Henry, Comm. John 10:11",
    ),
  ),
  "JHN-11-35": desk(
    card(
      "Augustine of Hippo",
      "Tractates on the Gospel of John 49",
      "patristic",
      "Christ did indeed weep, but it was because He willed to weep. He troubled Himself, because He had the power to be troubled or not to be troubled. He wept to teach men to weep with them that weep, and to show the reality of the human nature He had assumed.",
      "Augustine, In Joannem Tract. 49.19",
      true,
      undefined,
      "https://www.newadvent.org/fathers/1701049.htm",
    ),
    card(
      "John Calvin",
      "Commentary on the Gospel According to John",
      "reformed",
      "Christ does not weep out of an uncontrollable passion, but because He willingly clothes Himself with human affections in order to comfort us. By taking upon Himself our grief and tears, He proves Himself to be our true brother and compassionate high priest.",
      "Calvin, Comm. John 11:35",
      true,
      undefined,
      "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.i.html",
    ),
    card(
      "Matthew Henry",
      "Commentary on the Whole Bible",
      "reformed",
      "Jesus wept. A very short verse, but it affords many useful instructions: that Jesus Christ was really and truly man, subject to the sinless infirmities of our nature; and that He is a compassionate Savior who enters into our sorrows.",
      "Henry, Comm. John 11:35",
      true,
      undefined,
      "https://ccel.org/ccel/henry/mhc5/mhc5.John.xii.html",
    ),
    card(
      "Cyril of Alexandria",
      "Commentary on the Gospel of St. John",
      "patristic",
      "He wept that He might check our immoderate tears; for in weeping He sanctified tears, showing that human nature is not forbidden to mourn, while simultaneously confirming that He who was truly God was also genuinely and fleshly man.",
      "Cyril of Alexandria, In Joannem 7.1",
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
  "MAT-1-21": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily IV)",
      "eastern-patristic",
      "He shall save His people; not the Jewish people only, but the whole world that comes to Him. He says not 'from visible enemies or tyrants,' but 'from their sins' — a warfare of soul, requiring divine power.",
      "NPNF 1/10, Homily 4 on Matthew",
      true,
      "Chrysostom emphasizes the angelic announcement distinguishing Christ's spiritual salvation from nationalistic messianic expectations.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "The name Jesus signifies Savior. The angel announces that He will redeem His people from their sins, correcting the common error of the Jews who looked for an earthly monarch to deliver them from Roman servitude.",
      "Calvin, Comm. Matt. 1:21",
      true,
      "Calvin highlights Christ as Savior from spiritual guilt and bondage, refuting carnal expectations of a temporal kingdom.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Matthew Poole",
      "Annotations upon the Holy Bible",
      "puritan",
      "His name is called Jesus, a Savior, because he saves from the guilt, power, and punishment of sin; not by a temporal deliverance, but by eternal redemption.",
      "Poole, Annotations on Matt. 1:21",
      true,
      "Poole expounds the triple deliverance of justification, sanctification, and glorification.",
      "https://www.ccel.org/ccel/poole/annotations.html",
    ),
  ),
  "MAT-1-22": desk(
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Jerome says: 'That it might be fulfilled which was spoken of the Lord by the prophet. Not that the event happened only that the prophecy might be fulfilled, but that the prophet foresaw the future and the divine decree was accomplished.'",
      "Aquinas, Catena Aurea, Matt. 1:22",
      true,
      "Scholastic synthesis on divine sovereignty, prophecy, and teleological fulfillment in Christ.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Matthew shows that nothing came to pass by chance, but that this marvelous work of God had been foretold long before by the prophet Isaiah.",
      "Calvin, Comm. Matt. 1:22",
      true,
      "The unity of Old Testament prophetic promise and New Testament fulfillment.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
  ),
  "MAT-1-23": desk(
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Jerome says: The Hebrew word alma signifies a virgin hidden and kept secret. Augustine adds: She who conceived without concupiscence remained a virgin in bearing and after bearing. He is truly Immanuel, God with us in the assumption of our flesh.",
      "Aquinas, Catena Aurea, Matt. 1:22–23",
      true,
      "Aquinas compiles Patristic consensus from Jerome and Augustine affirming the perpetual virginity and the hypostatic union in Isaiah 7:14.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily V)",
      "eastern-patristic",
      "They shall call His name Immanuel, which is, God with us. He did not say 'thou shalt call,' but 'they shall call' — that is, the events and deeds shall proclaim Him God with us.",
      "NPNF 1/10, Homily 5 on Matthew",
      true,
      "Chrysostom on the divine identity of the incarnate Word manifest in His works.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "God has descended to us that we might ascend to Him; by taking our flesh He has united our lowliness with the divine majesty. Immanuel is not a bare title, but the substance of our salvation.",
      "Calvin, Comm. Matt. 1:23",
      true,
      "Calvin on the mediator uniting divine majesty with human flesh.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Matthew Poole",
      "Annotations upon the Holy Bible",
      "puritan",
      "Immanuel: God with us, not only by his essential presence, but by personal union, God and man in one person; and covenantally, reconciling God to man by his blood.",
      "Poole, Annotations on Matt. 1:23",
      true,
      "Poole expounds Immanuel as the mediator of the covenant of grace in two natures.",
      "https://www.ccel.org/ccel/poole/annotations.html",
    ),
  ),
  "MAT-5-3": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XV)",
      "eastern-patristic",
      "What is 'poor in spirit'? The humble and contrite in mind. As pride was the root of all wickedness, Christ sets humility as the first foundation of virtue; unless this be laid, whatever virtues you build will fall.",
      "NPNF 1/10, Homily 15 on Matthew",
      true,
      "Humility as the foundation of virtue.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Augustine explains: The proud seek after an earthly kingdom; the poor in spirit, who are not puffed up with the pride of riches or knowledge, possess the kingdom of heaven. Jerome adds: Those who are voluntary in poverty for the Spirit's sake.",
      "Aquinas, Catena Aurea, Matt. 5:3",
      true,
      "Interior detachment and poverty of spirit over self-glory.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Those are poor in spirit who, brought to nothing in themselves and terrified by the consciousness of their spiritual poverty, betake themselves to the mercy of God. For grace is poured only into empty vessels.",
      "Calvin, Comm. Matt. 5:3",
      true,
      "Radical reduction to self-despair to receive sovereign grace.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Martin Luther",
      "Commentary on the Sermon on the Mount",
      "lutheran",
      "To be poor in spirit does not mean begging or walking barefoot, but holding oneself destitute before God, having no trust in one's own righteousness, and clinging solely to Christ's promise by faith.",
      "Luther, Comm. Sermon on the Mount (1532), Matt. 5:3",
      true,
      "Faith grasping Christ outside human boasting.",
      "https://ccel.org/ccel/luther/good_works/good_works.ii.html",
    ),
    card(
      "Gregory of Nyssa",
      "Homilies on the Beatitudes 1",
      "patristic",
      "Poverty of spirit is not want of goods but the soul emptied of pride, so that the kingdom may have room.",
      "Gregory of Nyssa, De Beatitudinibus 1",
    ),
  ),
  "MAT-5-4": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XV)",
      "eastern-patristic",
      "He blesses not simply those who mourn, but those who mourn for their sins. For worldly grief brings death, but godly sorrow works repentance unto salvation.",
      "NPNF 1/10, Homily 15 on Matthew",
      true,
      "Godly sorrow over transgression vs worldly grief.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ comforts those who groan under the burden of sin and afflictions, assuring them that their tears are gathered by God, who will wipe away all weeping.",
      "Calvin, Comm. Matt. 5:4",
      true,
      "Spiritual mourning finding consolation in divine pardon.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
  ),
  "MAT-5-5": desk(
    card(
      "Augustine",
      "Our Lord's Sermon on the Mount 1",
      "western-patristic",
      "The meek are those who do not resist divine reproof in scripture, but yield themselves to God's Word in silence and reverence. The earth they inherit is the eternal inheritance of the saints.",
      "NPNF 1/6, De Sermone Domini 1.2",
      true,
      "Meekness yielding to the authority of divine revelation.",
      "https://www.ccel.org/ccel/schaff/npnf106.html",
    ),
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Meekness curbs anger and bridles turbulent passions, so that the soul remains tranquil and fit to receive divine wisdom.",
      "Aquinas, Catena Aurea, Matt. 5:5",
      true,
      "The virtue of meekness subduing anger for spiritual discernment.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
  ),
  "MAT-5-6": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XV)",
      "eastern-patristic",
      "He does not say 'blessed are they who seek righteousness,' but 'who hunger and thirst for it' — exhibiting an insatiable craving that will not be turned aside.",
      "NPNF 1/10, Homily 15 on Matthew",
      true,
      "Passionate longing for evangelical holiness.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "Martin Luther",
      "Commentary on the Sermon on the Mount",
      "lutheran",
      "This hunger is the appetite of faith, which knows its own unworthiness and pants after the righteousness of Christ given freely in the gospel.",
      "Luther, Comm. Sermon on the Mount, Matt. 5:6",
      true,
      "The appetite of faith hungering for imputed righteousness.",
      "https://ccel.org/ccel/luther/good_works/good_works.ii.html",
    ),
  ),
  "MAT-5-7": desk(
    card(
      "Gregory of Nyssa",
      "Homilies on the Beatitudes 5",
      "eastern-patristic",
      "Mercy is the parent of affection, the guarantee of love, and the image of the divine nature itself. He who shows mercy puts on the likeness of God.",
      "Gregory of Nyssa, De Beatitudinibus 5",
      true,
      "Mercy as the reflection of the divine character.",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ declares that none can hope for God's mercy who have hardened their bowels against the miseries of their brethren.",
      "Calvin, Comm. Matt. 5:7",
      true,
      "Active compassion as the necessary evidence of receiving divine mercy.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
  ),
  "MAT-5-8": desk(
    card(
      "Augustine",
      "Our Lord's Sermon on the Mount 1",
      "western-patristic",
      "How foolish are they who seek God with external eyes! He is seen with the heart, when the heart is purged of earthly defilement by love.",
      "NPNF 1/6, De Sermone Domini 1.4",
      true,
      "The single eye of a purified heart perceiving the unseen God.",
      "https://www.ccel.org/ccel/schaff/npnf106.html",
    ),
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Purity of heart is the disposition for the beatific vision, wherein the intellect is illuminated by the light of glory to see God as He is.",
      "Aquinas, Catena Aurea, Matt. 5:8",
      true,
      "The beatific vision requires purification from disordered affections.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
  ),
  "MAT-5-9": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XV)",
      "eastern-patristic",
      "The peacemakers not only live in peace themselves, but reconcile enemies, imitating the only-begotten Son who reconciled a fallen race to God.",
      "NPNF 1/10, Homily 15 on Matthew",
      true,
      "Reconciliation between alienated souls reflecting Christ's mediation.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ praises those who study peace, even when provoked; yet true peace can never be bought by surrendering divine truth.",
      "Calvin, Comm. Matt. 5:9",
      true,
      "Evangelical peacemaking rooted in truth without compromise.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
  ),
  "MAT-5-10": desk(
    card(
      "Augustine",
      "Our Lord's Sermon on the Mount 1",
      "western-patristic",
      "Notice the condition: 'for righteousness' sake.' It is not the punishment that makes the martyr, but the cause.",
      "NPNF 1/6, De Sermone Domini 1.5",
      true,
      "The cause of righteousness alone consecrates suffering for Christ.",
      "https://www.ccel.org/ccel/schaff/npnf106.html",
    ),
    card(
      "Martin Luther",
      "Commentary on the Sermon on the Mount",
      "lutheran",
      "If you preach Christ and stand on His Word, the world cannot endure you. Persecution is the infallible badge of faithful discipleship.",
      "Luther, Comm. Sermon on the Mount, Matt. 5:10",
      true,
      "Cross-bearing as the inseparable companion of the confessing gospel.",
      "https://ccel.org/ccel/luther/good_works/good_works.ii.html",
    ),
  ),
  "MAT-5-17": desk(
    card(
      "Augustine",
      "Our Lord's Sermon on the Mount 1.8",
      "western-patristic",
      "He fulfills the law either by doing what it commanded, or by supplying what was lacking, or by granting grace whereby its righteousness might be lived. The Law was given to convict; grace is given to fulfill.",
      "NPNF 1/6, De Sermone Domini 1.8",
      true,
      "The Law reveals transgressions and convicts; grace enables true spiritual fulfillment through love.",
      "https://www.ccel.org/ccel/schaff/npnf106.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ confirms the permanent authority of the Law. The doctrine of the Gospel does not detract from the Law, but establishes its true scope. Christ fulfills it by his perfect obedience, by his expiation on the cross, and by writing it on our hearts.",
      "Calvin, Comm. Matt. 5:17",
      true,
      "Harmony of Law and Gospel; three uses of the Law.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Martin Luther",
      "Commentary on the Sermon on the Mount",
      "lutheran",
      "Christ alone fulfills the demands of the Law on our behalf, bearing its curse and rendering the full satisfaction that no sinner could ever yield. Hence our righteousness is alien, found in Him alone.",
      "Luther, Comm. Sermon on the Mount (1532), Matt. 5:17",
      true,
      "Active and passive obedience of Christ fulfilling the Law for justification.",
      "https://ccel.org/ccel/luther/good_works/good_works.ii.html",
    ),
  ),
  "MAT-5-18": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XVI)",
      "eastern-patristic",
      "Not one jot or tittle shall pass away. Do you see how small the letters He mentions? Indicating that even the least details of scripture carry divine weight and fulfillment.",
      "NPNF 1/10, Homily 16 on Matthew",
      true,
      "The immutable authority and total truthfulness of God's Word.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "There is nothing in the Law that is useless or superfluous; all its promises and moral precepts shall remain inviolate until the end of the world.",
      "Calvin, Comm. Matt. 5:18",
      true,
      "Perpetual validity of the moral law and prophetic promises.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
  ),
  "MAT-5-19": desk(
    card(
      "Augustine",
      "Our Lord's Sermon on the Mount 1.9",
      "western-patristic",
      "He who breaks one of these least commandments and teaches men so will be called least in the kingdom of heaven; that is, will have no place in the kingdom of life.",
      "NPNF 1/6, De Sermone Domini 1.9",
      true,
      "The danger of teaching laxity regarding God's moral law.",
      "https://www.ccel.org/ccel/schaff/npnf106.html",
    ),
    card(
      "Matthew Poole",
      "Annotations upon the Holy Bible",
      "puritan",
      "Christ here rebukes the corrupt scribes who distinguished between great and small precepts, neglecting the moral duties while magnifying ceremonial traditions.",
      "Poole, Annotations on Matt. 5:19",
      true,
      "Against antinomian laxity and rabbinic diminishment of moral obligations.",
      "https://www.ccel.org/ccel/poole/annotations.html",
    ),
  ),
  "MAT-5-20": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XVI)",
      "eastern-patristic",
      "Unless your righteousness exceeds that of the scribes and Pharisees: they observed outward rites, but Christ demands inward purity, rooting out the desire for sin before it breaks into deed.",
      "NPNF 1/10, Homily 16 on Matthew",
      true,
      "Inward holiness surpassing external formalism.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "The Pharisees were content with an external mask of sanctity. Christ requires sincere integrity of heart, showing that true righteousness begins in the inner man.",
      "Calvin, Comm. Matt. 5:20",
      true,
      "Spiritual obedience vs hypocrisy and external legalism.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Martin Luther",
      "Commentary on the Sermon on the Mount",
      "lutheran",
      "The righteousness of the Pharisees was a self-righteous mask that sought merit before God. The righteousness of the Kingdom is faith that receives Christ and brings forth genuine fruits of love.",
      "Luther, Comm. Sermon on the Mount, Matt. 5:20",
      true,
      "The righteousness of faith superseding hypocritical self-merit.",
      "https://ccel.org/ccel/luther/good_works/good_works.ii.html",
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
  "MAT-16-16": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily LIV)",
      "eastern-patristic",
      "Peter confesses: 'Thou art the Christ, the Son of the living God.' He says not 'a son' by grace, but 'the Son' by nature, declaring His eternal and proper deity.",
      "NPNF 1/10, Homily 54 on Matthew",
      true,
      "Peter confesses Christ's genuine Sonship by divine nature.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Peter's confession contains the sum of our faith: that Jesus is the Messiah promised of old, and that He is true God, the fountain of eternal life.",
      "Calvin, Comm. Matt. 16:16",
      true,
      "The bedrock confession of Jesus as Messiah and divine Savior.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
  ),
  "MAT-16-17": desk(
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Flesh and blood hath not revealed it unto thee, but my Father which is in heaven. Hilary says: He is blessed who receives praise for looking beyond human eyes to see the Son of God by the revelation of the Father.",
      "Aquinas, Catena Aurea, Matt. 16:17",
      true,
      "Divine illuminating grace over human reasoning.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily LIV)",
      "eastern-patristic",
      "Christ shows that Peter's knowledge was not of human deduction, but a divine gift communicated directly from the Father.",
      "NPNF 1/10, Homily 54 on Matthew",
      true,
      "The revelation of the Father granting knowledge of the Son.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
  ),
  "MAT-16-18": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily LIV)",
      "eastern-patristic",
      "'On this rock I will build my church' — that is, on the faith of his confession. He did not say upon Peter, for he built His church not on a man, but on the faith of confessing Him as the Son of God.",
      "NPNF 1/10, Homily 54 on Matthew",
      true,
      "The rock is the faith of Peter's confession.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Augustine in his Retractations says: 'The rock was Christ, whom Simon confessed.' Yet Hilary and Leo show Peter rewarded for confessing Christ's divinity with apostolic primacy, that the unity of the Church might be preserved against the gates of hell.",
      "Aquinas, Catena Aurea, Matt. 16:18",
      true,
      "Aquinas compiles Latin and Greek consensus synthesizing Christ as the foundational rock and Peter's confession.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ applies the title of rock not to Peter's person, but to the confession of faith which he uttered. Christ is the only foundation; whoever rests on Peter's person rather than on Christ confesses a mortal foundation that cannot withstand the gates of hell.",
      "Calvin, Comm. Matt. 16:18",
      true,
      "Exegetes the rock as Christ and the confession of Him, refuting papal succession.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Matthew Poole",
      "Annotations upon the Holy Bible",
      "puritan",
      "Upon this rock: either Christ himself, or the doctrine and confession Peter made of him. Upon this rock Christ builds his church, and all the powers of darkness shall never overthrow it.",
      "Poole, Annotations on Matt. 16:18",
      true,
      "The Church founded on the doctrinal truth of Christ confessed.",
      "https://www.ccel.org/ccel/poole/annotations.html",
    ),
  ),
  "MAT-28-18": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XC)",
      "eastern-patristic",
      "'All power is given unto me in heaven and in earth.' He speaks this according to His human nature, which He assumed for our salvation; as God He possessed all things eternally, but now as our victorious Head He receives all dominion.",
      "NPNF 1/10, Homily 90 on Matthew",
      true,
      "Apostolic empowerment and divine omnipresence.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ claims universal dominion over heaven and earth, not that He began to reign only then as God, but that as Mediator He was inaugurated as King over all creatures. By this authority He commissions the preaching of the Word and the administration of Sacraments.",
      "Calvin, Comm. Matt. 28:18–20",
      true,
      "The universal domain of Christ and the authority of Word and Sacraments.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Matthew Poole",
      "Annotations upon the Holy Bible",
      "puritan",
      "All power is given unto me: a supreme, sovereign, universal power as Mediator to conquer enemies, forgive sins, call the Gentiles, and govern His church.",
      "Poole, Annotations on Matt. 28:18",
      true,
      "The sovereign mediatorial power of the risen Lord.",
      "https://www.ccel.org/ccel/poole/annotations.html",
    ),
  ),
  "MAT-28-19": desk(
    card(
      "Basil the Great",
      "On the Holy Spirit 10",
      "eastern-patristic",
      "We are baptized into the name, not the names — one name of Father, Son, and Holy Spirit, that the distinction of persons may not break the unity of Godhead.",
      "NPNF 2/8, De Spiritu Sancto 10",
    ),
    card(
      "John Calvin",
      "Commentary on Matthew 28:19",
      "reformed",
      "The command is to make disciples, not mere hearers; baptism is the seal of that teaching, in the name of the Triune God.",
      "Calvin, Comm. Matt. 28:19",
      true,
      "Discipling the nations through the ministry of the Word and baptism.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Thomas Aquinas",
      "Catena Aurea on Matthew",
      "scholastic",
      "Jerome says: They first teach all nations, then dip those who are taught in water. For the body cannot receive the sacrament of baptism unless the soul has before received the truth of the faith.",
      "Aquinas, Catena Aurea, Matt. 28:19",
      true,
      "Catechesis precedes sacramental baptism in the apostolic mandate.",
      "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
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
  "MAT-28-20": desk(
    card(
      "John Chrysostom",
      "Homilies on Matthew (Homily XC)",
      "eastern-patristic",
      "'Lo, I am with you always, even unto the end of the world.' Do you mark His power and authority? He speaks not to the disciples only, but to all who should believe after them. He is present not by bodily appearance, but by divine majesty and grace.",
      "NPNF 1/10, Homily 90 on Matthew",
      true,
      "Apostolic empowerment and divine omnipresence continuing to the consummation.",
      "https://www.ccel.org/ccel/schaff/npnf110.html",
    ),
    card(
      "John Calvin",
      "Commentary on a Harmony of the Evangelists",
      "reformed",
      "Christ promises that He will never abandon His church. Though removed from our sight into heaven, He is present by the power of His Spirit to defend and preserve His people against all adversaries.",
      "Calvin, Comm. Matt. 28:20",
      true,
      "Perpetual spiritual presence of Christ sustaining the Church.",
      "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
    ),
    card(
      "Matthew Poole",
      "Annotations upon the Holy Bible",
      "puritan",
      "I am with you alway: not in body, but by my Spirit, my grace, my providence, and my blessing, upholding the ministry of the gospel to the end of time.",
      "Poole, Annotations on Matt. 28:20",
      true,
      "The comforting promise of spiritual guidance and protection.",
      "https://www.ccel.org/ccel/poole/annotations.html",
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
  "ROM-9-16": desk(
    card(
      "Augustine",
      "Enchiridion",
      "patristic",
      "It is not therefore of him that willeth, nor of him that runneth, but of God that showeth mercy; not because man cannot will and run, but because God prepares the will and grants the strength.",
      "Augustine, Enchiridion 98",
      false,
      undefined,
      "https://www.newadvent.org/fathers/1302.htm",
    ),
    card(
      "John Chrysostom",
      "Homilies on Romans",
      "patristic",
      "When he says, It is not of him that willeth, nor of him that runneth, he does not take away free choice, but shows that the whole is not of man's labor, but needs the grace from above.",
      "Chrysostom, Hom. in Rom. 16",
      false,
      undefined,
      "https://www.newadvent.org/fathers/210216.htm",
    ),
    card(
      "John Calvin",
      "Commentary on Romans",
      "reformed",
      "We must infer that God's mercy is not the result of our willing or striving, but that both willing and striving are the fruit and effect of that grace which God freely bestows.",
      "Calvin, Comm. Rom. 9:16",
      false,
      undefined,
      "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.i.html",
    ),
    card(
      "Matthew Henry",
      "Commentary on the Whole Bible",
      "reformed",
      "The salvation of souls is not resolved into the will of man, nor into any endeavors of ours, as the first moving cause, but into the free grace and sovereign mercy of God alone.",
      "Henry, Comm. Romans 9:16",
      false,
      undefined,
      "https://ccel.org/ccel/henry/mhc5/mhc5.Rom.ix.html",
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

export const CURATED_ENTRIES: CuratedReceptionEntry[] = [
  // Matthew 1:21-23
  {
    verseRef: "MAT.1.21",
    sourceId: "chrysostom-matthew",
    excerpt: "He shall save His people; not the Jewish people only, but the whole world that comes to Him. He says not 'from visible enemies or tyrants,' but 'from their sins' — a warfare of soul, requiring divine power.",
    theologicalNote: "Chrysostom emphasizes the angelic announcement distinguishing Christ's spiritual salvation from nationalistic messianic expectations.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily IV)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 4 on Matthew",
  },
  {
    verseRef: "MAT.1.21",
    sourceId: "calvin-harmony-matthew",
    excerpt: "The name Jesus signifies Savior. The angel announces that He will redeem His people from their sins, correcting the common error of the Jews who looked for an earthly monarch to deliver them from Roman servitude.",
    theologicalNote: "Calvin highlights Christ as Savior from spiritual guilt and bondage, refuting carnal expectations of a temporal kingdom.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 1:21",
  },
  {
    verseRef: "MAT.1.21",
    sourceId: "poole-annotations-matthew",
    excerpt: "His name is called Jesus, a Savior, because he saves from the guilt, power, and punishment of sin; not by a temporal deliverance, but by eternal redemption.",
    theologicalNote: "Poole expounds the triple deliverance of justification, sanctification, and glorification.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations on Matt. 1:21",
  },
  {
    verseRef: "MAT.1.22",
    sourceId: "aquinas-catena-matthew",
    excerpt: "Jerome says: 'That it might be fulfilled which was spoken of the Lord by the prophet. Not that the event happened only that the prophecy might be fulfilled, but that the prophet foresaw the future and the divine decree was accomplished.'",
    theologicalNote: "Scholastic synthesis on divine sovereignty, prophecy, and teleological fulfillment in Christ.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on Matthew",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea, Matt. 1:22",
  },
  {
    verseRef: "MAT.1.23",
    sourceId: "aquinas-catena-matthew",
    excerpt: "Jerome says: The Hebrew word alma signifies a virgin hidden and kept secret. Augustine adds: She who conceived without concupiscence remained a virgin in bearing and after bearing. He is truly Immanuel, God with us in the assumption of our flesh.",
    theologicalNote: "Aquinas compiles Patristic consensus from Jerome and Augustine affirming the perpetual virginity and the hypostatic union in Isaiah 7:14.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on Matthew",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea, Matt. 1:22–23",
  },
  {
    verseRef: "MAT.1.23",
    sourceId: "chrysostom-matthew",
    excerpt: "They shall call His name Immanuel, which is, God with us. He did not say 'thou shalt call,' but 'they shall call' — that is, the events and deeds shall proclaim Him God with us.",
    theologicalNote: "Chrysostom on the divine identity of the incarnate Word manifest in His works.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily V)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 5 on Matthew",
  },
  {
    verseRef: "MAT.1.23",
    sourceId: "calvin-harmony-matthew",
    excerpt: "God has descended to us that we might ascend to Him; by taking our flesh He has united our lowliness with the divine majesty. Immanuel is not a bare title, but the substance of our salvation.",
    theologicalNote: "Calvin on the mediator uniting divine majesty with human flesh.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 1:23",
  },
  {
    verseRef: "MAT.1.23",
    sourceId: "poole-annotations-matthew",
    excerpt: "Immanuel: God with us, not only by his essential presence, but by personal union, God and man in one person; and covenantally, reconciling God to man by his blood.",
    theologicalNote: "Poole expounds Immanuel as the mediator of the covenant of grace in two natures.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations on Matt. 1:23",
  },

  // Matthew 5:3-10, 17-20
  {
    verseRef: "MAT.5.3",
    sourceId: "chrysostom-matthew",
    excerpt: "What is 'poor in spirit'? The humble and contrite in mind. As pride was the root of all wickedness, Christ sets humility as the first foundation of virtue; unless this be laid, whatever virtues you build will fall.",
    theologicalNote: "Humility as the foundation of virtue.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily XV)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 15 on Matthew",
  },
  {
    verseRef: "MAT.5.3",
    sourceId: "aquinas-catena-matthew",
    excerpt: "Augustine explains: The proud seek after an earthly kingdom; the poor in spirit, who are not puffed up with the pride of riches or knowledge, possess the kingdom of heaven. Jerome adds: Those who are voluntary in poverty for the Spirit's sake.",
    theologicalNote: "Interior detachment and poverty of spirit over self-glory.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on Matthew",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea, Matt. 5:3",
  },
  {
    verseRef: "MAT.5.3",
    sourceId: "calvin-harmony-matthew",
    excerpt: "Those are poor in spirit who, brought to nothing in themselves and terrified by the consciousness of their spiritual poverty, betake themselves to the mercy of God. For grace is poured only into empty vessels.",
    theologicalNote: "Radical reduction to self-despair to receive sovereign grace.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 5:3",
  },
  {
    verseRef: "MAT.5.3",
    sourceId: "luther-sermon-mount",
    excerpt: "To be poor in spirit does not mean begging or walking barefoot, but holding oneself destitute before God, having no trust in one's own righteousness, and clinging solely to Christ's promise by faith.",
    theologicalNote: "Faith grasping Christ outside human boasting.",
    voice: "Martin Luther",
    work: "Commentary on the Sermon on the Mount",
    tradition: "lutheran",
    citation: "Luther, Comm. Sermon on the Mount (1532), Matt. 5:3",
  },
  {
    verseRef: "MAT.5.17",
    sourceId: "augustine-sermon-mount",
    excerpt: "He fulfills the law either by doing what it commanded, or by supplying what was lacking, or by granting grace whereby its righteousness might be lived. The Law was given to convict; grace is given to fulfill.",
    theologicalNote: "The Law reveals transgressions and convicts; grace enables true spiritual fulfillment through love.",
    voice: "Augustine",
    work: "Our Lord's Sermon on the Mount 1.8",
    tradition: "western-patristic",
    citation: "NPNF 1/6, De Sermone Domini 1.8",
  },
  {
    verseRef: "MAT.5.17",
    sourceId: "calvin-harmony-matthew",
    excerpt: "Christ confirms the permanent authority of the Law. The doctrine of the Gospel does not detract from the Law, but establishes its true scope. Christ fulfills it by his perfect obedience, by his expiation on the cross, and by writing it on our hearts.",
    theologicalNote: "Harmony of Law and Gospel; three uses of the Law.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 5:17",
  },
  {
    verseRef: "MAT.5.17",
    sourceId: "luther-sermon-mount",
    excerpt: "Christ alone fulfills the demands of the Law on our behalf, bearing its curse and rendering the full satisfaction that no sinner could ever yield. Hence our righteousness is alien, found in Him alone.",
    theologicalNote: "Active and passive obedience of Christ fulfilling the Law for justification.",
    voice: "Martin Luther",
    work: "Commentary on the Sermon on the Mount",
    tradition: "lutheran",
    citation: "Luther, Comm. Sermon on the Mount (1532), Matt. 5:17",
  },

  // Matthew 16:16-18
  {
    verseRef: "MAT.16.16",
    sourceId: "chrysostom-matthew",
    excerpt: "Peter confesses: 'Thou art the Christ, the Son of the living God.' He says not 'a son' by grace, but 'the Son' by nature, declaring His eternal and proper deity.",
    theologicalNote: "Peter confesses Christ's genuine Sonship by divine nature.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily LIV)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 54 on Matthew",
  },
  {
    verseRef: "MAT.16.18",
    sourceId: "chrysostom-matthew",
    excerpt: "'On this rock I will build my church' — that is, on the faith of his confession. He did not say upon Peter, for he built His church not on a man, but on the faith of confessing Him as the Son of God.",
    theologicalNote: "The rock is the faith of Peter's confession.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily LIV)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 54 on Matthew",
  },
  {
    verseRef: "MAT.16.18",
    sourceId: "aquinas-catena-matthew",
    excerpt: "Augustine in his Retractations says: 'The rock was Christ, whom Simon confessed.' Yet Hilary and Leo show Peter rewarded for confessing Christ's divinity with apostolic primacy, that the unity of the Church might be preserved against the gates of hell.",
    theologicalNote: "Aquinas compiles Latin and Greek consensus synthesizing Christ as the foundational rock and Peter's confession.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on Matthew",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea, Matt. 16:18",
  },
  {
    verseRef: "MAT.16.18",
    sourceId: "calvin-harmony-matthew",
    excerpt: "Christ applies the title of rock not to Peter's person, but to the confession of faith which he uttered. Christ is the only foundation; whoever rests on Peter's person rather than on Christ confesses a mortal foundation that cannot withstand the gates of hell.",
    theologicalNote: "Exegetes the rock as Christ and the confession of Him, refuting papal succession.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 16:18",
  },

  // Matthew 28:18-20
  {
    verseRef: "MAT.28.18",
    sourceId: "chrysostom-matthew",
    excerpt: "'All power is given unto me in heaven and in earth.' He speaks this according to His human nature, which He assumed for our salvation; as God He possessed all things eternally, but now as our victorious Head He receives all dominion.",
    theologicalNote: "Apostolic empowerment and divine omnipresence.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily XC)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 90 on Matthew",
  },
  {
    verseRef: "MAT.28.18",
    sourceId: "calvin-harmony-matthew",
    excerpt: "Christ claims universal dominion over heaven and earth, not that He began to reign only then as God, but that as Mediator He was inaugurated as King over all creatures. By this authority He commissions the preaching of the Word and the administration of Sacraments.",
    theologicalNote: "The universal domain of Christ and the authority of Word and Sacraments.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 28:18–20",
  },
  {
    verseRef: "MAT.28.20",
    sourceId: "chrysostom-matthew",
    excerpt: "'Lo, I am with you always, even unto the end of the world.' Do you mark His power and authority? He speaks not to the disciples only, but to all who should believe after them. He is present not by bodily appearance, but by divine majesty and grace.",
    theologicalNote: "Apostolic empowerment and divine omnipresence continuing to the consummation.",
    voice: "John Chrysostom",
    work: "Homilies on Matthew (Homily XC)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/10, Homily 90 on Matthew",
  },
  {
    verseRef: "MAT.28.20",
    sourceId: "calvin-harmony-matthew",
    excerpt: "Christ promises that He will never abandon His church. Though removed from our sight into heaven, He is present by the power of His Spirit to defend and preserve His people against all adversaries.",
    theologicalNote: "Perpetual spiritual presence of Christ sustaining the Church.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists",
    tradition: "reformed",
    citation: "Calvin, Comm. Matt. 28:20",
  },
  // MARK
  // Mark 10:45
  {
    verseRef: "MRK.10.45",
    sourceId: "aquinas-catena-mark",
    excerpt:
      "Chrysostom observes: Earthly princes rule to dominate and strip their subjects, but Christ came not to be ministered unto, but to minister, and to give His life a ransom for many. His servitude is not weakness, but the supreme exercise of kingly love and divine authority.",
    theologicalNote:
      "Christ's voluntary servant-kingship and self-humiliation as a redemptive ransom, contrasting worldly tyranny with the kingdom of God.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of Mark (quoting Chrysostom)",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on Mark 10:45",
  },
  {
    verseRef: "MRK.10.45",
    sourceId: "calvin-mark",
    excerpt:
      "Christ declares that the price of our redemption was His death. By the word ransom (lutron) He shows that our reconciliation with God was purchased by His blood, for we were captives under the curse of sin until He substituted Himself in our room.",
    theologicalNote:
      "Substitutionary atonement: Christ purchasing reconciliation with God by shedding His blood in our place.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Mark)",
    tradition: "reformed",
    citation: "Calvin, Comm. Mark 10:45",
  },
  {
    verseRef: "MRK.10.45",
    sourceId: "poole-mark",
    excerpt:
      "A ransom for many: that is, a vicarious price of satisfaction given to divine justice in the stead of sinners, that all who believe might be delivered from wrath and death.",
    theologicalNote:
      "Vicarious satisfaction satisfying divine justice on behalf of sinners.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible: Mark",
    tradition: "reformed",
    citation: "Poole, Annotations on Mark 10:45",
  },
  // Mark 15:34
  {
    verseRef: "MRK.15.34",
    sourceId: "calvin-mark",
    excerpt:
      "Christ does not utter this cry in despair, nor was the hypostatic union dissolved or the Father ever truly angry with His beloved Son. Rather, in His human nature He felt the dreadful weight of the divine curse against our sins, enduring the terror of divine judgment in our place, without rupture of the Trinity.",
    theologicalNote:
      "Christ enduring the terror of divine judgment in our place, without rupture of the Trinity.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Mark)",
    tradition: "reformed",
    citation: "Calvin, Comm. Mark 15:34",
  },
  {
    verseRef: "MRK.15.34",
    sourceId: "aquinas-catena-mark",
    excerpt:
      "Bede writes: Our Lord uttered these words from the Psalm, speaking in the person of our human nature which He had assumed, showing that He felt the reality of death and affliction, yet maintaining uncorrupted obedience to the Father.",
    theologicalNote:
      "Christ speaking from the reality of His assumed human nature and passion.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of Mark",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on Mark 15:34",
  },
  {
    verseRef: "MRK.15.34",
    sourceId: "poole-mark",
    excerpt:
      "Christ was not forsaken as to the personal union, nor as to the Father's love, but as to the sensible manifestations of His favour and the suspension of comforting influences while bearing the penal curse of the law.",
    theologicalNote:
      "Suspension of sensible divine comfort during penal bearing of the law's curse.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible: Mark",
    tradition: "reformed",
    citation: "Poole, Annotations on Mark 15:34",
  },
  // LUKE
  // Luke 1:46–48 (Magnificat)
  {
    verseRef: "LUK.1.46",
    sourceId: "ambrose-luke",
    excerpt:
      "Let Mary's soul be in each of you to magnify the Lord; let her spirit be in each of you to rejoice in God. The soul magnifies the Lord not by adding anything to His divine majesty, but when His image shines forth clearly in our inner life through grace.",
    theologicalNote:
      "Mary exalting the Lord in her soul, looking to divine grace.",
    voice: "Ambrose of Milan",
    work: "Exposition of the Holy Gospel according to Saint Luke",
    tradition: "western-patristic",
    citation: "Ambrose, Expos. Evang. Lucam 2.19",
  },
  {
    verseRef: "LUK.1.47",
    sourceId: "ambrose-luke",
    excerpt:
      "My spirit hath rejoiced in God my Savior. She rejoices in Him who is the Savior of all, acknowledging that her redemption and maternal dignity spring from the same divine grace.",
    theologicalNote:
      "Rejoicing in God the Savior as the source of all salvation and blessing.",
    voice: "Ambrose of Milan",
    work: "Exposition of the Holy Gospel according to Saint Luke",
    tradition: "western-patristic",
    citation: "Ambrose, Expos. Evang. Lucam 2.21",
  },
  {
    verseRef: "LUK.1.48",
    sourceId: "luther-magnificat",
    excerpt:
      "Mary does not boast of her worthiness or virtues, but praises God's pure grace alone. God looks not upon worthiness or merit, but purely upon lowliness and sovereign mercy, casting down the proud and exalting the humble that all flesh may glory in the Lord alone.",
    theologicalNote:
      "God looks not upon worthiness or merit, but purely upon lowliness and sovereign mercy.",
    voice: "Martin Luther",
    work: "Exposition of the Magnificat (1521)",
    tradition: "lutheran",
    citation: "Luther, The Magnificat (1521), on Luke 1:48",
  },
  {
    verseRef: "LUK.1.46",
    sourceId: "calvin-luke",
    excerpt:
      "Mary attributes nothing to her own merits, but ascribes the entire glory of her election and calling to the gratuitous goodness of God. The word lowliness (tapeinosis) does not denote a virtue of humility, but an abject and despised condition exalted by sheer grace.",
    theologicalNote:
      "Gratuitous election and sovereign mercy celebrated in the Magnificat.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Luke)",
    tradition: "reformed",
    citation: "Calvin, Comm. Luke 1:46–48",
  },
  {
    verseRef: "LUK.1.48",
    sourceId: "calvin-luke",
    excerpt:
      "Mary praises the divine mercy for looking upon her low estate. She was not selected because of any inherent fitness or excellence, but to demonstrate that God chooses the foolish and weak things of the world to confound the mighty.",
    theologicalNote:
      "God's grace exalting the lowly without regard to human prestige or desert.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Luke)",
    tradition: "reformed",
    citation: "Calvin, Comm. Luke 1:48",
  },
  // Luke 18:13–14 (Pharisee and Tax Collector)
  {
    verseRef: "LUK.18.13",
    sourceId: "cyril-luke",
    excerpt:
      "Pride nullifies external deeds and destroys the fruit of virtues, even when one fasts and tithes. But the tax collector, standing afar off and smiting his breast, confessed his unworthiness; his contrite confession attained righteous justification before God.",
    theologicalNote:
      "Pride nullifies external deeds; contrite confession attains righteousness.",
    voice: "Cyril of Alexandria",
    work: "Commentary on the Gospel of Saint Luke (Homily 120)",
    tradition: "eastern-patristic",
    citation: "Cyril, Homily 120 on Luke",
    url: "https://www.ccel.org/ccel/pearse/morefathers/files/cyril_on_luke_13_sermons_135_145.htm",
  },
  {
    verseRef: "LUK.18.14",
    sourceId: "calvin-luke",
    excerpt:
      "This parable establishes the doctrine of justification: God justifies only those who are thoroughly cast down, who bring nothing of their own, but fly to unmerited mercy by faith alone. Justification is the gracious imputation of righteousness, not the reward of human merit.",
    theologicalNote:
      "The absolute necessity of sola fide and self-renunciation for justification.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Luke)",
    tradition: "reformed",
    citation: "Calvin, Comm. Luke 18:13–14",
  },
  {
    verseRef: "LUK.18.14",
    sourceId: "aquinas-catena-luke",
    excerpt:
      "Augustine observes: The Pharisee praised himself rather than God; the publican confessed his sin and looked for mercy. He that humbleth himself shall be exalted, because God dwelleth in the contrite heart.",
    theologicalNote:
      "Humility and contrite sorrow justified over proud self-exaltation.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of Luke",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on Luke 18:13–14",
  },
  {
    verseRef: "LUK.18.13",
    sourceId: "calvin-luke",
    excerpt:
      "The tax collector stood afar off, conscious of his uncleanness, not daring even to lift his eyes to heaven. He smote his breast, acknowledging his heart to be a fountain of iniquity, and pleaded solely for propitiation through divine mercy.",
    theologicalNote:
      "The posture of genuine evangelical repentance pleading solely for propitiation.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Luke)",
    tradition: "reformed",
    citation: "Calvin, Comm. Luke 18:13",
  },
  // Luke 23:42–43 (Penitent Thief)
  {
    verseRef: "LUK.23.42",
    sourceId: "aquinas-catena-luke",
    excerpt:
      "Chrysostom exclaims: What power of faith was this! Who taught this thief? He saw Christ crucified, reviled, and dying, yet he confessed Him as King and prayed, 'Lord, remember me when Thou comest into Thy kingdom.' His faith grasped Christ's eternal majesty when even the Apostles fled.",
    theologicalNote:
      "Faith grasping Christ’s kingdom even upon the cross.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of Luke (quoting Chrysostom)",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on Luke 23:42–43",
  },
  {
    verseRef: "LUK.23.43",
    sourceId: "calvin-luke",
    excerpt:
      "The penitent thief is an enduring monument of gratuitous justification. He brings no merits, no good works, no satisfactions, but having lived in violence and robbery, he is received immediately into Paradise by faith alone through the grace of Christ.",
    theologicalNote:
      "The thief as an enduring monument of gratuitous justification without prior meritorious works.",
    voice: "John Calvin",
    work: "Commentary on a Harmony of the Evangelists (Luke)",
    tradition: "reformed",
    citation: "Calvin, Comm. Luke 23:42–43",
  },
  {
    verseRef: "LUK.23.43",
    sourceId: "ambrose-luke",
    excerpt:
      "Verily I say unto thee, Today shalt thou be with Me in Paradise. Life is to be with Christ; for where Christ is, there is His kingdom and life everlasting.",
    theologicalNote:
      "Paradise as intimate communion with Christ, bestowed immediately by grace.",
    voice: "Ambrose of Milan",
    work: "Exposition of the Holy Gospel according to Saint Luke",
    tradition: "western-patristic",
    citation: "Ambrose, Expos. Evang. Lucam 10.121",
  },
  // JOHN
  // John 1:1
  {
    verseRef: "JHN.1.1",
    sourceId: "chrysostom-john",
    excerpt:
      "The Evangelist said not 'became,' but 'In the beginning was the Word.' By the word 'was' he signifies the eternal, uncreated subsistence of the Logos, that you might understand He is not later than the Father, but ever co-eternal with Him.",
    theologicalNote:
      "Eternal, uncreated hypostatic subsistence of the Logos with the Father.",
    voice: "John Chrysostom",
    work: "Homilies on the Gospel of Saint John (Homily II)",
    tradition: "eastern-patristic",
    citation: "NPNF 1/14, Homily 2 on John",
  },
  {
    verseRef: "JHN.1.1",
    sourceId: "augustine-john",
    excerpt:
      "The Word was not made, for by the Word were all things made. The Word is the eternal Wisdom of the Father, distinct in Person yet identical in divine essence and uncreated substance.",
    theologicalNote:
      "The Word as eternal Wisdom, distinct in person yet identical in divine essence.",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John (Tractate I)",
    tradition: "western-patristic",
    citation: "NPNF 1/7, Tractate 1 on John 1:1",
  },
  {
    verseRef: "JHN.1.1",
    sourceId: "calvin-john",
    excerpt:
      "The Evangelist calls the Son of God the Word, because He is the eternal wisdom and will of God, and the lively image of His purpose, by whom all things were created and are continually sustained.",
    theologicalNote:
      "The Logos as the eternal self-expression of the Father by whom all things are upheld.",
    voice: "John Calvin",
    work: "Commentary on the Gospel According to John",
    tradition: "reformed",
    citation: "Calvin, Comm. John 1:1",
  },
  // John 6:44
  {
    verseRef: "JHN.6.44",
    sourceId: "augustine-john",
    excerpt:
      "Do not think you are drawn against your will; the mind is drawn also by love. Give me one that loves, and he feels what I say. The Father draws not by violent compulsion, but by imparting spiritual delight in Christ.",
    theologicalNote:
      "Divine effectual calling: 'Do not think you are drawn against your will; the mind is drawn by love.'",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John (Tractate XXVI)",
    tradition: "western-patristic",
    citation: "NPNF 1/7, Tractate 26 on John 6:44",
  },
  {
    verseRef: "JHN.6.44",
    sourceId: "calvin-john",
    excerpt:
      "To come to Christ is not within the power of human free will. The human heart is blind and dead until the internal illumination and secret drawing of the Holy Spirit renovates our minds and bends our stubborn wills.",
    theologicalNote:
      "Monergistic regeneration: the human heart is blind and dead until the internal illumination of the Spirit draws it.",
    voice: "John Calvin",
    work: "Commentary on the Gospel According to John",
    tradition: "reformed",
    citation: "Calvin, Comm. John 6:44",
  },
  {
    verseRef: "JHN.6.44",
    sourceId: "aquinas-catena-john",
    excerpt:
      "Chrysostom writes: Lest any should think the Son's power inferior to the Father's, He declares that coming requires the Father's drawing, and the Son raises him up at the last day. The drawing does not take away our will, but confers the desire.",
    theologicalNote:
      "Trinitarian harmony in the drawing of grace and eschatological resurrection.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of John",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on John 6:44",
  },
  // John 10:11
  {
    verseRef: "JHN.10.11",
    sourceId: "augustine-john",
    excerpt:
      "The good shepherd gives His life for the sheep. He who enters by the door is the shepherd; but He who is the door is Himself the shepherd. Through Christ the Mediator we are brought unto the Father, preserved by His blood from the devouring wolf.",
    theologicalNote:
      "Christ as both the only door of access and the self-giving Shepherd whose blood redeems the flock.",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John (Tractate XLVI)",
    tradition: "western-patristic",
    citation: "NPNF 1/7, Tractate 46 on John 10:11–13",
    url: "https://www.newadvent.org/fathers/1701046.htm",
  },
  {
    verseRef: "JHN.10.11",
    sourceId: "calvin-john",
    excerpt:
      "The good shepherd giveth his life for the sheep. From the extraordinary affection which he bears towards the sheep, he shows how truly he acts as a shepherd; for he does not hesitate to die for them, unlike the hireling who flees at the wolf's approach.",
    theologicalNote:
      "The voluntary self-giving of Christ distinguishes the genuine Shepherd from hirelings.",
    voice: "John Calvin",
    work: "Commentary on the Gospel According to John",
    tradition: "reformed",
    citation: "Calvin, Comm. John 10:11",
    url: "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.iii.html",
  },
  {
    verseRef: "JHN.10.11",
    sourceId: "luther-john",
    excerpt:
      "Christ calls Himself the Good Shepherd because He does not drive the sheep with threats or demands of the law, but gives His own life for them and preserves them in grace against the wolf, sin, and death.",
    theologicalNote:
      "Pastoral care grounded in the Gospel of gratuitous redemption rather than legal coercion.",
    voice: "Martin Luther",
    work: "Sermon on John 10:11–16",
    tradition: "lutheran",
    citation: "Luther, Church Postil, Misericordias Domini",
    url: "https://ccel.org/ccel/luther/sermons/sermons.viii.iii.html",
  },
  {
    verseRef: "JHN.10.11",
    sourceId: "poole-john",
    excerpt:
      "It is the property of every good shepherd to hazard his life in defense of his sheep; but Christ did much more than hazard it: he actually laid down his life for the sheep, to pay their ransom and satisfy the divine justice.",
    theologicalNote:
      "The shepherd's voluntary death as substitutionary ransom for the flock.",
    voice: "Matthew Henry",
    work: "Commentary on the Whole Bible",
    tradition: "reformed",
    citation: "Henry, Comm. John 10:11",
    url: "https://ccel.org/ccel/henry/mhc5/mhc5.John.xi.html",
  },
  // John 11:35
  {
    verseRef: "JHN.11.35",
    sourceId: "augustine-john",
    excerpt:
      "Christ did indeed weep, but it was because He willed to weep. He troubled Himself, because He had the power to be troubled or not to be troubled. He wept to teach men to weep with them that weep, and to show the reality of the human nature He had assumed.",
    theologicalNote:
      "Christ's tears as voluntary participation in human grief, demonstrating the reality of His human nature.",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John 49",
    tradition: "patristic",
    citation: "Augustine, In Joannem Tract. 49.19",
    url: "https://www.newadvent.org/fathers/1701049.htm",
  },
  {
    verseRef: "JHN.11.35",
    sourceId: "calvin-john",
    excerpt:
      "Christ does not weep out of an uncontrollable passion, but because He willingly clothes Himself with human affections in order to comfort us. By taking upon Himself our grief and tears, He proves Himself to be our true brother and compassionate high priest.",
    theologicalNote:
      "The genuine humanity and covenant sympathy of the Mediator entering into death's tragedy.",
    voice: "John Calvin",
    work: "Commentary on the Gospel According to John",
    tradition: "reformed",
    citation: "Calvin, Comm. John 11:35",
    url: "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.i.html",
  },
  {
    verseRef: "JHN.11.35",
    sourceId: "henry-john",
    excerpt:
      "Jesus wept. A very short verse, but it affords many useful instructions: that Jesus Christ was really and truly man, subject to the sinless infirmities of our nature; and that He is a compassionate Savior who enters into our sorrows.",
    theologicalNote:
      "Christ's authentic human sorrow and pastoral condescension at the tomb of Lazarus.",
    voice: "Matthew Henry",
    work: "Commentary on the Whole Bible",
    tradition: "reformed",
    citation: "Henry, Comm. John 11:35",
    url: "https://ccel.org/ccel/henry/mhc5/mhc5.John.xii.html",
  },
  {
    verseRef: "JHN.11.35",
    sourceId: "cyril-john",
    excerpt:
      "He wept that He might check our immoderate tears; for in weeping He sanctified tears, showing that human nature is not forbidden to mourn, while simultaneously confirming that He who was truly God was also genuinely and fleshly man.",
    theologicalNote:
      "Sanctification of human tears and verification of the two natures united in Christ.",
    voice: "Cyril of Alexandria",
    work: "Commentary on the Gospel of St. John",
    tradition: "patristic",
    citation: "Cyril of Alexandria, In Joannem 7.1",
  },
  // John 14:6
  {
    verseRef: "JHN.14.6",
    sourceId: "aquinas-catena-john",
    excerpt:
      "Augustine writes: Christ is the Way according to His humanity; He is the Truth and the Life according to His divinity. Following Him in His humanity, we arrive at His divinity; if you abide in the Way, you shall not err.",
    theologicalNote:
      "Christ as the Way in His humanity, the Truth and Life in His divinity.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of John",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on John 14:6",
  },
  {
    verseRef: "JHN.14.6",
    sourceId: "calvin-john",
    excerpt:
      "Apart from Christ, all paths lead to destruction, all wisdom is falsehood, and all life is only eternal death. In Him alone is the full and true revelation of the Father, and through Him alone do we have access to God.",
    theologicalNote:
      "Apart from Christ, all paths lead to destruction; in Him alone is the full revelation of the Father.",
    voice: "John Calvin",
    work: "Commentary on the Gospel According to John",
    tradition: "reformed",
    citation: "Calvin, Comm. John 14:6",
    url: "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.i.html",
  },
  {
    verseRef: "JHN.14.6",
    sourceId: "augustine-john",
    excerpt:
      "Walk by the Man, and you arrive at God. It is much better to limp along the way than to run briskly off the way; for he who limps in the way, though he makes slow progress, draws nearer to his goal.",
    theologicalNote:
      "Christ's incarnate humanity as the sure way leading into the divine life.",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John (Tractate LXIX)",
    tradition: "western-patristic",
    citation: "NPNF 1/7, Tractate 69 on John 14:6",
    url: "https://www.newadvent.org/fathers/1701069.htm",
  },
  // John 19:30
  {
    verseRef: "JHN.19.30",
    sourceId: "calvin-john",
    excerpt:
      "By this word Christ testifies that the whole work of our redemption is fulfilled and consummated. The righteousness of God is fully satisfied, the curse of the law is abolished, and the complete, all-sufficient sacrifice is offered, leaving no room for human satisfaction or supplementary merits.",
    theologicalNote:
      "The complete, all-sufficient sacrifice: redemption is consummated, leaving no room for human satisfaction.",
    voice: "John Calvin",
    work: "Commentary on the Gospel According to John",
    tradition: "reformed",
    citation: "Calvin, Comm. John 19:30",
    url: "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.vii.html",
  },
  {
    verseRef: "JHN.19.30",
    sourceId: "augustine-john",
    excerpt:
      "All things that had been written concerning Him were finished. Having fulfilled all obedience, He bowed His head and gave up His spirit — not compelled by necessity, but laying down His life by sovereign authority.",
    theologicalNote:
      "Fulfillment of prophecy and Christ's sovereign, voluntary surrender of life.",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John (Tractate CXIX)",
    tradition: "western-patristic",
    citation: "NPNF 1/7, Tractate 119 on John 19:30",
    url: "https://www.newadvent.org/fathers/1701119.htm",
  },
  {
    verseRef: "JHN.19.30",
    sourceId: "aquinas-catena-john",
    excerpt:
      "Chrysostom writes: It is finished — that is, the prophecy was accomplished, sin expiated, and the devil vanquished. Christ died not in weakness, but as Lord of life and death, having accomplished all that the Father gave Him to do.",
    theologicalNote:
      "Triumphant consummation of the redemptive mission over sin and death.",
    voice: "Thomas Aquinas",
    work: "Catena Aurea on the Gospel of John",
    tradition: "scholastic",
    citation: "Aquinas, Catena Aurea on John 19:30",
  },
  // ---------------------------------------------------------------- Romans 1
  {
    verseRef: "ROM.1.16",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He says he is not ashamed, because the cross seemed a shameful thing to those who did not know its power. To the Greeks it was folly and to the Jews a stumbling-block, yet it is the power of God, and Paul glories in what others blush at.",
    theologicalNote:
      "Chrysostom reads the negation as deliberate understatement against the honour culture of his hearers: the gospel's shamefulness is precisely where its power is located.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 1:16",
  },
  {
    verseRef: "ROM.1.16",
    sourceId: "calvin-romans",
    excerpt:
      "The gospel is called the power of God to salvation because in it God puts forth his power to save. It is not a bare narrative of things done, but the instrument by which God works, and it is effectual to none but those who believe.",
    theologicalNote:
      "Calvin makes the gospel instrumentally causal rather than merely informative, which grounds his doctrine of the Word as a means of grace.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 1:16",
  },
  {
    verseRef: "ROM.1.16",
    sourceId: "poole-annotations",
    excerpt:
      "To the Jew first: not in dignity of privilege, but in order of time and offer; the gospel was first preached at Jerusalem, and the Jews had the first refusal of it, and by their refusal it passed to the Greek.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 1:16",
  },
  {
    verseRef: "ROM.1.17",
    sourceId: "luther-romans",
    excerpt:
      "I had hated that phrase, the righteousness of God, because I had been taught to understand it as the righteousness by which God is righteous and punishes the unrighteous. At last I saw that it is the righteousness by which the merciful God justifies us by faith, and I felt myself to be reborn and to have gone through open doors into paradise.",
    theologicalNote:
      "Luther's own account, in the 1545 preface to his Latin writings, of reading iustitia Dei as a righteousness given rather than demanded. This is the hinge of the Reformation reading of Romans; the medieval tradition it turns from had read the phrase distributively, not as a genitive of origin.",
    voice: "Martin Luther",
    work: "Preface to the Latin Writings (1545) and Lectures on Romans",
    tradition: "lutheran",
    citation: "Luther, WA 54:185-186; Lectures on Romans, at 1:17",
  },
  {
    verseRef: "ROM.1.17",
    sourceId: "calvin-romans",
    excerpt:
      "The righteousness of God is not that by which he is himself righteous, but that which he bestows and imputes; and it is revealed from faith to faith, that is, it begins in faith and grows by daily increase of the same faith.",
    theologicalNote:
      "Calvin agrees with Luther on the genitive but reads 'from faith to faith' as growth rather than as two stages of covenant history.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 1:17",
  },
  {
    verseRef: "ROM.1.17",
    sourceId: "aquinas-romans",
    excerpt:
      "The justice of God is revealed in the gospel because through faith in Christ men are made just, God infusing the justice by which they are made righteous; and the just man lives by faith, since faith is the first principle of the spiritual life.",
    theologicalNote:
      "Aquinas reads the righteousness as infused rather than imputed. Read alongside Luther above, this is the point on which the sixteenth-century division actually turns; Trent, Session VI, canon 11, states the Catholic position in its own terms.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 1:17",
  },
  {
    verseRef: "ROM.1.20",
    sourceId: "augustine-romans",
    excerpt:
      "The invisible things of God are understood by the things that are made. The philosophers saw the truth, and had it not; they knew whither to go and knew not the way, for they saw the country from a wooded height and did not find the road that leads to it.",
    theologicalNote:
      "Augustine grants the pagan philosophers real knowledge of God from creation and denies them the means of reaching him, which is why the passage grounds culpability rather than natural theology's sufficiency.",
    voice: "Augustine of Hippo",
    work: "Confessions VII and On the Trinity",
    tradition: "western-patristic",
    citation: "Augustine, Conf. VII.20-21; cf. Civ. Dei VIII.10",
  },
  {
    verseRef: "ROM.1.20",
    sourceId: "calvin-romans",
    excerpt:
      "God has so manifested himself in the workmanship of the world that men cannot open their eyes without being compelled to see him. There is within the human mind an awareness of divinity, and this leaves them without excuse, though it does not lead them to salvation.",
    theologicalNote:
      "The sensus divinitatis of Institutes 1.3 stated exegetically: revelation in creation suffices to condemn, never to save.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 1:20; cf. Inst. 1.3.1",
  },
  {
    verseRef: "ROM.1.20",
    sourceId: "aquinas-romans",
    excerpt:
      "From the things that are made the human reason can come to know that God is, and what he is not, and the relation of creatures to him. This knowledge is possible to reason, but it comes to few men, after long time, and mixed with many errors.",
    theologicalNote:
      "Aquinas takes the verse as warrant for a natural knowledge of God's existence while conceding its practical scarcity. The concession is often missed by both his defenders and his Protestant critics.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 1:20; cf. ST I q.2 a.2",
  },
  {
    verseRef: "ROM.1.24",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "God gave them up: not that he drove them to it, but that he withdrew his help and left them to themselves. As a physician who is despised leaves the sick man, so God, being abandoned first, abandoned them; the abandonment is a consequence, not a cause.",
    theologicalNote:
      "Chrysostom guards divine impassibility and human responsibility by reading the handing-over as permissive withdrawal. Augustine and the later Reformed tradition read it more actively; the difference matters for how Romans 9 is later handled.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 1:24",
  },
  {
    verseRef: "ROM.1.24",
    sourceId: "calvin-romans",
    excerpt:
      "God gave them up, not by a bare permission, but by a just judgment: the sinner is punished with sin, and the withdrawal of grace is itself a sentence. Yet the fault is wholly theirs, for God only ceases to restrain what was already corrupt.",
    theologicalNote:
      "Calvin explicitly rejects the permissive reading Chrysostom offers, while keeping the guilt entirely on the creature.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 1:24",
  },
  {
    verseRef: "ROM.1.24",
    sourceId: "henry-romans",
    excerpt:
      "Spiritual judgments are the sorest of all judgments. When God gives men over to their own hearts' lusts, he says in effect, Let them alone; and there is no surer sign of a soul abandoned than to sin without restraint and without remorse.",
    voice: "Matthew Henry",
    work: "Commentary on the Whole Bible",
    tradition: "reformed",
    citation: "Henry, Comm. Rom. 1:24-27",
  },

  // ---------------------------------------------------------------- Romans 2
  {
    verseRef: "ROM.2.4",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "The goodness of God leads you to repentance. He did not say, brings you, but leads you, that you may learn that the will is not compelled. God's forbearance is an invitation, and to despise it is to treasure up wrath against the day of wrath.",
    theologicalNote:
      "Chrysostom presses the verb to protect the freedom of the will, a reading the Greek fathers generally share and the Augustinian tradition qualifies.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 2:4",
  },
  {
    verseRef: "ROM.2.4",
    sourceId: "calvin-romans",
    excerpt:
      "The design of God's kindness is to lead men to repentance; that it does not do so in the reprobate is not the fault of the kindness but of their hardness. They turn the medicine into poison, and abuse the delay of judgment as a licence.",
    theologicalNote:
      "Calvin distinguishes the intent of the means from its effect, the move that lets him hold universal forbearance together with particular election.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 2:4",
  },
  {
    verseRef: "ROM.2.4",
    sourceId: "poole-annotations",
    excerpt:
      "Riches of goodness, forbearance, and long-suffering: three words for one mercy, heaped up because men are so slow to feel it. God's patience is not connivance; the sinner who reckons on it as such is despising the very thing that would save him.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 2:4",
  },
  {
    verseRef: "ROM.2.14",
    sourceId: "aquinas-romans",
    excerpt:
      "The Gentiles who have not the law do by nature the things of the law, because there is in man a natural light by which he discerns good and evil, and this is the imprint of the eternal law upon the rational creature.",
    theologicalNote:
      "The verse is the scriptural anchor of the Thomist natural law (ST I-II q.91 a.2). Aquinas does not read it as making the Gentiles savable apart from grace.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 2:14-15; cf. ST I-II q.91 a.2",
  },
  {
    verseRef: "ROM.2.14",
    sourceId: "calvin-romans",
    excerpt:
      "Paul does not mean that the Gentiles have the law engraved so as to be able to keep it, but that they have enough of the knowledge of righteousness to leave them inexcusable. Conscience is a witness, and its office here is accusation.",
    theologicalNote:
      "Calvin accepts the natural knowledge and denies it any justifying force, which is the standard Reformed qualification of the scholastic reading above.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 2:14-15",
  },
  {
    verseRef: "ROM.2.14",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "See how he shows the Gentile also to be under law, not the written but the natural; and by this he takes away the Jew's boast, for if the Gentile without letters kept what the Jew with letters broke, the letter is no defence.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 2:14",
  },
  {
    verseRef: "ROM.2.29",
    sourceId: "augustine-romans",
    excerpt:
      "Circumcision of the heart is the will purged of carnal desire, which the letter commands and only the Spirit gives. The letter that kills is the law without grace; the Spirit that gives life is grace itself, by which the law is fulfilled.",
    theologicalNote:
      "De spiritu et littera reads the letter/Spirit contrast as law-without-grace against grace, not as literal against allegorical reading, correcting a misuse Augustine himself had once made.",
    voice: "Augustine of Hippo",
    work: "On the Spirit and the Letter",
    tradition: "western-patristic",
    citation: "Augustine, De spiritu et littera 4-8",
  },
  {
    verseRef: "ROM.2.29",
    sourceId: "calvin-romans",
    excerpt:
      "The true Jew is one inwardly, and his praise is not of men but of God. Paul strips the sacrament of all value where the thing signified is absent, yet he does not thereby abolish the sign for those who have the substance.",
    theologicalNote:
      "The sign-and-thing-signified distinction here governs Calvin's whole sacramental theology, including his account of baptism as the successor of circumcision.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 2:28-29",
  },
  {
    verseRef: "ROM.2.29",
    sourceId: "poole-annotations",
    excerpt:
      "Whose praise is not of men, but of God: there is an allusion to the name Judah, which signifies praise. The inward Jew seeks the commendation of him who sees the heart, and is content to want the applause of those who see only the flesh.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 2:29",
  },

  // ---------------------------------------------------------------- Romans 3
  {
    verseRef: "ROM.3.10",
    sourceId: "augustine-romans",
    excerpt:
      "There is none righteous, no not one. Let no man say he has a righteousness of his own; whatever righteousness a man has, he has received. If you have received it, why do you glory as though you had not received it?",
    theologicalNote:
      "Augustine reads the catena of psalm citations as excluding any prior human merit, the reading that becomes decisive against Pelagius.",
    voice: "Augustine of Hippo",
    work: "On the Spirit and the Letter",
    tradition: "western-patristic",
    citation: "Augustine, De spiritu et littera 27; cf. 1 Cor. 4:7",
  },
  {
    verseRef: "ROM.3.10",
    sourceId: "calvin-romans",
    excerpt:
      "He heaps up testimonies from the Psalms and Isaiah, not to describe some especially wicked men, but to show what the whole race is by nature. What is said of a part is said of all, for all are of one lump.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 3:10-18",
  },
  {
    verseRef: "ROM.3.10",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He brings in the prophet as accuser, that the sentence may not seem his own but God's; and he speaks of the whole nature, that no man might plead the example of another and say, I am no worse than my neighbour.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 3:10",
  },
  {
    verseRef: "ROM.3.20",
    sourceId: "augustine-romans",
    excerpt:
      "By the law is the knowledge of sin. The law was given that grace might be sought, grace was given that the law might be fulfilled. The law is not evil which shows the disease; it is the medicine that is wanting, not the diagnosis.",
    theologicalNote:
      "Augustine's lex data ut gratia quaereretur is the seed of what the Reformed tradition later names the pedagogical or second use of the law.",
    voice: "Augustine of Hippo",
    work: "On the Spirit and the Letter",
    tradition: "western-patristic",
    citation: "Augustine, De spiritu et littera 19.34",
  },
  {
    verseRef: "ROM.3.20",
    sourceId: "luther-romans",
    excerpt:
      "The law says, do this, and it is never done; grace says, believe in this, and everything is already done. The whole office of the law is to make sin known, that men may despair of themselves and be driven to Christ.",
    theologicalNote:
      "Luther's law-gospel distinction in its sharpest form. Calvin below keeps the same use of the law but adds a third, directing the life of the justified.",
    voice: "Martin Luther",
    work: "Heidelberg Disputation and Lectures on Romans",
    tradition: "lutheran",
    citation: "Luther, Heidelberg Disputation, thesis 26; Lectures on Romans, at 3:20",
  },
  {
    verseRef: "ROM.3.20",
    sourceId: "calvin-romans",
    excerpt:
      "The law can only convict and condemn; it cannot justify, for it demands a perfection which no man renders. But when it has driven us out of ourselves it hands us over to Christ, and afterwards it remains as the rule of a grateful life.",
    theologicalNote:
      "The third use of the law (Inst. 2.7.12) appended to Augustine's second: this is where Calvin and Luther part company in emphasis, not in the doctrine of justification.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 3:20; cf. Inst. 2.7.12",
  },
  {
    verseRef: "ROM.3.25",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He set him forth as a propitiation. God's righteousness is shown in this, that he neither passed over sin nor destroyed the sinner, but found a way in which the sin was punished and the sinner spared.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 3:25",
  },
  {
    verseRef: "ROM.3.25",
    sourceId: "calvin-romans",
    excerpt:
      "Christ is the true mercy-seat, of which the ark was a figure. In him God is propitious to us, and the blood which appeased is the same blood which cleanses; so the justice of God and the salvation of man meet in one act.",
    theologicalNote:
      "Calvin takes hilasterion as the mercy-seat of Exodus 25 rather than as a generic sacrifice, which keeps the cultic figure and the penal substitution together.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 3:25",
  },
  {
    verseRef: "ROM.3.25",
    sourceId: "aquinas-romans",
    excerpt:
      "Christ is called a propitiation because through the sacrifice of his flesh he made satisfaction for the sins of the human race, and this satisfaction was superabundant, since the charity with which he suffered was greater than the malice of the sin.",
    theologicalNote:
      "The satisfaction theory in its Thomist form, inherited from Anselm. It differs from the later Reformed penal reading in locating the sufficiency in the dignity and charity of the offering rather than in the endurance of the penalty as such.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 3:25; cf. ST III q.48 a.2",
  },
  {
    verseRef: "ROM.3.28",
    sourceId: "luther-romans",
    excerpt:
      "We hold that a man is justified by faith apart from works of law. Faith alone justifies, for it alone lays hold of Christ; and the works follow faith as the fruit follows the tree, never as the root that bears it.",
    theologicalNote:
      "Luther's German rendering added 'allein' to the verse and he defended it as required by the sense. Trent, Session VI, canon 9, condemns the formula as he stated it; the two sides define faith differently, Luther meaning fiducia and Trent meaning assent.",
    voice: "Martin Luther",
    work: "Lectures on Romans and On Translating: An Open Letter",
    tradition: "lutheran",
    citation: "Luther, Lectures on Romans, at 3:28; WA 30/2:632-646",
  },
  {
    verseRef: "ROM.3.28",
    sourceId: "aquinas-romans",
    excerpt:
      "Man is justified by faith, not by the works of the law, because no work preceding justification can merit it. But the faith that justifies is a faith formed by charity, for faith without works is dead, and a dead faith does not unite the soul to Christ.",
    theologicalNote:
      "The fides caritate formata is the crux. Aquinas and Luther agree that no prior work merits justification and divide over whether the justifying faith is itself informed by love; this is the substance behind the sixteenth-century anathemas.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 3:28; cf. ST I-II q.113",
  },
  {
    verseRef: "ROM.3.28",
    sourceId: "calvin-romans",
    excerpt:
      "Faith justifies not because of any worth in the act of believing, but because it receives the righteousness offered in the gospel. Faith is an empty vessel; it justifies as the hand justifies which takes the gift.",
    theologicalNote:
      "The instrumental account of faith. Calvin is careful that faith not become a substitute work, which is the objection Trent presses against the Protestant formula.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 3:28; cf. Inst. 3.11.7",
  },

  // ---------------------------------------------------------------- Romans 4
  {
    verseRef: "ROM.4.3",
    sourceId: "calvin-romans",
    excerpt:
      "Abraham believed God, and it was counted to him for righteousness. The word counted proves that the righteousness was not in him but reckoned to him; and if to Abraham, the father of the faithful, then to every believer after his pattern.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 4:3",
  },
  {
    verseRef: "ROM.4.3",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He takes the patriarch as witness, whom the Jews most revered, and shows that he was justified before circumcision and before the law; so the thing they gloried in came after the blessing and could not be its cause.",
    theologicalNote:
      "Chrysostom's argument is chronological: the order of the Genesis narrative decides the theology.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 4:3",
  },
  {
    verseRef: "ROM.4.5",
    sourceId: "luther-romans",
    excerpt:
      "God justifies the ungodly. Not the godly, mark it well, but the ungodly; for if he justified only the godly he would justify no one. The sinner is not loved because he is beautiful, but he is beautiful because he is loved.",
    theologicalNote:
      "The second sentence is Luther's formula from the Heidelberg Disputation (thesis 28), applied here to the justification of the impious.",
    voice: "Martin Luther",
    work: "Lectures on Romans and Heidelberg Disputation",
    tradition: "lutheran",
    citation: "Luther, Lectures on Romans, at 4:5; Heidelberg Disputation, thesis 28",
  },
  {
    verseRef: "ROM.4.5",
    sourceId: "augustine-romans",
    excerpt:
      "He is not justified because he first worked, but he works because he is justified. Grace is given not because we have done good works, but that we may be able to do them; it goes before that we may be healed, and follows that being healed we may grow.",
    theologicalNote:
      "Prevenient and subsequent grace, the framework the Second Council of Orange (529) later canonised against the semi-Pelagians.",
    voice: "Augustine of Hippo",
    work: "On Grace and Free Will",
    tradition: "western-patristic",
    citation: "Augustine, De gratia et libero arbitrio 17.33",
  },
  {
    verseRef: "ROM.4.5",
    sourceId: "poole-annotations",
    excerpt:
      "That justifieth the ungodly: not that he approves ungodliness, but that he finds the man ungodly whom he justifies. The change of state goes before the change of life, though it never goes without it.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 4:5",
  },
  {
    verseRef: "ROM.4.25",
    sourceId: "calvin-romans",
    excerpt:
      "Delivered for our offences and raised for our justification. The two are not divided works but one: in the death the payment, in the resurrection the acquittal, and to separate them is to leave the debt paid with no receipt given.",
    theologicalNote:
      "Calvin resists a purely forensic reading of the cross detached from the resurrection, a point later Reformed writers sometimes let slip.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 4:25",
  },
  {
    verseRef: "ROM.4.25",
    sourceId: "aquinas-romans",
    excerpt:
      "The resurrection of Christ is the cause of our justification, not only as an example, but efficiently, since the humanity of Christ raised is the instrument of the divinity in working our justification; his rising is the pattern and the power of ours.",
    theologicalNote:
      "Instrumental causality applied to the risen humanity: Aquinas's characteristic way of making the resurrection efficacious rather than merely evidential.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 4:25; cf. ST III q.56 a.2",
  },
  {
    verseRef: "ROM.4.25",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He was delivered up for our sins and rose again for our justification. Observe that the resurrection is set down as the greater proof, for the death showed the love, but the rising showed the power that the love had accomplished its end.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 4:25",
  },
  // ---------------------------------------------------------------- Romans 5
  {
    verseRef: "ROM.5.1",
    sourceId: "calvin-romans",
    excerpt:
      "Being justified by faith, we have peace with God. He speaks not of a quiet conscience only, but of the state of the man: the war is ended, and the peace is with God before it is within us. Whoever seeks the calm first and the reconciliation after has reversed the order.",
    theologicalNote:
      "Calvin makes the peace objective and relational before it is experiential, which is why assurance can survive a troubled conscience.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 5:1",
  },
  {
    verseRef: "ROM.5.1",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "Let us have peace, he says, for it is in our power. We were enemies, and the enmity was on our side only; God having removed the cause, it remains for us not to raise the war again by our own sins.",
    theologicalNote:
      "Chrysostom follows the hortatory reading of the verb (echomen as subjunctive), which the manuscript tradition genuinely supports and which shifts the verse from indicative gift to exhortation.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 5:1",
  },
  {
    verseRef: "ROM.5.1",
    sourceId: "poole-annotations",
    excerpt:
      "Peace with God: not a truce, but a reconciliation; not our laying down of arms merely, but his laying aside of enmity. The ground of it is without us, in the righteousness of another, and therefore it stands when our frames alter.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 5:1",
  },
  {
    verseRef: "ROM.5.8",
    sourceId: "augustine-romans",
    excerpt:
      "While we were yet sinners Christ died for us. He did not find us worthy of love, but loved us that we might become worthy. He loved the unlovely that he might make them lovely, and this is the whole difference between his love and ours.",
    voice: "Augustine of Hippo",
    work: "Tractates on the Gospel of John and On the Trinity",
    tradition: "western-patristic",
    citation: "Augustine, In Ioh. tract. 102; cf. De Trin. XIII",
  },
  {
    verseRef: "ROM.5.8",
    sourceId: "calvin-romans",
    excerpt:
      "God commends his own love: the word marks both the greatness of the gift and the freeness of it. The commendation lies in the timing, for he loved us while we were sinners, and so the love has no cause outside himself.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 5:8",
  },
  {
    verseRef: "ROM.5.8",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "For a righteous man scarcely will one die; but Christ died for the ungodly. See how he magnifies the gift by comparison: men die for friends and benefactors, and rarely; he died for enemies, and willingly.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 5:7-8",
  },
  {
    verseRef: "ROM.5.12",
    sourceId: "augustine-romans",
    excerpt:
      "By one man sin entered into the world, and death by sin, and so death passed upon all men, in whom all sinned. The whole human race was in that one man, and what he became by his own will, all became by their origin from him.",
    theologicalNote:
      "Augustine read the Latin in quo omnes peccaverunt as 'in whom all sinned', taking the antecedent to be Adam. The Greek eph' ho is better rendered 'because all sinned', and the Eastern tradition, following Chrysostom, reads it that way; the difference underlies the divergence between Western original guilt and Eastern ancestral sin.",
    voice: "Augustine of Hippo",
    work: "Against Two Letters of the Pelagians and On the Merits and Forgiveness of Sins",
    tradition: "western-patristic",
    citation: "Augustine, De pecc. mer. I.10; C. duas ep. Pel. IV.4",
  },
  {
    verseRef: "ROM.5.12",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "What means it that all sinned? That when Adam fell, even those who had not eaten of the tree became mortal from him. Death is what passed to all; and being mortal, men sinned, though they had not sinned his transgression.",
    theologicalNote:
      "Chrysostom makes mortality the inheritance and actual sin its consequence, the classic Eastern ordering. Represented here in its own terms rather than as a deficient form of the Augustinian doctrine.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 5:12",
  },
  {
    verseRef: "ROM.5.12",
    sourceId: "calvin-romans",
    excerpt:
      "We are not condemned for another's fault as though innocent ourselves, but because the corruption which came from Adam is truly ours. The guilt is derived, yet it is not foreign: we bring the disease with us into the world.",
    theologicalNote:
      "Calvin holds imputed guilt and inherent corruption together, which the Westminster Confession 6.3 later formalises.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 5:12; cf. Inst. 2.1.8",
  },
  {
    verseRef: "ROM.5.19",
    sourceId: "aquinas-romans",
    excerpt:
      "As by the disobedience of one many were made sinners, so by the obedience of one many shall be made just. The obedience of Christ is the meritorious cause of our justice, and it works upon us as the head works upon the members of one body.",
    theologicalNote:
      "The head-and-members figure is how Aquinas grounds the transfer: incorporation rather than a purely legal reckoning, though he affirms merit as well.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 5:19; cf. ST III q.8",
  },
  {
    verseRef: "ROM.5.19",
    sourceId: "calvin-romans",
    excerpt:
      "By the obedience of one shall many be made righteous. The obedience is not of the passion only, but of the whole life; and as Adam's disobedience is ours by nature, so Christ's obedience is ours by faith.",
    theologicalNote:
      "The active as well as passive obedience of Christ, which becomes a distinguishing Reformed emphasis and is disputed within Lutheranism (the Osiandrian and later controversies).",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 5:19",
  },
  {
    verseRef: "ROM.5.19",
    sourceId: "henry-romans",
    excerpt:
      "The two Adams stand as the two heads of mankind: what the first lost by disobeying, the second recovered by obeying; and the parallel holds throughout, save that the grace abounds beyond the offence.",
    voice: "Matthew Henry",
    work: "Commentary on the Whole Bible",
    tradition: "reformed",
    citation: "Henry, Comm. Rom. 5:12-21",
  },

  // ---------------------------------------------------------------- Romans 6
  {
    verseRef: "ROM.6.1",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "Shall we continue in sin that grace may abound? He does not answer with reasoning but with abhorrence: God forbid. For the question is not to be argued but shuddered at, since it supposes that the physician's skill is a reason to stay diseased.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 6:1",
  },
  {
    verseRef: "ROM.6.1",
    sourceId: "calvin-romans",
    excerpt:
      "The objection is not answered by qualifying free justification, but by showing what union with Christ is. Those who are justified are the same persons who are renewed, and to ask whether they may sin is to ask whether the dead may live in what they died to.",
    theologicalNote:
      "Calvin's duplex gratia: justification and sanctification are distinct and inseparable gifts of the one union with Christ, which is his standing answer to the antinomian charge.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 6:1-2; cf. Inst. 3.16.1",
  },
  {
    verseRef: "ROM.6.1",
    sourceId: "owen-mortification",
    excerpt:
      "Do you mortify? Do you make it your daily work? Be always at it while you live; cease not a day from this work; be killing sin or it will be killing you. He that is dead to sin has no warrant to be at peace with what he died to.",
    theologicalNote:
      "Owen's treatise takes Romans 6 and 8:13 as its ground; the excerpt is his practical corollary to Paul's indicative.",
    voice: "John Owen",
    work: "Of the Mortification of Sin in Believers",
    tradition: "puritan",
    citation: "Owen, Mortification of Sin, ch. 2",
  },
  {
    verseRef: "ROM.6.4",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "We were buried with him by baptism into death. The going down and the coming up are a burial and a resurrection; and as the body is washed in water, the soul is buried with Christ, that it may rise and walk in newness of life.",
    theologicalNote:
      "Chrysostom reads the immersion itself as figuring the death and rising, the standard patristic baptismal catechesis.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 6:4",
  },
  {
    verseRef: "ROM.6.4",
    sourceId: "calvin-romans",
    excerpt:
      "Baptism is the pledge and figure of our death with Christ, not the cause. The efficacy is in the Spirit, who accomplishes inwardly what the sign sets forth; yet the sign is not empty, for God does not mock us with bare figures.",
    theologicalNote:
      "Sign and thing signified distinguished but not divided. The Catholic reading takes the sacrament as instrumentally efficacious ex opere operato (Trent, Session VII, canon 8); Calvin's account is deliberately framed against that and against Zwingli's memorialism alike.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 6:4; cf. Inst. 4.15",
  },
  {
    verseRef: "ROM.6.23",
    sourceId: "augustine-romans",
    excerpt:
      "The wages of sin is death, but the gift of God is eternal life. He did not say the wages of righteousness is eternal life, but the gift; for our merits are God's gifts, and when God crowns our merits he crowns nothing but his own gifts.",
    theologicalNote:
      "Augustine's cum coronat merita nostra, nihil aliud coronat quam munera sua (Ep. 194) is the classic reconciliation of reward language with sola gratia, and both Trent and the Reformers cite it.",
    voice: "Augustine of Hippo",
    work: "Letter 194 to Sixtus and On Grace and Free Will",
    tradition: "western-patristic",
    citation: "Augustine, Ep. 194.5.19; De gratia et lib. arb. 8",
  },
  {
    verseRef: "ROM.6.23",
    sourceId: "calvin-romans",
    excerpt:
      "He sets wages against gift, that no man may think eternal life is earned as death is earned. Sin has its stipend, which it pays in full; life has no stipend, for it is bestowed where nothing was owed.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 6:23",
  },
  {
    verseRef: "ROM.6.23",
    sourceId: "poole-annotations",
    excerpt:
      "Wages, or soldier's pay: sin is a service, and it discharges its servants with the pay they have earned. But eternal life is called a free gift, lest any should think to put God in his debt.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 6:23",
  },

  // ---------------------------------------------------------------- Romans 7
  {
    verseRef: "ROM.7.7",
    sourceId: "augustine-romans",
    excerpt:
      "Is the law sin? God forbid. But I had not known lust except the law had said, Thou shalt not covet. The law is good, and by forbidding it increases the desire in those without grace; not because it is evil, but because the disease is inflamed by the remedy misapplied.",
    voice: "Augustine of Hippo",
    work: "On the Spirit and the Letter",
    tradition: "western-patristic",
    citation: "Augustine, De spiritu et littera 4.6; 6.9",
  },
  {
    verseRef: "ROM.7.7",
    sourceId: "calvin-romans",
    excerpt:
      "The law is not the cause of sin but the discoverer of it. As the sun does not make the dust but shows it, so the law brings to light a corruption which lay hid, and the sinner then blames the light for what the darkness concealed.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 7:7",
  },
  {
    verseRef: "ROM.7.7",
    sourceId: "aquinas-romans",
    excerpt:
      "The law is said to be an occasion of sin, not a cause. It is an occasion in three ways: because it forbids, and desire is stirred by prohibition; because it does not give grace to fulfil what it commands; and because it takes away the excuse of ignorance.",
    theologicalNote:
      "Aquinas's threefold distinction is a careful piece of exegetical logic that keeps the law's goodness intact while conceding its effect on the unregenerate.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 7:7-8",
  },
  {
    verseRef: "ROM.7.15",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "That which I do, I allow not. He speaks in the person of one under the law and not yet under grace, describing the state of a man whose reason approves the good and whose habit drags him the other way.",
    theologicalNote:
      "Chrysostom takes the I as a rhetorical persona of the unregenerate under law, the reading the Greek fathers generally hold and which the young Augustine shared before reversing himself.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 7:15",
  },
  {
    verseRef: "ROM.7.15",
    sourceId: "augustine-romans",
    excerpt:
      "I once thought the Apostle described a man under the law; but I afterwards saw that these words could be spoken by one already spiritual, for the delight in the law of God after the inward man belongs to no one but a man under grace.",
    theologicalNote:
      "Augustine's Retractations record the change of mind (Retract. I.23, II.1). His mature reading, that Paul speaks as a regenerate man still at war with concupiscence, is what Luther and Calvin inherit.",
    voice: "Augustine of Hippo",
    work: "Retractations and Against Julian",
    tradition: "western-patristic",
    citation: "Augustine, Retract. I.23.1; C. Iul. VI",
  },
  {
    verseRef: "ROM.7.15",
    sourceId: "calvin-romans",
    excerpt:
      "Paul describes the believer, not the unregenerate. The unregenerate man does not hate his sin nor delight in the law; the conflict itself is the evidence of the Spirit, for where there is no grace there is no war, only quiet servitude.",
    theologicalNote:
      "The argument from the conflict is Calvin's, and it is the standard Reformed answer to the persona reading Chrysostom gives above. Both readings are defensible from the text and the debate is live in current scholarship.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 7:14-15",
  },
  {
    verseRef: "ROM.7.24",
    sourceId: "luther-romans",
    excerpt:
      "O wretched man that I am. This is the cry of a saint, not a sinner at ease. The believer is at once righteous and a sinner: righteous because God reckons him so, a sinner because the flesh remains; and he groans for the deliverance he already possesses in hope.",
    theologicalNote:
      "Simul iustus et peccator, stated at the verse where Luther most often anchored it.",
    voice: "Martin Luther",
    work: "Lectures on Romans",
    tradition: "lutheran",
    citation: "Luther, Lectures on Romans, at 7:24-25",
  },
  {
    verseRef: "ROM.7.24",
    sourceId: "calvin-romans",
    excerpt:
      "He groans under the burden and yet gives thanks for the deliverance; the two are in one breath. The godly man is never so cast down by the sense of his corruption as to forget the ground of his confidence.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 7:24-25",
  },
  {
    verseRef: "ROM.7.24",
    sourceId: "owen-indwelling-sin",
    excerpt:
      "The apostle cries out for deliverance not from guilt, which he had, but from the body of this death, the indwelling power of sin. It is the burden of a man who has felt what sin is and found that pardon does not yet mean absence.",
    voice: "John Owen",
    work: "The Nature and Power of Indwelling Sin",
    tradition: "puritan",
    citation: "Owen, Indwelling Sin, ch. 1",
  },

  // ---------------------------------------------------------------- Romans 8
  {
    verseRef: "ROM.8.1",
    sourceId: "calvin-romans",
    excerpt:
      "There is now no condemnation. The word now marks the change of state, and the no is absolute: not less condemnation, nor condemnation deferred, but none. This is not because sin is absent but because the sentence has fallen elsewhere.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 8:1",
  },
  {
    verseRef: "ROM.8.1",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "No condemnation to them that are in Christ Jesus. He did not say to them that have sinned no more, but to them that are in Christ; for the security lies in the place where one stands, not in the record one brings.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 8:1",
  },
  {
    verseRef: "ROM.8.1",
    sourceId: "poole-annotations",
    excerpt:
      "No condemnation: neither in law, for the sentence is answered; nor in conscience, when it is rightly informed; nor at the last day, for the Judge is the Advocate. The believer may be chastened, but he cannot be condemned.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 8:1",
  },
  {
    verseRef: "ROM.8.7",
    sourceId: "augustine-romans",
    excerpt:
      "The mind of the flesh is enmity against God, for it is not subject to the law of God, neither indeed can be. Mark the cannot: it is not that it will not only, but that it cannot; and the will that cannot will otherwise is not therefore excused, for the impotence is itself the fault.",
    theologicalNote:
      "The non posse non peccare of the unregenerate will. Augustine's insistence that inability does not excuse is the pivot of his case against Julian of Eclanum.",
    voice: "Augustine of Hippo",
    work: "On the Grace of Christ and Against Julian",
    tradition: "western-patristic",
    citation: "Augustine, De gratia Christi I.4; C. Iul. III",
  },
  {
    verseRef: "ROM.8.7",
    sourceId: "luther-romans",
    excerpt:
      "The carnal mind cannot be subject to God's law. Here free will is overthrown, not as a name but as a power: the will is free downward and bound upward, and it does what it wills while being unable to will otherwise.",
    theologicalNote:
      "De servo arbitrio in miniature. Erasmus's reply, that a command implies ability, is the strongest form of the objection and is worth reading alongside.",
    voice: "Martin Luther",
    work: "Lectures on Romans and On the Bondage of the Will",
    tradition: "lutheran",
    citation: "Luther, Lectures on Romans, at 8:7; De servo arbitrio",
  },
  {
    verseRef: "ROM.8.7",
    sourceId: "calvin-romans",
    excerpt:
      "Paul does not say the flesh is at variance with God through some defect that might be mended, but that it is enmity itself. The corruption is not a wound in an otherwise sound nature; it is the disposition of the nature as it now stands.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 8:7",
  },
  {
    verseRef: "ROM.8.15",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "You have received the Spirit of adoption, whereby we cry, Abba, Father. He says cry, to show the earnestness of those who pray so; and the very word the Lord himself used in his agony is put into the mouths of servants made sons.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 8:15",
  },
  {
    verseRef: "ROM.8.15",
    sourceId: "calvin-romans",
    excerpt:
      "The Spirit himself bears witness with our spirit. There is a double testimony: ours, which is weak and often silenced, and his, which supports it. Assurance rests not on the strength of our persuasion but on the veracity of his witness.",
    theologicalNote:
      "The internal testimony of the Spirit as the ground of assurance (Inst. 3.2.7, 3.24.1), distinguished from the syllogismus practicus that later Reformed writers leaned on more heavily.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 8:15-16",
  },
  {
    verseRef: "ROM.8.15",
    sourceId: "aquinas-romans",
    excerpt:
      "Adoption is the gratuitous admission of one not a son to share the inheritance of a son. In men it is by legal act only; in God it is by the infusion of the Spirit, who conforms us really to the natural Son, so that the name answers to a thing truly given.",
    theologicalNote:
      "Aquinas grounds adoption in real conformity to Christ by grace rather than in a purely declarative act, which is characteristic of his account of grace as a created participation in the divine nature.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 8:15; cf. ST III q.23",
  },
  {
    verseRef: "ROM.8.28",
    sourceId: "augustine-romans",
    excerpt:
      "All things work together for good to them that love God, to them who are the called according to his purpose. He added the purpose because the love itself is a fruit of the calling; they do not love and therefore are called, but are called and therefore love.",
    theologicalNote:
      "The order of calling and love here is the exegetical basis of Augustine's mature doctrine of predestination, worked out in Ad Simplicianum I.2 (396).",
    voice: "Augustine of Hippo",
    work: "To Simplician, On Various Questions",
    tradition: "western-patristic",
    citation: "Augustine, Ad Simplicianum I.2",
  },
  {
    verseRef: "ROM.8.30",
    sourceId: "calvin-romans",
    excerpt:
      "Whom he predestinated, them he also called; and whom he called, them he also justified; and whom he justified, them he also glorified. The chain has no broken link: not one of those set apart is lost between the purpose and the crown.",
    theologicalNote:
      "The catena aurea salutis. Calvin's use of the past tense for glorification, as of a thing already accomplished in the divine decree, is the exegetical ground of perseverance.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 8:29-30",
  },
  {
    verseRef: "ROM.8.30",
    sourceId: "aquinas-romans",
    excerpt:
      "Predestination is a part of providence, being the ordering of rational creatures to their supernatural end. It is certain of its effect, yet it does not impose necessity upon the will, since God moves each thing according to its own nature, and the rational nature is moved freely.",
    theologicalNote:
      "The Thomist reconciliation of infallible predestination with genuine contingency. Whether it succeeds is the substance of the De auxiliis controversy between Dominicans and Jesuits, which Rome left formally undecided in 1607.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 8:30; cf. ST I q.23 a.1, a.6",
  },
  {
    verseRef: "ROM.8.38",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He does not say, shall not, but is persuaded; and he heaps up the list, things present, things to come, height, depth, that he may leave nothing unnamed. Having gone through the whole creation he adds, nor any other creature, lest anything be thought forgotten.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 8:38-39",
  },
  {
    verseRef: "ROM.8.38",
    sourceId: "henry-romans",
    excerpt:
      "Observe that he says nothing shall separate us from the love of God which is in Christ Jesus: the love is lodged in Christ, not in us, and therefore what cannot reach him cannot reach it. Our hold on Christ is feeble; his hold on us is not.",
    voice: "Matthew Henry",
    work: "Commentary on the Whole Bible",
    tradition: "reformed",
    citation: "Henry, Comm. Rom. 8:31-39",
  },
  // ---------------------------------------------------------------- Romans 9
  {
    verseRef: "ROM.9.11",
    sourceId: "augustine-simplicianum",
    excerpt:
      "The children being not yet born, neither having done any good or evil, that the purpose of God according to election might stand. If God had foreseen their works, he would not have chosen before the works were; and Paul removes even foreseen faith, for the faith itself is given by the same calling.",
    theologicalNote:
      "Ad Simplicianum I.2 (396) is where Augustine abandons his earlier view that election follows foreseen faith. He later called it the book in which he understood grace for the first time (Retract. II.1). This verse is the text that moved him.",
    voice: "Augustine of Hippo",
    work: "To Simplician, On Various Questions",
    tradition: "western-patristic",
    citation: "Augustine, Ad Simplicianum I.2.5-6; cf. Retract. II.1",
  },
  {
    verseRef: "ROM.9.11",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "God foreknew what each would be, and chose accordingly; the election is not without cause, though the cause is not in works already done. He speaks of nations rather than of persons here, for the elder shall serve the younger was fulfilled in the peoples, not in the two men.",
    theologicalNote:
      "Chrysostom offers both of the standard non-Augustinian moves: election grounded in foreknowledge, and the Jacob-Esau oracle read corporately rather than individually. Both are exegetically serious and both are still argued; the corporate reading is the mainstay of much modern work on Romans 9.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 9:11-13",
  },
  {
    verseRef: "ROM.9.11",
    sourceId: "calvin-romans",
    excerpt:
      "The children not yet born had done neither good nor evil, and Paul adds this to shut out every cause outside God's own purpose. To transfer the ground to foreseen works is to make the purpose depend on what it was meant to produce, and to invert the order the Apostle is at pains to establish.",
    theologicalNote:
      "Calvin's argument is structural: the temporal clause is doing exclusionary work, and foreseen faith would reinstate what it excludes. Chrysostom above shows that the Greek tradition read the same clause without reaching that conclusion.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 9:11",
  },
  {
    verseRef: "ROM.9.11",
    sourceId: "aquinas-romans",
    excerpt:
      "The election is before any merits, for grace is the cause of merit and not merit of grace. Yet reprobation is not symmetrical with election: God is the cause of the grace he gives and only the permitter of the sin he does not prevent, and so he is the author of salvation but never of guilt.",
    theologicalNote:
      "The asymmetry between election and reprobation is the standard Thomist and later Catholic position, and much Reformed theology holds it too (Westminster 3.7 speaks of passing by rather than decreeing sin). The symmetrical formulations of Beza and some later Reformed scholastics are what the label double predestination usually targets.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 9:11-13; cf. ST I q.23 a.3",
  },
  {
    verseRef: "ROM.9.16",
    sourceId: "augustine-simplicianum",
    excerpt:
      "It is not of him that willeth, nor of him that runneth, but of God that sheweth mercy. Not that we do not will or run, but that our willing and running are themselves his mercy; he does not say we do not will, but that our willing is not the cause.",
    theologicalNote:
      "Augustine anticipates the obvious objection: the verse denies causality to the human act, not the act itself.",
    voice: "Augustine of Hippo",
    work: "To Simplician and On the Predestination of the Saints",
    tradition: "western-patristic",
    citation: "Augustine, Ad Simpl. I.2.12; De praed. sanct. 8",
  },
  {
    verseRef: "ROM.9.16",
    sourceId: "calvin-romans",
    excerpt:
      "Neither the will nor the effort of man is the cause of election, but the mercy of God alone. Paul does not compare human striving with divine mercy as two partial causes; he removes the one entirely that the other may stand alone.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 9:16",
  },
  {
    verseRef: "ROM.9.16",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "It is not of him that willeth: he does not take away free choice, but shows that all is not of ourselves, and that we need grace from above. For to will is ours, but to accomplish is of God; and he who is crowned has both willed and been helped.",
    theologicalNote:
      "The synergy of the Eastern tradition: the human will is a real but insufficient cause. Read against Augustine above, this is the substance of the difference, and it should not be flattened into Pelagianism, which Chrysostom would have rejected as firmly as Augustine did.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 9:16",
  },
  {
    verseRef: "ROM.9.20",
    sourceId: "calvin-romans",
    excerpt:
      "Who art thou that repliest against God? Paul does not silence the objector with a bare assertion of power, as though God's will were arbitrary. He reminds the creature of what it is: the question is out of order not because it has no answer but because the questioner is not competent to sit in judgment.",
    theologicalNote:
      "Calvin resists the voluntarist reading that would make the potter argument a mere appeal to omnipotence, though critics from Arminius onward have argued that his system cannot sustain the distinction.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 9:20",
  },
  {
    verseRef: "ROM.9.20",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "He says this not to take away free will, but to check unseasonable curiosity. The clay is used as an image of our ignorance, not of our nature; for we are not clay, and the potter does not reward or punish his vessels.",
    theologicalNote:
      "Chrysostom presses the limits of the metaphor, which is the standard objection to reading the potter figure as a full account of the divine-human relation.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 9:20-21",
  },
  {
    verseRef: "ROM.9.22",
    sourceId: "aquinas-romans",
    excerpt:
      "Vessels of wrath fitted to destruction: note that Paul does not say God fitted them, but that they are fitted, whereas of the vessels of mercy he says God prepared them. The difference of voice is deliberate, and it marks the difference between what God works and what he permits.",
    theologicalNote:
      "The grammatical observation, that katertismena is passive while proetoimasen is active with God as subject, is a real feature of the text and is the strongest exegetical support for asymmetrical predestination. It is pressed by Catholic and Arminian readers, and conceded by many Reformed ones.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 9:22-23",
  },
  {
    verseRef: "ROM.9.22",
    sourceId: "poole-annotations",
    excerpt:
      "Endured with much long-suffering: the vessels of wrath are not destroyed as soon as they are fitted for destruction. God's patience toward them is real patience, and it is this that makes the final judgment unanswerable.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 9:22",
  },

  // --------------------------------------------------------------- Romans 10
  {
    verseRef: "ROM.10.4",
    sourceId: "calvin-romans",
    excerpt:
      "Christ is the end of the law for righteousness. End here is not abolition but completion and aim: the law was always pointing to him, and whoever seeks righteousness in the law without him mistakes the road for the destination.",
    theologicalNote:
      "Calvin takes telos as goal rather than termination. The rendering is contested; the Lutheran tradition more often reads it as the law's termination for righteousness, and modern commentators divide along much the same line.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 10:4",
  },
  {
    verseRef: "ROM.10.4",
    sourceId: "luther-romans",
    excerpt:
      "Christ is the end of the law. Where Christ is, the law has done its work and must be silent: it accuses no longer, since the accused has been acquitted in another. To let the law speak after Christ has spoken is to unsay the gospel.",
    voice: "Martin Luther",
    work: "Lectures on Romans",
    tradition: "lutheran",
    citation: "Luther, Lectures on Romans, at 10:4",
  },
  {
    verseRef: "ROM.10.4",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "What the law sought, Christ gave. The law aimed at making men righteous and could not; he came and accomplished it. So he is not against the law but its fulfilment, as the harvest is not against the seed.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 10:4",
  },
  {
    verseRef: "ROM.10.9",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "If thou shalt confess with thy mouth and believe in thine heart. He requires both, that neither the silent believer nor the loud professor should think himself safe; the heart without the mouth is cowardice, the mouth without the heart is nothing.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 10:9",
  },
  {
    verseRef: "ROM.10.9",
    sourceId: "calvin-romans",
    excerpt:
      "The heart believes unto righteousness and the mouth confesses unto salvation. Confession is not a second condition added to faith, but faith made audible; where the fear of men keeps the mouth shut, it is a sign the heart is not yet full.",
    theologicalNote:
      "Calvin is careful that confession not become a work: the excerpt turns the second clause into evidence rather than requirement.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 10:9-10",
  },
  {
    verseRef: "ROM.10.17",
    sourceId: "calvin-romans",
    excerpt:
      "Faith comes by hearing, and hearing by the word of God. Take away preaching and you take away faith; God could work without means and has chosen not to, and to despise the instrument is to despise the hand that uses it.",
    theologicalNote:
      "The ordinary means of grace argument, and the exegetical warrant for the Reformed insistence that preaching is not a supplement to the sacraments but the primary means.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 10:17; cf. Inst. 4.1.5",
  },
  {
    verseRef: "ROM.10.17",
    sourceId: "aquinas-romans",
    excerpt:
      "Faith comes through hearing, because the things of faith exceed reason and must be received from another who knows them. The preacher is sent, and the sending is from God; so the whole order runs downward from the divine truth to the human ear.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 10:17",
  },
  {
    verseRef: "ROM.10.17",
    sourceId: "poole-annotations",
    excerpt:
      "Hearing by the word of God: not by the word of man, though a man speaks it. The authority is in the message, and the messenger has none but what the message lends him.",
    voice: "Matthew Poole",
    work: "Annotations upon the Holy Bible",
    tradition: "puritan",
    citation: "Poole, Annotations, at Rom. 10:17",
  },

  // --------------------------------------------------------------- Romans 11
  {
    verseRef: "ROM.11.5",
    sourceId: "calvin-romans",
    excerpt:
      "A remnant according to the election of grace. He adds according to the election that we may not think the remnant survived by any strength of its own; and if of grace, then no more of works, otherwise grace is no more grace.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 11:5-6",
  },
  {
    verseRef: "ROM.11.5",
    sourceId: "augustine-romans",
    excerpt:
      "If by grace, then it is no more of works; otherwise grace is no more grace. The Apostle shuts every door: he does not say works have a smaller share, but that where grace is, works as cause have no share at all.",
    voice: "Augustine of Hippo",
    work: "On the Predestination of the Saints",
    tradition: "western-patristic",
    citation: "Augustine, De praed. sanct. 5-6",
  },
  {
    verseRef: "ROM.11.5",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "There is a remnant, he says, that they might not despair; and according to election, that they might not be high-minded. He comforts and humbles in the same clause, which is his manner throughout this epistle.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 11:5",
  },
  {
    verseRef: "ROM.11.26",
    sourceId: "calvin-romans",
    excerpt:
      "All Israel shall be saved. I extend the word Israel to all the people of God, so that when the Gentiles have come in, the Jews shall return from their defection to the obedience of faith; and thus shall be completed the salvation of the whole Israel of God.",
    theologicalNote:
      "Calvin's reading of Israel here as the whole church is a minority position even among Reformed commentators; Beza, the Puritans and most later interpreters take it of ethnic Israel, and the phrase in v. 25 about the fullness of the Gentiles tells against Calvin. Recorded here as his, not as the Reformed consensus.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 11:26",
  },
  {
    verseRef: "ROM.11.26",
    sourceId: "chrysostom-romans-homilies",
    excerpt:
      "When the fullness of the Gentiles is come in, then shall all Israel be saved. He speaks of the time of the end, and gives the Jews hope while taking from the Gentiles all ground of boasting, for they were grafted in and can be cut off.",
    voice: "John Chrysostom",
    work: "Homilies on the Epistle to the Romans",
    tradition: "eastern-patristic",
    citation: "Chrysostom, Hom. Rom., at 11:25-26",
  },
  {
    verseRef: "ROM.11.33",
    sourceId: "augustine-romans",
    excerpt:
      "O the depth of the riches both of the wisdom and knowledge of God. His judgments are unsearchable: not unjust, but unsearchable. Where you cannot understand, believe him just; for it is better to confess ignorance than to accuse the judge.",
    theologicalNote:
      "Augustine's standard resting place when pressed on why some are chosen and others not, and the honest limit of his own system as he acknowledges it.",
    voice: "Augustine of Hippo",
    work: "On the Gift of Perseverance and Sermons",
    tradition: "western-patristic",
    citation: "Augustine, De dono persev. 11; Serm. 26-27",
  },
  {
    verseRef: "ROM.11.33",
    sourceId: "calvin-romans",
    excerpt:
      "Paul, having reasoned as far as reason may go, breaks off in adoration. This is the true end of the doctrine of election: not curiosity satisfied, but wonder; and where Scripture stops, we should stop and worship rather than press further.",
    theologicalNote:
      "The doxology is where Calvin locates the limit of speculation on the decrees, and he cites it against those who would systematise beyond the text.",
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Calvin, Comm. Rom. 11:33-36",
  },
  {
    verseRef: "ROM.11.33",
    sourceId: "aquinas-romans",
    excerpt:
      "His ways are past finding out. The divine wisdom is not contrary to reason but above it; we know that God acts for the best, and we do not know the reasons, for the ordering of the whole is seen by him alone who made the whole.",
    voice: "Thomas Aquinas",
    work: "Lectures on the Letter to the Romans",
    tradition: "scholastic",
    citation: "Aquinas, Super Rom., at 11:33-36",
  },
];

export function curatedEntryToCard(entry: CuratedReceptionEntry): SourceCard {
  return {
    voice: entry.voice,
    work: entry.work,
    tradition: entry.tradition as Tradition,
    quote: entry.excerpt,
    note: entry.theologicalNote,
    citation: entry.citation,
    url: entry.url,
    paraphrased: entry.paraphrased ?? true,
    source: "curated",
  };
}

export interface PericopeRange {
  bookId: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  canonicalVerse: number;
}

export const PERICOPE_RANGES: PericopeRange[] = [
  // Romans
  { bookId: "ROM", chapter: 1, startVerse: 16, endVerse: 16, canonicalVerse: 16 },
  { bookId: "ROM", chapter: 1, startVerse: 17, endVerse: 17, canonicalVerse: 17 },
  { bookId: "ROM", chapter: 1, startVerse: 18, endVerse: 23, canonicalVerse: 20 },
  { bookId: "ROM", chapter: 1, startVerse: 24, endVerse: 32, canonicalVerse: 24 },
  { bookId: "ROM", chapter: 2, startVerse: 1, endVerse: 11, canonicalVerse: 4 },
  { bookId: "ROM", chapter: 2, startVerse: 12, endVerse: 24, canonicalVerse: 14 },
  { bookId: "ROM", chapter: 2, startVerse: 25, endVerse: 29, canonicalVerse: 29 },
  { bookId: "ROM", chapter: 3, startVerse: 9, endVerse: 18, canonicalVerse: 10 },
  { bookId: "ROM", chapter: 3, startVerse: 19, endVerse: 22, canonicalVerse: 20 },
  { bookId: "ROM", chapter: 3, startVerse: 23, endVerse: 26, canonicalVerse: 25 },
  { bookId: "ROM", chapter: 3, startVerse: 27, endVerse: 31, canonicalVerse: 28 },
  { bookId: "ROM", chapter: 4, startVerse: 1, endVerse: 4, canonicalVerse: 3 },
  { bookId: "ROM", chapter: 4, startVerse: 5, endVerse: 12, canonicalVerse: 5 },
  { bookId: "ROM", chapter: 4, startVerse: 20, endVerse: 25, canonicalVerse: 25 },
  { bookId: "ROM", chapter: 5, startVerse: 1, endVerse: 5, canonicalVerse: 1 },
  { bookId: "ROM", chapter: 5, startVerse: 6, endVerse: 11, canonicalVerse: 8 },
  { bookId: "ROM", chapter: 5, startVerse: 12, endVerse: 17, canonicalVerse: 12 },
  { bookId: "ROM", chapter: 5, startVerse: 18, endVerse: 21, canonicalVerse: 19 },
  { bookId: "ROM", chapter: 6, startVerse: 1, endVerse: 3, canonicalVerse: 1 },
  { bookId: "ROM", chapter: 6, startVerse: 4, endVerse: 14, canonicalVerse: 4 },
  { bookId: "ROM", chapter: 6, startVerse: 15, endVerse: 23, canonicalVerse: 23 },
  { bookId: "ROM", chapter: 7, startVerse: 7, endVerse: 13, canonicalVerse: 7 },
  { bookId: "ROM", chapter: 7, startVerse: 14, endVerse: 23, canonicalVerse: 15 },
  { bookId: "ROM", chapter: 7, startVerse: 24, endVerse: 25, canonicalVerse: 24 },
  { bookId: "ROM", chapter: 8, startVerse: 1, endVerse: 4, canonicalVerse: 1 },
  { bookId: "ROM", chapter: 8, startVerse: 5, endVerse: 11, canonicalVerse: 7 },
  { bookId: "ROM", chapter: 8, startVerse: 12, endVerse: 17, canonicalVerse: 15 },
  { bookId: "ROM", chapter: 8, startVerse: 28, endVerse: 29, canonicalVerse: 28 },
  { bookId: "ROM", chapter: 8, startVerse: 30, endVerse: 30, canonicalVerse: 30 },
  { bookId: "ROM", chapter: 8, startVerse: 31, endVerse: 39, canonicalVerse: 38 },
  { bookId: "ROM", chapter: 9, startVerse: 6, endVerse: 13, canonicalVerse: 11 },
  { bookId: "ROM", chapter: 9, startVerse: 14, endVerse: 18, canonicalVerse: 16 },
  { bookId: "ROM", chapter: 9, startVerse: 19, endVerse: 21, canonicalVerse: 20 },
  { bookId: "ROM", chapter: 9, startVerse: 22, endVerse: 29, canonicalVerse: 22 },
  { bookId: "ROM", chapter: 10, startVerse: 1, endVerse: 5, canonicalVerse: 4 },
  { bookId: "ROM", chapter: 10, startVerse: 6, endVerse: 13, canonicalVerse: 9 },
  { bookId: "ROM", chapter: 10, startVerse: 14, endVerse: 21, canonicalVerse: 17 },
  { bookId: "ROM", chapter: 11, startVerse: 1, endVerse: 10, canonicalVerse: 5 },
  { bookId: "ROM", chapter: 11, startVerse: 25, endVerse: 32, canonicalVerse: 26 },
  { bookId: "ROM", chapter: 11, startVerse: 33, endVerse: 36, canonicalVerse: 33 },
  // Matthew
  { bookId: "MAT", chapter: 1, startVerse: 18, endVerse: 25, canonicalVerse: 21 },
  { bookId: "MAT", chapter: 5, startVerse: 1, endVerse: 12, canonicalVerse: 3 },
  { bookId: "MAT", chapter: 5, startVerse: 17, endVerse: 20, canonicalVerse: 17 },
  { bookId: "MAT", chapter: 6, startVerse: 9, endVerse: 13, canonicalVerse: 9 },
  { bookId: "MAT", chapter: 11, startVerse: 28, endVerse: 30, canonicalVerse: 28 },
  { bookId: "MAT", chapter: 16, startVerse: 13, endVerse: 17, canonicalVerse: 16 },
  { bookId: "MAT", chapter: 16, startVerse: 18, endVerse: 20, canonicalVerse: 18 },
  { bookId: "MAT", chapter: 26, startVerse: 26, endVerse: 29, canonicalVerse: 26 },
  { bookId: "MAT", chapter: 28, startVerse: 18, endVerse: 20, canonicalVerse: 18 },
  // Mark
  { bookId: "MRK", chapter: 1, startVerse: 1, endVerse: 8, canonicalVerse: 1 },
  { bookId: "MRK", chapter: 1, startVerse: 9, endVerse: 13, canonicalVerse: 11 },
  { bookId: "MRK", chapter: 1, startVerse: 14, endVerse: 15, canonicalVerse: 15 },
  { bookId: "MRK", chapter: 1, startVerse: 16, endVerse: 20, canonicalVerse: 17 },
  { bookId: "MRK", chapter: 10, startVerse: 42, endVerse: 45, canonicalVerse: 45 },
  { bookId: "MRK", chapter: 15, startVerse: 33, endVerse: 39, canonicalVerse: 34 },
  // Luke
  { bookId: "LUK", chapter: 1, startVerse: 26, endVerse: 38, canonicalVerse: 35 },
  { bookId: "LUK", chapter: 1, startVerse: 46, endVerse: 55, canonicalVerse: 46 },
  { bookId: "LUK", chapter: 2, startVerse: 1, endVerse: 14, canonicalVerse: 14 },
  { bookId: "LUK", chapter: 18, startVerse: 9, endVerse: 14, canonicalVerse: 13 },
  { bookId: "LUK", chapter: 23, startVerse: 39, endVerse: 43, canonicalVerse: 42 },
  { bookId: "LUK", chapter: 24, startVerse: 25, endVerse: 32, canonicalVerse: 27 },
  // John
  { bookId: "JHN", chapter: 1, startVerse: 1, endVerse: 5, canonicalVerse: 1 },
  { bookId: "JHN", chapter: 1, startVerse: 11, endVerse: 14, canonicalVerse: 14 },
  { bookId: "JHN", chapter: 3, startVerse: 1, endVerse: 8, canonicalVerse: 3 },
  { bookId: "JHN", chapter: 3, startVerse: 16, endVerse: 21, canonicalVerse: 16 },
  { bookId: "JHN", chapter: 6, startVerse: 35, endVerse: 40, canonicalVerse: 35 },
  { bookId: "JHN", chapter: 6, startVerse: 41, endVerse: 51, canonicalVerse: 44 },
  { bookId: "JHN", chapter: 10, startVerse: 11, endVerse: 18, canonicalVerse: 11 },
  { bookId: "JHN", chapter: 10, startVerse: 27, endVerse: 30, canonicalVerse: 30 },
  { bookId: "JHN", chapter: 11, startVerse: 32, endVerse: 37, canonicalVerse: 35 },
  { bookId: "JHN", chapter: 14, startVerse: 1, endVerse: 6, canonicalVerse: 6 },
  { bookId: "JHN", chapter: 15, startVerse: 1, endVerse: 8, canonicalVerse: 5 },
  { bookId: "JHN", chapter: 17, startVerse: 1, endVerse: 5, canonicalVerse: 3 },
  { bookId: "JHN", chapter: 19, startVerse: 28, endVerse: 30, canonicalVerse: 30 },
  // Romans
  { bookId: "ROM", chapter: 1, startVerse: 16, endVerse: 17, canonicalVerse: 16 },
  { bookId: "ROM", chapter: 3, startVerse: 21, endVerse: 26, canonicalVerse: 24 },
  { bookId: "ROM", chapter: 5, startVerse: 1, endVerse: 5, canonicalVerse: 1 },
  { bookId: "ROM", chapter: 8, startVerse: 1, endVerse: 4, canonicalVerse: 1 },
  { bookId: "ROM", chapter: 8, startVerse: 28, endVerse: 30, canonicalVerse: 28 },
  { bookId: "ROM", chapter: 8, startVerse: 31, endVerse: 39, canonicalVerse: 38 },
  { bookId: "ROM", chapter: 9, startVerse: 14, endVerse: 18, canonicalVerse: 16 },
  // Ephesians
  { bookId: "EPH", chapter: 1, startVerse: 3, endVerse: 14, canonicalVerse: 4 },
  { bookId: "EPH", chapter: 2, startVerse: 1, endVerse: 10, canonicalVerse: 8 },
  // Philippians
  { bookId: "PHP", chapter: 2, startVerse: 5, endVerse: 11, canonicalVerse: 6 },
  // Hebrews
  { bookId: "HEB", chapter: 1, startVerse: 1, endVerse: 4, canonicalVerse: 1 },
  { bookId: "HEB", chapter: 4, startVerse: 14, endVerse: 16, canonicalVerse: 14 },
  { bookId: "HEB", chapter: 11, startVerse: 1, endVerse: 6, canonicalVerse: 1 },
  // 1 John
  { bookId: "1JN", chapter: 1, startVerse: 1, endVerse: 4, canonicalVerse: 1 },
  { bookId: "1JN", chapter: 4, startVerse: 7, endVerse: 12, canonicalVerse: 8 },
  // Revelation
  { bookId: "REV", chapter: 21, startVerse: 1, endVerse: 5, canonicalVerse: 1 },
];

export function getCuratedCardsForVerse(
  bookId: string,
  chapter: number,
  verse: number,
): SourceCard[] {
  const cards: SourceCard[] = [];
  const seen = new Set<string>();

  const addCard = (c: SourceCard) => {
    const sig = `${c.voice}\0${c.citation}`;
    if (!seen.has(sig)) {
      seen.add(sig);
      cards.push(c);
    }
  };

  // 1. Direct key from curated map
  const direct =
    curated[`${bookId}-${chapter}-${verse}`] ??
    curated[`${bookId}.${chapter}.${verse}`];
  if (direct?.cards) {
    for (const c of direct.cards) addCard(c);
  }

  // 2. Matching entries from CURATED_ENTRIES
  const refDot = `${bookId}.${chapter}.${verse}`;
  const refDash = `${bookId}-${chapter}-${verse}`;
  for (const entry of CURATED_ENTRIES) {
    if (entry.verseRef === refDot || entry.verseRef === refDash) {
      addCard(curatedEntryToCard(entry));
    }
  }

  // 3. Pericope canonical verse fallback if still empty
  if (cards.length === 0) {
    const pericope = PERICOPE_RANGES.find(
      (p) =>
        p.bookId === bookId &&
        p.chapter === chapter &&
        verse >= p.startVerse &&
        verse <= p.endVerse,
    );
    if (pericope && pericope.canonicalVerse !== verse) {
      return getCuratedCardsForVerse(bookId, chapter, pericope.canonicalVerse);
    }
  }

  return cards;
}

export function getCuratedCardsForChapter(
  bookId: string,
  chapter: number,
): SourceCard[] {
  const cards: SourceCard[] = [];
  const seen = new Set<string>();

  const addCard = (c: SourceCard) => {
    const sig = `${c.voice}\0${c.citation}`;
    if (!seen.has(sig)) {
      seen.add(sig);
      cards.push(c);
    }
  };

  const chapterKey = `${bookId}-${chapter}`;
  if (curated[chapterKey]) {
    for (const c of curated[chapterKey].cards) addCard(c);
  }

  const prefixDash = `${bookId}-${chapter}-`;
  const prefixDot = `${bookId}.${chapter}.`;
  for (const [key, res] of Object.entries(curated)) {
    if (key.startsWith(prefixDash) || key.startsWith(prefixDot)) {
      for (const c of res.cards) addCard(c);
    }
  }

  for (const entry of CURATED_ENTRIES) {
    if (entry.verseRef.startsWith(prefixDot) || entry.verseRef.startsWith(prefixDash)) {
      addCard(curatedEntryToCard(entry));
    }
  }

  return cards;
}

/**
 * Cards for a contiguous range, as one locus rather than a union of verses.
 *
 * Most of the collapsing is free: getCuratedCardsForVerse redirects a verse to
 * its pericope's canonical verse, so a range sitting inside one pericope
 * returns exactly what that single verse returns. The dedupe below uses the
 * same voice+citation signature that function already uses, so a card reached
 * from three different verses of the same pericope is still one card.
 *
 * What is not free is a range that spans pericopes: without a cap, Calvin can
 * arrive three or four times, once per pericope page, and bury the other
 * voices. Two per voice keeps a range from crowding out the breadth that makes
 * the desk worth reading.
 */
const MAX_CARDS_PER_VOICE_IN_RANGE = 2;
const MAX_CARDS_IN_RANGE = 10;

export function getCuratedCardsForRange(
  bookId: string,
  chapter: number,
  start: number,
  end: number,
): SourceCard[] {
  if (end <= start) return getCuratedCardsForVerse(bookId, chapter, start);

  // Collect once, in verse order, deduped on the same signature
  // getCuratedCardsForVerse uses, so a card reached from three verses of one
  // pericope is one card here too.
  const seen = new Set<string>();
  const collected: SourceCard[] = [];
  for (let v = start; v <= end; v++) {
    for (const card of getCuratedCardsForVerse(bookId, chapter, v)) {
      const sig = `${card.voice}\0${card.citation}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      collected.push(card);
    }
  }

  // Breadth before depth. Taking the first ten in verse order would spend the
  // whole panel on the voices that happen to comment early in the passage and
  // drop the traditions that answer later in it, which is the opposite of what
  // this desk is for. Every voice gets its first card before any voice gets a
  // second.
  const perVoice = new Map<string, number>();
  const picked: SourceCard[] = [];
  for (let pass = 1; pass <= MAX_CARDS_PER_VOICE_IN_RANGE; pass++) {
    for (const card of collected) {
      if (picked.length >= MAX_CARDS_IN_RANGE) return picked;
      if (picked.includes(card)) continue;
      const voiceKey = card.voice.trim().toLowerCase();
      if ((perVoice.get(voiceKey) ?? 0) >= pass) continue;
      perVoice.set(voiceKey, pass);
      picked.push(card);
    }
  }
  return picked;
}

export function getCurated(
  bookId: string,
  chapter: number,
  verse: number | null,
  verseEnd?: number | null,
): ReceptionResult | null {
  if (verse == null) {
    const chapterCards = getCuratedCardsForChapter(bookId, chapter);
    if (chapterCards.length > 0) {
      return {
        source: "curated",
        caution: CAUTION,
        cards: chapterCards,
      };
    }
    return null;
  }

  const cards =
    verseEnd != null && verseEnd > verse
      ? getCuratedCardsForRange(bookId, chapter, verse, verseEnd)
      : getCuratedCardsForVerse(bookId, chapter, verse);
  if (cards.length > 0) {
    return {
      source: "curated",
      caution: CAUTION,
      cards,
    };
  }
  return null;
}

export function hasCurated(
  bookId: string,
  chapter: number,
  verse: number,
): boolean {
  return getCuratedCardsForVerse(bookId, chapter, verse).length > 0;
}

export function markedVerses(bookId: string, chapter: number): number[] {
  const prefixDash = `${bookId}-${chapter}-`;
  const prefixDot = `${bookId}.${chapter}.`;
  const verses = new Set<number>();

  for (const k of Object.keys(curated)) {
    if (k.startsWith(prefixDash)) {
      const n = Number(k.slice(prefixDash.length));
      if (Number.isFinite(n)) verses.add(n);
    } else if (k.startsWith(prefixDot)) {
      const n = Number(k.slice(prefixDot.length));
      if (Number.isFinite(n)) verses.add(n);
    }
  }

  for (const entry of CURATED_ENTRIES) {
    if (entry.verseRef.startsWith(prefixDot)) {
      const parts = entry.verseRef.split(".");
      const v = Number(parts[2]);
      if (parts[0] === bookId && Number(parts[1]) === chapter && Number.isFinite(v)) {
        verses.add(v);
      }
    }
  }

  for (const p of PERICOPE_RANGES) {
    if (p.bookId === bookId && p.chapter === chapter) {
      verses.add(p.canonicalVerse);
    }
  }

  return Array.from(verses).sort((a, b) => a - b);
}

export function markedChapters(bookId: string): number[] {
  const chapters = new Set<number>();
  const dash = `${bookId}-`;
  const dot = `${bookId}.`;
  for (const k of Object.keys(curated)) {
    if (k.startsWith(dash)) {
      const ch = Number(k.slice(dash.length).split("-")[0]);
      if (Number.isFinite(ch)) chapters.add(ch);
    } else if (k.startsWith(dot)) {
      const ch = Number(k.slice(dot.length).split(".")[0]);
      if (Number.isFinite(ch)) chapters.add(ch);
    }
  }
  for (const entry of CURATED_ENTRIES) {
    const parts = entry.verseRef.split(".");
    if (parts[0] === bookId) {
      const ch = Number(parts[1]);
      if (Number.isFinite(ch)) chapters.add(ch);
    }
  }
  for (const p of PERICOPE_RANGES) {
    if (p.bookId === bookId) chapters.add(p.chapter);
  }
  return Array.from(chapters).sort((a, b) => a - b);
}

export function curatedBookIds(): Set<string> {
  const ids = new Set<string>();
  for (const k of Object.keys(curated)) {
    const id = k.split("-")[0];
    if (id) ids.add(id);
  }
  for (const entry of CURATED_ENTRIES) {
    const id = entry.verseRef.split(".")[0];
    if (id) ids.add(id);
  }
  return ids;
}

const STOP_WORDS = new Set([
  "what", "does", "this", "verse", "say", "about", "mean", "teach", "how", "why", "who", "where",
  "the", "in", "is", "are", "of", "and", "to", "a", "an", "on", "for", "with", "tell", "us", "from",
  "by", "that", "which", "it", "at", "as", "be", "have", "has", "do", "we", "you", "they", "he", "she",
  "interpret", "explain", "give", "me", "show", "regarding", "concerning"
]);

const SYNONYMS: Record<string, string[]> = {
  forgive: ["sin", "sins", "forgiv", "remiss", "pardon", "sav", "deliver"],
  forgiveness: ["sin", "sins", "forgiv", "remiss", "pardon", "sav"],
  sin: ["sin", "sins", "iniquity", "debt", "transgress", "fall"],
  sins: ["sin", "sins", "iniquity", "debt", "transgress"],
  predestination: ["predestin", "elect", "foreknow", "decree", "chosen", "purpose"],
  election: ["elect", "predestin", "foreknow", "chosen"],
  justification: ["justif", "righteous", "faith", "imput", "grace", "pardon"],
  righteousness: ["righteous", "justif", "law", "faith"],
  rock: ["rock", "peter", "petra", "church", "keys", "confession"],
  peter: ["peter", "rock", "cephas", "confession", "apostle"],
  baptism: ["bapti", "trinit", "water", "name", "father", "son", "spirit"],
  trinity: ["trinit", "father", "son", "spirit", "substance", "person", "godhead"],
  virgin: ["virgin", "immanuel", "emmanuel", "birth", "incarnat", "conception"],
  immanuel: ["immanuel", "emmanuel", "god with us", "incarnat"],
  beatitudes: ["poor", "spirit", "humil", "meek", "mourn", "beatitude", "blessed"],
  poor: ["poor", "spirit", "humil", "humility", "pride"],
  humility: ["humil", "poor", "spirit", "pride", "lowly"],
  meek: ["meek", "gentle", "earth", "inherit"],
  law: ["law", "command", "fulfill", "prophet", "jot", "tittle", "moral"],
  grace: ["grace", "mercy", "favor", "free", "gift"],
  supper: ["supper", "eucharist", "body", "blood", "covenant", "cup", "bread"],
  eucharist: ["eucharist", "supper", "body", "blood", "sacrament"],
  atonement: ["aton", "sacrific", "blood", "propitiat", "cross", "ransom"],
  calvin: ["calvin", "harmony", "institutes"],
  augustine: ["augustine", "city of god", "tractates", "confessions"],
  chrysostom: ["chrysostom", "homilies"],
  aquinas: ["aquinas", "catena", "summa", "thomas"],
  luther: ["luther", "galatians", "bondage"],
  poole: ["poole", "synopsis", "annotations"],
  henry: ["henry", "commentary"],
};

/**
 * Searches established primary sources (curated cards, CURATED_ENTRIES, chapter commentaries)
 * for direct connection to the user's specific inquiry on this Scripture verse.
 */
export function findEstablishedSources(opts: {
  bookId: string;
  chapter: number;
  verse: number | null;
  question: string;
  mode?: "reception" | "traditions";
  locale?: Locale;
}): ReceptionResult | null {
  const rawQ = opts.question.trim().toLowerCase();
  if (!rawQ) return null;

  const rawWords = rawQ.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const searchTokens = new Set<string>();

  for (const w of rawWords) {
    if (!STOP_WORDS.has(w) && w.length > 2) {
      searchTokens.add(w);
      const syns = SYNONYMS[w];
      if (syns) {
        for (const s of syns) searchTokens.add(s);
      }
    }
  }

  if (searchTokens.size === 0) return null;

  // Gather candidate cards from:
  // 1. Cards on the specific selected verse (highest relevance)
  const verseCards = opts.verse != null ? getCuratedCardsForVerse(opts.bookId, opts.chapter, opts.verse) : [];
  // 2. Cards across this chapter
  const chapterCards = getCuratedCardsForChapter(opts.bookId, opts.chapter);
  // 3. All CURATED_ENTRIES for this book
  const bookEntries = CURATED_ENTRIES.filter((e) => e.verseRef.startsWith(`${opts.bookId}.`)).map(curatedEntryToCard);

  const allCandidates: Array<{ card: SourceCard; isVerse: boolean; isChapter: boolean }> = [];
  const seenSig = new Set<string>();

  for (const c of verseCards) {
    const sig = `${c.voice}\0${c.citation}`;
    if (!seenSig.has(sig)) {
      seenSig.add(sig);
      allCandidates.push({ card: c, isVerse: true, isChapter: true });
    }
  }

  for (const c of chapterCards) {
    const sig = `${c.voice}\0${c.citation}`;
    if (!seenSig.has(sig)) {
      seenSig.add(sig);
      allCandidates.push({ card: c, isVerse: false, isChapter: true });
    }
  }

  for (const c of bookEntries) {
    const sig = `${c.voice}\0${c.citation}`;
    if (!seenSig.has(sig)) {
      seenSig.add(sig);
      allCandidates.push({ card: c, isVerse: false, isChapter: false });
    }
  }

  interface ScoredCard {
    card: SourceCard;
    score: number;
  }

  const scored: ScoredCard[] = [];

  for (const item of allCandidates) {
    const c = item.card;
    let score = 0;
    const quoteLower = c.quote.toLowerCase();
    const noteLower = (c.note ?? "").toLowerCase();
    const voiceLower = c.voice.toLowerCase();
    const workLower = c.work.toLowerCase();

    for (const t of searchTokens) {
      if (quoteLower.includes(t)) score += 10;
      if (noteLower.includes(t)) score += 8;
      if (voiceLower.includes(t)) score += 12;
      if (workLower.includes(t)) score += 5;
    }

    if (item.isVerse) score += 14;
    else if (item.isChapter) score += 6;

    if (score >= 12) {
      scored.push({ card: c, score });
    }
  }

  if (scored.length === 0) return null;

  scored.sort((a, b) => b.score - a.score);

  let finalCards: SourceCard[] = [];
  if (opts.mode === "traditions") {
    const seenTraditions = new Set<string>();
    for (const s of scored) {
      if (finalCards.length >= 5) break;
      if (!seenTraditions.has(s.card.tradition)) {
        seenTraditions.add(s.card.tradition);
        finalCards.push(s.card);
      }
    }
    // Fill remaining if needed
    for (const s of scored) {
      if (finalCards.length >= 5) break;
      if (!finalCards.includes(s.card)) finalCards.push(s.card);
    }
  } else {
    finalCards = scored.slice(0, 5).map((s) => s.card);
  }

  const caution =
    opts.locale === "es"
      ? `Fuentes primarias del escritorio histórico directamente conectadas con su consulta sobre este texto.`
      : `Historic primary sources from the scholar's desk directly addressing your inquiry on this scripture.`;

  return {
    source: "curated",
    caution,
    cards: finalCards,
  };
}
