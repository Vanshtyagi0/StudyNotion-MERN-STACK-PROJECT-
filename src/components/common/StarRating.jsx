import { useState } from "react"
import { FaStar } from "react-icons/fa" // npm install react-icons

const StarRating = ({
  count = 5,
  value = 0,
  onChange = () => {},
  size = 24,
  edit = true,
}) => {
  const [hover, setHover] = useState(null)

  return (
    <div className="flex items-center gap-1">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1
        const isActive = ratingValue <= (hover ?? value)

        return (
          <label
            key={ratingValue}
            className={edit ? "cursor-pointer" : "cursor-default"}
          >
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onChange={() => edit && onChange(ratingValue)}
              className="sr-only"
              aria-label={`Rate ${ratingValue} star${
                ratingValue > 1 ? "s" : ""
              }`}
              disabled={!edit}
            />
            <FaStar
              size={size}
              color={isActive ? "#FFD700" : "#E4E5E9"}
              onMouseEnter={() => edit && setHover(ratingValue)}
              onMouseLeave={() => edit && setHover(null)}
              className={`transition-colors duration-200 ${
                edit ? "hover:scale-110" : ""
              }`}
            />
          </label>
        )
      })}
    </div>
  )
}

export default StarRating
