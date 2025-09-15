// export const formatDate = (dateString, locale = "en-US") => {
//   const options = { year: "numeric", month: "long", day: "numeric" };
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) {
//     throw new Error("Invalid date string");
//   }

//   const formattedDate = date.toLocaleDateString(locale, options);
//   const hour = date.getHours();
//   const minutes = date.getMinutes();
//   const period = hour >= 12 ? "PM" : "AM";
//   const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//   const formattedTime = `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
//   return `${formattedDate} | ${formattedTime}`;
// };

export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("en-US", options)
  
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const period = hour >= 12 ? "PM" : "AM"
    const formattedTime = `${hour % 12}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`
  
    return `${formattedDate} | ${formattedTime}`
  }