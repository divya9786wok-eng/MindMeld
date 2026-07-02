import Papa from 'papaparse';
import csvData from '../assets/gamerecommendations.csv';

export const getGameRecommendations = (sex, age, categories) => {
  const ageRange = getAgeRange(age);
  let recommendations = [];

  Papa.parse(csvData, {
    header: true,
    download: true,
    complete: (results) => {
      recommendations = results.data.map(row => {
        let gameIds = row.gameIds ? row.gameIds.replace(/"/g, '').split(',') : [];

        return {
          ageGroup: row.ageGroup,
          gender: row.gender,
          cumulativeScore: parseInt(row.cumulativeScore),
          category: row.category,
          gameIds: gameIds
        };
      });
    }
  });

  let allGameIds = [];
  categories.forEach(cat => {
    const filteredRecommendations = recommendations.filter(rec => 
      rec.gender === sex &&
      rec.ageGroup === ageRange &&
      rec.cumulativeScore <= cat.pscore &&
      rec.category === cat.type
    ).map(rec => rec.gameIds).flat();
    allGameIds = [...allGameIds, ...filteredRecommendations];
  });
  return allGameIds;
};

const getAgeRange = (age) => {
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 34) return '25-34';
  if (age >= 35 && age <= 44) return '35-44';
  if (age >= 45 && age <= 54) return '45-54';
  return '';
};
