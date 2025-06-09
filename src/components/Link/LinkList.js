import React from "react";
import firebase from "../../firebase";
import LinkItem from "./LinkItem";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
} from "firebase/firestore";
import { IonButton } from "@ionic/react";

const PAGE_SIZE = 10;

const LinkList = (props) => {
  const [links, setLinks] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const isTrending = props.location.pathname.includes("trending");
  const unsubscribeRef = React.useRef(null);

  React.useEffect(() => {
    // Reset state and fetch initial links when isTrending changes
    setLinks([]);
    setLastDoc(null);
    setHasMore(true);

    // Call fetchLinks and store the unsubscribe function
    fetchLinks(true, null); // Pass null as currentUnsubscribe for initial fetch

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
    // eslint-disable-next-line
  }, [isTrending]);

  async function fetchLinks(isInitialFetch = false, currentUnsubscribe = unsubscribeRef.current) {
    if (loading && !isInitialFetch) return; // Allow initial fetch even if loading (e.g. from previous state)
    setLoading(true);

    // Unsubscribe from previous listener before creating a new one
    if (currentUnsubscribe) {
      currentUnsubscribe();
    }

    const linksCollection = collection(firebase.db, "links");
    const order = isTrending ? "voteCount" : "created";
    let q;

    if (isInitialFetch || !lastDoc) {
      q = query(linksCollection, orderBy(order, "desc"), limit(PAGE_SIZE));
    } else {
      q = query(
        linksCollection,
        orderBy(order, "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const newLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isInitialFetch) {
        setLinks(newLinks);
      } else {
        // Filter out duplicates that might come from existing listener window
        const uniqueNewLinks = newLinks.filter(nl => !links.some(l => l.id === nl.id));
        setLinks((prevLinks) => [...prevLinks, ...uniqueNewLinks]);
      }

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
      // Important: hasMore should be based on the number of NEWLY fetched links, not total.
      // If newLinks.length is less than PAGE_SIZE, no more docs for this specific query.
      setHasMore(newLinks.length === PAGE_SIZE);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching links:", error);
      setLoading(false);
      // Potentially set hasMore to false or handle error state
    });
  }

  function handleLoadMore() {
    if (!loading && hasMore) {
      // Pass the current unsubscribe function to fetchLinks
      fetchLinks(false, unsubscribeRef.current);
    }
  }


  return (
    <>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          url={`/link/${link.id}`}
          link={link}
          index={index + 1}
        />
      ))}
      {hasMore && (
        <IonButton onClick={handleLoadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </IonButton>
      )}
    </>
  );
};

export default LinkList;