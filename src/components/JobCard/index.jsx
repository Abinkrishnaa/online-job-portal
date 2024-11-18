import dayjs from "dayjs";

function JobCard(props) {
  console.log("JobCard Props:", props); // Debug: Log the props to check if data is passed correctly

  const {
    title = "N/A",
    company = "N/A",
    type = "N/A",
    experience = "N/A",
    location = "N/A",
    skills = [],
    postedOn,
    job_link = "#",
  } = props;

  const postedOnDate = dayjs(postedOn);
  const diffInDays = postedOnDate.isValid() ? dayjs().diff(postedOnDate, "day") : "N/A";

  return (
    <div className="w-3/4 mx-auto mb-4">
      <div className="flex justify-between items-center px-6 py-4 bg-white rounded-md border border-gray-300 shadow-md hover:shadow-lg hover:border-blue-500 hover:translate-y-1 transition-transform">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-bold text-gray-800">
            {title} - {company}
          </h1>
          <p className="text-gray-600">
            {type} &#x2022; {experience} &#x2022; {location}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="text-sm text-gray-700 py-1 px-3 bg-gray-100 rounded-full border border-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-gray-500">
            Posted{" "}
            {typeof diffInDays === "number"
              ? diffInDays > 1
                ? `${diffInDays} days`
                : `${diffInDays} day`
              : "Date not available"}{" "}
            ago
          </p>
          <a href={job_link} target="_blank" rel="noopener noreferrer">
            <button className="text-white bg-blue-500 border border-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">
              Apply
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
