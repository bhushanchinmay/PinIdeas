import React, { useContext, memo } from "react"; // Imported memo
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonBadge,
  IonCard,
  IonCardContent,
  IonList,
  IonButton,
} from "@ionic/react";
import {
  chevronUpCircleOutline,
  chatbubbleEllipsesOutline,
  linkOutline,
  personCircleOutline,
  timeOutline,
  trashOutline,
} from "ionicons/icons";
import { getHostName } from "../../helpers/domain.js";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import UserContext from "../../contexts/userContext";
import firebase from "../../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const LinkItem = ({ link, index, showCount, url, browser }) => {
  const { user } = useContext(UserContext);

  async function handleDeletePost(e) {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const linkId = link.id;
        const linkRef = doc(firebase.db, "links", linkId);
        await deleteDoc(linkRef);
        console.log("Post deleted successfully:", linkId);
        // Optionally, you might want to call a function passed via props
        // to update the UI by removing the item from the list,
        // e.g., onDeleteSuccess(linkId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  }

  return (
    <IonCard routerLink={url} onClick={browser} button>
      <IonCardContent class="ion-no-padding">
        <IonList lines="none">
          <IonItem>
            <IonBadge
              style={{
                verticalAlign: "middle",
              }}
              slot="start"
            >
              {showCount && index}
            </IonBadge>
            <IonLabel>
              <p
                style={{
                  alignItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: "normal",
                }}
              >
                <IonIcon
                  icon={linkOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {getHostName(link.url)}
                </IonText>
              </p>

              <div className="ion-padding-vertical ion-text-wrap">
                <strong style={{ fontSize: "1rem" }}>{link.description}</strong>
              </div>

              <p
                style={{
                  alignItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: "normal",
                }}
              >
                <IonIcon
                  icon={chevronUpCircleOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {link.voteCount} points
                </IonText>
                {" | "}
                <IonIcon
                  icon={personCircleOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {link.postedBy.name}
                </IonText>
                {" | "}
                <IonIcon
                  icon={timeOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {formatDistanceToNow(link.created)}
                </IonText>
                {link.comments.length > 0 && (
                  <>
                    {" | "}
                    <IonIcon
                      icon={chatbubbleEllipsesOutline}
                      style={{
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    <IonText
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {link.comments.length} comments
                    </IonText>
                  </>
                )}
                {user && user.uid === link.postedBy.id && (
                  <>
                    {" | "}
                    <IonButton
                      size="small"
                      color="danger"
                      onClick={handleDeletePost}
                    >
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonButton>
                  </>
                )}{" "}
              </p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default memo(LinkItem); // Wrapped component with memo
