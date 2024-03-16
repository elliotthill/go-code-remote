import {ValueLabelId} from "./form";


export type Job = {
  id: number,
  role: string,
  company: string,
  location: string,
  experience: string,
  created: string,
  updated: string,
  source_url: string,
  type: string,
  rate: string,
  other_locations: number,
  meta: ValueLabelId[],
  company_meta: string[],
  state: string,
  country: string,
  currency: string,
  glassdoor: number,
  indeed: number,
  remote: string,
  days_old: number,
  more_jobs: string[],
  careers_page: string
}
