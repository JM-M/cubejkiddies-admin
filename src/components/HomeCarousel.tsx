import { IonImg, IonButton, IonIcon } from "@ionic/react";
import { addOutline, home, pencilOutline, trashOutline } from "ionicons/icons";
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import HomeCarouselControls from "./HomeCarouselControls";
import Button from "./Button";
import useHomeSlides, { HomeSlide } from "../hooks/useHomeSlides";
import PageLoader from "./PageLoader";

const HomeCarousel = () => {
  const {
    homeSlides = [],
    homeSlidesQuery,
    deleteHomeSlide,
    homeSlideDeletionMutation,
  } = useHomeSlides();

  if (homeSlidesQuery.isLoading) return <PageLoader />;

  const carousel = (
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={115}
      totalSlides={homeSlides.length}
    >
      <Slider className="overflow-hidden">
        {homeSlides.map((homeSlide: HomeSlide, i: number) => {
          const { image, button, buttonText, buttonHref, id } = homeSlide;
          return (
            <Slide key={i} index={i} className="">
              <div className="relative aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                <IonImg
                  src={image}
                  alt={`Slide ${i + 1}`}
                  className="bg-gray-200"
                />
                <div className="absolute bottom-5 right-5 flex justify-end gap-2 flex-wrap">
                  {button && (
                    <a
                      href={`https://cubejkiddies.vercel.app/store/${buttonHref}`}
                      className="inline-block"
                      target="_blank"
                    >
                      <IonButton>{buttonText}</IonButton>
                    </a>
                  )}
                  <Button
                    fill="outline"
                    className="bg-white rounded-lg"
                    onClick={() => deleteHomeSlide([id!])}
                    loading={homeSlideDeletionMutation.isLoading}
                  >
                    {!homeSlideDeletionMutation.isLoading && (
                      <IonIcon
                        icon={trashOutline}
                        className="inline-block h-[18px] w-[18px]"
                        color="danger"
                      />
                    )}
                  </Button>
                  <Button
                    routerLink={`/home-slider/${id}`}
                    fill="outline"
                    className="bg-white rounded-lg"
                  >
                    <IonIcon
                      icon={pencilOutline}
                      className="inline-block h-[18px] w-[18px]"
                    />
                  </Button>
                </div>
              </div>
            </Slide>
          );
        })}
      </Slider>
      <HomeCarouselControls />
    </CarouselProvider>
  );

  return (
    <div className="flex-1 flex flex-col h-full pt-4">
      {!!homeSlides?.length ? (
        carousel
      ) : (
        <div className="relative flex justify-center items-center aspect-[4/3] bg-gray-100 border border-gray-400 rounded-xl overflow-hidden">
          No slides added
        </div>
      )}
      <Button
        routerLink="/home-slider/new"
        className="block h-12 mt-auto mb-10"
      >
        <IonIcon icon={addOutline} className="h-[24px] w-[24px]" /> New slide
      </Button>
    </div>
  );
};

export default HomeCarousel;
