import database from '@react-native-firebase/database';
export const db = database();

//High score kaydetme
export const saveHighScore = async score => {
  try {
    await db.ref('/highScore').set(score);
    console.log('High score kaydedildi:', score);
  } catch (error) {
    console.error('Kaydetme hatası:', error);
  }
};
//high score okuma
export const getHighScore = async () => {
  try {
    const snapshot = await db.ref('/highScore').once('value');
    return snapshot.val() || 0;
  } catch (error) {
    console.error('Okuma Hatası', error);
    return 0;
  }
};
