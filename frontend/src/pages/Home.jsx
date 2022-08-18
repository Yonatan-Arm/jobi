import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobList from "../components/JobList";
import { jobService } from "../services/jobService";
import fileAddLogo from '../assets/imgs/file-add.svg'
import JobModal from "../components/JobModal";
import { useSelector,useDispatch } from "react-redux";
import { removeJob, setJobs } from "../store/actions/jobActions";

export default function Home() {
  const [jobsToDisplay, setjobsToDisplay] = useState([]);
  const [jobToDisplay, setjobToDisplay] = useState(null);
  const [isJobSelceted, setisJobSelceted] = useState(null);
  const { user } = useSelector(({ userModule }) => userModule);
  const { jobs } = useSelector(({ jobModule }) => jobModule);
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    if(!user) return navigate('login')
    if(jobs.length < 1 && user.jobs.length > 0 ){
     jobs = dispatch(setJobs(user.jobs))
    } 
      setjobsToDisplay(jobs);
    return () => {
      setjobsToDisplay([]);
    };
  }, []);

  
  const onRemoveJob = async (id,ev) => {
    ev.stopPropagation()
    const jobs = await dispatch(removeJob(JSON.parse(JSON.stringify((id))),JSON.parse(JSON.stringify(user))))
    setjobsToDisplay(jobs);
    if(isJobSelceted) setisJobSelceted(false)
  };

  const onSelectJob = async (id) => {
    const job = await jobService.getJobById(jobs,id);
    setjobToDisplay(job)
    setisJobSelceted(true)
  };

  const UnSelcetJob =  () => {
    setisJobSelceted(false)
  };
 

  return (
    <div className="home">
      <h2> Jobi -search your new job</h2>
      <Link className="add-btn"  to="edit"><img src={fileAddLogo} alt='add-logo' /> </Link>
      {jobsToDisplay.length > 0
       ? <JobList jobs={jobsToDisplay} onRemoveJob={onRemoveJob} onSelectJob={onSelectJob} />
       : <div className="mesaage"> There are no jobs yet..</div>
       }
      {isJobSelceted && (
        <JobModal job={jobToDisplay} UnSelcetJob={UnSelcetJob} onRemoveJob={onRemoveJob} />
   
      )}
    </div>
  );
}
