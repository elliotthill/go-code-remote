import React, {Fragment, useState, useEffect, useRef, useContext} from "react";

import Select, { MultiValue, SingleValue } from "react-select";


// Load the filtering options
import RemoteOptions from './data/remote.js';
import InfraOptions from './data/infra.js';
import LangOptions from './data/lang.js';
import FrameworkOptions from './data/framework.js';
import OtherOptions from './data/other.js';
import LocationOptions from './data/location.js';

import AdminButton, {CreateButton} from "./admin-button.js";
import RemoteLabel from "./ui/remote-label.js";

//Access user info
import UserContext from './services/user-context.js';

export default function App() {

  const {currentUser, setCurrentUser} = useContext(UserContext);
  const [jobs, setJobs] = useState([]);

  const [roleSearch, setRoleSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageReady, setPageReady] = useState(false);

  const [showAdmin, setShowAdmin] = useState(false);

  const MetaOptions = [...RemoteOptions, ...InfraOptions, ...LangOptions, ...FrameworkOptions, ...OtherOptions];
  /*
   * Filter Setters
   */
  const [langOptions, setLangOptions] = useState<MultiValue<{
    value: string;
    label: string;
  }> | null>(null);

  const [infraOptions, setInfraOptions] = useState<MultiValue<{
    value: string;
    label: string;
  }> | null>(null);

  const [frameworkOptions, setFrameworkOptions] = useState<MultiValue<{
    value: string;
    label: string;
  }> | null>(null);

  const [metaOptions, setMetaOptions] = useState<MultiValue<{
    value: string;
    label: string;
  }> | null>(null);

  const [locationOptions, setLocationOptions] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(null);


  /*
   * Get an initial data set from the server
   */
  useEffect(() => {


    setPageReady(true);
    //setRemoteOptions(RemoteDefault);
  }, []);



  //For a new search/filter
  function getJobs() {

    console.info("Loading the first page");

    //Only load the first page once when page is first loaded
    if (page == 1 && jobs && jobs.length > 0 && !pageReady) {
      console.warn("Stopped requesting the same page again");
      return;
    }

    setPage(1);

    /*
     * Here we build the GET querystring
     *
     * There probably is a better way of doing this
     */
    let jobs_params = '&p=1';
    if (locationOptions)
      jobs_params += `&location=${locationOptions?.value}`;

    if (roleSearch)
      jobs_params += `&role=${roleSearch}`;

    fetch(`/api/jobs?v=1${jobs_params}`)
      .then(response => response.json())
      .then(data => {
        setJobs(data);

      })
      .catch(error => console.error(error));

  }

  //Get the next page of the existing filter/search
  function getJobsNextPage() {

    if (page === 1)
      return;

    if (infinite_loading.current)
      return;

    let jobs_params = `&p=${page}`;

    if (locationOptions)
      jobs_params += `&location=${locationOptions?.value}`;

    if (roleSearch)
      jobs_params += `&role=${roleSearch}`;

    infinite_loading.current = true;

    fetch(`/api/jobs?v=1${jobs_params}`)
      .then(response => response.json())
      .then(data => {
        setJobs(jobs.concat(data)); //Merge the new list of jobs with the old
        infinite_loading.current = false;
      })
      .catch(error => console.error(error));

  }


  /*
   * Simple infinite scroll
   *
   * Its pretty buggy at the moment.
   */
  let infinite_loading = useRef(false);

  function handleScroll(e) {

    if (infinite_loading.current)
      return;

    let overscan = 400;

    if (window.innerHeight + window.scrollY + overscan >= document.body.offsetHeight) {
      setPage(page+1);
    }

  }
  window.addEventListener("scroll", handleScroll);

  /*
   * Reload the search when filters change
   */
  useEffect(() => {
    getJobs();
  }, [locationOptions, roleSearch]);

  /*
   * Get the next page
   *
   * @todo implement infinite scrolling
   */
  useEffect(() => {
    getJobsNextPage();
  }, [page]);


  return (
    <div>
      <CreateButton show={currentUser} />
      {/* Filters in a 4x2 grid */}
      <div className="flex flex-row py-0">

        <div className="basis-2/3">
          Role / Company / Tech Search
          <div className="w-full pr-32">
            <input name="myInput" value={roleSearch}
                   onChange={(event) => {setRoleSearch(event.target.value)}}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none text-xl"/>
          </div>
        </div>

        <div className="basis-1/3 pl-32">
          Location
          <div className="w-4/4">
            <Select
              name="colors"
              options={LocationOptions}
              className="basic-multi-select text-xl"
              classNamePrefix="select"
              onChange={setLocationOptions}
              value={locationOptions}
              placeholder="Start typing...."
            />
          </div>
        </div>
      </div>



      <div className="flex flex-row py-12">
        <table className="table-fixed min-w-full bg-white shadow-md rounded-xl py-6">
          <thead>
            <tr>
              <th className="w-5/12 rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Role
              </th>


              <th className="rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Company
              </th>


              <th className="rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Location
              </th>
              <th className="rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Base
              </th>
              <th className="rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">

              </th>
            </tr>
          </thead>
          <tbody className="text-blue-gray-900">
            <Fragment>
              {jobs.map(job => {
                return (
                  <tr className="border-b border-blue-gray-200 hover:bg-gray-50 cursor-pointer" key={job.id}>
                    <td className="py-3 px-4 w-5/12 h-[100px]" onClick={()=> window.open(job.source_url+"?utm_source=jobstack.com", "_blank")}>
                      <div className="text-lg">
                        {job.role}
                        <div className="text-stone-400 capitalize pl-4 inline-block">
                          {job.type !== 'permanent' && job.type}
                        </div>
                        <div className="pl-4 inline-block underline text-xs text-blue-600 hover:text-blue-800 visited:text-purple-600" onClick={()=> window.open(job.careers_page+"?utm_source=jobstack.com", "_blank")}>
                          {!!job.more_jobs && `+ ${job.more_jobs} similar jobs`}
                        </div>
                      </div>

                      {job.meta.map(meta=>{
                        return (
                          <span key={meta.label} className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {meta.label}
                          </span>
                        );
                      })}
                      <div className="block absolute mt-[4px] text-xs text-gray-400">
                        {!!job.days_old && `${job.days_old}d`}
                        {job.days_old === 0 && `Today`}
                      </div>
                    </td>
                    <td className="py-3 px-4" onClick={()=> window.open(job.source_url+"?utm_source=jobstack.com", "_blank")}>
                      <div className="text-lg">
                        {job.company}
                      </div>
                      <a href="https://www.glassdoor.com/?utm_source=jobstack.com" rel="noindex nofollow" target="_blank">
                        <div className="text-xs text-gray-400">Glassdoor <span className="font-semibold ml-12">{job.glassdoor}</span></div>
                      </a>
                      <a href="https://www.indeed.com/?utm_source=jobstack.com" rel="noindex nofollow" target="_blank">
                        <div className="text-xs text-gray-400">Indeed <span className="font-semibold ml-16">{job.indeed}</span></div>
                      </a>

                      {job.company_meta.map(meta=>{
                        return (
                          <span key={meta} className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {meta}
                          </span>
                        );
                      })}
                    </td>
                    <td className="py-3 px-4" onClick={()=> window.open(job.source_url+"?utm_source=jobstack.com", "_blank")}>
                        <div>
                          {job.location}, {job.state ? job.state: job.country}
                        </div>
                        <div className="text-xs">
                          {job.other_locations > 0 && `+${job.other_locations} other locations`}
                        </div>

                        <RemoteLabel remote={job.remote} country={job.country}/>
                    </td>
                    <td className="py-3 px-4" onClick={()=> window.open(job.source_url+"?utm_source=jobstack.com", "_blank")}>
                      {!!job.rate && job.currency}
                      {!!job.rate && job.rate.toLocaleString()}

                    </td>
                    <td className="py-3 px-4">

                      <AdminButton show={currentUser} job_id={job.id}/>

                      <a type="submit" className="px-3 py-2 text-lg font-medium text-center text-white bg-gray-400 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300"
                              href={job.source_url+"?utm_source=jobstack.com"} target="_blank" rel="noindex nofollow">Apply</a>
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          </tbody>
        </table>

      </div>

    </div>
  )
}



