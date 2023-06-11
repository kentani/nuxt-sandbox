import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function (ctx: any) {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return ctx.redirect('/login');
    };
  });
}
