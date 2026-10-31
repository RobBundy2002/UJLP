import React from 'react';
import { employerIndustryOptions, jobSectorOptions } from '../Data/profileFormOptions';

const optionsWithCurrent = (options, value) => Array.from(new Set([value, ...options].filter(Boolean)));

export default function ProfileEmploymentFields({ jobs, onChange, onAdd, onRemove }) {
    return <div className="alumni-job-list alumni-wide">
        {jobs.map((job, index) => <div className="alumni-job-entry alumni-job-entry-wide" key={index}>
            <label>
                <span>Company / employer</span>
                <input value={job.employer || ''} onChange={event => onChange(index, 'employer', event.target.value)} />
            </label>
            <label>
                <span>Employer Industry</span>
                <select value={job.industry || ''} onChange={event => onChange(index, 'industry', event.target.value)}>
                    <option value="">Select industry</option>
                    {optionsWithCurrent(employerIndustryOptions, job.industry).map(value => <option key={value}>{value}</option>)}
                </select>
            </label>
            <label>
                <span>Job Title</span>
                <input value={job.title || ''} onChange={event => onChange(index, 'title', event.target.value)} />
            </label>
            <label>
                <span>Job Sector</span>
                <select value={job.sector || ''} onChange={event => onChange(index, 'sector', event.target.value)}>
                    <option value="">Select sector</option>
                    {optionsWithCurrent(jobSectorOptions, job.sector).map(value => <option key={value}>{value}</option>)}
                </select>
            </label>
            {jobs.length > 1 && <button type="button" className="alumni-secondary-action alumni-job-remove" onClick={() => onRemove(index)}>Remove job</button>}
        </div>)}
        <button type="button" className="alumni-secondary-action alumni-add-job" onClick={onAdd}>+ Add another job</button>
    </div>;
}
