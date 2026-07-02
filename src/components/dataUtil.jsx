export const fetchJSONData = async (filePath) => {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  };
  
  // Function to get age group based on age
  export const getAgeGroup = (age) => {
    if (age >= 0 && age <= 6) return '0-6';
    if (age >= 7 && age <= 12) return '6-12';
    if (age >= 13 && age <= 18) return '12-18';
    if (age >= 19 && age <= 24) return '18-24';
    if (age >= 25 && age <= 30) return '24-30';
    if (age >= 31 && age <= 36) return '30-36';
    if (age >= 37 && age <= 42) return '36-42';
    if (age >= 43 && age <= 48) return '42-48';
    if (age >= 49 && age <= 54) return '48-54';
    return '54+';
  };
  
  // Function to group activities by type
  export const groupActivitiesByType = (activities, ageGroup, sex) => {
    const groupedActivities = {};
  
    activities.forEach((activity) => {
      if (
        activity['age-group'] === ageGroup &&
        activity.gender === sex
      ) {
        if (!groupedActivities[activity.category]) {
          groupedActivities[activity.category] = [];
        }
        groupedActivities[activity.category].push(activity);
      }
    });
  
    return groupedActivities;
  };