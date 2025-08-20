export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Reminder = {
  id: string;
  time: string; // örn: "08:30"
  label: string; // örn: "Kahvaltı"
};
