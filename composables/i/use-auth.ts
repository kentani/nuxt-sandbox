import { reactive, computed } from "@nuxtjs/composition-api";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, orderBy, limit, DocumentData } from "firebase/firestore";

export default function AuthStore(ctx: any) {
  // 状態
  const state = reactive<{
    tmpCurrentUser: any,
    tmpUser: any,
    tmpInstructor: any,
    tmpGyms: Array<Object>,
    tmpGym: any,
    tmpMembers: Array<Object>,
    tmpMember: any,
  }>({
    tmpCurrentUser: null,
    tmpUser: null,
    tmpInstructor: null,
    tmpGyms: [],
    tmpGym: null,
    tmpMembers: [],
    tmpMember: null,
  })

  // computed
  const isLogined = computed(() => {
    return !!state.tmpCurrentUser;
  })

  const user = computed(() => {
    return state.tmpUser;
  })

  const instructor = computed(() => {
    return state.tmpInstructor;
  })

  const gyms = computed(() => {
    return state.tmpGyms;
  })

  const gym = computed(() => {
    return state.tmpGym;
  })

  const members = computed(() => {
    return state.tmpMembers;
  })

  const member = computed(() => {
    return state.tmpMember;
  })

  // ロジック
  const login = async () => {
    const auth = getAuth();
    let val = false;

    await signInWithPopup(auth, new GoogleAuthProvider)
      .then((result) => {
        state.tmpCurrentUser = result.user;
        val = true;
      }).catch((error) => {
        console.log(error);
      });

    return val;
  }

  const logout = () => {
    const auth = getAuth();
    let val = false;

    signOut(auth).then(() => {
      val = true;
    }).catch((error) => {
      console.log(error);
    });

    return val;
  }

  const confirmAuth = async () => {
    await new Promise<void>((resolve) => {
      const auth = getAuth();

      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          state.tmpCurrentUser = auth.currentUser;
          await fetchUser({ uid: currentUser?.uid })
        } else {
          state.tmpCurrentUser = null;
          state.tmpUser = null;
        }

        resolve();
      })
    });
  }

  const fetchUser = async (params: { uid: String }) => {
    if (ctx && !user.value) {
      const db = getFirestore(ctx.$firebase);

      const querySnapshot = await getDocs(query(
        collection(db, 'users'),
        where("uid", "==", params.uid),
        orderBy('uid'),
        limit(1)
      ));

      querySnapshot.forEach((doc) => {
        state.tmpUser = doc.data();
      });
    }

    return user.value
  }

  const fetchInstructor = async (params: { userID: String, gymID: String }) => {
    if (ctx && !instructor.value) {
      const db = getFirestore(ctx.$firebase);

      const querySnapshot = await getDocs(query(
        collection(db, 'instructors'),
        where("userID", "==", params.userID),
        where("gymID", "==", params.gymID),
        orderBy('userID'),
        limit(1)
      ));

      querySnapshot.forEach((doc) => {
        state.tmpInstructor = doc.data();
      });
    }

    return instructor.value
  }

  const fetchGyms = async (params: { gymIDs: Array<String> }) => {
    if (ctx && !gyms.value?.length) {
      const db = getFirestore(ctx.$firebase);

      const querySnapshot = await getDocs(query(
        collection(db, 'gyms'),
        where("id", "in", params.gymIDs),
        orderBy('id'),
      ));

      let tmpGyms: Object[] = [];

      querySnapshot.forEach((doc) => {
        tmpGyms.push(doc.data())
      });

      state.tmpGyms = tmpGyms
    }

    return gyms.value
  }

  const fetchGym = async (params: { gymID: String }) => {
    if (ctx && !gym.value) {
      const db = getFirestore(ctx.$firebase);

      const querySnapshot = await getDocs(query(
        collection(db, 'gyms'),
        where("id", "==", params.gymID),
        orderBy('id'),
        limit(1)
      ));

      querySnapshot.forEach((doc) => {
        state.tmpGym = doc.data();
      });
    }

    return gym.value
  }

  const fetchMembers = async (params: { gymID: String }) => {
    if (ctx && !members.value?.length) {
      const db = getFirestore(ctx.$firebase);

      const querySnapshot = await getDocs(query(
        collection(db, 'members'),
        where("gymID", "==", params.gymID),
        orderBy('gymID'),
      ));

      let tmpMembers: Object[] = []

      querySnapshot.forEach((doc) => {
        tmpMembers.push(doc.data());
      });

      state.tmpMembers = tmpMembers
    }

    return members.value
  }

  const fetchMember = async (params: { gymID: String, memberID: String }) => {
    if (ctx && !member.value) {
      const db = getFirestore(ctx.$firebase);

      const querySnapshot = await getDocs(query(
        collection(db, 'members'),
        where("id", "==", params.memberID),
        where("gymID", "==", params.gymID),
        orderBy('id'),
        limit(1)
      ));

      querySnapshot.forEach((doc) => {
        state.tmpMember = doc.data();
      });
    }

    return member.value
  }

  return {
    isLogined,
    user,
    instructor,
    gyms,
    gym,
    members,
    member,
    login,
    logout,
    confirmAuth,
    fetchUser,
    fetchInstructor,
    fetchGyms,
    fetchGym,
    fetchMembers,
    fetchMember,
  }
}

export type AuthStoreType = ReturnType<typeof AuthStore>
