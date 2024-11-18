import Navbar from "./components/Navbar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import JobCard from "./components/JobCard";
import { useEffect, useState } from "react";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "./firebase.config";
import jobData from "./JobDummyData";

function App() {
  const [jobs, setJobs] = useState(jobData); // Start with static data
  const [customSearch, setCustomSearch] = useState(false);

  // Fetch jobs from Firestore
  const fetchJobs = async () => {
    console.log("Fetching Jobs...");
    setCustomSearch(false); // Ensure this resets before fetching

    const tempJobs = [];
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, orderBy("postedOn", "desc"));
    const req = await getDocs(q);

    req.forEach((job) => {
      const jobData = job.data();
      console.log("Job Data:", jobData); // Debug: Check if data is fetched correctly

      // Convert Firestore Timestamp to JavaScript Date
      const postedOnDate = jobData.postedOn?.toDate(); // Convert Firestore Timestamp to Date object
      console.log("Posted On:", postedOnDate); // Log the converted Date object

      // Format the Date for display (e.g., "November 17, 2024")
      const formattedDate = postedOnDate
        ? postedOnDate.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A"; // Default to "N/A" if no valid date

      tempJobs.push({
        ...jobData,
        id: job.id,
        postedOn: formattedDate, // Store the formatted date
      });
    });

    console.log("Fetched Jobs:", tempJobs); // Debug: Log the array of jobs fetched
    setJobs(tempJobs); // Set the jobs in state
  };

  const fetchJobsCustom = async (jobCriteria) => {
    console.log("Fetching Custom Jobs...");
    setCustomSearch(true);

    const tempJobs = [];
    const jobsRef = collection(db, "jobs");
    const q = query(
      jobsRef,
      where("type", "==", jobCriteria.type),
      where("title", "==", jobCriteria.title),
      where("experience", "==", jobCriteria.experience),
      where("location", "==", jobCriteria.location),
      orderBy("postedOn", "desc")
    );
    const req = await getDocs(q);

    req.forEach((job) => {
      const jobData = job.data();
      const postedOnDate = jobData.postedOn?.toDate(); // Convert Firestore Timestamp to Date object
      // Format the Date for display
      const formattedDate = postedOnDate
        ? postedOnDate.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A"; // Default to "N/A" if no valid date

      tempJobs.push({
        ...jobData,
        id: job.id,
        postedOn: formattedDate, // Store the formatted date
      });
    });

    console.log("Custom Search Jobs:", tempJobs);
    setJobs(tempJobs); // Update state with custom search data
  };

  useEffect(() => {
    console.log("Jobs state updated:", jobs);
  }, [jobs]); // Log whenever jobs state changes

  useEffect(() => {
    fetchJobs(); // Fetch jobs when the component mounts
  }, []); // Run only once on component mount

  return (
    <div>
      <Navbar />
      <Header />
      <SearchBar fetchJobsCustom={fetchJobsCustom} />
      {customSearch && (
        <button onClick={fetchJobs} className="flex justify-end mb-2">
          <p className="bg-blue-500 px-10 py-2 rounded-md text-white">
            Clear Filters
          </p>
        </button>
      )}
      <div className="job-list">
        {jobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
