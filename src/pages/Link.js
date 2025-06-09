import React from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";
import firebase from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Browser } from "@capacitor/browser";
import UserContext from "../contexts/userContext";
import NavHeader from "../components/Header/NavHeader";
import LinkItem from "../components/Link/LinkItem";
import LinkComment from "../components/Link/LinkComment";
import CommentModal from "../components/Link/CommentModal";

const Link = (props) => {
  const { user } = React.useContext(UserContext);
  const [link, setLink] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const linkId = props.match.params.linkId;
  const linkRef = doc(firebase.db, "links", linkId);

  React.useEffect(() => {
    getLink();
    // eslint-disable-next-line
  }, [linkId]);

  function getLink() {
    getDoc(linkRef).then((docSnap) => {
      setLink({ ...docSnap.data(), id: docSnap.id });
    });
  }

  function handleOpenModal() {
    if (!user) {
      props.history.push("/login");
    } else {
      setShowModal(true);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleAddComment(commentText) {
    if (!user) {
      props.history.push("/login");
    } else {
      getDoc(linkRef).then((docSnap) => {
        if (docSnap.exists()) {
          const previousComments = docSnap.data().comments;
          const newComment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText,
          };
          const updatedComments = [...previousComments, newComment];
          updateDoc(linkRef, { comments: updatedComments });
          setLink((prevState) => ({
            ...prevState,
            comments: updatedComments,
          }));
        }
      });
      setShowModal(false);
    }
  }

  function handleAddVote() {
    if (!user) {
      props.history.push("/login");
    } else {
      getDoc(linkRef).then((docSnap) => {
        if (docSnap.exists()) {
          const previousVotes = docSnap.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVotes, vote];
          const voteCount = updatedVotes.length;
          updateDoc(linkRef, { votes: updatedVotes, voteCount });
          setLink((prevState) => ({
            ...prevState,
            votes: updatedVotes,
            voteCount: voteCount,
          }));
        }
      });
    }
  }

  function handleDeleteLink() {
    deleteDoc(linkRef)
      .then(() => {
        console.log(`Document with ID ${link.id} deleted`);
      })
      .catch((err) => {
        console.error("Error deleting document:", err);
      });
    props.history.push("/");
  }

  function postedByAuthUser(link) {
    return user && user.uid === link.postedBy.id;
  }

  async function openBrowser() {
    await Browser.open({
      url: link.url,
    });
  }

  return (
    <IonPage>
      <NavHeader
        title={link && link.description}
        option={link && postedByAuthUser(link)}
        icon={closeCircleOutline}
        action={handleDeleteLink}
      />
      <IonContent>
        <CommentModal
          isOpen={showModal}
          title="New Comment"
          sendAction={handleAddComment}
          closeAction={handleCloseModal}
        />
        {link && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol class="ion-text-center">
                  <LinkItem link={link} browser={openBrowser} />
                  <IonButton onClick={() => handleAddVote()} size="small">
                    Upvote
                  </IonButton>
                  <IonButton onClick={() => handleOpenModal()} size="small">
                    Comment
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            {link.comments.map((comment, index) => (
              <LinkComment
                key={index}
                comment={comment}
                link={link}
                setLink={setLink}
              />
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Link;