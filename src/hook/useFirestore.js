import { useQuery, useQueryClient } from "react-query";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFirestore = (room, pin) => {
  const firestore = firebase.firestore();
  const queryClient = useQueryClient();

  const queryKey = ["chat", room, pin];

  const fetchdata = async () => {
    const query = firestore
      .collection("chat")
      .where("room", "==", room)
      .where("pin", "==", pin)
      .orderBy("timestamp");

    query.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      queryClient.setQueryData(queryKey, data);
    });

    return [];
  };
  return useQuery(queryKey, fetchdata, {
    initialData: [],
    refetchOnWindowFocus: false, 
    refetchOnReconnect: false, 
    refetchInterval: false, 
  });
};

export default useFirestore;
