import React from "react";
import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import UserContext from "../../contexts/userContext";
import CommentModal from "./CommentModal";
import firebase from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const LinkComment = ({ comment, link, setLink }) => {
  const { user } = React.useContext(UserContext);
  const [showModal, setShowModal] = React.useState(false);

  const postedByAuthUser = user && user.uid === comment.postedBy.id;

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleEditComment(commentText) {
    const linkRef = doc(firebase.db, "links", link.id);
    getDoc(linkRef).then((docSnap) => {
      if (docSnap.exists()) {
        const previousComments = docSnap.data().comments;
        const newComment = {
          postedBy: { id: user.uid, name: user.displayName },
          created: Date.now(),
          text: commentText,
        };
        const updatedComments = previousComments.map((item) =>
          item.created === comment.created ? newComment : item
        );
        updateDoc(linkRef, { comments: updatedComments });
        setLink((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));
      }
    });
    setShowModal(false);
  }

  function handleDeleteComment() {
    const linkRef = doc(firebase.db, "links", link.id);
    getDoc(linkRef).then((docSnap) => {
      if (docSnap.exists()) {
        const previousComments = docSnap.data().comments;
        const updatedComments = previousComments.filter(
          (item) => item.created !== comment.created
        );
        updateDoc(linkRef, { comments: updatedComments });
        setLink((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));
      }
    });
  }

  return (
    <>
      <CommentModal
        isOpen={showModal}
        title="Edit Comment"
        sendAction={handleEditComment}
        closeAction={handleCloseModal}
        comment={comment}
      />
      <IonCard>
        <IonCardContent>
          <IonList lines="none">
            <IonItem>
              <IonLabel class="ion-text-wrap ">
                <p
                  style={{
                    alignItems: "center",
                    fontSize: "0.8rem",
                    fontWeight: "normal",
                  }}
                >
                  {comment.postedBy.name} {" | "}
                  {formatDistanceToNow(comment.created)}
                </p>
                <div className="ion-padding-vertical">{comment.text}</div>
                {postedByAuthUser && (
                  <IonButton size="small" onClick={() => setShowModal(true)}>
                    Edit
                  </IonButton>
                )}
                {postedByAuthUser && (
                  <IonButton
                    size="small"
                    onClick={() => handleDeleteComment(comment)}
                  >
                    Delete
                  </IonButton>
                )}
              </IonLabel>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default LinkComment;
