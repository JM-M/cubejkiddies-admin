import { RouteComponentProps } from "react-router";
import Page from "../components/Page";
import HomeCarouselSlideForm from "../components/HomeCarouselSlideForm";

interface Props
  extends RouteComponentProps<{
    homeSlideId: string;
  }> {}

const EditHomeSlide: React.FC<Props> = ({ match }) => {
  const { homeSlideId } = match.params;
  return (
    <Page title="Edit home slide" backButtonHref="/home-slider" backButton>
      <HomeCarouselSlideForm homeSlideId={homeSlideId} />
    </Page>
  );
};

export default EditHomeSlide;
