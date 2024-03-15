import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Link} from "react-router-dom";

// Load the filtering options
import RemoteOptions, {RemoteLookup} from './data/remote.js';
import InfraOptions from './data/infra.js';
import LangOptions from './data/lang.js';
import FrameworkOptions from './data/framework.js';
import TypeOptions from  './data/type.js';
import OtherOptions from './data/other.js';
import {ExperienceOptions, ExperienceLookup} from "./data/filter-options.js";

import AlertError from "./ui/alert-error.js";
import AlertNotice from "./ui/alert-notice.js";

import Select, {MultiValue, SingleValue} from "react-select";

export default function Admin() {

  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');

  const [sourceURL, setSourceURL] = useState('');
  const [rate, setRate] = useState('');

  const [otherLocations, setOtherLocations] = useState([]);
  const [moreJobs, setMoreJobs] = useState('');

  const MetaOptions = [...InfraOptions, ...LangOptions, ...FrameworkOptions, ...OtherOptions];
  /*
   * Filter Setters
   */
  const [metaOptions, setMetaOptions] = useState<MultiValue<{
    value: string;
    label: string;
  }> | null>(null);

  const [typeOption, setTypeOption] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(TypeOptions[0]);

  const [remoteOption, setRemoteOption] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(RemoteOptions[3]);

  const [experienceOption, setExperienceOption] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(ExperienceOptions[1]);

  /*
   * Get the ID
   */
  let { id } = useParams();

  /*
   * Mush all data arrays together into a big dropdown
   */
  useEffect(() => {

    if (!id)
      return;

    //Load the existing job info
    fetch('/api/cms/job/'+id)
      .then(response => response.json())
      .then(data => {

        let job = data.job;
        console.log(job);

        //Do stuff with the info
        setRole(job.role);
        setLocation(job.location);
        setCompany(job.company);
        setTitle(job.title);
        setRemoteOption(RemoteOptions[RemoteLookup[job.remote]]); //Translation for turning 'remote' into {value:'remo..

        if (job.type === 'permanent')
          setTypeOption(TypeOptions[0]);
        else
          setTypeOption(TypeOptions[1]);

        setSourceURL(job.source_url);
        setRate(job.rate);
        setMoreJobs(job.more_jobs);
        setExperienceOption(ExperienceOptions[ExperienceLookup[job.experience]]);

        setMetaOptions(data.meta);


        })
      .catch(error => console.error(error));



    //Load other locations for this job
    fetch('/api/cms/job/other-locations/'+id)
      .then(response => response.json())
      .then(data => {

        setOtherLocations(data.jobs);

      })
      .catch(error => console.error(error));

  }, [id]);

  /*
   *
   * Save a new job
   *
   */
  async function save(){

    setError(null);
    setNotice(null);

    if (!role) {
      setError("Please provide a role");
      return;
    }

    if (!company) {
      setError("Please provide a company");
      return;
    }

    if (!location) {
      setError("Please provide a company");
      return;
    }

    if (!typeOption) {
      setError("Please enter either Permanent or Contract");
      return;
    }
    if (!sourceURL) {
      setError("Please enter a source url");
      return;
    }

    if (!remoteOption) {
      setError("Please specify remote or in office");
      return;
    }

    if (!title) {
      setTitle(role)
    }



    const response = await fetch('/api/cms/job', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'role': role,
        'company': company,
        'location': location,
        'meta': metaOptions,
        'id':id,
        'type':typeOption,
        'source_url':sourceURL,
        'rate': rate,
        'title': title,
        'remote': remoteOption,
        'more_jobs': moreJobs,
        'experience': experienceOption
      }),
    });

    console.log(response);


    if (response.status == 200) {
      setNotice('Successfully saved the job.')
    } else {
      setError(`Server responded with ${response.status}`);
    }


  }

  async function remove(){

    const response = await fetch(`/api/cms/job/${id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });


    if (response.status == 200) {
      setNotice('Trashed the job.')
    } else {
      setError(`Server responded with ${response.status}`);
    }


  }


  return(
    <>
      <AlertError error={error} />
      <AlertNotice notice={notice} />
      <div className="flex flex-row">
        <div className="basis-1/3">
          Simplified Job Title
          <small className="text-xs">
            (e.g 'Full Stack Developer')
          </small>
          <div className="w-3/4">
            <input name="myInput" value={role}
                   onChange={(event) => {setRole(event.target.value)}}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>
          </div>
        </div>
        <div className="basis-1/3">
          Company
          <div className="w-3/4">
            <input name="myInput" value={company}
                   onChange={(event) => {setCompany(event.target.value)}}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>

          </div>
        </div>
        <div className="basis-1/3">
          Location
          <div className="w-3/4">
            <input name="myInput" value={location}
                   onChange={(event) => {setLocation(event.target.value)}}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>
          </div>
        </div>
      </div>


      <div className="flex flex-row py-6">

        <div className="basis-1/3">
          Type
          <div className="w-3/4">
            <Select name="colors"
                    options={TypeOptions}
                    className="basic-single-select"
                    classNamePrefix="select"
                    onChange={setTypeOption}
                    value={typeOption}
            />
          </div>
        </div>

        <div className="basis-1/3">
          Remote
          <div className="w-3/4">
            <Select name="colors"
                    options={RemoteOptions}
                    className="basic-single-select"
                    classNamePrefix="select"
                    onChange={setRemoteOption}
                    value={remoteOption}
            />
          </div>
        </div>

        <div className="basis-1/3">
          Rate
          <span className="text-sm">
            (if permanent set salary, if contract set hourly rate)
          </span>

          <div className="w-3/4">
            <input name="myInput" value={rate}
                   onChange={(event) => {setRate(event.target.value)}}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>
          </div>
        </div>
      </div>


      <div className="flex flex-row py-6">
        <div className="basis-1/3">
          Tags
          <div className="w-3/4">
            <Select isMulti
                    name="colors"
                    options={MetaOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={setMetaOptions}
                    value={metaOptions}
                   />
          </div>
        </div>
        <div className="basis-1/3">
          Title
          <span className="text-sm">
            (the full title listed)
          </span>

          <div className="w-3/4">
            <input name="myInput" value={title}
                   onChange={(event) => {setTitle(event.target.value)}}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>
          </div>
        </div>
        <div className="basis-1/3">
          More Jobs
          <span className="text-sm">
            (if lots more very similar jobs then just add the amount here)
          </span>

          <div className="w-3/4">
            <input name="myInput" value={moreJobs}
                   onChange={(event) => {setMoreJobs(event.target.value)}}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>
          </div>
        </div>
      </div>
      <div className="flex flex-row py-6">
        <div className="basis-1/3">
          Experience

          <div className="w-3/4">
            <Select name="colors"
                    options={ExperienceOptions}
                    className="basic-single-select"
                    classNamePrefix="select"
                    onChange={setExperienceOption}
                    value={experienceOption}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row pt-6">
        Source URL
      </div>
      <div className="flex flex-row pb-6">

        <div className="w-full">
          <input name="myInput" value={sourceURL}
                 onChange={(event) => {setSourceURL(event.target.value)}}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"/>
        </div>
      </div>


      <div className="flex flex-row py-6">
        <button onClick={save} className="bg-blue-500 hover:bg-blue-700 text-white mx-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Save Job
        </button>
      </div>



      <div className="flex flex-row py-6">
        Locations:
        {otherLocations.map(loc=>{
          return (
            <Link key={loc.id} to={"/admin/"+loc.id}
                  className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
              {loc.location}, {loc.state ? loc.state: loc.country}
            </Link>
          );
        })}

      </div>

      <button onClick={remove} className="float-right inline-block bg-red-500 hover:bg-red-700 text-white mx-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Delete Job
      </button>



    </>
  )
}