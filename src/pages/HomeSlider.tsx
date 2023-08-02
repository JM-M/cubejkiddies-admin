import HomeCarousel from "../components/HomeCarousel";
import HomeCarouselEditor from "../components/HomeCarouselEditor";
import Page from "../components/Page";

const HomeSlider = () => {
  return (
    <Page title="Home slider" backButtonHref="/home-slider" backButton>
      <HomeCarousel />
      <HomeCarouselEditor />
    </Page>
  );
};

export default HomeSlider;
