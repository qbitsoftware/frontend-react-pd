export default function LauatenniseReeglid() {
    return (
      <div className="container bg-white my-4 rounded-md mx-auto px-8 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Lauatennise Reeglid</h1>
        <div className="space-y-6 mt-10 md:mt-20">
          <section>
            <h2 className="text-xl font-semibold mb-2">Mänguvahendid</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Pall, läbimõõduga 40mm, reket ja lauatenniselaud.</li>
              <li>Lauatenniselaud on jagatud kaheks võrdseks pooleks võrguga.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold mb-2">Punktiarvestus</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Seti võit läheb mängijale kes esimesena kogub 11 punkti välja arvatud juhul kui mõlemal mängijal on 10 punkti, sellisel juhul võidab mängija kes läheb juhtima 2 punktiga.</li>
              <li>Kohtumine koosneb paaritus arvust settidest.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold mb-2">Servimine</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kohtumise alguses võetakse loosi. Loosi võitja valib poole või otsustab kes servib.</li>
              <li>Aseta pall lahtisele peopesale ja viska üles vähemalt 16cm. Palli peab tabama kui viimane on hakanud langema.</li>
              <li>Servides peab pall kõigepealt tabama servija lauapoolt, seejärel lendama üle või ümber võrgu ja siis tabama vastuvõtja lauapoolt.</li>
              <li>Servimise alustamisel, enne kui palli lüüakse, peab pall asuma laua mängupinnast kõrgemal ja servija poolse laua otsajoone taga.</li>
              <li>Iga 2 punkti järel vahetub servija, välja arvatud kui mõlemal mängijal on 10 punkti, siis vahetub servija iga 1 punkti järel.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold mb-2">Tõrjumine</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mängus ja servi vastuvõtul peab pall puudutama 1 korra mängija lauapoolt ennem kui võib sellel lüüa tagasi.</li>
              <li>Kui mängija tabab palli laua kohale nnem, kui pall puudutab tema lauapoolt, siis on see "löök lennult" ja ei ole määrustepärane.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold mb-2">Millal on punkt?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kui mängija ei suuda sooritada õiget servi.</li>
              <li>Kui mängija ei suuda sooritada õiget tõrjet.</li>
              <li>Kui mängija lööb palli lennult, ennem kui pall ületab tema lauapoole.</li>
              <li>Kui mängija lööb meelega kaks või enam korda palli.</li>
              <li>Kui mängija liigutab lauapinda.</li>
              <li>Kui mängija käsi mis ei hoia reketit, puudutab lauapinda.</li>
              <li>Kui mängija puudutab võrku. Võrkku ei tohi puudutada mängija riided või reket.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold mb-2">Millal ei ole punkt?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kui servi ajal pall riivab võrkku või võrgu hoidjat, kuid maandub seejärel vastuvõtja poolel, siis punkti ei loeta ja serv läheb kordamisele.</li>
              <li>Kui vastuvõtja püüab või lööb palli ennem kui see puudutab tema lauapoolt servi ajal peale võrgu puudet.</li>
              <li>Kui mängijat segab keegi või miski sooritamast määrustepärast lööki.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold mb-2">Para lauatennis</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kargu või kepiga ei tohi mängu lauda puudutada.</li>
              <li>Ratastoolismängija vastu servides ei tohi pall vastuvõtja poolel tõusta vertikaalselt või liikuda võrgu poole tagasi. Samas ei tohi pall vastuvõtja poolel väljuda külgjoonest. See tähendab uut servi.</li>
              <li>Ratastoolismängija istmik ja jalad ei tohi mängu ajal toelt tõusta. Punkt vastasele.</li>
              <li>Paarismängus ratastoolismängija poolel võib vastu võtta kes iganes, mitte vaheldumisi.</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }
  
  