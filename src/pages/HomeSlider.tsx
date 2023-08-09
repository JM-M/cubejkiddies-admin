import HomeCarousel from "../components/HomeCarousel";
import Page from "../components/Page";

const HomeSlider = () => {
  return (
    <Page title="Home slider" backButtonHref="/home-slider" backButton>
      <HomeCarousel />
    </Page>
  );
};

export default HomeSlider;
