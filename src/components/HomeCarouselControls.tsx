import { useContext, useState, useEffect } from "react";
import {
  ButtonBack,
  ButtonNext,
  CarouselContext,
  DotGroup,
  Dot,
} from "pure-react-carousel";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import cx from "classnames";

const HomeSliderControls = () => {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(
    carouselContext?.state?.currentSlide
  );
  const [totalSlides, setTotalSlides] = useState(
    carouselContext?.state?.totalSlides
  );

  useEffect(() => {
    const onChange = () => {
      setCurrentSlide(carouselContext.state.currentSlide);
      setTotalSlides(carouselContext?.state?.totalSlides);
    };
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  const hasPrevSlide = currentSlide > 0,
    hasNextSlide = currentSlide < totalSlides - 1;
  return (
    <div className="flex justify-between mb-[10px]">
      <DotGroup
        className="flex gap-[10px]"
        renderDots={({ totalSlides }) => {
          return [...Array(totalSlides)].map((_, i) => {
            const active = i === currentSlide;
            return (
              <Dot
                key={i}
                slide={i}
                className={cx(
                  "h-1 rounded-sm transition-all ease-in-out duration-200",
                  {
                    "w-[10px]": !active,
                    "w-5 bg-[var(--ion-color-primary)]": active,
                    "bg-gray-300": !active,
                  }
                )}
              />
            );
          });
        }}
      />
      <div className="w-fit ml-auto flex gap-6">
        <ButtonBack>
          <BsChevronLeft className={cx({ "opacity-30": !hasPrevSlide })} />
        </ButtonBack>
        <ButtonNext>
          <BsChevronRight className={cx({ "opacity-30": !hasNextSlide })} />
        </ButtonNext>
      </div>
    </div>
  );
};

export default HomeSliderControls;
