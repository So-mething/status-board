## Problem
Remote teams struggle to know who is currently available, online, or busy. Traditional tools are often overkill or require manual updates.

## Solution
A minimal web-based status board that shows the current availability of team members for the day.

## How it Works
- A static HTML frontend fetches status data from a Cloudflare Worker API.
- The API reads from a D1 SQLite-based database containing today's status records.
- The database resets daily via the `date` field.
