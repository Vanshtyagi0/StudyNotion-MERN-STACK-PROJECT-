import React, { useEffect, useState } from "react"
import StarRating from "./StarRating"
import { Swiper, SwiperSlide } from "swiper/react"

// Swiper Styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

// Icons
import { Autoplay, Pagination } from "swiper/modules"

// API
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/api"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        console.log("REVIEWS_DETAILS_API API RESPONSE............", response)

        if (response.data?.success) {
          setReviews(response.data?.data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      }
    })()
  }, [])

  return (
    <div className="text-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Swiper
          modules={[ Pagination, Autoplay]}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          breakpoints={{
            0: { slidesPerView: 1 }, // 📱 Mobile: 1 per view
            640: { slidesPerView: 1.2 }, // 📱 Large phones
            768: { slidesPerView: 1.5 }, // 📲 Tablets
            1024: { slidesPerView: 2 }, // 💻 Desktop
            1440: { slidesPerView: 3 }, // 🖥️ Large screens
          }}
          className="pb-12"
        >
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-3 bg-richblack-800 text-[14px] text-richblack-25 rounded-2xl shadow-md p-6 h-full">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review.user.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt={`${review?.user?.firstName} profile`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5 text-[15px]">
                        {`${review?.user?.firstName} ${review?.user?.lastName}`}
                      </h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="font-medium text-richblack-25 leading-relaxed">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : review.review}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-auto">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <StarRating
                      count={5}
                      value={review.rating}
                      size={18}
                      edit={false}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center text-richblack-300">
              No reviews available.
            </p>
          )}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
