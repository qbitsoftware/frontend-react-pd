export default function LauatenniseReeglid() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Table Tennis Rules
      </h1>
      <div className="space-y-6 mt-10 md:mt-20">
        <section>
          <h2 className="text-xl font-semibold mb-2">Equipment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Ball with a diameter of 40mm, racket, and table tennis table.
            </li>
            <li>
              The table tennis table is divided into two equal halves by a net.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Scoring</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The set is won by the player who first scores 11 points, except
              when both players have 10 points, in which case the player who
              leads by 2 points wins.
            </li>
            <li>The match consists of an odd number of sets.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Serving</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              A coin toss is conducted at the beginning of the match. The winner
              of the toss chooses the side or decides who serves.
            </li>
            <li>
              Place the ball on an open palm and throw it up at least 16cm. The
              ball must be hit as it starts to fall.
            </li>
            <li>
              When serving, the ball must first hit the server's side of the
              table, then go over or around the net, and then hit the receiver's
              side of the table.
            </li>
            <li>
              At the start of the serve, before hitting the ball, the ball must
              be above the playing surface and behind the server's end line.
            </li>
            <li>
              The server changes every 2 points, except when both players have
              10 points, then the server changes every 1 point.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Returning</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              In play and when receiving a serve, the ball must touch the
              player's side of the table once before it can be hit back.
            </li>
            <li>
              If a player hits the ball over the table before it touches their
              side, it is a "volley" and is not allowed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            When is a point scored?
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>If a player fails to make a correct serve.</li>
            <li>If a player fails to make a correct return.</li>
            <li>
              If a player volleys the ball before it crosses their side of the
              table.
            </li>
            <li>If a player intentionally hits the ball two or more times.</li>
            <li>If a player moves the table surface.</li>
            <li>If a player's free hand touches the table surface.</li>
            <li>
              If a player touches the net. The net must not be touched by the
              player's clothing or racket.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            When is a point not scored?
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              If during a serve the ball touches the net or net holder but then
              lands on the receiver's side, the point is not counted and the
              serve is repeated.
            </li>
            <li>
              If the receiver catches or hits the ball before it touches their
              side of the table during a serve after touching the net.
            </li>
            <li>
              If a player is disturbed by someone or something while making a
              legal shot.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Para Table Tennis</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>A crutch or cane must not touch the table.</li>
            <li>
              When serving against a wheelchair player, the ball must not rise
              vertically or move back towards the net on the receiver's side.
              Also, the ball must not exit the receiver's side from the
              sideline. This means a new serve.
            </li>
            <li>
              The wheelchair player's buttocks and legs must not rise from the
              support during play. Point to the opponent.
            </li>
            <li>
              In doubles, on the wheelchair player's side, anyone can receive,
              not alternately.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

