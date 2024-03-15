import React from "react";
import {Tooltip} from 'flowbite-react';
import {remote_anywhere_explanation, remote_domestic_explanation} from '../data/explanation.js';
export default function RemoteLabel({remote, country}){


  if (remote === 'remote') {
    return (
      <>
        <Tooltip content={remote_anywhere_explanation}>
          <span className="cursor-pointer bg-green-400 text-stone-100 text-xs font-medium me-2 px-2 py-0.5 rounded">
            Remote
          </span>
        </Tooltip>
      </>
    )
  } else if (remote === 'remote domestic') {
    return (
      <Tooltip content={remote_domestic_explanation}>
        <span className="bg-green-400 text-stone-100 text-xs font-medium me-2 px-2 py-0.5 rounded">
          Remote {country}
        </span>
      </Tooltip>

    )
  } else if (remote === 'hybrid') {
    return (
      <span className="bg-yellow-400 text-stone-100 text-xs font-medium me-2 px-2 py-0.5 rounded">
        Hybrid
      </span>
    )
  }

}