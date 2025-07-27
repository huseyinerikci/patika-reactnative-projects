export default function (errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi';
    case 'auth/email-already-exists':
      return 'Kullanıcı zaten kayıtlı';
    case 'auth/user-not-found':
      return 'Kullanıcı bulunamadı';
    case 'auth/weak-password':
      return 'Zayıf parola';
    case 'auth/wrong-password':
      return 'Geçersiz parola';
    case 'auth/invalid-credential':
      return 'Kullanıcı kayıtlı değil';

    default:
      return errorCode;
  }
}
