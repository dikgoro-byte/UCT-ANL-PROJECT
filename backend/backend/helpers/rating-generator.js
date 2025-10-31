// List of 23 top African players
const SQUAD_NAMES = [
  "Mohamed Salah", "Victor Osimhen", "Sadio Mané", "Achraf Hakimi",
  "Riyad Mahrez", "Thomas Partey", "Victor Boniface", "Mohammed Kudus",
  "André Onana", "Sébastien Haller", "Yassine Bounou", "Serhou Guirassy",
  "Franck Kessié", "Kalidou Koulibaly", "Nayef Aguerd", "Sofyan Amrabat",
  "Ismaël Bennacer", "Edmond Tapsoba", "Pape Matar Sarr", "Odilon Kossounou",
  "Wilfried Zaha", "Nicolas Jackson", "Youssef En-Nesyri"
];

const randRating = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateSquad = () => {
  const squad = [];
  const positions = ['GK', 'DF', 'MD', 'AT'];
  
  for (let i = 0; i < 23; i++) {
    const naturalPos = positions[i % 4];
    const ratings = {
      GK: randRating(40, 60),
      DF: randRating(40, 60),
      MD: randRating(40, 60),
      AT: randRating(40, 60),
    };
    ratings[naturalPos] = randRating(75, 95);

    squad.push({
      name: SQUAD_NAMES[i],
      isCaptain: (i === 0), // Logic for creating captain
      naturalPosition: naturalPos,
      ratings: ratings,
    });
  }
  return squad;
};

export const calculateTeamRating = (squad) => {
  const totalRating = squad.reduce((acc, player) => {
    return acc + player.ratings[player.naturalPosition];
  }, 0);
  return Math.round(totalRating / 23);
};