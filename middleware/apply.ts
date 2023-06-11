import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

const checkAuth = (ctx: any) => {
  return new Promise((resolve) => {
    const auth = getAuth();
    let user: any;

    onAuthStateChanged(auth, async (currentUser) => {
      user = currentUser;

      if (currentUser) {
        // ログイン済み
        const db = getFirestore(ctx.$firebase);

        const querySnapshot = await getDocs(query(
          collection(db, 'users'),
          where("uid", "==", currentUser?.uid),
          orderBy('uid'),
          limit(1)
        ));

        querySnapshot.forEach((doc) => {
          user = doc.data();
        });

        if (user.admin) {
          // 管理者
          return ctx.redirect('/admin/menus');
        } else if (user.approved || user.registered) {
          // 承認済み || 登録済み
          return ctx.redirect('/gyms');
        } else {
          // 未承認 && 未登録
          // 承認画面のまま
        }
      } else {
        // 未ログイン
        return ctx.redirect('/login');
      };
    });

    return resolve(user);
  })
}

export default function (ctx: any) {
  return checkAuth(ctx)
}
