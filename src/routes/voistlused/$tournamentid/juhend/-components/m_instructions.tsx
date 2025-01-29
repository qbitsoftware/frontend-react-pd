import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Meistriliiga_Instructions() {
    return (
        <div className="container mx-auto p-4 space-y-6 mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">EESTI MEISTRILIIGA LAUATENNISES</h1>
            <h2 className="text-2xl font-semibold text-center mb-4">Klubide vahelised lahtised võistkondlikud meistrivõistlused lauatennises</h2>
            <h3 className="text-xl font-semibold text-center mb-4">Hooaeg 2024/2025</h3>
            <h4 className="text-lg font-semibold text-center mb-6">Juhend</h4>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>MEISTRILIIGA JUHTIMINE</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="">
                        Hooajal juhivad Eesti Meistriliigat võistluse peakohtunikud Andres Somer ja Allar Vellner. Lisaks
                        moodustatakse kõigi Eesti Meistriliigas osalevate meeskondade esindajatest Meistriliiga nõukogu, kes
                        tegeleb muudatustega ja muude ettepanekutega järgmiseks hooajaks. Iga Meistriliigas osalev klubi
                        määrab komisjoni oma esindaja ning esindaja asetäitja. Komisjoni koosolekul võetakse otsused vastu
                        lihthäälte enamusega. Komisjoni koosolekul võivad osaleda ainult klubide määratud esindajad või
                        nende asetäitjad. Lisaks kuulub komisjoni juhatuse esindaja.
                    </p>
                </CardContent>
                <CardHeader>
                    <CardTitle>OSAVÕTJAD</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Liigas võib osaleda igast klubist üks meeskond. Osaleda võivad ainult ELTL-s registreeritud klubid, kes
                        on taganud liigasse koha ning on kirjalikult teatanud oma osavõtust, tasunud osavõtumaksu ja
                        täidavad juhendis ettenähtud tingimused. Võistkond loetakse registreerituks pärast osavõtumaksu
                        tasumist.
                    </p>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>MEESKONDADE KOOSSEIS</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Meeskonda võivad kuuluda kõik Eesti kodakondusust omavad või kolm viimast aastat alaliselt Eestis
                        elanud ELTL liikmesklubide liikmed, kes kuuluvad registreerimis tähtajal Eesti reitingus 150 parema
                        hulka, saades omale Eesti mängija staatuse. Meeskond võib üles anda ka noormängija (2005 ja hiljem
                        sündinud), kes registreerimismomendil ei kuulu reitingus 150 mängija hulka. Aga kasutada saab teda
                        siis, kui ta on tõusnud reitingus 150 mängija sekka. Ülejäänud mängijad saavad võõrmängija staatuse.
                    </p>
                    <p className="mb-4">
                        Meistriliigas pääseb võistlema ainult täielikult komplekteeritud võistkonnaga (3 mängijat). Kui
                        võistkond ei ilmu võistluspäeval kohale või on tulnud mängima pooliku koosseisuga, on trahv 500 EUR.
                        Ühes kohtumises võib korraga kasutada 1 võõrmängijat ja 1 laenatud mängijat. Klubitud mängijad
                        Eesti Meistriliigas osaleda ei saa.
                    </p>
                    <p className="mb-4">
                        Igasse meeskonda peab registreerima vähemalt 5, kuid mitte rohkem kui 10 mängijat. Igat meeskonda
                        võib täiendada teisest Eesti klubist laenatud mängijatega tingimusel, et ta mahub ülesantava 10
                        mängija hulka ning samuti täidab eespool nimetatud reitingu nõuet. Laenutingimused lepivad klubid
                        omavahel ise kokku. Võistlejat laenuks andev klubi teavitab ELTL&apos;i e-posti teel mängija laenamisest
                        teisele klubi registreerimiseks ettenähtud aadressil, mitte hiljemaks kui registreerimise viimaseks
                        kuupäevaks. Registreeritud mängijatest vähemalt 4 peavad olema Eesti mängijad.
                    </p>
                    <p className="mb-4">
                        Klubil on õigus madalamas liigas ülesantud mängijat kasutada Meistriliigas võistlevas meeskonnas
                        saades nii asendusmängija staatuse. Maksimaalselt võib kasutada kahte asendusmängijat ning igaühte
                        neist ühel mängupäeval hooaja jooksul. Mängija peab kuuluma Eesti reitingus võistkondade viimasel
                        registreerimis kuupäeval vähemalt 150 parema hulka. Nimetatud juhul ei jälgita maksimaalse
                        võistlejate arvu reeglit, kuid asendusmängijat ei loeta registreerituks kõrgemasse liigasse.
                    </p>
                    <p className="mb-4">
                        Võistkonna esindaja peab informeerima hiljemalt 12 tundi enne võistlusvooru algust asendusmängija
                        kasutamisest võistluskoha kohtunikku ja peakohtunikku ning saatma täiendavalt kirja aadressile
                        margit.tamm@lauatennis.ee
                    </p>
                    <p className="mb-4">
                        Peale võistkondade registreerimistähtaja lõppu lubatakse teha täiendavaid lisaülesandmisi kuni
                        03.veebruar 2025 ainult Eesti mängijate arvel, kes ei ole jooksval hooajal osalenud Meistriliiga ning
                        madalamate liiga mängudes teise klubi võistkonnas tingimusel, et see mängija mahub ülesantava 10
                        mängija hulka. Lisamängija registreerimistasu on 100 EUR / mängija. Play-offides (6.mängupäeval) võib
                        osaleda tingimusel, et mängija on osalenud vähemalt ühel mängupäeval põhiturniiri kohtumistes
                        (kehtib nii Eesti, kui ka võõrmängijate kohta).
                    </p>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Piirangud võistlemisel Venemaa Föderatsiooni ja Valgevene Vabariigi kodanikele</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        ELTL võistlustel võivad osaleda Eesti Vabariigi kodanikud ja alalise elamisloaga välisriigi kodanikud ja
                        Eestis viibivad kodanikud kes omavad selleks õiguslikku alust ning kes esindavad või on ELTL
                        liikmesklubi(de) liikmed. Välisriigi kodaniku osalemise õigust peab tõendama ELTL liikmesklubi ja
                        kodanik ise, esitades selleks kogu vajaliku dokumentatsiooni.
                    </p>
                    <p className="mb-4">
                        Eestis toimuvatel võistlustel on keelatud eksponeerida Venemaa ja Valgevene rahvuslikku
                        sümboolikat. Rikkumise korral eemaldab ELTL isiku võistlustelt ning liikmesklubile kohaldatakse
                        piirangud ning esitatakse menetlemiseks ELTL distsiplinaarkomisjonile või ELTL juhatusele.
                    </p>
                    <p className="mb-4">
                        Vene Föderatsiooni ja Valgevene kodanikel, kellel ei ole mõne Euroopa Liidu liikmesriigi elamisluba ega
                        pikaajalist viisat, kes ei õpi ja ei tööta Eestis või kellel pole Eesti ja/või mõne muu Euroopa riigi või
                        aktsepteeritava välisriigi rahvusvahelist kaitset, ei ole õigust osaleda Eesti Lauatenniseliidu
                        võistluskalendris olevatel võistlustel (k.a. neutraalse lipu all). Sama kehtib ka treenerite, kohtunike ja
                        muude spordiametnike puhul. Otsus ei puuduta Eestis elavaid Venemaa Föderatsiooni ega Valgevene
                        kodanikke, ega ka neid, kes küll pärinevad neist riikidest, aga siin juba õpivad või töötavad.
                    </p>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>REGISTREERIMINE</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Täidetud registreerimisvorm võistkonna nime, nimelise koosseisu, treeneri, esindaja ja teiste küsitud
                        andmetega saata hiljemalt 23.09.2024.a e-posti aadressil margit.tamm@lauatennis.ee
                    </p>
                    <p className="mb-4">Võistkonna nimi ei tohi olla pikem kui 25 tähemärki.</p>
                    <p className="mb-4">Registreerimisvorm on leitav alaliidu kodulehel.</p>
                    <p className="">
                        Koos registreerimisega annab võistleja nõusoleku oma nime ja pildi avaldamiseks kodulehel,
                        võistlusprotokollide avalikustamiseks, võistlustulemuste ning fotode kajastamiseks sotsiaalmeedias ja
                        meedias, võistlustulemuste töötlemiseks ning edetabelite avaldamiseks. Samuti nõustub mängija tele-
                        ja videoülekannetega.
                    </p>
                </CardContent>
                <CardHeader>
                    <CardTitle>OSAVÕTUMAKSUD</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Osavõtumaksu suurus Eesti Meistriliigas on 1250 EUR. Sel hooajal peab osavõtumaks olema tasutud
                        hiljemalt 30.septembril 2024.a.
                    </p>
                    <p className="mb-4">
                        Osavõtumaks peab ELTL poolt esitatava arve alusel olema tasutud hiljemalt 7 päeva jooksul peale
                        registreerimisaja möödumist. Kui selleks kuupäevaks ei ole arve tasutud, siis meeskonda Eesti
                        Meistriliigas osalema ei lubata.
                    </p>
                    <p className="mb-4">
                        Võistkonna registreerimisel käesoleva juhendi järgi võtab klubi endale juhendiga pandud rahalised ja
                        muud juhendis toodud kohustused ELTL ees.
                    </p>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>MEESKONNA KOHUSTUSED</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Registreerunud võistkond peab saatma hiljemalt 7 päeva peale 1.mängupäeva ühtses vormis
                        võistkonna liikmete portreefotod, mis avaldatakse liiga kodulehel. Nõude rikkumise korral on trahv 70
                        eurot. Juhul kui fotod on puudu ka 7 päeva pärast 2.mängupäeva, kohaldatakse uuesti trahvi 70 eurot
                        jne. Nõudmised fotodele saadetakse koos registreerimisvormiga klubidele.
                    </p>
                    <p className="mb-4">Võõrmängijate puhul tuleb edastada mängija koht tema koduriigi reitingus.</p>
                    <p className="mb-4">
                        Võistkonnal peab olema kahte erinevat tooni võistlussärk. Juhul, kui meeskond ei mängi mingil hetkel
                        ühtsete särkidega ning võistkond eirab päevakohtuniku sellekohast märkust on trahv 70 eurot.
                        Kohtumist saab edasi mängida ainult juhul, kui vale särgiga mänginud mängija vahetab särgi õiget värvi
                        särgi vastu.
                    </p>
                </CardContent>

                <CardHeader>
                    <CardTitle>VÕISTLUSSÜSTEEM</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Võistluste korraldamisel juhindutakse ka ELTL võistluste korraldamise tingimustest ja kohandatakse
                        ELTL distsiplinaarmäärustikku aga ka ELTL spordivõistlustega manipuleerimise tõkestamise reegleid.
                        Samuti juhindutakse Eesti Olümpiakomitee (EOK) tunnustatud  hartadest, koodeksitest ja hea juhtimise
                        tavast ning Maailma Antidopingu Agentuuri ning Eesti Antidopingu ja Spordieetika SA (EADSE)
                        õigusaktidest.
                    </p>
                    <p className="mb-4">Võistlused viiakse läbi kehtivate ITTF reeglite järgi.</p>
                    <p className="mb-4">
                        Meeskondade vahelised kohtumised alagrupis ning finaalpäeval toimuvad nelja võiduni järgmises
                        süsteemis:
                    </p>
                    <p className="mb-4 font-semibold">A-Y, B-X, C-Z, paarismäng, A-X, C-Y, B-Z</p>
                    <p className="mb-4">Üksikkohtumised mängitakse „parem viiest&quot;.</p>
                    <h3 className="text-lg font-semibold mb-2">Loosimine:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            ABC ja XYZ meeskondade loosimist ei toimu. Esimesel turniiritabeli läbimängimisel on ABC
                            meeskonnad kõrgema paigutusega meeskonnad. Teisel turniiritabeli läbimängimisel on ABC
                            meeskonnad madalama paigutusega meeskonnad.
                        </li>
                    </ul>
                </CardContent>
                <CardHeader>
                    <CardTitle>Mänguvoorud</CardTitle>
                </CardHeader>
                <CardContent>


                    <ScrollArea className="w-full rounded-md border mb-5 overflow-x-auto">
                        <Table className="border-collapse">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center border-r" colSpan={3}>1. päev</TableHead>
                                    <TableHead className="text-center border-r" colSpan={3}>2. päev</TableHead>
                                    <TableHead className="text-center border-r" colSpan={3}>3. päev</TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-center border-r">1. voor</TableHead>
                                    <TableHead className="text-center border-r">2. voor</TableHead>
                                    <TableHead className="text-center border-r">3. voor</TableHead>
                                    <TableHead className="text-center border-r">4. voor</TableHead>
                                    <TableHead className="text-center border-r">5. voor</TableHead>
                                    <TableHead className="text-center border-r">6. voor</TableHead>
                                    <TableHead className="text-center border-r">7. voor</TableHead>
                                    <TableHead className="text-center bg-muted"></TableHead>
                                    <TableHead className="text-center bg-muted">8. voor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    <TableCell className="text-center border-r">A-X</TableCell>
                                    {/* <TableCell className="" rowSpan={5}>Regrupeering</TableCell> */}
                                    <TableCell
                                        className="text-center border-r bg-muted align-middle whitespace-nowrap [writing-mode:vertical-rl] [transform:rotate(180deg)] p-4"
                                        rowSpan={5}
                                    >
                                        Regrupeering
                                    </TableCell>
                                    <TableCell className="text-center bg-muted">A-X</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center border-r">1-2</TableCell>
                                    <TableCell className="text-center border-r">1-6</TableCell>
                                    <TableCell className="text-center border-r">1-4</TableCell>
                                    <TableCell className="text-center border-r">1-5</TableCell>
                                    <TableCell className="text-center border-r">1-3</TableCell>
                                    <TableCell className="text-center border-r">1-7</TableCell>
                                    <TableCell className="text-center border-r">1-8</TableCell>
                                    <TableCell className="text-center bg-muted">2-1</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center border-r">3-8</TableCell>
                                    <TableCell className="text-center border-r">5-7</TableCell>
                                    <TableCell className="text-center border-r">3-5</TableCell>
                                    <TableCell className="text-center border-r">4-6</TableCell>
                                    <TableCell className="text-center border-r">2-4</TableCell>
                                    <TableCell className="text-center border-r">6-8</TableCell>
                                    <TableCell className="text-center border-r">2-7</TableCell>
                                    <TableCell className="text-center bg-muted">8-3</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center border-r">4-7</TableCell>
                                    <TableCell className="text-center border-r">4-8</TableCell>
                                    <TableCell className="text-center border-r">2-6</TableCell>
                                    <TableCell className="text-center border-r">3-7</TableCell>
                                    <TableCell className="text-center border-r">5-8</TableCell>
                                    <TableCell className="text-center border-r">2-5</TableCell>
                                    <TableCell className="text-center border-r">3-6</TableCell>
                                    <TableCell className="text-center bg-muted">7-4</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-center border-r">5-6</TableCell>
                                    <TableCell className="text-center border-r">2-3</TableCell>
                                    <TableCell className="text-center border-r">7-8</TableCell>
                                    <TableCell className="text-center border-r">2-8</TableCell>
                                    <TableCell className="text-center border-r">6-7</TableCell>
                                    <TableCell className="text-center border-r">3-4</TableCell>
                                    <TableCell className="text-center border-r">4-5</TableCell>
                                    <TableCell className="text-center bg-muted">6-5</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <h3 className="text-lg font-semibold mb-2">Ajakava:</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-8">
                        <li>Mängupäevade ajakava ja sellest kinnipidamine on oluline. Iga mängupäeva algusaeg on kell 10:00 või vastav antud mängupäevale.</li>
                        <li>Iga järgnev voor algab kohe pärast seda, kui eelmise vooru kõik kohtumised on lõppenud.</li>
                        <li>Kui ELTL ja mistahes TV edastaja on sõlminud kokkuleppe mängude edastamiseks, siis antakse vastava mängupäeva kohta täpne ajakava.</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">Hoiatused ja Eemaldamine:</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Kui mängija on mängupäeval saanud kolm hoiatust (olgu see kollane kaart või kollane/punane kaart või peakohtuniku suuline hoiatus), siis neljanda hoiatuse korral järgneb mängija eemaldamine (punane kaart).</li>
                        <li>Kui mängija on kogu turniiri ajal saanud neli hoiatust (olgu see kollane kaart või kollane/punane kaart või peakohtuniku suuline hoiatus), siis viienda hoiatuse korral järgneb mängija eemaldamine (punane kaart).</li>
                        <li>Peakohtunikul on õigus mängijat mitte eemaldada, lähtudes eelnevate rikkumiste raskusest.</li>
                        <li>Eemaldamise ulatus, olgu see kohtumisest, mängupäevalt või kogu turniirilt, sõltub eelnevate rikkumiste raskusest</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className='text-xl'>MÄNGUPÄEVAD</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>1. mängupäev – 3 vooru</li>
                        <li>2. mängupäev – 3 vooru</li>
                        <li>3. mängupäev – 2 vooru</li>
                        <li>4. mängupäev – 3 vooru</li>
                        <li>5. mängupäev – 3 vooru</li>
                        <li>6. mängupäev ehk finaalpäev – Esimese ja teise ringi punktide summa alusel poolfinaalid, kusjuures põhiturniiri võitja saab valida endale poolfinaali vastast põhiturniiril 3. ja 4. koha saavutanud võistkondade vahel. Poolfinaalide võitjad selgitavad omavahelises kohtumises Eesti Meistriliiga Meistervõistkonna, kaotajad mängivad III koha peale.</li>
                    </ul>

                    <p className="mb-4">
                        2-ringilisel põhiturniiril 8.koha saavutanud võistkond kukub järgmiseks aastaks meistriliigast välja I
                        liigasse. Ülemineku mängud toimuvad vaid sellisel juhul, kui vähemalt üks esiliiga võistkondadest
                        kinnitab valimisolekut Meistriliigaga liitumiseks, kui nad selle koha välja võitlevad. Meistriliigasse
                        pääsemise üleminekuturniir peetakse Meistriliiga 7. ning I liigas 2. koha saavutanud võistkondade
                        vahel. Juhul kui Meistriliigasse pääsemise soovi kinnitab ka I liigas 3 koha saavutanud klubi peetakse
                        Meistriliigasse pääsemise üleminekuturniir Meistriliigas 6. ja 7. ning I liigas 2. ja 3. koha saavutanud
                        võistkondade vahel.
                    </p>

                    <p className="mb-4">
                        Kaks paremat võistkonda saavad õiguse mängida järgmisel hooajal meistriliigas ja kaks nõrgemat
                        võistkonda jätkavad I liigas. I liiga võitja tagab koha meistriliigas. Kui aga I liigas tuleb esimeseks klubi,
                        kelle võistkond juba mängib meistriliigas, pääseb otse edasi paremuselt järgmine võistkond.
                        Ülemineku mänge saavad mängida klubid, kellel juba ei ole võistkonda meistriliigas või kelle
                        meistriliigas osalev võistkond kukub otse välja või peab mängima üleminekumänge.
                    </p>

                    <h3 className="text-lg font-semibold mb-2">AUTASUSTAMINE</h3>
                    <p className="mb-4">
                        Meistriliiga I – III koha saavutanud võistkondi autasustatakse vastava koha karikaga ja diplomiga ning
                        võistkondade liikmeid ja esindajat vastava koha medaliga.
                    </p>

                    <p className="mb-4">Võistkondi autasustatakse rahaliselt järgmiselt:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>I koht 1250 EUR</li>
                        <li>II koht 950 EUR</li>
                        <li>III koht 750 EUR</li>
                    </ul>

                    <p>
                        Võistlejad peavad autasustamisel viibima võistkonna ühtses sportlikus vormis. Autasu ja auhinnafondi
                        ei anta võistkonnale üle, kui võistkond ei võta osa auhinna tseremooniast.
                    </p>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader className='text-xl'>
                    <CardTitle>MAJANDAMINE</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Mängupäeva korraldaja kohustused</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Võistluspäeva peakohtuniku määravad võistluste peakohtunikud.</li>
                        <li>Kõiki mänge peavad lugema NU kategooriaga lauakohtunikud</li>
                        <li>Tagama võistluspaiga, mis vastab ELTL võistluste läbiviimise tingimustele</li>
                        <li>Tagama saalis interneti kaabliühenduse otseülekannete teostamiseks</li>
                        <li>Saatma hiljemalt 24 tunni jooksul peale võistluspäeva lõppu tulemused aadressile margit.tamm@lauatennis.ee</li>
                        <li>Tagama igale võistkonnale võistlusväljakul kõrvale vähemalt 5 tooli</li>
                        <li>Tagama võistlusväljaku suurusega vähemalt 6x12 meetrit</li>
                        <li>Juhendis sätestamata olukordade puhul kehtub ELTL juhatuse poolt Vastu võetud Eesti Lauatenniseliidu võistluste korraldamise kord, mis on leitav SIIT</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">Võistluspäeva peakohtuniku kohustused</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Tagama võistluspäeva sujuva läbiviimise ning määrustele vastavuse</li>
                        <li>Täitma peakohtuniku protokolli ja edastama selle Eesti Lauatenniseliidule</li>
                        <li>Saatma reitingufaili Eesti Lauatenniseliidule vastavalt Eesti Lauatenniseliidu võistluste korraldamise korrale</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">Eesti Lauatenniseliidu kohustused</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Tasuma korraldajale kohtunike, lauakohtunike ning saalirendi kulud</li>
                        <li>Saatma korraldajale peakohtuniku protokolli blanketi</li>
                        <li>Avaldama fotogalerii peale võistluspäeva</li>
                        <li>Luua meistriliigale kodulehel alamleht ja avaldama seal infot võistkondade ning tulemuste kohta</li>
                        <li>Kandma võimalusel üle igal mängupäeval vähemalt ühte kohtumist ELTL Youtube kanalis ja/või Facebooki kanalil ja/või Delfi TV-s või mõnes muus interneti meedia kanalis</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-2">Üldine info</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Et võistkond lubatakse mängupäeval mängima, peab olema kohal vähemalt kolm ülesantud võistkonna liiget. Kui võistkond ei saa nimetatud juhul mängida, loetakse seda mängimisest loobumiseks.</li>
                        <li>Juhul kui võistkonnal puudub ühte võistlusvorm ning võistkond eirab päevakohtuniku sellekohast märkust , teeb peakohtunik ELTL juhatusele ettepaneku võistkonda trahvida summas 70 EUR</li>
                        <li>Võistkondade vooru eelse loosimise juures lepitakse kokku ja märgitaks üles, mis värvi särgiga võistkond mängib. Omavahel kohtuvatel meeskondadel peab olema erinevat värvi särk</li>
                        <li>Igas kohtumises fikseeritakse mänguväljaku barjääril kohtumise jooksev seis</li>
                        <li>Oma tervisliku seisundi eest vastutab sportlane ise</li>
                        <li>Tulemusi arvestatakse Eesti reitingu koostamisel</li>
                        <li>Iga registreerunud sportlane peab olema valmis dopingukontrolliks. Dopingkontrollist keeldumist või dopingukontrollist kõrvalehoidmist käsitletakse dopingureegli rikkumisena.</li>
                        <li>Sportlane on kohustatud järgima ausa mängu, spordivõistluste manipuleerimise vastaseid ja sporditurvalisuse reegleid.</li>
                        <li>Kõik juhendis määratlemata küsimused lahendab ELTL või tema poolt määratud võistluste peakohtunik(ud)</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>KAEBUSED JA PROTESTID</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Protestid esitatakse taasesitatvas vormis. Protestide esitamiseks on aega mängupäevale järgneva
                        tööpäeva lõpuni (kell 23:59)
                    </p>
                    <p className="mb-4">
                        Protest peab olema esitatud koos põhjendustega kirjalikult mängupäeva peakohtunikule või Eesti
                        Võistkondlike Meistrivõistluste peakohtunikule.
                    </p>
                    <p className="mb-4">
                        Protesti esitamise tasu on 120 EUR, mis protesti rahuldamisel tagastatakse.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}