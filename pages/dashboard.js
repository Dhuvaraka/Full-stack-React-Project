import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Message from "@/components/message";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null); // State to hold unsubscribe function

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    setUnsubscribe(() => unsub); // Set the unsubscribe function
  };

  useEffect(() => {
    if (unsubscribe) {
      return unsubscribe(); // Unsubscribe on component unmount
    }

    getData();

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup on unmount if still subscribed
      }
    };
  }, [user, loading]);

  const deletePost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const editPost = async (postId, updatedDescription) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { description: updatedDescription });
      console.log("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => (
          <Message
            key={post.id}
            avatar={post.avatar}
            username={post.username}
            description={post.description}
            isOwner={user && post.user === user.uid} // Pass whether current user is owner
            onDelete={() => deletePost(post.id)} // Pass delete function
            onEdit={(updatedDescription) => editPost(post.id, updatedDescription)} // Pass edit function
          />
        ))}
      </div>
      <button onClick={() => auth.signOut()} className="font-medium text-white bg-gray-800 py-2 px-4 my-6">
        Sign out
      </button>
    </div>
  );
}
