import { reactive, computed } from "@nuxtjs/composition-api";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export default function AuthStore(ctx: any) {
  // 状態
  const state = reactive<{
    currentUser: any,
    user: any,
    instructor: any,
    gyms: Array<Object>,
    gym: any,
    members: Array<Object>,
    member: any,
  }>({
    currentUser: null,
    user: null,
    instructor: null,
    gyms: [],
    gym: null,
    members: [],
    member: null,
  })

  // computed
  const isLogined = computed(() => {
    return !!state.currentUser;
  })

  const currentUser = computed(() => {
    return state.currentUser;
  })

  const user = computed(() => {
    return state.user;
  })

  const instructor = computed(() => {
    return state.instructor;
  })

  const gyms = computed(() => {
    return state.gyms;
  })

  const gym = computed(() => {
    return state.gym;
  })

  const members = computed(() => {
    return state.members;
  })

  const member = computed(() => {
    return state.member;
  })

  // ロジック
  const login = async () => {
    const auth = getAuth();
    let val = false;

    await signInWithPopup(auth, new GoogleAuthProvider)
      .then((result) => {
        state.currentUser = result.user;
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
      state.currentUser = null;
      state.user = null;
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
          state.currentUser = auth.currentUser;
          await fetchUser({ uid: currentUser?.uid })
        } else {
          state.currentUser = null;
          state.user = null;
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
        state.user = doc.data();
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
        state.instructor = doc.data();
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

      state.gyms = tmpGyms
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
        state.gym = doc.data();
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

      state.members = tmpMembers
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
        state.member = doc.data();
      });
    }

    return member.value
  }

  return {
    isLogined,
    currentUser,
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
