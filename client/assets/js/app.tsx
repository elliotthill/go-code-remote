import React, {Fragment, useState, useEffect, useRef, useContext} from "react";

import { useDebounce } from 'use-debounce';
import Select, { MultiValue, SingleValue } from "react-select";
import {Spinner, ToggleSwitch} from 'flowbite-react';

// Load the filtering options
import LocationOptions from './data/location.js';
import {SortOptions, ExperienceOptions} from "./data/filter-options.js";

import AdminButton, {CreateButton} from "./admin-button.js";
import RemoteLabel from "./ui/remote-label.js";
import LoadingSpinner from "./ui/loading-spinner.js";

//Access user info
import UserContext from './services/user-context.js';
import {User} from './services/auth.js';
import {ValueLabel,ValueLabelId} from "./types/form.js";
import {Job} from "./types/job.js";

export default function App() {


  const {currentUser, setCurrentUser} = useContext<User | null>(UserContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [roleSearch, setRoleSearch] = useState('');
  const [value] = useDebounce(roleSearch, 500);

  const [page, setPage] = useState(1);
  const [pageReady, setPageReady] = useState(false);

  const [showMore, setShowMore] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [remoteFilter, setRemoteFilter] = useState<boolean>(false);

  /*
   * Filter and Sorts
   */
  const [locationOptions, setLocationOptions] = useState<SingleValue<ValueLabelId> | null>(null);

  const [experienceFilter, setExperienceFilter] = useState<MultiValue<ValueLabel> | null>(null);

  const [sortOption, setSortOption] = useState<SingleValue<ValueLabel>>(SortOptions[0]);





  /*
   * Route load
   */
  useEffect(() => {

    setPageReady(true);
  }, []);



  /*
   * Returns a fresh set of results
   *
   * The idea here is to wipe whatever jobs are currently loaded and get the 1st page of the
   * current filtering options. This is done when the route loads, and when filters are changed.
   */
  function getJobs() {

    console.info("Loading the first page");

    setLoadingJobs(true);

    /*
     * Defensive code: make sure we only load the first page once
     */
    if (page == 1 && jobs && jobs.length > 0 && !pageReady) {
      console.warn("Stopped requesting the same page again");
      return;
    }

    setPage(1);

    /*
     * Here we build the GET querystring
     *
     * There probably is a better way of doing this
     *
     * @TODO Remove this duplicated code from getJobsNextPage()
     *   move to its own function
     */

    let qs = buildQueryString(1, locationOptions, roleSearch, remoteFilter, experienceFilter, sortOption);

    fetch(`/api/jobs?v=1${qs}`)
      .then(response => response.json())
      .then(data => {
        setJobs(data);
        setLoadingJobs(false);
      })
      .catch(error => {
        setLoadingJobs(false);
        console.error(error)
      });

  }


  /*
   * Get the next page of the existing filter/search
   */
  function getJobsNextPage() {

    if (page === 1)
      return;

    console.log("Getting the next page");

    let qs = buildQueryString(page, locationOptions, roleSearch, remoteFilter, experienceFilter, sortOption);

    infinite_loading.current = true;

    fetch(`/api/jobs?v=1${qs}`)
      .then(response => response.json())
      .then((data:Job[]) => {
        setJobs(jobs.concat(data)); //Merge the new list of jobs with the old
        infinite_loading.current = false;
      })
      .catch(error => console.error(error));

  }

  /*
   * Build a query string
   */
  function buildQueryString(page:number, locationOptions:ValueLabelId | null, roleSearch:string,
                            remoteFilter:boolean, experienceFilter:MultiValue<ValueLabel> | null, sortOption:SingleValue<ValueLabel>):string {

    let jobs_params = `&p=${page}`;

    if (locationOptions)
      jobs_params += `&location=${locationOptions?.value}`;

    if (roleSearch)
      jobs_params += `&role=${roleSearch}`;

    if (remoteFilter)
      jobs_params += `&remote=${remoteFilter}`;

    if (experienceFilter) {
      experienceFilter.map((exp) => {
        jobs_params += `&${exp.value}=true`;
      })
    }


    if (sortOption)
      jobs_params += `&sort=${sortOption.value}`

    return jobs_params;

  }


  /*
   * Infinite scroll using Intersection Observer API
   */
  let infinite_loading = useRef(false);
  const bottom = useRef(null);


  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {

        setPage((prevPage) => prevPage + 1);  //Avoid enclosure
        console.log("INTERSECTING LOAD ANOTHER PAGE");
      }
    }, {rootMargin: "300px"});

    observer.observe(bottom.current);

  }, []);




  /*
   * Reload the search when filters change
   */
  useEffect(() => {

    getJobs();
  }, [locationOptions, value, remoteFilter, experienceFilter, sortOption]);

  useEffect(() => {
    setLoadingJobs(true);

  }, [locationOptions, roleSearch, remoteFilter, experienceFilter, sortOption]);


  /*
   * Get the next page
   *
   * @todo implement infinite scrolling
   */
  useEffect(() => {
    getJobsNextPage();
  }, [page]);

  function toggleShowMore() {
    setShowMore(!showMore);
  }




  return (
    <div>
      <CreateButton show={currentUser} />
      {/* Filters in a 4x2 grid */}
      <div className="flex flex-col lg:flex-row py-0">

        <div className="basis-3/3 lg:basis-2/3">
          Role / Company / Tech Search
          <div className="w-full">
            <input name="myInput" value={roleSearch} placeholder="'Python' or 'Devops' or 'AWS'..." autoComplete="off"
                   onChange={(e) => {
                     setRoleSearch(e.target.value);
                   }}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none text-xl"/>
          </div>
        </div>

        <div className="basis-1/3">
          &nbsp;
          <div className="pl-20 pt-2 float-right lg:float-none">
            <ToggleSwitch
              label="Remote only"
              checked={remoteFilter}
              onChange={setRemoteFilter}
            />
          </div>
        </div>

        <div className="basis-1/3 pb-6 lg:pb-0">
          Location
          <div className="w-4/4">
            <Select
              name="location"
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

      <div className="hidden lg:block">
        <div className={` ${showMore ? 'hidden' : 'show'}`}>
          <button className="pt-4 w-full text-slate-500 focus:outline-none focus:text-slate-700 text-right"
                  onClick={toggleShowMore}>Show more filters</button>
        </div>
      </div>


      <div className={`flex flex-row pt-8 pb-2 ${showMore ? 'show' : 'hidden'}`}>
        <div className="basis-3/5">
        </div>
        <div className="basis-1/5">
          Experience
          <div className="w-4/4 pr-8">
            <Select
              isMulti
              name="colors"
              options={ExperienceOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={setExperienceFilter}
              value={experienceFilter}
            />
          </div>
        </div>
        <div className="basis-1/5  pl-8">
          Sort
          <div className="w-4/4">
            <Select
              name="colors"
              options={SortOptions}
              className="basic-single-select"
              classNamePrefix="select"
              onChange={setSortOption}
              value={sortOption}
            />
          </div>
        </div>
      </div>
      <div className={`py-2 ${showMore ? 'show' : 'hidden'}`}>
        <button className="w-full text-slate-500 focus:outline-none focus:text-slate-700 text-right"
                onClick={toggleShowMore}>Show less</button>
      </div>


      <LoadingSpinner loading={loadingJobs} />
      <div className="flex flex-row py-4 overflow-x-scroll pt-4 md:pt-6 lg:pt-12">

        <table className="table-fixed w-full lg:min-w-full bg-white shadow-md rounded-xl py-6">
          <thead>
            <tr>
              <th className="md:w-5/12 rounded-lg px-3 lg:px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Role
              </th>
              <th className="hidden lg:table-cell rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Company
              </th>
              <th className="hidden lg:table-cell rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Location
              </th>
              <th className="hidden lg:table-cell rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">
                Base
              </th>
              <th className="hidden lg:table-cell rounded-lg px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-400 uppercase border-b border-gray-200 bg-gray-50">

              </th>
            </tr>
          </thead>
          <tbody className="text-blue-gray-900">
            <Fragment>
              {jobs.map(job => {
                return (
                  <tr className="border-b border-blue-gray-200 hover:bg-gray-50 cursor-pointer" key={job.id}>
                    <td className="py-3 px-3 lg:px-6 w-auto lg:w-5/12 h-auto lg:h-[100px]" onClick={()=> window.open(job.source_url+"?utm_source=gocoderemote.com", "_blank")}>
                      <div className="absolute mt-[-15px] text-xs text-gray-400 capitalize hidden lg:block">
                        {job.experience}
                      </div>
                      <div className="text-lg">
                        {job.role}
                        <span className="inline-block lg:hidden float-right">
                          <RemoteLabel remote={job.remote} country={job.country}/>
                        </span>

                        <div className="hidden lg:inline-block text-stone-400 capitalize pl-4 inline-block">
                          {job.type !== 'permanent' && job.type}
                        </div>

                        <div className="hidden lg:inline-block pl-4 inline-block underline text-xs text-blue-600 hover:text-blue-800 visited:text-purple-600" onClick={()=> window.open(job.careers_page+"?utm_source=gocoderemote.com", "_blank")}>
                          {!!job.more_jobs && `+ ${job.more_jobs} similar jobs`}
                        </div>
                      </div>

                      <div className="block lg:hidden py-2 mb-2 w-12/12 text-gray-400">
                        <span className="text-md font-bold">@ </span>

                        <span className="text-sm">
                          {job.company} {job.location}, {job.state ? job.state: job.country}
                        </span>

                      </div>

                      {job.meta.map(meta=>{
                        return (
                          <span key={meta.label} className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {meta.label}
                          </span>
                        );
                      })}

                      <div className="block absolute right-[20px] lg:right-auto mt-[-60px] lg:mt-[4px] text-xs text-gray-400">
                        {!!job.days_old && `${job.days_old}d`}
                        {job.days_old === 0 && `Today`}
                      </div>

                    </td>
                    <td className="hidden lg:table-cell py-3 px-6" onClick={()=> window.open(job.source_url+"?utm_source=gocoderemote.com", "_blank")}>
                      <div className="text-lg">
                        {job.company}
                      </div>
                      <a href="https://www.glassdoor.com/?utm_source=gocoderemote.com" rel="noindex nofollow" target="_blank">
                        <div className="text-xs text-gray-400">Glassdoor <span className="font-semibold ml-8">{job.glassdoor}</span></div>
                      </a>
                      <a href="https://www.indeed.com/?utm_source=gocoderemote.com" rel="noindex nofollow" target="_blank">
                        <div className="text-xs text-gray-400">Indeed <span className="font-semibold ml-12">{job.indeed}</span></div>
                      </a>

                      {job.company_meta.map(meta=>{
                        return (
                          <span key={meta} className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {meta}
                          </span>
                        );
                      })}
                    </td>
                    <td className="hidden lg:table-cell py-3 px-6" onClick={()=> window.open(job.source_url+"?utm_source=gocoderemote.com", "_blank")}>
                        <div>
                          {job.location}, {job.state ? job.state: job.country}
                        </div>
                        <div className="text-xs">
                          {job.other_locations > 0 && `+${job.other_locations} other locations`}
                        </div>

                        <RemoteLabel remote={job.remote} country={job.country}/>
                    </td>
                    <td className="hidden lg:table-cell py-3 px-6" onClick={()=> window.open(job.source_url+"?utm_source=gocoderemote.com", "_blank")}>
                      {!!job.rate && job.currency}
                      {!!job.rate && job.rate.toLocaleString()}

                    </td>
                    <td className="hidden lg:table-cell py-3 px-6">

                      <AdminButton show={currentUser} job_id={job.id}/>

                      <a type="submit" className="px-3 py-2 text-lg font-medium text-center text-white bg-gray-400 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300"
                              href={job.source_url+"?utm_source=gocoderemote.com"} target="_blank" rel="noindex nofollow">Apply</a>
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          </tbody>
        </table>


      </div>
      <div ref={bottom} className="text-center block w-full h-[100px]">
      </div>

    </div>
  )
}



