import { IonImg, IonButton, IonIcon } from "@ionic/react";
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import HomeCarouselControls from "./HomeCarouselControls";
import { pencilOutline } from "ionicons/icons";

const HomeCarousel = () => {
  const images = [
    "http://via.placeholder.com/400x300",
    "http://via.placeholder.com/400x300",
    "http://via.placeholder.com/400x300",
    "http://via.placeholder.com/400x300",
  ];
  return (
    <div>
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={115}
        totalSlides={images.length}
      >
        <Slider>
          {images.map((image, i) => {
            return (
              <Slide key={i} index={i}>
                <div className="relative aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                  <IonImg
                    src={image}
                    alt={`Slide ${i + 1}`}
                    className="bg-gray-200"
                  />
                  <div className="absolute bottom-5 right-5 flex gap-2">
                    <IonButton>Kids stuff</IonButton>
                    <IonButton fill="outline" className="bg-white rounded-lg">
                      <IonIcon
                        icon={pencilOutline}
                        className="inline-block h-[18px] w-[18px]"
                      />
                    </IonButton>
                  </div>
                </div>
              </Slide>
            );
          })}
        </Slider>
        <HomeCarouselControls />
      </CarouselProvider>
    </div>
  );
};

export default HomeCarousel;
