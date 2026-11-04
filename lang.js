'use strict';

/* =========================================================
   All the text in Respira, in English and Italian.
   {} is replaced with a time, e.g. "3:20 left".
   ========================================================= */

const T = {
  en: {
    tagline: 'Breathe slowly. Feel better.',
    madeBy: 'made by gionzana',
    coffee: '☕ buy me a coffee',
    aboutBtn: 'About these exercises',
    language: 'Language',
    back: 'Back to exercises',
    sound: 'Sound cues',
    duration: 'Duration',

    in: 'Breathe in',
    topUp: 'Top-up breath in',
    out: 'Breathe out',
    outLong: 'Long breath out',
    hold: 'Hold',
    belly: 'Breathe slowly into your belly',

    tap: 'Tap',
    tapStart: 'Tap to start',
    resume: 'Resume',
    tapResume: 'Tap to resume',
    again: 'Again',
    paused: 'Paused',
    done: 'Well done 🌿',
    session: 'Session {}',
    left: '{} left',
    restart: 'Restart',
    pause: 'Pause',
    start: 'Start',
    cycles: 'cycles',

    aboutTitle: 'About Respira',
    aboutIntro: 'Slow breathing with a long, gentle exhale helps the body shift into its calm, resting mode. Five minutes a day is a good start.',
    about: `
      <li><b>Cyclic sighing</b>: in a 2023 Stanford study, 5 minutes a day improved mood and slowed breathing more than mindfulness meditation.</li>
      <li><b>4-7-8</b>: the long exhale is what helps the heart rate settle.</li>
      <li><b>Resonance</b>: about 5.5 breaths a minute, a pace linked to higher heart rate variability.</li>
      <li><b>Box</b>: four equal steps, used to stay steady under stress.</li>
      <li><b>Belly</b>: slow breathing into the belly, studied for lowering stress.</li>`,
    safety: 'Stop if you feel dizzy or light-headed, and breathe normally. Skip the breath holds if you are pregnant or have a heart or lung condition. Respira is not a substitute for medical advice.',
    help: 'Tap the circle to start or pause. The 🔔 button turns gentle sound cues on or off.',
    close: 'Close',

    ex: {
      sigh: {
        name: 'Cyclic sighing', tag: 'Lifts your mood in 5 minutes', pattern: 'In 2 · top-up 1 · out 6 s',
        how: 'Breathe in through the nose, top up with a second short sniff, then sigh out slowly through the mouth.',
      },
      478: {
        name: '4-7-8 breathing', tag: 'A long exhale to settle down', pattern: 'In 4 · hold 7 · out 8 s',
        how: 'In through the nose, hold gently, then out through the mouth with a soft whoosh. Follow the dot.',
      },
      res: {
        name: 'Resonance breathing', tag: 'About 5.5 slow breaths a minute', pattern: 'In 5 · out 6 s',
        how: 'Breathe smoothly through the nose, with no pauses between breaths.',
      },
      box: {
        name: 'Box breathing', tag: 'Four equal steps to stay steady', pattern: 'In 4 · hold 4 · out 4 · hold 4 s',
        how: 'Follow the dot around the square: in, hold, out, hold.',
      },
      belly: {
        name: 'Belly breathing', tag: 'Slow breaths at your own pace', pattern: 'Timer only',
        how: 'One hand on your belly, one on your chest. Let the belly rise as you breathe in; keep the chest still.',
      },
    },
  },

  it: {
    tagline: 'Respira piano. Stai meglio.',
    madeBy: 'creata da gionzana',
    coffee: '☕ offrimi un caffè',
    aboutBtn: 'Informazioni su questi esercizi',
    language: 'Lingua',
    back: 'Torna agli esercizi',
    sound: 'Segnali sonori',
    duration: 'Durata',

    in: 'Inspira',
    topUp: 'Inspira ancora un po’',
    out: 'Espira',
    outLong: 'Espira a lungo',
    hold: 'Trattieni',
    belly: 'Respira lentamente con la pancia',

    tap: 'Tocca',
    tapStart: 'Inizia',
    resume: 'Riprendi',
    tapResume: 'Riprendi',
    again: 'Ancora',
    paused: 'In pausa',
    done: 'Ben fatto 🌿',
    session: 'Sessione {}',
    left: 'Ancora {}',
    restart: 'Ricomincia',
    pause: 'Pausa',
    start: 'Inizia',
    cycles: 'cicli',

    aboutTitle: 'Informazioni su Respira',
    aboutIntro: 'Respirare lentamente, con un’espirazione lunga e dolce, aiuta il corpo a entrare in uno stato di calma e riposo. Cinque minuti al giorno sono un buon inizio.',
    about: `
      <li><b>Sospiro ciclico</b>: in uno studio di Stanford del 2023, 5 minuti al giorno hanno migliorato l’umore e rallentato il respiro più della meditazione mindfulness.</li>
      <li><b>4-7-8</b>: è la lunga espirazione ad aiutare il battito a rallentare.</li>
      <li><b>Risonante</b>: circa 5,5 respiri al minuto, un ritmo associato a una maggiore variabilità della frequenza cardiaca.</li>
      <li><b>Quadrata</b>: quattro tempi uguali, usati per mantenere la calma sotto stress.</li>
      <li><b>Addominale</b>: respiro lento con la pancia, studiato per ridurre lo stress.</li>`,
    safety: 'Fermati se hai le vertigini o ti senti la testa leggera, e torna a respirare normalmente. Non trattenere il respiro se sei in gravidanza o hai problemi cardiaci o polmonari. Respira non sostituisce il parere di un medico.',
    help: 'Tocca il cerchio per iniziare o mettere in pausa. Il pulsante 🔔 attiva o disattiva i segnali sonori.',
    close: 'Chiudi',

    ex: {
      sigh: {
        name: 'Sospiro ciclico', tag: 'Migliora l’umore in 5 minuti', pattern: 'Inspira 2 · ancora 1 · espira 6 s',
        how: 'Inspira dal naso, aggiungi un secondo respiro breve, poi sospira lentamente dalla bocca.',
      },
      478: {
        name: 'Respirazione 4-7-8', tag: 'Una lunga espirazione per calmarti', pattern: 'Inspira 4 · trattieni 7 · espira 8 s',
        how: 'Inspira dal naso, trattieni con dolcezza, poi espira dalla bocca con un soffio leggero. Segui il punto.',
      },
      res: {
        name: 'Respirazione risonante', tag: 'Circa 5,5 respiri lenti al minuto', pattern: 'Inspira 5 · espira 6 s',
        how: 'Respira dal naso in modo fluido, senza pause tra un respiro e l’altro.',
      },
      box: {
        name: 'Respirazione quadrata', tag: 'Quattro tempi uguali per ritrovare stabilità', pattern: 'Inspira 4 · trattieni 4 · espira 4 · trattieni 4 s',
        how: 'Segui il punto lungo il quadrato: inspira, trattieni, espira, trattieni.',
      },
      belly: {
        name: 'Respirazione addominale', tag: 'Respiri lenti, al tuo ritmo', pattern: 'Solo timer',
        how: 'Una mano sulla pancia, una sul petto. Inspirando lascia salire la pancia e tieni fermo il petto.',
      },
    },
  },
};
