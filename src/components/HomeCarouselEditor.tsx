import { IonButton, IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import HomeCarouselSlideEditor from "./HomeCarouselSlideEditor";

const HomeCarouselEditor = () => {
  return (
    <>
      <HomeCarouselSlideEditor />
      <div className="flex-1 flex justify-center items-center h-full">
        <IonButton className="block h-10 w-full ml-auto">
          <IonIcon
            slot="start"
            icon={addOutline}
            className="inline-block h-[20px] w-[20px]"
          />
          Add slide
        </IonButton>
      </div>
    </>
  );
};

export default HomeCarouselEditor;
