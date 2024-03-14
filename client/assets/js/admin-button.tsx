
import React from "react";
import {Link} from "react-router-dom";


export default function AdminButton({show, job_id}) {

  if (show) {
    return (
      <Link className="z-10 px-3 py-2 text-md font-medium text-center text-blue-500 float-right"
         to={"admin/"+job_id} rel="noindex nofollow">Edit</Link>
    );
  }
}


export function CreateButton({show}) {

  if (show) {
    return (
      <Link className="fixed top-[-160px] px-3 py-2 text-md font-medium text-center text-white bg-gray-400 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300"
         href={"/admin/"} to={"admin"} rel="noindex nofollow">Add Job</Link>
    );
  }
}