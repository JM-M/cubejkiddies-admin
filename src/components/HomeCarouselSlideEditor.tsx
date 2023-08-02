import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";

const HomeCarouselSlideEditor = () => {
  return (
    <IonModal isOpen={true}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton>
              <IonIcon icon={closeOutline} className="h-[24px] w-[24px]" />
            </IonButton>
          </IonButtons>
          <IonTitle>Slide</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent class="ion-padding">
        <div className="mb-5">
          <h3 className="mb-3 font-medium">Image</h3>
          <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl"></div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default HomeCarouselSlideEditor;
