import {URL, URLSearchParams} from "node:url"
import {create as createJob} from "../services/job.js"
const serialyzURL = process.env.NODE_ENV !== "production" ? "http://127.0.0.1:3001" : "https://serialyz.com"

type serialyz = {
    id: number
    url: string
    status: string
    structure: serialyzItem[]
}

type serialyzItem = {
    link: string
    title: string
    content: string[]
    location?: serialyzLocationItem
}

export type serialyzLocationItem = {
    city?: string
    state?: string
    stateFull?: string
    country?: string
    countryCode: string
}

import test from "../services/test.json" assert {type: "json"}

export const Sync = async (company: string, jobBoardUrl: string) => {
    const apiReq = async (url: string): Promise<serialyz> => {
        return fetch(serialyzApiUrl(url)).then(r => r.json())
    }

    const testingApiReq = async (url: string): Promise<serialyz> => {
        return Promise.resolve({id: 1, url: "x", status: "success", structure: test})
    }

    const serialyzApiUrl = (url: string) => {
        const searchParams = new URLSearchParams({url: url})
        const sUrl = `${serialyzURL}/api/v1/?${searchParams}`
        console.log(sUrl)
        return sUrl
    }

    const shouldWeSync = (job: serialyzItem): boolean => {
        const goodJobTitles = ["engineer", "software", "developer", "front-end", "back-end"]
        const jobTitleLower = job.title.toLowerCase()
        return goodJobTitles.some(s => jobTitleLower.includes(s))
    }

    const trySyncJob = async (job: serialyzItem) => {
        if (!job.location || !job.location.city) return
        let jobTitle = job.title.split(",")[0]
        jobTitle = jobTitle.split("(")[0]
        jobTitle = jobTitle.split("-")[0]

        if (jobTitle == "Engineer") jobTitle = "Software Engineer"

        return createJob(jobTitle.trim(), job.link, job.location, company)
    }

    const response = await apiReq(jobBoardUrl)

    for (const job of response.structure) {
        if (!shouldWeSync(job)) continue

        try {
            await trySyncJob(job)
        } catch (e) {
            console.log(`Error when syncing job ${e}`)
        }
    }
}

export const StartSync = async () => {
    await Sync("Reddit", "https://boards.greenhouse.io/reddit/")
    await Sync("Netflix", "https://jobs.netflix.com/search?q=Engineer")
}

StartSync()
