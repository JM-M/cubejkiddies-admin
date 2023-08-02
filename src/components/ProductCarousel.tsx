import { IonImg } from "@ionic/react";
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import ProductCarouselControls from "./ProductCarouselControls";

const ProductCarousel: React.FC<{ images: string[]; hasVariant: boolean }> = ({
  images = [],
  hasVariant = false,
}) => {
  if (!images.length)
    return (
      <div className="w-full aspect-[3.2/4.0] flex justify-center items-center mb-5 bg-gray-100 text-gray-500 rounded-xl">
        No images available for this {hasVariant ? "variant" : "product"}
      </div>
    );

  return (
    <div>
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={120}
        totalSlides={images.length}
        className="-mr-5"
      >
        <Slider>
          {images.map((image, i) => {
            return (
              <Slide key={i} index={i}>
                <div className="pr-5">
                  <div className="relative w-full aspect-[3.2/4.0] bg-gray-200 rounded-xl overflow-hidden">
                    <IonImg
                      src={image}
                      alt={`Slide ${i + 1}`}
                      className="h-full w-full bg-gray-200 object-cover"
                    />
                  </div>
                </div>
              </Slide>
            );
          })}
        </Slider>

        <ProductCarouselControls images={images} />
      </CarouselProvider>
    </div>
  );
};

export default ProductCarousel;
