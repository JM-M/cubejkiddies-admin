import Page from "../components/Page";
import HomeCarouselSlideForm from "../components/HomeCarouselSlideForm";

const NewHomeSlide = () => {
  return (
    <Page title="New home slide" backButtonHref="/home-slider" backButton>
      <HomeCarouselSlideForm />
    </Page>
  );
};

export default NewHomeSlide;
