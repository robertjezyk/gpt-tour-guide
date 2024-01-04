import { TourInfo } from "@/components/TourInfo";
import { getSingleTour /* generateTourImage */ } from "@/utils/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import axios from "axios";

const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const TourPage = async ({ params }) => {
  const tour = await getSingleTour(params.id);

  if (!tour) {
    redirect("/tours");
  }

  const parsedTour = {
    ...tour,
    stops: JSON.parse(tour.stops),
  };

  // Open AI api generated images (expensive & links last only 2 hours)
  // const tourImage = await generateTourImage({
  //   city: tour.city,
  //   country: tour.country,
  // });

  const { data } = await axios(`${url}${parsedTour.city}`);
  const tourImage = data?.results[0]?.urls?.raw;

  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        back to tours
      </Link>

      {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className="rounded-xl shadow-xl mb-16 h-96 w-96 object-cover"
            alt={parsedTour.title}
            priority
          />
        </div>
      ) : null}

      <TourInfo tour={parsedTour} />
    </div>
  );
};

export default TourPage;
